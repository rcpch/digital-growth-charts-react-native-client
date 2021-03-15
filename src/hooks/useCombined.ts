import {useContext} from 'react';
import {
  GlobalStateContext,
  initialState,
  globalStateType,
  validMeasurementInputTypes,
} from '../components/GlobalStateContext';
import {ValidatorContext} from '../components/Validator';

export type globalSubStateType = {
  showPicker?: boolean;
  value?: validMeasurementInputTypes;
  timeStamp?: null | Date;
  workingValue?: validMeasurementInputTypes;
};

const useCombined = (name?: string) => {
  const {globalState, setGlobalState} = useContext(GlobalStateContext);
  const {
    updateSingleValidation,
    handleValidationReset,
    validation,
    handleSubmit,
    validationProforma,
  } = useContext(ValidatorContext);

  let buttonState: globalSubStateType = initialState.weight;
  let specificErrorMessage = '';
  let showErrorMessages = false;
  if (name) {
    buttonState = globalState[name];
    specificErrorMessage = validation.errorMessages[name];
    showErrorMessages = validation.showErrorMessages;
  }

  const combinedSetter = (inputState: globalSubStateType): void => {
    const localState = {...inputState};
    if (name) {
      // due to the way the android date picker works, logic has been moved here to put entered value into correct property:
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
    setGlobalState((state: globalStateType) => {
      const mutableState = {...state};
      for (const validationKey of Object.keys(validationProforma)) {
        for (const globalKey of Object.keys(globalState)) {
          if (validationKey === globalKey) {
            mutableState[globalKey] = initialState[globalKey];
            break;
          }
        }
      }
      return mutableState;
    });
    handleValidationReset();
  };

  const handleFinalSubmit = () => {
    handleSubmit(globalState);
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
