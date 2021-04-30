import '../node_modules/react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('../node_modules/react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
// jest.mock(
//   '../node_modules/react-native/Libraries/Animated/src/NativeAnimatedHelper',
// );

jest.mock(
  '../node_modules/react-native/Libraries/Animated/src/NativeAnimatedHelper.js',
);
