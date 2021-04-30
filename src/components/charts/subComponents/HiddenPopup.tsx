import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {colors} from '../../../config';

import AppModal from '../../AppModal';

type Proptypes = {
  pressedButtonArray: any[];
  setPressedButtonArray: Function;
  measurementMethod: 'height' | 'weight' | 'ofc' | 'bmi';
};

function HiddenPopup({
  pressedButtonArray,
  setPressedButtonArray,
  measurementMethod,
}: Proptypes) {
  const [modalVisible, setModalVisible] = useState(false);
  const [outputText, setOutputText] = useState('');
  const [isMeasurement, setIsMeasurement] = useState(false);

  if (pressedButtonArray.length > 0) {
    const measurementData = pressedButtonArray[0];
    if (!modalVisible) {
      if (measurementData.centile_band) {
        let units = '';
        if (measurementMethod === 'weight') {
          units = 'kg';
        } else if (measurementMethod === 'bmi') {
          units = 'kg/m²';
        } else {
          units = 'cm';
        }
        let age = measurementData.calendar_age;
        let gestation = measurementData.corrected_gestational_age;
        const correctionComment = measurementData.clinician_comment.slice(
          0,
          -1,
        );
        setOutputText(
          `${
            !age ? `Gestation: ${gestation}` : `Age: ${age}`
          }.\n\n${correctionComment} on this measurement.\n\n${
            measurementMethod === 'bmi'
              ? measurementData.y.toFixed(1)
              : measurementData.y
          }${units}: ${measurementData.centile_band}`,
        );
        setModalVisible(true);
        setIsMeasurement(true);
      } else {
        const name = measurementData.childName;
        if (
          name === 'term-line' ||
          name === 'puberty-line' ||
          name === 'delayed-puberty'
        ) {
          setOutputText(measurementData.l || measurementData.label);
          setModalVisible(true);
          setIsMeasurement(false);
        }
      }
    }
  }

  return (
    <AppModal
      modalVisible={modalVisible}
      cancelInput={() => {
        setModalVisible(false);
        setOutputText('');
        setPressedButtonArray([]);
      }}>
      <Text style={styles.heading}>
        {isMeasurement ? 'Measurement information:' : 'Further information:'}
      </Text>
      <Text style={styles.paragraph}>{outputText}</Text>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 16,
  },
  paragraph: {
    marginTop: 15,
    marginBottom: 10,
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    margin: 15,
    backgroundColor: colors.dark,
    padding: 10,
    borderRadius: 10,
    width: '90%',
    overflow: 'hidden',
  },
});

export default HiddenPopup;
