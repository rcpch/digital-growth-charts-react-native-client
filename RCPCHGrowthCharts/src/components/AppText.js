import React from 'react';
import {StyleSheet, Text} from 'react-native';
import colors from '../config/colors';

const AppText = ({style, children}) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

export default AppText;

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 20,
    color: colors.heading,
  },
});
