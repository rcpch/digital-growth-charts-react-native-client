import React from 'react';
import {View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type appIconPropTypes = {
  style?: {[kind: string]: number | string};
  name: string;
  color?: string;
  size?: number;
};

function AppIcon({style, name, color, size}: appIconPropTypes) {
  if (style) {
    return (
      <View style={style}>
        <MaterialCommunityIcons
          name={name}
          color={color || 'white'}
          size={size || 20}
        />
      </View>
    );
  }
  return (
    <MaterialCommunityIcons
      name={name}
      color={color || 'white'}
      size={size || 20}
    />
  );
}

export default AppIcon;
