import React from 'react';
import {StyleSheet, Text} from 'react-native';
import colors from '../config/colors';

type AppProps = {style?: object; children: React.ReactNode; bold?: boolean};

const AppText = ({style, children, bold}: AppProps) => {
  const fontFamily = {
    fontFamily: bold ? 'Montserrat-Bold' : 'Montserrat-Regular',
  };
  return <Text style={[styles.text, fontFamily, style]}>{children}</Text>;
};

export default AppText;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: colors.heading,
  },
});
