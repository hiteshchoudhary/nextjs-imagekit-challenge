"use client";

import Link from "next/link";
import React, {useEffect, useRef, useState} from "react";

import {Image, Video} from "@imagekit/next";
import {Image as ImageIcon, Volume2, VolumeX} from "lucide-react";

import {Card} from "@/components/ui/card";
import ROUTES from "@/constants/routes";
import {SelectMediaModel} from "@/db/schema/media";

import {Button} from "../ui/button";

type MediaCardProps = SelectMediaModel & {
  activeVideoId?: string | null;
  onVideoMuteToggle?: (videoId: string, isMuted: boolean) => void;
};

const MediaCard = ({
  activeVideoId,
  onVideoMuteToggle,
  ...media
}: MediaCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideoActive = activeVideoId === media.id;
  const isMuted = !isVideoActive;

  useEffect(() => {
    if (videoRef.current && media.mediaType === "VIDEO") {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, media.mediaType]);

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onVideoMuteToggle) {
      onVideoMuteToggle(media.id, isMuted);
    }
  };

  return (
    <Link href={ROUTES.STUDIO(media.id)} className="block">
      <Card className="group relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-md border-0 !p-0 shadow-md backdrop-blur-sm transition-all duration-300 dark:bg-black/50">
        <div className="relative">
          {media.mediaType === "IMAGE" ? (
            <Image
              urlEndpoint={media.originalUrl}
              src={media.transformedUrl || media.originalUrl}
              alt={media.fileName}
              width={400}
              height={0} 
              className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setHasError(true);
                setIsLoading(false);
              }}
              transformation={[{width: 400, quality: 80}]}
            />
          ) : (
            <div className="relative">
              <Video
                ref={videoRef}
                urlEndpoint={media.originalUrl}
                src={media.transformedUrl || media.originalUrl}
                width={400}
                height={0}
                className="h-fit w-full object-cover"
                autoPlay
                loop
                muted={isMuted}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setHasError(true);
                  setIsLoading(false);
                }}
              />

              <Button
                onClick={handleMuteToggle}
                className="absolute right-2 bottom-2 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/80 focus:ring-0 focus:ring-white/50 focus:outline-none"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <VolumeX className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
              </Button>
            </div>
          )}

          {/* Loading state for images only */}
          {isLoading && media.mediaType === "IMAGE" && (
            <div className="absolute inset-0 flex min-h-[200px] items-center justify-center bg-black/50 backdrop-blur-2xl">
              <div className="text-center text-gray-500">
                <ImageIcon className="mx-auto mb-2 size-12 object-cover" />
                <p className="text-sm">Loading...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {hasError && (
            <div className="absolute inset-0 flex min-h-[200px] items-center justify-center bg-gray-100">
              <div className="text-center text-gray-500">
                <ImageIcon className="mx-auto mb-2 size-12 object-cover" />
                <p className="text-sm">Failed to load</p>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Card>
    </Link>
  );
};

export default MediaCard;
