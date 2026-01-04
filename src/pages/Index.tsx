import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Volume2, Layers, Sparkles, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MoodSelector } from '@/components/mood/MoodSelector';
import { EmptyScenes } from '@/components/empty/EmptyScenes';
import { Mood, Scene } from '@/types/ambience';
import { SceneCard } from '@/components/scene/SceneCard';
import heroImage from '@/assets/hero-ambient.jpg';

// Empty scenes for now - will be populated by admin
const scenes: Scene[] = [];

export default function Index() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const handleRandomize = () => {
    const moods: Mood[] = ['calm', 'focus', 'cozy', 'stormy', 'space', 'nightdrive', 'fantasy', 'energetic'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    setSelectedMood(randomMood);
    // TODO: Apply randomized tracks based on mood
  };

  return (
    <main className="min-h-screen ambient-bg pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Cozy ambient atmosphere"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Logo Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Volume2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Vesastar Ambience 2.0</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient">Create Your Perfect</span>
              <br />
              <span className="text-foreground">Ambient Atmosphere</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Mix and match ambient sounds to create your ideal focus, relaxation, or creative environment. 
              Layer rain, music, café chatter, and more.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/mixer">
                <Button size="lg" className="gap-2 glow-on-hover">
                  <Layers className="w-5 h-5" />
                  Open Mixer
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/library">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Music className="w-5 h-5" />
                  Browse Library
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid sm:grid-cols-3 gap-4 mt-16 max-w-4xl mx-auto"
          >
            {[
              { icon: Layers, title: 'Layer Sounds', desc: 'Mix multiple tracks seamlessly' },
              { icon: Sparkles, title: 'Mood Engine', desc: 'AI-suggested sound combinations' },
              { icon: Volume2, title: 'Save & Share', desc: 'Keep your favorite mixes' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass-card p-5 rounded-xl text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mood Engine Section */}
      <section className="container mx-auto px-4 py-12">
        <MoodSelector
          selectedMood={selectedMood}
          onSelectMood={setSelectedMood}
          onRandomize={handleRandomize}
        />
      </section>

      {/* Scenes Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Featured Scenes</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Curated ambient experiences to get you started
            </p>
          </div>
        </div>

        {scenes.length === 0 ? (
          <EmptyScenes />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {scenes.map(scene => (
              <SceneCard key={scene.id} scene={scene} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
