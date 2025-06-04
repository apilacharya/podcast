import { mockPodcasts } from "@/data/mockData";
import EpisodeClientPage from "./EpisodeClientPage";

export async function generateStaticParams() {
  const params: { slug: string; episode: string }[] = [];

  mockPodcasts.forEach((podcast) => {
    podcast.episodes.forEach((episode) => {
      params.push({
        slug: podcast.slug,
        episode: episode.slug,
      });
    });
  });

  return params;
}

interface EpisodePageProps {
  params: Promise<{
    slug: string;
    episode: string;
  }>;
}

export default function EpisodePage(props: EpisodePageProps) {
  return <EpisodeClientPage {...props} />;
}
