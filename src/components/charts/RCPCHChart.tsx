import React from 'react';

import CentileChart from './CentileChart';
import makeAllStyles from './functions/makeAllStyles';
import {RCPCHChartProps} from './RCPCHChart.types';
import ErrorBoundary from './subComponents/ErrorBoundary';

function RCPCHChart({
  title,
  subtitle,
  measurementMethod,
  reference,
  sex,
  measurementsArray,
  chartStyle,
  modalStyle,
  axisStyle,
  gridlineStyle,
  centileStyle,
  measurementStyle,
}: RCPCHChartProps) {
  const styles = makeAllStyles(
    chartStyle,
    axisStyle,
    gridlineStyle,
    centileStyle,
    measurementStyle,
    modalStyle,
  );
  return (
    <ErrorBoundary titleText={styles.titleTextStyle} subTitleText={styles.subtitleTextStyle}>
      <CentileChart
        title={title}
        subtitle={subtitle}
        measurementMethod={measurementMethod}
        reference={reference}
        sex={sex}
        measurementsArray={measurementsArray}
        styles={styles}
      />
    </ErrorBoundary>
  );
}

export default RCPCHChart;
