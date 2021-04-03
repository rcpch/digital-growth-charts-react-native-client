export interface ChartStyle {
  backgroundColour?: string;
  width?: number;
  height?: number;
  padding?: {left?: number; right?: number; top?: number; bottom?: number};
  titleStyle?: {
    name?: string;
    colour?: string;
    size?: number;
    weight?: 'bold' | 'italic' | 'regular';
  };
  subTitleStyle?: {
    name?: string;
    colour?: string;
    size?: number;
    weight?: 'bold' | 'italic' | 'regular';
  };
  tooltipBackgroundColour?: string;
  tooltipStroke?: string;
  tooltipTextStyle?: {
    name?: string;
    colour?: string;
    size?: number;
    weight?: 'bold' | 'italic' | 'regular';
  };
  termFill?: string;
  termStroke?: string;
  infoBoxFill?: string;
  infoBoxStroke?: string;
  infoBoxTextStyle?: {
    name?: string;
    colour?: string;
    size?: number;
    weight?: 'bold' | 'italic' | 'regular';
  };
  toggleButtonInactiveColour: string; // relates to the toggle buttons present if age correction is necessary
  toggleButtonActiveColour: string;
  toggleButtonTextColour: string;
}
export interface MeasurementStyle {
  measurementFill?: string;
  measurementSize?: number; // this is an svg size
}
export interface CentileStyle {
  centileStroke?: string;
  centileStrokeWidth?: number;
  delayedPubertyAreaFill?: string;
}

export interface GridlineStyle {
  gridlines?: boolean;
  stroke?: string;
  strokeWidth?: number;
  dashed?: boolean;
}
export interface AxisStyle {
  axisStroke?: string;
  axisLabelTextStyle?: {
    name?: string;
    colour?: string;
    size?: number;
    weight?: 'bold' | 'italic' | 'regular';
  };
  tickLabelTextStyle?: {
    name?: string;
    colour?: string;
    size?: number;
    weight?: 'bold' | 'italic' | 'regular';
  };
}
