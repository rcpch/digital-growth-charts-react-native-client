import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';

import AppText from './AppText';
import {colors, theme} from '../config/';
import AppIcon from './AppIcon';
import AppModal from './AppModal';
import LoadingOrText from './LoadingOrText';

type propTypes = {
  centileResults: {[key: string]: any};
  errors: {[key: string]: string | boolean};
  isLoading: boolean;
};

// trims calendar age string:
function trimStringAge(stringAge: string): string {
  const stringArray = stringAge.split(' ');
  if (stringArray.length > 5) {
    // take first 2 parts of string, remove end comma and join with space:
    const firstHalf = [stringArray[0], stringArray[1].slice(0, -1)].join(' ');
    // take second 2 parts, join with space:
    let secondHalf = [stringArray[2], stringArray[3]].join(' ');
    // if comma at end of second 2 parts:
    if (stringArray[3].charAt(stringArray[3].length - 1) === ',') {
      secondHalf = [stringArray[2], stringArray[3].slice(0, -1)].join(' ');
    }
    return [firstHalf, 'and', secondHalf].join(' ');
  } else {
    return stringAge;
  }
}

const AgeButton = ({centileResults, errors, isLoading}: propTypes) => {
  const [modalVisible, setModalVisible] = useState(false);

  let outputString = 'Age: N/A';
  const modalHeading = 'Further Information:';
  let modalMessage = 'N/A';
  let star = '';

  if (isLoading) {
    outputString = '';
  } else if (!isLoading && !errors.serverErrors) {
    for (const individualCentileResult of Object.values(centileResults)) {
      if (individualCentileResult) {
        try {
          const birthGestationWeeks =
            individualCentileResult.birth_data.gestation_weeks;
          const birthGestationDays =
            individualCentileResult.birth_data.gestation_days;
          const correctedGestationWeeks =
            individualCentileResult.measurement_dates.corrected_gestational_age
              .corrected_gestation_weeks;
          const correctedGestationDays =
            individualCentileResult.measurement_dates.corrected_gestational_age
              .corrected_gestation_days;
          const chronologicalDecimalAge =
            individualCentileResult.measurement_dates.chronological_decimal_age;
          const correctedDecimalAge =
            individualCentileResult.measurement_dates.corrected_decimal_age;
          const chronologicalCalendarAge =
            individualCentileResult.measurement_dates
              .chronological_calendar_age;
          const correctedCalendarAge =
            individualCentileResult.measurement_dates.corrected_calendar_age;
          const estimatedDateDelivery =
            individualCentileResult.birth_data.estimated_date_delivery_string;
          const correctionComment =
            individualCentileResult.measurement_dates.comments
              .clinician_corrected_decimal_age_comment;
          //Born <37 weeks, less than 2 weeks corrected age and not birthday:
          if (
            birthGestationWeeks < 40 &&
            correctedDecimalAge < 0.041 &&
            chronologicalDecimalAge !== 0
          ) {
            // patient group is neonates:
            outputString = `Corrected Gestation: ${correctedGestationWeeks}+${correctedGestationDays}`;
            modalMessage = `${chronologicalCalendarAge} old\n\nEstimated Date of Delivery: ${estimatedDateDelivery}`;
          } else if (chronologicalDecimalAge === 0) {
            // patient group is infants at birth:
            outputString = `Birth Gestation: ${birthGestationWeeks}+${birthGestationDays}`;
            modalMessage = `Happy Birthday!\n\nEstimated Date of Delivery: ${estimatedDateDelivery}`;
          } else {
            // patient group is everyone else:
            modalMessage = `${chronologicalCalendarAge} old.\n\nChild born at or after 40 weeks gestation, no gestational correction applied.`;
            let appropriateStringAge = chronologicalCalendarAge;
            if (birthGestationWeeks < 40) {
              star = '*';
              modalMessage =
                `${correctedCalendarAge} old (corrected)\n\n${chronologicalCalendarAge} old (chronological)` +
                `\n\n${correctionComment}`;
              appropriateStringAge = correctedCalendarAge;
            }
            outputString = `Age: ${trimStringAge(appropriateStringAge)}${star}`;
          }
        } catch (error) {
          // if the api object changes, this should hopefully catch error here
          console.error(error.message);
          outputString = 'Age: N/A';
          modalMessage = 'Error: failed to load';
        }
        break;
      }
    }
  }

  const mainButtonTextStyle = isLoading ? {width: 110} : null;

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}>
        <View style={styles.button}>
          <View style={styles.buttonContainer}>
            <LoadingOrText style={mainButtonTextStyle}>
              {outputString}
            </LoadingOrText>
            <AppIcon
              size={25}
              name="information-outline"
              style={styles.infoIcon}
            />
          </View>
        </View>
      </TouchableOpacity>
      <AppModal
        modalVisible={modalVisible}
        cancelInput={() => setModalVisible(!modalVisible)}>
        <View style={styles.modalTextHeadingWrapper}>
          <AppText style={styles.modalTextHeadings}>{modalHeading}</AppText>
        </View>
        <LoadingOrText style={styles.modalTextParagraph}>
          {modalMessage}
        </LoadingOrText>
      </AppModal>
    </React.Fragment>
  );
};

export default AgeButton;

const styles = StyleSheet.create({
  modalTextHeadings: {
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
  modalTextHeadingWrapper: {
    borderRadius: 5,
    marginTop: 0,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark,
    padding: 10,
    margin: 10,
  },
  modalTextParagraph: {
    marginBottom: 5,
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 17,
    marginLeft: 20,
    marginRight: 20,
    fontWeight: '400',
    paddingBottom: 30,
    // backgroundColor: "green",
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIcon: {
    marginLeft: 10,
  },
  button: {
    ...theme.button,
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
});
