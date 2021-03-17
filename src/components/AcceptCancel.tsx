import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

import AppIcon from './AppIcon';
import {colors} from '../config';

type propTypes = {
  cancelInput: Function;
  acceptInput: Function;
  iconSize: number;
  width?: number;
};

function AcceptCancel({cancelInput, acceptInput, iconSize, width}: propTypes) {
  const containerWidth = width ? {width: width} : null;
  return (
    <View style={[styles.container, containerWidth]}>
      <View style={styles.roundIcon}>
        <TouchableOpacity onPress={() => cancelInput()}>
          <AppIcon name="close-circle" color={colors.black} size={iconSize} />
        </TouchableOpacity>
      </View>
      <View style={styles.roundIcon}>
        <TouchableOpacity onPress={() => acceptInput()}>
          <AppIcon name="check-circle" color={colors.black} size={iconSize} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default AcceptCancel;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  roundIcon: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});