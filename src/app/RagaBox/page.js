'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import './styles.css';

// 音樂主題分類 - 移到組件外部避免重新創建
const themes = {
  tabla: {
    name: '塔布拉鼓',
    files: ['tabla_01_08', 'tabla_02_16', 'tabla_03_08', 'tabla_04_16'],
    volume: 0.5
  },
  sitar: {
    name: '西塔琴',
    files: ['sitar_01_08', 'sitar_02_08', 'sitar_03_08', 'sitar_04_08'],
    volume: 0.3
  },
  pad: {
    name: '襯底音色',
    files: ['pad_01_16', 'pad_02_16', 'pad_03_16', 'pad_04_16'],
    volume: 0.3
  },
  vocal: {
    name: '人聲',
    files: ['vocal_01_16', 'vocal_02_08', 'vocal_03_16', 'vocal_04_16'],
    volume: 0.8
  }
};

export default function RagaBox() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [slots, setSlots] = useState(new Array(8).fill(null));
  const [cycleTimer, setCycleTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const audioContextRef = useRef(null);
  const audioBuffersRef = useRef(new Map());
  const activeSourcesRef = useRef(new Map());
  const loopIntervalRef = useRef(null);
  const slotsRef = useRef(slots);
  const isPlayingRef = useRef(isPlaying);
  const playStartTimeRef = useRef(null);
  const pendingScheduledSounds = useRef(new Map());
  const bpm = 120;

  // 同步refs與state
  useEffect(() => {
    slotsRef.current = slots;
  }, [slots]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // 計算到下一個16秒邊界的延遲時間（毫秒）
  const getDelayToNext16Second = useCallback(() => {
    if (!playStartTimeRef.current || !isPlayingRef.current) {
      return 0; // 如果沒有播放，立即開始
    }
    
    const currentTime = Date.now();
    const elapsedMs = currentTime - playStartTimeRef.current;
    
    // 16秒 = 16000毫秒
    const sixteenSecondMs = 16000;
    
    // 計算當前在16秒循環中的位置
    const positionInCycle = elapsedMs % sixteenSecondMs;
    
    // 計算到下一個16秒邊界的延遲
    const delayToNext16Second = sixteenSecondMs - positionInCycle;
    
    return delayToNext16Second;
  }, []);

  // 預加載音頻文件
  const preloadAudios = useCallback(async () => {
    for (const theme of Object.values(themes)) {
      for (const file of theme.files) {
        try {
          const response = await fetch(`/RagaBox/audio/${file}.wav`);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
          audioBuffersRef.current.set(file, {
            buffer: audioBuffer,
            duration: file.endsWith('_16') ? 16 : 8
          });
        } catch (error) {
          console.error(`無法加載音頻: ${file}`, error);
        }
      }
    }
  }, []);

  // 初始化音頻系統
  useEffect(() => {
    let isMounted = true; // 避免組件卸載後設置狀態
    
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        await preloadAudios();
        if (isMounted) {
          setIsLoading(false); // 加載完成
        }
      } catch (error) {
        console.error('音頻初始化失敗:', error);
        if (isMounted) {
          setIsLoading(false); // 即使失敗也停止加載狀態
        }
      }
    };

    initAudio();

    return () => {
      isMounted = false;
      // 清理音頻上下文
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      // 清理計時器
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
        loopIntervalRef.current = null;
      }
      // 停止所有音頻
      activeSourcesRef.current.forEach((audioData) => {
        try {
          if (audioData.source) {
            audioData.source.stop();
            audioData.source.disconnect();
          }
          if (audioData.gain) {
            audioData.gain.disconnect();
          }
        } catch (e) {
          console.warn('清理音頻時出錯:', e);
        }
      });
      activeSourcesRef.current.clear();
    };
  }, []); // 移除 preloadAudios 依賴

  // 播放聲音（支持延遲播放）
  const playSound = useCallback(async (soundId, slotIndex, delayMs = 0) => {
    if (!audioContextRef.current || !audioBuffersRef.current.has(soundId)) {
      console.warn(`音頻不存在: ${soundId}`);
      return;
    }

    try {
      // 停止該槽位現有的音頻
      if (activeSourcesRef.current.has(slotIndex)) {
        const current = activeSourcesRef.current.get(slotIndex);
        current.source.stop();
        current.source.disconnect();
        current.gain.disconnect();
        activeSourcesRef.current.delete(slotIndex);
      }

      // 如果有延遲，取消之前的定時器
      if (pendingScheduledSounds.current.has(slotIndex)) {
        clearTimeout(pendingScheduledSounds.current.get(slotIndex));
        pendingScheduledSounds.current.delete(slotIndex);
      }

      const playAudio = () => {
        try {
          const audioData = audioBuffersRef.current.get(soundId);
          const source = audioContextRef.current.createBufferSource();
          const gain = audioContextRef.current.createGain();

          source.buffer = audioData.buffer;
          source.loop = true;

          // 設置音量
          const themeType = soundId.split('_')[0];
          const theme = themes[themeType];
          if (theme) {
            gain.gain.value = theme.volume;
          }

          source.connect(gain);
          gain.connect(audioContextRef.current.destination);

          activeSourcesRef.current.set(slotIndex, { source, gain });
          pendingScheduledSounds.current.delete(slotIndex);

          source.start();
        } catch (error) {
          console.error('播放音頻失敗:', error);
        }
      };

      if (delayMs > 0) {
        // 安排延遲播放
        const timeoutId = setTimeout(playAudio, delayMs);
        pendingScheduledSounds.current.set(slotIndex, timeoutId);
      } else {
        // 立即播放
        playAudio();
      }
    } catch (error) {
      console.error('播放音頻失敗:', error);
    }
  }, []); // 移除 themes 依賴，因為現在它在組件外部

  // 重置槽位
  const resetSlot = useCallback((slotIndex) => {
    setSlots(prev => {
      const newSlots = [...prev];
      newSlots[slotIndex] = null;
      return newSlots;
    });

    // 停止音頻
    if (activeSourcesRef.current.has(slotIndex)) {
      const current = activeSourcesRef.current.get(slotIndex);
      try {
        current.source.stop();
        current.source.disconnect();
        current.gain.disconnect();
      } catch (e) {
        console.warn('停止音頻時出錯:', e);
      }
      activeSourcesRef.current.delete(slotIndex);
    }

    // 取消待播放的音頻
    if (pendingScheduledSounds.current.has(slotIndex)) {
      clearTimeout(pendingScheduledSounds.current.get(slotIndex));
      pendingScheduledSounds.current.delete(slotIndex);
    }
  }, []);

  // 更新角色槽位
  const updateCharacterSlot = useCallback((characterId, slotIndex) => {
    if (!characterId) return;

    setSlots(prev => {
      const newSlots = [...prev];
      newSlots[slotIndex] = characterId;
      return newSlots;
    });

    // 如果正在播放，計算到下一個16秒邊界的延遲
    if (isPlayingRef.current) {
      const delayMs = getDelayToNext16Second();
      playSound(characterId, slotIndex, delayMs);
    }
  }, [playSound, getDelayToNext16Second]);

  // 處理拖放
  const handleDrop = useCallback((e, slotIndex) => {
    e.preventDefault();
    const characterId = e.dataTransfer.getData('text/plain');
    updateCharacterSlot(characterId, slotIndex);
  }, [updateCharacterSlot]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDragStart = useCallback((e, characterId) => {
    e.dataTransfer.setData('text/plain', characterId);
  }, []);

  // 點擊槽位清除
  const handleSlotClick = useCallback((slotIndex) => {
    const currentSlots = slotsRef.current;
    if (currentSlots[slotIndex]) {
      resetSlot(slotIndex);
    }
  }, [resetSlot]);

  // 播放控制
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => {
      const newIsPlaying = !prev;
      
      if (newIsPlaying) {
        // 記錄播放開始時間
        playStartTimeRef.current = Date.now();
        
        // 開始播放所有槽位的音頻（立即播放，因為是新開始）
        const currentSlots = slotsRef.current;
        currentSlots.forEach((characterId, index) => {
          if (characterId) {
            playSound(characterId, index, 0); // 立即播放
          }
        });

        // 開始計時器
        const startTime = playStartTimeRef.current;
        loopIntervalRef.current = setInterval(() => {
          const elapsed = (Date.now() - startTime) / 1000;
          setCycleTimer(elapsed.toFixed(1));
        }, 100);
      } else {
        // 重置播放開始時間
        playStartTimeRef.current = null;
        
        // 停止所有音頻
        activeSourcesRef.current.forEach((audioData) => {
          try {
            audioData.source.stop();
            audioData.source.disconnect();
            audioData.gain.disconnect();
          } catch (e) {
            console.warn('停止音頻時出錯:', e);
          }
        });
        activeSourcesRef.current.clear();

        // 取消所有待播放的音頻
        pendingScheduledSounds.current.forEach((timeoutId) => {
          clearTimeout(timeoutId);
        });
        pendingScheduledSounds.current.clear();

        // 停止計時器
        if (loopIntervalRef.current) {
          clearInterval(loopIntervalRef.current);
          loopIntervalRef.current = null;
        }
        setCycleTimer(0);
      }

      return newIsPlaying;
    });
  }, [playSound]);

  // 獲取角色圖片路徑
  const getCharacterImage = (characterId) => {
    if (!characterId) return '/RagaBox/img/c0_idle.gif';

    const match = characterId.match(/(\d+)_(\d+)/);
    if (!match) return '/RagaBox/img/c0_idle.gif';

    const themeType = characterId.split('_')[0];
    const themeIndex = parseInt(match[1]);
    
    let imageNumber;
    switch(themeType) {
      case 'tabla':
        imageNumber = themeIndex;
        break;
      case 'sitar':
        imageNumber = themeIndex + 4;
        break;
      case 'pad':
        imageNumber = themeIndex + 8;
        break;
      case 'vocal':
        imageNumber = themeIndex + 12;
        break;
      default:
        return '/RagaBox/img/c0_idle.gif';
    }

    const paddedNumber = String(imageNumber).padStart(2, '0');
    return `/RagaBox/img/c${paddedNumber}_flash.gif`;
  };

  // 如果還在加載中，顯示加載畫面
  if (isLoading) {
    return (
      <div className="game-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ color: 'white', fontSize: '24px' }}>載入中...</div>
      </div>
    );
  }

  return (
    
    <div className="game-container">
      <div
        className="absolute z-10 cursor-pointer hover:scale-110 transition-transform"
        style={{ top: '1.5%', left: '1%'}}
        onClick={() => router.push('/')}
      >
        <div 
          className="rounded-lg shadow-lg transition-colors flex items-center justify-center"
          style={{ 
            backgroundColor: '#4a4a4a',
            borderColor: '#f2e5fb',
            width: '3.5vw',
            height: '3.5vw',
            maxHeight: '64px',
            maxWidth: '64px',
            minHeight: '32px',
            minWidth: '32px'
          }}
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            style={{ color: '#f2e5fb', width: '60%', height: '60%'}}
          >
            <path 
              d="M19 12H5M12 19L5 12L12 5" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="square" 
              strokeLinejoin="miter"
            />
          </svg>
        </div>
      </div>
      {/* 頂部控制列 */}
      <div className="top-controls">
        {/* <button className="menu-btn">☰</button> */}
        <div className="center-controls">
          {/* <button className="control-icon"></button>
          <button className="control-icon"></button>
          <button className="control-icon"></button> */}
        </div>
        <div className="right-controls">
          {/* <div className="cycle-timer">{cycleTimer}s</div> */}
          {/* <div className="play-hint">click to play</div> */}
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      </div>

      {/* 主舞台區域 */}
      <div className="stage">
        <div className="characters-row">
          {slots.map((characterId, index) => (
            <div
              key={index}
              className={`character-slot ${characterId ? 'playing' : ''}`}
              data-slot={index}
              onClick={() => handleSlotClick(index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
            >
              <div className="character-wrapper">
                <img
                  src={getCharacterImage(characterId)}
                  className="character-base"
                  alt="character"
                  style={{
                    opacity: characterId ? '1' : '0.3',
                    width: characterId ? '400%' : '250%',
                    height: characterId ? '400%' : '250%'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部工具列 */}
      <div className="bottom-controls">
        {/* 第一排：Tabla 和 Sitar */}
        <div className="theme-row">
          {/* Tabla組 */}
          <div className="icons-row" data-category="Tabla">
            {themes.tabla.files.map((file, index) => (
              <div
                key={file}
                className="icon-slot"
                draggable="true"
                data-character={file}
                onDragStart={(e) => handleDragStart(e, file)}
              >
                <img
                  src={`/RagaBox/img/c${String(index + 1).padStart(2, '0')}_flash.gif`}
                  className="character-base"
                  alt="character"
                />
              </div>
            ))}
          </div>
          {/* Sitar組 */}
          <div className="icons-row" data-category="Sitar">
            {themes.sitar.files.map((file, index) => (
              <div
                key={file}
                className="icon-slot"
                draggable="true"
                data-character={file}
                onDragStart={(e) => handleDragStart(e, file)}
              >
                <img
                  src={`/RagaBox/img/c${String(index + 5).padStart(2, '0')}_flash.gif`}
                  className="character-base"
                  alt="character"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 第二排：Pad 和 Vocal */}
        <div className="theme-row">
          {/* Pad組 */}
          <div className="icons-row" data-category="Pad">
            {themes.pad.files.map((file, index) => (
              <div
                key={file}
                className="icon-slot"
                draggable="true"
                data-character={file}
                onDragStart={(e) => handleDragStart(e, file)}
              >
                <img
                  src={`/RagaBox/img/c${String(index + 9).padStart(2, '0')}_flash.gif`}
                  className="character-base"
                  alt="character"
                />
              </div>
            ))}
          </div>
          {/* Vocal組 */}
          <div className="icons-row" data-category="Vocal">
            {themes.vocal.files.map((file, index) => (
              <div
                key={file}
                className="icon-slot"
                draggable="true"
                data-character={file}
                onDragStart={(e) => handleDragStart(e, file)}
              >
                <img
                  src={`/RagaBox/img/c${String(index + 13).padStart(2, '0')}_flash.gif`}
                  className="character-base"
                  alt="character"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
