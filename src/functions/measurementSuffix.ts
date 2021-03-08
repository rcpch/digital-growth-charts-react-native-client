function measurementSuffix(measurement: string): string | undefined {
  switch (measurement) {
    case 'height':
      return 'cm';
    case 'weight':
      return 'kg';
    case 'ofc':
      return 'cm';
    case 'bmi':
      return 'kg/m²';
    default:
      throw new Error('No valid measurement found');
  }
}

export default measurementSuffix;
