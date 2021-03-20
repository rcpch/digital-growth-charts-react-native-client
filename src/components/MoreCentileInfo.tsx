import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import AppText from './AppText';
import {colors} from '../config';
import AppIcon from './AppIcon';
import AppModal from './AppModal';
import {addOrdinalSuffix} from '../brains';

type propTypes = {
  specificResults: any;
  correctionApplied: boolean;
};

const parseExactCentile = (exact: number) => {
  if (typeof exact === 'number') {
    if (exact > 99.9) {
      return '>99.9th';
    } else if (exact < 0.1) {
      return '<0.1st';
    } else {
      return addOrdinalSuffix(exact);
    }
  } else {
    return 'N/A';
  }
};

const MoreCentileInfo = ({specificResults, correctionApplied}: propTypes) => {
  const [modalVisible, setModalVisible] = useState(false);
  const centileCorrected =
    typeof specificResults?.measurement_calculated_values.corrected_centile ===
    'number'
      ? specificResults.measurement_calculated_values.corrected_centile
      : '';
  const centileChronological =
    typeof specificResults?.measurement_calculated_values
      .chronological_centile === 'number'
      ? specificResults.measurement_calculated_values.chronological_centile
      : '';
  const sdsCorrected =
    typeof specificResults?.measurement_calculated_values.corrected_sds ===
    'number'
      ? specificResults.measurement_calculated_values.corrected_sds
      : '';
  const sdsChronological =
    typeof specificResults?.measurement_calculated_values.chronological_sds ===
    'number'
      ? specificResults.measurement_calculated_values.chronological_sds
      : '';

  const noCorrectionMessage = !correctionApplied
    ? 'Child born at term, no gestational correction applied.\n\n'
    : '';

  const centileCorrectedAnswer = `Centile: ${parseExactCentile(
    centileCorrected,
  )}`;

  const sdsCorrectedAnswer =
    typeof sdsCorrected === 'number'
      ? `Z score: ${sdsCorrected.toFixed(3)}`
      : 'Z score: N/A';

  const centileChronologicalAnswer = `Centile: ${parseExactCentile(
    centileChronological,
  )}`;

  const sdsChronologicalAnswer =
    typeof sdsChronological === 'number'
      ? `Z score: ${sdsChronological.toFixed(3)}`
      : 'Z score: N/A';

  const modalMessage = `${noCorrectionMessage}The default answer follows RCPCH guidelines based on major centile lines (50th, 75th etc.): \n\n If a centile measurement is within 1/4 of the distance between 2 major centile lines, the measurement is considered to lie on or near the nearest major centile line. Otherwise it is either considered to lie between, above or below.`;

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
        <View style={styles.infoContainer}>
          <View style={styles.modalTextHeadingWrapper}>
            {correctionApplied && (
              <AppText style={styles.modalTextHeadings}>Corrected:</AppText>
            )}
            <AppText style={styles.modalTextInfo}>
              {centileCorrectedAnswer}
            </AppText>
            <AppText style={styles.modalTextInfo}>{sdsCorrectedAnswer}</AppText>
          </View>
          {correctionApplied && (
            <React.Fragment>
              <View style={styles.modalTextHeadingWrapper}>
                <AppText style={styles.modalTextHeadings}>
                  Chronological:
                </AppText>
                <AppText style={styles.modalTextInfo}>
                  {centileChronologicalAnswer}
                </AppText>
                <AppText style={styles.modalTextInfo}>
                  {sdsChronologicalAnswer}
                </AppText>
              </View>
            </React.Fragment>
          )}
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
    margin: 7,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  modalTextHeadings: {
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
    marginBottom: 10,
    //backgroundColor: 'yellow',
  },
  modalTextInfo: {
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 16,
    fontWeight: '400',
    color: colors.white,
    marginBottom: 5,
    //backgroundColor: 'yellow',
  },
  modalTextHeadingWrapper: {
    borderRadius: 5,
    marginTop: 0,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark,
    padding: 10,
    margin: 8,
  },
  modalTextParagraph: {
    color: colors.black,
    marginTop: 10,
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
