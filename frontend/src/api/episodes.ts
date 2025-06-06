import { mockPodcasts } from "@/data/mockData";
import { Episode } from "@/types";
import { API_DELAYS } from "@/lib/constants";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getEpisodeBySlug(
  podcastSlug: string,
  episodeSlug: string
): Promise<Episode | null> {
  await delay(API_DELAYS.FETCH);

  const podcast = mockPodcasts.find((p) => p.slug === podcastSlug);
  if (!podcast) return null;

  const episode = podcast.episodes.find((e) => e.slug === episodeSlug);
  return episode || null;
}

export async function getEpisodesByPodcast(
  podcastSlug: string
): Promise<Episode[]> {
  await delay(API_DELAYS.FETCH);

  const podcast = mockPodcasts.find((p) => p.slug === podcastSlug);
  return podcast?.episodes || [];
}

export async function getRecentEpisodes(
  limit: number = 10
): Promise<Episode[]> {
  await delay(API_DELAYS.FETCH);

  const allEpisodes: Episode[] = [];
  mockPodcasts.forEach((podcast) => {
    allEpisodes.push(...podcast.episodes);
  });

  return allEpisodes
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    )
    .slice(0, limit);
}

export async function getEpisodeById(
  episodeId: string
): Promise<Episode | null> {
  await delay(API_DELAYS.FETCH);

  for (const podcast of mockPodcasts) {
    const episode = podcast.episodes.find((e) => e.id === episodeId);
    if (episode) return episode;
  }

  return null;
}
