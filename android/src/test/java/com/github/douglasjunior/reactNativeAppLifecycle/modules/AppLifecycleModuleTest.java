package com.github.douglasjunior.reactNativeAppLifecycle.modules;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.ProcessLifecycleOwner;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;
import com.github.douglasjunior.reactNativeAppLifecycle.AppLifecyclePackage;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.mockito.MockedStatic;

public class AppLifecycleModuleTest {
    private ReactApplicationContext context;
    private AppLifecycleModule module;
    private List<Runnable> uiTasks;

    @Before
    public void setUp() {
        context = mock(ReactApplicationContext.class);
        uiTasks = new ArrayList<>();
        doAnswer(invocation -> {
            uiTasks.add(invocation.getArgument(0));
            return null;
        }).when(context).runOnUiQueueThread(any(Runnable.class));
        module = new AppLifecycleModule(context);
    }

    @Test
    public void registersAndRemovesTheProcessObserverOnTheUiThread() {
        ProcessLifecycleOwner owner = mock(ProcessLifecycleOwner.class);
        Lifecycle lifecycle = mock(Lifecycle.class);
        when(owner.getLifecycle()).thenReturn(lifecycle);
        try (MockedStatic<ProcessLifecycleOwner> process = mockStatic(ProcessLifecycleOwner.class)) {
            process.when(ProcessLifecycleOwner::get).thenReturn(owner);
            module.initialize();
            verifyNoInteractions(lifecycle);
            uiTasks.remove(0).run();
            verify(lifecycle).addObserver(module);
            module.invalidate();
            verify(lifecycle, never()).removeObserver(module);
            uiTasks.remove(0).run();
            verify(lifecycle).removeObserver(module);
        }
    }

    @Test
    public void invalidationBeforeInitializationRunsCannotLeaveAnObserverBehind() {
        ProcessLifecycleOwner owner = mock(ProcessLifecycleOwner.class);
        Lifecycle lifecycle = mock(Lifecycle.class);
        when(owner.getLifecycle()).thenReturn(lifecycle);
        try (MockedStatic<ProcessLifecycleOwner> process = mockStatic(ProcessLifecycleOwner.class)) {
            process.when(ProcessLifecycleOwner::get).thenReturn(owner);
            module.initialize();
            module.invalidate();
            uiTasks.forEach(Runnable::run);
            verify(lifecycle, never()).addObserver(module);
            verify(lifecycle).removeObserver(module);
        }
    }

    @Test
    public void emitsExistingEventNamesAndStopsAfterInvalidation() {
        WritableMap payload = mock(WritableMap.class);
        DeviceEventManagerModule.RCTDeviceEventEmitter emitter =
                mock(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        when(context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)).thenReturn(emitter);
        try (MockedStatic<Arguments> arguments = mockStatic(Arguments.class)) {
            arguments.when(Arguments::createMap).thenReturn(payload);
            LifecycleOwner owner = mock(LifecycleOwner.class);
            module.onStart(owner);
            verify(payload).putString("type", "ON_START");
            module.onStop(owner);
            verify(payload).putString("type", "ON_STOP");
            verify(emitter, times(2)).emit("ReactNativeAppLifecycle", payload);
            module.invalidate();
            module.onStart(owner);
            module.onStop(owner);
            verifyNoMoreInteractions(emitter);
        }
    }

    @Test
    public void packageRegistersTheModuleWithMatchingArchitectureMetadata() {
        AppLifecyclePackage reactPackage = new AppLifecyclePackage();
        assertNull(reactPackage.getModule("OtherModule", context));
        assertTrue(reactPackage.getModule("ReactNativeAppLifecycle", context) instanceof AppLifecycleModule);
        assertEquals("ReactNativeAppLifecycle", module.getName());
        assertEquals(
                module instanceof TurboModule,
                reactPackage.getReactModuleInfoProvider().getReactModuleInfos()
                        .get(module.getName()).isTurboModule()
        );
    }
}
