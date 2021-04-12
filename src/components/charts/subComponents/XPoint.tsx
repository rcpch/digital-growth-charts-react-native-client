import React from 'react';
import {Point} from 'victory-native';

const XPoint = (props: any) => {
  // the x for the corrected age, circle for the chronological age
  const transform = `rotate(45, ${props.x}, ${props.y})`;

  return <Point {...props} symbol="plus" transform={transform} />;
};

export default XPoint;
