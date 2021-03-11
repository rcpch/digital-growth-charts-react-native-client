import React from 'react';
import {
  Modal,
  StyleSheet,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';

import {colors, theme} from '../config';

import AppIcon from './AppIcon';

type propTypes = {
  modalVisible: boolean | undefined;
  cancelInput?: Function;
  children: React.ReactNode;
  renderCloseButton?: boolean;
};

const AppModal = ({
  modalVisible,
  cancelInput,
  renderCloseButton = true,
  children,
}: propTypes) => {
  const handleRequestClose = () => {
    if (!cancelInput && Platform.OS === 'android') {
      throw new Error(
        'Modal views require function to close modal on android, none was provided',
      );
    } else if (cancelInput) {
      cancelInput();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleRequestClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {renderCloseButton && (
            <TouchableOpacity onPress={handleRequestClose}>
              <View style={styles.closeIconForModalContainer}>
                <AppIcon
                  name="close-circle"
                  color={colors.black}
                  size={30}
                  style={styles.closeIconForModal}
                />
              </View>
            </TouchableOpacity>
          )}
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    ...theme.modal,
    backgroundColor: colors.light,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 20,
  },
  closeIconForModalContainer: {
    marginTop: -15,
    width: theme.modal.width,
  },
  closeIconForModal: {
    height: 50,
    width: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
