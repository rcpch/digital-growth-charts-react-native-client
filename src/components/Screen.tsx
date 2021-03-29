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
    height: insets.top + 30,
    backgroundColor: backgroundColor || colors.light,
  };
  const navigation = useNavigation();
  const goBack = () => navigation.goBack();
  return (
    <View style={styles.wholeScreen}>
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
        <View style={styles.titleContainer}>
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
    paddingBottom: 6,
  },
  banner: {
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    borderBottomColor: colors.medium,
    borderBottomWidth: 1,
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
  titleContainer: {
    width: '100%',
    alignItems: 'center',
  },
  titleText: {
    color: colors.black,
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 30,
  },
  backText: {
    color: colors.black,
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 30,
  },
  wholeScreen: {
    flex: 1,
  },
});

export default Screen;
