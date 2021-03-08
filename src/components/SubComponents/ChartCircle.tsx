import React from 'react';
import {Circle, Line, Svg, Text} from 'react-native-svg';

type AppProps = {x: number; y: number; style: any; text: number};

const ChartCircle = ({x, y, style, text}: AppProps) => {
  // lollipop tick for months
  if (text > 0) {
    return (
      <Svg>
        <Text
          x={x}
          y={y - 17.5}
          textAnchor="middle"
          fill={style.stroke}
          fontSize={6}>
          {text}
        </Text>
        <Circle
          cx={x}
          cy={y - 20}
          r={5}
          stroke={style.stroke}
          fill="transparent"
        />
        <Line x1={x} x2={x} y1={y - 5} y2={y - 15} stroke={style.stroke} />
      </Svg>
    );
  } else {
    return null;
  }
};

export default ChartCircle;
