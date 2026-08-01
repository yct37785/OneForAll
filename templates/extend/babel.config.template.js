module.exports = function createBabelConfig(api, overrides = {}) {
  api.cache(true);

  const {
    presets = [],
    plugins = [],
    finalPlugins = [],
    ...otherOverrides
  } = overrides;

  return {
    presets: [
      "babel-preset-expo",
      ...presets,
    ],

    plugins: [
      "react-native-paper/babel",
      ...plugins,
      ...finalPlugins,
    ],

    ...otherOverrides,
  };
};