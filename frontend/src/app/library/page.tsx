"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePodcasts } from "@/hooks/usePodcasts";
import { PodcastCard } from "@/components/podcast/PodcastCard";
import { EpisodeCard } from "@/components/podcast/EpisodeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, History, Upload, Trash2 } from "lucide-react";
import { Podcast, Episode } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

interface FavoriteItem {
  id: string;
  type: "podcast" | "episode";
  podcastId?: string;
  addedAt: string;
}

interface PlayHistoryItem {
  episodeId: string;
  podcastId: string;
  playedAt: string;
  progress: number;
}

export default function LibraryPage() {
  const [favorites] = useLocalStorage<FavoriteItem[]>("favorites", []);
  const [playHistory] = useLocalStorage<PlayHistoryItem[]>("playHistory", []);
  const [uploadedPodcasts] = useLocalStorage<Podcast[]>("uploadedPodcasts", []);

  const { data: allPodcasts, isLoading } = usePodcasts();
  const [activeTab, setActiveTab] = useState<
    "favorites" | "history" | "uploads"
  >("favorites");

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Get favorite podcasts and episodes
  const favoritePodcasts = favorites
    .filter((fav) => fav.type === "podcast")
    .map((fav) => allPodcasts?.find((p) => p.id === fav.id))
    .filter(Boolean) as Podcast[];

  const favoriteEpisodes = favorites
    .filter((fav) => fav.type === "episode")
    .map((fav) => {
      const podcast = allPodcasts?.find((p) => p.id === fav.podcastId);
      const episode = podcast?.episodes.find((e) => e.id === fav.id);
      return episode && podcast ? { episode, podcast } : null;
    })
    .filter(Boolean) as Array<{ episode: Episode; podcast: Podcast }>;

  // Get recent episodes from play history
  const recentEpisodes = playHistory
    .slice(0, 20)
    .map((item) => {
      const podcast = allPodcasts?.find((p) => p.id === item.podcastId);
      const episode = podcast?.episodes.find((e) => e.id === item.episodeId);
      return episode && podcast
        ? { episode, podcast, playedAt: item.playedAt, progress: item.progress }
        : null;
    })
    .filter(Boolean) as Array<{
    episode: Episode;
    podcast: Podcast;
    playedAt: string;
    progress: number;
  }>;

  const clearHistory = () => {
    localStorage.removeItem("playHistory");
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Library</h1>

        <Button variant="outline" asChild>
          <a href="/upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Podcast
          </a>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Favorites ({favorites.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recently Played ({recentEpisodes.length})
          </TabsTrigger>
          <TabsTrigger value="uploads" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Your Uploads ({uploadedPodcasts.length})
          </TabsTrigger>
        </TabsList>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="space-y-8">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
              <p className="text-muted-foreground">
                Start adding podcasts and episodes to your favorites to see them
                here.
              </p>
            </div>
          ) : (
            <>
              {/* Favorite Podcasts */}
              {favoritePodcasts.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Favorite Podcasts ({favoritePodcasts.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favoritePodcasts.map((podcast) => (
                      <PodcastCard key={podcast.id} podcast={podcast} />
                    ))}
                  </div>
                </div>
              )}

              {/* Favorite Episodes */}
              {favoriteEpisodes.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Favorite Episodes ({favoriteEpisodes.length})
                  </h2>
                  <div className="space-y-4">
                    {favoriteEpisodes.map(({ episode, podcast }) => (
                      <EpisodeCard
                        key={`${podcast.id}-${episode.id}`}
                        episode={episode}
                        podcast={podcast}
                        showPodcastName
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          {recentEpisodes.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No listening history</h3>
              <p className="text-muted-foreground">
                Episodes you play will appear here so you can easily find them
                again.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recently Played
                </h2>
                <Button variant="outline" size="sm" onClick={clearHistory}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear History
                </Button>
              </div>

              <div className="space-y-4">
                {recentEpisodes.map(
                  ({ episode, podcast, playedAt, progress }) => (
                    <div
                      key={`${podcast.id}-${episode.id}-${playedAt}`}
                      className="space-y-2"
                    >
                      <EpisodeCard
                        episode={episode}
                        podcast={podcast}
                        showPodcastName
                      />
                      <div className="flex items-center gap-4 text-sm text-muted-foreground ml-20">
                        <span>Played {formatRelativeTime(playedAt)}</span>
                        {progress > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {Math.round(progress * 100)}% complete
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </TabsContent>

        {/* Uploads Tab */}
        <TabsContent value="uploads" className="space-y-6">
          {uploadedPodcasts.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No uploads yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first podcast to get started.
              </p>
              <Button asChild>
                <a href="/upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Podcast
                </a>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Your Uploads
                </h2>
                <Button asChild>
                  <a href="/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New
                  </a>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {uploadedPodcasts.map((podcast) => (
                  <PodcastCard key={podcast.id} podcast={podcast} />
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
