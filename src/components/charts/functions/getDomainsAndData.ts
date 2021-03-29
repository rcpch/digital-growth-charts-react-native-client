import ukwhoData from '../chartData/uk_who_chart_data';
import turnerData from '../chartData/turners_chart_data';
import trisomy21Data from '../chartData/trisomy21Data';

import totalMinPadding from '../chartData/totalMinPadding';
import {xArrayForPrem} from './getXTickValuesAndLabels';

import {PlottableMeasurement} from '../interfaces/RCPCHMeasurementObject';
import {Domains} from '../interfaces/Domains';
import {Results} from '../MainChart.types';
import {
  IPlottedCentileMeasurement,
  UKWHOArray,
} from '../interfaces/CentilesObject';

function filterData(data: any, lowerX: number, upperX: number) {
  const filtered = data.filter((d: IPlottedCentileMeasurement) => {
    //centile data is to 4 decimal places, this prevents premature chopping off at either end:
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
    if (
      correctedX < 0.038329911019849415 &&
      measurement.birth_data.gestation_weeks < 37
    ) {
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

// main function to get best domains, fetch relevant data. If domains specified in parameters, will just fetch new relevant data
function getDomainsAndData(
  childMeasurements: PlottableMeasurement[],
  sex: string,
  measurementMethod: string,
  reference: string,
  domains: Domains | null = null,
) {
  let internalDomains: Domains;
  let finalCentileData: any[] = [];

  if (domains === null) {
    const {
      lowestChildX,
      highestChildX,
      lowestChildY,
      highestChildY,
    } = childMeasurementRanges(childMeasurements);
    let oneSidedAgePadding: number;
    const absoluteBottomX = -0.32580424366872;
    if (highestChildX <= 0.038329911019849415) {
      // prem:
      oneSidedAgePadding = totalMinPadding.prem / 2;
    } else if (highestChildX <= 1) {
      //infant:
      oneSidedAgePadding = totalMinPadding.infant / 2;
    } else if (highestChildX <= 4) {
      // small child:
      oneSidedAgePadding = totalMinPadding.smallChild / 2;
    } else {
      // anyone else:
      oneSidedAgePadding = totalMinPadding.biggerChild / 2;
    }
    let unroundedLowestX = 0;
    let unroundedHighestX = 0;
    const difference = highestChildX - lowestChildX;
    if (oneSidedAgePadding <= difference / 2) {
      // add padding:
      unroundedLowestX = lowestChildX * 0.98;
      unroundedHighestX = highestChildX * 1.02;
    } else {
      const leftOverAgePadding = oneSidedAgePadding - difference;
      let addToHighest = 0;
      const candidateLowX = lowestChildX - leftOverAgePadding / 2;
      if (candidateLowX < absoluteBottomX) {
        unroundedLowestX = absoluteBottomX;
        addToHighest = absoluteBottomX - candidateLowX;
      } else {
        unroundedLowestX = candidateLowX;
      }
      const candidateHighX = highestChildX + leftOverAgePadding / 2;
      if (candidateHighX > 20) {
        unroundedHighestX = 20;
        unroundedLowestX = unroundedLowestX - (candidateHighX - 20);
      } else {
        unroundedHighestX = candidateHighX + addToHighest;
      }
    }

    let lowestXForDomain = unroundedLowestX;

    if (lowestXForDomain !== absoluteBottomX) {
      let arrayForOrdering = xArrayForPrem.map((element: number) => element);
      arrayForOrdering.push(unroundedLowestX);
      arrayForOrdering.sort((a, b) => a - b);
      const lowestXIndex = arrayForOrdering.findIndex(
        (element: number) => element === unroundedLowestX,
      );
      lowestXForDomain = arrayForOrdering[lowestXIndex - 1];
    }

    let highestXForDomain = unroundedHighestX;

    if (highestXForDomain !== 20) {
      let arrayForOrdering = xArrayForPrem.map((element: number) => element);
      arrayForOrdering.push(unroundedHighestX);
      arrayForOrdering.sort((a, b) => a - b);
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

    // this centile data is to be used to find min value at min x and max value at max x
    let allCombinedData: any[] = [];

    // needs to be 1 big array for parsing:
    for (const element of finalCentileData) {
      allCombinedData = allCombinedData.concat(element);
    }

    // get 0.4th only for bottom:
    const bottomCentileBands = allCombinedData.filter(
      (element) => element.centile === 0.4,
    );

    // get 99.6th only for top:
    const topCentileBands = allCombinedData.filter(
      (element) => element.centile === 99.6,
    );

    // if spans more than one data set, concat to one array:
    let bottomCentileData: any[] = [];
    if (bottomCentileBands.length > 1) {
      for (let element of bottomCentileBands) {
        bottomCentileData = bottomCentileData.concat(element.data);
      }
    } else {
      bottomCentileData = bottomCentileBands[0].data;
    }
    // if spans more than one data set, concat to one array:
    let topCentileData: any[] = [];
    if (topCentileBands.length > 1) {
      for (let element of topCentileBands) {
        topCentileData = topCentileData.concat(element.data);
      }
    } else {
      topCentileData = topCentileBands[0].data;
    }

    //find lowest and highest values for y in the centile data set:
    let lowestDataY = 500;
    let highestDataY = -500;

    for (const element of bottomCentileData) {
      if (lowestDataY > element.y) {
        lowestDataY = element.y;
      }
    }
    for (const element of topCentileData) {
      if (highestDataY < element.y) {
        highestDataY = element.y;
      }
    }
    // decide if measurement or centile band highest and lowest y:
    const prePaddingLowestY =
      lowestChildY < lowestDataY ? lowestChildY : lowestDataY;

    const prePaddingHighestY =
      highestChildY > highestDataY ? highestChildY : highestDataY;

    // to give a bit of space in vertical axis:
    const finalLowestY =
      prePaddingLowestY - (prePaddingHighestY - prePaddingLowestY) * 0.2;
    const finalHighestY =
      prePaddingHighestY + (prePaddingHighestY - prePaddingLowestY) * 0.05;

    internalDomains = {
      x: [lowestXForDomain, highestXForDomain],
      y: [finalLowestY, finalHighestY],
    };
  } else {
    internalDomains = domains;
    const relevantDataSets = getRelevantDataSets(
      sex,
      measurementMethod,
      reference,
      internalDomains.x[0],
      internalDomains.x[1],
    );

    for (let referenceSet of relevantDataSets) {
      const truncated = truncate(
        referenceSet,
        internalDomains.x[0],
        internalDomains.x[1],
      );
      finalCentileData.push(truncated);
    }
  }

  return {centileData: finalCentileData, domains: internalDomains};
}

// main function but returns a promise
function asyncGetDomainsAndData(
  childMeasurements: PlottableMeasurement[],
  sex: string,
  measurementMethod: string,
  reference: string,
  domains: Domains | null = null,
): Promise<Results> {
  return new Promise((resolve, reject) => {
    const results = getDomainsAndData(
      childMeasurements,
      sex,
      measurementMethod,
      reference,
      domains,
    );
    if (results.centileData !== undefined) {
      resolve(results);
    } else {
      reject('No data generated from fetch');
    }
  });
}

export default asyncGetDomainsAndData;

const a = [
  [
    {
      centile: 0.4,
      data: [
        {l: 0.4, x: -0.0958, y: 1.3613},
        {l: 0.4, x: -0.0767, y: 1.5552},
        {l: 0.4, x: -0.0575, y: 1.7623},
        {l: 0.4, x: -0.0383, y: 1.9763},
        {l: 0.4, x: -0.0192, y: 2.1849},
        {l: 0.4, x: 0, y: 2.3714},
        {l: 0.4, x: 0.0192, y: 2.5265},
        {l: 0.4, x: 0.0383, y: 2.6639},
      ],
      sds: -2.67,
    },
    {
      centile: 2,
      data: [
        {l: 2, x: -0.0958, y: 1.5977},
        {l: 2, x: -0.0767, y: 1.7987},
        {l: 2, x: -0.0575, y: 2.0094},
        {l: 2, x: -0.0383, y: 2.2235},
        {l: 2, x: -0.0192, y: 2.4303},
        {l: 2, x: 0, y: 2.6141},
        {l: 2, x: 0.0192, y: 2.7655},
        {l: 2, x: 0.0383, y: 2.8985},
      ],
      sds: -2,
    },
    {
      centile: 9,
      data: [
        {l: 9, x: -0.0958, y: 1.8435},
        {l: 9, x: -0.0767, y: 2.0528},
        {l: 9, x: -0.0575, y: 2.2677},
        {l: 9, x: -0.0383, y: 2.4822},
        {l: 9, x: -0.0192, y: 2.6874},
        {l: 9, x: 0, y: 2.8686},
        {l: 9, x: 0.0192, y: 3.0163},
        {l: 9, x: 0.0383, y: 3.145},
      ],
      sds: -1.33,
    },
    {
      centile: 25,
      data: [
        {l: 25, x: -0.0958, y: 2.098},
        {l: 25, x: -0.0767, y: 2.3168},
        {l: 25, x: -0.0575, y: 2.5368},
        {l: 25, x: -0.0383, y: 2.7522},
        {l: 25, x: -0.0192, y: 2.9561},
        {l: 25, x: 0, y: 3.1349},
        {l: 25, x: 0.0192, y: 3.2791},
        {l: 25, x: 0.0383, y: 3.4035},
      ],
      sds: -0.67,
    },
    {
      centile: 50,
      data: [
        {l: 50, x: -0.0958, y: 2.3607},
        {l: 50, x: -0.0767, y: 2.5903},
        {l: 50, x: -0.0575, y: 2.8164},
        {l: 50, x: -0.0383, y: 3.0334},
        {l: 50, x: -0.0192, y: 3.2362},
        {l: 50, x: 0, y: 3.413},
        {l: 50, x: 0.0192, y: 3.5539},
        {l: 50, x: 0.0383, y: 3.6743},
      ],
      sds: 0,
    },
    {
      centile: 75,
      data: [
        {l: 75, x: -0.0958, y: 2.6311},
        {l: 75, x: -0.0767, y: 2.8729},
        {l: 75, x: -0.0575, y: 3.1062},
        {l: 75, x: -0.0383, y: 3.3254},
        {l: 75, x: -0.0192, y: 3.5277},
        {l: 75, x: 0, y: 3.7029},
        {l: 75, x: 0.0192, y: 3.8409},
        {l: 75, x: 0.0383, y: 3.9575},
      ],
      sds: 0.67,
    },
    {
      centile: 91,
      data: [
        {l: 91, x: -0.0958, y: 2.9088},
        {l: 91, x: -0.0767, y: 3.1643},
        {l: 91, x: -0.0575, y: 3.4058},
        {l: 91, x: -0.0383, y: 3.6282},
        {l: 91, x: -0.0192, y: 3.8305},
        {l: 91, x: 0, y: 4.0045},
        {l: 91, x: 0.0192, y: 4.1401},
        {l: 91, x: 0.0383, y: 4.2534},
      ],
      sds: 1.33,
    },
    {
      centile: 98,
      data: [
        {l: 98, x: -0.0958, y: 3.1935},
        {l: 98, x: -0.0767, y: 3.4642},
        {l: 98, x: -0.0575, y: 3.7151},
        {l: 98, x: -0.0383, y: 3.9414},
        {l: 98, x: -0.0192, y: 4.1444},
        {l: 98, x: 0, y: 4.318},
        {l: 98, x: 0.0192, y: 4.4516},
        {l: 98, x: 0.0383, y: 4.5621},
      ],
      sds: 2,
    },
    {
      centile: 99.6,
      data: [
        {l: 99.6, x: -0.0958, y: 3.4848},
        {l: 99.6, x: -0.0767, y: 3.7721},
        {l: 99.6, x: -0.0575, y: 4.0337},
        {l: 99.6, x: -0.0383, y: 4.265},
        {l: 99.6, x: -0.0192, y: 4.4694},
        {l: 99.6, x: 0, y: 4.6432},
        {l: 99.6, x: 0.0192, y: 4.7755},
        {l: 99.6, x: 0.0383, y: 4.8837},
      ],
      sds: 2.67,
    },
  ],
  [
    {
      centile: 0.4,
      data: [
        {l: 0.4, x: 0.0383, y: 2.3919},
        {l: 0.4, x: 0.0575, y: 2.5968},
      ],
      sds: -2.67,
    },
    {
      centile: 2,
      data: [
        {l: 2, x: 0.0383, y: 2.653},
        {l: 2, x: 0.0575, y: 2.8711},
      ],
      sds: -2,
    },
    {
      centile: 9,
      data: [
        {l: 9, x: 0.0383, y: 2.9354},
        {l: 9, x: 0.0575, y: 3.168},
      ],
      sds: -1.33,
    },
    {
      centile: 25,
      data: [
        {l: 25, x: 0.0383, y: 3.2404},
        {l: 25, x: 0.0575, y: 3.4889},
      ],
      sds: -0.67,
    },
    {
      centile: 50,
      data: [
        {l: 50, x: 0.0383, y: 3.5693},
        {l: 50, x: 0.0575, y: 3.8352},
      ],
      sds: 0,
    },
    {
      centile: 75,
      data: [
        {l: 75, x: 0.0383, y: 3.9233},
        {l: 75, x: 0.0575, y: 4.2084},
      ],
      sds: 0.67,
    },
    {
      centile: 91,
      data: [
        {l: 91, x: 0.0383, y: 4.3037},
        {l: 91, x: 0.0575, y: 4.61},
      ],
      sds: 1.33,
    },
    {
      centile: 98,
      data: [
        {l: 98, x: 0.0383, y: 4.7118},
        {l: 98, x: 0.0575, y: 5.0415},
      ],
      sds: 2,
    },
    {
      centile: 99.6,
      data: [
        {l: 99.6, x: 0.0383, y: 5.1491},
        {l: 99.6, x: 0.0575, y: 5.5047},
      ],
      sds: 2.67,
    },
  ],
];
