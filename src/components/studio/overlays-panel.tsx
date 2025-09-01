"use client";

import { Layers, Plus, Text, Trash2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { type Overlay, type TextOverlay } from "@/types/image-transformations";

type OverlaysPanelProps = {
  overlays: Overlay[];
  onTransformChange: (overlays: Overlay[]) => void;
};

const inputStyles =
  "rounded-full px-4 h-8 focus-visible:ring-0 shadow-none border-transparent ring-1 ring-pink-500/20 dark:ring-pink-400/15 dark:bg-background/50";

export function OverlaysPanel({
  overlays = [],
  onTransformChange,
}: OverlaysPanelProps) {
  const addTextOverlay = () => {
    const newTextOverlay: TextOverlay = {
      type: "text",
      text: "Quick Text",
      color: "FFFFFF",
      fontSize: 50,
      fontFamily: "Montserrat",
    };
    onTransformChange([...overlays, newTextOverlay]);
  };

  const updateOverlay = (index: number, newProps: Partial<TextOverlay>) => {
    const newOverlays = [...overlays];
    const currentOverlay = newOverlays[index];
    if (currentOverlay.type === "text") {
      newOverlays[index] = { ...currentOverlay, ...newProps };
      onTransformChange(newOverlays);
    }
  };

  const removeOverlay = (index: number) => {
    const newOverlays = overlays.filter((_, i) => i !== index);
    onTransformChange(newOverlays);
  };

  const clearAllOverlays = () => {
    onTransformChange([]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        <Accordion
          type="multiple"
          defaultValue={["add-overlay", "overlays-list"]}
          className="w-full"
        >
          <AccordionItem value="add-overlay">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Plus className="size-4" />
                <span>Add Overlay</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <Button onClick={addTextOverlay} className="w-full rounded-full">
                <Text className="size-4 mr-2" />
                Add Text
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="overlays-list">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Layers className="size-4" />
                <span>Overlays ({overlays.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2 pt-4">
              {overlays.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-4">
                  No overlays added yet
                </p>
              ) : (
                <Accordion type="multiple" className="w-full space-y-2">
                  {overlays.map((overlay, index) => {
                    switch (overlay.type) {
                      case "text":
                        return (
                          <div
                            key={index}
                            className="rounded-lg border border-border p-2"
                          >
                            <AccordionItem
                              value={`overlay-${index}`}
                              className="border-b-0"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 font-medium text-sm">
                                  <Text className="size-4 text-muted-foreground" />
                                  <span>
                                    {overlay.text.substring(0, 15) ||
                                      `Text #${index + 1}`}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                    onClick={() => removeOverlay(index)}
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                  <AccordionTrigger className="p-2 [&[data-state=open]>svg]:rotate-180" />
                                </div>
                              </div>
                              <AccordionContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                  <Label>Text</Label>
                                  <Input
                                    className={inputStyles}
                                    value={overlay.text}
                                    onChange={(e) =>
                                      updateOverlay(index, { text: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label>Font Size</Label>
                                    <Input
                                      type="number"
                                      className={inputStyles}
                                      value={overlay.fontSize}
                                      onChange={(e) =>
                                        updateOverlay(index, {
                                          fontSize: parseInt(e.target.value, 10),
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Color (Hex)</Label>
                                    <Input
                                      className={inputStyles}
                                      value={overlay.color}
                                      onChange={(e) =>
                                        updateOverlay(index, { color: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </Accordion>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="pt-4 mt-auto space-y-2">
        <Separator />
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={clearAllOverlays}
            className="rounded-full"
            disabled={overlays.length === 0}
          >
            Clear All
          </Button>
          <Button onClick={addTextOverlay} className="rounded-full">
            <Plus className="size-4 mr-1" />
            Quick Text
          </Button>
        </div>
      </div>
    </div>
  );
}
