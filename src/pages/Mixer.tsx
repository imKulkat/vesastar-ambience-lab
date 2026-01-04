import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Save, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CategoryFilter } from '@/components/category/CategoryFilter';
import { TrackCard } from '@/components/track/TrackCard';
import { EmptyLibrary } from '@/components/empty/EmptyLibrary';
import { Track, TrackCategory } from '@/types/ambience';
import { useAudio } from '@/contexts/AudioContext';
import { useAuth } from '@/contexts/AuthContext';

// Empty tracks - will be populated by admin uploads
const tracks: Track[] = [];

export default function Mixer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TrackCategory | 'all'>('all');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const { trackStates, resetAll, getActiveTrackStates } = useAudio();
  const { isAuthenticated } = useAuth();

  const activeCount = getActiveTrackStates().length;

  const filteredTracks = useMemo(() => {
    return tracks.filter(track => {
      // Search filter
      if (searchQuery && !track.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (selectedCategory !== 'all' && track.category !== selectedCategory) {
        return false;
      }
      
      // Active filter
      if (showOnlyActive) {
        const state = trackStates.get(track.id);
        if (!state?.enabled) return false;
      }
      
      return true;
    });
  }, [tracks, searchQuery, selectedCategory, showOnlyActive, trackStates]);

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

  const handleSaveMix = () => {
    if (!isAuthenticated) {
      // TODO: Show login prompt
      return;
    }
    // TODO: Save mix to user's collection
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Sound Mixer</h1>
              <p className="text-muted-foreground mt-1">
                {activeCount > 0 
                  ? `${activeCount} track${activeCount !== 1 ? 's' : ''} playing`
                  : 'Select tracks to start your mix'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={resetAll}
                disabled={activeCount === 0}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button
                size="sm"
                onClick={handleSaveMix}
                disabled={activeCount === 0}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Save Mix
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 rounded-xl mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sounds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50 border-border/30"
              />
            </div>

            {/* Active Filter Toggle */}
            <Button
              variant={showOnlyActive ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setShowOnlyActive(!showOnlyActive)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showOnlyActive ? 'Showing Active' : 'Show Active Only'}
            </Button>
          </div>

          {/* Category Filter */}
          <div className="mt-4">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </motion.div>

        {/* Track Grid */}
        {tracks.length === 0 ? (
          <EmptyLibrary />
        ) : (
          <>
            {filteredTracks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No tracks match your filters</h3>
                <p className="text-muted-foreground">Try adjusting your search or category selection</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                <AnimatePresence mode="popLayout">
                  {filteredTracks.map((track, i) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.05 }}
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
          </>
        )}
      </div>
    </main>
  );
}
