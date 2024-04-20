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

import {AppState, AppStateStatus, Platform} from 'react-native';

import AndroidLifecycleModule from './AndroidLifecycleModule';

const AppLifecycle = {
  /**
   * [Android Only] Initializes the native module and starts listening to the app lifecycle events.
   *
   * Should be called once when your app starts.
   */
  init: Platform.OS === 'android' ? AndroidLifecycleModule.init : () => {},
  /**
   * [Android Only] Stops listening to the app lifecycle events.
   *
   * Should be called when your app is about to be destroyed.
   */
  destroy:
    Platform.OS === 'android' ? AndroidLifecycleModule.destroy : () => {},
  /**
   * Adds an event listener to the app lifecycle events.
   */
  addEventListener:
    Platform.OS === 'android'
      ? AndroidLifecycleModule.addEventListener
      : AppState.addEventListener,
  /**
   * Returns the current app state.
   */
  get currentState(): AppStateStatus {
    return Platform.OS === 'android'
      ? AndroidLifecycleModule.currentState
      : AppState.currentState;
  },
  /**
   * Returns whether the app lifecycle module is available on the current platform.
   */
  get isAvailable(): boolean {
    return Platform.OS === 'android'
      ? AndroidLifecycleModule.isAvailable
      : AppState.isAvailable;
  },
};

export default AppLifecycle;
