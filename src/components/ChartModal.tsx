import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import AppText from '../components/AppText';
import AppIcon from '../components/AppIcon';
import AppModal from '../components/AppModal';
import {colors, containerWidth, windowHeight} from '../config';

type propTypes = {
  measurementType?: string;
  specificResults?: null | Measurement;
};

function ChartModal({measurementType, specificResults}: propTypes) {
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const extraDimensionsChartContainer = {
    marginTop: insets.top || 5,
    marginBottom: insets.bottom || 5,
    height: windowHeight - insets.top - insets.bottom - 10,
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
          <View style={styles.chart}>
            <AppText style={styles.text}>Chart Goes Here</AppText>
          </View>
        </AppModal>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  chart: {
    width: containerWidth - 20,
    height: '96%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    width: containerWidth,
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
  text: {
    color: colors.black,
    fontSize: 20,
    fontWeight: '500',
  },
});

export default ChartModal;
