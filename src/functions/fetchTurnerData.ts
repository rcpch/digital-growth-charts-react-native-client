// interfaces
import {Domains} from '../interfaces/Domains';

// data
import turnerData from '../chartdata/turners_chart_data';

// functions
import {filterData} from '../functions/';

function fetchTurnerData(
  sex: string,
  measurementMethod: string,
  domains: Domains,
): any {
  // Fetches the data to render based on the domain thresholds
  // truncates arrays based on visible data.
  if (sex === 'male' || measurementMethod !== 'height') {
    console.log('only height data is accepted in girls');
    return null;
  }

  const upperX = domains.x[1];
  const lowerX = domains.x[0];
  const upperY = domains.y[1];
  const lowerY = domains.y[0];

  let turnerDataSet = turnerData.turner['female']['height'];

  const truncatedTurnerDataSet = turnerDataSet.filter((centile: any) => {
    return filterData(centile.data, lowerX, upperX, lowerY, upperY);
  });

  return [truncatedTurnerDataSet];
}

export default fetchTurnerData;
