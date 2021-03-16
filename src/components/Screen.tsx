import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import {colors} from '../config';
import AppIcon from './AppIcon';
import AppText from './AppText';

type propTypes = {
  children: React.ReactNode;
  title?: string;
  renderBack?: boolean;
  backgroundColor?: string;
};

const Screen = ({
  children,
  title,
  renderBack = false,
  backgroundColor,
}: propTypes) => {
  const insets = useSafeAreaInsets();
  const dynamicBannerStyle = {
    height: insets.top + 50,
    backgroundColor: backgroundColor || colors.light,
  };
  const dynamicWholeScreen = {paddingBottom: insets.bottom, flex: 1};
  const navigation = useNavigation();
  const goBack = () => navigation.goBack();
  return (
    <View style={dynamicWholeScreen}>
      <View style={[styles.banner, dynamicBannerStyle]}>
        {renderBack && (
          <TouchableOpacity style={styles.touchableContainer} onPress={goBack}>
            <AppIcon
              name="chevron-left"
              size={30}
              color={colors.black}
              style={styles.backButton}
            />
            <AppText style={styles.backText}>Back</AppText>
          </TouchableOpacity>
        )}
        <View style={{width: '100%', alignItems: 'center'}}>
          <AppText style={styles.titleText}>{title}</AppText>
        </View>
      </View>
      <View style={styles.view}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingBottom: 10,
  },
  view: {
    flex: 1,
    alignItems: 'center',
  },
  touchableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
  },
  titleText: {
    color: colors.black,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  backText: {
    color: colors.black,
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default Screen;
