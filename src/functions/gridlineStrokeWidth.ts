function returnGridlineStrokeWidth(
  viewGridlines: boolean,
  gridlineStrokeWidth: number,
  tick: any,
) {
  if (!viewGridlines) {
    return 0;
  }
  let gridlineStrokeWidthValue = gridlineStrokeWidth;
  if (tick.ticks % 5 === 0) {
    gridlineStrokeWidthValue = gridlineStrokeWidth + 0.5;
  }
  return gridlineStrokeWidthValue;
}

export default returnGridlineStrokeWidth;
