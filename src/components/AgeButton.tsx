import React, {useState, useContext} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';

import AppText from './AppText';
import {colors, theme} from '../config/';
import AppIcon from './AppIcon';
import AppModal from './AppModal';
import {GlobalStateContext} from './GlobalStateContext';
import Zeit from '../brains/Zeit';
import {addOrdinalSuffix} from '../brains';

const AgeButton = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {globalState} = useContext(GlobalStateContext);
  let outputString = '';
  const modalHeading = 'Further Information:';
  let modalMessage = '';
  const ageObject = new Zeit(
    globalState.dob.value,
    globalState.dom.value,
    globalState.gestationInDays.value,
  );
  const ageInDaysCorrected = ageObject.calculate('days');
  const ageInDaysUncorrected = ageObject.calculate('days', false);
  let star = '*';
  if (ageInDaysCorrected === ageInDaysUncorrected) {
    star = '';
  }
  if (globalState.gestationInDays.value < 259 && ageInDaysCorrected < 15) {
    const correctedGestation =
      globalState.gestationInDays.value + ageInDaysUncorrected;
    const weeks = Math.floor(correctedGestation / 7);
    const days = correctedGestation % 7;
    outputString = `Corrected Gestation: ${weeks}+${days}`;
    modalMessage = `${addOrdinalSuffix(
      ageInDaysUncorrected + 1,
    )} day of life.\n\n Corrected gestation is given if born before 37 weeks gestation and not yet passed 42 weeks corrected gestation`;
  } else {
    let before = ageObject.calculate('string', false);
    let after = ageObject.calculate('string');
    if (before === after) {
      after = 'No correction necessary';
    }
    outputString = `Age: ${ageObject.calculate('string')}${star}`;
    modalMessage = `Age before correction:\n${before}\n\nAge after correction:\n${after}`;
  }

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}>
        <View style={styles.button}>
          <View style={styles.buttonContainer}>
            <AppText>{outputString}</AppText>
            <AppIcon
              size={25}
              name="information-outline"
              style={styles.infoIcon}
            />
          </View>
        </View>
      </TouchableOpacity>
      <AppModal
        modalVisible={modalVisible}
        cancelInput={() => setModalVisible(!modalVisible)}>
        <View style={styles.modalTextHeadingWrapper}>
          <AppText style={styles.modalTextHeadings}>{modalHeading}</AppText>
        </View>
        <AppText style={styles.modalTextParagraph}>{modalMessage}</AppText>
      </AppModal>
    </React.Fragment>
  );
};

export default AgeButton;

const styles = StyleSheet.create({
  modalTextHeadings: {
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
  modalTextHeadingWrapper: {
    borderRadius: 5,
    marginTop: 0,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark,
    padding: 10,
    margin: 10,
  },
  modalTextParagraph: {
    color: colors.black,
    marginBottom: 5,
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 17,
    marginLeft: 15,
    marginRight: 15,
    fontWeight: '400',
    paddingBottom: 30,
    // backgroundColor: "green",
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIcon: {
    marginLeft: 10,
  },
  button: {
    ...theme.button,
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
});
