import {useState, useContext} from 'react';
import {Platform} from 'react-native';

import {
  API_CALC,
  API_LOCAL_BASE_ANDROID,
  API_LOCAL_BASE_IOS,
  API_LAN_BASE,
  API_REAL_BASE,
  API_KEY,
} from '@env';
import {calculateBMI, formatDate} from '../brains/oddBits';
import {GlobalStateContext, globalStateType} from '../components';
import Zeit from '../brains/Zeit';

type serverResponseType = {
  ok: boolean;
  status: 'string';
  text: Function;
};

if (!API_CALC) {
  console.error('No calc environment variable found. Is your .env file OK?');
}

//parses measurements object into format recognised by the api
const makeApiArgument = (
  inputObject: globalStateType,
  measurementType: string,
) => {
  let measurement = inputObject[measurementType]?.value;
  if (!measurement) {
    if (measurementType === 'bmi') {
      try {
        measurement = calculateBMI(
          inputObject.weight.value,
          inputObject.height.value,
        );
      } catch (error) {
        throw new Error('No measurements found for bmi');
      }
    } else {
      throw new Error('No valid measurement found');
    }
  }

  let dob, gestationInDays, sex;
  if (inputObject.dob?.value) {
    dob = inputObject.dob.value;
  } else {
    throw new Error('No dob found');
  }
  if (typeof inputObject.gestationInDays?.value === 'number') {
    gestationInDays = inputObject.gestationInDays.value;
  } else {
    throw new Error('No valid gestation found');
  }
  if (typeof inputObject.sex?.value === 'string') {
    sex = inputObject.sex.value.toLowerCase();
  } else {
    throw new Error('No valid sex found');
  }

  const birthDate = formatDate(new Date(dob), true, true);
  const observationDate = formatDate(
    inputObject.dom?.value ? new Date(inputObject.dom.value) : new Date(),
    true,
    true,
  );
  const gestationDays = gestationInDays % 7;
  const gestationWeeks = Math.floor(gestationInDays / 7);
  const observationValue = Number(measurement);
  return {
    birth_date: birthDate,
    gestation_days: gestationDays,
    gestation_weeks: gestationWeeks,
    measurement_method: measurementType,
    observation_date: observationDate,
    observation_value: observationValue,
    sex: sex,
  };
};

// timeout wrapper for fetch call, so doesn't go on forever
const timeoutForFetch = async (
  milliseconds: number,
  promise: Promise<any>,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout exceeded'));
    }, milliseconds);
    promise.then(resolve, reject);
  });
};

//to make common errors pretty
const errorsObject: {[index: string]: string} = {
  '401':
    "The server responded with 'Not authorised'. Please check your API key.",
  '404': "The server responded with '404 not found'",
  '422':
    'The server was unable to process the measurements. This is probably a bug in the app.',
  '500':
    'The server was unable to process the measurements. This is probably a bug in the app.',
  'Network request failed':
    'The request to the server failed. Please check your internet connection.',
  'Timeout exceeded': 'Request to the server timed out.',
};

// urls in use
const urlObjectCalculate: {[index: string]: string} = {
  local: `${
    Platform.OS === 'ios' ? API_LOCAL_BASE_IOS : API_LOCAL_BASE_ANDROID
  }${API_CALC}`,
  lan: `${API_LAN_BASE}${API_CALC}`,
  real: `${API_REAL_BASE}${API_CALC}`,
};

const getSingleCentileData = async (
  inputObject: globalStateType,
  measurementType: string,
  workingErrorsObject: {[key: string]: string | boolean},
  url: string = 'local',
) => {
  // look for error message corresponding to measurement type, only proceed if no error message:
  if (!workingErrorsObject[measurementType]) {
    const calculateUrl = urlObjectCalculate[url];
    const headersObject: {[index: string]: string} = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    };
    if (url === 'real') {
      headersObject['Primary-Subscription-Key'] = API_KEY;
    }
    const apiArgument = makeApiArgument(inputObject, measurementType);
    const options = {
      method: 'POST',
      headers: headersObject,
      body: JSON.stringify(apiArgument),
      redirect: 'follow',
    };
    try {
      const serverResponse: serverResponseType = await timeoutForFetch(
        5000,
        fetch(calculateUrl, options),
      );
      if (!serverResponse.ok) {
        throw new Error(serverResponse.status);
      } else {
        const stringObject = await serverResponse.text();
        return JSON.parse(stringObject);
      }
    } catch (error) {
      const localError: string = error.message;
      const errorMessage =
        errorsObject[localError] || `Error: ${error.message}`;
      workingErrorsObject[measurementType] = errorMessage;
      workingErrorsObject.serverErrors = true;
    }
  } else {
    return null;
  }
};

const checkRequestWillWork = (
  measurementType: string,
  globalState: globalStateType,
  dataSet = 'ukWho',
): string => {
  const ageObject = new Zeit(
    globalState.dob.value,
    globalState.dom.value,
    globalState.gestationInDays.value,
  );
  const ageInDaysCorrected = ageObject.calculate('days');
  const decimalAgeInYears = ageObject.calculate('years', true, false);
  if (
    ageInDaysCorrected > 0 &&
    ageInDaysCorrected < 14 &&
    globalState.gestationInDays.value >= 259
  ) {
    return 'Term infants can only be plotted at birth or from 2 weeks of age.';
  }
  if (globalState.gestationInDays.value < 161) {
    return 'UK-WHO data does not exist below 23 weeks gestation.';
  }
  if (decimalAgeInYears > 20) {
    return 'No data exists for any measurements after 20 years of age.';
  }
  if (!globalState[measurementType]?.value) {
    if (
      !(
        globalState.height.value &&
        globalState.weight.value &&
        measurementType === 'bmi'
      )
    ) {
      return 'No measurement given.';
    }
  }
  switch (measurementType) {
    case 'height':
      if (ageInDaysCorrected < -106) {
        return 'UK-WHO length data does not exist below 25 weeks gestation.';
      }
      break;
    case 'bmi':
      if (decimalAgeInYears < 2) {
        return 'BMI cannot be plotted below 2 years of age.';
      }
      break;
    case 'ofc':
      if (decimalAgeInYears > 17 && globalState.sex.value === 'Female') {
        return 'UK-WHO data for head circumference does not exist for over 17 years of age in girls.';
      } else if (decimalAgeInYears > 18 && globalState.sex.value === 'Male') {
        return 'UK-WHO data for head circumference does not exist for over 18 years of age in boys.';
      }
      break;
    default:
      return '';
  }
  return '';
};

function makeCentileState(forErrors: boolean) {
  const valueOfValue = forErrors ? '' : null;
  const output: {[key: string]: any} = {
    weight: valueOfValue,
    height: valueOfValue,
    ofc: valueOfValue,
    bmi: valueOfValue,
  };
  if (forErrors) {
    output.serverErrors = false;
  }
  return output;
}

const useRcpchApi = (url = 'local') => {
  const {globalState} = useContext(GlobalStateContext);
  const [centileResults, setCentileResults] = useState(makeCentileState(false));
  const [errors, setErrors] = useState(makeCentileState(true));

  const getMultipleCentileResults = async (
    recordAnswer: boolean,
  ): Promise<void> => {
    const workingErrorsObject = makeCentileState(true);
    for (const measurementName of Object.keys(centileResults)) {
      const errorMessage = checkRequestWillWork(measurementName, globalState);
      if (errorMessage) {
        workingErrorsObject[measurementName] = errorMessage;
      }
    }
    try {
      const height = await getSingleCentileData(
        globalState,
        'height',
        workingErrorsObject,
        url,
      );
      const weight = await getSingleCentileData(
        globalState,
        'weight',
        workingErrorsObject,
        url,
      );
      const bmi = await getSingleCentileData(
        globalState,
        'bmi',
        workingErrorsObject,
        url,
      );
      const ofc = await getSingleCentileData(
        globalState,
        'ofc',
        workingErrorsObject,
        url,
      );
      if (recordAnswer) {
        setCentileResults({
          height: height,
          weight: weight,
          bmi: bmi,
          ofc: ofc,
        });
        setErrors(workingErrorsObject);
      }
    } catch (error) {
      // this will be a bug not a server error:
      console.error(error.message);
    }
  };

  return {getMultipleCentileResults, globalState, centileResults, errors};
};

export default useRcpchApi;

const referenceArgumentsSingleMeasurement = {
  birth_date: '2003-02-10',
  gestation_days: 4,
  gestation_weeks: 40,
  measurement_method: 'height',
  observation_date: '2021-02-09',
  observation_value: 188,
  sex: 'male',
};

const referenceReturnObjectSingleMeasurement = {
  birth_data: {
    birth_date: 'Sun, 15 Mar 2020 00:00:00 GMT',
    estimated_date_delivery: 'Sun, 15 Mar 2020 00:00:00 GMT',
    estimated_date_delivery_string: 'Sun 15 March, 2020',
    gestation_days: 0,
    gestation_weeks: 40,
    sex: 'female',
  },
  child_observation_value: {
    measurement_method: 'weight',
    observation_value: 9,
    observation_value_error: null,
  },
  measurement_calculated_values: {
    chronological_centile: 51,
    chronological_centile_band:
      'This weight measurement is on or near the 50th centile.',
    chronological_measurement_error: null,
    chronological_sds: 0.0487953597071724,
    corrected_centile: 51,
    corrected_centile_band:
      'This weight measurement is on or near the 50th centile.',
    corrected_measurement_error: null,
    corrected_sds: 0.0487953597071724,
    measurement_method: 'weight',
  },
  measurement_dates: {
    chronological_calendar_age: '1 year',
    chronological_decimal_age: 0.999315537303217,
    chronological_decimal_age_error: null,
    comments: {
      clinician_chronological_decimal_age_comment:
        'Born Term. No correction has been made for gestation.',
      clinician_corrected_decimal_age_comment:
        'Born at term. No correction has been made for gestation.',
      lay_chronological_decimal_age_comment:
        'Your baby was born on their due date.',
      lay_corrected_decimal_age_comment:
        'Your baby was born on their due date.',
    },
    corrected_calendar_age: '1 year',
    corrected_decimal_age: 0.999315537303217,
    corrected_decimal_age_error: null,
    corrected_gestational_age: {
      corrected_gestation_days: null,
      corrected_gestation_weeks: null,
    },
    observation_date: 'Mon, 15 Mar 2021 00:00:00 GMT',
  },
};

const referenceReturnObjectPlottableChild = {
  child_data: {
    centile_data: [
      [
        {
          age_type: 'corrected_age',
          calendar_age: '1 year',
          centile_band:
            'This weight measurement is between the 25th and 50th centiles.',
          centile_value: 40,
          corrected_gestation_days: null,
          corrected_gestation_weeks: null,
          measurement_method: 'weight',
          x: 1.002053388090349,
          y: 9.4,
        },
        {
          age_type: 'chronological_age',
          calendar_age: '1 year',
          centile_band:
            'This weight measurement is between the 25th and 50th centiles.',
          centile_value: 40,
          corrected_gestation_days: null,
          corrected_gestation_weeks: null,
          measurement_method: 'weight',
          x: 1.002053388090349,
          y: 9.4,
        },
      ],
    ],
    measurement_method: 'weight',
    sds_data: [
      [
        {
          age_type: 'corrected_age',
          calendar_age: '1 year',
          corrected_gestation_days: null,
          corrected_gestation_weeks: null,
          measurement_method: 'weight',
          x: 1.002053388090349,
          y: -0.24344224642481746,
        },
        {
          age_type: 'chronological_age',
          calendar_age: '1 year',
          corrected_gestation_days: null,
          corrected_gestation_weeks: null,
          measurement_method: 'weight',
          x: 1.002053388090349,
          y: -0.24344224642481746,
        },
      ],
    ],
  },
  sex: 'male',
};

export {getSingleCentileData};
