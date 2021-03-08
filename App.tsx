import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar, View} from 'react-native';
import theme from './src/config/theme';

import {VictoryPlaceholder} from './src/components';

const App = () => {
  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.main}>
        <View style={theme.button} />
      </SafeAreaView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default App;
