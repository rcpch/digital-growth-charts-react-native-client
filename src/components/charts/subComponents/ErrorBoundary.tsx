import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type PropTypes = {
  children: React.ReactNode;
  height: number;
  width: number;
};

class ErrorBoundary extends React.Component {
  state: {hasError: boolean};
  constructor(props: PropTypes) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.log({error: error.message, errorInfo: errorInfo});
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.textHeading}>
            Woops! The chart encountered an error
          </Text>
          <Text style={styles.textMessage}>
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
    fontFamily: 'Montserrat-Regular',
    fontSize: 22,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  textMessage: {
    paddingTop: 15,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
});

export default ErrorBoundary;
