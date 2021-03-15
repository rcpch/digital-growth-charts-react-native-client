import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';

import AppText from './AppText';
import {colors, theme} from '../config/';
import AppIcon from './AppIcon';
import AppModal from './AppModal';

type propTypes = {
  centileResults: {[key: string]: any};
  errors: {[key: string]: string | boolean};
  isLoading: boolean;
};

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
  let modalMessage = '';
  let star = '';

  if (isLoading) {
    outputString = 'Loading...';
    modalMessage = 'Loading...';
  } else if (!isLoading && !errors.serverErrors) {
    let workingValues: any = null;
    for (const individualCentileResult of Object.values(centileResults)) {
      if (individualCentileResult) {
        workingValues = individualCentileResult;
        break;
      }
    }
    if (workingValues) {
      try {
        const birthGestationWeeks = workingValues.birth_data.gestation_weeks;
        const birthGestationDays = workingValues.birth_data.gestation_days;
        const correctedGestationWeeks =
          workingValues.measurement_dates.corrected_gestational_age
            .corrected_gestation_weeks;
        const correctedGestationDays =
          workingValues.measurement_dates.corrected_gestational_age
            .corrected_gestation_days;
        const chronologicalDecimalAge =
          workingValues.measurement_dates.chronological_decimal_age;
        const correctedDecimalAge =
          workingValues.measurement_dates.corrected_decimal_age;
        const chronologicalCalendarAge =
          workingValues.measurement_dates.chronological_calendar_age;
        const correctedCalendarAge =
          workingValues.measurement_dates.corrected_calendar_age;
        const estimatedDateDelivery =
          workingValues.birth_data.estimated_date_delivery_string;
        const correctionComment =
          workingValues.measurement_dates.comments
            .clinician_corrected_decimal_age_comment;
        //Born <37 weeks, less than 2 weeks corrected age and not birthday:
        if (
          birthGestationWeeks < 37 &&
          correctedDecimalAge < 0.041 &&
          chronologicalDecimalAge !== 0
        ) {
          // patient group is preterm infants:
          outputString = `Corrected Gestation: ${correctedGestationWeeks}+${correctedGestationDays}`;
          modalMessage = `${chronologicalCalendarAge} old\n\nEstimated Date of Delivery: ${estimatedDateDelivery}`;
        } else if (chronologicalDecimalAge === 0) {
          // patient group is infants at birth:
          outputString = `Birth Gestation: ${birthGestationWeeks}+${birthGestationDays}`;
          modalMessage = `Happy Birthday!\n\nEstimated Date of Delivery: ${estimatedDateDelivery}`;
        } else {
          // patient group is infants and children from 2 weeks of (corrected) age:
          modalMessage = `${chronologicalCalendarAge} old.\n\nChild born at term, no gestational correction applied.`;
          let appropriateStringAge = chronologicalCalendarAge;
          if (
            correctedDecimalAge !== chronologicalDecimalAge &&
            birthGestationWeeks < 37
          ) {
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
        modalMessage = 'Error: failed to load';
      }
    }
  }

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}>
        <View style={styles.button}>
          <View style={styles.buttonContainer}>
            <AppText>{outputString}</AppText>
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
        <AppText style={styles.modalTextParagraph}>{modalMessage}</AppText>
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
    color: colors.black,
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

const exampleValues = {
  birth_data: {
    birth_date: 'Sun, 15 Mar 2020 00:00:00 GMT',
    estimated_date_delivery: 'Sun, 15 Mar 2020 00:00:00 GMT',
    estimated_date_delivery_string: 'Sun 15 March, 2020',
    gestation_days: 0,
    gestation_weeks: 40,
    sex: 'female',
  },
  child_observation_value: {
    measurement_method: 'weight',
    observation_value: 9,
    observation_value_error: null,
  },
  measurement_calculated_values: {
    chronological_centile: 51,
    chronological_centile_band:
      'This weight measurement is on or near the 50th centile.',
    chronological_measurement_error: null,
    chronological_sds: 0.0487953597071724,
    corrected_centile: 51,
    corrected_centile_band:
      'This weight measurement is on or near the 50th centile.',
    corrected_measurement_error: null,
    corrected_sds: 0.0487953597071724,
    measurement_method: 'weight',
  },
  measurement_dates: {
    chronological_calendar_age: '1 year',
    chronological_decimal_age: 0.999315537303217,
    chronological_decimal_age_error: null,
    comments: {
      clinician_chronological_decimal_age_comment:
        'Born Term. No correction has been made for gestation.',
      clinician_corrected_decimal_age_comment:
        'Born at term. No correction has been made for gestation.',
      lay_chronological_decimal_age_comment:
        'Your baby was born on their due date.',
      lay_corrected_decimal_age_comment:
        'Your baby was born on their due date.',
    },
    corrected_calendar_age: '1 year',
    corrected_decimal_age: 0.999315537303217,
    corrected_decimal_age_error: null,
    corrected_gestational_age: {
      corrected_gestation_days: null,
      corrected_gestation_weeks: null,
    },
    observation_date: 'Mon, 15 Mar 2021 00:00:00 GMT',
  },
};

const exampleValues2 = {
  birth_data: {
    birth_date: 'Sat, 19 Jan 2013 00:00:00 GMT',
    estimated_date_delivery: 'Sat, 19 Jan 2013 00:00:00 GMT',
    estimated_date_delivery_string: 'Sat 19 January, 2013',
    gestation_days: 0,
    gestation_weeks: 40,
    sex: 'female',
  },
  child_observation_value: {
    measurement_method: 'weight',
    observation_value: 50,
    observation_value_error: null,
  },
  measurement_calculated_values: {
    chronological_centile: 99.9,
    chronological_centile_band:
      'This weight measurement is above the normal range.',
    chronological_measurement_error: null,
    chronological_sds: 3.061145905132034,
    corrected_centile: 99.9,
    corrected_centile_band:
      'This weight measurement is above the normal range.',
    corrected_measurement_error: null,
    corrected_sds: 3.061145905132034,
    measurement_method: 'weight',
  },
  measurement_dates: {
    chronological_calendar_age: '8 years, 1 month, 3 weeks and 3 days',
    chronological_decimal_age: 8.150581793292266,
    chronological_decimal_age_error: null,
    comments: {
      clinician_chronological_decimal_age_comment:
        'Born Term. No correction has been made for gestation.',
      clinician_corrected_decimal_age_comment:
        'Born at term. No correction has been made for gestation.',
      lay_chronological_decimal_age_comment:
        'Your baby was born on their due date.',
      lay_corrected_decimal_age_comment:
        'Your baby was born on their due date.',
    },
    corrected_calendar_age: '8 years, 1 month, 3 weeks and 3 days',
    corrected_decimal_age: 8.150581793292266,
    corrected_decimal_age_error: null,
    corrected_gestational_age: {
      corrected_gestation_days: null,
      corrected_gestation_weeks: null,
    },
    observation_date: 'Mon, 15 Mar 2021 00:00:00 GMT',
  },
};
