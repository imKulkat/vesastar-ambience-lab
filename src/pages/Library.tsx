import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SortAsc, Clock, Heart, Grid3X3, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryFilter } from '@/components/category/CategoryFilter';
import { TrackCard } from '@/components/track/TrackCard';
import { EmptyLibrary } from '@/components/empty/EmptyLibrary';
import { Track, TrackCategory, TrackType, TRACK_TYPES } from '@/types/ambience';

// Empty tracks - will be populated by admin uploads
const tracks: Track[] = [];

type SortOption = 'name' | 'category' | 'type' | 'recent' | 'favorites';

export default function Library() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TrackCategory | 'all'>('all');
  const [selectedType, setSelectedType] = useState<TrackType | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredAndSortedTracks = useMemo(() => {
    let result = [...tracks];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(track => 
        track.name.toLowerCase().includes(query) ||
        track.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(track => track.category === selectedCategory);
    }

    // Type filter
    if (selectedType !== 'all') {
      result = result.filter(track => track.type === selectedType);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'favorites':
          const aFav = favorites.has(a.id) ? 0 : 1;
          const bFav = favorites.has(b.id) ? 0 : 1;
          return aFav - bFav;
        default:
          return 0;
      }
    });

    return result;
  }, [tracks, searchQuery, selectedCategory, selectedType, sortBy, favorites]);

  const toggleFavorite = (trackId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  };

  return (
    <main className="min-h-screen ambient-bg pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground">Sound Library</h1>
          <p className="text-muted-foreground mt-1">
            Browse and discover all available ambient tracks
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 rounded-xl mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/30"
              />
            </div>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={(v) => setSelectedType(v as TrackType | 'all')}>
              <SelectTrigger className="w-40 bg-secondary/50 border-border/30">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {TRACK_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-40 bg-secondary/50 border-border/30">
                <SortAsc className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Alphabetical</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="type">Type</SelectItem>
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="favorites">Favorites First</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/50">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </motion.div>

        {/* Results Count */}
        {tracks.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground mb-4"
          >
            Showing {filteredAndSortedTracks.length} of {tracks.length} tracks
          </motion.p>
        )}

        {/* Track Grid/List */}
        {tracks.length === 0 ? (
          <EmptyLibrary />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={
              viewMode === 'grid'
                ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "flex flex-col gap-3"
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedTracks.map((track, i) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <TrackCard
                    track={track}
                    isFavorite={favorites.has(track.id)}
                    onToggleFavorite={() => toggleFavorite(track.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  );
}
