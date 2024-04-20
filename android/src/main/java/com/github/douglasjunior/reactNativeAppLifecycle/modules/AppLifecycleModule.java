package com.github.douglasjunior.reactNativeAppLifecycle.modules;

import androidx.annotation.NonNull;
import androidx.lifecycle.DefaultLifecycleObserver;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.ProcessLifecycleOwner;

import com.facebook.react.bridge.BaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class AppLifecycleModule extends BaseJavaModule implements DefaultLifecycleObserver {

    private static final String MODULE_NAME = "ReactNativeAppLifecycle";
    private static final String ON_START_EVENT = "ON_START";
    private static final String ON_STOP_EVENT = "ON_STOP";

    public AppLifecycleModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void init() {
        getReactApplicationContext().getCurrentActivity().runOnUiThread(() ->
                ProcessLifecycleOwner.get().getLifecycle().addObserver(AppLifecycleModule.this));
    }

    @ReactMethod
    public void destroy() {
        getReactApplicationContext().getCurrentActivity().runOnUiThread(() ->
                ProcessLifecycleOwner.get().getLifecycle().removeObserver(AppLifecycleModule.this));
    }

    @Override
    public void onCreate(@NonNull LifecycleOwner owner) {
    }

    @Override
    public void onDestroy(@NonNull LifecycleOwner owner) {
    }

    @Override
    public void onPause(@NonNull LifecycleOwner owner) {
    }

    @Override
    public void onResume(@NonNull LifecycleOwner owner) {
    }

    @Override
    public void onStart(@NonNull LifecycleOwner owner) {
        sendEvent(ON_START_EVENT);
    }

    @Override
    public void onStop(@NonNull LifecycleOwner owner) {
        sendEvent(ON_STOP_EVENT);
    }

    private void sendEvent(String type) {
        WritableMap params = new WritableNativeMap();
        params.putString("type", type);
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(MODULE_NAME, params);
    }

    @ReactMethod
    public void addListener(String eventName) {
        /* Required for RN built-in Event Emitter Calls. */
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        /* Required for RN built-in Event Emitter Calls. */
    }
}
