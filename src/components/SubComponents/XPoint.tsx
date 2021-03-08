import React from 'react';
import {Point} from 'victory-native';

type AppProps = {datum: {age_type: string}; x: number; y: number};

const XPoint = (props: AppProps) => {
  // the x for the corrected age, circle for the chronological age
  const transform = `rotate(45, ${props.x}, ${props.y})`;
  if (props.datum.age_type === 'chronological_age') {
    return <Point {...props} symbol="circle" />;
  } else {
    return <Point {...props} symbol="plus" transform={transform} />;
  }
};

export default XPoint;
