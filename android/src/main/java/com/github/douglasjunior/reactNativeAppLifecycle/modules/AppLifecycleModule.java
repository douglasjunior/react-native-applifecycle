// MIT License

// Copyright (c) 2024 Douglas Nassif Roma Junior

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
    private final ReactApplicationContext reactApplicationContext;

    public AppLifecycleModule(ReactApplicationContext reactApplicationContext) {
        this.reactApplicationContext = reactApplicationContext;
    }

    @Override
    public void initialize() {
        reactApplicationContext.runOnUiQueueThread(() -> ProcessLifecycleOwner
                .get()
                .getLifecycle()
                .addObserver(AppLifecycleModule.this));
    }

    @Override
    public void invalidate() {
        reactApplicationContext.runOnUiQueueThread(() -> ProcessLifecycleOwner
                .get()
                .getLifecycle()
                .removeObserver(AppLifecycleModule.this));
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
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
        reactApplicationContext
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
