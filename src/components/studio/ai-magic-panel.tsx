import {
  Crop,
  Droplet,
  Pencil,
  Target,
  Wand2,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { type AiMagic } from "@/types/image-transformations";

type AiMagicPanelProps = {
  transforms: AiMagic;
  onTransformChange: (transforms: AiMagic) => void;
};

const inputStyles =
  "rounded-full px-4 h-8 focus-visible:ring-0 shadow-none border-transparent ring-1 ring-pink-500/20 dark:ring-pink-400/15 dark:bg-background/50";
const gradientBg = {
  backgroundImage:
    "linear-gradient(to top left, rgba(236,72,153,0.08), rgba(236,72,153,0.00))",
};

export function AiMagicPanel({
  transforms,
  onTransformChange,
}: AiMagicPanelProps) {
  const update = (patch: Partial<AiMagic>) => {
    onTransformChange({ ...transforms, ...patch });
  };

  const handleBackgroundChange = (
    bgPatch: Partial<AiMagic["background"]>
  ) => {
    update({ background: { ...transforms.background, ...bgPatch } });
  };

  const handleEditingChange = (
    editingPatch: Partial<AiMagic["editing"]>
  ) => {
    update({ editing: { ...transforms.editing, ...editingPatch } });
  };

  const handleShadowChange = (
    shadowPatch: Partial<AiMagic["shadowLighting"]>
  ) => {
    update({ shadowLighting: { ...transforms.shadowLighting, ...shadowPatch } });
  };

  const handleGenerationChange = (
    genPatch: Partial<AiMagic["generation"]>
  ) => {
    update({ generation: { ...transforms.generation, ...genPatch } });
  };

  const handleCroppingChange = (
    cropPatch: Partial<AiMagic["cropping"]>
  ) => {
    update({ cropping: { ...transforms.cropping, ...cropPatch } });
  };

  const resetCropping = () => {
    update({ cropping: undefined });
  };

  return (

    <div className="flex flex-col space-y-1">
      <Accordion type="multiple" defaultValue={["background"]}>
        <AccordionItem value="background">
          <AccordionTrigger className="py-3 cursor-pointer">
            <div className="flex items-center gap-2">
              <Crop className="size-4" />
              Background
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 px-0.5">
            <div
              className="flex items-center justify-between rounded-lg p-3"
              style={gradientBg}
            >
              <Label htmlFor="remove-bg" className="font-medium">
                Remove Background
              </Label>
              <Switch
                id="remove-bg"
                checked={transforms.background?.remove || false}
                onCheckedChange={(checked) =>
                  handleBackgroundChange({ remove: checked })
                }
              />
            </div>
            {transforms.background?.remove && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Quality Mode</Label>
                <Select
                  value={transforms.background?.mode || "standard"}
                  onValueChange={(value: "standard" | "economy") =>
                    handleBackgroundChange({ mode: value })
                  }
                >
                  <SelectTrigger className={inputStyles} style={gradientBg}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">
                      Standard (High Quality)
                    </SelectItem>
                    <SelectItem value="economy">Economy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="ai-editing">
          <AccordionTrigger className="py-3 cursor-pointer">
            <div className="flex items-center gap-2">
              <Pencil className="size-4" />
              AI Editing
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 px-0.5">
             <div className="flex items-center justify-between rounded-lg p-3" style={gradientBg}>
              <Label htmlFor="retouch" className="font-medium">Retouch</Label>
              <Switch
                id="retouch"
                checked={transforms.editing?.retouch || false}
                onCheckedChange={(checked) => handleEditingChange({ retouch: checked })}
              />
            </div>
             <div className="flex items-center justify-between rounded-lg p-3" style={gradientBg}>
              <Label htmlFor="upscale" className="font-medium">Upscale</Label>
              <Switch
                id="upscale"
                checked={transforms.editing?.upscale || false}
                onCheckedChange={(checked) => handleEditingChange({ upscale: checked })}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="shadows-lighting">
          <AccordionTrigger className="py-3 cursor-pointer">
            <div className="flex items-center gap-2">
              <Droplet className="size-4" />
              Shadows & Lighting
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 px-0.5 text-sm text-muted-foreground">
             <div className="flex items-center justify-between rounded-lg p-3" style={gradientBg}>
              <Label htmlFor="drop-shadow" className="font-medium">Drop Shadow</Label>
               <Switch
                id="drop-shadow"
                checked={!!transforms.shadowLighting?.dropShadow}
                onCheckedChange={(checked) => handleShadowChange({ dropShadow: checked ? {} : undefined })}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="ai-generation">
          <AccordionTrigger className="py-3 cursor-pointer">
            <div className="flex items-center gap-2">
              <Wand2 className="size-4" />
              AI Generation
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 px-0.5">
             <div className="space-y-2">
                <Label className="text-xs font-medium">Text-to-Image Prompt</Label>
                <Input
                  placeholder="e.g., a cat wearing a wizard hat"
                  value={transforms.generation?.textPrompt || ""}
                  onChange={(e) =>
                    handleGenerationChange({ textPrompt: e.target.value || undefined })
                  }
                  className={inputStyles}
                  style={gradientBg}
                />
              </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="ai-cropping">
          <AccordionTrigger className="py-3 cursor-pointer">
            <div className="flex items-center gap-2">
              <Target className="size-4" />
              AI Cropping
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 px-0.5">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Crop Type</Label>
              <Select
                value={transforms.cropping?.type || "none"}
                onValueChange={(value) =>
                  handleCroppingChange({
                    type: value === "none" ? undefined : (value as "smart" | "face" | "object"),
                  })
                }
              >
                <SelectTrigger className={inputStyles} style={gradientBg}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="smart">Smart Crop</SelectItem>
                  <SelectItem value="face">Face Crop</SelectItem>
                  <SelectItem value="object">Object-aware Crop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {transforms.cropping?.type === "object" && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Object Name</Label>
                <Input
                  placeholder="e.g., dog, car, building"
                  value={transforms.cropping?.objectName || ""}
                  onChange={(e) =>
                    handleCroppingChange({ objectName: e.target.value })
                  }
                  className={inputStyles}
                  style={gradientBg}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-xs font-medium">
                Zoom: {transforms.cropping?.zoom?.toFixed(1) || "1.0"}x
              </Label>
              <Slider
                min={1}
                max={5}
                step={0.1}
                value={[transforms.cropping?.zoom || 1]}
                onValueChange={([value]) =>
                  handleCroppingChange({ zoom: value === 1 ? undefined : value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Target Width</Label>
                <Input
                  type="number"
                  placeholder="Auto"
                  value={transforms.cropping?.width || ""}
                  onChange={(e) =>
                    handleCroppingChange({
                      width: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className={inputStyles}
                  style={gradientBg}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Target Height</Label>
                <Input
                  type="number"
                  placeholder="Auto"
                  value={transforms.cropping?.height || ""}
                  onChange={(e) =>
                    handleCroppingChange({
                      height: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className={inputStyles}
                  style={gradientBg}
                />
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={resetCropping}
              className="w-full rounded-full"
            >
              Reset AI Cropping
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
