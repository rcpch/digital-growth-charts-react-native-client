const addOrdinalSuffix = (inputNumber: number): string => {
  let workingNumber = inputNumber;
  if (Number.isInteger(workingNumber) === false) {
    workingNumber *= 10;
    if (Number.isInteger(workingNumber) === false) {
      throw new Error(
        'Only integers or numbers to 1 decimal place are supported',
      );
    }
  }
  const remainder10 = workingNumber % 10;
  const remainder100 = workingNumber % 100;
  if (remainder10 === 1 && remainder100 !== 11) {
    return `${inputNumber}st`;
  }
  if (remainder10 === 2 && remainder100 !== 12) {
    return `${inputNumber}nd`;
  }
  if (remainder10 === 3 && remainder100 !== 13) {
    return `${inputNumber}rd`;
  } else {
    return `${inputNumber}th`;
  }
};

export default addOrdinalSuffix;
