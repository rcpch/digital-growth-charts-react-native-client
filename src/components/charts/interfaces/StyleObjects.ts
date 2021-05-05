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
  termFill?: string;
  termStroke?: string;
  buttonFill?: string;
  buttonTextStyle?: {
    name?: string;
    colour?: string;
    size?: number;
    weight?: 'bold' | 'italic' | 'regular';
  };
}

export interface ModalStyle {
  backgroundColour?: string;
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
    backgroundColour?: string;
  };
}
export interface MeasurementStyle {
  measurementFill?: string;
  measurementSize?: number; // this is an svg size
}
export interface CentileStyle {
  continuous?: {
    centileStroke?: string;
    centileStrokeWidth?: number;
  };
  dashed?: {
    centileStroke?: string;
    centileStrokeWidth?: number;
  };
  delayedPubertyAreaFill?: string;
  delayedPubertyStrokeWidth?: number;
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
