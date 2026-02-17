const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const sharedRoot = path.resolve(projectRoot, "../OneForAll/src");

const config = getDefaultConfig(projectRoot);

// let Metro read & watch files outside the app root
config.watchFolders = [sharedRoot];

// make sure Metro resolves modules from the app's node_modules first
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules")
];

// extra safety: never resolve react/react-native from elsewhere
config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, "node_modules/react"),
  "react-native": path.resolve(projectRoot, "node_modules/react-native"),
  expo: path.resolve(projectRoot, "node_modules/expo")
};

module.exports = config;