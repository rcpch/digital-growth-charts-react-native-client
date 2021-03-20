import React from 'react';
import {Platform, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import {colors, theme} from '../../config';
import useCombined from '../../hooks/useCombined';
import PickerButton from '../PickerButton';
import AppModal from '../AppModal';
import AppIcon from '../AppIcon';
import {globalStateType} from '../../interfaces/GlobalState';

type propTypes = {
  name: keyof globalStateType;
  pickerArray: {label: string; value: number | string}[];
  userLabel: string;
  iconName: string;
};

const WheelPicker = ({name, pickerArray, userLabel, iconName}: propTypes) => {
  const ios = Platform.OS === 'ios' ? true : false;

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

  function findRelevantIndexFromPickerArray() {
    for (let i = 0; i < pickerArray.length; i++) {
      if (pickerArray[i].value === value) {
        return i;
      }
    }
    throw new Error('Picker array index finder should always find an index');
  }

  let buttonLabel;
  if (!value) {
    buttonLabel = userLabel;
  } else {
    buttonLabel = `${userLabel}: ${
      pickerArray[findRelevantIndexFromPickerArray()].label
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
      combinedSetter(initialState[name]);
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
          renderCloseButton={false}>
          <View style={styles.pickerContainer}>
            <Picker
              style={ios ? styles.iosPicker : styles.androidPicker}
              itemStyle={styles.iosPickerText}
              onValueChange={(itemValue: string | number) =>
                onValueChange(itemValue)
              }
              selectedValue={workingValue}>
              {pickerList}
            </Picker>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={resetInput}>
              <AppIcon
                name="close-circle"
                color={colors.black}
                size={40}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePicker}>
              <AppIcon
                name="check-circle"
                color={colors.black}
                size={40}
                style={styles.acceptIcon}
              />
            </TouchableOpacity>
          </View>
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
  iosPickerText: {
    ...theme.text,
    color: colors.black,
  },
  androidPicker: {
    height: 100,
    width: theme.modal.width - 10,
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
