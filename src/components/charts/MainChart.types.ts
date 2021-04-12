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
  centileData: null | any[];
  domains: null | Domains;
  chartScaleType: 'prem' | 'infant' | 'smallChild' | 'biggerChild';
  pointsForCentileLabels: any[];
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
