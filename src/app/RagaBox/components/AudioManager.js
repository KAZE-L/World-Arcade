export class AudioManager {
  constructor() {
    this.audioContext = null;
    this.audioBuffers = new Map();
    this.activeSources = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (error) {
      console.error('音頻初始化失敗:', error);
      throw error;
    }
  }

  async preloadAudio(file, duration) {
    try {
      const response = await fetch(`/RagaBox/audio/${file}.wav`);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.audioBuffers.set(file, {
        buffer: audioBuffer,
        duration: duration
      });
    } catch (error) {
      console.error(`無法加載音頻: ${file}`, error);
    }
  }

  async playSound(soundId, slotIndex, volume = 0.5) {
    if (!this.audioContext || !this.audioBuffers.has(soundId)) {
      console.warn(`音頻不存在: ${soundId}`);
      return;
    }

    try {
      // 停止該槽位現有的音頻
      this.stopSound(slotIndex);

      const audioData = this.audioBuffers.get(soundId);
      const source = this.audioContext.createBufferSource();
      const gain = this.audioContext.createGain();

      source.buffer = audioData.buffer;
      source.loop = true;
      gain.gain.value = volume;

      source.connect(gain);
      gain.connect(this.audioContext.destination);

      this.activeSources.set(slotIndex, { source, gain });
      source.start();
    } catch (error) {
      console.error('播放音頻失敗:', error);
    }
  }

  stopSound(slotIndex) {
    if (this.activeSources.has(slotIndex)) {
      const current = this.activeSources.get(slotIndex);
      try {
        current.source.stop();
        current.source.disconnect();
        current.gain.disconnect();
      } catch (e) {
        console.warn('停止音頻時出錯:', e);
      }
      this.activeSources.delete(slotIndex);
    }
  }

  stopAllSounds() {
    this.activeSources.forEach((audioData, slotIndex) => {
      this.stopSound(slotIndex);
    });
  }

  cleanup() {
    this.stopAllSounds();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
} 