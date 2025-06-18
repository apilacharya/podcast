import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EditEpisodeForm } from '@/components/forms/EditEpisodeForm';

interface EditEpisodePageProps {
  params: {
    podcastId: string;
    episodeId: string;
  };
}

async function getEpisode(episodeId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/episodes/${episodeId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch episode');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching episode:', error);
    throw new Error('Failed to fetch episode');
  }
}

async function getPodcast(podcastId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/podcasts/${podcastId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch podcast');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching podcast:', error);
    throw new Error('Failed to fetch podcast');
  }
}

export default async function EditEpisodePage({ params }: EditEpisodePageProps) {
  const [episode, podcast] = await Promise.all([
    getEpisode(params.episodeId),
    getPodcast(params.podcastId)
  ]);

  if (!episode || !podcast) {
    notFound();
  }

  // Verify episode belongs to podcast
  if (episode.podcast_id !== params.podcastId) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/podcasts/${params.podcastId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Podcast
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Episode</h1>
          <p className="text-muted-foreground mt-1">
            Update episode information for "{podcast.title}"
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Episode Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <EditEpisodeForm 
              episode={episode} 
              podcastId={params.podcastId}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
