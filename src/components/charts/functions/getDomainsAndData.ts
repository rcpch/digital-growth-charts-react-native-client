import ukwhoData from '../chartData/uk_who_chart_data';
import turnerData from '../chartData/turners_chart_data';
import trisomy21Data from '../chartData/trisomy21Data';

import totalMinPadding from '../chartData/totalMinPadding';
import {allXTickValues} from './tailoredXTickValues';

import {PlottableMeasurement} from '../interfaces/RCPCHMeasurementObject';
import {Domains} from '../interfaces/Domains';
import {Results} from '../MainChart.types';
import {
  IPlottedCentileMeasurement,
  UKWHOArray,
} from '../interfaces/CentilesObject';

function filterData(data: any, lowerX: number, upperX: number) {
  const filtered = data.filter((d: IPlottedCentileMeasurement) => {
    //as centile data is to 4 decimal places, this prevents premature chopping off at either end:
    const upperXTo4 = Number(upperX.toFixed(4));
    const lowerXTo4 = Number(lowerX.toFixed(4));
    if (d.x <= upperXTo4 && d.x >= lowerXTo4) {
      return true;
    } else {
      return false;
    }
  });
  return filtered;
}

// gets relevant data sets:
function getRelevantDataSets(
  sex: 'male' | 'female',
  measurementMethod: 'height' | 'weight' | 'bmi' | 'ofc',
  reference: 'uk-who' | 'trisomy-21' | 'turner',
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
function childMeasurementRanges(
  childMeasurements: PlottableMeasurement[],
  showCorrected: boolean,
  showChronological: boolean,
) {
  let highestChildX = -500;
  let lowestChildX = 500;
  let highestChildY = -500;
  let lowestChildY = 500;
  for (let measurement of childMeasurements) {
    if (!measurement.plottable_data) {
      throw new Error(
        'No plottable data found. Are you using the correct server version?',
      );
    }
    let correctedX =
      measurement.plottable_data.centile_data.corrected_decimal_age_data.x;
    let chronologicalX =
      measurement.plottable_data.centile_data.chronological_decimal_age_data.x;
    let correctedY =
      measurement.plottable_data.centile_data.corrected_decimal_age_data.y;
    let chronologicalY =
      measurement.plottable_data.centile_data.chronological_decimal_age_data.y;
    if (showCorrected && !showChronological) {
      chronologicalX = correctedX;
      chronologicalY = correctedY;
    } else if (showChronological && !showCorrected) {
      correctedX = chronologicalX;
      correctedY = chronologicalY;
    }
    const arrayOfX = [chronologicalX, correctedX];
    const arrayOfY = [chronologicalY, correctedY];
    for (let coord of arrayOfX) {
      if (highestChildX < coord) {
        highestChildX = coord;
      }
      if (lowestChildX > coord) {
        lowestChildX = coord;
      }
    }
    for (let coord of arrayOfY) {
      if (highestChildY < coord) {
        highestChildY = coord;
      }
      if (lowestChildY > coord) {
        lowestChildY = coord;
      }
    }
  }
  return {lowestChildX, highestChildX, lowestChildY, highestChildY};
}

// truncates data sets
function truncate(rawDataSet: any[], lowerX: number, upperX: number) {
  const truncatedDataSet: any[] = [];
  for (let i = 0; i < rawDataSet.length; i++) {
    const originalCentileObject = rawDataSet[i];
    const rawData = originalCentileObject.data;
    const truncatedData = filterData(rawData, lowerX, upperX);
    truncatedDataSet.push({
      ...originalCentileObject,
      ...{data: truncatedData},
    });
  }
  return truncatedDataSet;
}

// main function to get best domains, fetch relevant data.
function getDomainsAndData(
  childMeasurements: PlottableMeasurement[],
  sex: 'male' | 'female',
  measurementMethod: 'height' | 'weight' | 'bmi' | 'ofc',
  reference: 'uk-who' | 'trisomy-21' | 'turner',
  showCorrected: boolean,
  showChronological: boolean,
) {
  let internalDomains: Domains;
  let finalCentileData: any[] = [];
  let internalChartScaleType: 'prem' | 'infant' | 'smallChild' | 'biggerChild';
  let pointsForCentileLabels: any[] = [];

  const {
    lowestChildX,
    highestChildX,
    lowestChildY,
    highestChildY,
  } = childMeasurementRanges(
    childMeasurements,
    showCorrected,
    showChronological,
  );
  let agePadding: number;
  let absoluteBottomX = -0.057494866529774126; // 37 weeks
  let absoluteHighX = 20;

  //this needs additions for down's

  if (measurementMethod === 'ofc') {
    if (sex === 'female') {
      absoluteHighX = 17;
    } else {
      absoluteHighX = 18;
    }
  }
  const difference = highestChildX - lowestChildX;

  if (
    lowestChildX < -0.057494866529774126 && // 37 weeks
    highestChildX <= 0.038329911019849415 // 42 weeks or 2 weeks postnatal
  ) {
    // prem:
    absoluteBottomX = -0.32580424366872; // 23 weeks
    if (difference > totalMinPadding.prem) {
      agePadding = totalMinPadding.infant;
      internalChartScaleType = 'infant';
    } else {
      internalChartScaleType = 'prem';
      agePadding = totalMinPadding.prem;
    }
  } else if (highestChildX <= 1) {
    //infant:
    if (difference > totalMinPadding.infant) {
      agePadding = totalMinPadding.smallChild;
      internalChartScaleType = 'smallChild';
    } else {
      agePadding = totalMinPadding.infant;
      internalChartScaleType = 'infant';
    }
  } else if (highestChildX <= 4) {
    // small child:
    if (difference > totalMinPadding.smallChild) {
      agePadding = totalMinPadding.biggerChild;
      internalChartScaleType = 'biggerChild';
    }
    internalChartScaleType = 'smallChild';
    agePadding = totalMinPadding.smallChild;
  } else {
    // anyone else:
    internalChartScaleType = 'biggerChild';
    agePadding = totalMinPadding.biggerChild;
  }
  let unroundedLowestX = 0;
  let unroundedHighestX = 0;
  if (agePadding <= difference) {
    // add padding:
    unroundedLowestX = lowestChildX * 0.98;
    unroundedHighestX = highestChildX * 1.02;
  } else {
    const leftOverAgePadding = agePadding - difference;
    let addToHighest = 0;
    const candidateLowX = lowestChildX - leftOverAgePadding / 2;
    if (candidateLowX < absoluteBottomX) {
      unroundedLowestX = absoluteBottomX;
      addToHighest = absoluteBottomX - candidateLowX;
    } else {
      unroundedLowestX = candidateLowX;
    }

    const candidateHighX = highestChildX + leftOverAgePadding / 2;
    if (candidateHighX > absoluteHighX) {
      unroundedHighestX = absoluteHighX;
      unroundedLowestX = unroundedLowestX - (candidateHighX - absoluteHighX);
    } else {
      unroundedHighestX = candidateHighX + addToHighest;
    }
  }

  let lowestXForDomain = unroundedLowestX;

  if (lowestXForDomain !== absoluteBottomX) {
    let arrayForOrdering = allXTickValues.map((element: number) => element);
    arrayForOrdering.push(unroundedLowestX);
    arrayForOrdering.sort((a: number, b: number) => a - b);
    const lowestXIndex = arrayForOrdering.findIndex(
      (element: number) => element === unroundedLowestX,
    );
    lowestXForDomain = arrayForOrdering[lowestXIndex - 1];
  }

  let highestXForDomain = unroundedHighestX;

  if (highestXForDomain !== absoluteHighX) {
    let arrayForOrdering = allXTickValues.map((element: number) => element);
    arrayForOrdering.push(unroundedHighestX);
    arrayForOrdering.sort((a: number, b: number) => a - b);
    const highestXIndex = arrayForOrdering.findIndex(
      (element: number) => element === unroundedHighestX,
    );
    highestXForDomain = arrayForOrdering[highestXIndex + 1];
  }

  const relevantDataSets = getRelevantDataSets(
    sex,
    measurementMethod,
    reference,
    lowestXForDomain,
    highestXForDomain,
  );

  //get final centile data set for centile line render:
  for (let referenceSet of relevantDataSets) {
    const truncated = truncate(
      referenceSet,
      lowestXForDomain,
      highestXForDomain,
    );
    finalCentileData.push(truncated);
  }

  // this centile data is to be used to find min / max data points for domain setting / labels:
  let allCombinedData: any[] = [];

  // needs to be 1 big array for finding data points::
  for (const element of finalCentileData) {
    allCombinedData = allCombinedData.concat(element);
  }

  function findDataPoints(
    pointsToGet: 'lowest' | 'highest' | 'allHighest' | 'allLowest',
  ) {
    const returningArray: any[] = [];
    let centileLabels = [0.4, 2, 9, 25, 50, 75, 91, 98, 99.6];
    if (pointsToGet === 'lowest') {
      centileLabels = [0.4];
    } else if (pointsToGet === 'highest') {
      centileLabels = [99.6];
    }
    for (let centileNumber of centileLabels) {
      const centileBands = allCombinedData.filter(
        (element) => element.centile === centileNumber,
      );
      let centileData: any[] = [];
      if (centileBands.length > 1) {
        for (let element of centileBands) {
          centileData = centileData.concat(element.data);
        }
      } else {
        centileData = centileBands[0].data;
      }
      let yPoint =
        pointsToGet === 'lowest' || pointsToGet === 'allLowest' ? 500 : -500;
      let xPoint =
        pointsToGet === 'lowest' || pointsToGet === 'allLowest' ? 500 : -500;
      for (let element of centileData) {
        if (pointsToGet === 'lowest' && yPoint > element.y) {
          yPoint = element.y;
        }
        if (pointsToGet === 'allLowest' && xPoint > element.x) {
          yPoint = element.y;
          xPoint = element.x;
        }
        if (pointsToGet === 'highest' && yPoint < element.y) {
          yPoint = element.y;
        }
        if (pointsToGet === 'allHighest' && xPoint < element.x) {
          yPoint = element.y;
          xPoint = element.x;
        }
      }
      returningArray.push({y: yPoint, centile: centileNumber});
    }
    return returningArray;
  }

  const [lowestData] = findDataPoints('lowest');
  const [highestData] = findDataPoints('highest');

  // decide if measurement or centile band highest and lowest y:
  const prePaddingLowestY =
    lowestChildY < lowestData.y ? lowestChildY : lowestData.y;

  const prePaddingHighestY =
    highestChildY > highestData.y ? highestChildY : highestData.y;

  // to give a bit of space in vertical axis:
  const finalLowestY =
    prePaddingLowestY - (prePaddingHighestY - prePaddingLowestY) * 0.05;
  const finalHighestY =
    prePaddingHighestY + (prePaddingHighestY - prePaddingLowestY) * 0.05;

  internalDomains = {
    x: [lowestXForDomain, highestXForDomain],
    y: [finalLowestY, finalHighestY],
  };

  pointsForCentileLabels = findDataPoints('allHighest');
  if (internalChartScaleType === 'prem') {
    pointsForCentileLabels = findDataPoints('allLowest');
  }

  for (let element of pointsForCentileLabels) {
    element.x =
      internalChartScaleType === 'prem' ? lowestXForDomain : highestXForDomain;
  }

  return {
    centileData: finalCentileData,
    domains: internalDomains,
    chartScaleType: internalChartScaleType,
    pointsForCentileLabels: pointsForCentileLabels,
  };
}

// main function but returns a promise
function asyncGetDomainsAndData(
  childMeasurements: PlottableMeasurement[],
  sex: 'male' | 'female',
  measurementMethod: 'height' | 'weight' | 'bmi' | 'ofc',
  reference: 'uk-who' | 'trisomy-21' | 'turner',
  showCorrected: boolean,
  showChronological: boolean,
): Promise<Results> {
  return new Promise((resolve, reject) => {
    const results = getDomainsAndData(
      childMeasurements,
      sex,
      measurementMethod,
      reference,
      showCorrected,
      showChronological,
    );
    if (results.centileData !== undefined) {
      resolve(results);
    } else {
      reject('No data generated from fetch');
    }
  });
}

export const delayedPubertyData = {
  male: ukwhoData.uk90_child.male.height[0].data,
  female: ukwhoData.uk90_child.female.height[0].data,
};

export default asyncGetDomainsAndData;
