import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View, useColorScheme} from 'react-native';

import {Screen, AppText, AgeButton, CentileOutput} from '../components';
import {colors, theme} from '../config';
import {useRcpchApi} from '../hooks/';

const centileMeasurements = ['weight', 'height', 'bmi', 'ofc'];

function ResultsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const {getMultipleCentileResults, centileResults, errors, globalState} = useRcpchApi('local');

  const reset = () => {
    setIsLoading(true);
  };

  const showRefresh = errors.serverErrors ? true : false;

  const scheme = useColorScheme();

  const backgroundColor = {
    backgroundColor: scheme === 'dark' ? colors.light : colors.darkest,
  };

  const centileOutputs = centileMeasurements.map((item) => {
    const measurementProvided = globalState[item]?.value ? true : false;
    return (
      <CentileOutput
        measurementProvided={measurementProvided}
        measurementType={item}
        centileResults={centileResults}
        errors={errors}
        isLoading={isLoading}
        reference={globalState.reference.value}
        key={item}
      />
    );
  });

  let referenceTitle: string;
  if (globalState.reference.value === 'uk-who') {
    referenceTitle = 'UK-WHO';
  } else if (globalState.reference.value === 'turner') {
    referenceTitle = "Turner's Syndrome";
  } else {
    referenceTitle = "Down's Syndrome";
  }

  useEffect(() => {
    let recordAnswer = true;
    if (isLoading) {
      getMultipleCentileResults(recordAnswer)
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    }
    return () => {
      recordAnswer = false;
    };
  }, [isLoading, getMultipleCentileResults]);

  return (
    <Screen renderBack>
      <View style={{...styles.referenceButton, ...backgroundColor}}>
        <AppText>{`Reference: ${referenceTitle}`}</AppText>
      </View>
      <AgeButton centileResults={centileResults} errors={errors} isLoading={isLoading} />
      {showRefresh && (
        <TouchableOpacity style={styles.refreshButton} onPress={reset}>
          <AppText>Try again</AppText>
        </TouchableOpacity>
      )}
      <ScrollView>
        <View style={styles.resultsContainer}>{centileOutputs}</View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  refreshButton: {
    ...theme.button,
    justifyContent: 'center',
  },
  referenceButton: {
    ...theme.button,
    justifyContent: 'center',
    backgroundColor: colors.light,
    marginTop: 8,
  },
  backButtonText: {
    ...theme.text,
    color: colors.black,
  },
  resultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ResultsScreen;
