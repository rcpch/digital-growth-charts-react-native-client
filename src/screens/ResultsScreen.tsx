import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Screen, AppText} from '../components';
import AgeButton from '../components/AgeButton';
import CentileOutputRCPCH from '../components/CentileOutputRCPCH';
import {colors, theme} from '../config';

function makeRefresh() {
  const returnObj: {[index: string]: string} = {
    weight: 'try',
    height: 'try',
    bmi: 'try',
    ofc: 'try',
  };
  return returnObj;
}

function ResultsScreen() {
  const [refresh, setRefresh] = useState(makeRefresh());
  const [showRefresh, setShowRefresh] = useState(false);
  const navigation = useNavigation();

  const refreshState = [refresh, setRefresh];

  const reset = () => {
    setRefresh((old) => {
      const mutable = {...old};
      for (const [key, value] of Object.entries(old)) {
        if (value === 'fail') {
          mutable[key] = 'try';
        }
      }
      return mutable;
    });
  };

  const goBack = () => navigation.goBack();

  useEffect(() => {
    let failure = false;
    for (const value of Object.values(refresh)) {
      if (value === 'fail') {
        failure = true;
        break;
      }
    }
    failure ? setShowRefresh(true) : setShowRefresh(false);
  }, [refresh, showRefresh]);

  return (
    <Screen>
      <AgeButton />
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <AppText style={styles.backButtonText}>← Calculate Again</AppText>
      </TouchableOpacity>
      {showRefresh && (
        <TouchableOpacity style={styles.refreshButton} onPress={reset}>
          <AppText>Refresh</AppText>
        </TouchableOpacity>
      )}
      <ScrollView>
        <View style={styles.resultsContainer}>
          <CentileOutputRCPCH
            measurement="weight"
            refreshState={refreshState}
          />
          <CentileOutputRCPCH
            measurement="height"
            refreshState={refreshState}
          />
          <CentileOutputRCPCH measurement="bmi" refreshState={refreshState} />
          <CentileOutputRCPCH measurement="ofc" refreshState={refreshState} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    ...theme.button,
    justifyContent: 'center',
    backgroundColor: colors.light,
  },
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
