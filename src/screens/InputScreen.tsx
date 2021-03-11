import React, {useContext} from 'react';
import {Alert} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';

import {
  BinarySelector,
  ValidatorProvider,
  proformaTemplate,
  Screen,
  GlobalStateContext,
} from '../components';
import DateInputButton from '../components/pickers/DateInputButton';
import TextInputButton from '../components/pickers/TextInputButton';
import SubmitOrReset from '../components/SubmitOrReset';
import Zeit from '../brains/Zeit';

const validationProforma = {
  sex: proformaTemplate.sex,
  dob: proformaTemplate.dob,
  dom: proformaTemplate.dom,
  weight: proformaTemplate.weight,
  height: proformaTemplate.height,
  ofc: proformaTemplate.ofc,
};

const ChildCentile = () => {
  const navigation = useNavigation();
  const {globalState} = useContext(GlobalStateContext);
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
  return (
    <Screen>
      <ValidatorProvider
        validationProforma={validationProforma}
        customSubmitFunction={submitFunction}>
        <KeyboardAwareScrollView>
          <DateInputButton dateName="dob" />
          <BinarySelector
            name="sex"
            userLabel="Sex"
            trueValue="Male"
            falseValue="Female"
            iconName="all-inclusive"
          />
          <TextInputButton
            name="weight"
            userLabel="Weight"
            iconName="chart-bar"
            unitsOfMeasurement="kg"
          />
          <TextInputButton
            name="height"
            userLabel="Height / Length"
            iconName="arrow-up-down"
            unitsOfMeasurement="cm"
          />
          <TextInputButton
            name="ofc"
            userLabel="Head Circumference"
            iconName="emoticon-outline"
            unitsOfMeasurement="cm"
          />
          <DateInputButton dateName="dom" />
          <SubmitOrReset reset>Reset</SubmitOrReset>
          <SubmitOrReset submit>Calculate Centiles</SubmitOrReset>
        </KeyboardAwareScrollView>
      </ValidatorProvider>
    </Screen>
  );
};

export default ChildCentile;
