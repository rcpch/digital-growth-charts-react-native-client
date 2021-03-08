import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {plottableChildResult} from '../../apiReference';

import UKWHOChart from './UKWHOChart';

const allMeasurementPairs = plottableChildResult.child_data.centile_data;

const VictoryPlaceholder = () => {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const chartStyle = {
    width: windowWidth - 10,
    height: windowHeight - 10,
    backgroundColour: 'white',
    tooltipBackgroundColour: 'grey',
    tooltipTextColour: 'white',
  };
  return (
    <View style={styles.container}>
      <UKWHOChart
        title="Test"
        subtitle=""
        measurementMethod="weight"
        sex="female"
        allMeasurementPairs={allMeasurementPairs}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const measurementStyle = {
  measurementFill: 'black',
  measurementSize: 4,
  measurementShape: 'circle',
};

const centileStyle = {
  centileStroke: 'black',
  centileStrokeWidth: 2,
  delayedPubertyAreaFill: 'cyan',
};

const gridlineStyle = {
  gridlines: false,
  stroke: 'grey',
  strokeWidth: 1,
  dashed: false,
};

const axisStyle = {
  axisStroke: 'black',
  axisLabelColour: 'black',
  axisLabelFont: 'Oxygen',
  axisLabelSize: 10,
  tickLabelSize: 10,
};

export default VictoryPlaceholder;
