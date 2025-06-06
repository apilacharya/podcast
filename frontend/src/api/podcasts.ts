import { mockPodcasts } from "@/data/mockData";
import { Podcast } from "@/types";
import { API_DELAYS } from "@/lib/constants";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPodcasts(): Promise<Podcast[]> {
  await delay(API_DELAYS.FETCH);
  return mockPodcasts;
}

export async function getPodcastBySlug(slug: string): Promise<Podcast | null> {
  await delay(API_DELAYS.FETCH);
  const podcast = mockPodcasts.find((p) => p.slug === slug);
  return podcast || null;
}

export async function getPodcastsByCategory(
  category: string
): Promise<Podcast[]> {
  await delay(API_DELAYS.FETCH);
  if (category === "all") return mockPodcasts;
  return mockPodcasts.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export async function getFeaturedPodcasts(): Promise<Podcast[]> {
  await delay(API_DELAYS.FETCH);
  return mockPodcasts.slice(0, 3);
}

export async function getPopularPodcasts(): Promise<Podcast[]> {
  await delay(API_DELAYS.FETCH);
  return mockPodcasts
    .sort((a, b) => (b.subscriberCount || 0) - (a.subscriberCount || 0))
    .slice(0, 6);
}

export async function getRecentPodcasts(): Promise<Podcast[]> {
  await delay(API_DELAYS.FETCH);
  return mockPodcasts
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 6);
}
