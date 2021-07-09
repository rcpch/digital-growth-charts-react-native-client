export type textStore = {
  showPicker: boolean;
  value: string;
  timeStamp: null | Date;
  workingValue: string;
};

export type dateStore = {
  showPicker: boolean;
  value: null | Date;
  timeStamp: null | Date;
  workingValue: null | Date;
};

export type numberStore = {
  showPicker: boolean;
  value: number;
  timeStamp: null | Date;
  workingValue: number;
};

export type Names =
  | 'height'
  | 'weight'
  | 'ofc'
  | 'sex'
  | 'gestationInDays'
  | 'dob'
  | 'dom'
  | 'reference';

export type globalStateType = {
  bmi: textStore;
  height: textStore;
  weight: textStore;
  ofc: textStore;
  gestationInDays: numberStore;
  sex: textStore;
  dob: dateStore;
  dom: dateStore;
  reference: textStore;
};
