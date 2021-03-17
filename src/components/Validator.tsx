import React, {useState} from 'react';

type proformaObjectArgument = {
  inputType: {param: string; message?: string};
  isRequired?: {param: boolean; message?: string};
  min?: {param: number; message?: string};
  max?: {param: number; message?: string};
  countCumulative?: {param: boolean; minCount: number; message?: string};
  nullable?: {param: boolean; message?: string};
};

type returnValidatorObject = {
  errors: boolean;
  isRequiredError: string;
  minError: string;
  maxError: string;
  typeError: string;
  count: number;
};

type validatorProviderProps = {
  children?: React.ReactNode;
  validationProforma: {[key: string]: proformaObjectArgument};
  customSubmitFunction: Function;
};

export type validatorStateType = {
  cumulative: {[key: string]: number};
  errorMessages: {[key: string]: any};
  proforma: {[key: string]: proformaObjectArgument};
  untouched: string[];
  showErrorMessages: boolean;
};

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
};

const blankContext: {
  updateSingleValidation: Function;
  handleValidationReset: Function;
  validation: any;
  handleSubmit: Function;
  validationProforma: {[key: string]: proformaObjectArgument};
} = {
  updateSingleValidation: () => {},
  handleValidationReset: () => {},
  validation: {},
  handleSubmit: () => {},
  validationProforma: {},
};

const ValidatorContext = React.createContext(blankContext);

// accurate javascript type checking

const getType = (obj: any): string => {
  // get toPrototypeString() of obj (handles all types)
  if (obj == null) {
    return (obj + '').toLowerCase();
  } // implicit toString() conversion

  const deepType = Object.prototype.toString
    .call(obj)
    .slice(8, -1)
    .toLowerCase();
  if (deepType === 'generatorfunction') {
    return 'function';
  }

  // Prevent overspecificity (for example, [object HTMLDivElement], etc).
  // Account for functionish Regexp (Android <=2.3), functionish <object> element (Chrome <=57, Firefox <=52), etc.
  // String.prototype.match is universally supported.

  return deepType.match(
    /^(array|bigint|date|error|function|generator|regexp|symbol)$/,
  )
    ? deepType
    : typeof obj === 'object' || typeof obj === 'function'
    ? 'object'
    : typeof obj;
};

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// class for creating tailored validator object:

class Validator {
  inputType: proformaObjectArgument['inputType'];
  isRequired: proformaObjectArgument['isRequired'];
  min: proformaObjectArgument['min'];
  max: proformaObjectArgument['max'];
  countCumulative: proformaObjectArgument['countCumulative'];
  nullable: proformaObjectArgument['nullable'];
  constructor(proformaObjectArgument: proformaObjectArgument) {
    if (!proformaObjectArgument) {
      throw new Error('Validator needs proformas for every measurement entry');
    }
    this.inputType = proformaObjectArgument.inputType;
    this.isRequired = proformaObjectArgument.isRequired;
    this.min = proformaObjectArgument.min;
    this.max = proformaObjectArgument.max;
    this.nullable = proformaObjectArgument.nullable;
    this.countCumulative = proformaObjectArgument.countCumulative;
  }
  validate(value: any): returnValidatorObject {
    const outputObject = {
      errors: false,
      isRequiredError: '',
      minError: '',
      maxError: '',
      typeError: '',
      count: this.countCumulative ? 1 : 0,
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
        if (this.nullable) {
          internalType = this.inputType.param;
        } else {
          internalType = 'null';
        }
        break;
      default:
        outputObject.errors = true;
        outputObject.typeError = 'Type entered not recognised by validator';
        return outputObject;
    }
    if (internalType !== this.inputType.param) {
      // as type check for number in string classifies '' as number:
      if (!(value === '' && this.inputType.param === 'string')) {
        outputObject.errors = true;
        outputObject.typeError =
          this.inputType.message ||
          `Invalid type entered. Should be ${this.inputType.param} and it was ${internalType}`;
        return outputObject;
      }
    }
    if (this.isRequired) {
      if (!value) {
        outputObject.errors = true;
        outputObject.isRequiredError =
          this.isRequired.message || 'No entry found.';
        return outputObject;
      }
    }
    if (this.countCumulative) {
      if (!value) {
        outputObject.count = 0;
        return outputObject;
      }
    }
    if (this.min) {
      if (Number(value) < this.min.param) {
        outputObject.errors = true;
        outputObject.minError = this.min.message || 'Value too low.';
        return outputObject;
      }
    }
    if (this.max) {
      if (Number(value) > this.max.param) {
        outputObject.errors = true;
        outputObject.maxError = this.max.message || 'Value too high.';
      }
    }
    return outputObject;
  }
}

// react component:

const ValidatorProvider = ({
  children,
  validationProforma,
  customSubmitFunction,
}: validatorProviderProps) => {
  // class to create validator state object:
  class ValidatorState {
    cumulative: validatorStateType['cumulative'];
    errorMessages: validatorStateType['errorMessages'];
    proforma: validatorStateType['proforma'];
    untouched: validatorStateType['untouched'];
    showErrorMessages: validatorStateType['showErrorMessages'];

    constructor(proforma: {[key: string]: proformaObjectArgument}) {
      this.cumulative = {};
      this.errorMessages = {};
      this.proforma = proforma;
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

  const [validation, setValidation] = useState(
    new ValidatorState(validationProforma),
  );

  const handleValidationReset = () =>
    setValidation(new ValidatorState(validationProforma));

  // checks to see if validation object contains sufficient validated values for cumulative threshold to have been reached:
  const cumulativeThresholdReached = (
    validationObjectToCheck: validatorStateType,
  ): boolean => {
    let cumulativeCount = 0;
    let minCountToCheck = null;
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
    const specific = new Validator(oldValidation.proforma[currentName]);
    const evaluation = specific.validate(newValue);
    const mutable = {...oldValidation};
    if (evaluation.count) {
      mutable.cumulative[currentName] = evaluation.count;
    } else if (
      !evaluation.count &&
      mutable.cumulative[currentName] !== undefined
    ) {
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
    const newUntouchedArray = mutable.untouched.filter(
      (item) => item !== currentName,
    );
    mutable.untouched = newUntouchedArray;
    return mutable;
  };

  // uses cumlativeThresholdReached function and puts appropriate error messages in validation if errors found:
  const checkForCumulative = (
    validatorState: validatorStateType,
  ): validatorStateType => {
    const mutableState = {...validatorState};
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
    return mutableState;
  };

  // updates validation object on single value passed to it:
  const updateSingleValidation = (name: string, value: any) => {
    let newValidation = updateValidationObject(validation, name, value);
    if (newValidation.showErrorMessages) {
      newValidation = checkForCumulative(newValidation);
    }
    setValidation(newValidation);
  };

  // handles submit. Shows errors if present, passes verified values to a custom submit function if no errors.
  const handleSubmit = (globalState: any): void => {
    let mutableState = {...validation};
    //validate untouched values:
    if (mutableState.untouched.length > 0) {
      const workingArray = validation.untouched;
      for (let i = 0; i < workingArray.length; i++) {
        const tempState = updateValidationObject(
          mutableState,
          workingArray[i],
          globalState[workingArray[i]].value,
        );
        mutableState = {...mutableState, ...tempState};
      }
    }
    // check if any cumulative entry errors:
    mutableState = checkForCumulative(mutableState);
    //Show errors if errors present:
    for (const subValue of Object.values(mutableState.errorMessages)) {
      if (subValue) {
        mutableState.showErrorMessages = true;
        break;
      } else {
        mutableState.showErrorMessages = false;
      }
    }
    if (mutableState.showErrorMessages) {
      setValidation(mutableState);
    } else {
      customSubmitFunction();
      setValidation({
        ...mutableState,
        ...{showErrorMessages: false},
      });
    }
  };

  return (
    <ValidatorContext.Provider
      value={{
        updateSingleValidation,
        handleValidationReset,
        handleSubmit,
        validation,
        validationProforma,
      }}>
      {children}
    </ValidatorContext.Provider>
  );
};

export {ValidatorContext, ValidatorProvider, Validator, proformaTemplate};
