import React from 'react';
import {Circle, Line, Svg, Text} from 'react-native-svg';

function RenderTickLabel(props) {
  const x = props.x;
  const y = props.y;
  const text = props.text;
  const style = props.style;
  const xLabels = props.xLabels;

  const LolliPop = ({textLabel}: {textLabel: number}) => {
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
  };
  const PlainAxisLabel = ({textLabel}: {textLabel: number}) => {
    return (
      <Svg>
        <Line x1={x} x2={x} y1={y - 5} y2={y - 3} stroke="black" />
        <Text
          x={x}
          y={y + 10}
          textAnchor="middle"
          fill="black"
          fontSize={11}
          fontFamily={style.axisLabelFont}>
          {textLabel}
        </Text>
      </Svg>
    );
  };
  const Dash = () => {
    return (
      <Svg>
        <Line x1={x} x2={x} y1={y - 5} y2={y - 3} stroke="black" />
      </Svg>
    );
  };

  const key = text.toString();
  const {lower, upper} = xLabels[key];

  const gestWeeks = 40 + Math.round(text * 52.18);
  const weeks = Math.round(text * 52.18);
  const months = Math.round(text * 12);

  switch (true) {
    case lower === 'gestWeeks' && upper === null:
      return <PlainAxisLabel textLabel={gestWeeks} />;
    case lower === 'weeks' && upper === null:
      return <PlainAxisLabel textLabel={weeks} />;
    case lower === null && upper === 'months':
      return <LolliPop textLabel={months} />;
    case lower === 'years' && upper === 'months':
      return (
        <>
          <LolliPop textLabel={months} />
          <PlainAxisLabel textLabel={text} />
        </>
      );
    case lower === 'weeks' && upper === 'months':
      return (
        <>
          <LolliPop textLabel={months} />
          <PlainAxisLabel textLabel={52} />
        </>
      );
    case lower === 'years' && upper === null:
      return <PlainAxisLabel textLabel={text} />;
    case lower === 'dash' && upper === null:
      return <Dash />;
    default:
      console.error(`RenderXTickLabel did not pick a value to render: ${text}`);
      return null;
  }
}

export default RenderTickLabel;
