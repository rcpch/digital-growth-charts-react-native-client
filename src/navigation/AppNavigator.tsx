import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {ChartScreen, InputScreen, ResultsScreen} from '../screens';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      mode="card"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Input" component={InputScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="Chart" component={ChartScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
