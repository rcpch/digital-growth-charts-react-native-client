import React from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import {colors, theme} from '../../config';
import useCombined from '../../hooks/useCombined';
import PickerButton from '../PickerButton';
import AppModal from '../AppModal';
import {globalStateType} from '../../interfaces/GlobalState';
import AcceptCancel from '../AcceptCancel';
import {MakeSubState} from '../GlobalStateContext';

type propTypes = {
  name: keyof globalStateType;
  pickerArray: {label: string; value: number | string}[];
  userLabel: string;
  iconName: string;
};

function findRelevantIndexFromPickerArray(
  pickerArray: {label: string; value: number | string}[],
  value: string | number,
) {
  for (let i = 0; i < pickerArray.length; i++) {
    if (pickerArray[i].value === value) {
      return i;
    }
  }
  throw new Error('Picker array index finder should always find an index');
}

const WheelPicker = ({name, pickerArray, userLabel, iconName}: propTypes) => {
  const ios = Platform.OS === 'ios' ? true : false;

  const androidStyle = !ios ? {backgroundColor: colors.light} : null;

  const pickerList = pickerArray.map(({label, value}) => (
    <Picker.Item label={label} value={value} key={label} />
  ));

  const {
    combinedSetter,
    buttonState,
    initialState,
    specificErrorMessage,
    showErrorMessages,
  } = useCombined(name);

  const {showPicker, workingValue, value} = buttonState;

  let buttonLabel;
  if (!value) {
    buttonLabel = userLabel;
  } else {
    buttonLabel = `${userLabel}: ${
      pickerArray[findRelevantIndexFromPickerArray(pickerArray, value)].label
    }`;
  }

  const showCancel = value === initialState[name].value ? false : true;

  const togglePicker = () => {
    if (showPicker) {
      combinedSetter({
        value: workingValue,
        showPicker: false,
      });
    } else {
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
      combinedSetter(MakeSubState(name));
    }
  };

  const onValueChange = (itemValue: number | string) => {
    combinedSetter({workingValue: itemValue});
  };

  return (
    <React.Fragment>
      <PickerButton
        toggleInput={togglePicker}
        buttonText={buttonLabel}
        showCancel={showCancel}
        cancelInput={resetInput}
        iconName={iconName}
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
              onValueChange={(itemValue: string | number) =>
                onValueChange(itemValue)
              }
              selectedValue={workingValue}>
              {pickerList}
            </Picker>
          </View>
          <AcceptCancel
            acceptInput={togglePicker}
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

export default WheelPicker;

const styles = StyleSheet.create({
  iosPicker: {
    height: 200,
    width: theme.modal.width - 10,
    //backgroundColor: 'orange',
    alignSelf: 'center',
  },
  androidPicker: {
    height: 100,
    width: theme.modal.width * 0.75,
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
