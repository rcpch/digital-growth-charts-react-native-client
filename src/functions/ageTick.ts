import ageThresholds from './ageThresholds';

function createValues(
  lowerValue: number,
  upperValue: number,
  interval: string,
): number[] {
  let finalArray: number[] = [];

  let i = lowerValue;
  while (i <= upperValue) {
    if (interval === 'months') {
      if (i % 6 === 0) {
        finalArray.push(i / 12);
      }
      i++;
    }
    if (interval === 'weeks') {
      if (i % 2 === 0) {
        finalArray.push(i / 52);
      }
      i++;
    }
    if (interval === 'years') {
      finalArray.push(i);
      i++;
    }
    if (interval === 'pretermWeeks') {
      finalArray.push(i);
      i++;
    }
  }
  return finalArray;
}

function ageTickNumber(measurementsArray: any, interval: string): number[] {
  const ageLimits = ageThresholds(measurementsArray);
  if (interval === 'months') {
    const monthsUpper = ageLimits[1] * 12;
    const monthsLower = ageLimits[0] * 12;
    return createValues(monthsLower, monthsUpper, interval);
  }
  if (interval == 'weeks') {
    const weeksUpper = ageLimits[1] * 52;
    const weeksLower = ageLimits[0] * 52;
    return createValues(weeksLower, weeksUpper, interval);
  }
  if (interval == 'pretermWeeks') {
    const weeksLower = ageLimits[0];
    const weeksUpper = ageLimits[1];
    return createValues(weeksLower, weeksUpper, interval);
  }
  if (interval == 'years') {
    const yearsUpper = ageLimits[1];
    const yearsLower = ageLimits[0];
    return createValues(yearsLower, yearsUpper, interval);
  } else {
    // if returns this, something has gone wrong
    return [0, 0];
  }
}

export default ageTickNumber;
