import { mockPodcasts } from "@/data/mockData";
import { Suspense } from "react";
import EpisodeClientPage from "./EpisodeClientPage";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-static";
export const revalidate = false;

function EpisodePageFallback() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-6 w-32" />
      <div className="flex flex-col lg:flex-row gap-8">
        <Skeleton className="w-full lg:w-96 h-96 rounded-2xl" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}

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
  return (
    <Suspense fallback={<EpisodePageFallback />}>
      <EpisodeClientPage {...props} />
    </Suspense>
  );
}
