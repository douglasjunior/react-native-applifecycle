# React Native Lifecycle

[![License MIT](https://img.shields.io/badge/licence-MIT-blue.svg)](https://github.com/douglasjunior/react-native-applifecycle/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-native-applifecycle.svg)](https://www.npmjs.com/package/react-native-applifecycle)
[![npm downloads](https://img.shields.io/npm/dt/react-native-applifecycle.svg)](https://www.npmjs.com/package/react-native-applifecycle?activeTab=versions)

⚛ Provides functionality to determine whether the app is in the foreground or background and notifies you when the state changes.

It implements the [Lifecycle](https://developer.android.com/jetpack/androidx/releases/lifecycle?hl=pt-br) for **Android** and falls back to the [AppState](https://archive.reactnative.dev/docs/appstate) for **iOS**.

## Why Use This?

The original [AppState](https://archive.reactnative.dev/docs/appstate) API provided by React Native behaves differently between Android and iOS, particularly regarding the `background` state:

- On iOS, the `background` state signifies that the entire app is in the background.
- On Android, the `background` state indicates that the React Native Activity is in the background, which might not necessarily mean the entire app is in the background.

By using `react-native-applifecycle`, you can handle these differences seamlessly across both platforms.

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

TODO: write usage

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
