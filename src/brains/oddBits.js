import {Alert} from 'react-native';

// input a number and outputs a string with ordinal suffix attached
const addOrdinalSuffix = (inputNumber) => {
  const answerNumber = inputNumber;
  let workingNumber = Number(inputNumber);
  if (Number.isInteger(workingNumber) === false) {
    workingNumber *= 10;
    if (Number.isInteger(workingNumber) === false) {
      return 'Error: only integers or numbers to 1 decimal place are supported';
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
const calculateBMI = (weight, heightInCm) => {
  if (!weight || !heightInCm) {
    throw new Error('BMI calc did not receive valid arguments');
  }
  const height = heightInCm / 100;
  return weight / (height * height);
};

// simple check neonatal fluid values are at default (could've done JSON.stringify but only discovered this later)
const checkDefault = (values) => {
  if (
    values.day1 === '60' &&
    values.day2 === '80' &&
    values.day3 === '100' &&
    values.day4 === '120' &&
    values.day5 === '150'
  ) {
    return true;
  }
};

// check timestamps of measurements from global state. Can change how many mins old the threshold is
const checkTimeStamps = (globalObject, initialFormikValues, minsAgo = 2) => {
  const nameArray = [];
  const now = new Date();
  for (const [key, value] of Object.entries(globalObject)) {
    for (const formikKey of Object.keys(initialFormikValues)) {
      if (value.timeStamp && key === formikKey) {
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

// simple is number plural or not
const decidePluralSuffix = (inputNumber) => {
  if (inputNumber === 1) {
    return '';
  } else {
    return 's';
  }
};

// format date object to date DD/MM/YY, can also do to YYYY
const formatDate = (inputDate, fullYear = false, standardised = false) => {
  if (!inputDate) {
    return null;
  }
  const date = new Date(inputDate);
  let month = '' + (date.getMonth() + 1);
  let day = '' + date.getDate();
  let fourDigitYear = date.getFullYear();
  let yearArray = date.getFullYear().toString().split('');
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
};

// format date object to time to hh:mm
const formatTime = (inputTime, accurate = false) => {
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
const handleOldValues = (
  submitFunction,
  kind,
  setGlobalStats,
  globalValues,
  initialFormikValues,
) => {
  const oldValueArray = checkTimeStamps(globalValues, initialFormikValues);
  if (oldValueArray.length > 0) {
    const nameLookup = {
      height: 'Height / Length',
      weight: 'Weight',
      ofc: 'Head Circumference',
      sex: 'Sex',
      gestationInDays: 'Birth Gestation',
      dob: 'Date of Birth',
      dom: 'Date of Measurement',
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
      const mutableObject = {...globalValues};
      const now = new Date();
      for (let i = 0; i < oldValueArray.length; i++) {
        mutableObject[oldValueArray[i]].timeStamp = now;
      }
      setGlobalStats((state) => {
        const newState = {...state};
        newState[kind] = mutableObject;
        return newState;
      });
      submitFunction();
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
    submitFunction();
  }
};

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export {
  addOrdinalSuffix,
  calculateBMI,
  checkDefault,
  decidePluralSuffix,
  formatDate,
  formatTime,
  checkTimeStamps,
  handleOldValues,
  timeout,
};
