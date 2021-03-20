import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';

// import {VictoryPlaceholder} from './src/components';
import AppNavigator from './src/navigation/AppNavigator';
import {GlobalStateProvider} from './src/components';

const App = () => {
  return (
    <SafeAreaProvider>
      <GlobalStateProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </GlobalStateProvider>
    </SafeAreaProvider>
  );
};

export default App;
