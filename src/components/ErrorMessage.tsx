import React from 'react';
import {StyleSheet} from 'react-native';
import {colors} from '../config';
import AppText from './AppText';

type PropTypes = {
  specificErrorMessage: string;
  showErrorMessages: boolean;
};

function ErrorMessage({specificErrorMessage, showErrorMessages}: PropTypes) {
  if (specificErrorMessage && showErrorMessages) {
    return (
      <AppText style={styles.container} bold>
        {specificErrorMessage}
      </AppText>
    );
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
  },
});

export default ErrorMessage;
