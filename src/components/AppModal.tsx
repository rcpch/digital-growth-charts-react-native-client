import React from 'react';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';

import {colors, theme} from '../config';

import AppIcon from './AppIcon';

type propTypes = {
  modalVisible: boolean | undefined;
  cancelInput?: Function;
  children: React.ReactNode;
  renderCloseButton?: boolean;
  style?: any;
  // to correctly place close icon if custom styling used on modal:
  intendedModalWidth?: number;
};

const AppModal = ({
  modalVisible,
  cancelInput,
  renderCloseButton = true,
  children,
  style,
  intendedModalWidth,
}: propTypes) => {
  const handleRequestClose = () => {
    cancelInput
      ? cancelInput()
      : console.error('No cancel input function defined for modal');
  };

  const closeIconContainerWidth = intendedModalWidth
    ? {width: intendedModalWidth - 18}
    : null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleRequestClose}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, style]}>
          {renderCloseButton && (
            <TouchableOpacity onPress={handleRequestClose}>
              <View
                style={[
                  styles.closeIconForModalContainer,
                  closeIconContainerWidth,
                ]}>
                <AppIcon
                  name="close-circle"
                  color={colors.white}
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
    backgroundColor: colors.darkest,
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
    width: theme.modal.width - 18,
  },
  closeIconForModal: {
    height: 50,
    width: 50,
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
