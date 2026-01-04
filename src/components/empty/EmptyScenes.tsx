import { motion } from 'framer-motion';
import { Layers, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function EmptyScenes() {
  const { isAdmin } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        className="w-20 h-20 rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center mb-6"
        animate={{ 
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Layers className="w-10 h-10 text-muted-foreground" />
      </motion.div>

      <h3 className="text-xl font-semibold text-foreground mb-2">
        No Scenes Available
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        {isAdmin
          ? "Create preset scenes to give users curated ambience experiences."
          : "Scene presets will appear here once the admin creates them."}
      </p>

      {isAdmin && (
        <Link to="/admin">
          <Button variant="secondary" className="gap-2">
            <Plus className="w-4 h-4" />
            Create Scene
          </Button>
        </Link>
      )}
    </motion.div>
  );
}
