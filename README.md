# OneForAll

Shared source code used by multiple Expo apps.

This folder contains reusable logic, components, utilities, and shared abstractions that are consumed by the apps via Metro external folder configuration.

It is not a standalone app and is not built or run independently.

## Important: About node_modules

The `node_modules` folder inside `OneForAll/` exists only for VS Code and TypeScript type resolution.

# Setup

From inside `OneForAll/`:
```
npm i
```

# Contributing
If you add a new external dependency inside `OneForAll/src/`, you must:

1. Add it to `devDependencies` in `OneForAll/package.json`

2. Run `npm i` again

Dependencies in this package are for editor support only.

All runtime dependencies must still exist in the consuming app (AppA/AppB).

# Rules
- Do not run Expo from this folder.

- Do not treat this as a standalone project.

- Avoid adding unnecessary heavy dependencies.

- Keep shared logic as framework-agnostic as possible.
