import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import {useFormikContext} from 'formik';

import AppText from '../../AppText';
import colors from '../../../config/colors';
import ButtonIcon from '../ButtonIcon';
import ErrorMessage from '../../ErrorMessage';
import defaultStyles from '../../../config/styles';
import useCombined from '../../../brains/useCombined';

const modalWidth =
  defaultStyles.container.width > 350 ? 350 : defaultStyles.container.width;

const weekLabels = [];
for (let i = 23; i < 43; i++) {
  weekLabels.push(i);
}
const dayLabels = [0, 1, 2, 3, 4, 5, 6];
const weekLabelList = weekLabels.map((number, index) => (
  <Picker.Item label={`${number}`} value={number} key={number} />
));
const dayLabelList = dayLabels.map((number, index) => (
  <Picker.Item label={`${number}`} value={number} key={number} />
));

const GestationInputButton = ({kind, name = 'gestationInDays'}) => {
  const ios = Platform.OS === 'ios' ? true : false;

  const {combinedSetter, buttonState, initialState} = useCombined(kind, name);

  const {errors, touched} = useFormikContext();

  const {modalVisible, days, weeks, showReset, value} = buttonState;

  let buttonLabel;
  if (kind === 'neonate') {
    if (value) {
      buttonLabel = `Birth Gestation: ${Math.floor(value / 7)}+${value % 7}`;
    } else {
      buttonLabel = 'Birth Gestation';
    }
  } else if (kind === 'child') {
    if (value !== 280) {
      buttonLabel = `Birth Gestation: ${Math.floor(value / 7)}+${value % 7}`;
    } else {
      buttonLabel = 'Birth Gestation: Term';
    }
  }

  const resetIcon = kind === 'child' ? 'refresh' : 'delete-forever';

  const toggleGestPicker = () => {
    if (modalVisible) {
      if (weeks === 40 && days === 0 && kind === 'child') {
        combinedSetter({
          modalVisible: false,
          value: 280,
        });
      } else {
        combinedSetter({
          showReset: true,
          value: weeks * 7 + days,
          modalVisible: false,
        });
      }
    } else {
      combinedSetter({modalVisible: true});
    }
  };

  const resetInput = () => {
    if (modalVisible) {
      const tempWeeks = value ? Math.floor(value / 7) : 37;
      combinedSetter({
        modalVisible: false,
        weeks: tempWeeks,
        days: value % 7,
      });
    } else {
      combinedSetter(initialState[kind].gestationInDays);
    }
  };

  return (
    <React.Fragment>
      <View style={styles.button}>
        <TouchableOpacity onPress={toggleGestPicker}>
          <View style={styles.textBox}>
            <ButtonIcon name="human-pregnant" />
            <AppText style={{color: colors.white}}>{buttonLabel}</AppText>
          </View>
        </TouchableOpacity>
        {showReset && (
          <TouchableOpacity onPress={resetInput}>
            <ButtonIcon name={resetIcon} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={resetInput}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.pickerContainer}>
                <Picker
                  style={ios ? styles.iosPicker : styles.androidPicker}
                  itemStyle={{color: colors.black}}
                  onValueChange={(itemValue, itemIndex) => {
                    combinedSetter({weeks: itemValue});
                  }}
                  selectedValue={weeks}>
                  {weekLabelList}
                </Picker>
                <Picker
                  style={ios ? styles.iosPicker : styles.androidPicker}
                  itemStyle={{
                    color: colors.black,
                  }}
                  onValueChange={(itemValue, itemIndex) => {
                    combinedSetter({days: itemValue});
                  }}
                  selectedValue={days}>
                  {dayLabelList}
                </Picker>
              </View>
              <View style={styles.buttonContainer}>
                <View style={styles.closeIcon}>
                  <TouchableOpacity onPress={resetInput}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      color={colors.black}
                      size={40}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.acceptIcon}>
                  <TouchableOpacity onPress={toggleGestPicker}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      color={colors.black}
                      size={40}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </React.Fragment>
  );
};

export default GestationInputButton;

const styles = StyleSheet.create({
  button: {
    ...defaultStyles.container,
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
  },
  iosPicker: {
    height: 200,
    width: modalWidth / 2.2,
    //backgroundColor: 'orange',
    alignSelf: 'center',
  },
  androidPicker: {
    height: 100,
    width: modalWidth / 2 - 10,
  },
  pickerContainer: {
    //alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalView: {
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 20,
    backgroundColor: colors.light,
  },
  buttonContainer: {
    width: modalWidth,
    //backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  textBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: defaultStyles.container.width - 55,
    height: 57,
    //backgroundColor: 'green',
    alignSelf: 'center',
  },
});
