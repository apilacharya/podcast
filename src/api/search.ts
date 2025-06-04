import { mockPodcasts } from "@/data/mockData";
import { Podcast, Episode } from "@/types";
import { API_DELAYS } from "@/lib/constants";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function searchPodcasts(query: string): Promise<Podcast[]> {
  await delay(API_DELAYS.SEARCH);

  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();

  return mockPodcasts.filter(
    (podcast) =>
      podcast.title.toLowerCase().includes(searchTerm) ||
      podcast.description.toLowerCase().includes(searchTerm) ||
      podcast.author.toLowerCase().includes(searchTerm) ||
      podcast.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
      podcast.category.toLowerCase().includes(searchTerm)
  );
}

export async function searchEpisodes(
  query: string
): Promise<(Episode & { podcast: Podcast })[]> {
  await delay(API_DELAYS.SEARCH);

  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();
  const allEpisodes: (Episode & { podcast: Podcast })[] = [];

  mockPodcasts.forEach((podcast) => {
    const filteredEpisodes = podcast.episodes.filter(
      (episode) =>
        episode.title.toLowerCase().includes(searchTerm) ||
        episode.description.toLowerCase().includes(searchTerm) ||
        episode.showNotes?.toLowerCase().includes(searchTerm)
    );

    filteredEpisodes.forEach((episode) => {
      allEpisodes.push({ ...episode, podcast });
    });
  });

  return allEpisodes;
}

export async function searchAll(query: string): Promise<{
  podcasts: Podcast[];
  episodes: (Episode & { podcast: Podcast })[];
}> {
  const [podcasts, episodes] = await Promise.all([
    searchPodcasts(query),
    searchEpisodes(query),
  ]);

  return { podcasts, episodes };
}
