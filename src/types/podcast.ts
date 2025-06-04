export interface Episode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number; // in seconds
  publishDate: string;
  episodeNumber: number;
  seasonNumber?: number;
  thumbnailUrl?: string;
  showNotes?: string;
  slug: string;
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  imageUrl: string;
  episodes: Episode[];
  totalEpisodes: number;
  slug: string;
  language: string;
  tags: string[];
  rating?: number;
  subscriberCount?: number;
  isExplicit: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isMuted: boolean;
  isLoading: boolean;
  error?: string;
}

export interface CurrentEpisode {
  episode: Episode;
  podcast: Podcast;
}

export interface AudioState {
  currentEpisode: CurrentEpisode | null;
  playbackState: PlaybackState;
  queue: Episode[];
  currentIndex: number;
  isMinimized: boolean;
}

export interface UserPreferences {
  volume: number;
  playbackRate: number;
  autoplay: boolean;
  skipIntro: boolean;
  skipOutro: boolean;
  theme: "light" | "dark" | "system";
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
  error?: string;
}

export interface PodcastFormData {
  title: string;
  description: string;
  author: string;
  category: string;
  language: string;
  tags: string[];
  isExplicit: boolean;
  imageFile?: File;
}

export interface EpisodeFormData {
  title: string;
  description: string;
  episodeNumber: number;
  seasonNumber?: number;
  showNotes?: string;
  audioFile: File;
  thumbnailFile?: File;
}

export type PodcastCategory =
  | "Technology"
  | "Business"
  | "Education"
  | "Comedy"
  | "News"
  | "True Crime"
  | "Health & Fitness"
  | "Science"
  | "Society & Culture"
  | "History"
  | "Arts"
  | "Sports"
  | "Music"
  | "Fiction"
  | "Self Improvement";
