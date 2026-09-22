package com.smartbox.aplikacja.app;

import android.content.Context;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import android.webkit.WebStorage;
import android.webkit.WebView;
import java.io.File;

public final class WebViewCacheHelper {

    private WebViewCacheHelper() {}

    /** Clears on-disk caches before the WebView is created (safe when index.html may be cached). */
    public static void clearDiskCaches(Context context) {
        clearAppCacheDirs(context);
        clearWebViewStorageDir(context);
    }

    /** Full clear before WebView load: disk caches + cookies + web storage. */
    public static void clearAllBeforeWebView(Context context) {
        clearDiskCaches(context);
        clearWebStorageAndCookies();
    }

    public static void clearWebViewInstance(WebView webView) {
        if (webView == null) {
            return;
        }

        webView.clearCache(true);
        webView.clearHistory();
        webView.clearFormData();
        webView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
    }

    private static void clearWebStorageAndCookies() {
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.removeAllCookies(null);
        cookieManager.flush();
        WebStorage.getInstance().deleteAllData();
    }

    private static void clearAppCacheDirs(Context context) {
        deleteDirContents(context.getCacheDir());

        File codeCacheDir = context.getCodeCacheDir();
        if (codeCacheDir != null) {
            deleteDirContents(codeCacheDir);
        }
    }

    private static void clearWebViewStorageDir(Context context) {
        File webViewDataDir = new File(context.getDataDir(), "app_webview");
        deleteDirContents(webViewDataDir);
    }

    private static void deleteDirContents(File dir) {
        if (dir == null || !dir.exists()) {
            return;
        }

        File[] files = dir.listFiles();
        if (files == null) {
            return;
        }

        for (File file : files) {
            if (file.isDirectory()) {
                deleteDirContents(file);
                file.delete();
            } else {
                file.delete();
            }
        }
    }
}
