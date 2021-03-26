import ukwhoData from '../chartData/uk_who_chart_data';
import turnerData from '../chartData/turners_chart_data';
import trisomy21Data from '../chartData/trisomy21Data';

import {PlottableMeasurement} from '../interfaces/RCPCHMeasurementObject';
import {Domains} from '../interfaces/Domains';
import {Results} from '../MainChart.types';
import {
  IPlottedCentileMeasurement,
  UKWHOArray,
} from '../interfaces/CentilesObject';

function filterData(
  data: any,
  lowerX: number,
  upperX: number,
  lowerY: number,
  upperY: number,
) {
  const filtered = data.filter(
    (d: IPlottedCentileMeasurement) =>
      d.y <= upperY && d.y >= lowerY && d.x <= upperX && d.x >= lowerX,
  );
  return filtered;
}

// gets relevant data sets:
function getRelevantDataSets(
  sex: string,
  measurementMethod: string,
  reference: string,
  lowestChildX: number,
  highestChildX: number,
) {
  const dataSetRanges = [
    [-0.33, 0.0383],
    [0.0383, 2],
    [2, 4],
    [4, 21],
  ];
  let startingGroup = 0;
  let endingGroup = 3;
  for (let i = 0; i < dataSetRanges.length; i++) {
    const range = dataSetRanges[i];
    if (lowestChildX >= range[0] && lowestChildX < range[1]) {
      startingGroup = i;
    }
    if (highestChildX >= range[0] && highestChildX < range[1]) {
      endingGroup = i;
    }
  }
  if (reference === 'uk-who') {
    const allData: UKWHOArray = [
      ukwhoData.uk90_preterm[sex][measurementMethod],
      ukwhoData.uk_who_infant[sex][measurementMethod],
      ukwhoData.uk_who_child[sex][measurementMethod],
      ukwhoData.uk90_child[sex][measurementMethod],
    ];
    if (startingGroup === 0 && endingGroup === 3) {
      return allData;
    } else {
      let returnArray = [];
      for (let i = startingGroup; i <= endingGroup; i++) {
        returnArray.push(allData[i]);
      }
      return returnArray;
    }
  } else if (reference === 'trisomy-21') {
    if (startingGroup === 0 && endingGroup === 0) {
      return [ukwhoData.uk90_preterm[sex][measurementMethod]];
    } else if (startingGroup === 0 && endingGroup > 0) {
      return [
        ukwhoData.uk90_preterm[sex][measurementMethod],
        trisomy21Data.trisomy21[sex][measurementMethod],
      ];
    } else {
      return [trisomy21Data.trisomy21[sex][measurementMethod]];
    }
  } else if (reference === 'turner') {
    if (sex !== 'female' && measurementMethod !== 'height') {
      throw new Error(
        'Only female height data available for Turner, something else was requested',
      );
    }
    return [turnerData.turner.female.height];
  } else {
    throw new Error('No valid reference given to getRelevantDataSets');
  }
}

// analyses whole child measurement array to work out top and bottom x and y
function childMeasurementRanges(childMeasurements: PlottableMeasurement[]) {
  let highestChildX = 25;
  let lowestChildX = -1;
  let highestChildY = 500;
  let lowestChildY = 0;
  for (let measurement of childMeasurements) {
    let correctedX =
      measurement.plottable_data.centile_data.corrected_decimal_age_data.x;
    let chronologicalX =
      measurement.plottable_data.centile_data.chronological_decimal_age_data.x;
    let correctedY =
      measurement.plottable_data.centile_data.corrected_decimal_age_data.y;
    let chronologicalY =
      measurement.plottable_data.centile_data.chronological_decimal_age_data.y;
    if (correctedX < 2 / 52 && measurement.birth_data.gestation_weeks < 37) {
      chronologicalX = correctedX;
      chronologicalY = correctedY;
    }
    const arrayOfX = [chronologicalX, correctedX];
    const arrayOfY = [chronologicalY, correctedY];
    for (let coord of arrayOfX) {
      if (highestChildX === 25 || highestChildX < coord) {
        highestChildX = coord;
      }
      if (lowestChildX === -1 || lowestChildX > coord) {
        lowestChildX = coord;
      }
    }
    for (let coord of arrayOfY) {
      if (highestChildY === 500 || highestChildY < coord) {
        highestChildY = coord;
      }
      if (lowestChildY === 0 || lowestChildY > coord) {
        lowestChildY = coord;
      }
    }
  }
  return {lowestChildX, highestChildX, lowestChildY, highestChildY};
}

// truncates data sets
function truncate(rawDataSet: any[], domains: Domains) {
  const upperX = domains.x[1];
  const lowerX = domains.x[0];
  const upperY = domains.y[1];
  const lowerY = domains.y[0];
  const truncatedDataSet: any[] = [];
  for (let i = 0; i < rawDataSet.length; i++) {
    const originalCentileObject = rawDataSet[i];
    const rawData = originalCentileObject.data;
    const truncatedData = filterData(rawData, lowerX, upperX, lowerY, upperY);
    truncatedDataSet.push({
      ...originalCentileObject,
      ...{data: truncatedData},
    });
  }
  return truncatedDataSet;
}

// main function to get best domains and fetch relevant data
function getDomainsAndData(
  childMeasurements: PlottableMeasurement[],
  sex: string,
  measurementMethod: string,
  reference: string,
) {
  const {
    lowestChildX,
    highestChildX,
    lowestChildY,
    highestChildY,
  } = childMeasurementRanges(childMeasurements);
  let agePadding = 0;
  let absoluteBottomX = 0;
  if (highestChildX <= 0.03832991) {
    // prem:
    agePadding = 0.12;
    absoluteBottomX = -0.32692308;
  } else if (highestChildX <= 1) {
    //infant:
    agePadding = 0.35;
  } else if (highestChildX <= 4) {
    // small child:
    agePadding = 1.5;
  } else {
    // anyone else:
    agePadding = 5;
  }
  let finalLowestX = 0;
  let finalHighestX = 0;
  const difference = Math.abs(Math.abs(highestChildX) - Math.abs(lowestChildX));
  if (agePadding <= difference) {
    // add padding:
    finalLowestX = lowestChildX * 0.95;
    finalHighestX = highestChildX * 1.05;
  } else {
    const leftOverAgePadding = agePadding - difference;
    const candidateLowX = lowestChildX - leftOverAgePadding / 2;
    if (candidateLowX < absoluteBottomX) {
      finalLowestX = absoluteBottomX;
    } else {
      finalLowestX = candidateLowX;
    }
    const candidateHighX = highestChildX + leftOverAgePadding / 2;
    if (candidateHighX > 20) {
      finalHighestX = 20;
    } else {
      finalHighestX = candidateHighX;
    }
  }

  const relevantDataSets = getRelevantDataSets(
    sex,
    measurementMethod,
    reference,
    finalLowestX,
    finalHighestX,
  );

  let allCombinedData: any[] = [];

  // needs to be 1 big array for parsing:
  for (const element of relevantDataSets) {
    allCombinedData = allCombinedData.concat(element);
  }

  let lowestDataY = 0;
  let highestDataY = 0;

  const bottomCentileBands = allCombinedData.filter(
    (element) => element.centile === 0.4,
  );
  const topCentileBands = allCombinedData.filter(
    (element) => element.centile === 99.6,
  );

  const bottomCentileData = bottomCentileBands[0].data;
  const topCentileData = topCentileBands[0].data;

  // data not completely ordered, therefore:
  bottomCentileData.sort(
    (a: IPlottedCentileMeasurement, b: IPlottedCentileMeasurement) => a.x - b.x,
  );
  topCentileData.sort(
    (a: IPlottedCentileMeasurement, b: IPlottedCentileMeasurement) => b.x - a.x,
  );

  for (const element of bottomCentileData) {
    if (finalLowestX < element.x) {
      lowestDataY = element.y;
      break;
    }
  }
  for (const element of topCentileData) {
    if (finalHighestX > element.x) {
      highestDataY = element.y;
      break;
    }
  }

  const prePaddingLowestY =
    lowestChildY < lowestDataY ? lowestChildY : lowestDataY;

  const prePaddingHighestY =
    highestChildY > highestDataY ? highestChildY : highestDataY;

  const finalLowestY = prePaddingLowestY * 0.8;
  const finalHighestY = prePaddingHighestY * 1.2;

  const domains = {
    x: [finalLowestX, finalHighestX],
    y: [finalLowestY, finalHighestY],
  };

  let centileData = [];

  for (let referenceSet of relevantDataSets) {
    const truncated = truncate(referenceSet, domains);
    centileData.push(truncated);
  }

  return {centileData: centileData, domains: domains};
}

// main function but returns a promise
function asyncGetDomainsAndData(
  childMeasurements: PlottableMeasurement[],
  sex: string,
  measurementMethod: string,
  reference: string,
): Promise<Results> {
  return new Promise((resolve, reject) => {
    const results = getDomainsAndData(
      childMeasurements,
      sex,
      measurementMethod,
      reference,
    );
    if (results.centileData !== undefined) {
      resolve(results);
    } else {
      reject('No data generated from fetch');
    }
  });
}

export default asyncGetDomainsAndData;
