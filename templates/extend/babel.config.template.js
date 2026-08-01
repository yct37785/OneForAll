module.exports = function makeBabelConfig(api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // using react-native-paper
      "react-native-paper/babel",
    ],
  };
};