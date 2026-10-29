import React from 'react';
import renderer, {act} from 'react-test-renderer';

describe.each(['legacy', 'turbo'] as const)(
  '%s Android module',
  architecture => {
    let AppLifecycle: typeof import('../src').AppLifecycle;
    let useAppLifecycle: typeof import('../src').useAppLifecycle;
    let nativeModule: {addListener: jest.Mock; removeListeners: jest.Mock};
    let turboProxy: jest.Mock;
    let emit: (type: string) => void;
    let appState: typeof import('react-native').AppState;

    beforeEach(() => {
      jest.resetModules();
      // Keep hooks and the renderer on the same React instance after resetting RN's registry.
      jest.doMock('react', () => React);
      nativeModule = {addListener: jest.fn(), removeListeners: jest.fn()};
      turboProxy = jest.fn(name =>
        name === 'ReactNativeAppLifecycle'
          ? nativeModule
          : require('react-native/Libraries/BatchedBridge/NativeModules')[name],
      );
      Object.assign(global, {
        RN$Bridgeless: architecture === 'turbo',
        __turboModuleProxy: turboProxy,
      });
      const rn = require('react-native');
      rn.Platform.OS = 'android';
      appState = rn.AppState;
      appState.currentState = 'active';
      rn.NativeModules.ReactNativeAppLifecycle =
        architecture === 'legacy' ? nativeModule : undefined;
      const deviceEmitter =
        require('react-native/Libraries/EventEmitter/RCTDeviceEventEmitter').default;
      emit = type => deviceEmitter.emit('ReactNativeAppLifecycle', {type});
      ({AppLifecycle, useAppLifecycle} = require('../src'));
    });

    afterEach(() => {
      jest.restoreAllMocks();
      Reflect.deleteProperty(global, '__turboModuleProxy');
      Reflect.deleteProperty(global, 'RN$Bridgeless');
    });

    it('loads the native module and dispatches process transitions once', () => {
      const listener = jest.fn();
      const subscription = AppLifecycle.addEventListener('change', listener);
      expect(nativeModule.addListener).toHaveBeenCalledWith(
        'ReactNativeAppLifecycle',
      );
      if (architecture === 'turbo') {
        expect(turboProxy).toHaveBeenCalledWith('ReactNativeAppLifecycle');
      } else {
        expect(turboProxy).not.toHaveBeenCalledWith('ReactNativeAppLifecycle');
      }
      expect(AppLifecycle.currentState).toBe('active');
      expect(AppLifecycle.isAvailable).toBe(true);
      emit('ON_START');
      emit('ON_STOP');
      emit('ON_STOP');
      emit('ON_START');
      expect(listener.mock.calls).toEqual([['background'], ['active']]);
      subscription.remove();
      subscription.remove();
      emit('ON_STOP');
      expect(listener).toHaveBeenCalledTimes(2);
      expect(AppLifecycle.currentState).toBe('background');
    });

    it('forwards focus and blur subscriptions to AppState', () => {
      const subscription = {remove: jest.fn()};
      const addListener = jest
        .spyOn(appState, 'addEventListener')
        .mockReturnValue(subscription);
      const listener = jest.fn();
      expect(AppLifecycle.addEventListener('blur', listener)).toBe(
        subscription,
      );
      expect(addListener).toHaveBeenCalledWith('blur', listener);
    });

    it('updates the hook and removes its listener when unmounted', () => {
      const states: string[] = [];
      function Consumer() {
        states.push(useAppLifecycle());
        return null;
      }
      let tree: renderer.ReactTestRenderer;
      act(() => {
        tree = renderer.create(<Consumer />);
      });
      act(() => emit('ON_STOP'));
      act(() => emit('ON_START'));
      act(() => tree.unmount());
      act(() => emit('ON_STOP'));
      expect(states).toEqual(['active', 'background', 'active']);
    });
  },
);

it('uses AppState on iOS without loading the Android module', () => {
  jest.resetModules();
  const rn = require('react-native');
  rn.Platform.OS = 'ios';
  const getNativeModule = jest.spyOn(rn.TurboModuleRegistry, 'getEnforcing');
  rn.AppState.currentState = 'inactive';
  const addListener = jest.spyOn(rn.AppState, 'addEventListener');
  const {AppLifecycle} = require('../src');
  const handler = jest.fn();
  AppLifecycle.addEventListener('change', handler);
  expect(AppLifecycle.currentState).toBe('inactive');
  expect(AppLifecycle.isAvailable).toBe(rn.AppState.isAvailable);
  expect(addListener).toHaveBeenCalledWith('change', handler);
  expect(getNativeModule).not.toHaveBeenCalled();
  jest.restoreAllMocks();
});
