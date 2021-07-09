import {useState, useContext, useCallback} from 'react';
import {Platform} from 'react-native';

import {
  API_LOCAL_BASE_ANDROID,
  API_LOCAL_BASE_IOS,
  API_LAN_BASE,
  API_REAL_BASE,
  API_KEY,
} from '@env';

import {GlobalStateContext} from '../components';
import {formatDate} from '../brains/';

import {globalStateType} from '../interfaces/GlobalState';

type serverResponseType = {
  ok: boolean;
  status: 'string';
  text: Function;
};

type measurementTypes = 'weight' | 'height' | 'bmi' | 'ofc';

const allPossibleMeasurements: measurementTypes[] = ['weight', 'height', 'bmi', 'ofc'];

if (!API_LOCAL_BASE_ANDROID || !API_LOCAL_BASE_IOS) {
  console.error(
    'Environment variables not found for local server. Please check the environment variables needed in useRcpchApi',
  );
}

//parses measurements object into format recognised by the api
const makeApiArgument = (inputObject: globalStateType, measurementType: keyof globalStateType) => {
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

  const birthDate = formatDate(dob, true, true);
  const observationDate = formatDate(inputObject.dom.value || new Date(), true, true);
  const gestationDays = gestationInDays > 294 ? 0 : gestationInDays % 7;
  const gestationWeeks = gestationInDays > 294 ? 42 : Math.floor(gestationInDays / 7);
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
const timeoutForFetch = async (milliseconds: number, promise: Promise<any>): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout exceeded'));
    }, milliseconds);
    promise.then(resolve, reject);
  });
};

//to make common errors pretty
const errorsObject: {[index: string]: string} = {
  '401': "The server responded with 'Not authorised'. Please check your API key.",
  '404': "The server responded with '404 not found'",
  '422': 'The server was unable to process the measurements. This is probably a bug in the app.',
  '500': 'The server was unable to process the measurements. This is probably a bug in the app.',
  'Network request failed':
    'The request to the server failed. Please check your internet connection.',
  'Timeout exceeded': 'Request to the server timed out.',
};

// urls in use
const urlLookup: {[index: string]: string} = {
  local: `${Platform.OS === 'ios' ? API_LOCAL_BASE_IOS : API_LOCAL_BASE_ANDROID}`,
  lan: `${API_LAN_BASE}`,
  real: `${API_REAL_BASE}`,
};

const getSingleCentileData = async (
  inputObject: globalStateType,
  measurementType: measurementTypes,
  urlBase: 'local' | 'lan' | 'real',
) => {
  let errors = '';
  if (!inputObject[measurementType]?.value) {
    errors = 'No measurement given.';
  }
  // only proceed if measurement present:
  if (!errors) {
    const finalUrl = `${urlLookup[urlBase]}/${inputObject.reference.value}/calculation`;
    const headersObject: {[index: string]: string} = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    };
    if (urlBase === 'real') {
      headersObject['Subscription-Key'] = API_KEY;
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
        return {
          errors: {[measurementType]: '', serverErrors: false},
          result: {[measurementType]: JSON.parse(stringObject)},
        };
      }
    } catch (error) {
      const localError: string = error.message;
      const errorMessage = errorsObject[localError] || `Error: ${error.message}`;
      return {
        errors: {[measurementType]: errorMessage, serverErrors: true},
        result: {[measurementType]: null},
      };
    }
  } else {
    return {
      errors: {
        measurementType: errors,
        serverErrors: false,
      },
      result: {[measurementType]: null},
    };
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
  return {
    weight: '',
    height: '',
    ofc: '',
    bmi: '',
    serverErrors: false,
  };
}

const useRcpchApi = (url: 'local' | 'lan' | 'real') => {
  const {globalState} = useContext(GlobalStateContext);
  const [state, setState] = useState({
    results: makeCentileState(),
    errors: makeErrorState(),
  });

  const getMultipleCentileResults = useCallback(
    async (recordAnswer: boolean): Promise<void> => {
      try {
        const answersInArray = await Promise.all(
          allPossibleMeasurements.map((measurement: measurementTypes) =>
            getSingleCentileData(globalState, measurement, url),
          ),
        );
        if (recordAnswer) {
          const answersReduced = answersInArray.reduce(
            (workingObject, currentAnswer) => {
              const finalWorkingResult = {
                ...workingObject.results,
                ...currentAnswer.result,
              };
              const finalWorkingErrors = {
                ...workingObject.errors,
                ...currentAnswer.errors,
              };
              if (workingObject.errors.serverErrors && !currentAnswer.errors.serverErrors) {
                finalWorkingErrors.serverErrors = true;
              }
              return {results: finalWorkingResult, errors: finalWorkingErrors};
            },
            {results: makeCentileState(), errors: makeErrorState()},
          );
          setState(answersReduced);
        }
      } catch (error) {
        // this will be a bug not a server error:
        throw new Error(error.message);
      }
    },
    [globalState, url],
  );

  return {
    getMultipleCentileResults,
    globalState,
    centileResults: state.results,
    errors: state.errors,
  };
};

export default useRcpchApi;

export {getSingleCentileData};
