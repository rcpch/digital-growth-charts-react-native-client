import React from 'react';
import {Platform} from 'react-native';
import {Text as SvgText, Circle, G} from 'react-native-svg';

const systemFont = Platform.OS === 'android' ? 'Roboto' : 'System';

type Proptypes = {
  x?: number;
  y?: number;
  text?: number | string;
  reverse: boolean;
};

function InfoPopup({x, y, text, reverse}: Proptypes) {
  if (x && y && text) {
    const xCoords = reverse ? x - 16 : x + 16;
    return (
      <G>
        <SvgText
          x={xCoords}
          y={y + 20}
          textAnchor="middle"
          fill="black"
          fontSize={15}
          fontFamily={systemFont}
          fontWeight="bold">
          i
        </SvgText>
        <Circle
          cx={xCoords}
          cy={y + 15}
          r={12}
          stroke="black"
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
