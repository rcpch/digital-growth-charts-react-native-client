import produce, {immerable} from 'immer';
import React, {useState} from 'react';
import {
  dateStore,
  globalStateType,
  numberStore,
  textStore,
} from '../interfaces/GlobalState';

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

function MakeInitialState() {
  const list = {
    height: {workingValue: ''},
    weight: {workingValue: ''},
    bmi: {workingValue: ''},
    ofc: {workingValue: ''},
    gestationInDays: {workingValue: 280},
    sex: {workingValue: ''},
    dob: {workingValue: null},
    dom: {workingValue: null},
    reference: {workingValue: 'uk-who'},
  };
  return produce(list, (workingObject) => {
    const blank = {
      showPicker: false,
      timeStamp: null,
    };
    for (const [key, subValue] of Object.entries(list)) {
      workingObject[key] = {
        ...blank,
        ...subValue,
        ...{value: subValue.workingValue},
      };
    }
  });
}

function MakeSubState(name: keyof globalStateType) {
  const list = {
    height: {workingValue: ''},
    weight: {workingValue: ''},
    bmi: {workingValue: ''},
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
  return {
    ...blank,
    value: list[name].workingValue,
    workingValue: list[name].workingValue,
  };
}

const initialState: globalStateType = MakeInitialState();

const GlobalStateProvider = ({children}: propTypes) => {
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

export {
  GlobalStateContext,
  GlobalStateProvider,
  initialState,
  MakeInitialState,
  MakeSubState,
};
