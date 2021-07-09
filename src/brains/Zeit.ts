// Replacing moment.js

type PossibleUnits =
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'weeks'
  | 'months'
  | 'years'
  | 'string'
  | 'digitalClock';

type IntAges = {
  seconds: number;
  remainderSeconds: number;
  minutes: number;
  remainderMinutes: number;
  hours: number;
  remainderHours: number;
  days: number;
  remainderDays: number;
  weeks: number;
  remainderWeeks: number;
  months: number;
  remainderMonths: number;
  years: number;
};

const addDays = (date: Date, moreDays: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + moreDays);
  return result;
};

const rawValue = (millisecondDifference: number, units: PossibleUnits) => {
  const millisecondsInSecond = 1000;
  const secondsInMinute = 60;
  const minutesInHour = 60;
  const hoursInDay = 24;
  const daysInWeek = 7;
  const daysInMonth = 365.25 / 12;
  const daysInYear = 365.25;
  switch (units) {
    case 'seconds':
      return millisecondDifference / millisecondsInSecond;
    case 'minutes':
      return millisecondDifference / (millisecondsInSecond * secondsInMinute);
    case 'hours':
      return millisecondDifference / (millisecondsInSecond * secondsInMinute * minutesInHour);
    case 'days':
      return (
        millisecondDifference /
        (millisecondsInSecond * secondsInMinute * minutesInHour * hoursInDay)
      );
    case 'weeks':
      return (
        millisecondDifference /
        (millisecondsInSecond * secondsInMinute * minutesInHour * hoursInDay * daysInWeek)
      );
    case 'months':
      return (
        millisecondDifference /
        (millisecondsInSecond * secondsInMinute * minutesInHour * hoursInDay * daysInMonth)
      );
    case 'years':
      return (
        millisecondDifference /
        (millisecondsInSecond * secondsInMinute * minutesInHour * hoursInDay * daysInYear)
      );
    default:
      throw new Error('No valid time units given to Zeit');
  }
};

const removeTimeFromDate = (inputDate: Date) => {
  const date = new Date(inputDate);
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  return new Date(year, month, day);
};

const isDaysInMonthValid = (parsedArray: number[]) => {
  const [jsYear, jsMonth, jsDay] = parsedArray;
  if (jsMonth === 1 && jsDay === 29) {
    if (jsYear % 4 === 0) {
      return true;
    } else {
      return false;
    }
  } else {
    const daysInMonthLookup = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const validMaxDaysInMonth = daysInMonthLookup[jsMonth];
    if (validMaxDaysInMonth !== undefined && jsDay <= validMaxDaysInMonth) {
      return true;
    } else {
      return false;
    }
  }
};

const parseDate = (inputDate: Date | 'string', removeTime = false) => {
  const errorString =
    "No valid date given to parseDate in zeit function. Must either be a string in format 'YYYY-MM-DD' or js date object";
  if (typeof inputDate === 'string') {
    try {
      const dateArray = inputDate.split('-');
      const workingArray = dateArray.map((element, index) => {
        if (element !== '') {
          const madeNumber = Number(element);
          if (Number.isNaN(madeNumber)) {
            throw new Error(errorString);
          } else {
            return index === 1 ? madeNumber - 1 : madeNumber;
          }
        } else {
          throw new Error(errorString);
        }
      });
      if (
        workingArray.length !== 3 ||
        workingArray[1] < 0 ||
        workingArray[1] > 11 ||
        workingArray[2] < 1 ||
        workingArray[2] > 31
      ) {
        throw new Error(errorString);
      }
      if (isDaysInMonthValid(workingArray)) {
        return new Date(workingArray[0], workingArray[1], workingArray[2]);
      } else {
        throw new Error(errorString);
      }
    } catch (error) {
      throw new Error(errorString);
    }
  } else {
    if (inputDate instanceof Date) {
      return new Date(removeTime ? removeTimeFromDate(inputDate) : inputDate);
    } else {
      throw new Error(errorString);
    }
  }
};

const stringifyAndAddZero = (numberValue: number) =>
  numberValue < 10 ? `0${numberValue}` : `${numberValue}`;

const makePluralSuffixFunc = (intAges: IntAges) => {
  return (timeUnit: keyof IntAges) => {
    const valueToCheck = intAges[timeUnit];
    if (valueToCheck === 1) {
      return '';
    } else {
      return 's';
    }
  };
};

/*
Higher order function to allow for different interval calculations for the same patient at different points in the code
If result needed immediately, just curry
*/

export function zeit(
  from: Date | 'string', // furthest away date / time in the interval
  until: Date | null | undefined, // closest date / time in the interval
  birthGestationInDays = 280, // self-explanatory (default is 40 weeks))
) {
  if (!from) {
    throw new Error('Zeit requires a valid from date');
  }
  let fromDate = parseDate(from);
  let untilDate = !until ? new Date() : parseDate(until);
  let msDifferenceUncorrected: number;
  const tempDifference = untilDate.getTime() - fromDate.getTime();
  if ((typeof from === 'string' && typeof until === 'string') || tempDifference <= 1209600000) {
    msDifferenceUncorrected = tempDifference;
  } else {
    fromDate = parseDate(fromDate, true);
    untilDate = parseDate(untilDate, true);
    msDifferenceUncorrected = untilDate.getTime() - fromDate.getTime();
  }
  const correctDays = birthGestationInDays < 280 ? 280 - birthGestationInDays : 0;
  const fromDateCorrected = correctDays ? addDays(fromDate, correctDays) : new Date(fromDate);
  const msDifferenceCorrected = untilDate.getTime() - fromDateCorrected.getTime();
  return (
    units: PossibleUnits, // for output, must be specified
    correct = true, // correct for gestation
    integer = true, // returns an integer age or not (only applicable if units not a string / digitalClock)
  ) => {
    const msDifference = correct ? msDifferenceCorrected : msDifferenceUncorrected;
    const rawValueCalc = (newUnits: PossibleUnits) => rawValue(msDifference, newUnits);
    if (units !== 'string' && units !== 'digitalClock') {
      const rawAnswer = rawValueCalc(units);
      if (integer === true) {
        return Math.floor(rawAnswer);
      } else {
        return rawAnswer;
      }
    } else {
      let rawYears = rawValueCalc('years');
      let rawMonths = rawValueCalc('months');
      // String age could appear a year younger on their birthday (due to pesky .25), so to stop this:
      // Only months and years changed, as from 1 yr no weeks / days etc displayed
      if (
        '' + fromDate.getDate() + fromDate.getMonth() ===
        '' + untilDate.getDate() + untilDate.getMonth()
      ) {
        if (Math.round(rawMonths) === 12) {
          rawYears = Math.round(rawYears);
          rawMonths = Math.round(rawMonths);
        }
      }
      const yearBitLeft = rawYears - Math.floor(rawYears);
      const remainderMonths = Math.floor(yearBitLeft * 12);
      const monthBitLeft = rawMonths - Math.floor(rawMonths);
      const remainderWeeks = Math.floor(monthBitLeft * 4);
      const intAges: IntAges = {
        seconds: Math.floor(rawValueCalc('seconds')),
        remainderSeconds: Math.floor(rawValueCalc('seconds')) % 60,
        minutes: Math.floor(rawValueCalc('minutes')),
        remainderMinutes: Math.floor(rawValueCalc('minutes')) % 60,
        hours: Math.floor(rawValueCalc('hours')),
        remainderHours: Math.floor(rawValueCalc('hours')) % 24,
        days: Math.floor(rawValueCalc('days')),
        remainderDays: Math.floor(rawValueCalc('days')) % 7,
        weeks: Math.floor(rawValueCalc('weeks')),
        remainderWeeks: remainderWeeks,
        months: Math.floor(rawMonths),
        remainderMonths: remainderMonths,
        years: Math.floor(rawYears),
      };
      if (units === 'digitalClock') {
        const outputHours = stringifyAndAddZero(intAges.hours);
        const outputMinutes = stringifyAndAddZero(intAges.remainderMinutes);
        const outputSeconds = stringifyAndAddZero(intAges.remainderSeconds);
        return `${outputHours}:${outputMinutes}:${outputSeconds}`;
      }
      const pluralSuffixer = makePluralSuffixFunc(intAges);
      switch (true) {
        case intAges.days < 1:
          return `${intAges.remainderHours} hour${pluralSuffixer('remainderHours')}`;
        case intAges.days < 14:
          return `${intAges.days} day${pluralSuffixer('days')} and ${
            intAges.remainderHours
          } hour${pluralSuffixer('remainderHours')}`;
        case intAges.weeks >= 2 && intAges.weeks < 8:
          return `${intAges.weeks} week${pluralSuffixer('weeks')} and ${
            intAges.remainderDays
          } day${pluralSuffixer('remainderDays')}`;
        case intAges.weeks >= 8 && rawYears < 1:
          return `${intAges.months} month${pluralSuffixer('months')} and ${
            intAges.remainderWeeks
          } week${pluralSuffixer('remainderWeeks')}`;
        default:
          return `${intAges.years} year${pluralSuffixer('years')} and ${
            intAges.remainderMonths
          } month${pluralSuffixer('remainderMonths')}`;
      }
    }
  };
}
