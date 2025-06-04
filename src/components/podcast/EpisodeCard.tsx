import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { PlayButton } from "@/components/audio/PlayButton";
import { useAudio } from "@/hooks/useAudio";
import { Episode, Podcast } from "@/types";
import { formatDuration, formatRelativeTime, truncateText } from "@/lib/utils";
import { Clock, Calendar } from "lucide-react";

interface EpisodeCardProps {
  episode: Episode;
  podcast: Podcast;
  className?: string;
  showPodcastName?: boolean;
}

export function EpisodeCard({
  episode,
  podcast,
  className,
  showPodcastName = false,
}: EpisodeCardProps) {
  const { currentEpisode, playbackState, playEpisode } = useAudio();

  const isCurrentEpisode = currentEpisode?.episode.id === episode.id;

  const handlePlay = () => {
    playEpisode({ episode, podcast });
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Episode Thumbnail */}
          <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            <Image
              src={episode.thumbnailUrl || podcast.imageUrl}
              alt={episode.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Episode Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm mb-1 line-clamp-2">
                  {episode.title}
                </h3>

                {showPodcastName && (
                  <p className="text-xs text-primary font-medium mb-1">
                    {podcast.title}
                  </p>
                )}

                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {truncateText(episode.description, 120)}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatRelativeTime(episode.publishDate)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDuration(episode.duration)}</span>
                  </div>

                  {episode.episodeNumber && (
                    <span className="text-xs">
                      Episode {episode.episodeNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Play Button */}
              <PlayButton
                isPlaying={isCurrentEpisode && playbackState.isPlaying}
                isLoading={isCurrentEpisode && playbackState.isLoading}
                onClick={handlePlay}
                size="sm"
                variant="outline"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
