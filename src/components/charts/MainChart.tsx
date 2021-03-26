import React, {useState, useMemo, useEffect} from 'react';
import {View} from 'react-native';
import {
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryAxis,
  VictoryLegend,
  VictoryLabel,
  VictoryArea,
  VictoryZoomContainer,
} from 'victory-native';

import {
  yAxisLabel,
  makeXTickValues,
  getDomainsAndData,
  makeStylesObjects,
} from './functions';
import RenderTickLabel from './subComponents/RenderTickLabel';
import XPoint from './subComponents/XPoint';

import {ICentile} from './interfaces/CentilesObject';
import {PlottableMeasurement} from './interfaces/RCPCHMeasurementObject';
import {Domains} from './interfaces/Domains';
import { MainChartProps, Results } from './MainChart.types';


function MainChart({
  title,
  subtitle,
  measurementMethod,
  reference,
  sex,
  measurementsArray,
  chartStyle,
  axisStyle,
  gridlineStyle,
  centileStyle,
  measurementStyle,
}: MainChartProps) {
  const {
    parsedAxisStyle,
    tickLabelStyle,
    dashedCentileStyle,
    continuousCentileStyle,
  } = makeStylesObjects(
    axisStyle,
    centileStyle,
    chartStyle,
    measurementStyle,
    gridlineStyle,
  );
  const label = 'Age';
  const blankInternalState: {
    centileData: null | any[];
    domains: null | Domains;
    tickValues: null | number[];
  } = {
    centileData: null,
    domains: null,
    tickValues: null,
  };

  const [showChronologicalAge, setShowChronologicalAge] = useState(true);
  const [showCorrectedAge, setShowCorrectedAge] = useState(true);
  const [internalData, setInternalData] = useState(blankInternalState);

  const tickValues = internalData.tickValues;
  const centileData = internalData.centileData;
  const domains = internalData.domains;

  useEffect(() => {
    getDomainsAndData(measurementsArray, sex, measurementMethod, reference)
      .then((results: Results) => {
        const tickValues = makeXTickValues(results.domains);
        setInternalData({
          centileData: results.centileData,
          domains: results.domains,
          tickValues: tickValues,
        });
      })
      .catch((error) => console.error(error.message));
  }, [sex, measurementMethod, reference, measurementsArray]);

  if (!domains) {
    return (
      <View style={{height: chartStyle.height, width: chartStyle.width}} />
    );
  } else {
    return (
      <VictoryChart
        width={chartStyle.width}
        height={chartStyle.height}
        domain={domains}>
        <VictoryLegend
          title={[title, subtitle]}
          centerTitle
          titleOrientation="top"
          orientation="horizontal"
          style={{
            data: {
              fill: 'transparent',
            },
            title: {
              fontFamily: 'Montserrat-Regular',
              fontWeight: '500',
              fontSize: 18,
            },
          }}
          y={20}
          x={chartStyle.width / 2.8}
          width={chartStyle.width}
          data={[]}
        />
        <VictoryAxis
          label={yAxisLabel(measurementMethod)}
          style={parsedAxisStyle}
          dependentAxis
        />
        <VictoryAxis
          label={label}
          style={parsedAxisStyle}
          tickValues={tickValues}
          tickLabelComponent={
            <RenderTickLabel style={tickLabelStyle} domains={domains} />
          }
        />
        {centileData && centileData.map((reference, index) => {
          if (reference.length > 0) {
            return (
              <VictoryGroup key={index}>
                {reference.map((centile: ICentile, centileIndex: number) => {
                  if (centileIndex % 2 === 0) {
                    // even index - centile is dashed
                    return (
                      <VictoryLine
                        key={centile.centile + '-' + centileIndex}
                        padding={{top: 20, bottom: 60}}
                        data={centile.data}
                        style={dashedCentileStyle}
                      />
                    );
                  } else {
                    // uneven index - centile is continuous
                    return (
                      <VictoryLine
                        key={centile.centile + '-' + centileIndex}
                        padding={{top: 20, bottom: 60}}
                        data={centile.data}
                        style={continuousCentileStyle}
                      />
                    );
                  }
                })}
              </VictoryGroup>
            );
          }
        })}
        {measurementsArray.map((childMeasurement: any, index) => {
          const chronologicalAgeData =
            childMeasurement.plottable_data.centile_data
              .chronological_decimal_age_data;
          const correctedAgeData =
            childMeasurement.plottable_data.centile_data
              .corrected_decimal_age_data;
          let showDifferent = true;
          if (
            JSON.stringify(chronologicalAgeData) ===
              JSON.stringify(correctedAgeData) ||
            correctedAgeData.x < -0.05769231
          ) {
            showDifferent = false;
          }
          return (
            <VictoryGroup key={'measurement' + index}>
              {showCorrectedAge && (
                <VictoryScatter // corrected age - a custom component that renders a cross
                  data={[correctedAgeData]}
                  dataComponent={<XPoint />}
                  size={measurementStyle.measurementSize}
                  style={{
                    data: {
                      fill: measurementStyle.measurementFill,
                    },
                  }}
                />
              )}
              {showDifferent && showChronologicalAge && (
                <VictoryScatter // chronological age
                  data={[chronologicalAgeData]}
                  symbol={measurementStyle.measurementShape}
                  size={measurementStyle.measurementSize}
                  style={{
                    data: {
                      fill: measurementStyle.measurementFill,
                    },
                  }}
                />
              )}
              {showDifferent &&
                showChronologicalAge &&
                showCorrectedAge && ( // only show the line if both cross and dot are rendered
                  <VictoryLine
                    name="linkLine"
                    style={{
                      data: {
                        stroke: measurementStyle.measurementFill,
                        strokeWidth: 1.25,
                      },
                    }}
                    data={[correctedAgeData, chronologicalAgeData]}
                  />
                )}
            </VictoryGroup>
          );
        })}
      </VictoryChart>
    );
  }
}

export default MainChart;

// containerComponent={<VictoryZoomContainer />

// const exampleChildMeasurements = [
//   {
//     birth_data: {
//       birth_date: 'Tue, 24 Mar 2020 00:00:00 GMT',
//       estimated_date_delivery: 'Tue, 12 May 2020 00:00:00 GMT',
//       estimated_date_delivery_string: 'Tue 12 May, 2020',
//       gestation_days: 0,
//       gestation_weeks: 33,
//       sex: 'male',
//     },
//     child_observation_value: {
//       measurement_method: 'weight',
//       observation_value: 9,
//       observation_value_error: null,
//     },
//     measurement_calculated_values: {
//       chronological_centile: 26,
//       chronological_centile_band:
//         'This weight measurement is on or near the 25th centile.',
//       chronological_measurement_error: null,
//       chronological_sds: -0.6330942999002411,
//       corrected_centile: 39,
//       corrected_centile_band:
//         'This weight measurement is between the 25th and 50th centiles.',
//       corrected_measurement_error: null,
//       corrected_sds: -0.2620808918612426,
//     },
//     measurement_dates: {
//       chronological_calendar_age: '1 year',
//       chronological_decimal_age: 0.999315537303217,
//       chronological_decimal_age_error: null,
//       comments: {
//         clinician_chronological_decimal_age_comment:
//           'No correction has been made for gestational age.',
//         clinician_corrected_decimal_age_comment:
//           'Correction for gestational age has been made.',
//         lay_chronological_decimal_age_comment:
//           "This is your child's age without taking into account their gestation at birth.",
//         lay_corrected_decimal_age_comment:
//           'Because your child was born at 33+0 weeks gestation, an adjustment has been made to take this into account.',
//       },
//       corrected_calendar_age: '10 months, 1 week and 5 days',
//       corrected_decimal_age: 0.865160848733744,
//       corrected_decimal_age_error: null,
//       corrected_gestational_age: {
//         corrected_gestation_days: null,
//         corrected_gestation_weeks: null,
//       },
//       observation_date: 'Wed, 24 Mar 2021 00:00:00 GMT',
//     },
//     plottable_data: {
//       centile_data: {
//         chronological_decimal_age_data: {x: 0.999315537303217, y: 9},
//         corrected_decimal_age_data: {x: 0.865160848733744, y: 9},
//       },
//       sds_data: {
//         chronological_decimal_age_data: {
//           x: 0.999315537303217,
//           y: -0.6330942999002411,
//         },
//         corrected_decimal_age_data: {
//           x: 0.865160848733744,
//           y: -0.2620808918612426,
//         },
//       },
//     },
//   },
// ];

// const customAxisStyle = {
//   axisStroke: 'black',
//   axisLabelColour: 'black',
//   axisLabelFont: 'Montserrat-Regular',
//   axisLabelSize: 12,
//   tickLabelSize: 12,
// };

// const customCentileStyle = {
//   centileStroke: 'black',
//   centileStrokeWidth: 2,
//   delayedPubertyAreaFill: 'purple',
// };

// const customMeasurementStyle = {
//   measurementFill: 'black',
//   measurementSize: 4,
//   measurementShape: 'circle',
// };

// const customChartStyle = {
//   backgroundColour: 'white',
//   width: 0,
//   height: 0,
//   tooltipBackgroundColour: 'black',
//   tooltipTextColour: 'white',
// };

// const customGridlineStyle = {
//   gridlines: false,
//   stroke: 'grey',
//   strokeWidth: 1,
//   dashed: false,
};
