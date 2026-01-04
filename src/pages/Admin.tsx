import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { 
  Upload, Music, Layers, Settings, Trash2, Edit, Plus,
  Cloud, TreePine, Home, Building2, Coffee, Rocket, Sparkles, Cog, Boxes
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { CATEGORIES, TRACK_TYPES, TAGS, THEMES } from '@/types/ambience';

export default function Admin() {
  const { isAdmin } = useAuth();
  const [uploadedTracks, setUploadedTracks] = useState<any[]>([]);
  const [createdScenes, setCreatedScenes] = useState<any[]>([]);

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" replace />;
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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage tracks, scenes, and library content</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="glass-card p-1">
            <TabsTrigger value="upload" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Upload className="w-4 h-4" />
              Upload Tracks
            </TabsTrigger>
            <TabsTrigger value="library" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Music className="w-4 h-4" />
              Manage Library
            </TabsTrigger>
            <TabsTrigger value="scenes" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Layers className="w-4 h-4" />
              Create Scenes
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-xl"
            >
              <h2 className="text-xl font-semibold mb-6">Upload New Track</h2>
              
              <form className="space-y-6">
                {/* Audio File */}
                <div className="space-y-2">
                  <Label>Audio File</Label>
                  <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-foreground font-medium mb-1">Drop audio file here</p>
                    <p className="text-sm text-muted-foreground">MP3, WAV, OGG up to 50MB</p>
                    <input type="file" className="hidden" accept="audio/*" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Track Name */}
                  <div className="space-y-2">
                    <Label htmlFor="trackName">Track Name</Label>
                    <Input
                      id="trackName"
                      placeholder="e.g., Gentle Rain"
                      className="bg-secondary/50 border-border/30"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary/50 border-border/30">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary/50 border-border/30">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRACK_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <span>{type.label}</span>
                              <span className="text-muted-foreground text-xs ml-2">{type.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Icon */}
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary/50 border-border/30">
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cloud"><span className="flex items-center gap-2"><Cloud className="w-4 h-4" /> Cloud</span></SelectItem>
                        <SelectItem value="TreePine"><span className="flex items-center gap-2"><TreePine className="w-4 h-4" /> Tree</span></SelectItem>
                        <SelectItem value="Home"><span className="flex items-center gap-2"><Home className="w-4 h-4" /> Home</span></SelectItem>
                        <SelectItem value="Coffee"><span className="flex items-center gap-2"><Coffee className="w-4 h-4" /> Coffee</span></SelectItem>
                        <SelectItem value="Music"><span className="flex items-center gap-2"><Music className="w-4 h-4" /> Music</span></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        className="px-3 py-1.5 rounded-full border border-border/50 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Track
                </Button>
              </form>
            </motion.div>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-xl"
            >
              <h2 className="text-xl font-semibold mb-6">Manage Library</h2>
              
              {uploadedTracks.length === 0 ? (
                <div className="text-center py-12">
                  <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No tracks uploaded yet</h3>
                  <p className="text-muted-foreground mb-4">Start by uploading your first ambient track</p>
                  <Button variant="secondary" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Upload Track
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadedTracks.map(track => (
                    <div key={track.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Music className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{track.name}</h4>
                          <p className="text-sm text-muted-foreground">{track.category} • {track.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Scenes Tab */}
          <TabsContent value="scenes">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-xl"
            >
              <h2 className="text-xl font-semibold mb-6">Create Scene Preset</h2>
              
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sceneName">Scene Name</Label>
                    <Input
                      id="sceneName"
                      placeholder="e.g., Rainy Night Café"
                      className="bg-secondary/50 border-border/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary/50 border-border/30">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {THEMES.map(theme => (
                          <SelectItem key={theme.name} value={theme.name}>
                            {theme.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sceneDesc">Description</Label>
                  <Textarea
                    id="sceneDesc"
                    placeholder="Describe the atmosphere this scene creates..."
                    className="bg-secondary/50 border-border/30"
                    rows={3}
                  />
                </div>

                {/* Track Selection */}
                <div className="space-y-2">
                  <Label>Select Tracks</Label>
                  <div className="p-4 rounded-lg bg-secondary/20 border border-border/30 text-center">
                    <p className="text-muted-foreground">
                      Upload tracks first to create scene presets
                    </p>
                  </div>
                </div>

                {/* Background Image */}
                <div className="space-y-2">
                  <Label>Background Image (Optional)</Label>
                  <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Drop image or click to upload</p>
                    <input type="file" className="hidden" accept="image/*" />
                  </div>
                </div>

                <Button type="submit" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Scene
                </Button>
              </form>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
