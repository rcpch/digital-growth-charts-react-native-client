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

// const eg = {
//   birth_data: {
//     birth_date: 'Fri, 20 Mar 2020 18:27:28 GMT',
//     estimated_date_delivery: 'Fri, 20 Mar 2020 18:27:28 GMT',
//     estimated_date_delivery_string: 'Fri 20 March, 2020',
//     gestation_days: 0,
//     gestation_weeks: 40,
//     sex: 'male',
//   },
//   child_observation_value: {
//     measurement_method: 'weight',
//     observation_value: 9,
//     observation_value_error: null,
//   },
//   measurement_calculated_values: {
//     chronological_centile: 26,
//     chronological_centile_band:
//       'This weight measurement is on or near the 25th centile.',
//     chronological_measurement_error: null,
//     chronological_sds: -0.6330942999002411,
//     corrected_centile: 26,
//     corrected_centile_band:
//       'This weight measurement is on or near the 25th centile.',
//     corrected_measurement_error: null,
//     corrected_sds: -0.6330942999002411,
//     measurement_method: 'weight',
//   },
//   measurement_dates: {
//     chronological_calendar_age: '1 year',
//     chronological_decimal_age: 0.999315537303217,
//     chronological_decimal_age_error: null,
//     comments: {
//       clinician_chronological_decimal_age_comment:
//         'Born Term. No correction has been made for gestation.',
//       clinician_corrected_decimal_age_comment:
//         'Born at term. No correction has been made for gestation.',
//       lay_chronological_decimal_age_comment:
//         'Your baby was born on their due date.',
//       lay_corrected_decimal_age_comment:
//         'Your baby was born on their due date.',
//     },
//     corrected_calendar_age: '1 year',
//     corrected_decimal_age: 0.999315537303217,
//     corrected_decimal_age_error: null,
//     corrected_gestational_age: {
//       corrected_gestation_days: null,
//       corrected_gestation_weeks: null,
//     },
//     observation_date: 'Sat, 20 Mar 2021 18:27:42 GMT',
//   },
// };
