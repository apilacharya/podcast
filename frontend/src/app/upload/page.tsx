"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  File,
  Image as ImageIcon,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { Podcast, Episode } from "@/types";
import { CATEGORIES } from "@/lib/constants";

export default function UploadPage() {
  const [uploadedPodcasts, setUploadedPodcasts] = useLocalStorage<Podcast[]>(
    "uploadedPodcasts",
    []
  );
  const [activeTab, setActiveTab] = useState<"podcast" | "episode">("podcast");

  // Podcast form state
  const [podcastForm, setPodcastForm] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    website: "",
    isExplicit: false,
  });

  // Episode form state
  const [episodeForm, setEpisodeForm] = useState({
    title: "",
    description: "",
    episodeNumber: "",
    season: "",
    podcastId: "",
    isExplicit: false,
  });

  // File upload state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    }
  };

  const simulateUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    setIsUploading(false);
    setUploadSuccess(true);

    // Reset form after success
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadProgress(0);
      setAudioFile(null);
      setImageFile(null);
      if (activeTab === "podcast") {
        setPodcastForm({
          title: "",
          author: "",
          description: "",
          category: "",
          website: "",
          isExplicit: false,
        });
      } else {
        setEpisodeForm({
          title: "",
          description: "",
          episodeNumber: "",
          season: "",
          podcastId: "",
          isExplicit: false,
        });
      }
    }, 2000);
  };

  const handlePodcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile || !podcastForm.title || !podcastForm.author) {
      return;
    }

    await simulateUpload();

    // Create new podcast
    const newPodcast: Podcast = {
      id: `uploaded-${Date.now()}`,
      title: podcastForm.title,
      author: podcastForm.author,
      description: podcastForm.description,
      imageUrl: imageFile
        ? URL.createObjectURL(imageFile)
        : "/images/podcasts/default.jpg",
      category: podcastForm.category || "Other",
      slug: podcastForm.title.toLowerCase().replace(/\s+/g, "-"),
      language: "en",
      tags: [],
      isExplicit: podcastForm.isExplicit,
      episodes: [
        {
          id: `episode-${Date.now()}`,
          title: "Episode 1",
          description: "First episode",
          audioUrl: URL.createObjectURL(audioFile),
          duration: 0, // Would be extracted from audio file
          publishDate: new Date().toISOString(),
          episodeNumber: 1,
          seasonNumber: 1,
          slug: "episode-1",
        },
      ],
      totalEpisodes: 1,
      subscriberCount: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUploadedPodcasts((prev) => [...prev, newPodcast]);
  };

  const handleEpisodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile || !episodeForm.title || !episodeForm.podcastId) {
      return;
    }

    await simulateUpload();

    // Add episode to existing podcast
    const newEpisode: Episode = {
      id: `episode-${Date.now()}`,
      title: episodeForm.title,
      description: episodeForm.description,
      audioUrl: URL.createObjectURL(audioFile),
      duration: 0,
      publishDate: new Date().toISOString(),
      episodeNumber: parseInt(episodeForm.episodeNumber) || 1,
      seasonNumber: parseInt(episodeForm.season) || undefined,
      slug: episodeForm.title.toLowerCase().replace(/\s+/g, "-"),
    };

    setUploadedPodcasts((prev) =>
      prev.map((podcast) =>
        podcast.id === episodeForm.podcastId
          ? {
              ...podcast,
              episodes: [newEpisode, ...podcast.episodes],
              totalEpisodes: podcast.totalEpisodes + 1,
              lastUpdated: new Date().toISOString(),
            }
          : podcast
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Upload Your Podcast</h1>
        <p className="text-muted-foreground">
          Share your audio content with the world. Upload a new podcast or add
          episodes to existing ones.
        </p>
      </div>

      {/* Upload Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="podcast">New Podcast</TabsTrigger>
          <TabsTrigger value="episode">Add Episode</TabsTrigger>
        </TabsList>

        {/* New Podcast Tab */}
        <TabsContent value="podcast">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Create New Podcast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePodcastSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Podcast Title *
                    </label>
                    <Input
                      value={podcastForm.title}
                      onChange={(e) =>
                        setPodcastForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter podcast title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Author/Creator *
                    </label>
                    <Input
                      value={podcastForm.author}
                      onChange={(e) =>
                        setPodcastForm((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
                      placeholder="Enter author name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                    value={podcastForm.description}
                    onChange={(e) =>
                      setPodcastForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your podcast..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={podcastForm.category}
                      onChange={(e) =>
                        setPodcastForm((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Website (Optional)
                    </label>
                    <Input
                      type="url"
                      value={podcastForm.website}
                      onChange={(e) =>
                        setPodcastForm((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                      placeholder="https://yourpodcast.com"
                    />
                  </div>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Audio File */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      First Episode Audio File *
                    </label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioFileChange}
                        className="hidden"
                        id="audio-upload"
                      />
                      <label htmlFor="audio-upload" className="cursor-pointer">
                        <File className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {audioFile
                            ? audioFile.name
                            : "Click to upload audio file"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          MP3, WAV, M4A up to 500MB
                        </p>
                      </label>
                      {audioFile && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAudioFile(null)}
                          className="mt-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Podcast Artwork */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Podcast Artwork
                    </label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {imageFile
                            ? imageFile.name
                            : "Click to upload artwork"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG, minimum 1400x1400px
                        </p>
                      </label>
                      {imageFile && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setImageFile(null)}
                          className="mt-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Explicit Content */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="explicit-podcast"
                    checked={podcastForm.isExplicit}
                    onChange={(e) =>
                      setPodcastForm((prev) => ({
                        ...prev,
                        isExplicit: e.target.checked,
                      }))
                    }
                  />
                  <label htmlFor="explicit-podcast" className="text-sm">
                    This podcast contains explicit content
                  </label>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {uploadSuccess && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-4 w-4" />
                    <span>Podcast uploaded successfully!</span>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={
                    !audioFile ||
                    !podcastForm.title ||
                    !podcastForm.author ||
                    isUploading
                  }
                  className="w-full"
                >
                  {isUploading ? "Uploading..." : "Create Podcast"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Episode Tab */}
        <TabsContent value="episode">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Add New Episode
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedPodcasts.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    No podcasts found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You need to create a podcast first before adding episodes.
                  </p>
                  <Button onClick={() => setActiveTab("podcast")}>
                    Create New Podcast
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleEpisodeSubmit} className="space-y-6">
                  {/* Select Podcast */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Select Podcast *
                    </label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={episodeForm.podcastId}
                      onChange={(e) =>
                        setEpisodeForm((prev) => ({
                          ...prev,
                          podcastId: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Choose a podcast</option>
                      {uploadedPodcasts.map((podcast) => (
                        <option key={podcast.id} value={podcast.id}>
                          {podcast.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Episode Info */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Episode Title *
                    </label>
                    <Input
                      value={episodeForm.title}
                      onChange={(e) =>
                        setEpisodeForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter episode title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Episode Description
                    </label>
                    <textarea
                      className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                      value={episodeForm.description}
                      onChange={(e) =>
                        setEpisodeForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe this episode..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Episode Number
                      </label>
                      <Input
                        type="number"
                        value={episodeForm.episodeNumber}
                        onChange={(e) =>
                          setEpisodeForm((prev) => ({
                            ...prev,
                            episodeNumber: e.target.value,
                          }))
                        }
                        placeholder="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Season</label>
                      <Input
                        type="number"
                        value={episodeForm.season}
                        onChange={(e) =>
                          setEpisodeForm((prev) => ({
                            ...prev,
                            season: e.target.value,
                          }))
                        }
                        placeholder="1"
                      />
                    </div>
                  </div>

                  {/* Audio File Upload */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Episode Audio File *
                    </label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioFileChange}
                        className="hidden"
                        id="episode-audio-upload"
                      />
                      <label
                        htmlFor="episode-audio-upload"
                        className="cursor-pointer"
                      >
                        <File className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {audioFile
                            ? audioFile.name
                            : "Click to upload audio file"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          MP3, WAV, M4A up to 500MB
                        </p>
                      </label>
                      {audioFile && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAudioFile(null)}
                          className="mt-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Explicit Content */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="explicit-episode"
                      checked={episodeForm.isExplicit}
                      onChange={(e) =>
                        setEpisodeForm((prev) => ({
                          ...prev,
                          isExplicit: e.target.checked,
                        }))
                      }
                    />
                    <label htmlFor="explicit-episode" className="text-sm">
                      This episode contains explicit content
                    </label>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="h-4 w-4" />
                      <span>Episode uploaded successfully!</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={
                      !audioFile ||
                      !episodeForm.title ||
                      !episodeForm.podcastId ||
                      isUploading
                    }
                    className="w-full"
                  >
                    {isUploading ? "Uploading..." : "Add Episode"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
