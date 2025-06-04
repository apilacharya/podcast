'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePodcastBySlug } from '@/hooks/usePodcasts';
import { PlayButton } from '@/components/audio/PlayButton';
import { useAudio } from '@/hooks/useAudio';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration, formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar, Clock, Share2, Download, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';

interface EpisodePageProps {
  params: Promise<{
    slug: string;
    episode: string;
  }>;
}

export default function EpisodePage(props: EpisodePageProps) {
  const params = use(props.params);
  const { data: podcast, isLoading, error } = usePodcastBySlug(params.slug);
  const { currentEpisode, playbackState, playEpisode } = useAudio();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-6 w-32" />
        <div className="flex flex-col lg:flex-row gap-8">
          <Skeleton className="w-full lg:w-96 h-96 rounded-2xl" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !podcast) {
    notFound();
  }

  const episode = podcast.episodes.find(ep => ep.slug === params.episode);
  
  if (!episode) {
    notFound();
  }

  const isCurrentEpisode = currentEpisode?.episode.id === episode.id;
  const episodeIndex = podcast.episodes.findIndex(ep => ep.id === episode.id);
  const previousEpisode = episodeIndex < podcast.episodes.length - 1 ? podcast.episodes[episodeIndex + 1] : null;
  const nextEpisode = episodeIndex > 0 ? podcast.episodes[episodeIndex - 1] : null;

  const handlePlay = () => {
    playEpisode({ episode, podcast });
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link 
          href={`/podcast/${podcast.slug}`}
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {podcast.title}
        </Link>
      </div>

      {/* Episode Header */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Episode Artwork */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-2xl">
            <Image
              src={episode.thumbnailUrl || podcast.imageUrl}
              alt={episode.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Episode Info */}
        <div className="flex-1 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                {episode.title}
              </h1>
              {podcast.isExplicit && (
                <Badge variant="secondary" className="mt-1">
                  Explicit
                </Badge>
              )}
            </div>

            <Link 
              href={`/podcast/${podcast.slug}`}
              className="text-lg text-primary hover:underline"
            >
              {podcast.title}
            </Link>

            {/* Episode Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(episode.publishDate)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(episode.duration)}</span>
              </div>

              {episode.episodeNumber && (
                <Badge variant="outline">
                  Episode {episode.episodeNumber}
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {episode.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <PlayButton
              isPlaying={isCurrentEpisode && playbackState.isPlaying}
              isLoading={isCurrentEpisode && playbackState.isLoading}
              onClick={handlePlay}
              size="lg"
              className="px-8"
            />

            <Button variant="outline" size="lg">
              <Heart className="h-4 w-4 mr-2" />
              Like
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

      {/* Episode Navigation */}
      <div className="flex items-center justify-between p-6 bg-muted/50 rounded-lg">
        <div className="flex-1">
          {previousEpisode ? (
            <Link
              href={`/podcast/${podcast.slug}/episode/${previousEpisode.slug}`}
              className="flex items-center gap-3 p-3 hover:bg-background rounded-lg transition-colors group"
            >
              <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Previous Episode</p>
                <p className="font-medium truncate">{previousEpisode.title}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>

        <div className="flex-1 text-right">
          {nextEpisode ? (
            <Link
              href={`/podcast/${podcast.slug}/episode/${nextEpisode.slug}`}
              className="flex items-center justify-end gap-3 p-3 hover:bg-background rounded-lg transition-colors group"
            >
              <div className="min-w-0 text-right">
                <p className="text-sm text-muted-foreground">Next Episode</p>
                <p className="font-medium truncate">{nextEpisode.title}</p>
              </div>
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Show Notes */}
      {episode.showNotes && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Show Notes</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: episode.showNotes }} />
          </div>
        </div>
      )}
    </div>
  );
}
