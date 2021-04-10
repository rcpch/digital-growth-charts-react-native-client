import React from 'react';
import {LineSegment} from 'victory-native';

type PropTypes = {
  datum?: number;
  chartScaleType: 'prem' | 'infant' | 'smallChild' | 'biggerChild';
};

/*
This is a wrapper for the gridline component, enabling filtering out of month gridlines which look messy
if rendered with week gridlines
*/

function CustomGridComponent({
  datum,
  chartScaleType,
  ...otherProps
}: PropTypes) {
  if (!datum) {
    return null;
  } else {
    if (
      Number.isInteger(Number((datum * 12).toFixed(2))) &&
      datum < 1 &&
      (chartScaleType === 'prem' || chartScaleType === 'infant')
    ) {
      return null;
    } else {
      return <LineSegment {...otherProps} />;
    }
  }
}

export default CustomGridComponent;
