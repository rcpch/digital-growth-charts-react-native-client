import React from 'react';
import {StyleSheet, View} from 'react-native';

import {globalStateType} from '../../interfaces/GlobalState';

import {theme} from '../../config';
import {formatDate} from '../../brains';
import useCombined from '../../hooks/useCombined';
import AcceptCancel from '../AcceptCancel';
import PickerButton from '../PickerButton';
import AppModal from '../AppModal';
import DateTimeBare from '../DateTimeBare';

const DateInputButton = ({dateName}: {dateName: keyof globalStateType}) => {
  const makeRefreshNotCancel = dateName === 'dob' ? false : true;

  const {
    combinedSetter,
    buttonState,
    initialState,
    specificErrorMessage,
    showErrorMessages,
  } = useCombined(dateName);

  const {value, workingValue, showPicker} = buttonState;

  const showCancel = value ? true : false;

  let buttonText = '';
  if (!value) {
    buttonText = dateName === 'dob' ? 'Date of Birth' : 'Measured: Today';
  } else {
    buttonText =
      dateName === 'dob'
        ? `Date of Birth: ${formatDate(value)}`
        : `Measured on ${formatDate(value)}`;
  }

  const cancelInput = () => {
    if (showPicker) {
      combinedSetter({
        showPicker: false,
        workingValue: value,
      });
    } else if (!showPicker) {
      combinedSetter(initialState[dateName]);
    }
  };
  const togglePicker = () => {
    let workingObject: any = {};
    if (showPicker) {
      if (
        dateName === 'dob' ||
        (dateName === 'dom' &&
          formatDate(workingValue) !== formatDate(new Date()))
      ) {
        workingObject.value = workingValue;
      }
      workingObject.showPicker = false;
      combinedSetter(workingObject);
    } else if (!showPicker) {
      workingObject.showPicker = true;
      if (!workingValue) {
        workingObject.workingValue = new Date();
      }
      combinedSetter(workingObject);
    }
  };

  return (
    <PickerButton
      toggleInput={togglePicker}
      cancelInput={cancelInput}
      buttonText={buttonText}
      showCancel={showCancel}
      makeRefreshNotCancel={makeRefreshNotCancel}
      iconName="calendar-range"
      specificErrorMessage={specificErrorMessage}
      showErrorMessages={showErrorMessages}>
      <AppModal modalVisible={showPicker} renderCloseButton={false}>
        <View style={styles.pickerWrapper}>
          <DateTimeBare
            date={workingValue}
            setDate={(newValue: Date) =>
              combinedSetter({workingValue: newValue})
            }
          />
        </View>
        <AcceptCancel
          acceptInput={togglePicker}
          cancelInput={cancelInput}
          iconSize={40}
          width={theme.modal.width / 3}
        />
      </AppModal>
    </PickerButton>
  );
};

export default DateInputButton;

const styles = StyleSheet.create({
  pickerWrapper: {
    marginBottom: 15,
  },
});
