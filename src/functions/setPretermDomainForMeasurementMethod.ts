import {Domains} from '../interfaces/Domains';

function setPretermDomainForMeasurementMethod(
  measurementMethod: string,
): Domains | undefined {
  switch (measurementMethod) {
    case 'height':
      return {
        x: [-0.325, 0.25],
        y: [20, 70],
      };
    case 'weight':
      return {
        x: [-0.325, 0.25],
        y: [0.1, 8],
      };
    case 'bmi':
      return {
        x: [-0.325, 0.25],
        y: [12, 20],
      };
    case 'ofc':
      return {
        x: [-0.325, 0.25],
        y: [35, 60],
      };
    default:
      throw new Error('No measurement method found');
  }
}

export default setPretermDomainForMeasurementMethod;
