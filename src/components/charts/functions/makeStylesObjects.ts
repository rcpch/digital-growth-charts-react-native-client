import {
  AxisStyle,
  CentileStyle,
  ChartStyle,
  MeasurementStyle,
  GridlineStyle,
} from '../interfaces/StyleObjects';

function makeStylesObjects(
  axisStyle: AxisStyle,
  centileStyle: CentileStyle,
  chartStyle?: ChartStyle,
  measurementStyle?: MeasurementStyle,
  gridlineStyle?: GridlineStyle,
) {
  const parsedAxisStyle = {
    axis: {
      stroke: axisStyle.axisStroke,
    },
    axisLabel: {
      fontSize: axisStyle.axisLabelSize,
      paddingBottom: 20,
      color: axisStyle.axisStroke,
      fontFamily: axisStyle.axisLabelFont,
    },
    ticks: {
      stroke: axisStyle.axisStroke,
    },
    tickLabels: {
      fontSize: axisStyle.tickLabelSize,
      padding: 5,
      color: axisStyle.axisLabelColour,
      fontFamily: axisStyle.axisLabelFont,
    },
    grid: {
      stroke: gridlineStyle?.gridlines ? gridlineStyle.stroke : null,
      strokeWidth: gridlineStyle?.strokeWidth,
    },
  };
  const tickLabelStyle = {
    fill: axisStyle.axisLabelColour,
    fontSize: axisStyle.tickLabelSize,
    fontFamily: axisStyle.axisLabelFont,
  };
  const dashedCentileStyle = {
    data: {
      stroke: centileStyle.centileStroke,
      strokeWidth: centileStyle.centileStrokeWidth,
      strokeLinecap: 'round',
      strokeDasharray: '5 5',
    },
  };
  const continuousCentileStyle = {
    data: {
      stroke: centileStyle.centileStroke,
      strokeWidth: centileStyle.centileStrokeWidth,
      strokeLinecap: 'round',
    },
  };
  const parsedMeasurementStyle =  {

  }
  return {
    parsedAxisStyle,
    tickLabelStyle,
    dashedCentileStyle,
    continuousCentileStyle,
  };
}

export default makeStylesObjects;
