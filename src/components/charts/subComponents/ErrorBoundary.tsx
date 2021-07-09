import React from 'react';
import {View, Text, StyleSheet, TextStyle} from 'react-native';

type PropTypes = {
  children: React.ReactNode;
  titleText: TextStyle;
  subTitleText: TextStyle;
};

class ErrorBoundary extends React.Component {
  state: {hasError: boolean};
  props: PropTypes;
  constructor(props: PropTypes) {
    super(props);
    this.state = {hasError: false};
    this.props = props;
  }

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error({error: error.message, errorInfo: errorInfo});
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={{...this.props.titleText, ...styles.textHeading}}>
            The chart cannot be displayed
          </Text>
          <Text style={{...this.props.subTitleText, ...styles.textMessage}}>
            Please navigate away from the chart and try again
          </Text>
        </View>
      );
    } else {
      return this.props.children;
    }
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textHeading: {
    fontSize: 22,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  textMessage: {
    paddingTop: 15,
    fontSize: 16,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
});

export default ErrorBoundary;
