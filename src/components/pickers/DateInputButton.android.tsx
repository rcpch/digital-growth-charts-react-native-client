import React from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';

import {globalStateType} from '../../interfaces/GlobalState';

import {formatDate} from '../../brains';
import useCombined from '../../hooks/useCombined';
import PickerButton from '../PickerButton';

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

  const openPickerDate = () => {
    let workingObject: any = {};
    if (!workingValue) {
      workingObject.workingValue = new Date();
    }
    workingObject.showPicker = true;
    combinedSetter(workingObject);
  };
  const cancelInput = () => {
    combinedSetter(initialState[dateName]);
  };
  const onChangeDate = (event: any, selected: Date | undefined) => {
    let workingObject: any = {};
    if (event.type === 'set') {
      const current = selected || workingValue;
      if (
        dateName === 'dob' ||
        (dateName === 'dom' && formatDate(current) !== formatDate(new Date()))
      ) {
        workingObject.workingValue = current;
      } else {
        workingObject.workingValue = null;
      }
      workingObject.showPicker = false;
      combinedSetter(workingObject);
    } else {
      workingObject.workingValue = value;
      workingObject.showPicker = false;
      combinedSetter(workingObject);
    }
  };

  return (
    <PickerButton
      toggleInput={openPickerDate}
      cancelInput={cancelInput}
      buttonText={buttonText}
      showCancel={showCancel}
      makeRefreshNotCancel={makeRefreshNotCancel}
      iconName="calendar-range"
      specificErrorMessage={specificErrorMessage}
      showErrorMessages={showErrorMessages}>
      {showPicker && (
        <DateTimePicker
          testID="datePickerAndroid"
          value={workingValue}
          mode="date"
          display="spinner"
          onChange={onChangeDate}
        />
      )}
    </PickerButton>
  );
};

export default DateInputButton;
