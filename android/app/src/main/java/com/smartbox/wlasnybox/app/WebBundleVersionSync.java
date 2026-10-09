package com.smartbox.wlasnybox.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * Runs before the WebView loads so stale cached index.html cannot block cache clearing.
 * Uses the same SharedPreferences file as @capacitor/preferences (CapacitorStorage).
 */
public final class WebBundleVersionSync {

    private static final String PREFS_NAME = "CapacitorStorage";
    private static final String NATIVE_BUILD_KEY = "native_build_version";
    private static final String WEB_BUNDLE_KEY = "web_bundle_id";
    private static final String LEGACY_BUNDLE_KEY = "web_bundle_version";
    private static final String CACHE_POLICY_KEY = "webview_cache_policy_version";
    private static final String CURRENT_CACHE_POLICY = "2";
    private static final String WEB_BUNDLE_ASSET = "public/mobile-build-id.txt";

    private WebBundleVersionSync() {}

    /**
     * @return true when caches were cleared and the WebView should reload after bridge init.
     */
    public static boolean syncIfNeeded(Context context) {
        String nativeBuild = getNativeBuildVersion(context);
        String webBundle = readWebBundleId(context);

        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        StoredVersions stored = readStoredVersions(prefs);
        boolean policyCurrent = CURRENT_CACHE_POLICY.equals(
            prefs.getString(CACHE_POLICY_KEY, null)
        );

        boolean versionsMatch =
            stored.nativeBuild != null &&
            stored.webBundle != null &&
            nativeBuild.equals(stored.nativeBuild) &&
            webBundle.equals(stored.webBundle);

        if (versionsMatch && policyCurrent) {
            return false;
        }

        boolean nativeChanged =
            stored.nativeBuild == null || !nativeBuild.equals(stored.nativeBuild);
        boolean webBundleChanged =
            stored.webBundle == null || !webBundle.equals(stored.webBundle);
        boolean needsPolicyMigration = !policyCurrent;
        boolean hasStaleWebViewData =
            stored.nativeBuild == null && hasWebViewData(context);

        boolean cleared = false;

        if (needsPolicyMigration || nativeChanged || hasStaleWebViewData) {
            WebViewCacheHelper.clearAllBeforeWebView(context);
            cleared = true;
        } else if (webBundleChanged) {
            WebViewCacheHelper.clearDiskCaches(context);
            cleared = true;
        }

        saveStoredVersions(prefs, nativeBuild, webBundle);
        prefs.edit().putString(CACHE_POLICY_KEY, CURRENT_CACHE_POLICY).apply();

        return cleared;
    }

    private static boolean hasWebViewData(Context context) {
        File webViewDataDir = new File(context.getDataDir(), "app_webview");
        if (!webViewDataDir.exists()) {
            return false;
        }

        File[] files = webViewDataDir.listFiles();
        return files != null && files.length > 0;
    }

    private static final class StoredVersions {
        final String nativeBuild;
        final String webBundle;

        StoredVersions(String nativeBuild, String webBundle) {
            this.nativeBuild = nativeBuild;
            this.webBundle = webBundle;
        }
    }

    private static StoredVersions readStoredVersions(SharedPreferences prefs) {
        String nativeBuild = prefs.getString(NATIVE_BUILD_KEY, null);
        String webBundle = prefs.getString(WEB_BUNDLE_KEY, null);
        String legacy = prefs.getString(LEGACY_BUNDLE_KEY, null);

        if (nativeBuild != null && webBundle != null) {
            return new StoredVersions(nativeBuild, webBundle);
        }

        if (legacy != null && legacy.contains(":")) {
            String[] parts = legacy.split(":", 2);
            prefs.edit().remove(LEGACY_BUNDLE_KEY).apply();
            return new StoredVersions(parts[0], parts.length > 1 ? parts[1] : null);
        }

        return new StoredVersions(nativeBuild, webBundle);
    }

    private static void saveStoredVersions(
        SharedPreferences prefs,
        String nativeBuild,
        String webBundle
    ) {
        prefs
            .edit()
            .putString(NATIVE_BUILD_KEY, nativeBuild)
            .putString(WEB_BUNDLE_KEY, webBundle)
            .apply();
    }

    private static String getNativeBuildVersion(Context context) {
        try {
            PackageInfo packageInfo = context
                .getPackageManager()
                .getPackageInfo(context.getPackageName(), 0);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                return String.valueOf(packageInfo.getLongVersionCode());
            }

            return String.valueOf(packageInfo.versionCode);
        } catch (PackageManager.NameNotFoundException e) {
            return "0";
        }
    }

    private static String readWebBundleId(Context context) {
        try (
            InputStream inputStream = context.getAssets().open(WEB_BUNDLE_ASSET);
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))
        ) {
            String line = reader.readLine();
            if (line != null && !line.trim().isEmpty()) {
                return line.trim();
            }
        } catch (IOException ignored) {
            // Asset missing in older builds — fall back to release.
        }

        return "release";
    }
}
