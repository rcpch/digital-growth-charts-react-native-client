import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {Platform, View, StyleSheet} from 'react-native';

import {colors, theme} from '../config';

const makeDateObject = (
  inputYear: number | string,
  inputMonth: number | string,
  inputDay: number | string,
  inputHour?: number | string,
  inputMinute?: number | string,
) => {
  let dateObject = {};
  const year = Number(inputYear);
  const month = Number(inputMonth);
  const day = Number(inputDay);
  const hour = inputHour ? Number(inputHour) : null;
  const minute = inputMinute ? Number(inputMinute) : null;
  try {
    if (!hour || !minute) {
      dateObject = new Date(year, month - 1, day);
    } else {
      dateObject = new Date(year, month - 1, day, hour, minute);
    }
    return dateObject;
  } catch (error) {
    throw new Error(`Standard date object maker error:${error}`);
  }
};

const customDateObject = (dateObject = new Date()) => {
  try {
    const day = `${dateObject.getDate()}`;
    const month = `${dateObject.getMonth() + 1}`;
    const year = `${dateObject.getFullYear()}`;
    const intHour = dateObject.getHours();
    const intMinute = dateObject.getMinutes();
    const hour =
      intHour < 10 ? `0${dateObject.getHours()}` : `${dateObject.getHours()}`;
    const minute = `${Math.floor(intMinute / 15) * 15}`;
    return {
      day: day,
      month: month,
      year: year,
      hour: hour,
      minute: minute,
    };
  } catch (error) {
    throw new Error(`Custom date object maker error:${error}`);
  }
};

const monthDays = (year = '2000', month = '1') => {
  const lengths: {[key: string]: number} = {
    '1': 31,
    '2': 28,
    '3': 31,
    '4': 30,
    '5': 31,
    '6': 30,
    '7': 31,
    '8': 31,
    '9': 30,
    '10': 31,
    '11': 30,
    '12': 31,
  };
  let monthLength = lengths[month];
  if (Number(year) % 4 === 0 && month === '2') {
    monthLength = 29;
  }
  const workingArray = [];
  let i = 1;
  while (i <= monthLength) {
    workingArray.push(`${i}`);
    i += 1;
  }
  return workingArray;
};

const monthArray = [
  {value: '1', string: 'January'},
  {value: '2', string: 'February'},
  {value: '3', string: 'March'},
  {value: '4', string: 'April'},
  {value: '5', string: 'May'},
  {value: '6', string: 'June'},
  {value: '7', string: 'July'},
  {value: '8', string: 'August'},
  {value: '9', string: 'September'},
  {value: '10', string: 'October'},
  {value: '11', string: 'November'},
  {value: '12', string: 'December'},
];

const relevantYears = () => {
  const now = new Date();
  const year = now.getFullYear();
  let workingYear = year - 25;
  const workingArray = [];
  while (workingYear <= year) {
    workingArray.push(`${workingYear}`);
    workingYear += 1;
  }
  return workingArray;
};

const makeHourArray = () => {
  const workingArray = [];
  let i = 0;
  while (i < 24) {
    workingArray.push(i < 10 ? `0${i}` : `${i}`);
    i += 1;
  }
  return workingArray;
};

const minuteArray = ['00', '15', '30', '45'];

type propTypes = {date: Date; setDate: Function; renderTime?: boolean};

const DateTimeBare = ({date, setDate, renderTime = false}: propTypes) => {
  if (!date) {
    throw new Error('DateTime Picker needs an initialised date');
  }
  const ios = Platform.OS === 'ios' ? true : false;
  const custom = customDateObject(date);
  const dayArray = monthDays(custom.year, custom.month);
  const yearArray = relevantYears();
  const hourArray = makeHourArray();
  const initialValues = {
    yearList: yearArray,
    monthList: monthArray,
    dayList: dayArray,
    hourList: hourArray,
    minuteList: minuteArray,
    year: custom.year,
    month: custom.month,
    day: custom.day,
    hour: custom.hour,
    minute: custom.minute,
  };
  const [values, setValues] = useState(initialValues);

  const handleChange = (newValue: string, measurement: string) => {
    const newState = {...values, ...{[measurement]: newValue}};
    const dayArrayForNewMonth = monthDays(newState.year, newState.month);
    if (values.dayList.length !== dayArrayForNewMonth.length) {
      newState.dayList = dayArrayForNewMonth;
      const newLastDay = dayArrayForNewMonth[dayArrayForNewMonth.length - 1];
      if (newState.day > newLastDay) {
        newState.day = newLastDay;
      }
    }
    const {year, month, day, hour, minute} = newState;
    setValues(newState);
    setDate(makeDateObject(year, month, day, hour, minute));
  };

  const selectDay = values.dayList.map((element) => (
    <Picker.Item label={element} value={element} key={element} />
  ));
  const selectMonth = values.monthList.map((element) => (
    <Picker.Item
      label={element.string}
      value={element.value}
      key={element.value}
    />
  ));
  const selectYear = values.yearList.map((element) => (
    <Picker.Item label={`${element}`} value={element} key={element} />
  ));

  let selectHour, selectMinute;

  if (renderTime) {
    selectHour = values.hourList.map((element) => (
      <Picker.Item label={`${element}`} value={element} key={element} />
    ));
    selectMinute = values.minuteList.map((element) => (
      <Picker.Item label={`${element}`} value={element} key={element} />
    ));
  }

  return (
    <View style={styles.bigContainer}>
      <View style={styles.pickerContainer}>
        <Picker
          style={ios ? styles.iosPickerDate : styles.androidPickerDate}
          itemStyle={styles.iosPickerText}
          onValueChange={(newValue: string) => handleChange(newValue, 'day')}
          selectedValue={values.day}>
          {selectDay}
        </Picker>
        <Picker
          style={ios ? styles.iosPickerMonth : styles.androidPickerMonth}
          itemStyle={styles.iosPickerText}
          onValueChange={(newValue: string) => handleChange(newValue, 'month')}
          selectedValue={values.month}>
          {selectMonth}
        </Picker>
        <Picker
          style={ios ? styles.iosPickerDate : styles.androidPickerDate}
          itemStyle={styles.iosPickerText}
          onValueChange={(newValue: string) => handleChange(newValue, 'year')}
          selectedValue={values.year}>
          {selectYear}
        </Picker>
      </View>
      {renderTime && (
        <View style={styles.pickerContainer}>
          <Picker
            style={ios ? styles.iosPickerDate : styles.androidPickerDate}
            itemStyle={styles.iosPickerText}
            onValueChange={(newValue: string) => handleChange(newValue, 'hour')}
            selectedValue={values.hour}>
            {selectHour}
          </Picker>
          <Picker
            style={ios ? styles.iosPickerDate : styles.androidPickerDate}
            itemStyle={styles.iosPickerText}
            onValueChange={(newValue: string) =>
              handleChange(newValue, 'minute')
            }
            selectedValue={values.minute}>
            {selectMinute}
          </Picker>
        </View>
      )}
    </View>
  );
};

export default DateTimeBare;

const styles = StyleSheet.create({
  iosPickerDate: {
    height: 200,
    width: theme.modal.width / 3.4,
    alignSelf: 'center',
  },
  iosPickerMonth: {
    height: 200,
    width: theme.modal.width / 3 + 20,
    alignSelf: 'center',
  },
  iosPickerText: {
    ...theme.text,
    color: colors.black,
  },
  androidPickerDate: {
    height: 100,
    width: theme.modal.width / 2.9 - 10,
  },
  androidPickerMonth: {
    height: 100,
    width: theme.modal.width / 3.4,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
