import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import {globalStateType} from '../../interfaces/GlobalState';

import {colors, containerWidth} from '../../config';
import {formatDate} from '../../brains';
import useCombined from '../../hooks/useCombined';
import AcceptCancel from '../AcceptCancel';
import PickerButton from '../PickerButton';
import AppModal from '../AppModal';

const modalWidth = containerWidth > 350 ? 350 : containerWidth;

const DateInputButton = ({dateName}: {dateName: keyof globalStateType}) => {
  const ios = Platform.OS === 'ios' ? true : false;
  const android = Platform.OS === 'android' ? true : false;
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

  const onChangeDateIos = (event: Event, date: Date | undefined) => {
    const currentDate = date || workingValue;
    combinedSetter({workingValue: currentDate});
  };
  const cancelInputIos = () => {
    if (showPicker) {
      combinedSetter({
        showPicker: false,
        workingValue: value,
      });
    } else if (!showPicker) {
      combinedSetter(initialState[dateName]);
    }
  };
  const togglePickerIos = () => {
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

  const openPickerDateAndroid = () => {
    let workingObject: any = {};
    if (!workingValue) {
      workingObject.workingValue = new Date();
    }
    workingObject.showPicker = true;
    combinedSetter(workingObject);
  };
  const cancelInputAndroid = () => {
    combinedSetter(initialState[dateName]);
  };
  const onChangeAndroidDate = (event: any, selected: Date | undefined) => {
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
      toggleInput={ios ? togglePickerIos : openPickerDateAndroid}
      cancelInput={ios ? cancelInputIos : cancelInputAndroid}
      buttonText={buttonText}
      showCancel={showCancel}
      makeRefreshNotCancel={makeRefreshNotCancel}
      iconName="calendar-range"
      specificErrorMessage={specificErrorMessage}
      showErrorMessages={showErrorMessages}>
      {ios && (
        <AppModal modalVisible={showPicker} renderCloseButton={false}>
          <View style={styles.iosDatePickerContainer}>
            <DateTimePicker
              testID="datePickerIos"
              value={workingValue}
              mode="date"
              display="spinner"
              onChange={onChangeDateIos}
              style={styles.iosDatePicker}
              textColor={colors.black}
            />
          </View>
          <AcceptCancel
            acceptInput={togglePickerIos}
            cancelInput={cancelInputIos}
            iconSize={40}
            width={modalWidth / 3}
          />
        </AppModal>
      )}
      {showPicker && android && (
        <DateTimePicker
          testID="datePickerAndroid"
          value={workingValue}
          mode="date"
          display="spinner"
          onChange={onChangeAndroidDate}
        />
      )}
    </PickerButton>
  );
};

export default DateInputButton;

const styles = StyleSheet.create({
  iosDatePickerContainer: {
    height: 150,
    width: modalWidth,
  },
  iosDatePicker: {
    height: 150,
  },
});
