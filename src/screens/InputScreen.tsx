import React, {useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';
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
  initialState,
} from '../components';

import Zeit from '../brains/Zeit';
import WheelPicker from '../components/pickers/WheelPicker';
import {globalStateType} from '../interfaces/GlobalState';

const ChildCentile = () => {
  const navigation = useNavigation();
  const {globalState, setGlobalState} = useContext(GlobalStateContext);

  const [turnerSelected, setTurnerSelected] = useState(false);

  const referenceArray = [
    {label: 'UK-WHO', value: 'uk-who'},
    {label: "Down's Syndrome", value: 'trisomy-21'},
    {label: "Turner's Syndrome", value: 'turner'},
  ];

  const submitFunction = () => {
    const ageObject = new Zeit(
      globalState.dob.value,
      globalState.dom.value,
      globalState.gestationInDays.value,
    );
    const ageInYears = ageObject.calculate('years', true, false);
    if (ageInYears < 0) {
      const uncorrected = ageObject.calculate('years', false);
      if (uncorrected < 0) {
        Alert.alert(
          'Time Travelling Patient',
          'Please check the dates entered',
          [{text: 'OK', onPress: () => {}}],
        );
      } else {
        navigation.navigate('Results');
      }
    } else if (ageInYears > 20) {
      Alert.alert(
        'Patient Too Old',
        'This calculator can only be used under 20 years of age',
        [{text: 'OK', onPress: () => {}}],
      );
    } else {
      navigation.navigate('Results');
    }
  };

  // disables input for measurements not available with turner:
  useEffect(() => {
    if (globalState.reference.value === 'turner' && !turnerSelected) {
      setGlobalState((old: globalStateType) => {
        const mutable = {...old};
        mutable.weight = initialState.weight;
        mutable.ofc = initialState.ofc;
        if (mutable.sex.value === 'Male') {
          mutable.sex.value = 'Female';
          mutable.sex.workingValue = 'Female';
          mutable.sex.timeStamp = new Date();
        }
        return mutable;
      });
      setTurnerSelected(true);
    } else if (turnerSelected && globalState.reference.value !== 'turner') {
      setTurnerSelected(false);
    }
  }, [globalState, setGlobalState, turnerSelected]);

  return (
    <Screen title="Enter Measurements:">
      <ValidatorProvider
        validationProforma={proformaTemplate}
        customSubmitFunction={submitFunction}>
        <KeyboardAwareScrollView>
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
          <SubmitOrReset reset>Reset</SubmitOrReset>
          <SubmitOrReset submit>Calculate Centiles</SubmitOrReset>
        </KeyboardAwareScrollView>
      </ValidatorProvider>
    </Screen>
  );
};

export default ChildCentile;
