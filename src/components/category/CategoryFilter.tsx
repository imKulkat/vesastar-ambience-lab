import { motion } from 'framer-motion';
import { 
  Cloud, TreePine, Home, Building2, Coffee, Music, Rocket, 
  Sparkles, Cog, Boxes, LayoutGrid 
} from 'lucide-react';
import { TrackCategory, CATEGORIES } from '@/types/ambience';
import { cn } from '@/lib/utils';

const categoryIcons: Record<TrackCategory | 'all', React.ElementType> = {
  all: LayoutGrid,
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

interface CategoryFilterProps {
  selectedCategory: TrackCategory | 'all';
  onSelectCategory: (category: TrackCategory | 'all') => void;
  trackCounts?: Record<TrackCategory | 'all', number>;
}

export function CategoryFilter({ 
  selectedCategory, 
  onSelectCategory,
  trackCounts = {} as Record<TrackCategory | 'all', number>
}: CategoryFilterProps) {
  const allCategories: { value: TrackCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    ...CATEGORIES,
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map(({ value, label }) => {
        const Icon = categoryIcons[value];
        const isSelected = selectedCategory === value;
        const count = trackCounts[value] ?? 0;

        return (
          <motion.button
            key={value}
            onClick={() => onSelectCategory(value)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
              isSelected
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-secondary/30 border-border/30 text-muted-foreground hover:border-border/50 hover:text-foreground"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
            {count > 0 && (
              <span className={cn(
                "px-1.5 py-0.5 text-xs rounded-full",
                isSelected ? "bg-primary/20" : "bg-secondary"
              )}>
                {count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
