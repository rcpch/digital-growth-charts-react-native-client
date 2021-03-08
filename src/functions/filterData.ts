function filterData(
  data: any,
  lowerX: number,
  upperX: number,
  lowerY: number,
  upperY: number,
) {
  const filtered = data.filter(
    (d: any) =>
      d.x <= upperX && d.x >= lowerX && d.y <= upperY && d.y >= lowerY,
  );
  return filtered;
}

export default filterData;
