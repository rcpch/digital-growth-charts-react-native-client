import {Measurement} from './interfaces/RCPCHMeasurementObject';
import {
  ChartStyle,
  AxisStyle,
  GridlineStyle,
  CentileStyle,
  MeasurementStyle,
  ModalStyle,
} from './interfaces/StyleObjects';

export type RCPCHChartProps = {
  title: string;
  subtitle: string;
  measurementMethod: 'height' | 'weight' | 'ofc' | 'bmi';
  sex: 'male' | 'female';
  measurementsArray: Measurement[];
  reference: 'uk-who' | 'turner' | 'trisomy-21';
  chartStyle?: ChartStyle;
  modalStyle?: ModalStyle;
  axisStyle?: AxisStyle;
  gridlineStyle?: GridlineStyle;
  centileStyle?: CentileStyle;
  measurementStyle?: MeasurementStyle;
};
