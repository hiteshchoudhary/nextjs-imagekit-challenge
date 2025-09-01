"use client";

import { Droplet, Image as ImageIcon, Sparkles } from "lucide-react";

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
import { type Enhancements } from "@/types/image-transformations";

type EnhancementsPanelProps = {
  transforms: Enhancements;
  onTransformChange: (transforms: Enhancements) => void;
};

const inputStyles =
  "rounded-full px-4 h-8 focus-visible:ring-0 shadow-none border-transparent ring-1 ring-pink-500/20 dark:ring-pink-400/15 dark:bg-background/50";

export function EnhancementsPanel({
  transforms = {},
  onTransformChange,
}: EnhancementsPanelProps) {
  const update = (patch: Partial<Enhancements>) => {
    onTransformChange({ ...transforms, ...patch });
  };

  const handleShadowChange = (
    shadowPatch: Partial<Enhancements["shadow"]>
  ) => {
    update({ shadow: { ...transforms.shadow, ...shadowPatch } });
  };

  const handleBackgroundChange = (
    backgroundPatch?: Partial<Enhancements["background"]>
  ) => {
    if (!backgroundPatch || backgroundPatch.type === undefined) {
      const { background, ...rest } = transforms;
      onTransformChange(rest);
    } else {
      update({
        background: {
          ...(transforms.background || {}),
          ...backgroundPatch,
        } as Enhancements["background"],
      });
    }
  };


  const resetAll = () => {
    onTransformChange({});
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        <Accordion
          type="multiple"
          defaultValue={["enhancements"]}
          className="w-full"
        >
          <AccordionItem value="enhancements">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4" />
                <span>Enhancements</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Blur: {transforms.blur || 0}</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[transforms.blur || 0]}
                  onValueChange={([value]) =>
                    update({ blur: value === 0 ? undefined : value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Sharpen: {transforms.sharpen || 0}</Label>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={[transforms.sharpen || 0]}
                  onValueChange={([value]) =>
                    update({ sharpen: value === 0 ? undefined : value })
                  }
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shadow">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Droplet className="size-4" />
                <span>Shadow</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Offset X</Label>
                  <Input
                    type="number"
                    className={inputStyles}
                    value={transforms.shadow?.offsetX || 0}
                    onChange={(e) =>
                      handleShadowChange({ offsetX: parseInt(e.target.value) || undefined })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Offset Y</Label>
                  <Input
                    type="number"
                    className={inputStyles}
                    value={transforms.shadow?.offsetY || 0}
                    onChange={(e) =>
                      handleShadowChange({ offsetY: parseInt(e.target.value) || undefined })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Blur: {transforms.shadow?.blur || 0}</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[transforms.shadow?.blur || 0]}
                  onValueChange={([value]) =>
                    handleShadowChange({ blur: value === 0 ? undefined : value })
                  }
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="background">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <ImageIcon className="size-4" />
                <span>Background</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={transforms.background?.type || "none"}
                  onValueChange={(value: "solid" | "blurred" | "dominant" | "none") =>
                    handleBackgroundChange({
                      type: value === "none" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger className={inputStyles}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="solid">Solid Color</SelectItem>
                    <SelectItem value="blurred">Blurred</SelectItem>
                    <SelectItem value="dominant">Dominant Color</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {transforms.background?.type === "solid" && (
                <div className="space-y-2">
                  <Label>Color (Hex)</Label>
                  <Input
                    className={inputStyles}
                    placeholder="e.g., FF0000"
                    value={transforms.background.color || ""}
                    onChange={(e) =>
                      handleBackgroundChange({ color: e.target.value || undefined })
                    }
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="pt-4 mt-auto">
        <Button
          variant="outline"
          onClick={resetAll}
          className="w-full rounded-full"
        >
          Reset All
        </Button>
      </div>
    </div>
  );
}
