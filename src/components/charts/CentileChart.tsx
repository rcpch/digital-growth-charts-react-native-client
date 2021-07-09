import React, {useState, useMemo} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
  VictoryLabel,
  VictoryArea,
  VictoryVoronoiContainer,
} from 'victory-native';

import {xAxisLabel, yAxisLabel, getDomainsAndData, tailoredXTickValues} from './functions';
import RenderTickLabel from './subComponents/RenderTickLabel';
import XPoint from './subComponents/XPoint';

import {ICentile} from './interfaces/CentilesObject';

import {MainChartProps} from './CentileChart.types';
import defaultToggles from './functions/defaultToggles';
import addOrdinalSuffix from './functions/addOrdinalSuffix';
import {delayedPubertyThreshold, makePubertyThresholds} from './functions/DelayedPuberty';
import CustomGridComponent from './subComponents/CustomGridComponent';
import CorrectVsChron from './subComponents/CorrectVsChron';
import InfoPopup from './subComponents/InfoPopup';
import HiddenPopup from './subComponents/HiddenPopup';

const shadedTermAreaText =
  'Babies born in the shaded area are term.\n\nIt is normal for babies to lose weight over the first two weeks of life. Medical review should be sought if weight has dropped by more than 10% of birth weight or weight is still below birth weight three weeks after birth.';

const blackList = [
  'victory0.4-0',
  'victory2-1',
  'victory9-2',
  'victory25-3',
  'victory50-4',
  'victory75-5',
  'victory91-6',
  'victory98-7',
  'victory99.6-8',
  'linkLine',
];

function CentileChart({
  title,
  subtitle,
  measurementMethod,
  reference,
  sex,
  measurementsArray,
  styles,
}: MainChartProps) {
  const {defaultShowCorrected, defaultShowChronological, showToggle} = defaultToggles(
    measurementsArray,
  );

  const [showChronologicalAge, setShowChronologicalAge] = useState(defaultShowChronological);

  const [showCorrectedAge, setShowCorrectedAge] = useState(defaultShowCorrected);

  const [pressedButtonArray, setPressedButtonArray]: [any[], Function] = useState([]);

  const {computedDomains, chartScaleType, centileData, pointsForCentileLabels} = useMemo(
    () =>
      getDomainsAndData(
        measurementsArray,
        sex,
        measurementMethod,
        reference,
        showCorrectedAge,
        showChronologicalAge,
        true,
      ),
    [measurementsArray, sex, measurementMethod, reference, showCorrectedAge, showChronologicalAge],
  );

  const lowerPubertyBorder = (d: any) => {
    if ((sex === 'male' && d.x >= 9 && d.x <= 14) || (sex === 'female' && d.x >= 9 && d.x <= 13)) {
      return d.y0;
    } else {
      return null;
    }
  };

  const pubertyThresholds = makePubertyThresholds(computedDomains, sex);

  let showTermArea = false;

  if (
    measurementsArray[0]?.birth_data.gestation_weeks >= 37 &&
    measurementMethod === 'weight' &&
    reference === 'uk-who' &&
    computedDomains?.x[0] < 0.038329911019849415 && // 2 weeks postnatal
    computedDomains?.x[1] >= -0.057494866529774126 // 37 weeks gest
  ) {
    showTermArea = true;
  }

  const termShadedAreaData = [
    {
      x: -0.057494866529774126,
      y: computedDomains.y[1],
      y0: computedDomains.y[0],
    },
    {
      x: 0.038329911019849415,
      y: computedDomains.y[1],
      y0: computedDomains.y[0],
    },
  ];

  const termShadedAreaLineData = [
    {
      x: 0.038329911019849415,
      y: computedDomains.y[1],
      label: shadedTermAreaText,
    },
    {
      x: 0.038329911019849415,
      y: computedDomains.y[0],
      label: shadedTermAreaText,
    },
  ];

  const centileLabelMaker = ({datum}: {datum: any}) => {
    const centile = datum.centile;
    let whiteSpace = '';
    if (centile === '99.6') {
      whiteSpace = '   ';
    } else if (centile === '0.4') {
      whiteSpace = ' ';
    }
    if (chartScaleType === 'prem') {
      return addOrdinalSuffix(centile) + whiteSpace;
    } else {
      return whiteSpace + addOrdinalSuffix(centile);
    }
  };

  return (
    <View style={styles.chartContainerStyle}>
      <View style={additionalStyles.topContainer}>
        <Image
          source={require('../../assets/imgs/RCPCH_badge.png')}
          resizeMode="contain"
          style={additionalStyles.rcpchImage}
        />
        <View style={styles.titleContainerStyle}>
          <Text style={styles.titleTextStyle}>{title}</Text>
          <Text style={styles.subtitleTextStyle}>{subtitle}</Text>
        </View>
      </View>

      <VictoryChart
        width={styles.chartWidth}
        height={showToggle ? styles.chartHeight - 50 : styles.chartHeight}
        padding={styles.chartPadding}
        style={styles.chartMisc}
        domain={computedDomains}
        containerComponent={
          <VictoryVoronoiContainer
            onActivated={(points) => {
              setPressedButtonArray(points);
            }}
            radius={50}
            voronoiBlacklist={blackList}
          />
        }>
        {
          /* Term child shaded area: */
          showTermArea && <VictoryArea style={styles.termArea} data={termShadedAreaData} />
        }
        {
          /* Touchable component for term area explanation */
          showTermArea && (
            <VictoryLine
              name="term-line"
              style={styles.termAreaLabel}
              data={termShadedAreaLineData}
              labels={({datum}) => datum.label}
              labelComponent={<InfoPopup reverse style={styles.label} />}
            />
          )
        }
        {/* Y axis: */}
        <VictoryAxis label={yAxisLabel(measurementMethod)} style={styles.yAxis} dependentAxis />
        {/* X axis: */}
        <VictoryAxis
          label={xAxisLabel(chartScaleType, computedDomains)}
          style={styles.xAxis}
          tickValues={tailoredXTickValues[chartScaleType]}
          gridComponent={
            <CustomGridComponent chartScaleType={chartScaleType} domains={computedDomains} />
          }
          tickLabelComponent={
            <RenderTickLabel
              style={styles.label}
              chartScaleType={chartScaleType}
              domains={computedDomains}
            />
          }
        />
        {
          // puberty threshold lines uk90:
          reference === 'uk-who' &&
            measurementMethod === 'height' &&
            pubertyThresholds.map((dataArray) => {
              if (dataArray[0].x > computedDomains.x[0] && dataArray[1].x <= computedDomains.x[1]) {
                const reverse = dataArray[0].x === computedDomains.x[1] ? true : false;
                return (
                  <VictoryLine
                    key={dataArray[0].x}
                    name="puberty-line"
                    style={styles.delayedPubertyThresholdLine}
                    data={dataArray}
                    labels={({datum}) => datum.label}
                    labelComponent={<InfoPopup reverse={reverse} style={styles.label} />}
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
          labels={centileLabelMaker}
          labelComponent={
            <VictoryLabel
              dy={2}
              dx={chartScaleType === 'prem' ? -14 : 14}
              style={styles.centileLabelStyle}
            />
          }
          style={{
            data: {fill: 'transparent'},
          }}
        />
        {
          // delayed puberty area:
          reference === 'uk-who' && measurementMethod === 'height' && (
            <VictoryArea
              data={delayedPubertyThreshold(sex)}
              y0={lowerPubertyBorder}
              style={styles.delayedPubertyArea}
              name="delayed-puberty"
            />
          )
        }
        {
          // centile lines:
          centileData &&
            centileData.map((referenceSet: any, indexSet: number) => {
              if (referenceSet.length > 0) {
                return (
                  <VictoryGroup key={`centile-${indexSet}`}>
                    {referenceSet.map((centile: ICentile, centileIndex: number) => {
                      if (centileIndex % 2 === 0) {
                        // even index - centile is dashed
                        return (
                          <VictoryLine
                            name={'victory' + centile.centile + '-' + centileIndex}
                            key={centile.centile + '-' + centileIndex}
                            padding={{top: 5, bottom: 5}}
                            data={centile.data}
                            style={styles.dashedCentile}
                          />
                        );
                      } else {
                        // uneven index - centile is continuous
                        return (
                          <VictoryLine
                            key={centile.centile + '-' + centileIndex}
                            padding={{top: 5, bottom: 5}}
                            data={centile.data}
                            style={styles.continuousCentile}
                            name={'victory' + centile.centile + '-' + centileIndex}
                          />
                        );
                      }
                    })}
                  </VictoryGroup>
                );
              }
            })
        }
        {
          // child  measurements:
        }
        {measurementsArray.map((childMeasurement: any, index) => {
          const chronologicalAgeData =
            childMeasurement.plottable_data.centile_data.chronological_decimal_age_data;
          const correctedAgeData =
            childMeasurement.plottable_data.centile_data.corrected_decimal_age_data;
          return (
            <VictoryGroup key={'measurement' + index}>
              {showCorrectedAge && (
                <VictoryScatter // corrected age - a custom component that renders a cross
                  data={[correctedAgeData]}
                  dataComponent={<XPoint />}
                  size={5}
                  style={styles.measurementPoint}
                  name={`corrected_${index}`}
                />
              )}
              {showChronologicalAge && (
                <VictoryScatter // chronological age
                  data={[chronologicalAgeData]}
                  symbol="circle"
                  size={5}
                  style={styles.measurementPoint}
                  name={`chronological_${index}`}
                />
              )}
              {showChronologicalAge &&
                showCorrectedAge && ( // only show the line if both cross and dot are rendered
                  <VictoryLine
                    name="linkLine"
                    style={styles.measurementLinkLine}
                    data={[correctedAgeData, chronologicalAgeData]}
                  />
                )}
            </VictoryGroup>
          );
        })}
      </VictoryChart>
      <HiddenPopup
        pressedButtonArray={pressedButtonArray}
        setPressedButtonArray={setPressedButtonArray}
        measurementMethod={measurementMethod}
        customStyle={styles.modalStyle}
      />
      {showToggle && (
        <CorrectVsChron
          showChronologicalAge={showChronologicalAge}
          setShowChronologicalAge={setShowChronologicalAge}
          showCorrectedAge={showCorrectedAge}
          setShowCorrectedAge={setShowCorrectedAge}
          customStyle={styles.modalStyle}
        />
      )}
    </View>
  );
}

const additionalStyles = StyleSheet.create({
  rcpchImage: {
    height: 50,
    width: 50,
    marginRight: 10,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CentileChart;
