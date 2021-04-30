import {Measurement} from '../interfaces/RCPCHMeasurementObject';

function makeMeasurementPointText(measurement: Measurement) {
  let chronologicalText = '';
  let correctedText = '';
  const chronAge =
    measurement.measurement_dates.chronological_decimal_age === 0
      ? '0 days'
      : measurement.measurement_dates.chronological_calendar_age;
  const chronCentileBand =
    measurement.measurement_calculated_values.chronological_centile_band ||
    measurement.measurement_calculated_values.chronological_measurement_error;
  if (measurement.birth_data.gestation_weeks < 40) {
    let correctedAgeTitle = 'Corrected Age:';
    let correctedAge = measurement.measurement_dates.corrected_calendar_age;
    if (!correctedAge) {
      correctedAgeTitle = 'Corrected Gestation:';
      correctedAge = `${measurement.measurement_dates.corrected_gestational_age.corrected_gestation_weeks}+${measurement.measurement_dates.corrected_gestational_age.corrected_gestation_days}`;
    }
    const correctedCentileBand =
      measurement.measurement_calculated_values.corrected_centile_band ||
      measurement.measurement_calculated_values.chronological_measurement_error;
    chronologicalText = `Chronological Age: ${chronAge}.\n\n${chronCentileBand}`;
    correctedText = `${correctedAgeTitle} ${correctedAge}.\n\n${correctedCentileBand}`;
  } else {
    chronologicalText = `${chronAge} old:\n\n${chronCentileBand}\n`;
  }
  return {chronologicalText, correctedText};
}
export default makeMeasurementPointText;

const a = {
  birth_data: {
    birth_date: 'Tue, 27 Apr 2021 00:00:00 GMT',
    estimated_date_delivery: 'Tue, 11 May 2021 00:00:00 GMT',
    estimated_date_delivery_string: 'Tue 11 May, 2021',
    gestation_days: 0,
    gestation_weeks: 38,
    sex: 'male',
  },
  child_observation_value: {
    measurement_method: 'weight',
    observation_value: 3.7,
    observation_value_error: null,
  },
  measurement_calculated_values: {
    chronological_centile: 62,
    chronological_centile_band:
      'This weight measurement is between the 50th and 75th centiles.',
    chronological_measurement_error: null,
    chronological_sds: 0.315774664340789,
    corrected_centile: 87,
    corrected_centile_band:
      'This weight measurement is between the 75th and 91st centiles.',
    corrected_measurement_error: null,
    corrected_sds: 1.136936962370445,
  },
  measurement_dates: {
    chronological_calendar_age: 'Happy Birthday',
    chronological_decimal_age: 0,
    chronological_decimal_age_error:
      'The due date is after the observation date - a calendar age cannot be calculated.',
    comments: {
      clinician_chronological_decimal_age_comment:
        'No correction has been made for gestational age.',
      clinician_corrected_decimal_age_comment:
        'Correction for gestational age has been made.',
      lay_chronological_decimal_age_comment:
        "This is your child's age without taking into account their gestation at birth.",
      lay_corrected_decimal_age_comment:
        'Because your child was born at 38+0 weeks gestation, an adjustment has been made to take this into account.',
    },
    corrected_calendar_age: null,
    corrected_decimal_age: -0.038329911019849415,
    corrected_decimal_age_error: null,
    corrected_gestational_age: {
      corrected_gestation_days: 0,
      corrected_gestation_weeks: 38,
    },
    observation_date: 'Tue, 27 Apr 2021 00:00:00 GMT',
  },
  plottable_data: {
    centile_data: {
      chronological_decimal_age_data: {
        age_error: null,
        age_type: 'chronological_age',
        calendar_age: 'Happy Birthday',
        centile_band:
          'This weight measurement is between the 50th and 75th centiles.',
        clinician_comment: 'No correction has been made for gestational age.',
        lay_comment:
          "This is your child's age without taking into account their gestation at birth.",
        observation_error: null,
        observation_value_error: null,
        x: 0,
        y: 3.7,
      },
      corrected_decimal_age_data: {
        age_error: null,
        age_type: 'corrected_age',
        calendar_age: null,
        centile_band:
          'This weight measurement is between the 75th and 91st centiles.',
        clinician_comment: 'Correction for gestational age has been made.',
        corrected_gestational_age: '38 + 0 weeks',
        lay_comment:
          'Because your child was born at 38+0 weeks gestation, an adjustment has been made to take this into account.',
        observation_error: null,
        observation_value_error: null,
        x: -0.038329911019849415,
        y: 3.7,
      },
    },
    sds_data: {
      chronological_decimal_age_data: {
        age_error: null,
        age_type: 'chronological_age',
        calendar_age: 'Happy Birthday',
        centile_band:
          'This weight measurement is between the 50th and 75th centiles.',
        clinician_comment: 'No correction has been made for gestational age.',
        lay_comment:
          "This is your child's age without taking into account their gestation at birth.",
        observation_value_error: null,
        x: 0,
        y: 0.315774664340789,
      },
      corrected_decimal_age_data: {
        age_error: null,
        age_type: 'corrected_age',
        calendar_age: null,
        centile_band:
          'This weight measurement is between the 75th and 91st centiles.',
        clinician_comment: 'Correction for gestational age has been made.',
        corrected_gestational_age: '38 + 0 weeks',
        lay_comment:
          'Because your child was born at 38+0 weeks gestation, an adjustment has been made to take this into account.',
        observation_value_error: null,
        x: -0.038329911019849415,
        y: 1.136936962370445,
      },
    },
  },
};
