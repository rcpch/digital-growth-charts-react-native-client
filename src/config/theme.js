import {Dimensions, StyleSheet} from 'react-native';
import colors from './colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const containerWidth = windowWidth - 10;

const styles = StyleSheet.create({
  button: {
    width: containerWidth,
    alignItems: 'center',
    backgroundColor: colors.rcpchPink,
    borderRadius: 5,
    color: 'white',
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
  },
});

export default styles;
