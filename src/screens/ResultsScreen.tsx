import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';

import {Screen, AppText, AgeButton, CentileOutput} from '../components';
import {colors, theme} from '../config';
import {useRcpchApi} from '../hooks/';

const centileMeasurements = ['weight', 'height', 'bmi', 'ofc'];

function ResultsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const {
    getMultipleCentileResults,
    centileResults,
    errors,
    globalState,
  } = useRcpchApi('local');

  const reset = () => {
    setIsLoading(true);
  };

  console.log(centileResults.weight);

  const showRefresh = errors.serverErrors ? true : false;

  useEffect(() => {
    let recordAnswer = true;
    if (isLoading) {
      getMultipleCentileResults(recordAnswer).then(() => setIsLoading(false));
    }
    return () => {
      recordAnswer = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const centileOutputs = centileMeasurements.map((item) => {
    const measurementProvided = globalState[item]?.value ? true : false;
    return (
      <CentileOutput
        measurementProvided={measurementProvided}
        measurementType={item}
        centileResults={centileResults}
        errors={errors}
        isLoading={isLoading}
        key={item}
      />
    );
  });

  return (
    <Screen renderBack>
      <AgeButton
        centileResults={centileResults}
        errors={errors}
        isLoading={isLoading}
      />
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
