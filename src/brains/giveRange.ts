const majorCentileLines: [number, string][] = [
  [-2.652069808, '0.4th'],
  [-2.053748911, '2nd'],
  [-1.340755034, '9th'],
  [-0.67448975, '25th'],
  [0, '50th'],
  [0.67448975, '75th'],
  [1.340755034, '91st'],
  [2.053748911, '98th'],
  [2.652069808, '99.6th'],
];

// javascript implementation to give centile range for result from z score:

const giveRange = (z: number): string => {
  if (!z && z !== 0) {
    return '';
  }
  if (z <= -6) {
    return 'This measurement is well below the normal range. Please review its accuracy.';
  }
  if (z >= 6) {
    return 'This measurement is well above the normal range. Please review its accuracy.';
  }
  const lowestThreshold = -2.801;
  const highestThreshold = 2.801;
  const arrayForOrdering: [number, string][] = [];
  for (let i = 0; i < majorCentileLines.length; i++) {
    arrayForOrdering.push(majorCentileLines[i]);
  }
  arrayForOrdering.push([z, 'childZ']);
  arrayForOrdering.sort(
    (a: [number, string], b: [number, string]) => a[0] - b[0],
  );
  const measurementPosition = arrayForOrdering.findIndex(
    (element: [number, string]) => element[0] === z,
  );
  if (measurementPosition === 0) {
    if (z < lowestThreshold) {
      return 'Less than the 0.4th centile.';
    } else {
      return 'On or near the 0.4th centile.';
    }
  } else if (measurementPosition === 9) {
    if (z > highestThreshold) {
      return 'Greater than the 99.6th centile.';
    } else {
      return 'On or near the 99.6th centile.';
    }
  } else if (measurementPosition === undefined) {
    throw new Error('Error with giveRange array search');
  } else {
    const lower = arrayForOrdering[measurementPosition - 1][0];
    const upper = arrayForOrdering[measurementPosition + 1][0];
    if (z - lower <= (upper - lower) / 4) {
      return `On or near the ${
        arrayForOrdering[measurementPosition - 1][1]
      } centile.`;
    }
    if (upper - z <= (upper - lower) / 4) {
      return `On or near the ${
        arrayForOrdering[measurementPosition + 1][1]
      } centile.`;
    } else {
      return `Between the ${
        arrayForOrdering[measurementPosition - 1][1]
      } and the ${arrayForOrdering[measurementPosition + 1][1]} centiles.`;
    }
  }
};

export default giveRange;
