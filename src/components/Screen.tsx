import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
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

// top banner is 42px + any padding for safe area

const Screen = ({
  children,
  title,
  renderBack = false,
  backgroundColor,
}: propTypes) => {
  const insets = useSafeAreaInsets();
  const dynamicBannerStyle = {
    paddingTop: insets.top,
    backgroundColor: backgroundColor || colors.darkest,
  };
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const goBack = () => navigation.goBack();
  const darkBackground = {backgroundColor: 'black'};
  return (
    <View
      style={
        scheme === 'dark'
          ? {...styles.wholeScreen, ...darkBackground}
          : styles.wholeScreen
      }>
      <View style={[styles.banner, dynamicBannerStyle]}>
        <View style={styles.titleContainer}>
          <Image
            style={styles.logo}
            source={require('../assets/imgs/RCPCHStar.png')}
            resizeMode="contain"
          />
          <AppText style={styles.titleText}>{title}</AppText>
        </View>
        {renderBack && (
          <TouchableOpacity style={styles.touchableContainer} onPress={goBack}>
            <AppIcon
              name="chevron-left"
              size={30}
              color={colors.white}
              style={styles.backButton}
            />
          </TouchableOpacity>
        )}
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  view: {
    flex: 1,
    alignItems: 'center',
  },
  touchableContainer: {
    left: 8,
    bottom: 5,
    position: 'absolute',
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  titleText: {
    color: colors.white,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  wholeScreen: {
    flex: 1,
  },
  logo: {
    height: 30,
    width: 30,
    marginBottom: 8,
    marginTop: 4,
  },
});

export default Screen;
