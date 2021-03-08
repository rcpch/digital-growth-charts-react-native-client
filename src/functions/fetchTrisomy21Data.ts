// interfaces
import {Domains} from '../interfaces/Domains';

// data
import ukwhoData from '../chartdata/uk_who_chart_data';
import trisomy21Data from '../chartdata/trisomy21Data';

// functions
import filterData from './filterData';

function fetchTrisomy21Data(
  sex: string,
  measurementMethod: string,
  domains: Domains,
): [][] {
  // Fetches the data to render based on the domain thresholds
  // truncates arrays based on visible data.

  const upperX = domains.x[1];
  const lowerX = domains.x[0];
  const upperY = domains.y[1];
  const lowerY = domains.y[0];

  const trisomy21DataSet: any = trisomy21Data.trisomy21[sex][measurementMethod];
  let uk90PretermDataSet: any = ukwhoData.uk90_preterm[sex][measurementMethod];

  let dataSetsToRender = [];

  const truncatedPretermDataSet = uk90PretermDataSet.filter(
    (centile: {data: object}) => {
      return filterData(centile.data, lowerX, upperX, lowerY, upperY);
    },
  );
  const truncatedTrisomyDataSet = trisomy21DataSet.filter(
    (centile: {data: object}) => {
      return filterData(centile.data, lowerX, upperX, lowerY, upperY);
    },
  );

  dataSetsToRender.push(truncatedPretermDataSet, truncatedTrisomyDataSet);
  return dataSetsToRender;
}

export default fetchTrisomy21Data;
