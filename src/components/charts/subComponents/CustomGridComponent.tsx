import React from 'react';
import {LineSegment} from 'victory-native';

function CustomGridComponent({datum, chartScaleType, ...otherProps}) {
  if (
    (!Number.isInteger(Number((datum * 12).toFixed(2))) &&
      (chartScaleType === 'prem' || chartScaleType === 'infant')) ||
    chartScaleType === 'smallChild' ||
    chartScaleType === 'biggerChild'
  ) {
    return <LineSegment {...otherProps} />;
  } else {
    return null;
  }
}

export default CustomGridComponent;
