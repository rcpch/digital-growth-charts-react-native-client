import React, {useState} from 'react';
import {globalStateType} from '../interfaces/GlobalState';

type propTypes = {
  children: React.ReactNode;
};

const blankContext: {
  globalState: any;
  setGlobalState: Function;
  setSingleGlobalState: Function;
} = {
  globalState: {},
  setGlobalState: () => null,
  setSingleGlobalState: () => null,
};

const GlobalStateContext = React.createContext(blankContext);

const list = {
  height: {workingValue: ''},
  weight: {workingValue: ''},
  bmi: {workingValue: 0},
  ofc: {workingValue: ''},
  gestationInDays: {workingValue: 280},
  sex: {workingValue: ''},
  dob: {workingValue: null},
  dom: {workingValue: null},
  reference: {workingValue: 'uk-who'},
};
const blank = {
  showPicker: false,
  timeStamp: null,
};

function MakeInitialState() {
  let workingObject: any = {};
  for (const [key, subValue] of Object.entries(list)) {
    workingObject[key] = {
      ...blank,
      ...subValue,
      ...{value: subValue.workingValue},
    };
  }
  return workingObject;
}

const initialState = MakeInitialState();

const GlobalStatsProvider = ({children}: propTypes) => {
  const [globalState, setGlobalState] = useState(MakeInitialState());

  const setSingleGlobalState = (
    name: keyof globalStateType,
    value: any,
    timeStamp = 'add',
  ): void => {
    setGlobalState((oldState: globalStateType) => {
      const mutableState = {...oldState};
      mutableState[name].value = value;
      if (timeStamp === 'add') {
        mutableState[name].timeStamp = new Date();
      } else if (timeStamp === 'remove') {
        mutableState[name].timeStamp = null;
      }
      return mutableState;
    });
  };

  return (
    <GlobalStateContext.Provider
      value={{
        globalState,
        setGlobalState,
        setSingleGlobalState,
      }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export {GlobalStateContext, GlobalStatsProvider, initialState};
