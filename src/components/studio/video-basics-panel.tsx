"use client";

import { Crop, RotateCcw } from "lucide-react";

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
import { BasicsTransform as VideoBasics } from "@/types/video-transformations";

type VideoBasicsPanelProps = {
  transforms: VideoBasics;
  onTransformChange: (transforms: VideoBasics) => void;
};

const aspectRatios = [
  { label: "Custom", value: "custom" },
  { label: "16:9 (Wide)", value: "16-9" },
  { label: "9:16 (Portrait)", value: "9-16" },
  { label: "1:1 (Square)", value: "1-1" },
  { label: "4:3 (Standard)", value: "4-3" },
];

const inputStyles =
  "rounded-full px-4 h-8 focus-visible:ring-0 shadow-none border-transparent ring-1 ring-pink-500/20 dark:ring-pink-400/15 dark:bg-background/50";

export function VideoBasicsPanel({
  transforms = {},
  onTransformChange,
}: VideoBasicsPanelProps) {
  const update = (patch: Partial<VideoBasics>) => {
    onTransformChange({ ...transforms, ...patch });
  };

  const resetAll = () => {
    onTransformChange({});
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        <Accordion type="multiple" defaultValue={["dimensions"]} className="w-full">
          <AccordionItem value="dimensions">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Crop className="size-4" />
                <span>Dimensions & Crop</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Width</Label>
                  <Input
                    className={inputStyles}
                    placeholder="Auto"
                    value={transforms.width || ""}
                    onChange={(e) => update({ width: e.target.value || undefined })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height</Label>
                  <Input
                    className={inputStyles}
                    placeholder="Auto"
                    value={transforms.height || ""}
                    onChange={(e) => update({ height: e.target.value || undefined })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Aspect Ratio</Label>
                <Select
                  value={transforms.aspectRatio || "custom"}
                  onValueChange={(value) =>
                    update({
                      aspectRatio: value === "custom" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger className={inputStyles}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatios.map((ratio) => (
                      <SelectItem key={ratio.value} value={ratio.value}>
                        {ratio.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="rotation">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <RotateCcw className="size-4" />
                <span>Rotation</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Angle</Label>
                <Select
                  value={String(transforms.rotate || 0)}
                  onValueChange={(value) =>
                    update({
                      rotate: parseInt(value) as VideoBasics["rotate"],
                    })
                  }
                >
                  <SelectTrigger className={inputStyles}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0° (None)</SelectItem>
                    <SelectItem value="90">90°</SelectItem>
                    <SelectItem value="180">180°</SelectItem>
                    <SelectItem value="270">270°</SelectItem>
                    <SelectItem value="360">360°</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
