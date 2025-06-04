import { useQuery } from "@tanstack/react-query";
import {
  getPodcasts,
  getPodcastBySlug,
  getPodcastsByCategory,
} from "@/api/podcasts";
import { getEpisodesByPodcast, getRecentEpisodes } from "@/api/episodes";
import { searchPodcasts, searchEpisodes } from "@/api/search";

export function usePodcasts() {
  return useQuery({
    queryKey: ["podcasts"],
    queryFn: getPodcasts,
  });
}

export function usePodcast(slug: string) {
  return useQuery({
    queryKey: ["podcast", slug],
    queryFn: () => getPodcastBySlug(slug),
    enabled: !!slug,
  });
}

export const usePodcastBySlug = usePodcast;

export function usePodcastsByCategory(category: string) {
  return useQuery({
    queryKey: ["podcasts", "category", category],
    queryFn: () => getPodcastsByCategory(category),
    enabled: !!category,
  });
}

export function useEpisodes(podcastSlug: string) {
  return useQuery({
    queryKey: ["episodes", podcastSlug],
    queryFn: () => getEpisodesByPodcast(podcastSlug),
    enabled: !!podcastSlug,
  });
}

export function useRecentEpisodes(limit?: number) {
  return useQuery({
    queryKey: ["episodes", "recent", limit],
    queryFn: () => getRecentEpisodes(limit),
  });
}

export function useSearchPodcasts(query: string) {
  return useQuery({
    queryKey: ["search", "podcasts", query],
    queryFn: () => searchPodcasts(query),
    enabled: query.length > 2,
  });
}

export function useSearchEpisodes(query: string) {
  return useQuery({
    queryKey: ["search", "episodes", query],
    queryFn: () => searchEpisodes(query),
    enabled: query.length > 2,
  });
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const [podcasts, episodes] = await Promise.all([
        searchPodcasts(query),
        searchEpisodes(query),
      ]);
      return { podcasts, episodes };
    },
    enabled: query.length > 2,
  });
}
