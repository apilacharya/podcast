"use client";

import { useState } from "react";
import { usePodcasts, usePodcastsByCategory } from "@/hooks/usePodcasts";
import { PodcastCard } from "@/components/podcast/PodcastCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/constants";
import { Search, Grid, List } from "lucide-react";

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: allPodcasts, isLoading: isLoadingAll } = usePodcasts();
  const { data: categoryPodcasts, isLoading: isLoadingCategory } =
    usePodcastsByCategory(selectedCategory === "All" ? "" : selectedCategory);

  const podcasts = selectedCategory === "All" ? allPodcasts : categoryPodcasts;
  const isLoading =
    selectedCategory === "All" ? isLoadingAll : isLoadingCategory;

  // Filter podcasts by search query
  const filteredPodcasts =
    podcasts?.filter(
      (podcast) =>
        podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        podcast.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        podcast.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const categories = ["All", ...CATEGORIES];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Discover Podcasts</h1>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search podcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start flex-wrap h-auto p-1">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="flex-shrink-0"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-8">
            <div className="space-y-6">
              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  {filteredPodcasts.length} podcasts found
                  {searchQuery && ` for "${searchQuery}"`}
                  {category !== "All" && ` in ${category}`}
                </p>
              </div>

              {/* Results Grid/List */}
              {filteredPodcasts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      No podcasts found
                    </h3>
                    <p>
                      Try adjusting your search or browse different categories.
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredPodcasts.map((podcast) => (
                    <PodcastCard
                      key={podcast.id}
                      podcast={podcast}
                      className={viewMode === "list" ? "flex-row" : ""}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
