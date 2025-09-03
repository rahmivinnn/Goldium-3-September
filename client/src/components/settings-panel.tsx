import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Zap, 
  Sparkles, 
  Globe,
  User,
  X
} from 'lucide-react';
import { useSettings } from '@/lib/settings-store';
import { useSoundSystem } from '@/lib/sound-system';

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    theme,
    performanceMode,
    enableAnimations,
    enableParticles,
    enable3D,
    language,
    selectedCharacter,
    showTooltips,
    setTheme,
    setPerformanceMode,
    setAnimations,
    setParticles,
    set3D,
    setLanguage,
    setSelectedCharacter,
    setTooltips,
  } = useSettings();

  const {
    isMuted,
    volume,
    toggleMute,
    changeVolume,
    playChime
  } = useSoundSystem();

  const handleVolumeChange = (newVolume: number[]) => {
    changeVolume(newVolume[0]);
    playChime(); // Test sound
  };

  const characters = ['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8'] as const;

  return (
    <>
      {/* SETTINGS TRIGGER */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 bg-black/80 border-white/20 hover:border-white/40 text-white backdrop-blur-sm"
      >
        <Settings className="w-4 h-4" />
      </Button>

      {/* SETTINGS MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
            >
              <Card className="glass-card glass-hover">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-card-title text-white flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Settings
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white/70 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>

                <CardContent className="space-y-6">
                  
                  {/* THEME */}
                  <div className="space-y-3">
                    <h4 className="font-body text-white font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Theme
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme('dark')}
                        className="bg-black border-white/20 text-white"
                      >
                        Dark
                      </Button>
                      <Button
                        variant={theme === 'gold' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme('gold')}
                        className="bg-black border-white/20 text-white"
                      >
                        Gold
                      </Button>
                    </div>
                  </div>

                  {/* PERFORMANCE */}
                  <div className="space-y-3">
                    <h4 className="font-body text-white font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Performance
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-small text-white/70">Performance Mode</span>
                        <Switch
                          checked={performanceMode}
                          onCheckedChange={setPerformanceMode}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-small text-white/70">Animations</span>
                        <Switch
                          checked={enableAnimations}
                          onCheckedChange={setAnimations}
                          disabled={performanceMode}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-small text-white/70">Particles</span>
                        <Switch
                          checked={enableParticles}
                          onCheckedChange={setParticles}
                          disabled={performanceMode}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-small text-white/70">3D Effects</span>
                        <Switch
                          checked={enable3D}
                          onCheckedChange={set3D}
                          disabled={performanceMode}
                        />
                      </div>
                    </div>
                  </div>

                  {/* AUDIO */}
                  <div className="space-y-3">
                    <h4 className="font-body text-white font-medium flex items-center gap-2">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      Audio
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-small text-white/70">Sound Effects</span>
                        <Switch
                          checked={!isMuted}
                          onCheckedChange={() => toggleMute()}
                        />
                      </div>
                      {!isMuted && (
                        <div className="space-y-2">
                          <span className="font-small text-white/70">Volume</span>
                          <Slider
                            value={[volume]}
                            onValueChange={handleVolumeChange}
                            max={1}
                            min={0}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* LANGUAGE */}
                  <div className="space-y-3">
                    <h4 className="font-body text-white font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Language
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={language === 'en' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLanguage('en')}
                        className="bg-black border-white/20 text-white"
                      >
                        English
                      </Button>
                      <Button
                        variant={language === 'id' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLanguage('id')}
                        className="bg-black border-white/20 text-white"
                      >
                        Indonesia
                      </Button>
                    </div>
                  </div>

                  {/* CHARACTER SELECTION */}
                  <div className="space-y-3">
                    <h4 className="font-body text-white font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Character
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {characters.map((char) => (
                        <Button
                          key={char}
                          variant={selectedCharacter === char ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCharacter(char)}
                          className="bg-black border-white/20 text-white aspect-square"
                        >
                          {char}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* MISC SETTINGS */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-small text-white/70">Show Tooltips</span>
                      <Switch
                        checked={showTooltips}
                        onCheckedChange={setTooltips}
                      />
                    </div>
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}