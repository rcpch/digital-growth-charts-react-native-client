import {Alert} from 'react-native';

import {globalStateType} from '../interfaces/GlobalState';
import {proformaObjectArgument} from '../interfaces/Validator';

// input a number and outputs a string with ordinal suffix attached
const addOrdinalSuffix = (inputNumber: number | string): string => {
  const answerNumber = inputNumber;
  let workingNumber = Number(inputNumber);
  if (Number.isInteger(workingNumber) === false) {
    workingNumber *= 10;
    if (Number.isInteger(workingNumber) === false) {
      throw Error('Only integers or numbers to 1 decimal place are supported');
    }
  }
  const remainder10 = workingNumber % 10;
  const remainder100 = workingNumber % 100;
  if (remainder10 === 1 && remainder100 !== 11) {
    return `${answerNumber}st`;
  }
  if (remainder10 === 2 && remainder100 !== 12) {
    return `${answerNumber}nd`;
  }
  if (remainder10 === 3 && remainder100 !== 13) {
    return `${answerNumber}rd`;
  } else {
    return `${answerNumber}th`;
  }
};

// as it says on the tin. Kept separate for simplicity
const calculateBMI = (weight: number | string, heightInCm: number | string) => {
  if (
    !weight ||
    !heightInCm ||
    isNaN(Number(weight)) ||
    isNaN(Number(heightInCm))
  ) {
    throw new Error('BMI calc did not receive valid arguments');
  }
  const height = Number(heightInCm) / 100;
  return Number(weight) / (height * height);
};

// check timestamps of measurements from global state. Can change how many mins old the threshold is
const checkTimeStamps = (
  globalObject: globalStateType,
  validationProforma: {[key: string]: proformaObjectArgument},
  minsAgo = 2,
) => {
  const nameArray = [];
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

// simple give 's' if number is plural
const pluralSuffix = (inputNumber: number): string => {
  if (inputNumber === 1) {
    return '';
  } else {
    return 's';
  }
};

// format date object to date DD/MM/YY, can also do to YYYY
const formatDate = (
  inputDate: any,
  fullYear = false,
  standardised = false,
): string => {
  let date: Date;
  let month: string;
  let day: string;
  let fourDigitYear: number;
  let yearArray: string[];
  try {
    date = new Date(inputDate);
    month = '' + (date.getMonth() + 1);
    day = '' + date.getDate();
    fourDigitYear = date.getFullYear();
    yearArray = date.getFullYear().toString().split('');
    let shortArray = [yearArray[2], yearArray[3]];
    const year = fullYear || standardised ? fourDigitYear : shortArray.join('');
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    if (standardised) {
      return [year, month, day].join('-');
    } else {
      return [day, month, year].join('/');
    }
  } catch (error) {
    throw new Error('Input date for formatDate not recognised');
  }
};

// format date object to time to hh:mm
const formatTime = (inputTime: Date, accurate = false) => {
  if (!inputTime) {
    return null;
  }
  const time = new Date(inputTime);
  let hours = '' + time.getHours();
  let minutes = '' + time.getMinutes();
  if (accurate === false) {
    const workingMinutes = time.getMinutes();
    minutes = '' + Math.floor(workingMinutes / 15) * 15;
  }
  if (hours.length < 2) {
    hours = '0' + hours;
  }
  if (minutes.length < 2) {
    minutes = '0' + minutes;
  }
  return [hours, minutes].join(':');
};

// handles old measurements if the timestamp is considered old by the checkTimeStamps function. Submits if all OK.
const checkForOldValues = (
  submitFunction: Function,
  setGlobalStats: Function,
  globalValues: globalStateType,
  validationProforma: {[key: string]: proformaObjectArgument},
) => {
  const oldValueArray = checkTimeStamps(globalValues, validationProforma);
  if (oldValueArray.length > 0) {
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
    let oldValuesString = '';
    for (let i = 0; i < oldValueArray.length; i++) {
      for (const [nameKey, nameValue] of Object.entries(nameLookup)) {
        if (oldValueArray[i] === nameKey) {
          const ending = i === oldValueArray.length - 1 ? '.' : ', ';
          oldValuesString = oldValuesString + nameValue + ending;
        }
      }
    }
    const finalSubmitFunction = () => {
      const mutableObject: any = {...globalValues};
      const now = new Date();
      for (let i = 0; i < oldValueArray.length; i++) {
        mutableObject[oldValueArray[i]].timeStamp = now;
      }
      setGlobalStats(mutableObject);
      submitFunction(globalValues);
    };
    Alert.alert(
      'Are all measurements still valid?',
      `\nThe following measurements were entered more than 2 minutes ago: ${oldValuesString}\n\nDo you still want to continue?`,
      [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => null,
        },
        {
          text: 'Yes',
          onPress: () => {
            finalSubmitFunction();
          },
        },
      ],
      {cancelable: false},
    );
  } else {
    submitFunction(globalValues);
  }
};

const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export {
  addOrdinalSuffix,
  calculateBMI,
  pluralSuffix,
  formatDate,
  formatTime,
  checkTimeStamps,
  checkForOldValues,
  timeout,
};
