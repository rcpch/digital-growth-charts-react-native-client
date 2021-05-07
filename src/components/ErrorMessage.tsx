import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import {colors} from '../config';
import AppText from './AppText';

type PropTypes = {
  specificErrorMessage: string;
  showErrorMessages: boolean;
};

function ErrorMessage({specificErrorMessage, showErrorMessages}: PropTypes) {
  if (specificErrorMessage && showErrorMessages) {
    return <AppText style={styles.container}>{specificErrorMessage}</AppText>;
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    textAlign: 'center',
    color: colors.danger,
    fontSize: 16,
    width: '98%',
    fontFamily: 'Montserrat-Bold',
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
  },
});

export default ErrorMessage;
