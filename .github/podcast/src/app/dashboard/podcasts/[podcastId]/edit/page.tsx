'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import EditPodcastForm from '@/components/forms/EditPodcastForm';
import { Podcast } from '@/types/database';

export default function EditPodcastPage() {
  const router = useRouter();
  const params = useParams();
  const podcastId = params.podcastId as string;
  
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPodcast();
  }, [podcastId]);

  const fetchPodcast = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/podcasts/${podcastId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch podcast');
      }

      const { podcast: podcastData } = await response.json();
      setPodcast(podcastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch podcast');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (updatedPodcast: Podcast) => {
    router.push(`/dashboard/podcasts/${updatedPodcast.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Card className="w-full max-w-2xl">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-48 w-48 mx-auto" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !podcast) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-destructive mb-4">{error || 'Podcast not found'}</p>
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Podcast
        </Button>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Edit Podcast</h1>
          <p className="text-muted-foreground">
            Update your podcast information and settings.
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <EditPodcastForm
          podcast={podcast}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
