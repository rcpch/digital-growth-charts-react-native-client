import produce from 'immer';
import React, {useState} from 'react';
import {dateStore, globalStateType, numberStore, textStore} from '../interfaces/GlobalState';

type propTypes = {
  children: React.ReactNode;
};

const blankContext: {
  globalState: any;
  setGlobalState: Function;
} = {
  globalState: {},
  setGlobalState: () => null,
};

const GlobalStateContext = React.createContext(blankContext);

const textStoreTemplate: textStore = {
  showPicker: false,
  value: '',
  timeStamp: null,
  workingValue: '',
};

const dateStoreTemplate: dateStore = {
  showPicker: false,
  value: null,
  timeStamp: null,
  workingValue: null,
};

const numberStoreTemplate: numberStore = {
  showPicker: false,
  value: 280,
  timeStamp: null,
  workingValue: 280,
};

function MakeInitialState() {
  return {
    height: produce(textStoreTemplate, () => {}),
    weight: produce(textStoreTemplate, () => {}),
    bmi: produce(textStoreTemplate, () => {}),
    ofc: produce(textStoreTemplate, () => {}),
    gestationInDays: produce(numberStoreTemplate, () => {}),
    sex: produce(textStoreTemplate, () => {}),
    dob: produce(dateStoreTemplate, () => {}),
    dom: produce(dateStoreTemplate, () => {}),
    reference: produce(textStoreTemplate, (draft) => {
      draft.value = 'uk-who';
      draft.workingValue = 'uk-who';
    }),
    devMode: produce(textStoreTemplate, (draft) => {
      draft.value = 'local';
      draft.workingValue = 'local';
    }),
  };
}

function MakeSubState(name: keyof globalStateType) {
  const tempBlankState = MakeInitialState();
  return tempBlankState[name];
}

const initialState = MakeInitialState();

const GlobalStateProvider = ({children}: propTypes) => {
  const [globalState, setGlobalState] = useState(MakeInitialState());

  return (
    <GlobalStateContext.Provider
      value={{
        globalState,
        setGlobalState,
      }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export {GlobalStateContext, GlobalStateProvider, initialState, MakeInitialState, MakeSubState};
