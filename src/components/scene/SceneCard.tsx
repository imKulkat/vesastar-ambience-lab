import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { Scene } from '@/types/ambience';
import { cn } from '@/lib/utils';

interface SceneCardProps {
  scene: Scene;
  isActive?: boolean;
  onClick?: () => void;
}

export function SceneCard({ scene, isActive = false, onClick }: SceneCardProps) {
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
      onClick={onClick}
      style={{ backgroundColor: scene.backgroundColor }}
    >
      {/* Background */}
      <div className="aspect-[4/3]">
        {scene.backgroundUrl ? (
          <img
            src={scene.backgroundUrl}
            alt={scene.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: scene.backgroundColor }}
          >
            <ImageIcon className="w-8 h-8 opacity-30" style={{ color: scene.textColor }} />
          </div>
        )}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" 
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <h3 className="font-semibold" style={{ color: scene.textColor }}>{scene.name}</h3>
        <p className="text-xs opacity-70 line-clamp-2 mt-1" style={{ color: scene.textColor }}>
          {scene.description}
        </p>
      </div>

      {/* Accent color indicator */}
      <div 
        className="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-white/30"
        style={{ backgroundColor: scene.accentColor }}
      />
    </motion.div>
  );
}
