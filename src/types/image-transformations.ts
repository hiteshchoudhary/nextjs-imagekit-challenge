export type CropMode =
  | "maintain_ratio"
  | "pad_resize"
  | "force"
  | "at_max"
  | "at_max_enlarge"
  | "at_least"
  | "extract"
  | "pad_extract";

export type FocusMode =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top_left"
  | "top_right"
  | "bottom_left"
  | "bottom_right"
  | "auto"
  | "face"
  | "custom"
  | `object-${string}`;

export type BasicsTransform = {
  width?: number;
  height?: number;
  aspectRatio?: string;
  cropMode?: CropMode;
  focus?: FocusMode;
  x?: number;
  y?: number;
  xc?: number;
  yc?: number;
  zoom?: number;
  dpr?: number | "auto";
};

export type FlipMode = "h" | "v" | "h_v";

export type ImageOverlay = {
  type: "image";
  src: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  opacity?: number;
  bgColor?: string;
  border?: string;
  radius?: number | "max";
  rotation?: number;
  flip?: FlipMode;
};

export type TextOverlay = {
  type: "text";
  text: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  padding?: string;
  align?: "left" | "center" | "right";
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  rotation?: number;
  flip?: FlipMode;
};

export type GradientBlock = {
  type: "gradient";
  direction?: number | string;
  fromColor?: string;
  toColor?: string;
  stopPoint?: number | string;
  width?: number;
  height?: number;
  radius?: number;
};

export type SolidBlock = {
  type: "solid";
  color: string;
  width?: number;
  height?: number;
  opacity?: number;
  radius?: number;
};

export type Overlay = ImageOverlay | TextOverlay | GradientBlock | SolidBlock;

export type Enhancements = {
  blur?: number;
  sharpen?: number;
  shadow?: {
    blur?: number;
    saturation?: number;
    offsetX?: number;
    offsetY?: number;
  };
  background?: {
    type: "solid" | "blurred" | "dominant";
    color?: string;
    blurIntensity?: number | "auto";
    brightness?: number;
  };
};

export type AiMagic = {
  background?: {
    remove?: boolean;
    mode?: "standard" | "economy";
    changePrompt?: string; 
    generativeFill?: {
      prompt?: string;
      width?: number;
      height?: number;
      cropMode: "pad_resize" | "pad_extract";
    };
  };
  editing?: {
    prompt?: string;
    retouch?: boolean;
    upscale?: boolean;
  };
  shadowLighting?: {
    dropShadow?: {
      azimuth?: number;
      elevation?: number;
      saturation?: number;
    };
  };
  generation?: {
    textPrompt?: string;
    variation?: boolean;
  };
  cropping?: {
    type?: "smart" | "face" | "object";
    objectName?: string;
    zoom?: number;
    width?: number;
    height?: number;
  };
};
