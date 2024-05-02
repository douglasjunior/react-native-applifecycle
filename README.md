# React-Native App Lifecycle

[![License MIT](https://img.shields.io/badge/licence-MIT-blue.svg)](https://github.com/douglasjunior/react-native-applifecycle/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-native-applifecycle.svg)](https://www.npmjs.com/package/react-native-applifecycle)
[![npm downloads](https://img.shields.io/npm/dt/react-native-applifecycle.svg)](https://www.npmjs.com/package/react-native-applifecycle?activeTab=versions)

⚛ Enhances the reliability of managing app lifecycles across iOS and Android platforms, ensuring consistent behavior regarding `foreground` and `background` states.

It implements the [Lifecycle](https://developer.android.com/jetpack/androidx/releases/lifecycle) for **Android** and falls back to the [AppState](https://reactnative.dev/docs/appstate) for **iOS**.

## Why Use This?

The original [AppState](https://reactnative.dev/docs/appstate) API provided by React Native behaves differently between Android and iOS, particularly regarding the `background` state:

- On iOS, the `background` state signifies that the entire app is in the background.
- On Android, the `background` state indicates that the React Native Activity is in the background, which might not necessarily mean the entire app is in the background.

By using `react-native-applifecycle`, you can handle these differences seamlessly across both platforms, ensuring that the state `background` will be dispatched only when the entire app is in background.

## Install

Install dependency package
```bash
yarn add react-native-applifecycle
```
Or
```bash
npm i -S react-native-applifecycle
```

## Usage

The App Lifecycle API is compatible with the original [AppState](https://reactnative.dev/docs/appstate).

### Subscribing to the `change` listener:

```tsx
import {AppLifecycle} from 'react-native-applifecycle';

const App = () => {

  useEffect(() => {
    const listener = AppLifecycle.addEventListener('change', state => {
      // do something
    });

    return () => listener.remove();
  }, []);

  return <View />;
}

export default App;
```

### Getting the current state with `hook`:

```tsx
import {useAppLifecycle} from 'react-native-applifecycle';

const App = () => {
  const currentLifecycle = useAppLifecycle();

  // do something

  return <View />;
}

export default App;
```

For more details, see the [Sample Project](https://github.com/douglasjunior/react-native-applifecycle/blob/main/Sample/App.tsx).

## Lifecycle States

- `active` - The app is running in the foreground
- `background` - The app is running in the background. The user is either:
    - in another app
    - on the home screen
- [iOS] `inactive` - This is a state that occurs when transitioning between foreground & background, and during periods of inactivity such as entering the multitasking view, opening the Notification Center or in the event of an incoming call.

For more information, see [React Native documentation](https://reactnative.dev/docs/appstate#app-states).

## Events

### `change`
    
This event is received when the app state has changed. The listener is called with one of the current app state values.

### `memoryWarning`, `focus`, `blur`, etc

Falls back to [AppState](https://reactnative.dev/docs/appstate#events)

## Methods

### `addEventListener()`

```ts
static addEventListener(
  type: AppStateEvent,
  listener: (state: AppStateStatus) => void,
): NativeEventSubscription;
```

Sets up a function that will be called whenever the specified event type on Lifecycle occurs. Valid values for `eventType` are listed above. Returns the `EventSubscription`.

## Properties

### `currentState`

```ts
static currentState: AppStateStatus;
```

## Jest mock

```js
jest.mock('react-native-applifecycle/dist/AppLifecycle', () => require('react-native-applifecycle/jest/AppLifecycleMock'));
```

## Contribute

New features, bug fixes and improvements are welcome! For questions and suggestions use the [issues](https://github.com/douglasjunior/react-native-applifecycle/issues).

<a href="https://www.patreon.com/douglasjunior"><img src="http://i.imgur.com/xEO164Z.png" alt="Become a Patron!" width="200" /></a>
[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://paypal.me/douglasnassif)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=douglasjunior/react-native-applifecycle&type=Date)](https://star-history.com/#douglasjunior/react-native-applifecycle)

## License

```
The MIT License (MIT)

Copyright (c) 2024 Douglas Nassif Roma Junior
```

See the full [license file](https://github.com/douglasjunior/react-native-applifecycle/blob/master/LICENSE).
