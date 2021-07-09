import React, {useContext, useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';

import {
  BinarySelector,
  DateInputButton,
  TextInputButton,
  GestationInputButton,
  SubmitOrReset,
  ValidatorProvider,
  proformaTemplate,
  Screen,
  GlobalStateContext,
  WheelPicker,
  MakeSubState,
} from '../components';
import {zeit} from '../brains/';

import {globalStateType} from '../interfaces/GlobalState';
import produce from 'immer';

const referenceArray = [
  {label: 'UK-WHO', value: 'uk-who'},
  {label: "Down's Syndrome", value: 'trisomy-21'},
  {label: "Turner's Syndrome", value: 'turner'},
];

const devModeArray = [
  {label: 'Local', value: 'local'},
  {label: 'LAN', value: 'lan'},
  {label: 'Real', value: 'real'},
];

function InputScreen() {
  const navigation = useNavigation();
  const {globalState, setGlobalState} = useContext(GlobalStateContext);

  const [turnerSelected, setTurnerSelected] = useState(false);

  const submitFunction = () => {
    const ageCalc = zeit(
      globalState.dob.value,
      globalState.dom.value,
      globalState.gestationInDays.value,
    );
    const ageInYears = ageCalc('years', true, false);
    if (ageInYears < 0) {
      const uncorrected = ageCalc('years', false);
      if (uncorrected < 0) {
        Alert.alert('Time Travelling Patient', 'Please check the dates entered', [
          {text: 'OK', onPress: () => {}},
        ]);
      } else {
        navigation.navigate('Results');
      }
    } else if (ageInYears > 20) {
      Alert.alert('Patient Too Old', 'This calculator can only be used under 20 years of age', [
        {text: 'OK', onPress: () => {}},
      ]);
    } else {
      navigation.navigate('Results');
    }
  };

  // disables input for measurements not available with turner:
  if (globalState.reference.value === 'turner' && !turnerSelected) {
    setGlobalState((old: globalStateType) => {
      return produce(old, (mutable) => {
        mutable.weight = MakeSubState('weight');
        mutable.ofc = MakeSubState('ofc');
        if (mutable.sex.value === 'Male') {
          mutable.sex.value = 'Female';
          mutable.sex.workingValue = 'Female';
          mutable.sex.timeStamp = new Date();
        }
      });
    });
    setTurnerSelected(true);
  } else if (turnerSelected && globalState.reference.value !== 'turner') {
    setTurnerSelected(false);
  }

  return (
    <Screen title="Enter Measurements:">
      <ValidatorProvider
        validationProforma={proformaTemplate}
        customSubmitFunction={submitFunction}>
        <KeyboardAwareScrollView style={styles.scrollView}>
          <DateInputButton dateName="dob" />
          <GestationInputButton />
          <BinarySelector
            name="sex"
            userLabel="Sex"
            trueValue="Male"
            falseValue="Female"
            iconName="all-inclusive"
          />
          {!turnerSelected && (
            <TextInputButton
              name="weight"
              userLabel="Weight"
              iconName="chart-bar"
              unitsOfMeasurement="kg"
            />
          )}
          <TextInputButton
            name="height"
            userLabel="Height / Length"
            iconName="arrow-up-down"
            unitsOfMeasurement="cm"
          />
          {!turnerSelected && (
            <TextInputButton
              name="ofc"
              userLabel="Head Circumference"
              iconName="emoticon-outline"
              unitsOfMeasurement="cm"
            />
          )}
          <DateInputButton dateName="dom" />
          <WheelPicker
            iconName="note-text-outline"
            name="reference"
            userLabel="Reference"
            pickerArray={referenceArray}
          />
          {__DEV__ && (
            <WheelPicker
              iconName="dev-to"
              name="devMode"
              userLabel="***Dev*** Server"
              pickerArray={devModeArray}
            />
          )}
          <SubmitOrReset reset>Reset</SubmitOrReset>
          <SubmitOrReset submit>Calculate Centiles</SubmitOrReset>
        </KeyboardAwareScrollView>
      </ValidatorProvider>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginTop: 4,
  },
});

export default InputScreen;
