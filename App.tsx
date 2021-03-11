import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';

// import {VictoryPlaceholder} from './src/components';
import AppNavigator from './src/navigation/AppNavigator';
import {GlobalStatsProvider} from './src/components';

const App = () => {
  return (
    <SafeAreaProvider>
      <GlobalStatsProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </GlobalStatsProvider>
    </SafeAreaProvider>
  );
};

export default App;
