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
  } = JSON.parse(route.params);
  const insets = useSafeAreaInsets();
  const extraDimensionsChartContainer = {
    marginTop: insets.top,
    marginBottom: insets.bottom,
    height: windowHeight - insets.top - 30,
  };
  const sex = specificResults?.birth_data.sex;
  const customChartStyle = {
    backgroundColour: 'white',
    width: containerWidth,
    height: extraDimensionsChartContainer.height - 30,
    tooltipBackgroundColour: 'black',
    tooltipTextColour: 'white',
  };
  return (
    <Screen renderBack>
      {specificResults ? (
        <View style={styles.chart}>
          <MainChart
            title={`${userLabelNames[measurementType]} Chart`}
            subtitle=""
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
        </View>
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
  axisLabelColour: 'black',
  axisLabelFont: 'Montserrat-Regular',
  axisLabelSize: 12,
  tickLabelSize: 12,
};

const customCentileStyle = {
  centileStroke: 'black',
  centileStrokeWidth: 2,
  delayedPubertyAreaFill: 'purple',
};

const customMeasurementStyle = {
  measurementFill: 'black',
  measurementSize: 4,
  measurementShape: 'circle',
};

const customGridlineStyle = {
  gridlines: false,
  stroke: 'grey',
  strokeWidth: 1,
  dashed: false,
};

const styles = StyleSheet.create({
  chart: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  openModalIcon: {
    borderRadius: 5,
    backgroundColor: colors.medium,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 7,
  },
  naText: {
    color: colors.black,
    fontSize: 25,
    fontWeight: '500',
  },
  naContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '96%',
    width: containerWidth,
  },
});

export default ChartScreen;
