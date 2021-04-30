import React from 'react';

import CentileChart from './CentileChart';
import {MainChartProps} from './CentileChart.types';
import ErrorBoundary from './subComponents/ErrorBoundary';

function RCPCHChart({
  title,
  subtitle,
  measurementMethod,
  reference,
  sex,
  measurementsArray,
  chartStyle,
  axisStyle,
  gridlineStyle,
  centileStyle,
  measurementStyle,
}: MainChartProps) {
  return (
    <ErrorBoundary>
      <CentileChart
        title={title}
        subtitle={subtitle}
        measurementMethod={measurementMethod}
        reference={reference}
        sex={sex}
        measurementsArray={measurementsArray}
        chartStyle={chartStyle}
        axisStyle={axisStyle}
        gridlineStyle={gridlineStyle}
        centileStyle={centileStyle}
        measurementStyle={measurementStyle}
      />
    </ErrorBoundary>
  );
}

export default RCPCHChart;
