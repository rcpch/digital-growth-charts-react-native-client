import React from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import {VictoryPlaceholder} from './src/components/';

const App = () => {
  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.main}>
        <VictoryPlaceholder />
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
