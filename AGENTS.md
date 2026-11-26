# AGENTS.md

`react-native-applifecycle` is a React Native library (Android + iOS) that enhances the reliability of managing app lifecycles by using AndroidX `ProcessLifecycleOwner` on Android and delegating directly to React Native's built-in `AppState` on iOS. Public API: `AppLifecycle` (`addEventListener`, `currentState`, `isAvailable`), `useAppLifecycle()`, plus a Jest mock at `jest/AppLifecycleMock.js`. On Android it is a TurboModule (New Architecture) with an old-architecture fallback; iOS requires no native module or CocoaPods integration. Usage, state tables, and limitations live in `README.md`; do not duplicate them here.

## Prerequisites

- Node >= 22.11 (`engines`), Yarn **1.x** (both lockfiles are `yarn.lock` v1).
- **Yarn 1 only:** both `package.json` files pin `"packageManager": "yarn@1.22.22"`, so Corepack selects Yarn 1 automatically. Check `yarn -v` prints `1.22.22` before installing; a Yarn 4 install silently migrates `yarn.lock` to Berry/PnP. Revert any unintended `yarn.lock` / `.pnp.cjs` / `.yarnrc.yml` / `.yarn/` changes.
- iOS (Sample): Ruby >= 2.6.10 (see `Sample/Gemfile`; works on 3.4), Bundler, CocoaPods >= 1.13 (not 1.15.0/1.15.1), Xcode.
- Android (Sample): JDK 17+ and Android SDK (library `minSdkVersion` default 24, `compileSdk` default 35; Sample uses compileSdk 37, Gradle 9.4.1). `android/build.gradle` includes an AGP 9 built-in Kotlin guard.
- `peerDependencies.react-native` is `>=0.80` (matching the TurboModule/Codegen setup and `BaseReactPackage` usage).

## Commands

Run from the repo root unless noted.

```sh
yarn install                       # root deps (Yarn 1)
node_modules/.bin/tsc              # build to dist/ (same as `yarn build`); delete dist/ afterwards, never commit it
node_modules/.bin/tsc --noEmit     # typecheck only
node_modules/.bin/eslint src       # lint library (config: @react-native)

cd Sample
yarn install                       # Sample deps; installs the lib as a COPY from ../
node_modules/.bin/tsc --noEmit
node_modules/.bin/eslint .
node_modules/.bin/jest             # __tests__/App.test.tsx
yarn start                         # Metro
yarn android                       # builds Android (native build, slow)
bundle install && cd ios && bundle exec pod install && cd ..   # iOS pods
yarn ios
```

There are no unit tests for the library or the native code; native behavior is verified by running the Sample on a device/simulator following the checklist in `Sample/README.md` (foreground launch, `SecondActivity` via `sampleapp://second`, Home/resume, and Headless JS `BackgroundServiceExample` from killed state / Issue #1). The Sample has New Architecture on (`newArchEnabled=true` in `Sample/android/gradle.properties`, `ENV['RCT_NEW_ARCH_ENABLED'] = '1'` in `Sample/ios/Podfile`; note that RN 0.82+ forces `newArchEnabled=true` in Gradle).

## Repository map

- `src/index.ts`: public entry point, re-exporting `AppLifecycle` and `useAppLifecycle`.
- `src/AppLifecycle.ts`: platform router (`Platform.OS === 'android'` delegates to `AndroidLifecycleModule`, all other platforms delegate to `AppState`).
- `src/AndroidLifecycleModule.ts`: subscribes to native `ReactNativeAppLifecycle` events via `NativeEventEmitter`, maps `ON_START` -> `'active'`, `ON_STOP` -> `'background'`, unknown -> `'unknown'`, deduplicates unchanged states, delegates non-`'change'` events (`memoryWarning`, `focus`, `blur`) to `AppState`.
- `src/useAppLifecycle.ts`: React hook returning `AppStateStatus` subscribed to `AppLifecycle.addEventListener('change', ...)`.
- `src/specs/NativeReactNativeAppLifecycle.ts`: TurboModule spec (`addListener`, `removeListeners`); codegen input (`package.json#codegenConfig`: name `rnapplifecycle_codegen`, Android package `com.github.douglasjunior.reactNativeAppLifecycle`).
- `jest/AppLifecycleMock.js`: Jest mock delegating to `AppState`.
- `android/src/main/java/com/github/douglasjunior/reactNativeAppLifecycle/`: `AppLifecycleImpl.java` (`ProcessLifecycleOwner` + `DefaultLifecycleObserver`, emits `ON_START`/`ON_STOP` via `RCTDeviceEventEmitter`), `AppLifecyclePackage.java` (`BaseReactPackage`).
- `android/src/newarch/.../modules/` and `android/src/oldarch/.../modules/`: two `AppLifecycleModule.java` implementations; `android/build.gradle` selects one depending on `newArchEnabled`.
- `Sample/`: RN 0.88.1 demo app (`App.tsx`, `SecondActivity.java`, `BackgroundServiceExample.java`, `NetworkService.tsx`), consumes the lib via `"react-native-applifecycle": "file:../"`.
- `.github/workflows/publish.yml`: release automation. `.github/workflows/commit-authors.yml`: PR commit author check. `docs/`, `DEPENDENTS.md`: README assets; leave alone.

## Event flow & invariants (do not break)

- On Android, `AppLifecycleImpl` observes `ProcessLifecycleOwner.get().getLifecycle()` on the UI queue thread during `initialize()` and removes the observer during `invalidate()`.
- `onStart` emits `{ type: 'ON_START' }` -> JS `'active'`; `onStop` emits `{ type: 'ON_STOP' }` -> JS `'background'`. Unchanged state transitions are ignored (`oldState === newState`).
- Initial `currentState` on Android is `AppState.currentState`; `isAvailable` is `currentState !== 'unknown'`.
- Non-`'change'` events on Android delegate to `AppState.addEventListener(event, handler)`.
- On iOS (and other non-Android platforms), `AppLifecycle` delegates directly to `AppState` without requiring native code.
- `package.json` keeps `main` and `react-native` pointing to `src`, and `.npmignore` must NOT ignore `src/` so `src/specs/NativeReactNativeAppLifecycle.ts` is included in the published package for RN Codegen.
- Keep the AGP 9 built-in Kotlin guard (`if (project.extensions.findByName('kotlin') == null)`) in `android/build.gradle`.
- Keep `jest/AppLifecycleMock.js` compatible with `AppLifecycle`.

## Recipes

Change the TurboModule spec (`NativeReactNativeAppLifecycle.ts`):
1. Needs human approval (public/native contract). Edit `src/specs/NativeReactNativeAppLifecycle.ts`.
2. Update `AppLifecycleImpl.java` and both arch variants on Android (`src/newarch` and `src/oldarch` `AppLifecycleModule.java`).
3. Re-run codegen by building `Sample/android`.

Test a library change in the Sample:
- The Sample installs the lib as a copy, so edits to `src/` or `android/` are not picked up automatically. From `Sample/`, run `./install.sh` (wipes `node_modules`, `ios/Pods`, and root `node_modules`, reinstalls, strips the nested `Sample/` and `.git` from the copy, runs `npx -y pod-install`), then restart Metro with `yarn start --reset-cache`. `install.sh` uses `yarn`, so confirm Yarn 1 first.

## Boundaries

Ask a human before:
- changing the public API, event names, state mapping, or native module name (`ReactNativeAppLifecycle`);
- bumping `peerDependencies`, `engines`, minimum Android SDK versions, or RN/React/TypeScript major versions;
- touching `.github/workflows/publish.yml` or anything about releasing.

Never:
- publish manually (`npm publish`, `yarn publish`) or restore `scripts/publish.js` (removed). Publishing is automatic: a GitHub Release with a semver tag (`1.2.3` or `v1.2.3`) triggers `.github/workflows/publish.yml`, which runs `yarn install --frozen-lockfile` and `yarn build`, sets `main`/`types` to `dist` only in the workflow workspace, publishes via npm Trusted Publishing (OIDC), uses dist-tag `next` for pre-releases, and the release bot commits `chore(release): <version> [skip ci]` back to the default branch.
- edit `version` in `package.json` or point `main`/`types` to `dist` in the repo; the workflow owns both;
- commit `dist/` (gitignored), `ios/Pods`, `vendor/bundle`, or Yarn Berry artifacts;
- edit generated/lock files by hand (`yarn.lock`, `Podfile.lock`) or run `yarn install` with Yarn 4;
- add dependencies to `dependencies` (the lib has none; keep it that way);
- run Android emulators or iOS simulators headless (`-no-window` or `xcrun simctl boot` without opening the UI) unless the user explicitly asks; always open the visible emulator/simulator window (e.g., windowed `emulator` on Android and Xcode `DeviceHub.app` / `Simulator.app` on iOS).

## Conventions

- Language: English everywhere (code, comments, commits, docs).
- Commits: Conventional Commits: `feat(android): ...`, `fix(ios): ...`, `fix: ...`, `docs: ...`, `chore(deps): ...`. The release bot owns `chore(release)`.
- Formatting: Prettier 2.8.8 (`.prettierrc.js`: single quotes, no bracket spacing, trailing commas `all`, `arrowParens: 'avoid'`); ESLint `@react-native`. Fix lint on files you touch; do not reformat unrelated lines.
- License: every `.ts`, `.java` file in `src/` and `android/` starts with the MIT header (Douglas Nassif Roma Junior). Copy it from an existing file into new files.
- Java source level is 1.8; keep Android code compatible with `minSdk` 24.

## Definition of done

- [ ] `node_modules/.bin/tsc` and `node_modules/.bin/eslint src` pass at the root; `dist/` removed.
- [ ] In `Sample/`: `node_modules/.bin/tsc --noEmit`, `node_modules/.bin/eslint .` and `node_modules/.bin/jest` pass (only after reinstalling the lib copy if `src/` changed).
- [ ] If native or spec code changed: Sample built and exercised on Android (`SecondActivity` stays `active`, home/app switch emits `background`) and iOS.
- [ ] `README.md` updated for any public change.
- [ ] `git status` shows no `dist/`, no `yarn.lock` churn from Yarn 4, no version edits.
- [ ] Commit message follows Conventional Commits.
