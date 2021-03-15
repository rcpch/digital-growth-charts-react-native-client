import {
  API_CALC_LOCAL_URL,
  API_CALC_LAN_URL,
  API_CALC_REAL_URL,
  API_KEY,
} from '@env';
import {calculateBMI, formatDate} from './oddBits';
import {globalStateType} from '../components';

type serverResponseType = {
  ok: boolean;
  status: 'string';
  text: Function;
};

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
  '422':
    'The server was unable to process the measurements. This is probably a bug in dotKid.',
  '500':
    'The server encountered an error. The measurements may have been incompatible with the calculator.',
  'Network request failed':
    'The request to the server failed. Please check your internet connection.',
  'Timeout exceeded': 'Request to the server timed out.',
};

// urls in use
const urlObjectSingle: {[index: string]: string} = {
  local: API_CALC_LOCAL_URL,
  lan: API_CALC_LAN_URL,
  real: API_CALC_REAL_URL,
};

const getSingleCentileData = async (
  inputObject: globalStateType,
  measurementType: string,
  url: string = 'local',
) => {
  const singleMeasurementUrl = urlObjectSingle[url];
  const headersObject: {[index: string]: string} = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  };
  if (url === 'real') {
    headersObject['Primary-Subscription-Key'] = API_KEY;
  }
  const apiArgument = makeApiArgument(inputObject, measurementType);
  try {
    const options = {
      method: 'POST',
      headers: headersObject,
      body: JSON.stringify(apiArgument),
      redirect: 'follow',
    };
    const serverResponse: serverResponseType = await timeoutForFetch(
      4000,
      fetch(singleMeasurementUrl, options),
    );
    if (!serverResponse.ok) {
      throw new Error(serverResponse.status);
    } else {
      const stringObject = await serverResponse.text();
      return JSON.parse(stringObject);
    }
  } catch (error) {
    const localError: string | number = error.message;
    const errorMessage = errorsObject[localError] || `Error: ${error.message}`;
    throw new Error(errorMessage);
  }
};

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
    birth_date: 'Mon, 10 Feb 2003 00:00:00 GMT',
    estimated_date_delivery: null,
    estimated_date_delivery_string: null,
    gestation_days: 4,
    gestation_weeks: 40,
    sex: 'male',
  },
  child_observation_value: {
    measurement_method: 'height',
    observation_value: 188,
  },
  measurement_calculated_values: {
    centile: 94,
    centile_band:
      'This height measurement is between the 91st and 98th centiles.',
    measurement_method: 'height',
    sds: 1.5566015052679778,
  },
  measurement_dates: {
    chronological_calendar_age: '17 years, 11 months, 4 weeks and 2 days',
    chronological_decimal_age: 17.998631074606433,
    clinician_decimal_age_comment: 'Born Term. No correction necessary.',
    corrected_calendar_age: '17 years, 11 months, 4 weeks and 2 days',
    corrected_decimal_age: 17.998631074606433,
    corrected_gestational_age: {
      corrected_gestation_days: null,
      corrected_gestation_weeks: null,
    },
    lay_decimal_age_comment:
      'At 40+4, your child is considered to have been born at term. No age adjustment is necessary.',
    observation_date: 'Tue, 09 Feb 2021 00:00:00 GMT',
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
