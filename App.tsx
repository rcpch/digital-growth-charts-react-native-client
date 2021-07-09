import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import RNBootSplash from 'react-native-bootsplash';

import AppNavigator from './src/navigation/AppNavigator';
import {GlobalStateProvider} from './src/components';
import {timeout} from './src/brains';

const cancelSplashScreen = async (): Promise<void> => {
  // prevent flash when transitioning from splash screen in dark mode:
  await timeout(200);
  RNBootSplash.hide();
};

const App = () => {
  return (
    <SafeAreaProvider>
      <GlobalStateProvider>
        <NavigationContainer onReady={cancelSplashScreen}>
          <AppNavigator />
        </NavigationContainer>
      </GlobalStateProvider>
    </SafeAreaProvider>
  );
};

export default App;
