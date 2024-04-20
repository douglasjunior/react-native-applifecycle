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

import {
  AppStateStatus,
  NativeEventSubscription,
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';

const NATIVE_MODULE_NAME = 'ReactNativeAppLifecycle';
const ON_START_EVENT = 'ON_START';
const ON_STOP_EVENT = 'ON_STOP';

const EVENT_HANDLERS: EventHandlerType[] = [];

type EventHandlerType = (state: AppStateStatus) => void;
type LifecycleEventType = {
  type: typeof ON_START_EVENT | typeof ON_STOP_EVENT;
};

let currentState: AppStateStatus = 'background';

const addEventListener = (
  event: 'change',
  handler: EventHandlerType,
): NativeEventSubscription => {
  if (event !== 'change') {
    return {remove: () => {}};
  }
  EVENT_HANDLERS.push(handler);

  return {
    remove: () => {
      const index = EVENT_HANDLERS.indexOf(handler);
      if (index !== -1) {
        EVENT_HANDLERS.splice(index, 1);
      }
    },
  };
};

let nativeEvent: EmitterSubscription | undefined;
let eventEmitter: NativeEventEmitter | undefined;

const dispatchEvent = (oldState: AppStateStatus, newState: AppStateStatus) => {
  if (oldState === newState) {
    return;
  }

  EVENT_HANDLERS.forEach(handler => handler(newState));
};

const init = () => {
  if (!eventEmitter) {
    eventEmitter = new NativeEventEmitter(NativeModules[NATIVE_MODULE_NAME]);
  }
  if (!nativeEvent) {
    nativeEvent = eventEmitter.addListener(
      NATIVE_MODULE_NAME,
      (event: LifecycleEventType) => {
        const oldState = currentState;
        switch (event.type) {
          case ON_START_EVENT:
            currentState = 'active';
            break;
          case ON_STOP_EVENT:
            currentState = 'background';
            break;
          default:
            currentState = 'unknown';
        }
        dispatchEvent(oldState, currentState);
      },
    );
  }
  NativeModules[NATIVE_MODULE_NAME].init();
};

const destroy = () => {
  if (nativeEvent) {
    if ((eventEmitter as any)?.removeSubscription) {
      // fallback compatibility with RN <= 0.72.X
      (eventEmitter as any)?.removeSubscription?.(nativeEvent);
    } else if (nativeEvent?.remove) {
      // RN >= 0.73.X
      nativeEvent.remove();
    }
    nativeEvent = undefined;
  }
  NativeModules[NATIVE_MODULE_NAME].destroy();
};

const AndroidLifecycleModule = {
  addEventListener,
  get currentState(): AppStateStatus {
    return currentState;
  },
  isAvailable: true,
  init,
  destroy,
};

export default AndroidLifecycleModule;
