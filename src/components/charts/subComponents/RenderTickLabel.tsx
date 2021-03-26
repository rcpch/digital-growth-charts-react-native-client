import React from 'react';
import {Circle, Line, Svg, Text} from 'react-native-svg';

function RenderTickLabel(props) {
  const x = props.x;
  const y = props.y;
  const text = props.text;
  const domains = props.domains;
  const style = props.style;
  const LolliPop = ({textLabel}: {textLabel: number}) => {
    if (text !== domains.x[0]) {
      return (
        <Svg>
          <Text
            x={x}
            y={y - 19}
            textAnchor="middle"
            fill="black"
            fontSize={10}
            fontFamily={style.axisLabelFont}>
            {textLabel}
          </Text>
          <Circle cx={x} cy={y - 22} r={8} stroke="black" fill="transparent" />
          <Line x1={x} x2={x} y1={y - 5} y2={y - 14} stroke="black" />
        </Svg>
      );
    } else {
      return null;
    }
  };
  const PlainAxisLabel = ({textLabel}: {textLabel: number}) => {
    return (
      <Svg>
        <Text
          x={x}
          y={y + 8}
          textAnchor="middle"
          fill="black"
          fontSize={11}
          fontFamily={style.axisLabelFont}>
          {textLabel}
        </Text>
      </Svg>
    );
  };
  if (domains.x[1] <= 0.03832991) {
    const gestWeeks = 40 + Math.round(text * 52);
    return <PlainAxisLabel textLabel={gestWeeks} />;
  } else if (domains.x[1] <= 1.3) {
    const days = Math.round(text * 365);
    const months = days / 30;
    const weeks = days / 7;
    if (days % 30 === 0 && days % 14 === 0) {
      return (
        <>
          <LolliPop textLabel={months} />
          <PlainAxisLabel textLabel={weeks} />
        </>
      );
    } else if (days % 30 === 0) {
      return <LolliPop textLabel={months} />;
    } else if (days % 14 === 0) {
      return <PlainAxisLabel textLabel={weeks} />;
    } else {
      return null;
    }
  } else if (domains.x[1] <= 4) {
    if (Number.isInteger(text)) {
      return (
        <>
          <LolliPop textLabel={text * 12} />
          <PlainAxisLabel textLabel={text} />
        </>
      );
    } else if ((text * 12) % 2 === 0) {
      return <LolliPop textLabel={text * 12} />;
    } else {
      return null;
    }
  } else {
    return <PlainAxisLabel textLabel={text} />;
  }
}

export default RenderTickLabel;
