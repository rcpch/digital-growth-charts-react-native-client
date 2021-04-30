import {
  AxisStyle,
  CentileStyle,
  ChartStyle,
  GridlineStyle,
  MeasurementStyle,
} from './interfaces/StyleObjects';
import {Measurement} from './interfaces/RCPCHMeasurementObject';
import {Domains} from './interfaces/Domains';

export type ComputedData = {
  centileData: null | any[];
  computedDomains: null | Domains;
  maxDomains: null | Domains;
  chartScaleType: 'prem' | 'infant' | 'smallChild' | 'biggerChild';
  pointsForCentileLabels: {x: number; y: number; centile: string}[];
};

export type MainChartProps = {
  title: string;
  subtitle: string;
  measurementMethod: 'height' | 'weight' | 'ofc' | 'bmi';
  sex: 'male' | 'female';
  measurementsArray: Measurement[];
  reference: 'uk-who' | 'turner' | 'trisomy-21';
  chartStyle: ChartStyle;
  axisStyle: AxisStyle;
  gridlineStyle: GridlineStyle;
  centileStyle: CentileStyle;
  measurementStyle: MeasurementStyle;
};
