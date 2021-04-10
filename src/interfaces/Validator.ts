export type proformaObjectArgument = {
  inputType: {param: string; message?: string};
  isRequired?: {param: boolean; message?: string};
  min?: {param: number; message?: string};
  max?: {param: number; message?: string};
  countCumulative?: {param: boolean; minCount: number; message?: string};
  nullable?: {param: boolean; message?: string};
};

export type returnValidatorObject = {
  errors: boolean;
  isRequiredError: string;
  minError: string;
  maxError: string;
  typeError: string;
  count: number;
};

export type validatorProviderProps = {
  children?: React.ReactNode;
  validationProforma: {[key: string]: proformaObjectArgument};
  customSubmitFunction: Function;
};

export type validatorStateType = {
  cumulative: {[key: string]: number};
  errorMessages: {[key: string]: any};
  proforma: {[key: string]: proformaObjectArgument};
  untouched: string[];
  showErrorMessages: boolean;
};
