import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayButton } from "@/components/audio/PlayButton";
import { useAudio } from "@/hooks/useAudio";
import { Podcast } from "@/types";
import { cn, truncateText } from "@/lib/utils";
import { Clock, Users } from "lucide-react";

interface PodcastCardProps {
  podcast: Podcast;
  className?: string;
  showStats?: boolean;
  featured?: boolean;
}

export function PodcastCard({
  podcast,
  className,
  showStats = true,
  featured = false,
}: PodcastCardProps) {
  const { currentEpisode, playbackState, playEpisode } = useAudio();

  const isCurrentPodcast = currentEpisode?.podcast.id === podcast.id;
  const hasEpisodes = podcast.episodes.length > 0;
  const latestEpisode = hasEpisodes ? podcast.episodes[0] : null;

  const handlePlay = () => {
    if (latestEpisode) {
      playEpisode({
        episode: latestEpisode,
        podcast,
      });
    }
  };

  return (
    <Card
      className={cn(
        "group hover:shadow-md transition-shadow",
        featured && "ring-2 ring-primary",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Podcast Image & Play Button */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <Image
              src={podcast.imageUrl}
              alt={podcast.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              unoptimized
            />

            {/* Play Button Overlay */}
            {hasEpisodes && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <PlayButton
                  isPlaying={isCurrentPodcast && playbackState.isPlaying}
                  isLoading={isCurrentPodcast && playbackState.isLoading}
                  onClick={handlePlay}
                  size="lg"
                  variant="default"
                  className="bg-white text-black hover:bg-white/90"
                />
              </div>
            )}
          </div>

          {/* Podcast Info */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/podcast/${podcast.slug}`}
                className="font-semibold text-sm hover:underline line-clamp-2"
              >
                {podcast.title}
              </Link>
              {podcast.isExplicit && (
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  E
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2">
              {truncateText(podcast.description, 100)}
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{podcast.author}</span>
              <span>•</span>
              <Badge variant="outline" className="text-xs">
                {podcast.category}
              </Badge>
            </div>

            {/* Stats */}
            {showStats && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{podcast.totalEpisodes} episodes</span>
                </div>
                {podcast.subscriberCount && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{podcast.subscriberCount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
