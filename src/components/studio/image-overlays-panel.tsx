import {Rainbow, Square, Type} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
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
import {
  GradientBlock,
  Overlay,
  SolidBlock,
  TextOverlay,
} from "@/types/image-transformations";

// Constants for positioning and styling
const DEFAULT_OVERLAY_OFFSET_X = 50;
const DEFAULT_OVERLAY_OFFSET_Y = 30;
const DEFAULT_TEXT_FONT_SIZE = 24;
const DEFAULT_SOLID_DIMENSIONS = 100;
const DEFAULT_GRADIENT_WIDTH = 200;
const DEFAULT_GRADIENT_HEIGHT = 100;
const DEFAULT_SOLID_OPACITY = 100;

type OverlaysControlsProps = {
  overlays: Overlay[];
  onOverlaysChange: (overlays: Overlay[]) => void;
};

const inputStyles =
  "rounded-full px-4 h-8 focus-visible:ring-0 shadow-none border-transparent ring-1 ring-pink-500/20 dark:ring-pink-400/15 dark:bg-background/50";

const buttonStyles =
  "rounded-full h-8 bg-transparent shadow-none border-0 ring-1 ring-pink-500/20 dark:ring-pink-400/15 dark:bg-background/50 cursor-pointer";

const gradientBg = {
  backgroundImage:
    "linear-gradient(to top left, rgba(236,72,153,0.08), rgba(236,72,153,0.00))",
};

export function ImageOverlaysPanel({
  overlays,
  onOverlaysChange,
}: OverlaysControlsProps) {
  const addTextOverlay = () => {
    const newOverlay: TextOverlay = {
      type: "text",
      text: "Sample Text",
      fontSize: DEFAULT_TEXT_FONT_SIZE,
      color: "000000",
      fontFamily: "Open Sans",
      x: overlays.length * DEFAULT_OVERLAY_OFFSET_X,
      y: overlays.length * DEFAULT_OVERLAY_OFFSET_Y,
    };
    onOverlaysChange([...overlays, newOverlay]);
  };

  const addSolidOverlay = () => {
    const newOverlay: SolidBlock = {
      type: "solid",
      color: "FF0000",
      width: DEFAULT_SOLID_DIMENSIONS,
      height: DEFAULT_SOLID_DIMENSIONS,
      opacity: DEFAULT_SOLID_OPACITY,
      x: overlays.length * DEFAULT_OVERLAY_OFFSET_X,
      y: overlays.length * DEFAULT_OVERLAY_OFFSET_Y,
    };
    onOverlaysChange([...overlays, newOverlay]);
  };

  const addGradientOverlay = () => {
    const newOverlay: GradientBlock = {
      type: "gradient",
      fromColor: "FF0000",
      toColor: "0000FF",
      width: DEFAULT_GRADIENT_WIDTH,
      height: DEFAULT_GRADIENT_HEIGHT,
      x: overlays.length * DEFAULT_OVERLAY_OFFSET_X,
      y: overlays.length * DEFAULT_OVERLAY_OFFSET_Y,
    };
    onOverlaysChange([...overlays, newOverlay]);
  };

  const updateOverlay = (index: number, updates: Partial<Overlay>) => {
    // Validate index bounds
    if (index < 0 || index >= overlays.length) {
      console.warn(`Invalid overlay index: ${index}`);
      return;
    }

    // Validate numeric inputs
    const validatedUpdates = {...updates};
    if (
      "fontSize" in validatedUpdates &&
      validatedUpdates.fontSize !== undefined
    ) {
      validatedUpdates.fontSize = Math.max(
        1,
        Math.min(200, validatedUpdates.fontSize)
      );
    }
    if ("width" in validatedUpdates && validatedUpdates.width !== undefined) {
      validatedUpdates.width = Math.max(
        1,
        Math.min(2000, validatedUpdates.width)
      );
    }
    if ("height" in validatedUpdates && validatedUpdates.height !== undefined) {
      validatedUpdates.height = Math.max(
        1,
        Math.min(2000, validatedUpdates.height)
      );
    }
    if (
      "opacity" in validatedUpdates &&
      validatedUpdates.opacity !== undefined
    ) {
      validatedUpdates.opacity = Math.max(
        0,
        Math.min(100, validatedUpdates.opacity)
      );
    }

    const updated = overlays.map((overlay, i) => {
      if (i === index) {
        return {...overlay, ...validatedUpdates} as Overlay;
      }
      return overlay;
    });
    onOverlaysChange(updated);
  };

  const removeOverlay = (index: number) => {
    onOverlaysChange(overlays.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col md:overflow-y-scroll space-y-1 scrollbar-thin scrollbar-thumb-gray-300">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 mt-1">
          <Button
            onClick={addTextOverlay}
            className={buttonStyles}
            style={gradientBg}
          >
            <Type className="size-4 text-white" />
          </Button>
          <Button
            onClick={addSolidOverlay}
            className={buttonStyles}
            style={gradientBg}
          >
            <Square className="size-4 text-white" />
          </Button>
          <Button
            onClick={addGradientOverlay}
            className={buttonStyles}
            style={gradientBg}
          >
            <Rainbow className="size-4 text-white" />
          </Button>
        </div>

        {overlays.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            Add overlays to enhance your image
          </div>
        )}

        <Accordion type="multiple">
          {overlays.map((overlay, index) => (
            <AccordionItem key={index} value={`overlay-${index}`}>
              <AccordionTrigger className="py-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  {overlay.type === "text" && <Type className="size-4" />}
                  {overlay.type === "solid" && <Square className="size-4" />}
                  {overlay.type === "gradient" && (
                    <Rainbow className="size-4" />
                  )}
                  {overlay.type.charAt(0).toUpperCase() + overlay.type.slice(1)}{" "}
                  Overlay {index + 1}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 px-0.5">
                {overlay.type === "text" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Text</Label>
                      <Input
                        placeholder="Enter text"
                        value={overlay.text || ""}
                        onChange={e =>
                          updateOverlay(index, {text: e.target.value})
                        }
                        className={inputStyles}
                        style={gradientBg}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Font Size</Label>
                        <Input
                          type="number"
                          placeholder="24"
                          value={overlay.fontSize || ""}
                          onChange={e =>
                            updateOverlay(index, {
                              fontSize: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            })
                          }
                          className={inputStyles}
                          style={gradientBg}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">
                          Font Family
                        </Label>
                        <Select
                          value={overlay.fontFamily || "Open Sans"}
                          onValueChange={value =>
                            updateOverlay(index, {fontFamily: value})
                          }
                        >
                          <SelectTrigger
                            className={inputStyles}
                            style={gradientBg}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Lato">Lato</SelectItem>
                            <SelectItem value="Montserrat">
                              Montserrat
                            </SelectItem>
                            <SelectItem value="Ubuntu">Ubuntu</SelectItem>
                            <SelectItem value="Lora">Lora</SelectItem>
                            <SelectItem value="PT_Serif">PT Serif</SelectItem>
                            <SelectItem value="Crimson Text">
                              Crimson Text
                            </SelectItem>
                            <SelectItem value="Arvo">Arvo</SelectItem>
                            <SelectItem value="Vollkorn">Vollkorn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">
                          Text Color
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={`#${overlay.color || "000000"}`}
                            onChange={e =>
                              updateOverlay(index, {
                                color: e.target.value.slice(1),
                              })
                            }
                            className="w-12 h-8 rounded-full p-1 border-0"
                          />
                          <Input
                            placeholder="000000"
                            value={overlay.color || ""}
                            onChange={e =>
                              updateOverlay(index, {color: e.target.value})
                            }
                            className={inputStyles}
                            style={gradientBg}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">
                          Background
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={`#${overlay.backgroundColor || "FFFFFF"}`}
                            onChange={e =>
                              updateOverlay(index, {
                                backgroundColor: e.target.value.slice(1),
                              })
                            }
                            className="w-12 h-8 rounded-full p-1 border-0"
                          />
                          <Input
                            placeholder="FFFFFF (optional)"
                            value={overlay.backgroundColor || ""}
                            onChange={e =>
                              updateOverlay(index, {
                                backgroundColor: e.target.value,
                              })
                            }
                            className={inputStyles}
                            style={gradientBg}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Padding</Label>
                      <Input
                        placeholder="10 or 10_20_30_40"
                        value={overlay.padding || ""}
                        onChange={e =>
                          updateOverlay(index, {padding: e.target.value})
                        }
                        className={inputStyles}
                        style={gradientBg}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Typography</Label>
                      <div className="flex gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`bold-${index}`}
                            checked={overlay.bold || false}
                            onCheckedChange={checked =>
                              updateOverlay(index, {bold: !!checked})
                            }
                          />
                          <Label htmlFor={`bold-${index}`} className="text-xs">
                            Bold
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`italic-${index}`}
                            checked={overlay.italic || false}
                            onCheckedChange={checked =>
                              updateOverlay(index, {italic: !!checked})
                            }
                          />
                          <Label
                            htmlFor={`italic-${index}`}
                            className="text-xs"
                          >
                            Italic
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`strike-${index}`}
                            checked={overlay.strike || false}
                            onCheckedChange={checked =>
                              updateOverlay(index, {strike: !!checked})
                            }
                          />
                          <Label
                            htmlFor={`strike-${index}`}
                            className="text-xs"
                          >
                            Strike
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">
                          X Position
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={overlay.x || ""}
                          onChange={e =>
                            updateOverlay(index, {
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
                        <Label className="text-xs font-medium">
                          Y Position
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={overlay.y || ""}
                          onChange={e =>
                            updateOverlay(index, {
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
                  </>
                )}

                {overlay.type === "solid" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={`#${overlay.color || "FF0000"}`}
                          onChange={e =>
                            updateOverlay(index, {
                              color: e.target.value.slice(1),
                            })
                          }
                          className="w-12 h-8 rounded-full p-1 border-0"
                        />
                        <Input
                          placeholder="FF0000"
                          value={overlay.color || ""}
                          onChange={e =>
                            updateOverlay(index, {color: e.target.value})
                          }
                          className={inputStyles}
                          style={gradientBg}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Width</Label>
                        <Input
                          type="number"
                          placeholder="100"
                          value={overlay.width || ""}
                          onChange={e =>
                            updateOverlay(index, {
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
                          placeholder="100"
                          value={overlay.height || ""}
                          onChange={e =>
                            updateOverlay(index, {
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
                      <Label className="text-xs font-medium">Radius</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="10"
                          value={
                            overlay.radius === "max" ? "" : overlay.radius || ""
                          }
                          onChange={e =>
                            updateOverlay(index, {
                              radius: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            })
                          }
                          className={inputStyles}
                          style={gradientBg}
                        />
                        <Button
                          type="button"
                          onClick={() => updateOverlay(index, {radius: "max"})}
                          className={`${buttonStyles} px-3 text-white`}
                          style={gradientBg}
                        >
                          Max
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">
                          X Position
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={overlay.x || ""}
                          onChange={e =>
                            updateOverlay(index, {
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
                        <Label className="text-xs font-medium">
                          Y Position
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={overlay.y || ""}
                          onChange={e =>
                            updateOverlay(index, {
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
                  </>
                )}

                {overlay.type === "gradient" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">
                          From Color
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={`#${overlay.fromColor || "FF0000"}`}
                            onChange={e =>
                              updateOverlay(index, {
                                fromColor: e.target.value.slice(1),
                              })
                            }
                            className="w-12 h-8 rounded-full p-1 border-0"
                          />
                          <Input
                            placeholder="FF0000"
                            value={overlay.fromColor || ""}
                            onChange={e =>
                              updateOverlay(index, {fromColor: e.target.value})
                            }
                            className={inputStyles}
                            style={gradientBg}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">To Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={`#${overlay.toColor || "0000FF"}`}
                            onChange={e =>
                              updateOverlay(index, {
                                toColor: e.target.value.slice(1),
                              })
                            }
                            className="w-12 h-8 rounded-full p-1 border-0"
                          />
                          <Input
                            placeholder="0000FF"
                            value={overlay.toColor || ""}
                            onChange={e =>
                              updateOverlay(index, {toColor: e.target.value})
                            }
                            className={inputStyles}
                            style={gradientBg}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Direction</Label>
                        <Input
                          type="number"
                          placeholder="0-360 degrees"
                          value={overlay.direction || ""}
                          onChange={e =>
                            updateOverlay(index, {
                              direction: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            })
                          }
                          className={inputStyles}
                          style={gradientBg}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">
                          Stop Point
                        </Label>
                        <Input
                          placeholder="0.5 (0-1)"
                          value={overlay.stopPoint || ""}
                          onChange={e =>
                            updateOverlay(index, {
                              stopPoint: e.target.value || undefined,
                            })
                          }
                          className={inputStyles}
                          style={gradientBg}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Width</Label>
                        <Input
                          type="number"
                          placeholder="200"
                          value={overlay.width || ""}
                          onChange={e =>
                            updateOverlay(index, {
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
                          placeholder="100"
                          value={overlay.height || ""}
                          onChange={e =>
                            updateOverlay(index, {
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
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">
                          X Position
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={overlay.x || ""}
                          onChange={e =>
                            updateOverlay(index, {
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
                        <Label className="text-xs font-medium">
                          Y Position
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={overlay.y || ""}
                          onChange={e =>
                            updateOverlay(index, {
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
                  </>
                )}

                {overlay.type === "solid" && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">
                      Opacity {overlay.opacity || 100}%
                    </Label>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[overlay.opacity || 100]}
                      onValueChange={([value]) =>
                        updateOverlay(index, {opacity: value})
                      }
                      className="w-full"
                    />
                  </div>
                )}

                <Button
                  variant="destructive"
                  onClick={() => removeOverlay(index)}
                  className="w-full rounded-full"
                  size="sm"
                >
                  Remove Overlay
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {overlays.length > 0 && (
        <div className="pt-4 pb-12 px-0.5">
          <Button
            variant="outline"
            onClick={() => onOverlaysChange([])}
            className={`w-full ${buttonStyles}`}
            style={gradientBg}
          >
            Clear All Overlays
          </Button>
        </div>
      )}
    </div>
  );
}
