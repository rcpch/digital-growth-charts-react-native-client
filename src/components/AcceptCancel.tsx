import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

import AppIcon from './AppIcon';

type propTypes = {
  cancelInput: Function;
  acceptInput: Function;
  iconSize: number;
  iconColor?: string;
  width?: number;
};

function AcceptCancel({
  cancelInput,
  acceptInput,
  iconSize,
  iconColor = 'white',
  width,
}: propTypes) {
  const containerWidth = width ? {width: width} : null;
  return (
    <View style={[styles.container, containerWidth]}>
      <View style={styles.roundIcon}>
        <TouchableOpacity onPress={() => cancelInput()}>
          <AppIcon name="close-circle" color={iconColor} size={iconSize} />
        </TouchableOpacity>
      </View>
      <View style={styles.roundIcon}>
        <TouchableOpacity onPress={() => acceptInput()}>
          <AppIcon name="check-circle" color={iconColor} size={iconSize} />
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
