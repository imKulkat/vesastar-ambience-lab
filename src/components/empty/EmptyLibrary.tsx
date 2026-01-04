import { motion } from 'framer-motion';
import { Volume2, Upload, Music } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function EmptyLibrary() {
  const { isAdmin } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <motion.div
        className="relative mb-8"
        animate={{ 
          y: [0, -8, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Volume2 className="w-12 h-12 text-primary animate-pulse-soft" />
        </div>
        <motion.div
          className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Music className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </motion.div>

      <h2 className="text-2xl font-semibold text-foreground mb-2">
        The Sound Library is Empty
      </h2>
      <p className="text-muted-foreground max-w-md mb-8">
        {isAdmin
          ? "Start building your ambience collection by uploading tracks. Add categories, tags, and create scenes for your users."
          : "No sounds have been added yet. Check back later when the admin has uploaded some ambient tracks."}
      </p>

      {isAdmin && (
        <Link to="/admin">
          <Button className="gap-2">
            <Upload className="w-4 h-4" />
            Upload Your First Track
          </Button>
        </Link>
      )}
    </motion.div>
  );
}
