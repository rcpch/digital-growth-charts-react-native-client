import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type propTypes = {
  children: React.ReactNode;
  style?: any;
};

const Screen = ({children, style}: propTypes) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[{paddingTop: insets.top}, styles.screen, style]}>
      <View style={[styles.view, style]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  view: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Screen;
