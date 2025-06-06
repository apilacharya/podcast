import { PodcastFormData, EpisodeFormData } from "@/types";
import {
  API_DELAYS,
  AUDIO_FORMATS,
  MAX_AUDIO_FILE_SIZE,
  MAX_IMAGE_FILE_SIZE,
} from "@/lib/constants";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface UploadProgress {
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
  error?: string;
}

export async function uploadPodcast(
  formData: PodcastFormData,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ success: boolean; podcastId?: string; error?: string }> {
  // Validate form data
  if (!formData.title.trim()) {
    return { success: false, error: "Podcast title is required" };
  }

  if (!formData.description.trim()) {
    return { success: false, error: "Podcast description is required" };
  }

  if (formData.imageFile && formData.imageFile.size > MAX_IMAGE_FILE_SIZE) {
    return { success: false, error: "Image file too large (max 5MB)" };
  }

  // Simulate upload progress
  const steps = [10, 25, 50, 75, 90, 100];

  for (const progress of steps) {
    await delay(API_DELAYS.UPLOAD * 10);
    onProgress?.({
      progress,
      status: progress < 100 ? "uploading" : "processing",
    });
  }

  // Simulate processing
  await delay(500);
  onProgress?.({ progress: 100, status: "complete" });

  // Generate mock podcast ID
  const podcastId = `podcast-${Date.now()}`;

  return { success: true, podcastId };
}

export async function uploadEpisode(
  podcastId: string,
  formData: EpisodeFormData,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ success: boolean; episodeId?: string; error?: string }> {
  // Validate form data
  if (!formData.title.trim()) {
    return { success: false, error: "Episode title is required" };
  }

  if (!formData.audioFile) {
    return { success: false, error: "Audio file is required" };
  }

  // Validate audio file
  const fileExtension = formData.audioFile.name.split(".").pop()?.toLowerCase();
  if (!fileExtension || !AUDIO_FORMATS.includes(fileExtension)) {
    return {
      success: false,
      error: `Invalid audio format. Supported formats: ${AUDIO_FORMATS.join(
        ", "
      )}`,
    };
  }

  if (formData.audioFile.size > MAX_AUDIO_FILE_SIZE) {
    return { success: false, error: "Audio file too large (max 100MB)" };
  }

  // Simulate upload progress
  const totalSize = formData.audioFile.size;
  const chunkSize = totalSize / 20; // 20 chunks

  for (let uploaded = 0; uploaded < totalSize; uploaded += chunkSize) {
    await delay(API_DELAYS.UPLOAD);
    const progress = Math.min(Math.round((uploaded / totalSize) * 100), 90);
    onProgress?.({
      progress,
      status: "uploading",
    });
  }

  // Simulate processing
  onProgress?.({ progress: 95, status: "processing" });
  await delay(1000);

  onProgress?.({ progress: 100, status: "complete" });

  // Generate mock episode ID
  const episodeId = `episode-${Date.now()}`;

  return { success: true, episodeId };
}

export function validateAudioFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  if (!fileExtension || !AUDIO_FORMATS.includes(fileExtension)) {
    return {
      valid: false,
      error: `Invalid audio format. Supported formats: ${AUDIO_FORMATS.join(
        ", "
      )}`,
    };
  }

  if (file.size > MAX_AUDIO_FILE_SIZE) {
    return { valid: false, error: "Audio file too large (max 100MB)" };
  }

  return { valid: true };
}

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid image format. Use JPG, PNG, or WebP",
    };
  }

  if (file.size > MAX_IMAGE_FILE_SIZE) {
    return { valid: false, error: "Image file too large (max 5MB)" };
  }

  return { valid: true };
}
