# OneForAll

Shared source code used by multiple Expo apps.

This folder contains reusable logic, components, utilities, hooks, navigation abstractions, and shared UI that are consumed by the apps via Metro external folder configuration.

It is **not a standalone app** and must not be run independently.

---

# Folder Structure Requirement

All consuming apps **must be sibling folders** of `./OneForAll`.

Example:

```
Dev/
  OneForAll/
  AppA/
  AppB/
```

This structure is required because:

* Metro configuration depends on `../OneForAll`
* TypeScript paths mapping assumes sibling layout
* Shared build templates reference relative paths

---

# Setup

From inside `OneForAll/`, run:

```
install.bat
```

This installs `node_modules` used **only for VS Code and TypeScript type resolution**.

You do **not** run expo from this folder.

## Important: About node_modules

The `node_modules` folder inside `OneForAll/` exists only for:

* VS Code IntelliSense
* TypeScript type checking

It is **not used at runtime**.

Metro always resolves dependencies from the consuming app's `node_modules`.

---

# How Apps Consume OneForAll

Each app:

* Uses Metro watchFolders to include `../OneForAll/src`
* Uses TypeScript path mapping (`@shared/*`)
* Imports shared code directly

Example import:

```ts
import { AdsProvider } from "@shared/Hooks/UseAds";
```

---

# Consumer App Tutorial

## Basic starter app

Setup a new React Native Expo project as a sibling to `OneForAll/` like so:

```
./
  OneForAll/
  MyApp/
```

Run the setup command:
```
npx create-expo-app@latest MyAppName --template blank-typescript
```

Then install the following dependencies:

```
npx expo install @expo/vector-icons @react-navigation/bottom-tabs @react-navigation/native @react-navigation/native-stack babel-preset-expo dotenv expo-build-properties expo-crypto expo-navigation-bar expo-status-bar lodash react-native-gesture-handler react-native-get-random-values react-native-keyboard-controller react-native-paper react-native-reanimated react-native-screens react-native-worklets uuid
```

As well as dev dependencies:

```
npm install -D @babel/core @types/react typescript
```

Copy and replace everything from `OneForAll/templates/copy` to your app project root.

Replace ```__APP_NAME__```, ```__APP_SLUG__``` and ```__APP_PACKAGE__``` in the **app.config.js**, refer to the existing **app.json** as needed.

Then delete **app.json**.

Delete **app.tsx** and **index.ts** in your app project root.

Copy over from `OneForAll/templates/starter code` to your app project root.

Create a **.env** file if needed.

Assuming an Android device is connected, run the dev script that will build the app and run hot reloading:

```
run-android-dev.bat
```

Subsequently just run the same script again to launch the app on your device.

If you have new dependencies installed, run the full rebuild script that rebuilds the app on your device:

```
run-android-dev-rebuild.bat
```

## Enable Google ads

Run the following in your app root to install dependencies:

```
npx expo install react-native-google-mobile-ads
```

Create/update the **.env** file in your project root and fill up the following values:

```
EXPO_ANDROID_ADMOB_APP_ID = "ca-app-pub-...."
EXPO_IOS_ADMOB_APP_ID = ""
EXPO_PUBLIC_ADMOB_SCREEN_LAYOUT_BANNER_ID = "ca-app-pub-...."
EXPO_PUBLIC_ADMOB_DEVICE_TEST_ID = "...."
EXPO_PUBLIC_ADMOB_DEVICE_UMP_ID = "...."
```

In the **app.config.js**, uncomment the Google ads plugin:

```
plugins: [
...
      // [
      //   "react-native-google-mobile-ads",
      //   {
      //     ...
      // ]
    ]
```

Uncomment the ads provider wrapper in **./src/App.tsx**:

```
{/* <AdsProvider umpId={process.env.EXPO_PUBLIC_ADMOB_DEVICE_UMP_ID}> */}
	...
{/* </AdsProvider> */}
```

Remember to run the rebuild app script.

## Enable Expo file system

Run the following in your app root to install dependencies:

```
npx expo install expo-file-system
```

In the **app.config.js**, uncomment the Google ads plugin:

```
plugins: [
...
      // [
      //   "expo-file-system",
      //   {
      //     ...
      // ]
    ]
```

Remember to run the rebuild app script.

---

# Contributing

If you add a new external dependency inside `OneForAll/src/`:

1. Add it to `devDependencies` in `OneForAll/package.json`
2. Run:

```
install.bat
```

Important:

* These dependencies are for editor support only.
* The consuming app must also install any runtime dependencies.

---

# Rules

* Do not run Expo from this folder.
* Do not treat this as a standalone project.
* Keep shared logic framework-agnostic where possible.
* Avoid adding heavy or unnecessary dependencies.
* Do not rely on environment variables inside shared code — pass configuration from the app.
* Do not modify app-specific build configuration inside this folder.

