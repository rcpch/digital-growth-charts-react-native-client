import React from 'react';
import {View, TouchableOpacity} from 'react-native';

import AppText from './AppText';
import ErrorMessage from './ErrorMessage';
import AppIcon from './AppIcon';

import {theme} from '../config';

type propTypes = {
  toggleInput: Function;
  buttonText: string;
  showCancel: boolean;
  cancelInput: Function;
  makeRefreshNotCancel?: boolean;
  children: React.ReactNode;
  iconName: string;
  specificErrorMessage: string;
  showErrorMessages: boolean;
};

const PickerButton = ({
  toggleInput,
  buttonText,
  showCancel,
  cancelInput,
  makeRefreshNotCancel = false,
  children,
  iconName,
  specificErrorMessage,
  showErrorMessages,
}: propTypes) => {
  return (
    <React.Fragment>
      <View style={theme.button}>
        <TouchableOpacity onPress={() => toggleInput()}>
          <View style={theme.buttonTextBox}>
            <AppIcon style={{padding: 10}} name={iconName} />
            <AppText>{buttonText}</AppText>
          </View>
        </TouchableOpacity>
        {showCancel && (
          <TouchableOpacity onPress={() => cancelInput()}>
            <AppIcon
              name={makeRefreshNotCancel ? 'refresh' : 'close-circle-outline'}
            />
          </TouchableOpacity>
        )}
      </View>
      {children}
      <ErrorMessage
        specificErrorMessage={specificErrorMessage}
        showErrorMessages={showErrorMessages}
      />
    </React.Fragment>
  );
};

export default PickerButton;
