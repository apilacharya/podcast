import { PodcastCategory } from "@/types";

export const PODCAST_CATEGORIES: PodcastCategory[] = [
  "Technology",
  "Business",
  "Education",
  "Comedy",
  "News",
  "True Crime",
  "Health & Fitness",
  "Science",
  "Society & Culture",
  "History",
  "Arts",
  "Sports",
  "Music",
  "Fiction",
  "Self Improvement",
];

// Alias for backward compatibility
export const CATEGORIES = PODCAST_CATEGORIES;

export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const AUDIO_FORMATS = ["mp3", "wav", "m4a", "aac", "ogg"];

export const MAX_AUDIO_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const STORAGE_KEYS = {
  FAVORITES: "podcast_favorites",
  RECENTLY_PLAYED: "podcast_recently_played",
  USER_PREFERENCES: "podcast_user_preferences",
  PLAYBACK_POSITION: "podcast_playback_position",
  UPLOADED_PODCASTS: "podcast_uploaded",
} as const;

export const API_DELAYS = {
  SEARCH: 300, // ms
  UPLOAD: 100, // ms per chunk
  FETCH: 500, // ms
} as const;

export const EPISODES_PER_PAGE = 20;
export const PODCASTS_PER_PAGE = 12;

export const DEFAULT_PODCAST_IMAGE = "/images/default-podcast.jpg";
export const DEFAULT_EPISODE_IMAGE = "/images/default-episode.jpg";
