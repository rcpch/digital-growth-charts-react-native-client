import React from 'react';
import {StyleSheet, View} from 'react-native';

import {containerWidth, colors} from '../config/';
import AppText from './AppText';
import MoreCentileInfo from './MoreCentileInfo';
import LoadingOrText from './LoadingOrText';
import ChartModal from './ChartModal';

import {Measurement} from '../interfaces/RCPCHMeasurementObject';

const userLabelNames: {[index: string]: string} = {
  height: 'Height / Length',
  weight: 'Weight',
  bmi: 'BMI',
  ofc: 'Head Circumference',
};

type propTypes = {
  measurementProvided: boolean;
  measurementType: string;
  centileResults: {[key: string]: Measurement | null};
  errors: {[key: string]: string | boolean};
  isLoading: boolean;
};

const CentileOutput = ({
  measurementProvided,
  measurementType,
  centileResults,
  errors,
  isLoading,
}: propTypes) => {
  const specificResults: null | Measurement = centileResults[measurementType];
  const specificError = errors[measurementType];

  let defaultOutput: string = 'No measurement given.';
  let measurementValue: string | number = 'N/A';
  let correctionApplied = false;

  if (measurementProvided && isLoading) {
    defaultOutput = '';
  } else if (measurementProvided && !isLoading) {
    if (specificError && typeof specificError === 'string') {
      defaultOutput = specificError;
    } else if (specificResults) {
      defaultOutput =
        specificResults.measurement_calculated_values.corrected_centile_band;
      if (!defaultOutput) {
        defaultOutput =
          specificResults.measurement_calculated_values
            .corrected_measurement_error ||
          'Server did not respond with a recognised answer. Has the API changed?';
      }
      measurementValue =
        specificResults.child_observation_value.observation_value;
      if (
        specificResults.measurement_calculated_values.corrected_sds !==
          specificResults.measurement_calculated_values.chronological_sds &&
        (specificResults.measurement_dates.corrected_decimal_age > 0.0384 ||
          specificResults.measurement_dates.chronological_decimal_age !== 0) &&
        specificResults.birth_data.gestation_weeks < 37
      ) {
        correctionApplied = true;
      }
    }
  }

  let titleText = `${userLabelNames[measurementType]}: N/A`;

  if (measurementProvided && specificResults) {
    switch (measurementType) {
      case 'weight':
        titleText = `Weight: ${measurementValue}kg`;
        break;
      case 'ofc':
        titleText = `Head Circumference: ${measurementValue}cm`;
        break;
      case 'bmi':
        if (typeof measurementValue === 'number') {
          titleText = `BMI: ${measurementValue.toFixed(1)}kg/m²`;
        } else {
          titleText = 'BMI: N/A';
        }

        break;
      default:
        titleText = `${userLabelNames[measurementType]}: ${measurementValue}cm`;
    }
  }

  return (
    <View style={styles.outputContainer}>
      <View style={styles.outputTextBox}>
        <AppText style={styles.text}>{titleText}</AppText>
        <View>
          <LoadingOrText style={styles.outputText}>
            {defaultOutput}
          </LoadingOrText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <ChartModal
          measurementType={measurementType}
          specificResults={specificResults}
        />
        <MoreCentileInfo
          specificResults={specificResults}
          correctionApplied={correctionApplied}
        />
      </View>
    </View>
  );
};

export default CentileOutput;

const styles = StyleSheet.create({
  outputContainer: {
    backgroundColor: colors.darkest,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginTop: 5,
    marginBottom: 5,
    width: containerWidth,
    overflow: 'hidden',
  },
  outputTextBox: {
    margin: 20,
    textAlign: 'left',
    justifyContent: 'center',
    width: containerWidth - 155,
  },
  text: {
    fontSize: 18,
    textAlign: 'left',
    fontWeight: '500',
    paddingBottom: 10,
    color: colors.white,
  },
  outputText: {
    fontSize: 16,
    textAlign: 'left',
    color: colors.white,
    flexWrap: 'wrap',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
