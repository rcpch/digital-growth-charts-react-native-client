import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';

import useCombined from '../../hooks/useCombined';
import PickerButton from '../PickerButton';
import {containerWidth, theme, colors} from '../../config';

type propTypes = {
  iconName: string;
  name: string;
  unitsOfMeasurement: string;
  userLabel: string;
};

const TextInputButton = ({
  iconName,
  name,
  unitsOfMeasurement,
  userLabel,
}: propTypes) => {
  const {
    combinedSetter,
    buttonState,
    initialState,
    showErrorMessages,
    specificErrorMessage,
  } = useCombined(name);
  const {showPicker, workingValue, value} = buttonState;

  const placeHolderText = `Enter here (in ${unitsOfMeasurement})`;

  const showCancel = value !== initialState[name].value ? true : false;

  const makeRefreshNotCancel = initialState[name].value ? true : false;

  let buttonText = userLabel;

  if (value) {
    buttonText = `${userLabel}: ${value}${unitsOfMeasurement}`;
  }

  const cancelInput = () => {
    combinedSetter(initialState[name]);
  };

  const toggleTextInput = () => {
    if (showPicker) {
      combinedSetter({
        showPicker: false,
        value: workingValue,
      });
    } else {
      combinedSetter({showPicker: true});
    }
  };

  return (
    <PickerButton
      toggleInput={toggleTextInput}
      cancelInput={cancelInput}
      buttonText={buttonText}
      showCancel={showCancel}
      makeRefreshNotCancel={makeRefreshNotCancel}
      iconName={iconName}
      specificErrorMessage={specificErrorMessage}
      showErrorMessages={showErrorMessages}>
      {showPicker && (
        <View style={styles.inputBox}>
          <TextInput
            style={styles.textInput}
            onChangeText={(inputText) => {
              combinedSetter({workingValue: inputText});
            }}
            value={workingValue}
            autoFocus={true}
            clearTextOnFocus={false}
            keyboardType={'decimal-pad'}
            placeholder={placeHolderText}
            placeholderTextColor={colors.white}
            multiline={false}
            textAlignVertical="center"
            onBlur={toggleTextInput}
            returnKeyType="done"
          />
        </View>
      )}
    </PickerButton>
  );
};

export default TextInputButton;

const styles = StyleSheet.create({
  inputBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.medium,
    borderRadius: 5,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
    width: containerWidth,
  },
  textInput: {
    ...theme.text,
    width: containerWidth - 40,
    //backgroundColor: 'orange',
    height: 57,
  },
});
