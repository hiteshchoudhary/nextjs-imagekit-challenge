import { type SectionKey } from "@/components/studio/dock";
import { TransformationConfig } from "@/types";

import { AiMagicPanel } from "./ai-magic-panel";
import { EnhancementsPanel } from "./enhancements-panel";
import { ImageBasicsPanel } from "./image-basics-panel";
import { OverlaysPanel } from "./overlays-panel";
import { VideoAudioPanel } from "./video-audio-panel";
import { VideoBasicsPanel } from "./video-basics-panel";

type TransformPanelProps = {
  activeSection: SectionKey;
  transforms: TransformationConfig;
  onTransformChange: (transforms: TransformationConfig) => void;
};

export function TransformPanel({
  activeSection,
  transforms,
  onTransformChange,
}: TransformPanelProps) {
  const getSectionTitle = (section: SectionKey) => {
    switch (section) {
      case "basics":
        return "Basic Adjustments";
      case "overlays":
        return "Overlays & Effects";
      case "enhancements":
        return "Enhancements";
      case "ai":
        return "AI Magic";
      case "audio":
        return "Audio";
      default:
        return "Transform";
    }
  };

  const renderPanelContent = () => {
    switch (activeSection) {
      case "basics":
        if (transforms.type === "IMAGE") {
          return (
            <ImageBasicsPanel
              transforms={transforms.basics || {}}
              onTransformChange={(b) =>
                onTransformChange({ ...transforms, basics: b })
              }
            />
          );
        } else if (transforms.type === "VIDEO") {
          return (
            <VideoBasicsPanel
              transforms={transforms.basics || {}}
              onTransformChange={(b) =>
                onTransformChange({ ...transforms, basics: b })
              }
            />
          );
        }
        break;
      case "overlays":
        if (transforms.type === "IMAGE") {
          return (
            <OverlaysPanel
              overlays={transforms.overlays || []}
              onTransformChange={(newOverlays) =>
                onTransformChange({ ...transforms, overlays: newOverlays })
              }
            />
          );
        }
        return <p>Overlays are only available for images.</p>;
      case "enhancements":
        if (transforms.type === "IMAGE") {
          return (
            <EnhancementsPanel
              transforms={transforms.enhancements || {}}
              onTransformChange={(enhancementTransforms) =>
                onTransformChange({
                  ...transforms,
                  enhancements: enhancementTransforms,
                })
              }
            />
          );
        }
        return <p>Enhancements are only available for images.</p>;
      case "ai":
        if (transforms.type === "IMAGE") {
          return (
            <AiMagicPanel
              transforms={transforms.ai || {}}
              onTransformChange={(aiTransforms) =>
                onTransformChange({ ...transforms, ai: aiTransforms })
              }
            />
          );
        }
        return <p>AI Magic is only available for images.</p>;
      case "audio":
        if (transforms.type === "VIDEO") {
          return (
            <VideoAudioPanel
              transforms={transforms.audio || {}}
              onTransformChange={(audioTransforms) =>
                onTransformChange({ ...transforms, audio: audioTransforms })
              }
            />
          );
        }
        return <p>Audio controls are only available for videos.</p>;
      default:
        return (
          <div className="p-4 text-center text-gray-500">
            Select a section to get started
          </div>
        );
    }
  };

  return (
    <div className="border flex h-full flex-col overflow-hidden border-pink-300/30 dark:border-pink-200/15 max-md:min-h-32 md:w-1/4 rounded-xl p-6">
      <div className="flex items-center justify-between pb-4 border-gray-300/30 dark:border-white/10">
        <div className="flex items-center gap-2">
          <h3 className="flex items-center gap-2 text-xs text-foreground/60">
            {getSectionTitle(activeSection)}
          </h3>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto -mr-6 pr-6">
        {renderPanelContent()}
      </div>
    </div>
  );
}
