import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Podcast } from "@/types";

interface PodcastState {
  podcasts: Podcast[];
  currentPodcast: Podcast | null;
  favorites: string[]; // podcast IDs
  recentlyPlayed: string[]; // episode IDs
  isLoading: boolean;
  error: string | null;
}

const initialState: PodcastState = {
  podcasts: [],
  currentPodcast: null,
  favorites: [],
  recentlyPlayed: [],
  isLoading: false,
  error: null,
};

const podcastSlice = createSlice({
  name: "podcast",
  initialState,
  reducers: {
    setPodcasts: (state, action: PayloadAction<Podcast[]>) => {
      state.podcasts = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    setCurrentPodcast: (state, action: PayloadAction<Podcast>) => {
      state.currentPodcast = action.payload;
    },

    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },

    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((id) => id !== action.payload);
    },

    toggleFavorite: (state, action: PayloadAction<string>) => {
      const podcastId = action.payload;
      if (state.favorites.includes(podcastId)) {
        state.favorites = state.favorites.filter((id) => id !== podcastId);
      } else {
        state.favorites.push(podcastId);
      }
    },

    addToRecentlyPlayed: (state, action: PayloadAction<string>) => {
      const episodeId = action.payload;
      // Remove if already exists to avoid duplicates
      state.recentlyPlayed = state.recentlyPlayed.filter(
        (id) => id !== episodeId
      );
      // Add to beginning of array
      state.recentlyPlayed.unshift(episodeId);
      // Keep only last 50 episodes
      state.recentlyPlayed = state.recentlyPlayed.slice(0, 50);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    addPodcast: (state, action: PayloadAction<Podcast>) => {
      state.podcasts.push(action.payload);
    },

    updatePodcast: (state, action: PayloadAction<Podcast>) => {
      const index = state.podcasts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.podcasts[index] = action.payload;
      }
    },

    deletePodcast: (state, action: PayloadAction<string>) => {
      state.podcasts = state.podcasts.filter((p) => p.id !== action.payload);
      if (state.currentPodcast?.id === action.payload) {
        state.currentPodcast = null;
      }
    },
  },
});

export const {
  setPodcasts,
  setCurrentPodcast,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  addToRecentlyPlayed,
  setLoading,
  setError,
  clearError,
  addPodcast,
  updatePodcast,
  deletePodcast,
} = podcastSlice.actions;

export default podcastSlice.reducer;
