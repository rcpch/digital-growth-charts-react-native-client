const inputWeight = {
  birth_date: '2016-02-15',
  gestation_days: 0,
  gestation_weeks: 40,
  measurement_method: 'weight',
  observation_date: '2021-02-15',
  observation_value: 18,
  sex: 'female',
};

const centileResultWeight = {
  birth_data: {
    birth_date: 'Mon, 15 Feb 2016 00:00:00 GMT',
    estimated_date_delivery: null,
    estimated_date_delivery_string: null,
    gestation_days: 0,
    gestation_weeks: 40,
    sex: 'female',
  },
  child_observation_value: {
    measurement_method: 'weight',
    observation_value: 18.0,
  },
  measurement_calculated_values: {
    centile: 44,
    centile_band: 'This weight measurement is on or near the 50th centile.',
    measurement_method: 'weight',
    sds: -0.12593533017213066,
  },
  measurement_dates: {
    chronological_calendar_age: '5 years',
    chronological_decimal_age: 5.002053388090349,
    clinician_decimal_age_comment: 'Born Term. No correction necessary.',
    corrected_calendar_age: '5 years',
    corrected_decimal_age: 5.002053388090349,
    corrected_gestational_age: {
      corrected_gestation_days: null,
      corrected_gestation_weeks: null,
    },
    lay_decimal_age_comment:
      'At 40+0, your child is considered to have been born at term. No age adjustment is necessary.',
    observation_date: 'Mon, 15 Feb 2021 00:00:00 GMT',
  },
};

const inputHeight = {
  birth_date: '2016-02-15',
  gestation_days: 0,
  gestation_weeks: 40,
  measurement_method: 'height',
  observation_date: '2021-02-15',
  observation_value: 110,
  sex: 'female',
};

const centileResultHeight = {
  birth_data: {
    birth_date: 'Mon, 15 Feb 2016 00:00:00 GMT',
    estimated_date_delivery: null,
    estimated_date_delivery_string: null,
    gestation_days: 0,
    gestation_weeks: 40,
    sex: 'female',
  },
  child_observation_value: {
    measurement_method: 'height',
    observation_value: 110.0,
  },
  measurement_calculated_values: {
    centile: 59,
    centile_band:
      'This height measurement is between the 50th and 75th centiles.',
    measurement_method: 'height',
    sds: 0.2514716140259053,
  },
  measurement_dates: {
    chronological_calendar_age: '5 years',
    chronological_decimal_age: 5.002053388090349,
    clinician_decimal_age_comment: 'Born Term. No correction necessary.',
    corrected_calendar_age: '5 years',
    corrected_decimal_age: 5.002053388090349,
    corrected_gestational_age: {
      corrected_gestation_days: null,
      corrected_gestation_weeks: null,
    },
    lay_decimal_age_comment:
      'At 40+0, your child is considered to have been born at term. No age adjustment is necessary.',
    observation_date: 'Mon, 15 Feb 2021 00:00:00 GMT',
  },
};

const inputBmi = {
  birth_date: '2016-02-15',
  gestation_days: 0,
  gestation_weeks: 40,
  measurement_method: 'bmi',
  observation_date: '2021-02-15',
  observation_value: 14.876033,
  sex: 'female',
};

const centileResultBmi = {
  birth_data: {
    birth_date: 'Mon, 15 Feb 2016 00:00:00 GMT',
    estimated_date_delivery: null,
    estimated_date_delivery_string: null,
    gestation_days: 0,
    gestation_weeks: 40,
    sex: 'female',
  },
  child_observation_value: {
    measurement_method: 'bmi',
    observation_value: 14.876033,
  },
  measurement_calculated_values: {
    centile: 33,
    centile_band:
      'This body mass index measurement is between the 25th and 50th centiles.',
    measurement_method: 'bmi',
    sds: -0.4392302518568196,
  },
  measurement_dates: {
    chronological_calendar_age: '5 years',
    chronological_decimal_age: 5.002053388090349,
    clinician_decimal_age_comment: 'Born Term. No correction necessary.',
    corrected_calendar_age: '5 years',
    corrected_decimal_age: 5.002053388090349,
    corrected_gestational_age: {
      corrected_gestation_days: null,
      corrected_gestation_weeks: null,
    },
    lay_decimal_age_comment:
      'At 40+0, your child is considered to have been born at term. No age adjustment is necessary.',
    observation_date: 'Mon, 15 Feb 2021 00:00:00 GMT',
  },
};

const inputOfc = {
  birth_date: '2019-02-15',
  gestation_days: 0,
  gestation_weeks: 40,
  measurement_method: 'ofc',
  observation_date: '2021-02-16',
  observation_value: 47.5,
  sex: 'female',
};

const centileResultOfc = {
  birth_data: {
    birth_date: 'Fri, 15 Feb 2019 00:00:00 GMT',
    estimated_date_delivery: null,
    estimated_date_delivery_string: null,
    gestation_days: 0,
    gestation_weeks: 40,
    sex: 'female',
  },
  child_observation_value: {
    measurement_method: 'ofc',
    observation_value: 47.5,
  },
  measurement_calculated_values: {
    centile: 58,
    centile_band:
      'This head circumference measurement is between the 50th and 75th centiles.',
    measurement_method: 'ofc',
    sds: 0.22288571444889413,
  },
  measurement_dates: {
    chronological_calendar_age: '2 years and 1 day',
    chronological_decimal_age: 2.004106776180698,
    clinician_decimal_age_comment: 'Born Term. No correction necessary.',
    corrected_calendar_age: '2 years and 1 day',
    corrected_decimal_age: 2.004106776180698,
    corrected_gestational_age: {
      corrected_gestation_days: null,
      corrected_gestation_weeks: null,
    },
    lay_decimal_age_comment:
      'At 40+0, your child is considered to have been born at term. No age adjustment is necessary.',
    observation_date: 'Tue, 16 Feb 2021 00:00:00 GMT',
  },
};

const inputPlottableChild = {
  results: [centileResultWeight],
};

const plottableChildResult = {
  child_data: {
    centile_data: [
      [
        {
          age_type: 'corrected_age',
          calendar_age: '5 years',
          centile_band:
            'This weight measurement is on or near the 50th centile.',
          centile_value: 44,
          corrected_gestation_days: null,
          corrected_gestation_weeks: null,
          measurement_method: 'weight',
          x: 5.002053388090349,
          y: 18,
        },
        {
          age_type: 'chronological_age',
          calendar_age: '5 years',
          centile_band:
            'This weight measurement is on or near the 50th centile.',
          centile_value: 44,
          corrected_gestation_days: null,
          corrected_gestation_weeks: null,
          measurement_method: 'weight',
          x: 5.002053388090349,
          y: 18,
        },
      ],
    ],
    measurement_method: 'weight',
    sds_data: [
      [
        {
          age_type: 'corrected_age',
          calendar_age: '5 years',
          corrected_gestation_days: null,
          corrected_gestation_weeks: null,
          measurement_method: 'weight',
          x: 5.002053388090349,
          y: -0.12593533017213066,
        },
        {
          age_type: 'chronological_age',
          calendar_age: '5 years',
          corrected_gestation_days: null,
          corrected_gestation_weeks: null,
          measurement_method: 'weight',
          x: 5.002053388090349,
          y: -0.12593533017213066,
        },
      ],
    ],
  },
  sex: 'female',
};

const inputChartData = {
  unique_child: true,
  results: [
    centileResultHeight,
    centileResultWeight,
    centileResultBmi,
    centileResultOfc,
  ],
};

export {
  inputWeight,
  centileResultWeight,
  inputHeight,
  centileResultHeight,
  inputBmi,
  centileResultBmi,
  inputOfc,
  centileResultOfc,
  inputPlottableChild,
  plottableChildResult,
  inputChartData,
};
