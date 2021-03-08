function yAxisLabel(measurement_method: string): string | undefined {
  if (measurement_method === 'height') {
    return 'Height/Length (cm)';
  }
  if (measurement_method === 'weight') {
    return 'Weight (kg)';
  }
  if (measurement_method === 'bmi') {
    return 'Body Mass Index (kg/m²)';
  }
  if (measurement_method === 'ofc') {
    return 'Head Circumference (cm)';
  } else {
    throw new Error('No valid measurement method found');
  }
}

export default yAxisLabel;
