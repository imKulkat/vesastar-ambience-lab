import { motion } from 'framer-motion';
import { Play, Layers } from 'lucide-react';
import { Scene } from '@/types/ambience';
import { useAudio } from '@/contexts/AudioContext';
import { cn } from '@/lib/utils';

interface SceneCardProps {
  scene: Scene;
  isActive?: boolean;
}

export function SceneCard({ scene, isActive = false }: SceneCardProps) {
  const { applyMix, setTheme } = useAudio();

  const handleApply = () => {
    applyMix(scene.trackStates);
    setTheme(scene.theme);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative overflow-hidden rounded-2xl cursor-pointer group",
        isActive
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : ""
      )}
      onClick={handleApply}
    >
      {/* Background */}
      <div className="aspect-[4/3] bg-gradient-to-br from-secondary to-muted">
        {scene.backgroundUrl && (
          <img
            src={scene.backgroundUrl}
            alt={scene.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Layers className="w-3 h-3" />
          <span className="text-xs">{scene.trackStates.length} tracks</span>
        </div>
        <h3 className="font-semibold text-foreground">{scene.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
          {scene.description}
        </p>
      </div>

      {/* Hover Play Button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg"
        >
          <Play className="w-6 h-6 text-primary-foreground ml-1" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
