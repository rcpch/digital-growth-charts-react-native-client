import {useContext} from 'react';
import {calculateBMI} from '../brains';
import {
  GlobalStateContext,
  initialState,
} from '../components/GlobalStateContext';
import {ValidatorContext} from '../components/Validator';

import {globalStateType} from '../interfaces/GlobalState';

const useCombined = (name?: keyof globalStateType) => {
  const {globalState, setGlobalState} = useContext(GlobalStateContext);
  const {
    updateSingleValidation,
    handleValidationReset,
    validation,
    handleSubmit,
  } = useContext(ValidatorContext);

  let buttonState = initialState.weight;
  let specificErrorMessage = '';
  let showErrorMessages = false;
  if (name) {
    buttonState = globalState[name];
    specificErrorMessage = validation.errorMessages[name];
    showErrorMessages = validation.showErrorMessages;
  }

  const combinedSetter = (inputState: any): void => {
    const localState = {...inputState};
    if (name) {
      // due to the way the android date picker works, logic has been moved here to put workingValue into value:
      if (
        localState.workingValue &&
        localState.showPicker === false &&
        localState.workingValue !== localState.value
      ) {
        localState.value = inputState.workingValue;
      }
      // update state:
      setGlobalState((oldState: globalStateType) => {
        const merge = {...oldState[name], ...localState};
        if (localState.value !== undefined) {
          merge.timeStamp =
            initialState[name].value === merge.value ? null : new Date();
        }
        const mutableState = {...oldState};
        mutableState[name] = merge;
        return mutableState;
      });
      // run validation:
      if (localState.value !== undefined) {
        updateSingleValidation(name, localState.value);
      }
    }
  };

  const combinedReset = (): void => {
    setGlobalState(initialState);
    handleValidationReset();
  };

  const handleFinalSubmit = () => {
    const workingState = {...globalState};
    //create bmi:
    if (globalState.weight.value && globalState.height.value) {
      const bmiValue = calculateBMI(
        workingState.weight.value,
        workingState.height.value,
      );
      workingState.bmi = {
        ...globalState.weight,
        ...{value: bmiValue, workingValue: bmiValue},
      };
      setGlobalState(workingState);
    }
    // handleSubmit from validator:
    handleSubmit(workingState);
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
