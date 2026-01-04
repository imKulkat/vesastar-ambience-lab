import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { 
  Upload, Music, Layers, Settings, Trash2, Edit, Plus, X,
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
import { CATEGORIES, TRACK_TYPES, TAGS, TrackCategory, TrackType, TrackTag } from '@/types/ambience';

interface PendingTrack {
  id: string;
  file: File;
  name: string;
  category: TrackCategory | '';
  type: TrackType | '';
  tags: TrackTag[];
  iconName: string;
}

export default function Admin() {
  const { isAdmin } = useAuth();
  const [uploadedTracks, setUploadedTracks] = useState<any[]>([]);
  const [createdScenes, setCreatedScenes] = useState<any[]>([]);
  const [pendingTracks, setPendingTracks] = useState<PendingTrack[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scene color states
  const [sceneName, setSceneName] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [sceneBackgroundColor, setSceneBackgroundColor] = useState('#1a1a2e');
  const [sceneAccentColor, setSceneAccentColor] = useState('#f59e0b');
  const [sceneTextColor, setSceneTextColor] = useState('#ffffff');
  const [sceneBackgroundImage, setSceneBackgroundImage] = useState<File | null>(null);
  const [sceneBackgroundPreview, setSceneBackgroundPreview] = useState<string>('');

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPendingTracks: PendingTrack[] = Array.from(files).map((file, index) => ({
      id: `pending-${Date.now()}-${index}`,
      file,
      name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      category: '',
      type: '',
      tags: [],
      iconName: 'Music',
    }));

    setPendingTracks(prev => [...prev, ...newPendingTracks]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updatePendingTrack = (id: string, updates: Partial<PendingTrack>) => {
    setPendingTracks(prev => prev.map(track => 
      track.id === id ? { ...track, ...updates } : track
    ));
  };

  const removePendingTrack = (id: string) => {
    setPendingTracks(prev => prev.filter(track => track.id !== id));
  };

  const toggleTag = (trackId: string, tag: TrackTag) => {
    setPendingTracks(prev => prev.map(track => {
      if (track.id !== trackId) return track;
      const hasTag = track.tags.includes(tag);
      return {
        ...track,
        tags: hasTag ? track.tags.filter(t => t !== tag) : [...track.tags, tag]
      };
    }));
  };

  const handleSceneBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSceneBackgroundImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSceneBackgroundPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAll = () => {
    // TODO: Implement actual upload to backend
    console.log('Uploading tracks:', pendingTracks);
    setPendingTracks([]);
  };

  const handleCreateScene = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual scene creation
    console.log('Creating scene:', {
      name: sceneName,
      description: sceneDescription,
      backgroundColor: sceneBackgroundColor,
      accentColor: sceneAccentColor,
      textColor: sceneTextColor,
      backgroundImage: sceneBackgroundImage,
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
              className="space-y-6"
            >
              {/* Drop Zone */}
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Upload Audio Files</h2>
                <div 
                  className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground font-medium mb-1">Drop audio files here or click to browse</p>
                  <p className="text-sm text-muted-foreground">Select multiple files with Ctrl+Click • MP3, WAV, OGG up to 50MB each</p>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept="audio/*" 
                    multiple
                    onChange={handleFilesSelected}
                  />
                </div>
              </div>

              {/* Pending Tracks */}
              <AnimatePresence>
                {pendingTracks.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass-card p-6 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">
                        Edit Tracks ({pendingTracks.length})
                      </h2>
                      <Button onClick={handleUploadAll} className="gap-2">
                        <Upload className="w-4 h-4" />
                        Upload All
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {pendingTracks.map((track, index) => (
                        <motion.div
                          key={track.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-lg bg-secondary/30 border border-border/30"
                        >
                          <div className="flex items-start gap-4">
                            {/* Track Info */}
                            <div className="flex-1 space-y-4">
                              {/* File name indicator */}
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Music className="w-3 h-3" />
                                <span className="truncate">{track.file.name}</span>
                                <span>({(track.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                              </div>

                              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {/* Track Name */}
                                <div className="space-y-1">
                                  <Label className="text-xs">Track Name</Label>
                                  <Input
                                    value={track.name}
                                    onChange={(e) => updatePendingTrack(track.id, { name: e.target.value })}
                                    placeholder="Track name"
                                    className="bg-secondary/50 border-border/30 h-9 text-sm"
                                  />
                                </div>

                                {/* Category */}
                                <div className="space-y-1">
                                  <Label className="text-xs">Category</Label>
                                  <Select
                                    value={track.category}
                                    onValueChange={(value: TrackCategory) => updatePendingTrack(track.id, { category: value })}
                                  >
                                    <SelectTrigger className="bg-secondary/50 border-border/30 h-9 text-sm">
                                      <SelectValue placeholder="Category" />
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
                                <div className="space-y-1">
                                  <Label className="text-xs">Type</Label>
                                  <Select
                                    value={track.type}
                                    onValueChange={(value: TrackType) => updatePendingTrack(track.id, { type: value })}
                                  >
                                    <SelectTrigger className="bg-secondary/50 border-border/30 h-9 text-sm">
                                      <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {TRACK_TYPES.map(type => (
                                        <SelectItem key={type.value} value={type.value}>
                                          {type.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Icon */}
                                <div className="space-y-1">
                                  <Label className="text-xs">Icon</Label>
                                  <Select
                                    value={track.iconName}
                                    onValueChange={(value) => updatePendingTrack(track.id, { iconName: value })}
                                  >
                                    <SelectTrigger className="bg-secondary/50 border-border/30 h-9 text-sm">
                                      <SelectValue placeholder="Icon" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Cloud"><span className="flex items-center gap-2"><Cloud className="w-4 h-4" /> Cloud</span></SelectItem>
                                      <SelectItem value="TreePine"><span className="flex items-center gap-2"><TreePine className="w-4 h-4" /> Tree</span></SelectItem>
                                      <SelectItem value="Home"><span className="flex items-center gap-2"><Home className="w-4 h-4" /> Home</span></SelectItem>
                                      <SelectItem value="Coffee"><span className="flex items-center gap-2"><Coffee className="w-4 h-4" /> Coffee</span></SelectItem>
                                      <SelectItem value="Music"><span className="flex items-center gap-2"><Music className="w-4 h-4" /> Music</span></SelectItem>
                                      <SelectItem value="Building2"><span className="flex items-center gap-2"><Building2 className="w-4 h-4" /> Building</span></SelectItem>
                                      <SelectItem value="Rocket"><span className="flex items-center gap-2"><Rocket className="w-4 h-4" /> Rocket</span></SelectItem>
                                      <SelectItem value="Sparkles"><span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Magic</span></SelectItem>
                                      <SelectItem value="Cog"><span className="flex items-center gap-2"><Cog className="w-4 h-4" /> Gear</span></SelectItem>
                                      <SelectItem value="Boxes"><span className="flex items-center gap-2"><Boxes className="w-4 h-4" /> Misc</span></SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Tags */}
                              <div className="space-y-1">
                                <Label className="text-xs">Tags</Label>
                                <div className="flex flex-wrap gap-1.5">
                                  {TAGS.map(tag => (
                                    <button
                                      key={tag}
                                      type="button"
                                      onClick={() => toggleTag(track.id, tag)}
                                      className={`px-2 py-0.5 rounded-full border text-xs transition-colors ${
                                        track.tags.includes(tag)
                                          ? 'border-primary bg-primary/20 text-primary'
                                          : 'border-border/50 text-muted-foreground hover:border-primary/50'
                                      }`}
                                    >
                                      {tag}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive shrink-0"
                              onClick={() => removePendingTrack(track.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
              <h2 className="text-xl font-semibold mb-6">Create Scene Background</h2>
              
              <form onSubmit={handleCreateScene} className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Left Column - Form Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sceneName">Scene Name</Label>
                      <Input
                        id="sceneName"
                        value={sceneName}
                        onChange={(e) => setSceneName(e.target.value)}
                        placeholder="e.g., Rainy Night"
                        className="bg-secondary/50 border-border/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sceneDesc">Description</Label>
                      <Textarea
                        id="sceneDesc"
                        value={sceneDescription}
                        onChange={(e) => setSceneDescription(e.target.value)}
                        placeholder="Describe the atmosphere..."
                        className="bg-secondary/50 border-border/30"
                        rows={3}
                      />
                    </div>

                    {/* Color Pickers */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Background</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={sceneBackgroundColor}
                            onChange={(e) => setSceneBackgroundColor(e.target.value)}
                            className="w-10 h-10 rounded-lg cursor-pointer border border-border/30"
                          />
                          <Input
                            value={sceneBackgroundColor}
                            onChange={(e) => setSceneBackgroundColor(e.target.value)}
                            className="bg-secondary/50 border-border/30 h-9 text-xs font-mono flex-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Accent</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={sceneAccentColor}
                            onChange={(e) => setSceneAccentColor(e.target.value)}
                            className="w-10 h-10 rounded-lg cursor-pointer border border-border/30"
                          />
                          <Input
                            value={sceneAccentColor}
                            onChange={(e) => setSceneAccentColor(e.target.value)}
                            className="bg-secondary/50 border-border/30 h-9 text-xs font-mono flex-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Text</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={sceneTextColor}
                            onChange={(e) => setSceneTextColor(e.target.value)}
                            className="w-10 h-10 rounded-lg cursor-pointer border border-border/30"
                          />
                          <Input
                            value={sceneTextColor}
                            onChange={(e) => setSceneTextColor(e.target.value)}
                            className="bg-secondary/50 border-border/30 h-9 text-xs font-mono flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Background Image */}
                    <div className="space-y-2">
                      <Label>Background Image (Optional)</Label>
                      <div 
                        className="border-2 border-dashed border-border/50 rounded-xl p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => document.getElementById('sceneImageInput')?.click()}
                      >
                        {sceneBackgroundPreview ? (
                          <div className="relative">
                            <img 
                              src={sceneBackgroundPreview} 
                              alt="Preview" 
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-1 right-1 w-6 h-6 bg-background/80"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSceneBackgroundImage(null);
                                setSceneBackgroundPreview('');
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                            <p className="text-xs text-muted-foreground">Click to upload image</p>
                          </>
                        )}
                        <input 
                          id="sceneImageInput"
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleSceneBackgroundChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Preview */}
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div 
                      className="aspect-[4/3] rounded-xl overflow-hidden relative"
                      style={{ backgroundColor: sceneBackgroundColor }}
                    >
                      {sceneBackgroundPreview && (
                        <img 
                          src={sceneBackgroundPreview} 
                          alt="Scene preview" 
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Content Preview */}
                      <div className="absolute inset-0 p-4 flex flex-col justify-end">
                        <h3 
                          className="font-semibold text-lg"
                          style={{ color: sceneTextColor }}
                        >
                          {sceneName || 'Scene Name'}
                        </h3>
                        <p 
                          className="text-sm opacity-70"
                          style={{ color: sceneTextColor }}
                        >
                          {sceneDescription || 'Scene description will appear here...'}
                        </p>
                      </div>

                      {/* Accent indicator */}
                      <div 
                        className="absolute top-3 right-3 w-5 h-5 rounded-full border-2 border-white/30"
                        style={{ backgroundColor: sceneAccentColor }}
                      />
                    </div>
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