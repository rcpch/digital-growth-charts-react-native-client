import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {InputScreen, ResultsScreen} from '../screens';

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
    </Stack.Navigator>
  );
};

export default AppNavigator;
