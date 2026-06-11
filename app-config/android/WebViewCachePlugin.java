package {ANDROID_APP_ID};

import android.webkit.WebView;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WebViewCache")
public class WebViewCachePlugin extends Plugin {

    @PluginMethod
    public void clear(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            WebViewCacheHelper.clearDiskCaches(getContext());
            WebViewCacheHelper.clearWebViewInstance(getBridge().getWebView());
            call.resolve();
        });
    }

    @PluginMethod
    public void clearAll(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            WebViewCacheHelper.clearAllBeforeWebView(getContext());
            WebViewCacheHelper.clearWebViewInstance(getBridge().getWebView());
            call.resolve();
        });
    }
}
