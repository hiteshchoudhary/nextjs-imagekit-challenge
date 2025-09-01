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
  | `object-${string}`; // e.g. object-dog, object-car

export type BasicsTransform = {
  width?: number; // w
  height?: number; // h
  aspectRatio?: string; // ar e.g. "16-9"
  cropMode?: CropMode; // c
  focus?: FocusMode; // fo
  x?: number; // for extract/custom focus
  y?: number;
  xc?: number;
  yc?: number;
  zoom?: number; // z
  dpr?: number | "auto"; // dpr
};

export type FlipMode = "h" | "v" | "h_v";

export type TextOverlay = {
  type: "text";
  text: string; // i
  fontSize?: number; // fs
  fontFamily?: string; // ff
  color?: string; // co
  backgroundColor?: string; // bg
  padding?: string; // pa shorthand
  align?: "left" | "center" | "right"; // lfo
  x?: number; // position
  y?: number;
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  rotation?: number; // rt
  flip?: FlipMode; // fl
};

export type GradientBlock = {
  type: "gradient";
  direction?: number | string; // ld
  fromColor?: string; // from
  toColor?: string; // to
  stopPoint?: number | string; // sp
  width?: number; // w
  height?: number; // h
  radius?: number; // r
  x?: number;
  y?: number;
};

export type SolidBlock = {
  type: "solid";
  color: string; // bg
  width?: number;
  height?: number;
  x?: number; // position
  y?: number;
  opacity?: number;
  radius?: number | "max";
};

export type Overlay = TextOverlay | GradientBlock | SolidBlock;

export type Enhancements = {
  blur?: number; // bl (0–100)
  sharpen?: number; // e-sharpen (0–10)
  shadow?: {
    blur?: number; // bl
    saturation?: number; // st
    offsetX?: number; // x
    offsetY?: number; // y
  };
  background?: {
    type: "solid" | "blurred" | "dominant";
    color?: string; // for solid
    blurIntensity?: number | "auto"; // for blurred
    brightness?: number; // -255 to 255
  };
};

export type AiMagic = {
  background?: {
    remove?: boolean; // e-removedotbg or e-bgremove
    mode?: "standard" | "economy";
    changePrompt?: string; // e-changebg
    generativeFill?: {
      prompt?: string;
      width?: number;
      height?: number;
      cropMode: "pad_resize" | "pad_extract";
    };
  };
  editing?: {
    prompt?: string; // e-edit
    retouch?: boolean; // e-retouch
    upscale?: boolean; // e-upscale
  };
  shadowLighting?: {
    dropShadow?: {
      azimuth?: number; // 0–360
      elevation?: number; // 0–90
      saturation?: number; // 0–100
    };
  };
  generation?: {
    textPrompt?: string; // ik-genimg
    variation?: boolean; // e-genvar
  };
  cropping?: {
    type?: "smart" | "face" | "object";
    objectName?: string; // for object aware
    zoom?: number;
    width?: number;
    height?: number;
  };
};
