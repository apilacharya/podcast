"use client";

import Image from "next/image";
import { useAudio } from "@/hooks/useAudio";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { PlayButton } from "./PlayButton";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { PlaybackSpeed } from "./PlaybackSpeed";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Maximize2, X, SkipBack, SkipForward } from "lucide-react";

interface MiniPlayerProps {
  className?: string;
  onExpand?: () => void;
  onClose?: () => void;
}

export function MiniPlayer({ className, onExpand, onClose }: MiniPlayerProps) {
  const {
    currentEpisode,
    playbackState,
    togglePlayPause,
    seekTo,
    changeVolume,
    changePlaybackRate,
    toggleMute,
  } = useAudio();

  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!currentEpisode) return null;

  const { episode, podcast } = currentEpisode;

  const handleSkipBackward = () => {
    const newTime = Math.max(0, playbackState.currentTime - 15);
    seekTo(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(
      playbackState.duration,
      playbackState.currentTime + 15
    );
    seekTo(newTime);
  };

  return (
    <Card
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Episode Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={episode.thumbnailUrl || podcast.imageUrl}
                alt={episode.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-sm truncate">{episode.title}</h4>
              <p className="text-xs text-muted-foreground truncate">
                {podcast.title}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {!isMobile && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkipBackward}
                  className="h-8 w-8 p-0"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                <PlayButton
                  isPlaying={playbackState.isPlaying}
                  isLoading={playbackState.isLoading}
                  onClick={togglePlayPause}
                  size="sm"
                />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkipForward}
                  className="h-8 w-8 p-0"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </>
            )}

            {isMobile && (
              <PlayButton
                isPlaying={playbackState.isPlaying}
                isLoading={playbackState.isLoading}
                onClick={togglePlayPause}
                size="sm"
              />
            )}

            {!isMobile && (
              <>
                <div className="w-24">
                  <VolumeControl
                    volume={playbackState.volume}
                    isMuted={playbackState.isMuted}
                    onVolumeChange={changeVolume}
                    onToggleMute={toggleMute}
                  />
                </div>

                <PlaybackSpeed
                  playbackRate={playbackState.playbackRate}
                  onPlaybackRateChange={changePlaybackRate}
                />
              </>
            )}

            {onExpand && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onExpand}
                className="h-8 w-8 p-0"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}

            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <ProgressBar
            currentTime={playbackState.currentTime}
            duration={playbackState.duration}
            onSeek={seekTo}
            showTime={!isMobile}
          />
        </div>
      </div>
    </Card>
  );
}
