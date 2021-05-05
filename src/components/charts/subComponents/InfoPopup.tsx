import React from 'react';
import {Platform} from 'react-native';
import {Text as SvgText, Circle, G} from 'react-native-svg';

const systemFont = Platform.OS === 'android' ? 'Roboto' : 'System';

type Proptypes = {
  x?: number;
  y?: number;
  text?: number | string;
  reverse: boolean;
  style: any;
};

function InfoPopup({x, y, text, reverse, style}: Proptypes) {
  if (x && y && text) {
    const xCoords = reverse ? x - 16 : x + 16;
    return (
      <G>
        <SvgText
          x={xCoords}
          y={y + 20}
          textAnchor="middle"
          fill={style.fill}
          fontSize={15}
          fontFamily={systemFont}
          fontWeight="bold">
          i
        </SvgText>
        <Circle
          cx={xCoords}
          cy={y + 15}
          r={12}
          stroke={style.fill}
          strokeWidth={2}
          fill="transparent"
        />
      </G>
    );
  } else {
    return null;
  }
}

export default InfoPopup;
