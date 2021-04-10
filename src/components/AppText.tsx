import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {theme} from '../config/';

type PropTypes = {
  style?: any;
  children: React.ReactNode;
};

const AppText = ({style, children}: PropTypes) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

export default AppText;

const styles = StyleSheet.create({
  text: {
    ...theme.text,
  },
});
