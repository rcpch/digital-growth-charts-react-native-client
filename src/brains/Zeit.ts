// Replacing moment.js

import {formatDate} from './oddBits';

const addDays = (date: Date, moreDays: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + moreDays);
  return result;
};
class Zeit {
  from: Date;
  until: Date;
  birthGestationInDays: number;
  fromObjectCorrected: Date;
  msDifferenceCorrected: number;
  msDifferenceRaw: number;
  constructor(
    from: Date | null, // furthest away date / time in the interval
    until: Date | null, // closest date / time in the interval
    birthGestationInDays = 280, // self-explanatory (default is 40 weeks)
  ) {
    if (!from) {
      throw new Error('Zeit requires a from date');
    }
    let fromDate: Date = from;
    let untilDate: Date = until || new Date();
    const msDifference = untilDate.getTime() - fromDate.getTime();
    // 14 days in milliseconds:
    if (msDifference > 1209600000) {
      // removes hh:mm:ss etc from date objects
      fromDate = new Date(formatDate(fromDate, true, true));
      untilDate = new Date(formatDate(untilDate, true, true));
    }
    this.from = fromDate;
    this.until = untilDate;
    this.birthGestationInDays = birthGestationInDays;
    const correctDays =
      birthGestationInDays < 259 ? 280 - birthGestationInDays : 0;
    this.fromObjectCorrected = correctDays ? addDays(from, correctDays) : from;
    this.msDifferenceCorrected =
      this.until.getTime() - this.fromObjectCorrected.getTime();
    this.msDifferenceRaw = this.until.getTime() - this.from.getTime();
  }
  calculate(
    units: string, // for output, must be specified
    correct = true, // correct for gestation
    integer = true, // returns an integer age or not
    digitalClockOutput = false, // returns output for used for resuscitation, units must be set to string
  ) {
    const milliseconds = 1000;
    const seconds = 60;
    const minutes = 60;
    const hours = 24;
    const days = 7;
    const months = 365.25 / 12;
    const exactYears = 365.25;
    let millisecondDifference = this.msDifferenceRaw;
    let from = this.from;
    if (correct && this.birthGestationInDays < 259) {
      millisecondDifference = this.msDifferenceCorrected;
      from = this.fromObjectCorrected;
    }

    const rawValues: {[index: string]: Function} = {
      seconds: function () {
        return millisecondDifference / milliseconds;
      },
      minutes: function () {
        return millisecondDifference / (milliseconds * seconds);
      },
      hours: function () {
        return millisecondDifference / (milliseconds * seconds * minutes);
      },
      days: function () {
        return (
          millisecondDifference / (milliseconds * seconds * minutes * hours)
        );
      },
      weeks: function () {
        return (
          millisecondDifference /
          (milliseconds * seconds * minutes * hours * days)
        );
      },
      months: function () {
        return (
          millisecondDifference /
          (milliseconds * seconds * minutes * hours * months)
        );
      },
      years: function () {
        return (
          millisecondDifference /
          (milliseconds * seconds * minutes * hours * exactYears)
        );
      },
    };
    if (units !== 'string') {
      try {
        const rawAnswer = rawValues[units]();
        if (integer === true) {
          return Math.floor(rawAnswer);
        } else {
          return rawAnswer;
        }
      } catch (error) {
        throw new Error('Invalid units given to Zeit');
      }
    } else {
      let rawYears = rawValues.years();
      let rawMonths = rawValues.months();
      // String age could appear a year younger on their birthday (due to pesky .25), so to stop this:
      if (
        '' + from.getDate() + from.getMonth() ===
        '' + this.until.getDate() + this.until.getMonth()
      ) {
        if (Math.round(rawValues.years()) !== Math.floor(rawValues.years())) {
          rawYears = Math.round(rawYears);
          rawMonths = Math.round(rawMonths);
        }
      }
      const yearBitLeft = rawYears - Math.floor(rawYears);
      const remainderMonths = Math.floor(yearBitLeft * 12);
      const monthBitLeft = rawMonths - Math.floor(rawMonths);
      const remainderWeeks = Math.floor(monthBitLeft * 4);
      const intAges = {
        seconds: Math.floor(rawValues.seconds()),
        remainderSeconds: Math.floor(rawValues.seconds()) % 60,
        minutes: Math.floor(rawValues.minutes()),
        remainderMinutes: Math.floor(rawValues.minutes()) % 60,
        hours: Math.floor(rawValues.hours()),
        remainderHours: Math.floor(rawValues.hours()) % 24,
        days: Math.floor(rawValues.days()),
        remainderDays: Math.floor(rawValues.days()) % 7,
        weeks: Math.floor(rawValues.weeks()),
        remainderWeeks: remainderWeeks,
        months: Math.floor(rawMonths),
        remainderMonths: remainderMonths,
        years: Math.floor(rawYears),
      };
      if (digitalClockOutput) {
        let outputHours = '';
        let outputMinutes = '';
        let outputSeconds = '';
        intAges.hours < 10
          ? (outputHours = `0${intAges.hours}`)
          : (outputHours = `${intAges.hours}`);
        intAges.remainderMinutes < 10
          ? (outputMinutes = `0${intAges.remainderMinutes}`)
          : (outputMinutes = `${intAges.remainderMinutes}`);
        intAges.remainderSeconds < 10
          ? (outputSeconds = `0${intAges.remainderSeconds}`)
          : (outputSeconds = `${intAges.remainderSeconds}`);
        return `${outputHours}:${outputMinutes}:${outputSeconds}`;
      }
      const plurals: {[index: string]: string} = {
        seconds: '',
        remainderSeconds: '',
        minutes: '',
        remainderMinutes: '',
        hours: '',
        remainderHours: '',
        days: '',
        remainderDays: '',
        weeks: '',
        remainderWeeks: '',
        months: '',
        remainderMonths: '',
        years: '',
      };
      for (const [key, value] of Object.entries(intAges)) {
        if (value === 1) {
          plurals[key] = '';
        } else {
          plurals[key] = 's';
        }
      }
      switch (true) {
        case intAges.days < 1:
          return `${intAges.remainderHours} hour${plurals.remainderHours}`;
        case intAges.days < 14:
          return `${intAges.days} day${plurals.days} and ${intAges.remainderHours} hour${plurals.remainderHours}`;
        case intAges.weeks >= 2 && intAges.weeks < 8:
          return `${intAges.weeks} week${plurals.weeks} and ${intAges.remainderDays} day${plurals.remainderDays}`;
        case intAges.weeks >= 8 && rawYears < 1:
          return `${intAges.months} month${plurals.months} and ${intAges.remainderWeeks} week${plurals.remainderWeeks}`;
        default:
          return `${intAges.years} year${plurals.years} and ${intAges.remainderMonths} month${plurals.remainderMonths}`;
      }
    }
  }
}

export default Zeit;
