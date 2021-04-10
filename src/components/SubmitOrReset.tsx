import React from 'react';
import {Alert, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, theme} from '../config';
import useCombined from '../hooks/useCombined';
import AppText from './AppText';

type propTypes = {
  submit?: boolean;
  reset?: boolean;
  children: string;
};

function SubmitOrReset({submit, reset, children}: propTypes) {
  const {handleFinalSubmit, combinedReset} = useCombined();

  let handlePress = () => {};
  let backgroundColor = {backgroundColor: colors.darkMedium};

  if (submit) {
    handlePress = () => {
      handleFinalSubmit();
    };
    backgroundColor = {backgroundColor: colors.black};
  }
  if (reset) {
    handlePress = () => {
      Alert.alert('Are you sure you want to reset?', '', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => combinedReset(),
        },
      ]);
    };
    backgroundColor = {backgroundColor: colors.dark};
  }

  return (
    <TouchableOpacity
      style={[styles.container, backgroundColor]}
      onPress={handlePress}>
      <AppText>{children}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    ...theme.button,
    paddingLeft: 0,
    justifyContent: 'center',
  },
});

export default SubmitOrReset;
