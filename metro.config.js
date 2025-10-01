const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);

// Optimize bundle size
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Enable tree shaking and remove unused code
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Optimize for production builds
if (process.env.NODE_ENV === 'production') {
  config.transformer.minifierPath = require.resolve('metro-minify-terser');
  config.transformer.minifierConfig = {
    ecma: 8,
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  };
}
 
module.exports = withNativeWind(config, { input: './global.css' });