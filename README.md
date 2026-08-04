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

# Setting Up OneForAll

Once cloned, from inside `OneForAll/`, run:

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

## Important pre-requisites

Ensure your **JAVA_HOME** is pointed to JDK version 21 and below. This is due to a requirement with sub-dependency react-native-screens.

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
npx expo install @expo/vector-icons @react-navigation/bottom-tabs @react-navigation/native @react-navigation/native-stack babel-preset-expo dotenv expo-application expo-build-properties expo-crypto expo-intent-launcher expo-navigation-bar expo-status-bar lodash react-native-gesture-handler react-native-get-random-values react-native-keyboard-controller react-native-paper react-native-popup-menu react-native-reanimated react-native-screens react-native-worklets uuid
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

## Embedding native code

**Pre-requisite:** use an NPM version below 12, this is due to incompatibility between NPM@12 and create-expo-module. See [issue](https://github.com/expo/expo/issues/48091 "issue").

```
npm install -g npm@11
```

We will create a local Expo module embedded into the app itself. In your app's project directory, run:

```
npx create-expo-module@latest --local
```

When prompted, use values simliar to:

```
Local module name:
> my-local-module

Native module name:
> MyLocalModule

Android package name:
> expo.modules.mylocalmodule

Platforms:
* Android

Examples/features:
* Function
* AsyncFunction
```

On success, the program will inform us that the Expo module is created at ```modules/my-local-module```. Do not rename or move any of the files.

The file structure of your created module should be as follows:

```
modules/my-local-module/
├─ android/						# native logic implementation
│  ├─ build.gradle
│  └─ src/main/
│     ├─ AndroidManifest.xml
│     └─ java/...
│        └─ MyLocalModule.kt
├─ src/							# JS-native module definition
│  ├─ MyLocalModule.ts
│  └─ MyLocalModule.types.ts
└─ expo-module.config.json		# Expo module configuration
```

Check **expo-module.config.json**: the Android modules entry must be the package + class name.

```
{
  ...
  "android": {
    "modules": ["expo.modules.mylocalmodule.MyLocalModule"]
  }
}
```

Within **android/../MyLocalModule.kt**:

```
package expo.modules.mylocalmodule

...

class MyLocalModule : Module() {
```

Let's do a simple demo. Replace the native module class code with the following:

```
  /**
   * This value only lives in memory.
   * It resets when the native module/app process is restarted.
   */
  @Volatile
  private var storedValue: String = ""

  override fun definition() = ModuleDefinition {
    Name("MyLocalModule")

    /**
     * Simple synchronous function.
     */
    Function("hello") {
      "Hello world! 👋"
    }

    /**
     * Synchronous write.
     *
     * JavaScript receives the returned value immediately.
     */
    Function("setValue") { value: String ->
      storedValue = value
      storedValue
    }

    /**
     * Synchronous read.
     */
    Function("getValue") {
      storedValue
    }

    /**
     * Asynchronous write.
     *
     * Returns a Promise<string> to JavaScript.
     */
    AsyncFunction("setValueAsync") { value: String ->
      // simulated slow native work for demo
      Thread.sleep(500)

      storedValue = value
      storedValue
    }

    /**
     * Asynchronous read.
     *
     * Returns a Promise<string> to JavaScript.
     */
    AsyncFunction("getValueAsync") {
      // simulate fetching data from storage, an SDK, network, DB etc
      Thread.sleep(500)

      storedValue
    }
  }
```

*@Volatile makes reads and writes to the property visible across the threads that may execute the sync and async function.*

Now within **src/MyLocalModule.ts**, update the JS-native class and function definitions. Note class name and functions name + signature MUST match their native Kotlin counterparts.

```
declare class MyLocalModule extends NativeModule<{}> {
  /**
   * Returns a greeting synchronously.
   */
  hello(): string;

  /**
   * Writes a value synchronously and returns the written value.
   */
  setValue(value: string): string;

  /**
   * Reads the current value synchronously.
   */
  getValue(): string;

  /**
   * Writes a value asynchronously and resolves with the written value.
   */
  setValueAsync(value: string): Promise<string>;

  /**
   * Reads the current value asynchronously.
   */
  getValueAsync(): Promise<string>;
}
```

Now back to the Expo app, update the tsconfig.json to include an alias to the module directory:

```
	...
    "paths": {
		...
      "@Module/*": ["./modules/*"],
    },
  },
```

Then import and use the functions in your regular React Native code like so:

```
import MyLocalModule from '@Module/my-local-module/src/MyLocalModule';

...
console.log(MyLocalModule.hello());
await MyLocalModule.setValueAsync("testing 123");
const v = await MyLocalModule.getValueAsync();
console.log(v);
```

Run the dev build sequence:

```
run-android-dev.bat
```

You should now see the outputs from the native functions.

You can add the following to your project gitignore to ignore the module's generated Android build folder.

```
modules/**/android/build/
```

---

# Contributing

If you add a new external dependency inside `OneForAll/src/`:

1. Add it to **devDependencies** in **OneForAll/package.json**
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
