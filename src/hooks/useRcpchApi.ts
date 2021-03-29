import {useState, useContext} from 'react';
import {Platform} from 'react-native';

import {
  API_LOCAL_BASE_ANDROID,
  API_LOCAL_BASE_IOS,
  API_LAN_BASE,
  API_REAL_BASE,
  API_KEY,
} from '@env';

import {GlobalStateContext} from '../components';
import {Zeit, formatDate} from '../brains/';

import {globalStateType} from '../interfaces/GlobalState';

type serverResponseType = {
  ok: boolean;
  status: 'string';
  text: Function;
};

type measurementTypes = 'weight' | 'height' | 'bmi' | 'ofc';

if (!API_LOCAL_BASE_ANDROID || !API_LOCAL_BASE_IOS) {
  console.error(
    'Environment variables not found for local server. Please check the environment variables needed in useRcpchApi',
  );
}

//parses measurements object into format recognised by the api
const makeApiArgument = (
  inputObject: globalStateType,
  measurementType: keyof globalStateType,
) => {
  let measurement = inputObject[measurementType]?.value;
  if (!measurement) {
    throw new Error('No valid measurement found');
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

  // const birthDate = dob.toISOString();
  // const todayWithTimeStripped = new Date(formatDate(new Date(), true, true));
  // const observationDate =
  //   inputObject.dom.value?.toISOString() || todayWithTimeStripped.toISOString();

  const birthDate = formatDate(dob, true, true);
  const observationDate = formatDate(
    inputObject.dom.value || new Date(),
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
const urlLookup: {[index: string]: string} = {
  local: `${
    Platform.OS === 'ios' ? API_LOCAL_BASE_IOS : API_LOCAL_BASE_ANDROID
  }`,
  lan: `${API_LAN_BASE}`,
  real: `${API_REAL_BASE}`,
};

const getSingleCentileData = async (
  inputObject: globalStateType,
  measurementType: keyof globalStateType,
  workingErrorsObject: {[key: string]: string | boolean},
  urlBase: string = 'local',
) => {
  // look for error message corresponding to measurement type, only proceed if no error message:
  if (!workingErrorsObject[measurementType]) {
    const finalUrl = `${urlLookup[urlBase]}/${inputObject.reference.value}/calculation`;
    const headersObject: {[index: string]: string} = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    };
    if (urlBase === 'real') {
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
        fetch(finalUrl, options),
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
  globalState: any,
): string => {
  const ageObject = new Zeit(
    globalState.dob.value,
    globalState.dom.value,
    globalState.gestationInDays.value,
  );
  const ageInDaysCorrected = ageObject.calculate('days');
  const decimalAgeInYears = ageObject.calculate('years', true, false);
  const reference = globalState.reference.value;
  if (!globalState[measurementType]?.value) {
    return 'No measurement given.';
  }
  if (decimalAgeInYears > 20) {
    return 'No data exists for any measurements after 20 years of age.';
  }
  if (measurementType === 'bmi' && ageInDaysCorrected < 14) {
    // return 'BMI data does not exist below 2 weeks of age';
  }
  if (reference === 'uk-who') {
    // if (globalState.gestationInDays.value < 161) {
    //   return 'UK-WHO data does not exist below 23 weeks gestation.';
    // }
    // switch (measurementType) {
    //   case 'height':
    //     if (ageInDaysCorrected < -106) {
    //       return 'UK-WHO length data does not exist below 25 weeks gestation.';
    //     }
    //     return '';
    //   case 'ofc':
    //     if (decimalAgeInYears > 17 && globalState.sex.value === 'Female') {
    //       return 'UK-WHO data for head circumference does not exist for over 17 years of age in girls.';
    //     } else if (decimalAgeInYears > 18 && globalState.sex.value === 'Male') {
    //       return 'UK-WHO data for head circumference does not exist for over 18 years of age in boys.';
    //     }
    //     return '';
    //   default:
    //     return '';
    // }
    return '';
  } else if (reference === 'turner') {
    if (measurementType !== 'height') {
      return 'Only height data exists for Turner Syndrome.';
    } else {
      // if (decimalAgeInYears < 1) {
      //   return 'There is no reference data available below 1 year of age for Turner Syndrome.';
      // }
    }
    return '';
  } else if (reference === 'trisomy-21') {
    // if (globalState.gestationInDays.value < 280 && decimalAgeInYears < 0) {
    //   return 'There is no reference data below 40 weeks for Down Syndrome infants.';
    // }
    // if (measurementType === 'ofc' && decimalAgeInYears > 18) {
    //   return 'No Down Syndrome reference data for head circumference exists above 18 years of age.';
    // }
    // if (measurementType === 'bmi' && decimalAgeInYears > 18.82) {
    //   return 'No Down Syndrome reference data for BMI exists above 18.8 years of age.';
    // }
    return '';
  } else {
    throw new Error('No recognised reference for request checker');
  }
};

function makeCentileState() {
  const centile: {[measurement in measurementTypes]: any} = {
    weight: null,
    height: null,
    ofc: null,
    bmi: null,
  };
  return centile;
}

function makeErrorState() {
  const errors: {[key: string]: any} = {
    weight: '',
    height: '',
    ofc: '',
    bmi: '',
    serverErrors: false,
  };
  return errors;
}

const useRcpchApi = (url = 'local') => {
  const {globalState} = useContext(GlobalStateContext);
  const [centileResults, setCentileResults] = useState(makeCentileState());
  const [errors, setErrors] = useState(makeErrorState());

  const getMultipleCentileResults = async (
    recordAnswer: boolean,
  ): Promise<void> => {
    const workingErrorsObject = makeErrorState();
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
        // console.log(JSON.stringify(weight));
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

// const referenceArgumentsSingleMeasurement = {
//   birth_date: '2003-02-10',
//   gestation_days: 4,
//   gestation_weeks: 40,
//   measurement_method: 'height',
//   observation_date: '2021-02-09',
//   observation_value: 188,
//   sex: 'male',
// };

// //soon to include plottable measurements:
// const referenceReturnObjectSingleMeasurement = {
//   birth_data: {
//     birth_date: 'Sun, 15 Mar 2020 00:00:00 GMT',
//     estimated_date_delivery: 'Sun, 15 Mar 2020 00:00:00 GMT',
//     estimated_date_delivery_string: 'Sun 15 March, 2020',
//     gestation_days: 0,
//     gestation_weeks: 40,
//     sex: 'female',
//   },
//   child_observation_value: {
//     measurement_method: 'weight',
//     observation_value: 9,
//     observation_value_error: null,
//   },
//   measurement_calculated_values: {
//     chronological_centile: 51,
//     chronological_centile_band:
//       'This weight measurement is on or near the 50th centile.',
//     chronological_measurement_error: null,
//     chronological_sds: 0.0487953597071724,
//     corrected_centile: 51,
//     corrected_centile_band:
//       'This weight measurement is on or near the 50th centile.',
//     corrected_measurement_error: null,
//     corrected_sds: 0.0487953597071724,
//     measurement_method: 'weight',
//   },
//   measurement_dates: {
//     chronological_calendar_age: '1 year',
//     chronological_decimal_age: 0.999315537303217,
//     chronological_decimal_age_error: null,
//     comments: {
//       clinician_chronological_decimal_age_comment:
//         'Born Term. No correction has been made for gestation.',
//       clinician_corrected_decimal_age_comment:
//         'Born at term. No correction has been made for gestation.',
//       lay_chronological_decimal_age_comment:
//         'Your baby was born on their due date.',
//       lay_corrected_decimal_age_comment:
//         'Your baby was born on their due date.',
//     },
//     corrected_calendar_age: '1 year',
//     corrected_decimal_age: 0.999315537303217,
//     corrected_decimal_age_error: null,
//     corrected_gestational_age: {
//       corrected_gestation_days: null,
//       corrected_gestation_weeks: null,
//     },
//     observation_date: 'Mon, 15 Mar 2021 00:00:00 GMT',
//   },
// };

// //soon to be outdated:
// const referenceReturnObjectPlottableChild = {
//   child_data: {
//     centile_data: [
//       [
//         {
//           age_type: 'corrected_age',
//           calendar_age: '1 year',
//           centile_band:
//             'This weight measurement is between the 25th and 50th centiles.',
//           centile_value: 40,
//           corrected_gestation_days: null,
//           corrected_gestation_weeks: null,
//           measurement_method: 'weight',
//           x: 1.002053388090349,
//           y: 9.4,
//         },
//         {
//           age_type: 'chronological_age',
//           calendar_age: '1 year',
//           centile_band:
//             'This weight measurement is between the 25th and 50th centiles.',
//           centile_value: 40,
//           corrected_gestation_days: null,
//           corrected_gestation_weeks: null,
//           measurement_method: 'weight',
//           x: 1.002053388090349,
//           y: 9.4,
//         },
//       ],
//     ],
//     measurement_method: 'weight',
//     sds_data: [
//       [
//         {
//           age_type: 'corrected_age',
//           calendar_age: '1 year',
//           corrected_gestation_days: null,
//           corrected_gestation_weeks: null,
//           measurement_method: 'weight',
//           x: 1.002053388090349,
//           y: -0.24344224642481746,
//         },
//         {
//           age_type: 'chronological_age',
//           calendar_age: '1 year',
//           corrected_gestation_days: null,
//           corrected_gestation_weeks: null,
//           measurement_method: 'weight',
//           x: 1.002053388090349,
//           y: -0.24344224642481746,
//         },
//       ],
//     ],
//   },
//   sex: 'male',
// };

export {getSingleCentileData};
