import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import AppText from './AppText';
import {colors} from '../config';
import AppIcon from './AppIcon';
import AppModal from './AppModal';

type propTyes = {
  exactCentile: string;
  sds?: number;
};

const MoreCentileInfo = ({exactCentile, sds}: propTyes) => {
  const [modalVisible, setModalVisible] = useState(false);
  const modalHeading1 = `Centile: ${exactCentile}`;
  const modalHeading2 = sds ? `Z score: ${sds.toFixed(3)}` : 'Z score: N/A';
  const modalMessage =
    'The default answer follows RCPCH guidelines based on major centile lines (50th, 75th etc.): \n\n If a centile measurement is within 1/4 of the distance between 2 major centile lines, the measurement is considered to lie on or near the nearest major centile line. Otherwise it is either considered to lie between, above or below.';
  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}>
        <AppIcon
          name="information-outline"
          size={30}
          style={styles.openModalIcon}
        />
      </TouchableOpacity>
      <AppModal
        cancelInput={() => {
          setModalVisible(!modalVisible);
        }}
        modalVisible={modalVisible}>
        <View style={styles.modalTextHeadingWrapper}>
          <AppText style={styles.modalTextHeadings}>{modalHeading1}</AppText>
        </View>
        <View style={styles.modalTextHeadingWrapper}>
          <AppText style={styles.modalTextHeadings}>{modalHeading2}</AppText>
        </View>
        <AppText style={styles.modalTextParagraph}>{modalMessage}</AppText>
      </AppModal>
    </React.Fragment>
  );
};

export default MoreCentileInfo;

const styles = StyleSheet.create({
  openModalIcon: {
    borderRadius: 5,
    backgroundColor: colors.medium,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalTextHeadings: {
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 15,
    fontWeight: '500',
    color: colors.white,
    //backgroundColor: 'yellow',
  },
  modalTextHeadingWrapper: {
    borderRadius: 5,
    marginTop: 0,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark,
    padding: 5,
    paddingLeft: 5,
    paddingRight: 5,
    margin: 8,
  },
  modalTextParagraph: {
    color: colors.black,
    marginBottom: 5,
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 15,
    marginLeft: 15,
    marginRight: 15,
    fontWeight: '400',
    paddingBottom: 10,
    // backgroundColor: "green",
  },
});
