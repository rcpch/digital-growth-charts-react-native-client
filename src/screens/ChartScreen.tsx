import React from 'react';
import {StyleSheet, View, useColorScheme} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {RCPCHChart, Screen, AppText} from '../components';
import {colors, windowWidth, windowHeight, bannerHeight} from '../config';

import {
  AxisStyle,
  CentileStyle,
  ChartStyle,
  GridlineStyle,
  MeasurementStyle,
  ModalStyle,
} from '../components/charts/interfaces/StyleObjects';

type propTypes = {
  route: {[key: string]: any};
};

function ChartScreen({route}: propTypes) {
  const {
    measurementType,
    specificResults,
    reference,
    userLabelNames,
  } = route.params;

  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark' ? true : false;

  const safeAreaHeight =
    windowHeight - insets.top - insets.bottom - bannerHeight;

  const sex = specificResults?.birth_data.sex;

  let referenceLabel = 'UK-WHO';
  if (reference === 'trisomy-21') {
    referenceLabel = "Down's Syndrome";
  } else if (reference === 'turner') {
    referenceLabel = "Turner's Syndrome";
  }

  const subtitleText = specificResults
    ? `${sex === 'female' ? 'Female' : 'Male'} | ${referenceLabel}`
    : '';

  const textColor = isDark ? 'white' : 'black';

  const customChartStyle: ChartStyle = {
    width: windowWidth,
    height: safeAreaHeight,
    padding: {left: 40, right: 40, top: 5, bottom: 40},
    titleStyle: {
      name: 'Montserrat-Bold',
      weight: 'bold',
      colour: textColor,
    },
    subTitleStyle: {
      name: 'Montserrat-Bold',
      weight: 'bold',
      colour: textColor,
    },
    termFill: isDark ? '#252526' : undefined,
    termStroke: isDark ? '#252526' : undefined,
  };

  const customAxisStyle: AxisStyle = {
    axisStroke: textColor,
    axisLabelTextStyle: {
      name: 'Montserrat-Bold',
      weight: 'bold',
      colour: textColor,
    },
    tickLabelTextStyle: {
      name: 'Montserrat-Regular',
      colour: textColor,
    },
    buttonTextStyle: {
      name: 'Montserrat-Bold',
      weight: 'bold',
    },
  };

  const customCentileStyle: CentileStyle = {
    delayedPubertyAreaFill: isDark ? colors.dark : null,
    continuous: {
      centileStroke: isDark ? colors.light : null,
    },
  };

  const customMeasurementStyle: MeasurementStyle = {
    measurementFill: textColor,
  };

  const customGridlineStyle: GridlineStyle = {
    gridlines: isDark ? false : true,
  };

  const naTextColor = {color: textColor};

  return (
    <Screen renderBack>
      {specificResults ? (
        <RCPCHChart
          title={`${userLabelNames[measurementType]} Chart`}
          subtitle={subtitleText}
          measurementMethod={measurementType}
          reference={reference}
          sex={sex}
          measurementsArray={[specificResults]}
          chartStyle={customChartStyle}
          modalStyle={customModalStyle}
          axisStyle={customAxisStyle}
          centileStyle={isDark ? customCentileStyle : undefined}
          gridlineStyle={customGridlineStyle}
          measurementStyle={customMeasurementStyle}
        />
      ) : (
        <View style={styles.naContainer}>
          <AppText style={{...styles.naText, ...naTextColor}}>N/A</AppText>
        </View>
      )}
    </Screen>
  );
}

const customModalStyle: ModalStyle = {
  titleStyle: {
    name: 'Montserrat-Bold',
    weight: 'bold',
  },
  subTitleStyle: {
    name: 'Montserrat-Regular',
  },
};

const styles = StyleSheet.create({
  chart: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  naText: {
    fontSize: 25,
    fontWeight: '500',
    fontFamily: 'Montserrat-Bold',
  },
  naContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default ChartScreen;
