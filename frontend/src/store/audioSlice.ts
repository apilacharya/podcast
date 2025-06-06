import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AudioState, CurrentEpisode, PlaybackState, Episode } from "@/types";

const initialPlaybackState: PlaybackState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  playbackRate: 1,
  isMuted: false,
  isLoading: false,
};

const initialState: AudioState = {
  currentEpisode: null,
  playbackState: initialPlaybackState,
  queue: [],
  currentIndex: 0,
  isMinimized: false,
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    setCurrentEpisode: (state, action: PayloadAction<CurrentEpisode>) => {
      state.currentEpisode = action.payload;
      state.playbackState.currentTime = 0;
      state.playbackState.duration = action.payload.episode.duration;
      state.playbackState.isLoading = true;
    },

    play: (state) => {
      state.playbackState.isPlaying = true;
      state.playbackState.isLoading = false;
    },

    pause: (state) => {
      state.playbackState.isPlaying = false;
    },

    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.playbackState.currentTime = action.payload;
    },

    setDuration: (state, action: PayloadAction<number>) => {
      state.playbackState.duration = action.payload;
    },

    setVolume: (state, action: PayloadAction<number>) => {
      state.playbackState.volume = Math.max(0, Math.min(1, action.payload));
      if (action.payload > 0) {
        state.playbackState.isMuted = false;
      }
    },

    setPlaybackRate: (state, action: PayloadAction<number>) => {
      state.playbackState.playbackRate = action.payload;
    },

    toggleMute: (state) => {
      state.playbackState.isMuted = !state.playbackState.isMuted;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.playbackState.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | undefined>) => {
      state.playbackState.error = action.payload;
    },

    setQueue: (state, action: PayloadAction<Episode[]>) => {
      state.queue = action.payload;
    },

    addToQueue: (state, action: PayloadAction<Episode>) => {
      state.queue.push(action.payload);
    },

    removeFromQueue: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter(
        (episode) => episode.id !== action.payload
      );
    },

    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },

    nextEpisode: (state) => {
      if (state.currentIndex < state.queue.length - 1) {
        state.currentIndex += 1;
      }
    },

    previousEpisode: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      }
    },

    toggleMinimized: (state) => {
      state.isMinimized = !state.isMinimized;
    },

    reset: () => initialState,
  },
});

export const {
  setCurrentEpisode,
  play,
  pause,
  setCurrentTime,
  setDuration,
  setVolume,
  setPlaybackRate,
  toggleMute,
  setLoading,
  setError,
  setQueue,
  addToQueue,
  removeFromQueue,
  setCurrentIndex,
  nextEpisode,
  previousEpisode,
  toggleMinimized,
  reset,
} = audioSlice.actions;

export default audioSlice.reducer;
