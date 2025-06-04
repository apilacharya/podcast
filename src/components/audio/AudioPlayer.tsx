import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayButton } from "./PlayButton";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { PlaybackSpeed } from "./PlaybackSpeed";
import { useAudio } from "@/hooks/useAudio";
import { SkipBack, SkipForward, Minimize2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { toggleMinimized } from "@/store/audioSlice";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AudioPlayerProps {
  className?: string;
}

export function AudioPlayer({ className }: AudioPlayerProps) {
  const dispatch = useDispatch();
  const {
    currentEpisode,
    playbackState,
    togglePlayPause,
    seekTo,
    changeVolume,
    changePlaybackRate,
    toggleMute,
  } = useAudio();

  if (!currentEpisode) return null;

  const { episode, podcast } = currentEpisode;

  const handleMinimize = () => {
    dispatch(toggleMinimized());
  };

  return (
    <Card
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Episode Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={episode.thumbnailUrl || podcast.imageUrl}
              alt={episode.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm truncate">{episode.title}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {podcast.title}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Previous episode"
          >
            <SkipBack size={16} />
          </Button>

          <PlayButton
            isPlaying={playbackState.isPlaying}
            isLoading={playbackState.isLoading}
            onClick={togglePlayPause}
            size="md"
          />

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Next episode"
          >
            <SkipForward size={16} />
          </Button>
        </div>

        {/* Progress */}
        <div className="hidden md:flex flex-1 max-w-md">
          <ProgressBar
            currentTime={playbackState.currentTime}
            duration={playbackState.duration}
            onSeek={seekTo}
            showTime={false}
          />
        </div>

        {/* Additional Controls */}
        <div className="hidden lg:flex items-center gap-2">
          <PlaybackSpeed
            playbackRate={playbackState.playbackRate}
            onPlaybackRateChange={changePlaybackRate}
          />

          <VolumeControl
            volume={playbackState.volume}
            isMuted={playbackState.isMuted}
            onVolumeChange={changeVolume}
            onToggleMute={toggleMute}
          />
        </div>

        {/* Minimize Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMinimize}
          className="h-8 w-8"
          aria-label="Minimize player"
        >
          <Minimize2 size={16} />
        </Button>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden px-4 pb-4">
        <ProgressBar
          currentTime={playbackState.currentTime}
          duration={playbackState.duration}
          onSeek={seekTo}
        />
      </div>
    </Card>
  );
}
