import React from 'react';
import {StyleSheet, View, Switch, TouchableOpacity} from 'react-native';

import {theme, colors} from '../../config';
import AppText from '../AppText';

type propTypes = {
  children?: React.ReactNode;
  workingUnits: any;
  setWorkingUnits: Function;
  falseUnits: string;
  trueUnits: string;
  backgroundColor?: string;
};

const UnitsSwitcher = ({
  children,
  workingUnits,
  setWorkingUnits,
  falseUnits,
  trueUnits,
  backgroundColor,
}: propTypes) => {
  const handleToggle = (parameter: string) => {
    if (parameter === 'middle') {
      setWorkingUnits(workingUnits === trueUnits ? falseUnits : trueUnits);
    } else if (parameter === 'falseUnits') {
      setWorkingUnits(falseUnits);
    } else if (parameter === 'trueUnits') {
      setWorkingUnits(trueUnits);
    }
  };

  const background = backgroundColor
    ? {backgroundColor: backgroundColor}
    : null;

  const booleanValue = workingUnits === trueUnits ? true : false;

  return (
    <View style={[styles.container, background]}>
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => handleToggle('falseUnits')}>
          <AppText
            style={[
              styles.textLeft,
              workingUnits === falseUnits && selectedText,
            ]}>
            {falseUnits}
          </AppText>
        </TouchableOpacity>
        <Switch
          value={booleanValue}
          onValueChange={() => handleToggle('middle')}
          thumbColor="black"
          trackColor={{false: colors.light, true: colors.light}}
          ios_backgroundColor={colors.light}
        />
        <TouchableOpacity onPress={() => handleToggle('trueUnits')}>
          <AppText
            style={[
              styles.textRight,
              workingUnits === trueUnits && selectedText,
            ]}>
            {trueUnits}
          </AppText>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
};

export default UnitsSwitcher;

const selectedText = {
  color: 'white',
};

const styles = StyleSheet.create({
  container: {
    ...theme.button,
    justifyContent: 'space-evenly',
    backgroundColor: colors.medium,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark,
    padding: 6,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 22,
  },
  textLeft: {
    color: colors.darkMedium,
    paddingRight: 10,
  },
  textRight: {
    color: colors.darkMedium,
    paddingLeft: 10,
  },
});
