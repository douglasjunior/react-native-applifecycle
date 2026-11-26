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

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.github.douglasjunior.reactNativeAppLifecycle.AppLifecycleImpl;

public class AppLifecycleModule extends ReactContextBaseJavaModule {
    private final AppLifecycleImpl impl;

    public AppLifecycleModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        impl = new AppLifecycleImpl(reactApplicationContext);
    }

    @Override
    public void initialize() {
        super.initialize();
        impl.initialize();
    }

    @Override
    public void invalidate() {
        impl.invalidate();
        super.invalidate();
    }

    @NonNull
    @Override
    public String getName() {
        return AppLifecycleImpl.MODULE_NAME;
    }

    @ReactMethod
    public void addListener(String eventName) {
        impl.addListener(eventName);
    }

    @ReactMethod
    public void removeListeners(double count) {
        impl.removeListeners(count);
    }
}
