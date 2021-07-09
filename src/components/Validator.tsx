import produce, {immerable} from 'immer';
import React, {useState} from 'react';
import {
  proformaObjectArgument,
  returnValidatorObject,
  validatorProviderProps,
  validatorStateType,
} from '../interfaces/Validator';

const wrongType = '↑ Are you sure you have entered a valid number?';
const outOfBounds = '↑ Are you sure this measurement is correct?';
const cumulative = "↑ We'll need at least one of these";
const dateRequired = "↑ We'll need a date of birth";

const proformaTemplate = {
  dob: {
    inputType: {
      param: 'Date',
      message: 'Invalid date',
    },
    isRequired: {
      param: true,
      message: dateRequired,
    },
    nullable: {
      param: true,
    },
  },
  dom: {
    inputType: {
      param: 'Date',
      message: 'Invalid date',
    },
    nullable: {
      param: true,
    },
  },
  sex: {
    inputType: {
      param: 'string',
      message: 'Sex not recognised',
    },
    isRequired: {
      param: true,
      message: "↑ We'll need a sex",
    },
  },
  gestationInDays: {
    inputType: {
      param: 'number',
      message: 'No recognised gestation',
    },
    nullable: {
      param: true,
    },
    isRequired: {
      param: true,
      message: "↑ We'll need a birth gestation",
    },
  },
  weight: {
    inputType: {
      param: 'number',
      message: wrongType,
    },
    countCumulative: {
      param: true,
      minCount: 1,
      message: cumulative,
    },
    min: {
      param: 0.1,
      message: outOfBounds,
    },
    max: {
      param: 250,
      message: outOfBounds,
    },
  },
  height: {
    inputType: {
      param: 'number',
      message: wrongType,
    },
    countCumulative: {
      param: true,
      minCount: 1,
      message: cumulative,
    },
    min: {
      param: 30,
      message: outOfBounds,
    },
    max: {
      param: 220,
      message: outOfBounds,
    },
  },
  ofc: {
    inputType: {
      param: 'number',
      message: wrongType,
    },
    countCumulative: {
      param: true,
      minCount: 1,
      message: cumulative,
    },
    min: {
      param: 10,
      message: outOfBounds,
    },
    max: {
      param: 100,
      message: outOfBounds,
    },
  },
  reference: {
    inputType: {
      param: 'string',
    },
  },
  devMode: {
    inputType: {
      param: 'string',
    },
  },
};

const blankContext: {
  updateSingleValidation: Function;
  handleValidationReset: Function;
  validation: any;
  giveSubmitFunctionIfAllowed: Function;
  validationProforma: {[key: string]: proformaObjectArgument};
} = {
  updateSingleValidation: () => {},
  handleValidationReset: () => {},
  validation: {},
  giveSubmitFunctionIfAllowed: () => {},
  validationProforma: {},
};

const ValidatorContext = React.createContext(blankContext);

// accurate javascript type checking
const getType = (obj: any): string => {
  // get toPrototypeString() of obj (handles all types)
  if (obj == null) {
    return (obj + '').toLowerCase();
  } // implicit toString() conversion

  const deepType = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
  if (deepType === 'generatorfunction') {
    return 'function';
  }

  // Prevent overspecificity (for example, [object HTMLDivElement], etc).
  // Account for functionish Regexp (Android <=2.3), functionish <object> element (Chrome <=57, Firefox <=52), etc.
  // String.prototype.match is universally supported.

  return deepType.match(/^(array|bigint|date|error|function|generator|regexp|symbol)$/)
    ? deepType
    : typeof obj === 'object' || typeof obj === 'function'
    ? 'object'
    : typeof obj;
};

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function makeValidator(validationProforma: proformaObjectArgument) {
  const relevant: proformaObjectArgument = produce(validationProforma, () => {});
  return function (value: any): returnValidatorObject {
    const outputObject = {
      errors: false,
      isRequiredError: '',
      minError: '',
      maxError: '',
      typeError: '',
      count: relevant.countCumulative ? 1 : 0,
    };
    let internalType = '';
    switch (getType(value)) {
      case 'number':
        internalType = 'number';
        break;
      case 'string':
        if (!Number.isNaN(Number(value))) {
          internalType = 'number';
        } else if (isEmailValid(value)) {
          internalType = 'email';
        } else {
          internalType = 'string';
        }
        break;
      case 'object':
        internalType = 'object';
        break;
      case 'date':
        internalType = 'Date';
        break;
      case 'null':
        if (relevant.nullable) {
          internalType = relevant.inputType.param;
        } else {
          internalType = 'null';
        }
        break;
      default:
        return produce(outputObject, (mutable) => {
          mutable.errors = true;
          mutable.typeError = 'Type entered not recognised by validator';
        });
    }
    if (internalType !== relevant.inputType.param) {
      // as type check for number in string classifies '' as number:
      if (!(value === '' && relevant.inputType.param === 'string')) {
        return produce(outputObject, (mutable) => {
          mutable.errors = true;
          mutable.typeError =
            relevant.inputType.message ||
            `Invalid type entered. Should be ${relevant.inputType.param} and it was ${internalType}`;
        });
      }
    }
    if (relevant.isRequired) {
      if (!value) {
        return produce(outputObject, (mutable) => {
          mutable.errors = true;
          mutable.isRequiredError = relevant.isRequired?.message || 'No entry found.';
        });
      }
    }
    if (relevant.countCumulative) {
      if (!value) {
        return produce(outputObject, (mutable) => {
          mutable.count = 0;
        });
      }
    }
    if (relevant.min) {
      if (Number(value) < relevant.min.param) {
        return produce(outputObject, (mutable) => {
          mutable.errors = true;
          mutable.minError = relevant.min?.message || 'Value too low.';
        });
      }
    }
    if (relevant.max) {
      if (Number(value) > relevant.max.param) {
        return produce(outputObject, (mutable) => {
          mutable.errors = true;
          mutable.maxError = relevant.max?.message || 'Value too high.';
        });
      }
    }
    return outputObject;
  };
}

// class to create validator state object:
class ValidatorState {
  cumulative: validatorStateType['cumulative'];
  errorMessages: validatorStateType['errorMessages'];
  proforma: validatorStateType['proforma'];
  untouched: validatorStateType['untouched'];
  showErrorMessages: validatorStateType['showErrorMessages'];
  [immerable] = true;

  constructor(proforma: {[key: string]: proformaObjectArgument}) {
    this.cumulative = {};
    this.errorMessages = {};
    this.proforma = produce(proforma, () => {});
    this.untouched = [];
    this.showErrorMessages = false;

    for (const [key, value] of Object.entries(proforma)) {
      this.errorMessages[key] = '';
      this.untouched.push(key);
      if (value.countCumulative) {
        this.cumulative[key] = 0;
      }
    }
  }
}

// checks to see if validation object contains sufficient validated values for cumulative threshold to have been reached:
const cumulativeThresholdReached = (validationObjectToCheck: validatorStateType): boolean => {
  let cumulativeCount = 0;
  let minCountToCheck: null | number = null;
  for (const subValue of Object.values(validationObjectToCheck.cumulative)) {
    cumulativeCount += subValue;
  }
  for (const subValue of Object.values(validationObjectToCheck.proforma)) {
    if (subValue.countCumulative?.minCount) {
      if (minCountToCheck === null) {
        minCountToCheck = subValue.countCumulative.minCount;
      } else if (minCountToCheck !== subValue.countCumulative.minCount) {
        throw new Error(
          'For cumulative entry checking, each minCount should be identical in proforma',
        );
      }
    }
  }
  if (minCountToCheck === null) {
    throw new Error('No valid minCount found in proforma');
  }
  if (cumulativeCount < minCountToCheck) {
    return false;
  }
  return true;
};

// updates validation based on new value being passed to it:
const updateValidationObject = (
  oldValidation: validatorStateType,
  currentName: string,
  newValue: any,
): validatorStateType => {
  const customValidator = makeValidator(oldValidation.proforma[currentName]);
  const evaluation = customValidator(newValue);
  return produce(oldValidation, (mutable) => {
    if (evaluation.count) {
      mutable.cumulative[currentName] = evaluation.count;
    } else if (!evaluation.count && mutable.cumulative[currentName] !== undefined) {
      mutable.cumulative[currentName] = 0;
    }
    if (evaluation.errors) {
      for (const [key, subValue] of Object.entries(evaluation)) {
        if (key !== 'errors' && key !== 'count' && subValue) {
          mutable.errorMessages[currentName] = subValue;
          break;
        }
      }
    } else {
      mutable.errorMessages[currentName] = '';
    }
    const newUntouchedArray = mutable.untouched.filter((item) => item !== currentName);
    mutable.untouched = newUntouchedArray;
  });
};

// uses cumlativeThresholdReached function and puts appropriate error messages in validation if errors found:
const updateCumulative = (validatorState: validatorStateType): validatorStateType => {
  return produce(validatorState, (mutableState) => {
    if (JSON.stringify(mutableState.cumulative) !== JSON.stringify({})) {
      const genericCumulativeErrorMessage =
        'Minimum threshold of entries not reached for specified fields';
      if (!cumulativeThresholdReached(mutableState)) {
        for (const [key, subValue] of Object.entries(mutableState.proforma)) {
          if (subValue.countCumulative) {
            mutableState.errorMessages[key] =
              subValue.countCumulative.message || genericCumulativeErrorMessage;
          }
        }
      } else {
        for (const [key, subValue] of Object.entries(mutableState.proforma)) {
          const cumulativeErrorMessage =
            subValue.countCumulative?.message || genericCumulativeErrorMessage;
          if (mutableState.errorMessages[key] === cumulativeErrorMessage) {
            mutableState.errorMessages[key] = '';
          }
        }
      }
    }
  });
};

// handles submit. Shows errors if present, passes verified values to a custom submit function if no errors.
const updateValidationBeforeSubmit = (
  oldValidation: validatorStateType,
  globalState: any,
): validatorStateType => {
  let validationState = produce(oldValidation, () => {});
  //validate untouched values:
  if (validationState.untouched.length > 0) {
    const untouchedNames = [...validationState.untouched];
    for (const valueName of untouchedNames) {
      const inputValue = globalState[valueName].value;
      validationState = updateValidationObject(validationState, valueName, inputValue);
    }
  }
  // check for any cumulative entry errors and update:
  validationState = updateCumulative(validationState);
  // Show errors if errors present:

  validationState = produce(validationState, (mutable) => {
    for (const individualError of Object.values(mutable.errorMessages)) {
      if (individualError) {
        mutable.showErrorMessages = true;
        break;
      } else {
        mutable.showErrorMessages = false;
      }
    }
  });

  return validationState;
};

// react component:
const ValidatorProvider = ({
  children,
  validationProforma,
  customSubmitFunction,
}: validatorProviderProps) => {
  const [validation, setValidation]: [validatorStateType, Function] = useState(
    new ValidatorState(validationProforma),
  );

  const handleValidationReset = () => setValidation(new ValidatorState(validationProforma));

  // updates validation object on single value passed to it:
  const updateSingleValidation = (name: string, value: any): void => {
    let newValidation = updateValidationObject(validation, name, value);
    if (newValidation.showErrorMessages) {
      newValidation = updateCumulative(newValidation);
    }
    setValidation(newValidation);
  };

  const giveSubmitFunctionIfAllowed = (globalState: any) => {
    const newValidation = updateValidationBeforeSubmit(validation, globalState);
    setValidation(newValidation);
    if (newValidation.showErrorMessages === true) {
      return null;
    } else {
      return customSubmitFunction;
    }
  };

  return (
    <ValidatorContext.Provider
      value={{
        updateSingleValidation,
        handleValidationReset,
        giveSubmitFunctionIfAllowed,
        validation,
        validationProforma,
      }}>
      {children}
    </ValidatorContext.Provider>
  );
};

export {ValidatorContext, ValidatorProvider, proformaTemplate};
