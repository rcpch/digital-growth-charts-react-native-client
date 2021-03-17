import {Dimensions, StyleSheet} from 'react-native';
import colors from './colors';

// static values, these do not respond to change from portrait to landscape:
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const containerWidth = windowWidth - 10;

const styles = StyleSheet.create({
  button: {
    width: containerWidth,
    alignItems: 'center',
    backgroundColor: colors.darkMedium,
    borderRadius: 5,
    color: 'white',
    flexDirection: 'row',
    height: windowWidth > 350 ? 54 : 50,
    margin: 5,
    paddingLeft: 8,
  },
  buttonTextBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: containerWidth - 45,
    height: 57,
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    fontSize: windowWidth > 350 ? 18 : 16,
    color: colors.white,
  },
  modal: {
    width: containerWidth > 350 ? 350 : containerWidth,
  },
});

export default styles;
export {containerWidth, windowWidth, windowHeight};
