import {
  Scissors,
  Sparkles,
  SquarePen,
  Sun,
  Target,
  Trash2,
  WandSparkles,
} from "lucide-react";

import {Switch} from "@/components/ui/switch";
import {Textarea} from "@/components/ui/textarea";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {Label} from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {Slider} from "../ui/slider";

const inputStyles =
  "rounded-full px-4 h-8 focus-visible:ring-0 shadow-none border-transparent ring-1 ring-pink-500/20 dark:ring-pink-400/15 dark:bg-background/50";

const buttonStyles =
  "rounded-full h-8 bg-transparent shadow-none border-0 ring-1 ring-pink-500/20 dark:ring-pink-400/15 dark:bg-background/50 cursor-pointer";

const gradientBg = {
  backgroundImage:
    "linear-gradient(to top left, rgba(236,72,153,0.08), rgba(236,72,153,0.00))",
};

const bgRemoveOptions = [
  {label: "Standard (High Quality)", value: "standard"},
  {label: "Economy (Faster)", value: "economy"},
];

const cropModes = [
  {label: "Pad & Resize", value: "pad_resize"},
  {label: "Pad & Extract", value: "pad_extract"},
];

const aiCroppingOptions = [
  {label: "None", value: "none"},
  {label: "Smart Crop", value: "smart"},
  {label: "Face Crop", value: "face"},
  {label: "Object Aware Crop", value: "object"},
];

type AiMagicTransform = {
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

type AiMagicPanelProps = {
  transforms: AiMagicTransform;
  onTransformChange: (transforms: AiMagicTransform) => void;
};

export default function AiMagicPanel({
  transforms,
  onTransformChange,
}: AiMagicPanelProps) {
  const update = (patch: Partial<AiMagicTransform>) => {
    onTransformChange({...transforms, ...patch});
  };

  // For Reset all property
  const resetAll = () => {
    onTransformChange({
      background: undefined,
      editing: undefined,
      shadowLighting: undefined,
      generation: undefined,
      cropping: undefined,
    });
  };

  // For resetting only background property
  const resetBackground = () => {
    update({
      background: {
        changePrompt: undefined,
        generativeFill: undefined,
        remove: undefined,
        mode: undefined,
      },
    });
  };

  const resetAiCropping = () => {
    update({
      cropping: undefined,
    });
  };
  return (
    <div className="h-full flex flex-col md:overflow-y-scroll space-y-1 scrollbar-thin scrollbar-thumb-gray-300">
      <div>
        <Accordion type="multiple">
          <AccordionItem value="background-remove">
            <AccordionTrigger className="py-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <Scissors className="size-4" />
                Background
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 px-0.5">
              <div className="flex justify-between items-center gap-3">
                <Label className="text-xs font-medium">Remove Background</Label>
                <Switch
                  checked={transforms.background?.remove || false}
                  onCheckedChange={newValue => {
                    update({background: {remove: newValue}});
                  }}
                />
              </div>
              <Label className="text-xs font-medium">Quality Mode</Label>
              <Select
                value={transforms.background?.mode || "standard"}
                onValueChange={value =>
                  update({
                    background: {
                      ...transforms.background,
                      mode: value as "standard" | "economy",
                    },
                  })
                }
              >
                <SelectTrigger className={inputStyles} style={gradientBg}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bgRemoveOptions.map(mode => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label className="text-xs font-medium">
                Change Background (AI)
              </Label>
              <Textarea
                style={gradientBg}
                placeholder="Describe the new background (e.g., 'tropical beach at sunset')"
                value={transforms.background?.changePrompt || ""}
                onChange={e => {
                  const prompt = e.target.value;
                  update({
                    background: {
                      ...transforms.background,
                      changePrompt: prompt ? prompt : undefined,
                    },
                  });
                }}
              />
              <div className="flex justify-between items-center gap-3">
                <Label className="text-xs font-medium">Generative Fill</Label>
                <Switch
                  checked={transforms.background?.generativeFill !== undefined}
                  onCheckedChange={newValue => {
                    update({
                      background: {
                        ...transforms.background,
                        generativeFill: newValue
                          ? {cropMode: "pad_resize"}
                          : undefined,
                      },
                    });
                  }}
                />
              </div>
              {transforms.background?.generativeFill && (
                <div className="">
                  <Label className="text-xs font-medium mb-2">
                    Fill Prompt (Optional)
                  </Label>
                  <Textarea
                    style={gradientBg}
                    placeholder="Describe what to generate in expanded areas"
                    onChange={e =>
                      update({
                        background: {
                          ...transforms.background,
                          generativeFill: {
                            ...transforms.background?.generativeFill,
                            prompt: e.target.value ? e.target.value : undefined,
                            cropMode:
                              transforms.background?.generativeFill?.cropMode ||
                              "pad_resize",
                          },
                        },
                      })
                    }
                  />
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">
                        Target Width
                      </Label>
                      <Input
                        type="number"
                        placeholder="Auto"
                        value={
                          transforms.background?.generativeFill?.width || ""
                        }
                        onChange={e =>
                          update({
                            background: {
                              ...transforms.background,
                              generativeFill: {
                                ...transforms.background?.generativeFill,
                                width: e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined,
                                cropMode:
                                  transforms.background?.generativeFill
                                    ?.cropMode || "pad_resize",
                              },
                            },
                          })
                        }
                        className={inputStyles}
                        style={gradientBg}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">
                        Target Height
                      </Label>
                      <Input
                        type="number"
                        placeholder="Auto"
                        value={
                          transforms.background?.generativeFill?.height || ""
                        }
                        onChange={e =>
                          update({
                            background: {
                              ...transforms.background,
                              generativeFill: {
                                ...transforms.background?.generativeFill,
                                height: e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined,
                                cropMode:
                                  transforms.background?.generativeFill
                                    ?.cropMode || "pad_resize",
                              },
                            },
                          })
                        }
                        className={inputStyles}
                        style={gradientBg}
                      />
                    </div>
                  </div>
                  <Label className="text-xs font-medium mt-2 mb-3">
                    Crop Mode
                  </Label>
                  <Select
                    value={
                      transforms.background?.generativeFill?.cropMode ||
                      "pad_resize"
                    }
                    onValueChange={e =>
                      update({
                        background: {
                          ...transforms.background,
                          generativeFill: {
                            ...transforms.background?.generativeFill,
                            cropMode: e as "pad_resize" | "pad_extract",
                          },
                        },
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
              )}
              <Button
                onClick={resetBackground}
                variant="ghost"
                className="w-full rounded-full"
              >
                Reset Background
              </Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="ai-editing">
            <AccordionTrigger className="py-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <SquarePen className="size-4" />
                AI Editing
              </div>
            </AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="shadows-lighting">
            <AccordionTrigger className="py-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <Sun className="size-4" />
                Shadows & Lighting
              </div>
            </AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="ai-generation">
            <AccordionTrigger className="py-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4" />
                AI Generation
              </div>
            </AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="ai-cropping">
            <AccordionTrigger className="py-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <Target className="size-4" />
                AI Cropping
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 px-0.5">
              <Label className="text-xs font-medium">Crop Type</Label>
              <Select
                value={transforms.cropping?.type || "none"}
                onValueChange={newValue => {
                  update({
                    cropping: {
                      type: newValue as "smart" | "face" | "object" | undefined,
                    },
                  });
                }}
              >
                <SelectTrigger className={inputStyles} style={gradientBg}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aiCroppingOptions.map(mode => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {transforms.cropping?.type === "object" ? (
                <div>
                  <Label className="text-xs font-medium mb-3">
                    Object Name
                  </Label>
                  <Input
                    className={inputStyles}
                    style={gradientBg}
                    placeholder="e.g., dog, car, building"
                    value={transforms.cropping?.objectName || ""}
                    onChange={e =>
                      update({
                        cropping: {
                          ...transforms.cropping,
                          objectName: e.target.value
                            ? e.target.value
                            : undefined,
                        },
                      })
                    }
                  />
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">
                        Target Width
                      </Label>
                      <Input
                        type="number"
                        placeholder="Auto"
                        value={transforms.cropping?.width || ""}
                        onChange={e =>
                          update({
                            cropping: {
                              ...transforms.cropping,
                              width: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            },
                          })
                        }
                        className={inputStyles}
                        style={gradientBg}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">
                        Target Height
                      </Label>
                      <Input
                        type="number"
                        placeholder="Auto"
                        value={transforms.cropping.height || ""}
                        onChange={e =>
                          update({
                            cropping: {
                              ...transforms.cropping,
                              height: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            },
                          })
                        }
                        className={inputStyles}
                        style={gradientBg}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <Label className="text-xs font-medium">
                      Zoom{" "}
                      {transforms.cropping.zoom
                        ? `${transforms.cropping.zoom.toFixed(1)}x`
                        : "1.0x"}
                    </Label>
                    <Slider
                      min={0.1}
                      max={5.0}
                      step={0.1}
                      value={[transforms.cropping.zoom || 1]}
                      onValueChange={([value]) =>
                        update({
                          cropping: {
                            ...transforms.cropping,
                            zoom: value,
                          },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              ) : (
                <div></div>
              )}
              <Button
                onClick={resetAiCropping}
                variant="ghost"
                className="w-full rounded-full"
              >
                Reset AI Cropping
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="pt-4 pb-12 px-0.5">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={`flex-1 ${buttonStyles}`}
              style={gradientBg}
              onClick={resetAll}
            >
              <Trash2 className="size-4" />
              Reset All
            </Button>
            <Button
              variant="outline"
              className={`flex-1 ${buttonStyles}`}
              style={gradientBg}
              onClick={() => {
                if (transforms.background?.remove !== true) {
                  update({background: {remove: true}});
                }
              }}
            >
              <WandSparkles className="size-4" />
              Remove BG
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
