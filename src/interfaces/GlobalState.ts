type textStore = {
  showPicker: boolean;
  value: string;
  timeStamp: null | Date;
  workingValue: string;
};

type dateStore = {
  showPicker: boolean;
  value: null | Date;
  timeStamp: null | Date;
  workingValue: null | Date;
};

type numberStore = {
  showPicker: boolean;
  value: number;
  timeStamp: null | Date;
  workingValue: number;
};

export type globalStateType = {
  bmi: numberStore;
  height: textStore;
  weight: textStore;
  ofc: textStore;
  gestationInDays: numberStore;
  sex: textStore;
  dob: dateStore;
  dom: dateStore;
  reference: textStore;
};
