import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import {colors, theme} from '../../config';
import useCombined from '../../hooks/useCombined';
import PickerButton from '../PickerButton';
import AppModal from '../AppModal';
import AcceptCancel from '../AcceptCancel';
import {MakeSubState} from '../GlobalStateContext';

const weekLabels = [];
for (let i = 23; i < 43; i++) {
  weekLabels.push(i);
}
const dayLabels = [0, 1, 2, 3, 4, 5, 6];
const weekLabelList = weekLabels.map((number) => (
  <Picker.Item label={`${number}`} value={number} key={number} />
));
const dayLabelList = dayLabels.map((number) => (
  <Picker.Item label={`${number}`} value={number} key={number} />
));

const name = 'gestationInDays';

const GestationInputButton = () => {
  const ios = Platform.OS === 'ios' ? true : false;
  const androidStyle = !ios ? {backgroundColor: colors.light} : null;

  const {
    combinedSetter,
    buttonState,
    initialState,
    specificErrorMessage,
    showErrorMessages,
  } = useCombined(name);

  const {showPicker, workingValue, value} = buttonState;

  const weeks = Math.floor(workingValue / 7);
  const days = workingValue % 7;

  let buttonLabel;
  if (!value) {
    buttonLabel = 'Birth Gestation';
  } else {
    buttonLabel = `Birth Gestation: ${Math.floor(value / 7)}+${value % 7}`;
  }

  const showCancel = value === initialState[name].value ? false : true;

  const toggleGestPicker = () => {
    if (showPicker) {
      combinedSetter({
        value: workingValue,
        showPicker: false,
      });
    } else {
      if (!workingValue) {
        combinedSetter({showPicker: true, workingValue: 280});
      }
      combinedSetter({showPicker: true});
    }
  };

  const resetInput = () => {
    if (showPicker) {
      combinedSetter({
        showPicker: false,
        workingValue: value,
      });
    } else {
      combinedSetter(MakeSubState('gestationInDays'));
    }
  };

  const onValueChangeWeeks = (itemValue: number) => {
    const noWeeks = workingValue - weeks * 7;
    const newWorkingValue = itemValue * 7 + noWeeks;
    combinedSetter({workingValue: newWorkingValue});
  };

  const onValueChangeDays = (itemValue: number) => {
    const noDays = workingValue - days;
    const newWorkingValue = itemValue + noDays;
    combinedSetter({workingValue: newWorkingValue});
  };

  return (
    <React.Fragment>
      <PickerButton
        toggleInput={toggleGestPicker}
        buttonText={buttonLabel}
        showCancel={showCancel}
        cancelInput={resetInput}
        iconName="human-pregnant"
        specificErrorMessage={specificErrorMessage}
        showErrorMessages={showErrorMessages}
        makeRefreshNotCancel>
        <AppModal
          modalVisible={showPicker}
          cancelInput={resetInput}
          renderCloseButton={false}
          style={androidStyle}>
          <View style={styles.pickerContainer}>
            <Picker
              style={ios ? styles.iosPicker : styles.androidPicker}
              itemStyle={theme.text}
              onValueChange={onValueChangeWeeks}
              selectedValue={weeks}>
              {weekLabelList}
            </Picker>
            <Picker
              style={ios ? styles.iosPicker : styles.androidPicker}
              itemStyle={theme.text}
              onValueChange={onValueChangeDays}
              selectedValue={days}>
              {dayLabelList}
            </Picker>
          </View>
          <AcceptCancel
            acceptInput={toggleGestPicker}
            cancelInput={resetInput}
            width={theme.modal.width / 3}
            iconSize={40}
            iconColor={ios ? 'white' : 'black'}
          />
        </AppModal>
      </PickerButton>
    </React.Fragment>
  );
};

export default GestationInputButton;

const styles = StyleSheet.create({
  iosPicker: {
    height: 200,
    width: theme.modal.width / 2.2,
    //backgroundColor: 'orange',
    alignSelf: 'center',
  },
  androidPicker: {
    height: 100,
    width: theme.modal.width / 2 - 10,
  },
  buttonContainer: {
    width: theme.modal.width,
    //backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  closeIcon: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'red',
    paddingRight: 10,
  },
  acceptIcon: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'red',
    paddingLeft: 10,
  },
});
