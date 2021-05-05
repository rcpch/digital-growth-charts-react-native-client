import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  TextStyle,
} from 'react-native';

import AppIcon from '../../AppIcon';
import AppModal from '../../AppModal';

type propTypes = {
  showChronologicalAge: boolean;
  setShowChronologicalAge: Function;
  showCorrectedAge: boolean;
  setShowCorrectedAge: Function;
  customStyle: {
    background: {
      backgroundColor: string;
    };
    heading: TextStyle;
    paragraph: TextStyle;
    buttonBackground: {
      backgroundColor: string;
    };
    buttonText: TextStyle;
  };
};

function CorrectVsChron({
  showChronologicalAge,
  setShowChronologicalAge,
  showCorrectedAge,
  setShowCorrectedAge,
  customStyle,
}: propTypes) {
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => setModalVisible(false);

  const buttonData = [
    {
      label: 'Adjusted age only',
      onPress: () => {
        setShowCorrectedAge(true);
        setShowChronologicalAge(false);
      },
      key: 'corrected',
      visible: () => (showCorrectedAge && !showChronologicalAge ? true : false),
    },
    {
      label: 'Unadjusted age only',
      onPress: () => {
        setShowChronologicalAge(true);
        setShowCorrectedAge(false);
      },
      key: 'chronological',
      visible: () => (showChronologicalAge && !showCorrectedAge ? true : false),
    },
    {
      label: 'Both ages',
      onPress: () => {
        setShowCorrectedAge(true);
        setShowChronologicalAge(true);
      },
      key: 'both',
      visible: () => (showCorrectedAge && showChronologicalAge ? true : false),
    },
  ];

  const selections = buttonData.map((item) => {
    const isVisible = item.visible();
    return (
      <TouchableWithoutFeedback onPress={item.onPress} key={item.key}>
        <View style={styles.selectionContainer}>
          <View style={styles.tickSelector}>
            {isVisible && (
              <AppIcon
                color={customStyle.heading.color}
                size={25}
                name="check-circle"
              />
            )}
          </View>
          <Text style={{...customStyle.heading, ...styles.selectionText}}>
            {item.label}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  });

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{...customStyle.buttonBackground, ...styles.littleButton}}>
        <Text style={customStyle.buttonText}>Points Plotted...</Text>
      </TouchableOpacity>
      <AppModal
        modalVisible={modalVisible}
        cancelInput={closeModal}
        style={customStyle.background}
        renderCloseButton={false}>
        {selections}
        <TouchableOpacity
          onPress={closeModal}
          style={{...customStyle.buttonBackground, ...styles.closeButton}}>
          <Text style={customStyle.buttonText}>Done</Text>
        </TouchableOpacity>
      </AppModal>
    </>
  );
}

export default CorrectVsChron;

const styles = StyleSheet.create({
  littleButton: {
    padding: 8,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 8,
    borderRadius: 10,
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    padding: 5,
  },
  selectionText: {
    textAlign: 'left',
  },
  tickSelector: {
    height: 30,
    width: 30,
    margin: 2,
    marginRight: 8,
    borderRadius: 15,
    borderColor: 'white',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
