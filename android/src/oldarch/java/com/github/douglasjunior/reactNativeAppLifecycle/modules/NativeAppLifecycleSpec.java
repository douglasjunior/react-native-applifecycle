package com.github.douglasjunior.reactNativeAppLifecycle.modules;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

// Mirrors the codegen contract without depending on TurboModule APIs on the legacy bridge.
public abstract class NativeAppLifecycleSpec extends ReactContextBaseJavaModule {
    protected NativeAppLifecycleSpec(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    public abstract void addListener(String eventName);

    public abstract void removeListeners(double count);
}
