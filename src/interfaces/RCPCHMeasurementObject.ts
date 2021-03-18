export interface PlottableMeasurement {
  calendar_age: string;
  centile_band: string;
  centile_value: number;
  corrected_gestation_days: number;
  corrected_gestation_weeks: number;
  age_type: 'corrected_age' | 'chronological_age';
  x: number;
  y: number;
}

export interface Measurement {
  birth_data: {
    birth_date: string;
    estimated_date_delivery: string;
    estimated_date_delivery_string: string;
    gestation_days: number;
    gestation_weeks: number;
    sex: string;
  };
  child_observation_value: {
    measurement_method: string;
    observation_value: number;
    observation_value_error: null;
  };
  measurement_calculated_values: {
    chronological_centile: number;
    chronological_centile_band: string;
    chronological_measurement_error: null;
    chronological_sds: number;
    corrected_centile: number;
    corrected_centile_band: string;
    corrected_measurement_error: null | number;
    corrected_sds: number;
    measurement_method: string;
  };
  measurement_dates: {
    chronological_calendar_age: string;
    chronological_decimal_age: number;
    chronological_decimal_age_error: null | number;
    comments: {
      clinician_chronological_decimal_age_comment: string;
      clinician_corrected_decimal_age_comment: string;
      lay_chronological_decimal_age_comment: string;
      lay_corrected_decimal_age_comment: string;
    };
    corrected_calendar_age: string;
    corrected_decimal_age: number;
    corrected_decimal_age_error: null | number;
    corrected_gestational_age: {
      corrected_gestation_days: null | number;
      corrected_gestation_weeks: null | number;
    };
    observation_date: string;
  };
}
