'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, ImageIcon, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Podcast } from '@/types/database';

const editPodcastSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(5000, 'Description too long'),
  category: z.string().min(1, 'Category is required'),
  language: z.string().min(1, 'Language is required'),
  explicit: z.boolean(),
  cover_image: z.instanceof(FileList).optional(),
});

type EditPodcastFormData = z.infer<typeof editPodcastSchema>;

interface EditPodcastFormProps {
  podcast: Podcast;
  onSuccess?: (podcast: Podcast) => void;
  onCancel?: () => void;
}

const PODCAST_CATEGORIES = [
  'Business', 'Comedy', 'Education', 'Fiction', 'Government', 'History',
  'Health & Fitness', 'Kids & Family', 'Leisure', 'Music', 'News',
  'Religion & Spirituality', 'Science', 'Society & Culture', 'Sports',
  'Technology', 'True Crime', 'TV & Film'
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ru', name: 'Russian' },
];

export default function EditPodcastForm({ podcast, onSuccess, onCancel }: EditPodcastFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(podcast.cover_image_url || null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditPodcastFormData>({
    resolver: zodResolver(editPodcastSchema),
    defaultValues: {
      title: podcast.title,
      description: podcast.description,
      category: podcast.category,
      language: podcast.language,
      explicit: podcast.explicit,
    },
  });

  const watchedCoverImage = watch('cover_image');

  useEffect(() => {
    if (watchedCoverImage && watchedCoverImage.length > 0) {
      const file = watchedCoverImage[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [watchedCoverImage]);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.url);
        } else {
          reject(new Error('Upload failed'));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Upload failed')));
      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    });
  };

  const onSubmit = async (data: EditPodcastFormData) => {
    try {
      setIsLoading(true);
      setUploadProgress(0);

      let coverImageUrl = podcast.cover_image_url;

      // Upload new cover image if provided
      if (data.cover_image && data.cover_image.length > 0) {
        coverImageUrl = await uploadFile(data.cover_image[0]);
      }

      const updateData = {
        title: data.title,
        description: data.description,
        category: data.category,
        language: data.language,
        explicit: data.explicit,
        cover_image_url: coverImageUrl,
      };

      const response = await fetch(`/api/podcasts/${podcast.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update podcast');
      }

      const { podcast: updatedPodcast } = await response.json();
      onSuccess?.(updatedPodcast);
    } catch (error) {
      console.error('Error updating podcast:', error);
      alert(error instanceof Error ? error.message : 'Failed to update podcast');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setValue('cover_image', undefined as any);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Edit Podcast</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Cover Image */}
          <div className="space-y-4">
            <Label htmlFor="cover_image">Cover Image</Label>
            
            {imagePreview ? (
              <div className="relative w-48 h-48 mx-auto">
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={handleImageRemove}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="w-48 h-48 mx-auto border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No image</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center">
              <Label htmlFor="cover_image" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors">
                  <Upload className="h-4 w-4" />
                  Change Image
                </div>
                <Input
                  id="cover_image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register('cover_image')}
                />
              </Label>
            </div>

            {uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading image...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {errors.cover_image && (
              <p className="text-sm text-destructive">{errors.cover_image.message}</p>
            )}
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Podcast Title *</Label>
              <Input
                id="title"
                placeholder="Enter your podcast title"
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
                placeholder="Describe your podcast in detail..."
                rows={4}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={watch('category')}
                  onValueChange={(value) => setValue('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PODCAST_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language *</Label>
                <Select
                  value={watch('language')}
                  onValueChange={(value) => setValue('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.language && (
                  <p className="text-sm text-destructive">{errors.language.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="explicit"
                className="rounded border-input"
                {...register('explicit')}
              />
              <Label htmlFor="explicit">
                This podcast contains explicit content
              </Label>
            </div>
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
                'Update Podcast'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
