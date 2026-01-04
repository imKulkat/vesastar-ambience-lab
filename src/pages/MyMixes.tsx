import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { Layers, Play, Trash2, Edit, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UserMix } from '@/types/ambience';

// Empty user mixes - will be populated when users save mixes
const userMixes: UserMix[] = [];

export default function MyMixes() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <main className="min-h-screen ambient-bg pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground">My Mixes</h1>
          <p className="text-muted-foreground mt-1">
            Your saved ambience combinations
          </p>
        </motion.div>

        {/* Mixes Grid */}
        {userMixes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center mb-6">
              <Layers className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No saved mixes yet</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Go to the mixer, create your perfect ambience, and save it here for quick access.
            </p>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Mix
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {userMixes.map((mix, i) => (
              <motion.div
                key={mix.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 rounded-xl group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{mix.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Layers className="w-3 h-3" />
                      <span>{mix.trackStates.length} tracks</span>
                      <span className="text-border">•</span>
                      <Clock className="w-3 h-3" />
                      <span>{new Date(mix.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Track Preview */}
                <div className="flex gap-1 mb-4">
                  {mix.trackStates.slice(0, 4).map((state, j) => (
                    <div
                      key={state.trackId}
                      className="w-2 h-8 rounded-full bg-primary"
                      style={{ opacity: state.volume }}
                    />
                  ))}
                  {mix.trackStates.length > 4 && (
                    <span className="text-xs text-muted-foreground self-center ml-1">
                      +{mix.trackStates.length - 4}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" className="flex-1 gap-2">
                    <Play className="w-4 h-4" />
                    Play
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
