import React from 'react';

import UnitsSwitcher from './UnitsSwitcher';
import PickerButton from '../PickerButton';

import useCombined from '../../hooks/useCombined';
import {colors} from '../../config';
import AcceptCancel from '../AcceptCancel';

type propTypes = {
  name: string;
  trueValue: string;
  falseValue: string;
  userLabel: string;
  iconName: string;
};

const BinarySelector = ({
  name,
  trueValue,
  falseValue,
  userLabel,
  iconName,
}: propTypes) => {
  const {
    combinedSetter,
    buttonState,
    initialState,
    specificErrorMessage,
    showErrorMessages,
  } = useCombined(name);

  const {showPicker, value, workingValue} = buttonState;

  const buttonText = value ? `${userLabel}: ${value}` : `${userLabel}`;

  const showCancel = value ? true : false;

  const toggleInput = () => {
    if (showPicker) {
      combinedSetter({
        showPicker: false,
        value: workingValue,
      });
    } else {
      combinedSetter({
        showPicker: true,
        workingValue: workingValue || falseValue,
      });
    }
  };

  const cancelInput = () => {
    if (showPicker) {
      combinedSetter({showPicker: false, workingValue: value});
    } else {
      combinedSetter(initialState[name]);
    }
  };

  return (
    <PickerButton
      toggleInput={toggleInput}
      cancelInput={cancelInput}
      buttonText={buttonText}
      showCancel={showCancel}
      iconName={iconName}
      specificErrorMessage={specificErrorMessage}
      showErrorMessages={showErrorMessages}>
      {showPicker && (
        <UnitsSwitcher
          backgroundColor={colors.medium}
          trueUnits={trueValue}
          falseUnits={falseValue}
          workingUnits={workingValue}
          setWorkingUnits={(newValue: string) =>
            combinedSetter({workingValue: newValue})
          }>
          <AcceptCancel
            acceptInput={toggleInput}
            cancelInput={cancelInput}
            iconSize={30}
          />
        </UnitsSwitcher>
      )}
    </PickerButton>
  );
};

export default BinarySelector;
