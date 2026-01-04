import { motion } from 'framer-motion';
import { 
  Leaf, Target, Flame, CloudLightning, Star, Car, Wand2, Zap, Shuffle 
} from 'lucide-react';
import { Mood, MOODS } from '@/types/ambience';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const moodIcons: Record<Mood, React.ElementType> = {
  calm: Leaf,
  focus: Target,
  cozy: Flame,
  stormy: CloudLightning,
  space: Star,
  nightdrive: Car,
  fantasy: Wand2,
  energetic: Zap,
};

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelectMood: (mood: Mood) => void;
  onRandomize: () => void;
}

export function MoodSelector({ selectedMood, onSelectMood, onRandomize }: MoodSelectorProps) {
  return (
    <div className="glass-card p-4 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-foreground">Mood Engine</h2>
        <motion.button
          onClick={onRandomize}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Shuffle className="w-4 h-4" />
          Surprise Me
        </motion.button>
      </div>

      {/* Desktop: Grid of mood buttons */}
      <div className="hidden sm:grid grid-cols-4 gap-2">
        {MOODS.map(({ value, label, description }) => {
          const Icon = moodIcons[value];
          const isSelected = selectedMood === value;
          
          return (
            <motion.button
              key={value}
              onClick={() => onSelectMood(value)}
              className={cn(
                "p-3 rounded-lg border transition-all text-left",
                isSelected
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-secondary/30 border-border/30 text-muted-foreground hover:border-border/50 hover:text-foreground"
              )}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5 mb-2" />
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs opacity-70 truncate">{description}</div>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile: Dropdown */}
      <div className="sm:hidden">
        <Select value={selectedMood ?? undefined} onValueChange={(v) => onSelectMood(v as Mood)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a mood..." />
          </SelectTrigger>
          <SelectContent>
            {MOODS.map(({ value, label, description }) => {
              const Icon = moodIcons[value];
              return (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                    <span className="text-muted-foreground text-xs">- {description}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
