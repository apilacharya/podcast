"use client";

import { usePodcasts } from "@/hooks/usePodcasts";
import { PodcastCard } from "@/components/podcast/PodcastCard";
import { EpisodeCard } from "@/components/podcast/EpisodeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants";
import { Podcast, Episode } from "@/types";
import { Play, TrendingUp, Clock, Star } from "lucide-react";

export default function Home() {
  const { data: podcasts, isLoading } = usePodcasts();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!podcasts) return null;

  // Get featured podcasts (first 3)
  const featuredPodcasts = podcasts.slice(0, 3);

  // Get recent episodes from all podcasts
  const recentEpisodes = podcasts
    .flatMap((podcast) =>
      podcast.episodes.map((episode) => ({ ...episode, podcast }))
    )
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 6);

  // Get trending podcasts (podcasts with most episodes)
  const trendingPodcasts = [...podcasts]
    .sort((a, b) => b.episodes.length - a.episodes.length)
    .slice(0, 8);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Podcasts
          </h1>
          <p className="text-xl mb-6 text-blue-100">
            Stream thousands of audio podcasts from creators around the world
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            <Play className="w-5 h-5 mr-2" />
            Start Listening
          </Button>
        </div>
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl" />
      </section>

      {/* Featured Podcasts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">Featured Podcasts</h2>
          </div>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPodcasts.map((podcast) => (
            <div key={podcast.id} className="group">
              <PodcastCard podcast={podcast} featured />
            </div>
          ))}
        </div>
      </section>

      {/* Recent Episodes */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold">Recently Added</h2>
          </div>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentEpisodes.map((episode) => (
            <EpisodeCard
              key={`${episode.podcast.id}-${episode.id}`}
              episode={episode}
              podcast={episode.podcast}
              showPodcastName
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold">Browse by Category</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="text-sm px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>
      </section>

      {/* Trending Podcasts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold">Trending Now</h2>
          </div>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingPodcasts.map((podcast) => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </div>
      </section>
    </div>
  );
}
