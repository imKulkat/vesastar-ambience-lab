export type TrackCategory = 
  | 'weather' 
  | 'nature' 
  | 'indoor' 
  | 'urban' 
  | 'cafe' 
  | 'music' 
  | 'scifi' 
  | 'fantasy' 
  | 'mechanical' 
  | 'misc';

export type TrackType = 'loop' | 'music' | 'oneshot' | 'bed';

export type TrackTag = 
  | 'soft' 
  | 'warm' 
  | 'airy' 
  | 'cozy' 
  | 'dark' 
  | 'natural' 
  | 'mechanical' 
  | 'wet' 
  | 'bright'
  | 'calm'
  | 'intense';

export type Mood = 
  | 'calm' 
  | 'focus' 
  | 'cozy' 
  | 'stormy' 
  | 'space' 
  | 'nightdrive' 
  | 'fantasy' 
  | 'energetic';

export type ThemeName = 
  | 'cozy-room' 
  | 'neon-city' 
  | 'forest-dusk' 
  | 'starfield' 
  | 'cafe-interior' 
  | 'minimal-dark';

export interface Track {
  id: string;
  name: string;
  category: TrackCategory;
  type: TrackType;
  tags: TrackTag[];
  audioUrl: string;
  iconName: string;
  createdAt: Date;
}

export interface TrackState {
  trackId: string;
  enabled: boolean;
  volume: number;
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  trackStates: TrackState[];
  theme: ThemeName;
  backgroundUrl?: string;
  createdBy: string;
  createdAt: Date;
}

export interface UserMix {
  id: string;
  name: string;
  userId: string;
  trackStates: TrackState[];
  theme: ThemeName;
  createdAt: Date;
}

export interface Theme {
  name: ThemeName;
  displayName: string;
  backgroundImage: string;
  accentColor: string;
  description: string;
}

export const CATEGORIES: { value: TrackCategory; label: string; icon: string }[] = [
  { value: 'weather', label: 'Weather', icon: 'Cloud' },
  { value: 'nature', label: 'Nature', icon: 'TreePine' },
  { value: 'indoor', label: 'Indoor', icon: 'Home' },
  { value: 'urban', label: 'Urban', icon: 'Building2' },
  { value: 'cafe', label: 'Café', icon: 'Coffee' },
  { value: 'music', label: 'Music', icon: 'Music' },
  { value: 'scifi', label: 'Sci-Fi', icon: 'Rocket' },
  { value: 'fantasy', label: 'Fantasy', icon: 'Sparkles' },
  { value: 'mechanical', label: 'Mechanical', icon: 'Cog' },
  { value: 'misc', label: 'Misc', icon: 'Boxes' },
];

export const TRACK_TYPES: { value: TrackType; label: string; description: string }[] = [
  { value: 'loop', label: 'Loop', description: 'Continuous ambient sounds' },
  { value: 'music', label: 'Music', description: 'Background music tracks' },
  { value: 'oneshot', label: 'One-shot', description: 'Occasional sound effects' },
  { value: 'bed', label: 'Bed', description: 'Room tones and atmospheres' },
];

export const MOODS: { value: Mood; label: string; icon: string; description: string }[] = [
  { value: 'calm', label: 'Calm', icon: 'Leaf', description: 'Peaceful and serene' },
  { value: 'focus', label: 'Focus', icon: 'Target', description: 'Deep concentration' },
  { value: 'cozy', label: 'Cozy', icon: 'Flame', description: 'Warm and comfortable' },
  { value: 'stormy', label: 'Stormy', icon: 'CloudLightning', description: 'Dramatic weather' },
  { value: 'space', label: 'Space', icon: 'Star', description: 'Cosmic ambience' },
  { value: 'nightdrive', label: 'Night Drive', icon: 'Car', description: 'Late night vibes' },
  { value: 'fantasy', label: 'Fantasy', icon: 'Wand2', description: 'Magical atmosphere' },
  { value: 'energetic', label: 'Energetic', icon: 'Zap', description: 'Upbeat and lively' },
];

export const THEMES: Theme[] = [
  {
    name: 'cozy-room',
    displayName: 'Cozy Room',
    backgroundImage: '/themes/cozy-room.jpg',
    accentColor: 'hsl(32 95% 55%)',
    description: 'Warm, intimate indoor setting',
  },
  {
    name: 'neon-city',
    displayName: 'Neon City',
    backgroundImage: '/themes/neon-city.jpg',
    accentColor: 'hsl(280 80% 60%)',
    description: 'Cyberpunk urban nightscape',
  },
  {
    name: 'forest-dusk',
    displayName: 'Forest Dusk',
    backgroundImage: '/themes/forest-dusk.jpg',
    accentColor: 'hsl(150 60% 45%)',
    description: 'Twilight in the woods',
  },
  {
    name: 'starfield',
    displayName: 'Starfield',
    backgroundImage: '/themes/starfield.jpg',
    accentColor: 'hsl(220 80% 60%)',
    description: 'Deep space exploration',
  },
  {
    name: 'cafe-interior',
    displayName: 'Café Interior',
    backgroundImage: '/themes/cafe-interior.jpg',
    accentColor: 'hsl(25 70% 50%)',
    description: 'Busy coffee shop vibes',
  },
  {
    name: 'minimal-dark',
    displayName: 'Minimal Dark',
    backgroundImage: '',
    accentColor: 'hsl(32 95% 55%)',
    description: 'Clean, distraction-free',
  },
];

export const TAGS: TrackTag[] = [
  'soft', 'warm', 'airy', 'cozy', 'dark', 
  'natural', 'mechanical', 'wet', 'bright', 'calm', 'intense'
];
