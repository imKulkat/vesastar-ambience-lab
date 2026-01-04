import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Track, TrackState, ThemeName } from '@/types/ambience';

interface AudioInstance {
  audio: HTMLAudioElement;
  trackId: string;
}

interface AudioContextType {
  trackStates: Map<string, TrackState>;
  activeTheme: ThemeName;
  masterVolume: number;
  isPlaying: boolean;
  
  enableTrack: (trackId: string) => void;
  disableTrack: (trackId: string) => void;
  toggleTrack: (trackId: string) => void;
  setTrackVolume: (trackId: string, volume: number) => void;
  setMasterVolume: (volume: number) => void;
  setTheme: (theme: ThemeName) => void;
  loadTrack: (track: Track) => void;
  unloadTrack: (trackId: string) => void;
  playAll: () => void;
  pauseAll: () => void;
  resetAll: () => void;
  applyMix: (states: TrackState[]) => void;
  getActiveTrackStates: () => TrackState[];
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [trackStates, setTrackStates] = useState<Map<string, TrackState>>(new Map());
  const [activeTheme, setActiveTheme] = useState<ThemeName>('minimal-dark');
  const [masterVolume, setMasterVolumeState] = useState(0.8);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const audioInstances = useRef<Map<string, AudioInstance>>(new Map());

  const updateAudioVolume = useCallback((trackId: string) => {
    const instance = audioInstances.current.get(trackId);
    const state = trackStates.get(trackId);
    if (instance && state) {
      instance.audio.volume = state.enabled ? state.volume * masterVolume : 0;
    }
  }, [trackStates, masterVolume]);

  useEffect(() => {
    trackStates.forEach((_, trackId) => {
      updateAudioVolume(trackId);
    });
  }, [masterVolume, trackStates, updateAudioVolume]);

  const loadTrack = useCallback((track: Track) => {
    if (audioInstances.current.has(track.id)) return;

    const audio = new Audio(track.audioUrl);
    audio.loop = track.type !== 'oneshot';
    audio.volume = 0;
    audio.preload = 'auto';
    
    audioInstances.current.set(track.id, { audio, trackId: track.id });
    
    setTrackStates(prev => {
      const next = new Map(prev);
      if (!next.has(track.id)) {
        next.set(track.id, { trackId: track.id, enabled: false, volume: 0.5 });
      }
      return next;
    });
  }, []);

  const unloadTrack = useCallback((trackId: string) => {
    const instance = audioInstances.current.get(trackId);
    if (instance) {
      instance.audio.pause();
      instance.audio.src = '';
      audioInstances.current.delete(trackId);
    }
    setTrackStates(prev => {
      const next = new Map(prev);
      next.delete(trackId);
      return next;
    });
  }, []);

  const enableTrack = useCallback((trackId: string) => {
    setTrackStates(prev => {
      const next = new Map(prev);
      const state = next.get(trackId);
      if (state) {
        next.set(trackId, { ...state, enabled: true });
      }
      return next;
    });
    
    const instance = audioInstances.current.get(trackId);
    if (instance && isPlaying) {
      instance.audio.play().catch(console.error);
    }
  }, [isPlaying]);

  const disableTrack = useCallback((trackId: string) => {
    setTrackStates(prev => {
      const next = new Map(prev);
      const state = next.get(trackId);
      if (state) {
        next.set(trackId, { ...state, enabled: false });
      }
      return next;
    });
    
    const instance = audioInstances.current.get(trackId);
    if (instance) {
      instance.audio.pause();
    }
  }, []);

  const toggleTrack = useCallback((trackId: string) => {
    const state = trackStates.get(trackId);
    if (state?.enabled) {
      disableTrack(trackId);
    } else {
      enableTrack(trackId);
    }
  }, [trackStates, enableTrack, disableTrack]);

  const setTrackVolume = useCallback((trackId: string, volume: number) => {
    setTrackStates(prev => {
      const next = new Map(prev);
      const state = next.get(trackId);
      if (state) {
        next.set(trackId, { ...state, volume: Math.max(0, Math.min(1, volume)) });
      }
      return next;
    });
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    setMasterVolumeState(Math.max(0, Math.min(1, volume)));
  }, []);

  const setTheme = useCallback((theme: ThemeName) => {
    setActiveTheme(theme);
  }, []);

  const playAll = useCallback(() => {
    setIsPlaying(true);
    trackStates.forEach((state, trackId) => {
      if (state.enabled) {
        const instance = audioInstances.current.get(trackId);
        if (instance) {
          instance.audio.play().catch(console.error);
        }
      }
    });
  }, [trackStates]);

  const pauseAll = useCallback(() => {
    setIsPlaying(false);
    audioInstances.current.forEach(instance => {
      instance.audio.pause();
    });
  }, []);

  const resetAll = useCallback(() => {
    audioInstances.current.forEach(instance => {
      instance.audio.pause();
      instance.audio.currentTime = 0;
    });
    setTrackStates(prev => {
      const next = new Map(prev);
      next.forEach((state, key) => {
        next.set(key, { ...state, enabled: false, volume: 0.5 });
      });
      return next;
    });
  }, []);

  const applyMix = useCallback((states: TrackState[]) => {
    // First disable all
    trackStates.forEach((_, trackId) => {
      disableTrack(trackId);
    });
    
    // Then apply new states
    states.forEach(state => {
      setTrackStates(prev => {
        const next = new Map(prev);
        next.set(state.trackId, state);
        return next;
      });
      
      if (state.enabled) {
        enableTrack(state.trackId);
      }
    });
  }, [trackStates, disableTrack, enableTrack]);

  const getActiveTrackStates = useCallback(() => {
    return Array.from(trackStates.values()).filter(state => state.enabled);
  }, [trackStates]);

  return (
    <AudioContext.Provider
      value={{
        trackStates,
        activeTheme,
        masterVolume,
        isPlaying,
        enableTrack,
        disableTrack,
        toggleTrack,
        setTrackVolume,
        setMasterVolume,
        setTheme,
        loadTrack,
        unloadTrack,
        playAll,
        pauseAll,
        resetAll,
        applyMix,
        getActiveTrackStates,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
