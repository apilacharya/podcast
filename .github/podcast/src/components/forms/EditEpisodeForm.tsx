'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Episode } from '@/types/database';

const editEpisodeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(5000, 'Description too long'),
  episode_number: z.number().int().positive().optional(),
  season_number: z.number().int().positive().optional(),
  published_at: z.string().optional(),
});

type EditEpisodeFormData = z.infer<typeof editEpisodeSchema>;

interface EditEpisodeFormProps {
  episode: Episode;
  onSuccess?: (episode: Episode) => void;
  onCancel?: () => void;
}

export default function EditEpisodeForm({ episode, onSuccess, onCancel }: EditEpisodeFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditEpisodeFormData>({
    resolver: zodResolver(editEpisodeSchema),
    defaultValues: {
      title: episode.title,
      description: episode.description,
      episode_number: episode.episode_number || undefined,
      season_number: episode.season_number || undefined,
      published_at: episode.published_at ? 
        new Date(episode.published_at).toISOString().slice(0, 16) : 
        undefined,
    },
  });

  const onSubmit = async (data: EditEpisodeFormData) => {
    try {
      setIsLoading(true);

      const updateData = {
        title: data.title,
        description: data.description,
        episode_number: data.episode_number || null,
        season_number: data.season_number || null,
        published_at: data.published_at ? new Date(data.published_at).toISOString() : episode.published_at,
      };

      const response = await fetch(`/api/episodes/${episode.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update episode');
      }

      const { episode: updatedEpisode } = await response.json();
      onSuccess?.(updatedEpisode);
    } catch (error) {
      console.error('Error updating episode:', error);
      alert(error instanceof Error ? error.message : 'Failed to update episode');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Edit Episode</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Episode Title *</Label>
              <Input
                id="title"
                placeholder="Enter episode title"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your episode in detail..."
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="episode_number">Episode Number</Label>
                <Input
                  id="episode_number"
                  type="number"
                  min="1"
                  placeholder="e.g., 1"
                  {...register('episode_number', { 
                    setValueAs: (value) => value === '' ? undefined : parseInt(value) 
                  })}
                />
                {errors.episode_number && (
                  <p className="text-sm text-destructive">{errors.episode_number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="season_number">Season Number</Label>
                <Input
                  id="season_number"
                  type="number"
                  min="1"
                  placeholder="e.g., 1"
                  {...register('season_number', { 
                    setValueAs: (value) => value === '' ? undefined : parseInt(value) 
                  })}
                />
                {errors.season_number && (
                  <p className="text-sm text-destructive">{errors.season_number.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="published_at">Publish Date & Time</Label>
              <div className="relative">
                <Input
                  id="published_at"
                  type="datetime-local"
                  {...register('published_at')}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to keep current publish date, or set a future date to schedule the episode
              </p>
              {errors.published_at && (
                <p className="text-sm text-destructive">{errors.published_at.message}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Audio Information (Read-only) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Audio Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration</Label>
                <div className="text-sm text-muted-foreground">
                  {episode.duration ? `${Math.floor(episode.duration / 60)}:${(episode.duration % 60).toString().padStart(2, '0')}` : 'Unknown'}
                </div>
              </div>
              <div className="space-y-2">
                <Label>File Size</Label>
                <div className="text-sm text-muted-foreground">
                  {episode.file_size ? `${(episode.file_size / (1024 * 1024)).toFixed(1)} MB` : 'Unknown'}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              To change the audio file, please create a new episode and delete this one.
            </p>
          </div>

          <Separator />

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Episode'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
