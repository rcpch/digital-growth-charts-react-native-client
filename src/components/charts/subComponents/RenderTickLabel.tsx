import React from 'react';
import {Circle, G, Line, Svg, Text} from 'react-native-svg';

function RenderTickLabel(props) {
  const x = props.x;
  const y = props.y;
  const text = props.text;
  const style = props.style;
  const chartScaleType = props.chartScaleType;
  const lowerX = props.domains.x[0];

  const Dash = () => {
    return (
      <Svg>
        <Line x1={x} x2={x} y1={y - 5} y2={y - 3} stroke="black" />
      </Svg>
    );
  };
  const LolliPop = ({textLabel}: {textLabel: number}) => {
    const overrideX = textLabel === 11 ? x - 1 : x;
    if (text !== lowerX) {
      return (
        <Svg>
          <G>
            <Text
              x={overrideX}
              y={y - 19}
              textAnchor="middle"
              fill="black"
              fontSize={11}
              fontFamily={style.axisLabelFont}>
              {textLabel}
            </Text>
            <Circle
              cx={overrideX}
              cy={y - 22}
              r={9}
              stroke="black"
              fill="transparent"
            />
            <Line x1={x} x2={x} y1={y - 3} y2={y - 14} stroke="black" />
          </G>
        </Svg>
      );
    } else {
      return null;
    }
  };
  const PlainAxisLabel = ({textLabel}: {textLabel: number}) => {
    return (
      <Svg>
        <G>
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
        </G>
      </Svg>
    );
  };

  const gestWeeks = 40 + Math.round(text * 52.18);
  const weeks = Math.round(text * 52.18);
  const months = Math.round(text * 12);

  const isAllGestWeeks = (arrayNumber: number) => arrayNumber < 0.0384;
  const isEvenGestWeeks = (arrayNumber: number) => {
    const rounded = Number((text * 52.18).toFixed(2));
    return arrayNumber < 0 && Number.isInteger(rounded) && rounded % 2 === 0;
  };
  const isEvenWeeks = (arrayNumber: number) =>
    Number.isInteger(Number((arrayNumber * 52.18).toFixed(2)));
  const isMonths = (arrayNumber: number) =>
    Number.isInteger(Number((arrayNumber * 12).toFixed(2)));
  const isYears = (arrayNumber: number) => Number.isInteger(arrayNumber);

  switch (chartScaleType) {
    case 'prem':
      if (isAllGestWeeks(text)) {
        return <PlainAxisLabel textLabel={gestWeeks} />;
      } else if (isEvenWeeks(text)) {
        return <PlainAxisLabel textLabel={weeks} />;
      } else if (isMonths(text)) {
        return <LolliPop textLabel={months} />;
      } else {
        return null;
      }
    case 'infant':
      if (isMonths(text) && text !== 0 && text !== 1) {
        return <LolliPop textLabel={months} />;
      } else if (isEvenGestWeeks(text)) {
        return <PlainAxisLabel textLabel={gestWeeks} />;
      } else if (text === 1) {
        return (
          <>
            <LolliPop textLabel={months} />
            <PlainAxisLabel textLabel={52} />
          </>
        );
      } else if (isEvenWeeks(text)) {
        return <PlainAxisLabel textLabel={weeks} />;
      } else {
        return null;
      }
    case 'smallChild':
      if (text <= 4 && isMonths(text) && isYears(text)) {
        return (
          <>
            <LolliPop textLabel={months} />
            <PlainAxisLabel textLabel={text} />
          </>
        );
      } else if (text <= 4 && isMonths(text)) {
        return <LolliPop textLabel={months} />;
      } else if (isYears(text)) {
        return <PlainAxisLabel textLabel={text} />;
      } else if (Number.isInteger(text * 2)) {
        return <Dash />;
      } else {
        return null;
      }
    case 'biggerChild':
      if (isYears(text)) {
        return <PlainAxisLabel textLabel={text} />;
      } else if (Number.isInteger(text * 2)) {
        return <Dash />;
      } else {
        return null;
      }
    default:
      console.error('No valid chartScaleType picked up by RenderTickLabel ');
      return null;
  }
}

export default RenderTickLabel;
