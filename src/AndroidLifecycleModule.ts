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
  AppState,
  AppStateEvent,
} from 'react-native';

const NATIVE_MODULE_NAME = 'ReactNativeAppLifecycle';
const ON_START_EVENT = 'ON_START';
const ON_STOP_EVENT = 'ON_STOP';

const CHANGE_EVENT_HANDLERS: EventHandlerType[] = [];

type EventHandlerType = (state: AppStateStatus) => void;
type LifecycleEventType = {
  type: typeof ON_START_EVENT | typeof ON_STOP_EVENT;
};

let currentState: AppStateStatus = AppState.currentState;

const subscribeToEvent = (
  handler: EventHandlerType,
  handlers: EventHandlerType[],
): NativeEventSubscription => {
  handlers.push(handler);

  return {
    remove: () => {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    },
  };
};

const addEventListener = (
  event: AppStateEvent,
  handler: EventHandlerType,
): NativeEventSubscription => {
  if (event === 'change') {
    return subscribeToEvent(handler, CHANGE_EVENT_HANDLERS);
  }
  return AppState.addEventListener(event, handler);
};

const dispatchEvent = (oldState: AppStateStatus, newState: AppStateStatus) => {
  if (oldState === newState) {
    return;
  }
  CHANGE_EVENT_HANDLERS.forEach(handler => handler(newState));
};

const eventEmitter = new NativeEventEmitter(NativeModules[NATIVE_MODULE_NAME]);

eventEmitter.addListener(NATIVE_MODULE_NAME, (event: LifecycleEventType) => {
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
});

const AndroidLifecycleModule = {
  addEventListener,
  get currentState(): AppStateStatus {
    return currentState;
  },
  isAvailable: true,
};

export default AndroidLifecycleModule;
