const createBabelConfig = require(
  "../OneForAll/templates/extend/babel.config.template"
);

module.exports = function babelConfig(api) {
  return createBabelConfig(api, {
    plugins: [
      // Normal app-specific plugins.
    ],

    finalPlugins: [
      // Plugins that explicitly require being last.
    ],
  });
};