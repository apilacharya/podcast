"use client";

import { useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  play,
  pause,
  setCurrentTime,
  setDuration,
  setVolume,
  setPlaybackRate,
  toggleMute,
  setLoading,
  setError,
  setCurrentEpisode,
} from "@/store/audioSlice";
import { CurrentEpisode } from "@/types";

export function useAudio() {
  const dispatch = useDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { currentEpisode, playbackState } = useSelector(
    (state: RootState) => state.audio
  );

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined" && !audioRef.current) {
      audioRef.current = new Audio();

      // Set up event listeners
      const audio = audioRef.current;

      const handleLoadStart = () => dispatch(setLoading(true));
      const handleCanPlay = () => dispatch(setLoading(false));
      const handleTimeUpdate = () => {
        if (audio.currentTime) {
          dispatch(setCurrentTime(audio.currentTime));
        }
      };
      const handleDurationChange = () => {
        if (audio.duration) {
          dispatch(setDuration(audio.duration));
        }
      };
      const handleError = (e: Event) => {
        const target = e.target as HTMLAudioElement;
        dispatch(setError(target.error?.message || "Audio playback error"));
      };
      const handleEnded = () => {
        dispatch(pause());
        dispatch(setCurrentTime(0));
      };

      audio.addEventListener("loadstart", handleLoadStart);
      audio.addEventListener("canplay", handleCanPlay);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("durationchange", handleDurationChange);
      audio.addEventListener("error", handleError);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("loadstart", handleLoadStart);
        audio.removeEventListener("canplay", handleCanPlay);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("durationchange", handleDurationChange);
        audio.removeEventListener("error", handleError);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [dispatch]);

  // Update audio source when episode changes
  useEffect(() => {
    if (audioRef.current && currentEpisode) {
      audioRef.current.src = currentEpisode.episode.audioUrl;
      audioRef.current.load();
    }
  }, [currentEpisode]);

  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (playbackState.isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Playback failed:", error);
          dispatch(setError("Failed to play audio"));
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [playbackState.isPlaying, dispatch]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playbackState.isMuted
        ? 0
        : playbackState.volume;
    }
  }, [playbackState.volume, playbackState.isMuted]);

  // Handle playback rate changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackState.playbackRate;
    }
  }, [playbackState.playbackRate]);

  const playEpisode = useCallback(
    (episode: CurrentEpisode) => {
      dispatch(setCurrentEpisode(episode));
      dispatch(play());
    },
    [dispatch]
  );

  const togglePlayPause = useCallback(() => {
    if (playbackState.isPlaying) {
      dispatch(pause());
    } else {
      dispatch(play());
    }
  }, [dispatch, playbackState.isPlaying]);

  const seekTo = useCallback(
    (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        dispatch(setCurrentTime(time));
      }
    },
    [dispatch]
  );

  const changeVolume = useCallback(
    (volume: number) => {
      dispatch(setVolume(volume));
    },
    [dispatch]
  );

  const changePlaybackRate = useCallback(
    (rate: number) => {
      dispatch(setPlaybackRate(rate));
    },
    [dispatch]
  );

  const toggleMuteAudio = useCallback(() => {
    dispatch(toggleMute());
  }, [dispatch]);

  return {
    currentEpisode,
    playbackState,
    playEpisode,
    togglePlayPause,
    seekTo,
    changeVolume,
    changePlaybackRate,
    toggleMute: toggleMuteAudio,
    audioRef,
  };
}
