import React, {useRef, useEffect} from 'react';
import {Animated, StyleSheet, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {containerWidth, colors} from '../config/';
import AppText from './AppText';
import MoreCentileInfo from './MoreCentileInfo';
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

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const specificResults: null | Measurement = centileResults[measurementType];
  const specificError = errors[measurementType];

  let defaultOutput: string = 'No measurement given.';
  let measurementValue: string | number = '';
  let renderChart = false;

  if (isLoading && measurementProvided) {
    defaultOutput = 'Loading...';
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
    }
  }

  let titleText = `${userLabelNames[measurementType]}`;

  if (!isLoading && measurementProvided && specificResults) {
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
    const navObj = {
      measurementType: measurementType,
      specificResults: specificResults && renderChart ? specificResults : null,
      reference: reference,
      userLabelNames: userLabelNames,
    };
    navigation.navigate('Chart', navObj);
  };

  useEffect(() => {
    if (measurementProvided) {
      const fadeOut = Animated.timing(fadeAnim, {
        toValue: 0.6,
        duration: 600,
        useNativeDriver: true,
      });

      const fadeIn = Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      });

      const sequence = Animated.sequence([fadeOut, fadeIn]);
      if (isLoading) {
        Animated.loop(sequence).start();
      } else if (!isLoading) {
        Animated.loop(sequence).reset();
        fadeAnim.setValue(1);
      }
      return () => {
        Animated.loop(sequence).reset();
        fadeAnim.setValue(1);
      };
    }
  }, [isLoading, measurementProvided, fadeAnim]);

  return (
    <Animated.View style={{...styles.outputContainer, opacity: fadeAnim}}>
      <MoreCentileInfo
        specificResults={specificResults}
        isLoading={isLoading}
      />
      <View style={styles.outputTextBox}>
        <AppText style={styles.text}>{titleText}</AppText>
        <View>
          <AppText style={styles.outputText}>{defaultOutput}</AppText>
        </View>
      </View>
      <TouchableOpacity disabled={isLoading} onPress={navigateChart}>
        <AppIcon
          name="chart-bell-curve-cumulative"
          size={30}
          style={styles.goToChartIcon}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CentileOutput;

const styles = StyleSheet.create({
  outputContainer: {
    backgroundColor: colors.darkMedium,
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
  goToChartIcon: {
    borderRadius: 5,
    backgroundColor: colors.medium,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 7,
  },
});
