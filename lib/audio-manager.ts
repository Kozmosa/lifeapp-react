export class AudioManager {
  private audioCache = new Map<string, HTMLAudioElement>();

  private async preloadAudio(src: string): Promise<HTMLAudioElement> {
    if (this.audioCache.has(src)) {
      return this.audioCache.get(src)!;
    }

    const audio = new Audio(src);
    audio.preload = 'auto';
    
    return new Promise((resolve, reject) => {
      audio.addEventListener('canplaythrough', () => {
        this.audioCache.set(src, audio);
        resolve(audio);
      }, { once: true });
      
      audio.addEventListener('error', reject, { once: true });
    });
  }

  async playTaskCompletionSound(): Promise<void> {
    try {
      const audio = await this.preloadAudio('/finish.mp3');
      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      console.warn('Failed to play task completion sound:', error);
    }
  }

  async playAllTasksCompletionSound(): Promise<void> {
    try {
      const audio = await this.preloadAudio('/all_finish.mp3');
      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      console.warn('Failed to play all tasks completion sound:', error);
    }
  }
}

export const audioManager = new AudioManager();