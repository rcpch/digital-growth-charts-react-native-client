import React, {useState} from 'react';
import {Text, TextStyle} from 'react-native';

import AppModal from '../../AppModal';

type Proptypes = {
  pressedButtonArray: any[];
  setPressedButtonArray: Function;
  measurementMethod: 'height' | 'weight' | 'ofc' | 'bmi';
  customStyle: {
    background: {
      backgroundColor: string;
    };
    heading: TextStyle;
    paragraph: TextStyle;
    buttonBackground: {
      backgroundColor: string;
    };
    buttonText: TextStyle;
  };
};

function HiddenPopup({
  pressedButtonArray,
  setPressedButtonArray,
  measurementMethod,
  customStyle,
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
          `${!age ? `Gestation: ${gestation}` : `Age: ${age}`}.\n\n${
            measurementMethod === 'bmi'
              ? measurementData.y.toFixed(1)
              : measurementData.y
          }${units}: ${
            measurementData.centile_band
          }\n\n${correctionComment} on this measurement.`,
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
      }}
      style={customStyle.background}>
      <Text style={customStyle.heading}>
        {isMeasurement ? 'Measurement information:' : 'Further information:'}
      </Text>
      <Text style={customStyle.paragraph}>{outputText}</Text>
    </AppModal>
  );
}

export default HiddenPopup;
