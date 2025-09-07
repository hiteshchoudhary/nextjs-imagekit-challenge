import {type SectionKey} from "@/components/studio/dock";
import {TransformationConfig} from "@/types";

import AiMagicPanel from "./ai-magic-panel";
import {ImageBasicsPanel} from "./image-basics-panel";

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
              onTransformChange={b =>
                onTransformChange({...transforms, basics: b})
              }
            />
          );
        } else if (transforms.type === "VIDEO") {
          return <>Video Basics</>;
        }
      case "overlays":
        return <p>Overlays & Effects</p>;
      case "enhancements":
        return <p>Enhancements</p>;
      case "ai":
        if (transforms.type === "IMAGE") {
          return (
            <AiMagicPanel
              transforms={transforms.ai || {}}
              onTransformChange={a => onTransformChange({...transforms, ai: a})}
            />
          );
        } else if (transforms.type === "VIDEO") {
          return <>Video AI Basics</>;
        }
      case "audio":
        return <p>Audio</p>;
      default:
        return (
          <div className="p-4 text-center text-gray-500">
            Select a section to get started
          </div>
        );
    }
  };

  return (
    <div className="border flex flex-col border-pink-300/30 dark:border-pink-200/15 max-md:min-h-32 md:w-1/4 rounded-xl p-6">
      <div className="flex items-center justify-between pb-4 border-gray-300/30 dark:border-white/10">
        <div className="flex items-center gap-2">
          <h3 className="flex items-center gap-2 text-xs text-foreground/60">
            {getSectionTitle(activeSection)}
          </h3>
        </div>
      </div>
      <div className="max-h-full">{renderPanelContent()}</div>
    </div>
  );
}
