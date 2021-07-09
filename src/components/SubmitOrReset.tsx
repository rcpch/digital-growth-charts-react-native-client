import React from 'react';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
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
  const scheme = useColorScheme();

  let handlePress = () => {};
  let otherStyles = {
    backgroundColor: colors.darkest,
  };

  if (submit) {
    handlePress = () => {
      handleFinalSubmit();
    };
    otherStyles = {
      backgroundColor: colors.pink,
    };
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
    otherStyles = {
      backgroundColor: scheme === 'dark' ? colors.light : colors.darkest,
    };
  }

  return (
    <TouchableOpacity
      style={[styles.container, otherStyles]}
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
