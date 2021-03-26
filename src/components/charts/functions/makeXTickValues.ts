import {Domains} from '../interfaces/Domains';

const makeXTickValues = (domains: Domains) => {
  const valuesArray = [];
  if (domains.x[1] <= 0.03832991) {
    const lowerGestWeeks = 40 + Math.round(domains.x[0] * 52);
    const upperGestWeeks = 40 + Math.round(domains.x[1] * 52);
    let i = lowerGestWeeks;
    while (i <= upperGestWeeks) {
      valuesArray.push((i - 40) / 52);
      i += 1;
    }
  } else if (domains.x[1] <= 1.3) {
    const lowerDays = Math.round(domains.x[0] * 365);
    const upperDays = Math.round(domains.x[1] * 365);
    let i = lowerDays;
    while (i <= upperDays) {
      valuesArray.push(i / 365);
      i += 1;
    }
  } else if (domains.x[1] <= 4) {
    const lowerMonths = Math.round(domains.x[0] * 12);
    const upperMonths = Math.round(domains.x[1] * 12);
    let i = lowerMonths;
    while (i <= upperMonths) {
      valuesArray.push(i / 12);
      i += 1;
    }
  } else {
    let i = Math.round(domains.x[0]);
    while (i <= domains.x[1]) {
      valuesArray.push(i);
      i += 1;
    }
  }
  return valuesArray;
};

export default makeXTickValues;
