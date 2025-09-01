"use client";

import { MicOff, Volume2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Audio as VideoAudio } from "@/types/video-transformations";

type VideoAudioPanelProps = {
  transforms: VideoAudio;
  onTransformChange: (transforms: VideoAudio) => void;
};

const gradientBg = {
  backgroundImage:
    "linear-gradient(to top left, rgba(236,72,153,0.08), rgba(236,72,153,0.00))",
};

export function VideoAudioPanel({
  transforms = {},
  onTransformChange,
}: VideoAudioPanelProps) {
  const update = (patch: Partial<VideoAudio>) => {
    onTransformChange({ ...transforms, ...patch });
  };

  return (
    <div className="space-y-4">
      <div
        className="flex items-center justify-between rounded-lg p-3"
        style={gradientBg}
      >
        <div className="flex items-center gap-3">
          <Volume2 className="size-4" />
          <Label htmlFor="mute-audio" className="font-medium">
            Mute Audio
          </Label>
        </div>
        <Switch
          id="mute-audio"
          checked={transforms.mute || false}
          onCheckedChange={(checked) => update({ mute: checked ? true : undefined })}
        />
      </div>
      <div
        className="flex items-center justify-between rounded-lg p-3"
        style={gradientBg}
      >
        <div className="flex items-center gap-3">
          <MicOff className="size-4" />
          <Label htmlFor="extract-audio" className="font-medium">
            Extract Audio
          </Label>
        </div>
        <Switch
          id="extract-audio"
          checked={transforms.extractAudio || false}
          onCheckedChange={(checked) =>
            update({ extractAudio: checked ? true : undefined })
          }
        />
      </div>
    </div>
  );
}
