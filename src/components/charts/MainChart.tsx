import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
  VictoryLabel,
  VictoryArea,
} from 'victory-native';

import {
  xAxisLabel,
  yAxisLabel,
  getDomainsAndData,
  makeStylesObjects,
  tailoredXTickValues,
} from './functions';
import RenderTickLabel from './subComponents/RenderTickLabel';
import XPoint from './subComponents/XPoint';

import {ICentile} from './interfaces/CentilesObject';

import {MainChartProps, Results} from './MainChart.types';
import defaultToggles from './functions/defaultToggles';
import addOrdinalSuffix from './functions/addOrdinalSuffix';
import {
  delayedPubertyThreshold,
  pubertyThresholds,
} from './functions/DelayedPuberty';
import CustomGridComponent from './subComponents/CustomGridComponent';

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

  const blankInternalState: Results = {
    centileData: null,
    domains: null,
    chartScaleType: 'prem',
    pointsForCentileLabels: [],
  };

  const {defaultShowCorrected, defaultShowChronological} = defaultToggles(
    measurementsArray,
  );

  const [showChronologicalAge, setShowChronologicalAge] = useState(
    defaultShowChronological,
  );
  const [showCorrectedAge, setShowCorrectedAge] = useState(
    defaultShowCorrected,
  );
  const [internalData, setInternalData] = useState(blankInternalState);

  const centileData = internalData.centileData;
  const domains = internalData.domains;
  const chartScaleType = internalData.chartScaleType;
  const pointsForCentileLabels = internalData.pointsForCentileLabels;

  const lowerPubertyBorder = (d: any) => {
    if (
      (sex === 'male' && d.x >= 9 && d.x <= 14) ||
      (sex === 'female' && d.x >= 9 && d.x <= 13)
    ) {
      return d.y0;
    } else {
      return null;
    }
  };

  useEffect(() => {
    getDomainsAndData(
      measurementsArray,
      sex,
      measurementMethod,
      reference,
      showCorrectedAge,
      showChronologicalAge,
    )
      .then((results: Results) => {
        setInternalData({
          centileData: results.centileData,
          domains: results.domains,
          chartScaleType: results.chartScaleType,
          pointsForCentileLabels: results.pointsForCentileLabels,
        });
      })
      .catch((error) => console.error(error.message));
  }, [
    sex,
    measurementMethod,
    reference,
    measurementsArray,
    showCorrectedAge,
    showChronologicalAge,
  ]);

  if (!domains) {
    return (
      <View
        style={{
          height: chartStyle.height,
          width: chartStyle.width,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Montserrat-Regular',
            fontWeight: '500',
            fontSize: 20,
            color: 'black',
          }}>
          Loading...
        </Text>
      </View>
    );
  } else {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            paddingBottom: 0,
          }}>
          <Text
            style={{
              fontFamily: 'Montserrat-Regular',
              fontWeight: '500',
              fontSize: 18,
              color: 'black',
            }}>
            {title}
          </Text>
        </View>
        <VictoryChart
          width={chartStyle.width}
          height={chartStyle.height - 50}
          paddingTop={0}
          domain={domains}>
          {chartScaleType !== 'prem' && (
            <VictoryArea
              style={{data: {fill: gridlineStyle.stroke}}}
              data={[
                {x: -0.057494866529774126, y: domains.y[1], y0: domains.y[0]},
                {x: 0, y: domains.y[1], y0: domains.y[0]},
                {x: 0.038329911019849415, y: domains.y[1], y0: domains.y[0]},
              ]}
            />
          )}

          <VictoryAxis
            label={yAxisLabel(measurementMethod)}
            style={parsedAxisStyle}
            dependentAxis
          />

          <VictoryAxis
            label={xAxisLabel(chartScaleType, domains)}
            style={parsedAxisStyle}
            tickValues={tailoredXTickValues[chartScaleType]}
            tickLabelComponent={
              <RenderTickLabel
                style={tickLabelStyle}
                chartScaleType={chartScaleType}
                domains={domains}
              />
            }
            gridComponent={
              <CustomGridComponent chartScaleType={chartScaleType} />
            }
          />
          {
            // centile lines:
            centileData &&
              centileData.map((reference, index) => {
                if (reference.length > 0) {
                  return (
                    <VictoryGroup key={index}>
                      {reference.map(
                        (centile: ICentile, centileIndex: number) => {
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
                        },
                      )}
                    </VictoryGroup>
                  );
                }
              })
          }

          {
            // delayed puberty area:
            reference === 'uk-who' && measurementMethod === 'height' && (
              <VictoryArea
                data={delayedPubertyThreshold(sex)}
                y0={lowerPubertyBorder}
                style={{
                  data: {
                    stroke: centileStyle.delayedPubertyAreaFill,
                    fill: centileStyle.delayedPubertyAreaFill,
                    strokeWidth: centileStyle.centileStrokeWidth,
                  },
                }}
                name="delayed"
              />
            )
          }

          {
            // puberty threshold lines uk90:
            reference === 'uk-who' &&
              measurementMethod === 'height' &&
              pubertyThresholds[sex].map((data, index) => {
                if (data.x > domains.x[0] && data.x < domains.x[1]) {
                  return (
                    <VictoryAxis
                      dependentAxis
                      key={index}
                      label={data.label}
                      axisLabelComponent={
                        <VictoryLabel
                          dy={40}
                          dx={-120}
                          style={{
                            fontSize: 11,
                            color: 'black',
                            fontFamily: 'Montserrat-Regular',
                            textAlign: 'start',
                          }}
                        />
                      }
                      style={{
                        axis: {
                          stroke: axisStyle.axisStroke,
                          strokeWidth: 1.0,
                        },
                        tickLabels: {
                          fill: 'none',
                        },
                        axisLabel: {},
                      }}
                      axisValue={data.x}
                    />
                  );
                } else {
                  return null;
                }
              })
          }
          {
            //labels for centile lines:
          }
          <VictoryScatter
            data={pointsForCentileLabels}
            labels={({datum}) => addOrdinalSuffix(datum.centile)}
            labelComponent={
              <VictoryLabel
                dy={2}
                dx={chartScaleType === 'prem' ? -15 : 14}
                style={{
                  fontSize: 10,
                  fontFamily: 'Montserrat-Regular',
                  fontWeight: '500',
                }}
              />
            }
            style={{
              data: {fill: 'transparent'},
            }}
          />
          {
            // child  measurements:
          }
          {measurementsArray.map((childMeasurement: any, index) => {
            const chronologicalAgeData =
              childMeasurement.plottable_data.centile_data
                .chronological_decimal_age_data;
            const correctedAgeData =
              childMeasurement.plottable_data.centile_data
                .corrected_decimal_age_data;
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
                {showChronologicalAge && (
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
                {showChronologicalAge &&
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
      </View>
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
// };
