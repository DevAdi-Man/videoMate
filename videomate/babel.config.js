module.exports = {
  presets: [
    'babel-preset-expo',
  ],
  plugins: [
    'module:@babel/plugin-syntax-flow', // ✅ Correct plugin usage
    'react-native-reanimated/plugin',
  ],
};

