import { mockPodcasts } from "@/data/mockData";
import { Suspense } from "react";
import PodcastClientPage from "./PodcastClientPage";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-static";
export const revalidate = false;

function PodcastPageFallback() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Skeleton className="w-full md:w-80 h-80 rounded-2xl" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return mockPodcasts.map((podcast) => ({
    slug: podcast.slug,
  }));
}

interface PodcastPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function PodcastPage(props: PodcastPageProps) {
  return (
    <Suspense fallback={<PodcastPageFallback />}>
      <PodcastClientPage {...props} />
    </Suspense>
  );
}
