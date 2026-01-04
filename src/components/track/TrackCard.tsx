import { motion } from 'framer-motion';
import { 
  Cloud, TreePine, Home, Building2, Coffee, Music, Rocket, 
  Sparkles, Cog, Boxes, Volume2, VolumeX, Heart 
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Track, TrackCategory } from '@/types/ambience';
import { useAudio } from '@/contexts/AudioContext';
import { cn } from '@/lib/utils';

const categoryIcons: Record<TrackCategory, React.ElementType> = {
  weather: Cloud,
  nature: TreePine,
  indoor: Home,
  urban: Building2,
  cafe: Coffee,
  music: Music,
  scifi: Rocket,
  fantasy: Sparkles,
  mechanical: Cog,
  misc: Boxes,
};

interface TrackCardProps {
  track: Track;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function TrackCard({ track, isFavorite = false, onToggleFavorite }: TrackCardProps) {
  const { trackStates, toggleTrack, setTrackVolume } = useAudio();
  const state = trackStates.get(track.id);
  const isEnabled = state?.enabled ?? false;
  const volume = state?.volume ?? 0.5;

  const Icon = categoryIcons[track.category] || Boxes;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={cn(
        "relative p-4 rounded-xl border transition-all duration-300",
        isEnabled
          ? "glass-card border-primary/30 glow-primary"
          : "bg-secondary/30 border-border/30 hover:border-border/50"
      )}
    >
      {/* Favorite Button */}
      {onToggleFavorite && (
        <button
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 p-1.5 rounded-full transition-colors hover:bg-secondary"
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isFavorite ? "fill-primary text-primary" : "text-muted-foreground"
            )}
          />
        </button>
      )}

      {/* Track Content */}
      <div className="flex items-start gap-3">
        {/* Icon */}
        <motion.button
          onClick={() => toggleTrack(track.id)}
          className={cn(
            "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all",
            isEnabled
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
          )}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className="w-5 h-5" />
        </motion.button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium truncate transition-colors",
            isEnabled ? "text-foreground" : "text-muted-foreground"
          )}>
            {track.name}
          </h3>
          <p className="text-xs text-muted-foreground capitalize">
            {track.category} • {track.type}
          </p>
        </div>
      </div>

      {/* Volume Control */}
      <div className={cn(
        "mt-4 flex items-center gap-3 transition-opacity",
        isEnabled ? "opacity-100" : "opacity-40"
      )}>
        <button
          onClick={() => setTrackVolume(track.id, volume > 0 ? 0 : 0.5)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          disabled={!isEnabled}
        >
          {volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
        <Slider
          value={[volume * 100]}
          onValueChange={([v]) => setTrackVolume(track.id, v / 100)}
          max={100}
          step={1}
          disabled={!isEnabled}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground w-8 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>

      {/* Tags */}
      {track.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {track.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-secondary/50 text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
