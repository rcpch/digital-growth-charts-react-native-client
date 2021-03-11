import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {theme} from '../config/';

type PropTypes = {
  style?: any;
  children: React.ReactNode;
  bold?: boolean;
};

const AppText = ({style, children, bold}: PropTypes) => {
  const fontFamily = {
    fontFamily: bold ? 'Montserrat-Bold' : 'Montserrat-Regular',
  };
  return <Text style={[styles.text, fontFamily, style]}>{children}</Text>;
};

export default AppText;

const styles = StyleSheet.create({
  text: {
    ...theme.text,
  },
});
