import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  // Theme settings
  theme: 'dark' | 'gold';
  
  // Performance settings
  performanceMode: boolean;
  enableAnimations: boolean;
  enableParticles: boolean;
  enable3D: boolean;
  
  // Audio settings
  soundEnabled: boolean;
  soundVolume: number;
  
  // Localization
  language: 'en' | 'id';
  
  // Gamification
  selectedCharacter: 'K1' | 'K2' | 'K3' | 'K4' | 'K5' | 'K6' | 'K7' | 'K8';
  showOnboarding: boolean;
  completedQuests: string[];
  achievements: string[];
  
  // User preferences
  showTooltips: boolean;
  autoRefresh: boolean;
  
  // Actions
  setTheme: (theme: 'dark' | 'gold') => void;
  setPerformanceMode: (enabled: boolean) => void;
  setAnimations: (enabled: boolean) => void;
  setParticles: (enabled: boolean) => void;
  set3D: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setLanguage: (language: 'en' | 'id') => void;
  setSelectedCharacter: (character: 'K1' | 'K2' | 'K3' | 'K4' | 'K5' | 'K6' | 'K7' | 'K8') => void;
  setShowOnboarding: (show: boolean) => void;
  addCompletedQuest: (questId: string) => void;
  addAchievement: (achievementId: string) => void;
  setTooltips: (show: boolean) => void;
  setAutoRefresh: (enabled: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Default values
      theme: 'dark',
      performanceMode: false,
      enableAnimations: true,
      enableParticles: true,
      enable3D: true,
      soundEnabled: false, // Default muted
      soundVolume: 0.3,
      language: 'en',
      selectedCharacter: 'K1',
      showOnboarding: true,
      completedQuests: [],
      achievements: [],
      showTooltips: true,
      autoRefresh: true,

      // Actions
      setTheme: (theme) => set({ theme }),
      
      setPerformanceMode: (enabled) => set({ 
        performanceMode: enabled,
        enableAnimations: !enabled,
        enableParticles: !enabled,
        enable3D: !enabled
      }),
      
      setAnimations: (enabled) => set({ enableAnimations: enabled }),
      setParticles: (enabled) => set({ enableParticles: enabled }),
      set3D: (enabled) => set({ enable3D: enabled }),
      
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setSoundVolume: (volume) => set({ soundVolume: Math.max(0, Math.min(1, volume)) }),
      
      setLanguage: (language) => set({ language }),
      setSelectedCharacter: (character) => set({ selectedCharacter: character }),
      setShowOnboarding: (show) => set({ showOnboarding: show }),
      
      addCompletedQuest: (questId) => {
        const { completedQuests } = get();
        if (!completedQuests.includes(questId)) {
          set({ completedQuests: [...completedQuests, questId] });
        }
      },
      
      addAchievement: (achievementId) => {
        const { achievements } = get();
        if (!achievements.includes(achievementId)) {
          set({ achievements: [...achievements, achievementId] });
        }
      },
      
      setTooltips: (show) => set({ showTooltips: show }),
      setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
    }),
    {
      name: 'goldium-settings',
      version: 1,
    }
  )
);

// Performance mode hook
export function usePerformanceMode() {
  const { performanceMode, enableAnimations, enableParticles, enable3D } = useSettings();
  
  return {
    performanceMode,
    enableAnimations: enableAnimations && !performanceMode,
    enableParticles: enableParticles && !performanceMode,
    enable3D: enable3D && !performanceMode,
  };
}