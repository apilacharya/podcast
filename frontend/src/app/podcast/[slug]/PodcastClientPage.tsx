"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, Users, Calendar, Heart, Share2, Download } from "lucide-react";

import { usePodcastBySlug } from "@/hooks/usePodcasts";
import { useAudio } from "@/hooks/useAudio";
import { formatNumber } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayButton } from "@/components/audio/PlayButton";
import { EpisodeCard } from "@/components/podcast/EpisodeCard";

interface PodcastPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function PodcastPage(props: PodcastPageProps) {
  const params = use(props.params);
  const { data: podcast, isLoading, error } = usePodcastBySlug(params.slug);
  const { currentEpisode, playbackState, playEpisode } = useAudio();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-full md:w-80 h-80 rounded-2xl" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !podcast) {
    notFound();
  }

  const isCurrentPodcast = currentEpisode?.podcast.id === podcast.id;
  const latestEpisode = podcast.episodes[0];

  const handlePlayLatest = () => {
    if (latestEpisode) {
      playEpisode({ episode: latestEpisode, podcast });
    }
  };

  return (
    <div className="space-y-8">
      {/* Podcast Header */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Podcast Artwork */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-2xl">
            <Image
              src={podcast.imageUrl}
              alt={podcast.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Podcast Info */}
        <div className="flex-1 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                {podcast.title}
              </h1>
              {podcast.isExplicit && (
                <Badge variant="secondary" className="mt-1">
                  Explicit
                </Badge>
              )}
            </div>

            <p className="text-lg text-muted-foreground">by {podcast.author}</p>

            <p className="text-muted-foreground leading-relaxed">
              {podcast.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{podcast.totalEpisodes} episodes</span>
              </div>

              {podcast.subscriberCount && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {formatNumber(podcast.subscriberCount)} subscribers
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Updated {new Date(podcast.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <Badge variant="outline">{podcast.category}</Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <PlayButton
              isPlaying={isCurrentPodcast && playbackState.isPlaying}
              isLoading={isCurrentPodcast && playbackState.isLoading}
              onClick={handlePlayLatest}
              size="lg"
              className="px-8"
            />

            <Button variant="outline" size="lg">
              <Heart className="h-4 w-4 mr-2" />
              Subscribe
            </Button>

            <Button variant="outline" size="lg">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            <Button variant="outline" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Episodes List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Episodes</h2>
          <Badge variant="secondary">{podcast.episodes.length} episodes</Badge>
        </div>

        <div className="space-y-4">
          {podcast.episodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} podcast={podcast} />
          ))}
        </div>
      </div>
    </div>
  );
}
