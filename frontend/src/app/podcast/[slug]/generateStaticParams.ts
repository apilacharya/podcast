import { mockPodcasts } from "@/data/mockData";

export async function generateStaticParams() {
  return mockPodcasts.map((podcast) => ({
    slug: podcast.slug,
  }));
}
