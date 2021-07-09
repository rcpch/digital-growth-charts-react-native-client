import {Platform} from 'react-native';
const defaultSystemFont = Platform.OS === 'ios' ? 'System' : 'Roboto';

import {
  AxisStyle,
  CentileStyle,
  ChartStyle,
  GridlineStyle,
  MeasurementStyle,
  ModalStyle,
} from '../interfaces/StyleObjects';

const black = '#000000';
const midGrey = '#b3b3b3';
const lightGrey = '#d9d9d9';
const darkPink = '#cb3083';
const darkBlue = '#0B1054';

function makeAllStyles(
  chartStyle?: ChartStyle,
  axisStyle?: AxisStyle,
  gridlineStyle?: GridlineStyle,
  centileStyle?: CentileStyle,
  measurementStyle?: MeasurementStyle,
  modalStyle?: ModalStyle,
) {
  let newGridlineStyle = {
    stroke: lightGrey,
    strokeWidth: 1,
    strokeDasharray: '',
  };
  if (gridlineStyle?.gridlines === true) {
    newGridlineStyle = {
      stroke: gridlineStyle.stroke ?? lightGrey,
      strokeWidth: gridlineStyle.strokeWidth ?? 1,
      strokeDasharray: gridlineStyle.dashed ? '5 5' : '',
    };
  } else if (gridlineStyle?.gridlines === false) {
    newGridlineStyle = {
      stroke: 'transparent',
      strokeWidth: 0,
      strokeDasharray: '',
    };
  }
  return {
    titleContainerStyle: {
      height: 60,
      justifyContent: 'center',
    },
    loadingChartContainerStyle: {
      height: chartStyle?.height ?? 500,
      width: chartStyle?.width ?? 300,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingTextStyle: {
      fontFamily: chartStyle?.titleStyle?.name ?? defaultSystemFont,
      fontWeight:
        chartStyle?.titleStyle?.weight === 'italic'
          ? 'normal'
          : chartStyle?.titleStyle?.weight ?? 'bold',
      fontSize: chartStyle?.titleStyle?.size ?? 20,
      color: chartStyle?.titleStyle?.colour ?? black,
      fontStyle:
        chartStyle?.titleStyle?.weight === 'italic' ? 'italic' : 'normal',
    },
    chartContainerStyle: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: chartStyle?.backgroundColour || null,
      //   backgroundColor: 'green',
    },
    titleTextStyle: {
      fontFamily: chartStyle?.titleStyle?.name ?? defaultSystemFont,
      fontSize: chartStyle?.titleStyle?.size ?? 20,
      color: chartStyle?.titleStyle?.colour ?? black,
      textAlign: 'center',
      textAlignVertical: 'center',
      fontWeight:
        chartStyle?.titleStyle?.weight === 'italic'
          ? 'normal'
          : chartStyle?.titleStyle?.weight ?? 'bold',
      fontStyle:
        chartStyle?.titleStyle?.weight === 'italic' ? 'italic' : 'normal',
    },
    subtitleTextStyle: {
      fontFamily: chartStyle?.subTitleStyle?.name ?? defaultSystemFont,
      fontWeight:
        chartStyle?.subTitleStyle?.weight === 'italic'
          ? 'normal'
          : chartStyle?.subTitleStyle?.weight ?? 'bold',
      fontStyle:
        chartStyle?.subTitleStyle?.weight === 'italic' ? 'italic' : 'normal',
      fontSize: chartStyle?.subTitleStyle?.size ?? 16,
      color: chartStyle?.subTitleStyle?.colour ?? black,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    chartHeight: chartStyle?.height ? chartStyle.height - 60 : 440,
    chartWidth: chartStyle?.width ?? 300,
    chartPadding: {
      left: chartStyle?.padding?.left ?? 40,
      right: chartStyle?.padding?.right ?? 40,
      top: chartStyle?.padding?.top ?? 5,
      bottom: chartStyle?.padding?.bottom ?? 40,
    },
    chartMisc: {
      background: {
        fill: chartStyle?.backgroundColour ?? 'transparent',
      },
    },
    termAreaLabel: {
      data: {
        stroke: 'transparent',
      },
    },
    termArea: {
      data: {
        fill: chartStyle?.termFill ?? midGrey,
        stroke: chartStyle?.termStroke ?? midGrey,
      },
    },
    xAxis: {
      axis: {
        stroke: axisStyle?.axisStroke ?? black,
        strokeWidth: 1.0,
      },
      axisLabel: {
        fontSize: axisStyle?.axisLabelTextStyle?.size ?? 10,
        padding: 20,
        fill: axisStyle?.axisLabelTextStyle?.colour ?? black,
        fontFamily: axisStyle?.axisLabelTextStyle?.name ?? defaultSystemFont,
        fontWeight:
          axisStyle?.axisLabelTextStyle?.weight === 'italic'
            ? 'normal'
            : axisStyle?.axisLabelTextStyle?.weight ?? 'bold',
        fontStyle:
          axisStyle?.axisLabelTextStyle?.weight === 'italic'
            ? 'italic'
            : 'normal',
      },
      ticks: {
        stroke: axisStyle?.tickLabelTextStyle?.colour ?? black,
      },
      tickLabels: {
        fontSize: axisStyle?.tickLabelTextStyle?.size ?? 10,
        padding: 5,
        fill: axisStyle?.tickLabelTextStyle?.colour ?? black,
        color: axisStyle?.tickLabelTextStyle?.colour ?? black,
        fontFamily: axisStyle?.tickLabelTextStyle?.name ?? defaultSystemFont,
      },
      grid: {
        ...newGridlineStyle,
      },
    },
    label: {
      fill: axisStyle?.tickLabelTextStyle?.colour ?? black,
      fontSize: axisStyle?.tickLabelTextStyle?.size ?? 10,
      fontFamily: axisStyle?.tickLabelTextStyle?.name ?? defaultSystemFont,
    },
    yAxis: {
      axis: {
        stroke: axisStyle?.axisStroke ?? black,
        strokeWidth: 1.0,
      },
      axisLabel: {
        fontSize: axisStyle?.axisLabelTextStyle?.size ?? 10,
        padding: 25,
        fill: axisStyle?.axisLabelTextStyle?.colour ?? black,
        fontFamily: axisStyle?.axisLabelTextStyle?.name ?? defaultSystemFont,
        fontWeight:
          axisStyle?.axisLabelTextStyle?.weight === 'italic'
            ? 'normal'
            : axisStyle?.axisLabelTextStyle?.weight ?? 'bold',
        fontStyle:
          axisStyle?.axisLabelTextStyle?.weight === 'italic'
            ? 'italic'
            : 'normal',
      },
      ticks: {
        stroke: axisStyle?.tickLabelTextStyle?.colour ?? black,
      },
      tickLabels: {
        fontSize: axisStyle?.tickLabelTextStyle?.size ?? 10,
        padding: 5,
        fill: axisStyle?.tickLabelTextStyle?.colour ?? black,
        fontFamily: axisStyle?.tickLabelTextStyle?.name ?? defaultSystemFont,
      },
      grid: {
        ...newGridlineStyle,
      },
    },
    delayedPubertyArea: {
      data: {
        stroke: centileStyle?.delayedPubertyAreaFill ?? midGrey,
        fill: centileStyle?.delayedPubertyAreaFill ?? midGrey,
        strokeWidth: centileStyle?.delayedPubertyStrokeWidth ?? 0.5,
      },
    },
    delayedPubertyThresholdLine: {
      data: {
        stroke: measurementStyle?.measurementFill ?? black,
        strokeWidth: 1,
      },
    },
    dashedCentile: {
      data: {
        stroke: centileStyle?.dashed?.centileStroke ?? darkPink,
        strokeWidth: centileStyle?.dashed?.centileStrokeWidth ?? 2,
        strokeLinecap: 'round',
        strokeDasharray: '5 5',
      },
    },
    continuousCentile: {
      data: {
        stroke: centileStyle?.continuous?.centileStroke ?? darkBlue,
        strokeWidth: centileStyle?.continuous?.centileStrokeWidth ?? 2,
        strokeLinecap: 'round',
      },
    },
    centileLabelStyle: {
      fontSize: axisStyle?.axisLabelTextStyle?.size ?? 10,
      fontFamily: axisStyle?.axisLabelTextStyle?.name ?? defaultSystemFont,
      fontWeight: 'bold',
      fill: axisStyle?.axisLabelTextStyle?.colour ?? black,
    },
    measurementPoint: {
      data: {
        fill: measurementStyle?.measurementFill ?? black,
        strokeWidth: measurementStyle?.measurementSize ?? 6,
      },
    },
    measurementLinkLine: {
      data: {
        stroke: measurementStyle?.measurementFill ?? black,
        strokeWidth: 1.25,
      },
    },
    modalStyle: {
      background: {
        backgroundColor: modalStyle?.backgroundColour ?? '#0B1054',
      },
      heading: {
        fontFamily: modalStyle?.titleStyle?.name ?? defaultSystemFont,
        color: modalStyle?.titleStyle?.colour ?? 'white',
        fontSize: modalStyle?.titleStyle?.size ?? 16,
        fontWeight:
          modalStyle?.titleStyle?.weight === 'italic'
            ? 'normal'
            : modalStyle?.titleStyle?.weight ?? 'bold',
        fontStyle:
          modalStyle?.titleStyle?.weight === 'italic' ? 'italic' : 'normal',
      },
      paragraph: {
        marginTop: 15,
        marginBottom: 10,
        fontFamily: modalStyle?.subTitleStyle?.name ?? defaultSystemFont,
        color: modalStyle?.subTitleStyle?.colour ?? 'white',
        fontSize: modalStyle?.subTitleStyle?.size ?? 15,
        textAlign: 'center',
        margin: 15,
        backgroundColor:
          modalStyle?.subTitleStyle?.backgroundColour ?? '#234797',
        padding: 10,
        borderRadius: 10,
        width: '90%',
        overflow: 'hidden',
      },
      buttonText: {
        fontFamily: chartStyle?.buttonTextStyle?.name ?? defaultSystemFont,
        color: chartStyle?.buttonTextStyle?.colour ?? 'white',
        fontSize: chartStyle?.buttonTextStyle?.size ?? 16,
        fontWeight:
          chartStyle?.buttonTextStyle?.weight === 'italic'
            ? 'normal'
            : chartStyle?.buttonTextStyle?.weight ?? 'bold',
        fontStyle:
          chartStyle?.buttonTextStyle?.weight === 'italic'
            ? 'italic'
            : 'normal',
      },
      buttonBackground: {
        backgroundColor: chartStyle?.buttonFill ?? '#CE2E85',
      },
    },
  };
}

export default makeAllStyles;
