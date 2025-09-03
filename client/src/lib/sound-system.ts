import { Howl } from 'howler';

class SoundSystem {
  private sounds: { [key: string]: Howl } = {};
  private isMuted: boolean = true; // Default muted
  private volume: number = 0.3;

  constructor() {
    // Initialize sounds (will be loaded lazily)
    this.initializeSounds();
    
    // Load mute preference
    const saved = localStorage.getItem('goldium-sound-muted');
    this.isMuted = saved ? JSON.parse(saved) : true;
  }

  private initializeSounds() {
    // Create sound instances (files will be created later)
    this.sounds = {
      coin: new Howl({
        src: ['/sounds/coin.mp3', '/sounds/coin.ogg'],
        volume: this.volume,
        preload: false,
        onloaderror: () => console.log('🔇 Coin sound not found - using silent fallback')
      }),
      vault: new Howl({
        src: ['/sounds/vault.mp3', '/sounds/vault.ogg'],
        volume: this.volume,
        preload: false,
        onloaderror: () => console.log('🔇 Vault sound not found - using silent fallback')
      }),
      success: new Howl({
        src: ['/sounds/success.mp3', '/sounds/success.ogg'],
        volume: this.volume,
        preload: false,
        onloaderror: () => console.log('🔇 Success sound not found - using silent fallback')
      }),
      chime: new Howl({
        src: ['/sounds/chime.mp3', '/sounds/chime.ogg'],
        volume: this.volume,
        preload: false,
        onloaderror: () => console.log('🔇 Chime sound not found - using silent fallback')
      }),
      notification: new Howl({
        src: ['/sounds/notification.mp3', '/sounds/notification.ogg'],
        volume: this.volume * 0.5,
        preload: false,
        onloaderror: () => console.log('🔇 Notification sound not found - using silent fallback')
      })
    };
  }

  public play(soundName: string) {
    if (this.isMuted) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      try {
        sound.play();
        console.log(`🔊 Playing sound: ${soundName}`);
      } catch (error) {
        console.log(`🔇 Failed to play ${soundName}:`, error);
      }
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('goldium-sound-muted', JSON.stringify(muted));
    
    // Update all sound volumes
    Object.values(this.sounds).forEach(sound => {
      sound.volume(muted ? 0 : this.volume);
    });
    
    console.log(`🔊 Sound ${muted ? 'muted' : 'unmuted'}`);
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (!this.isMuted) {
      Object.values(this.sounds).forEach(sound => {
        sound.volume(this.volume);
      });
    }
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  // Specific sound methods for easy use
  public playCoin() { this.play('coin'); }
  public playVault() { this.play('vault'); }
  public playSuccess() { this.play('success'); }
  public playChime() { this.play('chime'); }
  public playNotification() { this.play('notification'); }
}

// Global sound system instance
export const soundSystem = new SoundSystem();

// React hook for sound controls
export function useSoundSystem() {
  const [isMuted, setIsMuted] = React.useState(soundSystem.isSoundMuted());
  const [volume, setVolume] = React.useState(soundSystem.getVolume());

  const toggleMute = () => {
    const newMuted = !isMuted;
    soundSystem.setMuted(newMuted);
    setIsMuted(newMuted);
  };

  const changeVolume = (newVolume: number) => {
    soundSystem.setVolume(newVolume);
    setVolume(newVolume);
  };

  return {
    isMuted,
    volume,
    toggleMute,
    changeVolume,
    playCoin: () => soundSystem.playCoin(),
    playVault: () => soundSystem.playVault(),
    playSuccess: () => soundSystem.playSuccess(),
    playChime: () => soundSystem.playChime(),
    playNotification: () => soundSystem.playNotification(),
  };
}

// Import React for the hook
import React from 'react';