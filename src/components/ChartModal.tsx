import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import AppIcon from '../components/AppIcon';
import AppModal from '../components/AppModal';
import {colors, containerWidth, windowHeight, windowWidth} from '../config';

import {PlottableMeasurement} from '../interfaces/RCPCHMeasurementObject';
import AppText from './AppText';
import MainChart from './charts/MainChart';

type propTypes = {
  measurementType?: string;
  specificResults?: null | PlottableMeasurement;
  reference: string;
  userLabelNames: {[index: string]: string};
};

function ChartModal({
  measurementType,
  specificResults,
  reference,
  userLabelNames,
}: propTypes) {
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const extraDimensionsChartContainer = {
    marginTop: insets.top,
    marginBottom: insets.bottom,
    height: windowHeight - insets.top - insets.bottom,
  };
  const sex = specificResults?.birth_data.sex;
  const customChartStyle = {
    backgroundColour: 'white',
    width: containerWidth - 6,
    height: extraDimensionsChartContainer.height * 0.91,
    tooltipBackgroundColour: 'black',
    tooltipTextColour: 'white',
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}>
        <AppIcon
          name="chart-bell-curve-cumulative"
          size={30}
          style={styles.openModalIcon}
        />
        <AppModal
          modalVisible={modalVisible}
          cancelInput={() => setModalVisible(!modalVisible)}
          style={[styles.chartContainer, extraDimensionsChartContainer]}
          intendedModalWidth={containerWidth}>
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
        </AppModal>
      </TouchableOpacity>
    </>
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
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    width: windowWidth - 6,
    backgroundColor: colors.medium,
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
    color: colors.white,
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

export default ChartModal;
