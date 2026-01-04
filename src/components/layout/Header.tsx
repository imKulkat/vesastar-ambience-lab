import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Library,
  Layers,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAudio } from '@/contexts/AudioContext';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { masterVolume, setMasterVolume, isPlaying, playAll, pauseAll } = useAudio();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/mixer', label: 'Mixer', icon: Layers },
    { path: '/library', label: 'Library', icon: Library },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin', icon: Settings });
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Volume2 className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-gradient">Vesastar</h1>
            <p className="text-xs text-muted-foreground -mt-1">Ambience 2.0</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link key={path} to={path}>
                <Button
                  variant="ghost"
                  className={`relative px-4 transition-all ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Master Volume */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
            <button
              onClick={() => setMasterVolume(masterVolume > 0 ? 0 : 0.8)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {masterVolume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <Slider
              value={[masterVolume * 100]}
              onValueChange={([v]) => setMasterVolume(v / 100)}
              max={100}
              step={1}
              className="w-24"
            />
          </div>

          {/* Play/Pause */}
          <motion.button
            onClick={() => isPlaying ? pauseAll() : playAll()}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground glow-on-hover"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </motion.button>

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-3 py-2 border-b border-border">
                  <p className="font-medium text-sm">{user?.username}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  {isAdmin && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/mixes" className="cursor-pointer">
                    <Layers className="w-4 h-4 mr-2" />
                    My Mixes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="secondary" size="sm">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-border/30 bg-card/95 backdrop-blur-xl"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === path
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-secondary text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
