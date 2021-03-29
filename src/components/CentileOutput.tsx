import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {containerWidth, colors} from '../config/';
import AppText from './AppText';
import MoreCentileInfo from './MoreCentileInfo';
import LoadingOrText from './LoadingOrText';
import AppIcon from './AppIcon';
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
  reference: string;
};

const CentileOutput = ({
  measurementProvided,
  measurementType,
  centileResults,
  errors,
  isLoading,
  reference,
}: propTypes) => {
  const navigation = useNavigation();

  const specificResults: null | Measurement = centileResults[measurementType];
  const specificError = errors[measurementType];

  let defaultOutput: string = 'No measurement given.';
  let measurementValue: string | number = 'N/A';
  let correctionApplied = false;
  let renderChart = false;

  if (measurementProvided && isLoading) {
    defaultOutput = '';
  } else if (measurementProvided && !isLoading) {
    if (specificError && typeof specificError === 'string') {
      defaultOutput = specificError;
    } else if (specificResults) {
      defaultOutput =
        specificResults.measurement_calculated_values.corrected_centile_band;
      renderChart = true;
      if (!defaultOutput) {
        defaultOutput =
          specificResults.measurement_calculated_values
            .corrected_measurement_error ||
          'Server did not respond with a recognised answer. Has the API changed?';
        renderChart = false;
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

  const navigateChart = () => {
    const objString = JSON.stringify({
      measurementType: measurementType,
      specificResults: specificResults && renderChart ? specificResults : null,
      reference: reference,
      userLabelNames: userLabelNames,
    });
    navigation.navigate('Chart', objString);
  };

  return (
    <View style={styles.outputContainer}>
      <MoreCentileInfo
        specificResults={specificResults}
        correctionApplied={correctionApplied}
      />

      <View style={styles.outputTextBox}>
        <AppText style={styles.text}>{titleText}</AppText>
        <View>
          <LoadingOrText style={styles.outputText}>
            {defaultOutput}
          </LoadingOrText>
        </View>
      </View>
      <TouchableOpacity onPress={navigateChart}>
        <AppIcon
          name="chart-bell-curve-cumulative"
          size={30}
          style={styles.gotToChartIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CentileOutput;

const styles = StyleSheet.create({
  outputContainer: {
    backgroundColor: colors.dark,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 5,
    marginTop: 5,
    marginBottom: 5,
    width: containerWidth,
    overflow: 'hidden',
  },
  outputTextBox: {
    marginTop: 15,
    marginBottom: 15,
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
  gotToChartIcon: {
    borderRadius: 5,
    backgroundColor: colors.medium,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 7,
  },
});
