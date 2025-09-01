import {Crop, Focus, Grid3X3} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Slider} from "@/components/ui/slider";
import {CropMode, FocusMode} from "@/types/image-transformations";

type BasicsTransform = {
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

type BasicsControlsProps = {
  transforms: BasicsTransform;
  onTransformChange: (transforms: BasicsTransform) => void;
};

const aspectRatios = [
  {label: "Custom", value: "custom"},
  {label: "1:1 (Square)", value: "1-1"},
  {label: "16:9 (Wide)", value: "16-9"},
  {label: "9:16 (Portrait)", value: "9-16"},
  {label: "4:3 (Standard)", value: "4-3"},
  {label: "3:2 (Photo)", value: "3-2"},
  {label: "21:9 (Ultra Wide)", value: "21-9"},
];

const cropModes = [
  {label: "Maintain Ratio", value: "maintain_ratio"},
  {label: "Pad & Resize", value: "pad_resize"},
  {label: "Force", value: "force"},
  {label: "At Max", value: "at_max"},
  {label: "At Least", value: "at_least"},
  {label: "Extract", value: "extract"},
];

const focusModes = [
  {label: "Center", value: "center"},
  {label: "Top", value: "top"},
  {label: "Bottom", value: "bottom"},
  {label: "Left", value: "left"},
  {label: "Right", value: "right"},
  {label: "Top Left", value: "top_left"},
  {label: "Top Right", value: "top_right"},
  {label: "Bottom Left", value: "bottom_left"},
  {label: "Bottom Right", value: "bottom_right"},
  {label: "Auto", value: "auto"},
  {label: "Face", value: "face"},
  {label: "Custom", value: "custom"},
];

const inputStyles =
  "rounded-full px-4 h-8 focus-visible:ring-0 shadow-none border-transparent ring-1 ring-pink-500/20 dark:ring-pink-400/15 dark:bg-background/50";

const buttonStyles =
  "rounded-full h-8 bg-transparent shadow-none border-0 ring-1 ring-pink-500/20 dark:ring-pink-400/15 dark:bg-background/50 cursor-pointer";

const gradientBg = {
  backgroundImage:
    "linear-gradient(to top left, rgba(236,72,153,0.08), rgba(236,72,153,0.00))",
};

export function ImageBasicsPanel({
  transforms,
  onTransformChange,
}: BasicsControlsProps) {
  const update = (patch: Partial<BasicsTransform>) => {
    onTransformChange({...transforms, ...patch});
  };

  const resetDimensions = () => {
    update({width: undefined, height: undefined, aspectRatio: undefined});
  };

  const resetCrop = () => {
    update({
      cropMode: undefined,
      focus: undefined,
      x: undefined,
      y: undefined,
      xc: undefined,
      yc: undefined,
    });
  };

  const resetFocus = () => {
    update({
      focus: undefined,
      zoom: undefined,
      x: undefined,
      y: undefined,
      xc: undefined,
      yc: undefined,
    });
  };

  const resetAll = () => {
    onTransformChange({
      width: undefined,
      height: undefined,
      aspectRatio: undefined,
      cropMode: undefined,
      focus: undefined,
      x: undefined,
      y: undefined,
      xc: undefined,
      yc: undefined,
      zoom: undefined,
      dpr: undefined,
    });
  };

  return (
    <div className="h-full flex flex-col  space-y-1 scrollbar-thin scrollbar-thumb-gray-300">
      <div>
        <Accordion type="multiple">
          <AccordionItem value="resize-crop">
            <AccordionTrigger className="py-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <Crop className="size-4" />
                Resize & Crop
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 px-0.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Width</Label>
                  <Input
                    type="number"
                    placeholder="Auto"
                    value={transforms.width || ""}
                    onChange={e =>
                      update({
                        width: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    className={inputStyles}
                    style={gradientBg}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Height</Label>
                  <Input
                    type="number"
                    placeholder="Auto"
                    value={transforms.height || ""}
                    onChange={e =>
                      update({
                        height: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    className={inputStyles}
                    style={gradientBg}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Aspect Ratio</Label>
                <Select
                  value={transforms.aspectRatio || "custom"}
                  onValueChange={value =>
                    update({
                      aspectRatio: value === "custom" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger className={inputStyles} style={gradientBg}>
                    <SelectValue placeholder="Select ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatios.map(ratio => (
                      <SelectItem key={ratio.value} value={ratio.value}>
                        {ratio.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Crop Mode</Label>
                <Select
                  value={transforms.cropMode || "maintain_ratio"}
                  onValueChange={value =>
                    update({
                      cropMode:
                        value === "maintain_ratio"
                          ? undefined
                          : (value as CropMode),
                    })
                  }
                >
                  <SelectTrigger className={inputStyles} style={gradientBg}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cropModes.map(mode => (
                      <SelectItem key={mode.value} value={mode.value}>
                        {mode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                onClick={resetDimensions}
                className="w-full rounded-full"
              >
                Reset Dimensions
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="focus-zoom">
            <AccordionTrigger className="py-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <Focus className="size-4" />
                Focus & Zoom
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 px-0.5">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Focus Point</Label>
                <Select
                  value={transforms.focus || "center"}
                  onValueChange={value =>
                    update({
                      focus:
                        value === "center" ? undefined : (value as FocusMode),
                    })
                  }
                >
                  <SelectTrigger className={inputStyles} style={gradientBg}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {focusModes.map(mode => (
                      <SelectItem key={mode.value} value={mode.value}>
                        {mode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {transforms.focus === "custom" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">X Position</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={transforms.x || ""}
                      onChange={e =>
                        update({
                          x: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      className={inputStyles}
                      style={gradientBg}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Y Position</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={transforms.y || ""}
                      onChange={e =>
                        update({
                          y: e.target.value
                            ? parseInt(e.target.value)
                            : undefined,
                        })
                      }
                      className={inputStyles}
                      style={gradientBg}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-medium">
                  Zoom{" "}
                  {transforms.zoom ? `${transforms.zoom.toFixed(1)}x` : "1.0x"}
                </Label>
                <Slider
                  min={0.1}
                  max={5.0}
                  step={0.1}
                  value={[transforms.zoom || 1]}
                  onValueChange={([value]) =>
                    update({zoom: value === 1 ? undefined : value})
                  }
                  className="w-full"
                />
              </div>

              <Button
                variant="ghost"
                onClick={resetFocus}
                className="w-full rounded-full"
              >
                Reset Focus & Zoom
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="pixel-ratio">
            <AccordionTrigger className="py-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <Grid3X3 className="size-4" />
                Pixel Ratio
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 px-0.5">
              <div className="space-y-2">
                <Label className="text-xs font-medium">
                  Device Pixel Ratio
                </Label>
                <Select
                  value={transforms.dpr?.toString() || "1"}
                  onValueChange={value =>
                    update({
                      dpr:
                        value === "1"
                          ? undefined
                          : value === "auto"
                            ? "auto"
                            : parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className={inputStyles} style={gradientBg}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="1">1x (Standard)</SelectItem>
                    <SelectItem value="2">2x (Retina)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-xs text-muted-foreground py-2 bg-transparent rounded">
                Higher pixel ratios create sharper images on high-DPI displays
                but increase file size.
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="pt-4 pb-12 px-0.5">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={resetAll}
            className={`flex-1 ${buttonStyles}`}
            style={gradientBg}
          >
            Reset All
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              update({aspectRatio: "1-1", cropMode: "maintain_ratio"})
            }
            className={`flex-1 ${buttonStyles}`}
            style={gradientBg}
          >
            Square
          </Button>
        </div>
      </div>
    </div>
  );
}
