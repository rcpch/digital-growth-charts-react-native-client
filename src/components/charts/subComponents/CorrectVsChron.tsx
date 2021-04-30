import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';

import AppIcon from '../../AppIcon';
import AppModal from '../../AppModal';

function CorrectVsChron({
  titleTextStyle,
  subtitleTextStyle,
  showChronologicalAge,
  setShowChronologicalAge,
  showCorrectedAge,
  setShowCorrectedAge,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => setModalVisible(false);

  const buttonData = [
    {
      label: 'Corrected age only',
      onPress: () => {
        setShowCorrectedAge(true);
        setShowChronologicalAge(false);
      },
      key: 'corrected',
      visible: () => (showCorrectedAge && !showChronologicalAge ? true : false),
    },
    {
      label: 'Chronological age only',
      onPress: () => {
        setShowChronologicalAge(true);
        setShowCorrectedAge(false);
      },
      key: 'chronological',
      visible: () => (showChronologicalAge && !showCorrectedAge ? true : false),
    },
    {
      label: 'Both corrected and chronological',
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
              <AppIcon color="black" size={25} name="check-circle" />
            )}
          </View>
          <Text style={styles.selectionText}>{item.label}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  });

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.littleButton}>
        <Text style={subtitleTextStyle}>Points Plotted...</Text>
      </TouchableOpacity>
      <AppModal
        modalVisible={modalVisible}
        cancelInput={closeModal}
        style={styles.modalView}
        renderCloseButton={false}>
        {selections}
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Done</Text>
        </TouchableOpacity>
      </AppModal>
    </>
  );
}

export default CorrectVsChron;

const styles = StyleSheet.create({
  littleButton: {
    backgroundColor: '#D9D9D9',
    padding: 8,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  modalView: {
    backgroundColor: '#D9D9D9',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'black',
    padding: 8,
    borderRadius: 10,
  },
  closeButtonText: {
    fontFamily: 'Montserrat-Regular',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    padding: 5,
  },
  selectionText: {
    fontFamily: 'Montserrat-Regular',
    color: 'black',
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'left',
  },
  tickSelector: {
    height: 30,
    width: 30,
    margin: 2,
    marginRight: 8,
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
