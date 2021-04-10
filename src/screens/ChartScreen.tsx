import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MainChart, Screen, AppText} from '../components';

import {colors, containerWidth, windowHeight} from '../config';

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

  const extraDimensionsChartContainer = {
    marginTop: insets.top,
    marginBottom: insets.bottom,
    height: windowHeight - insets.top - 30,
  };

  const sex = specificResults?.birth_data.sex;

  const customChartStyle = {
    width: containerWidth,
    height: extraDimensionsChartContainer.height - 90,
    padding: {left: 40, right: 40, top: 20, bottom: 50},
    termFill: '#D9D9D9',
    termStroke: 'black',
    infoBoxFill: colors.darkest,
    infoBoxStroke: 'black',
    infoBoxTextStyle: {
      name: 'Montserrat-Regular',
      colour: 'white',
      size: '14',
      weight: 'bold',
    },
    toggleButtonInactiveColour: colors.medium,
    toggleButtonActiveColour: colors.darkest,
    toggleButtonTextColour: 'white',
    titleStyle: {
      name: 'Montserrat-Regular',
    },
  };

  let referenceLabel = 'UK-WHO';
  if (reference === 'trisomy-21') {
    referenceLabel = "Down's Syndrome";
  } else if (reference === 'turner') {
    referenceLabel = "Turner's Syndrome";
  }

  const subtitleText = specificResults
    ? `${sex === 'female' ? 'Female' : 'Male'} | ${referenceLabel}`
    : '';

  return (
    <Screen renderBack>
      {specificResults ? (
        <MainChart
          title={`${userLabelNames[measurementType]} Chart`}
          subtitle={subtitleText}
          measurementMethod={measurementType}
          reference={reference}
          sex={sex}
          measurementsArray={[specificResults]}
          chartStyle={customChartStyle}
          axisStyle={customAxisStyle}
          gridlineStyle={customGridlineStyle}
          centileStyle={customCentileStyle}
          measurementStyle={customMeasurementStyle}
        />
      ) : (
        <View style={styles.naContainer}>
          <AppText style={styles.naText}>N/A</AppText>
        </View>
      )}
    </Screen>
  );
}

const customAxisStyle = {
  axisStroke: 'black',
  axisLabelTextStyle: {
    name: 'Montserrat-Regular',
    colour: 'black',
    size: 12,
    weight: 'regular',
  },
  tickLabelTextStyle: {
    name: 'Montserrat-Regular',
    colour: 'black',
    size: 12,
    weight: 'regular',
  },
};

const customCentileStyle = {
  centileStroke: 'black',
  centileStrokeWidth: 2,
  delayedPubertyAreaFill: colors.medium,
};

const customMeasurementStyle = {
  measurementFill: 'black',
  measurementSize: 6,
  measurementShape: 'circle',
};

const customGridlineStyle = {
  gridlines: true,
  stroke: '#D9D9D9',
  strokeWidth: 1,
  dashed: false,
};

const styles = StyleSheet.create({
  chart: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  naText: {
    color: colors.black,
    fontSize: 25,
    fontWeight: '500',
  },
  naContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default ChartScreen;
