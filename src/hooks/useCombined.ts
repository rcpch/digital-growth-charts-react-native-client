import {Alert} from 'react-native';
import {useContext} from 'react';
import produce from 'immer';

import {calculateBMI} from '../brains';
import {GlobalStateContext, initialState, MakeInitialState} from '../components/GlobalStateContext';
import {ValidatorContext} from '../components/Validator';

import {dateStore, globalStateType, Names, numberStore, textStore} from '../interfaces/GlobalState';
import {proformaObjectArgument} from '../interfaces/Validator';

type NameArray = Names[];

// check timestamps of measurements from global state. Can change how many mins old the threshold is
const checkTimeStamps = (
  globalObject: globalStateType,
  validationProforma: {[key: string]: proformaObjectArgument},
  minsAgo = 2,
): NameArray => {
  const nameArray: NameArray = [];
  const allTimeStamps: {name: Names; timeStamp: Date}[] = [];
  for (const [key, value] of Object.entries(globalObject)) {
    if (value.timeStamp) {
      allTimeStamps.push({name: key as Names, timeStamp: value.timeStamp});
    }
  }
  const now = new Date();
  allTimeStamps.forEach((element) => {
    if (validationProforma[element.name] !== undefined) {
      const millisecondDifference = now.getTime() - element.timeStamp.getTime();
      if (millisecondDifference > minsAgo * 1000 * 60) {
        nameArray.push(element.name);
      }
    }
  });
  return nameArray;
};

const nameLookup = {
  height: 'Height / Length',
  weight: 'Weight',
  ofc: 'Head Circumference',
  sex: 'Sex',
  gestationInDays: 'Birth Gestation',
  dob: 'Date of Birth',
  dom: 'Date of Measurement',
  reference: 'Reference',
};

const updateAllTimeStampsToNow = (globalValues: globalStateType, oldValueArray: NameArray) => {
  return produce(globalValues, (mutableObject) => {
    const now = new Date();
    for (const oldValueName of oldValueArray) {
      mutableObject[oldValueName].timeStamp = now;
    }
  });
};

// handles old measurements if the timestamp is considered old by the checkTimeStamps function. Submits if all OK.
const checkForOldValuesAndFinalSubmit = (
  finalSubmitFunction: Function,
  setGlobalState: Function,
  globalValues: globalStateType,
  validationProforma: {[key: string]: proformaObjectArgument},
) => {
  const oldValueArray = checkTimeStamps(globalValues, validationProforma);
  if (oldValueArray.length > 0) {
    let oldValuesString = '';
    for (let i = 0; i < oldValueArray.length; i++) {
      for (const [nameKey, nameValue] of Object.entries(nameLookup)) {
        if (oldValueArray[i] === nameKey) {
          const ending = i === oldValueArray.length - 1 ? '.' : ', ';
          oldValuesString = oldValuesString + nameValue + ending;
        }
      }
    }
    Alert.alert(
      'Are all measurements still valid?',
      `\nThe following measurements were entered more than 2 minutes ago: ${oldValuesString}\n\nDo you still want to continue?`,
      [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: 'Yes',
          onPress: () => {
            const updatedGlobalState = updateAllTimeStampsToNow(globalValues, oldValueArray);
            setGlobalState(updatedGlobalState);
            finalSubmitFunction(updatedGlobalState);
          },
        },
      ],
      {cancelable: false},
    );
  } else {
    setGlobalState(globalValues);
    finalSubmitFunction(globalValues);
  }
};

const useCombined = (name?: keyof globalStateType) => {
  const {
    globalState,
    setGlobalState,
  }: {globalState: globalStateType; setGlobalState: Function} = useContext(GlobalStateContext);
  const {
    updateSingleValidation,
    handleValidationReset,
    validation,
    giveSubmitFunctionIfAllowed,
    validationProforma,
  } = useContext(ValidatorContext);

  const buttonState = name ? globalState[name] : null;
  let specificErrorMessage = '';
  let showErrorMessages = false;
  if (name) {
    specificErrorMessage = validation.errorMessages[name];
    showErrorMessages = validation.showErrorMessages;
  }

  const combinedSetter = (inputState: {[key: string]: any}): void => {
    if (name) {
      let localState = produce(inputState, () => {});
      // due to the way the android date picker works, logic has been moved here to put workingValue into value:
      localState = produce(localState, (draft) => {
        if (
          draft.workingValue &&
          draft.showPicker === false &&
          draft.workingValue !== draft.value
        ) {
          draft.value = draft.workingValue;
        }
      });
      // update state:
      setGlobalState((oldState: {[key: string]: any}) => {
        const oldStateForMerge = produce(oldState, () => {});
        let merge: textStore | dateStore | numberStore = {...oldStateForMerge[name], ...localState};
        if (localState.value !== undefined) {
          merge = produce(merge, (draft) => {
            draft.timeStamp = initialState[name].value === draft.value ? null : new Date();
          });
        }
        return produce(oldStateForMerge, (draft) => {
          draft[name] = merge;
        });
      });
      // run validation:
      if (localState.value !== undefined) {
        updateSingleValidation(name, localState.value);
      }
    }
  };

  const combinedReset = (): void => {
    setGlobalState(MakeInitialState());
    handleValidationReset();
  };

  const handleFinalSubmit = (): void => {
    let workingState = produce(globalState, () => {});
    const customSubmitFunction = giveSubmitFunctionIfAllowed(workingState);
    if (customSubmitFunction) {
      //create bmi:
      if (globalState.weight.value && globalState.height.value) {
        workingState = produce(workingState, (mutable) => {
          const bmiValue = calculateBMI(mutable.weight.value, mutable.height.value);
          mutable.bmi = {...mutable.weight};
          mutable.bmi.value = '' + bmiValue;
          mutable.bmi.value = '' + bmiValue;
        });
      }
      // remove bmi if previously entered and valid measurements not there:
      else if (globalState.bmi.value && (!globalState.weight.value || !globalState.height.value)) {
        workingState = produce(workingState, (mutable) => {
          mutable.bmi = {...initialState.bmi};
        });
      }
      checkForOldValuesAndFinalSubmit(
        customSubmitFunction,
        setGlobalState,
        workingState,
        validationProforma,
      );
    }
  };

  return {
    handleFinalSubmit,
    combinedSetter,
    combinedReset,
    buttonState,
    initialState,
    specificErrorMessage,
    showErrorMessages,
  };
};

export default useCombined;
