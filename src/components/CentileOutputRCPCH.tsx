import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View} from 'react-native';

import {addOrdinalSuffix, calculateBMI} from '../brains/oddBits';
import {getSingleCentileData} from '../brains/rcpchApi';
import Zeit from '../brains/Zeit';
import colors from '../config/colors';
import {containerWidth} from '../config/';
import AppText from './AppText';
import MoreCentileInfo from './MoreCentileInfo';
import {GlobalStateContext} from './GlobalStateContext';

const devAddress = 'local';

const parseExactCentile = (exact: number) => {
  if (typeof exact === 'number') {
    if (exact > 99.9) {
      return '>99.9th';
    } else if (exact < 0.1) {
      return '<0.1st';
    } else {
      return addOrdinalSuffix(exact);
    }
  } else {
    return 'N/A';
  }
};

const userLabelNames: {[index: string]: string} = {
  height: 'Height / Length',
  weight: 'Weight',
  bmi: 'BMI',
  ofc: 'Head Circumference',
};

type propTypes = {
  measurement: string;
  refreshState: any;
};

const CentileOutputRCPCH = ({measurement, refreshState}: propTypes) => {
  const {globalState} = useContext(GlobalStateContext);
  const [refresh, setRefresh] = refreshState;

  let measurementValue = globalState[measurement]?.value;
  let defaultOutput = 'No measurement given';
  if (!measurementValue) {
    if (
      measurement === 'bmi' &&
      globalState.weight.value &&
      globalState.height.value
    ) {
      measurementValue = calculateBMI(
        globalState.weight.value,
        globalState.height.value,
      );
    } else {
      measurementValue = null;
    }
  }

  if (measurementValue) {
    const ageObject = new Zeit(
      globalState.dob.value,
      globalState.dom.value,
      globalState.gestationInDays.value,
    );
    const ageInDaysCorrected = ageObject.calculate('days');
    if (ageInDaysCorrected < 15 && globalState.gestationInDays.value >= 259) {
      measurementValue = null;
      defaultOutput = 'Term infants cannot be plotted under 2 weeks of age';
    }
    if (measurement === 'height') {
      if (ageInDaysCorrected < -106) {
        measurementValue = null;
        defaultOutput =
          'UK-WHO length data does not exist in infants below 25 weeks gestation.';
      }
    }
    if (measurement === 'bmi' && ageObject.calculate('years') < 2) {
      measurementValue = null;
      defaultOutput = 'BMI cannot be plotted below 2 years of age.';
    }
    if (measurement === 'ofc') {
      const ageInYears = ageObject.calculate('years', true, false);
      if (
        (ageInYears > 17 && globalState.sex.value === 'Female') ||
        (ageInYears > 18 && globalState.sex.value === 'Male')
      ) {
        measurementValue = null;
        defaultOutput =
          'UK-WHO data for head circumference does not exist for over 17 years of age in girls and 18 years of age in boys.';
      }
    }
  }

  function makeInternalState() {
    const returnValue: {
      defaultOutput: string | number;
      fullAnswer: any;
      isLoading: boolean;
    } = {
      defaultOutput: measurementValue ? '' : defaultOutput,
      fullAnswer: {},
      isLoading: true,
    };
    return returnValue;
  }

  const [internalState, setInternalState] = useState(makeInternalState());

  let titleText = `${userLabelNames[measurement]}: N/A`;
  if (measurementValue) {
    switch (measurement) {
      case 'weight':
        titleText = `Weight: ${measurementValue}kg`;
        break;
      case 'ofc':
        titleText = `Head Circumference: ${measurementValue}cm`;
        break;
      case 'bmi':
        titleText = `BMI: ${measurementValue.toFixed(1)}kg/m²`;
        break;
      default:
        titleText = `${userLabelNames[measurement]}: ${measurementValue}cm`;
    }
  }

  const sds = internalState.fullAnswer.measurement_calculated_values?.sds || '';
  const centile =
    internalState.fullAnswer.measurement_calculated_values?.centile || '';

  const specificRefreshState = refresh[measurement];
  const isLoading = internalState.isLoading;

  useEffect(() => {
    let ignore = false;
    if (measurementValue && specificRefreshState === 'try') {
      if (!isLoading) {
        setInternalState((old) => {
          return {...old, ...{isLoading: true}};
        });
      }
      getSingleCentileData(
        globalState,
        measurement,
        __DEV__ ? devAddress : 'real',
      )
        .then((result) => {
          if (!ignore) {
            setInternalState({
              defaultOutput: result.measurement_calculated_values.centile_band,
              isLoading: false,
              fullAnswer: result,
            });
            setRefresh((old: any) => {
              return {...old, ...{[measurement]: 'success'}};
            });
          }
        })
        .catch((error) => {
          if (!ignore) {
            setInternalState((old) => {
              return {
                ...old,
                ...{defaultOutput: error.message, isLoading: false},
              };
            });
            setRefresh((old: any) => {
              return {...old, ...{[measurement]: 'fail'}};
            });
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [specificRefreshState]);

  return (
    <View style={styles.outputContainer}>
      <View style={styles.outputTextBox}>
        <AppText style={styles.text}>{titleText}</AppText>
        <View>
          <AppText style={styles.outputText}>
            {isLoading && measurementValue
              ? 'Loading answer...'
              : internalState.defaultOutput}
          </AppText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <MoreCentileInfo exactCentile={parseExactCentile(centile)} sds={sds} />
      </View>
    </View>
  );
};

export default CentileOutputRCPCH;

const styles = StyleSheet.create({
  outputContainer: {
    backgroundColor: colors.darkest,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginTop: 12,
    width: containerWidth,
    overflow: 'hidden',
  },
  outputTextBox: {
    margin: 20,
    textAlign: 'left',
    justifyContent: 'center',
    width: containerWidth - 105,
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
  },
});
