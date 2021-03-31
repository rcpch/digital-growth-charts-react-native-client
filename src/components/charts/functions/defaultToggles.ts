import {PlottableMeasurement} from '../../../interfaces/RCPCHMeasurementObject';

type returnObject = {
  defaultShowCorrected: boolean;
  defaultShowChronological: boolean;
};

function defaultToggles(
  childMeasurements: PlottableMeasurement[],
): returnObject {
  if (!childMeasurements) {
    return {defaultShowCorrected: false, defaultShowChronological: false};
  }
  if (!childMeasurements[0].plottable_data) {
    throw new Error(
      'No plottable data found. Are you using the correct server version?',
    );
  }
  // check for children under 2 weeks corrected age:
  for (let measurement of childMeasurements) {
    const correctedX =
      measurement.plottable_data.centile_data.corrected_decimal_age_data.x;
    if (correctedX < 0.038329911019849415) {
      return {defaultShowCorrected: true, defaultShowChronological: false};
    }
  }
  // if bang on 40 weeks, only show chronological:
  const gestWeeks = childMeasurements[0].birth_data.gestation_weeks;
  const gestDays = childMeasurements[0].birth_data.gestation_days;
  if (gestWeeks === 40 && gestDays === 0) {
    return {defaultShowCorrected: false, defaultShowChronological: true};
  }
  // get minimum corrected age from  data:
  let minAge = 500;
  for (let measurement of childMeasurements) {
    const correctedX =
      measurement.plottable_data.centile_data.corrected_decimal_age_data.x;
    if (minAge > correctedX) {
      minAge = correctedX;
    }
  }
  // if older child, showing 2 points looks messy:
  if (minAge >= 4) {
    return {defaultShowCorrected: true, defaultShowChronological: false};
  }
  // all other cases show both:
  return {defaultShowCorrected: true, defaultShowChronological: true};
}

export default defaultToggles;
