function xTickCount(
  lowerThreshold: number,
  upperThreshold: number,
  interval: string,
): number | undefined {
  const yearsDifference = upperThreshold - lowerThreshold;

  let multiplier = 0; // default as if years

  if (interval === 'years') {
    multiplier = 1;
  } else if (interval == 'months') {
    multiplier = 12; //2 monthly
  } else if (interval == 'weeks') {
    multiplier = 52; // 2 weekly
  } else {
    throw new Error('No valid interval found');
  }

  const answer = Math.round(yearsDifference * multiplier);

  return answer;
}

export default xTickCount;
