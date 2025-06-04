'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/hooks/usePodcasts';
import { PodcastCard } from '@/components/podcast/PodcastCard';
import { EpisodeCard } from '@/components/podcast/EpisodeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'podcasts' | 'episodes'>('all');
  
  const debouncedQuery = useDebounce(query, 300);
  const { data: searchResults, isLoading } = useSearch(debouncedQuery);

  // Filter results by selected categories
  const filteredResults = useMemo(() => {
    if (!searchResults || selectedCategories.length === 0) {
      return searchResults;
    }

    return {
      podcasts: searchResults.podcasts.filter(podcast =>
        selectedCategories.includes(podcast.category)
      ),
      episodes: searchResults.episodes.filter(episode =>
        selectedCategories.includes(episode.podcast.category)
      )
    };
  }, [searchResults, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  const results = filteredResults || { podcasts: [], episodes: [] };
  const totalResults = results.podcasts.length + results.episodes.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Search Podcasts</h1>

        {/* Search Input */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for podcasts, episodes, or creators..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11 text-lg h-12"
            autoFocus
          />
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filter by category:</span>
            {selectedCategories.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                className="cursor-pointer transition-colors"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {debouncedQuery ? (
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  {totalResults === 0
                    ? `No results found for "${debouncedQuery}"`
                    : `${totalResults} results found for "${debouncedQuery}"`}
                  {selectedCategories.length > 0 && (
                    <span> in {selectedCategories.join(', ')}</span>
                  )}
                </p>
              </div>

              {totalResults === 0 ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No results found</h3>
                    <p>Try different keywords or check your spelling.</p>
                  </div>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
                  <TabsList>
                    <TabsTrigger value="all">
                      All ({totalResults})
                    </TabsTrigger>
                    <TabsTrigger value="podcasts">
                      Podcasts ({results.podcasts.length})
                    </TabsTrigger>
                    <TabsTrigger value="episodes">
                      Episodes ({results.episodes.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-8">
                    {results.podcasts.length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Podcasts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {results.podcasts.slice(0, 8).map((podcast) => (
                            <PodcastCard key={podcast.id} podcast={podcast} />
                          ))}
                        </div>
                      </div>
                    )}

                    {results.episodes.length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Episodes</h2>
                        <div className="space-y-4">
                          {results.episodes.slice(0, 10).map((episode) => (
                            <EpisodeCard
                              key={`${episode.podcast.id}-${episode.id}`}
                              episode={episode}
                              podcast={episode.podcast}
                              showPodcastName
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="podcasts" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {results.podcasts.map((podcast) => (
                        <PodcastCard key={podcast.id} podcast={podcast} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="episodes" className="space-y-4">
                    <div className="space-y-4">
                      {results.episodes.map((episode) => (
                        <EpisodeCard
                          key={`${episode.podcast.id}-${episode.id}`}
                          episode={episode}
                          podcast={episode.podcast}
                          showPodcastName
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Start searching</h3>
            <p>Enter a keyword to find podcasts and episodes.</p>
          </div>
        </div>
      )}
    </div>
  );
}
