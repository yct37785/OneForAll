# OneForAll

Shared source code used by multiple Expo apps.

This folder contains reusable logic, components, utilities, hooks, navigation abstractions, and shared UI that are consumed by the apps via Metro external folder configuration.

It is **not a standalone app** and must not be run independently.

---

# Folder Structure Requirement

All consuming apps **must be sibling folders** of `OneForAll`.

Example:

```
Dev/
  OneForAll/
  AppA/
  AppB/
```

This structure is required because:

* Metro configuration depends on `../OneForAll`
* TypeScript `paths` mapping assumes sibling layout
* Shared build templates reference relative paths

---

# Setup

From inside `OneForAll/`, run:

```
install.bat
```

This installs `node_modules` used **only for VS Code and TypeScript type resolution**.

You do **not** run `expo` from this folder.

## Important: About node_modules

The `node_modules` folder inside `OneForAll/` exists only for:

* VS Code IntelliSense
* TypeScript type checking

It is **not used at runtime**.

Metro always resolves dependencies from the consuming app's `node_modules`.

---

# How Apps Consume OneForAll

Each app:

* Uses Metro `watchFolders` to include `../OneForAll/src`
* Uses TypeScript path mapping (`@shared/*`)
* Imports shared code directly

Example import:

```ts
import { AdsProvider } from "@shared/Hooks/UseAds";
```

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

---

# Build & Script Templates

`OneForAll/templates/` contains shared:

* `metro.config.template.js`
* `babel.config.template.js`
* `tsconfig.template.json`
* Android build `.bat` scripts

Each app has thin wrapper files that call these templates.
