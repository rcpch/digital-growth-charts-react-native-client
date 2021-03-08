import React from 'react';
import {Circle, Line, Svg, Text} from 'react-native-svg';

type AppProps = {
  x: number;
  y: number;
  style: any;
  text: number;
};

const MonthsLabel = ({x, y, text, style}: AppProps) => {
  // the same ChartCircle but smaller for use in axis label
  return (
    <Svg>
      <Text
        x={x + 210}
        y={y + 12.5}
        textAnchor="start"
        fontSize={style.fontSize}
        fontFamily={style.fontFamily}>
        {text}
      </Text>
      <Circle
        cx={x + 200}
        cy={y + 10}
        r={5}
        stroke="black"
        fill="transparent"
      />
      <Line x1={x + 200} x2={x + 200} y1={y + 20} y2={y + 15} stroke="black" />
    </Svg>
  );
};

export default MonthsLabel;
