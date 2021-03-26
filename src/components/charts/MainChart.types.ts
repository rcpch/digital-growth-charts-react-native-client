import {Domains} from './interfaces/Domains';
import {
  AxisStyle,
  CentileStyle,
  ChartStyle,
  GridlineStyle,
  MeasurementStyle,
} from './interfaces/StyleObjects';
import {PlottableMeasurement} from './interfaces/RCPCHMeasurementObject';

export type Results = {
  centileData: any[];
  domains: Domains;
};

export type MainChartProps = {
  title: string;
  subtitle: string;
  measurementMethod: 'height' | 'weight' | 'ofc' | 'bmi';
  sex: 'male' | 'female';
  measurementsArray: PlottableMeasurement[];
  reference: 'uk-who' | 'turner' | 'trisomy-21';
  chartStyle: ChartStyle;
  axisStyle: AxisStyle;
  gridlineStyle: GridlineStyle;
  centileStyle: CentileStyle;
  measurementStyle: MeasurementStyle;
};
