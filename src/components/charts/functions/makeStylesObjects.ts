import {Platform} from 'react-native';
import {colors} from '../../../config';

const defaultSystemFont = Platform.OS === 'ios' ? 'System' : 'Roboto';

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
  chartStyle: ChartStyle,
  measurementStyle: MeasurementStyle,
  gridlineStyle: GridlineStyle,
) {
  const loadingChartContainerStyle = {
    height: chartStyle.height,
    width: chartStyle.width,
    alignItems: 'center',
    justifyContent: 'center',
  };
  const loadingTextStyle = {
    fontFamily: chartStyle.titleStyle?.name || defaultSystemFont,
    fontWeight: chartStyle.titleStyle?.weight || '500',
    fontSize: chartStyle.titleStyle?.size || 20,
    color: chartStyle.titleStyle?.colour || 'black',
  };
  const chartContainerStyle = {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: chartStyle.backgroundColour,
  };
  const chartPaddingStyle = chartStyle.padding
    ? {
        left: chartStyle.padding.left,
        right: chartStyle.padding.right,
        top: 5,
        bottom: chartStyle.padding.bottom,
      }
    : null;

  const chartBackgroundStyle = {
    background: {
      fill: chartStyle.backgroundColour || null,
    },
  };

  const titleTextStyle = {
    fontFamily: chartStyle.titleStyle?.name || defaultSystemFont,
    fontWeight: chartStyle.titleStyle?.weight || 'bold',
    fontSize: chartStyle.titleStyle?.size || 20,
    color: chartStyle.titleStyle?.colour || 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
  };

  const titleContainerStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: chartStyle.padding?.top ? chartStyle.padding?.top : 0,
    paddingBottom: 20,
  };

  const subtitleTextStyle = {
    fontFamily: chartStyle.titleStyle?.name || defaultSystemFont,
    fontWeight: chartStyle.titleStyle?.weight || 'bold',
    fontSize: chartStyle.titleStyle?.size || 16,
    color: chartStyle.titleStyle?.colour || 'black',
  };

  const parsedAxisStyle = {
    axis: {
      stroke: axisStyle.axisStroke,
    },
    axisLabel: {
      fontSize: axisStyle.axisLabelTextStyle?.size || 12,
      padding: 25,
      color: axisStyle.axisLabelTextStyle?.colour || 'black',
      fontFamily: axisStyle.axisLabelTextStyle?.name || defaultSystemFont,
      fontWeight: axisStyle.axisLabelTextStyle?.weight || 'bold',
    },
    ticks: {
      stroke: axisStyle.axisStroke,
    },
    tickLabels: {
      fontSize: axisStyle.tickLabelTextStyle?.size || 10,
      padding: 2,
      color: axisStyle.axisLabelTextStyle?.colour || 'black',
      fontFamily: axisStyle.axisLabelTextStyle?.name || defaultSystemFont,
    },
    grid: {
      stroke: gridlineStyle?.gridlines ? gridlineStyle?.stroke : null,
      strokeWidth: gridlineStyle.strokeWidth,
      strokeDasharray: gridlineStyle.dashed ? '5 5' : null,
    },
  };
  const tickLabelStyle = {
    fill: axisStyle.tickLabelTextStyle?.colour,
    fontSize: axisStyle.tickLabelTextStyle?.size,
    fontFamily: axisStyle.tickLabelTextStyle?.name,
  };
  const dashedCentileStyle = {
    data: {
      stroke: colors.dark || centileStyle.centileStroke,
      strokeWidth: centileStyle.centileStrokeWidth,
      strokeLinecap: 'round',
      strokeDasharray: '5 5',
    },
  };
  const continuousCentileStyle = {
    data: {
      stroke: colors.pink || centileStyle.centileStroke,
      strokeWidth: centileStyle.centileStrokeWidth,
      strokeLinecap: 'round',
    },
  };
  const measurementPointStyle = {
    data: {
      fill: measurementStyle.measurementFill,
      strokeWidth: measurementStyle.measurementSize,
    },
  };
  const measurementLineStyle = {
    data: {
      stroke: measurementStyle.measurementFill,
      strokeWidth: 1.25,
    },
  };
  const termFillStyle = {data: {fill: chartStyle.termFill}};

  const centileLabelStyle = {
    fontSize: 10,
    fontFamily: 'Montserrat-Bold',
    fontWeight: 'bold',
  };

  return {
    loadingChartContainerStyle,
    loadingTextStyle,
    chartContainerStyle,
    chartPaddingStyle,
    chartBackgroundStyle,
    titleTextStyle,
    titleContainerStyle,
    subtitleTextStyle,
    parsedAxisStyle,
    tickLabelStyle,
    dashedCentileStyle,
    continuousCentileStyle,
    measurementPointStyle,
    measurementLineStyle,
    termFillStyle,
    centileLabelStyle,
  };
}

export default makeStylesObjects;
