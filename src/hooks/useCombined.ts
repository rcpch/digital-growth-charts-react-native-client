import {Alert} from 'react-native';
import {useContext} from 'react';
import produce from 'immer';

import {calculateBMI} from '../brains';
import {
  GlobalStateContext,
  initialState,
  MakeInitialState,
} from '../components/GlobalStateContext';
import {ValidatorContext} from '../components/Validator';

import {globalStateType, Names} from '../interfaces/GlobalState';
import {proformaObjectArgument} from '../interfaces/Validator';

type NameArray = Names[];

// check timestamps of measurements from global state. Can change how many mins old the threshold is
const checkTimeStamps = (
  globalObject: globalStateType,
  validationProforma: {[key: string]: proformaObjectArgument},
  minsAgo = 2,
): NameArray => {
  const nameArray: NameArray = [];
  const now = new Date();
  for (const [key, value] of Object.entries(globalObject)) {
    for (const validationName of Object.keys(validationProforma)) {
      if (value.timeStamp && key === validationName) {
        const timeStamp = value.timeStamp;
        const millisecondDifference = now.getTime() - timeStamp.getTime();
        if (millisecondDifference > minsAgo * 1000 * 60) {
          nameArray.push(key);
        }
        break;
      }
    }
  }
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

const returnUpdatedGlobalState = (
  globalValues: globalStateType,
  oldValueArray: NameArray,
) => {
  return produce(globalValues, (mutableObject) => {
    const now = new Date();
    for (let i = 0; i < oldValueArray.length; i++) {
      mutableObject[oldValueArray[i]].timeStamp = now;
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
            const updatedGlobalState = returnUpdatedGlobalState(
              globalValues,
              oldValueArray,
            );
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
  }: {globalState: globalStateType; setGlobalState: Function} = useContext(
    GlobalStateContext,
  );
  const {
    updateSingleValidation,
    handleValidationReset,
    validation,
    giveSubmitFunctionIfAllowed,
    validationProforma,
  } = useContext(ValidatorContext);

  let buttonState = initialState.weight;
  let specificErrorMessage = '';
  let showErrorMessages = false;
  if (name) {
    buttonState = globalState[name];
    specificErrorMessage = validation.errorMessages[name];
    showErrorMessages = validation.showErrorMessages;
  }

  const combinedSetter = (inputState: {[key: string]: any}): void => {
    let localState = produce(inputState, () => {});
    if (name) {
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
      setGlobalState((oldState: globalStateType) => {
        const oldStateForMerge = produce(oldState, () => {});
        let merge = {...oldStateForMerge[name], ...localState};
        if (localState.value !== undefined) {
          merge = produce(merge, (draft) => {
            draft.timeStamp =
              initialState[name].value === draft.value ? null : new Date();
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

  const handleFinalSubmit = () => {
    let workingState = produce(globalState, () => {});
    const customSubmitFunction = giveSubmitFunctionIfAllowed(workingState);
    if (customSubmitFunction) {
      //create bmi:
      if (globalState.weight.value && globalState.height.value) {
        const bmiValue = calculateBMI(
          workingState.weight.value,
          workingState.height.value,
        );
        workingState = produce(workingState, (mutable) => {
          mutable.bmi = {...mutable.weight};
          mutable.bmi.value = '' + bmiValue;
          mutable.bmi.value = '' + bmiValue;
        });
      }
      // remove bmi if previously entered and valid measurements not there:
      else if (
        globalState.bmi.value &&
        (!globalState.weight.value || !globalState.height.value)
      ) {
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
