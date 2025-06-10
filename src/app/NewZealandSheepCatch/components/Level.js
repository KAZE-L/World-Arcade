'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sheep from '@/app/NewZealandSheepCatch/components/Sheep';
import FallingHeart from '@/app/NewZealandSheepCatch/components/FallingHeart';

const sheepCount = {
  black: 5,
  white: 12,
};

const Level = ({ level = 1 }) => {
  const [sheepData, setSheepData] = useState([]);
  const [hearts, setHearts] = useState([]);
  const [life, setLife] = useState(3);
  const [blackCaught, setBlackCaught] = useState(0);
  const [showLevelText, setShowLevelText] = useState(true);
  const [isPaused, setIsPaused] = useState(false); // ✅ 暫停狀態

  const sheepRefs = useRef({});
  const containerRef = useRef(null);
  const router = useRouter();

  const SHEEP_SIZE = 64;
  const BASE_SPEED = 1.5;
  const SPEED_MULTIPLIER = [1.0, 1.6, 2.2, 3.0, 4.0];
  const SPEED = BASE_SPEED * SPEED_MULTIPLIER[level - 1];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLevelText(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [level]);

  useEffect(() => {
    if (showLevelText) return;

    const initSheep = () => {
      const getRandom = (min, max) => Math.random() * (max - min) + min;
      const container = containerRef.current;
      if (!container) return;

      const { clientWidth, clientHeight } = container;
      const initial = [];

      for (let i = 0; i < sheepCount.black + sheepCount.white; i++) {
        const type = i < sheepCount.black ? 'black' : 'white';
        initial.push({
          id: Date.now() + i + Math.random(),
          type,
          position: {
            x: getRandom(0, clientWidth - SHEEP_SIZE),
            y: getRandom(0, clientHeight - SHEEP_SIZE),
          },
          direction: {
            dx: getRandom(-SPEED, SPEED),
            dy: getRandom(-SPEED, SPEED),
          },
        });
      }
      setSheepData(initial);
    };

    initSheep();
  }, [showLevelText, SPEED]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (showLevelText || isPaused) return;

      const container = containerRef.current;
      if (!container) return;

      const maxW = container.clientWidth;
      const maxH = container.clientHeight;

      setSheepData(prev => {
        const updated = prev.map(sheep => {
          let { x, y } = sheep.position;
          let { dx, dy } = sheep.direction;

          x += dx;
          y += dy;

          if (x < 0 || x > maxW - SHEEP_SIZE) dx = -dx + (Math.random() - 0.5);
          if (y < 0 || y > maxH - SHEEP_SIZE) dy = -dy + (Math.random() - 0.5);

          return {
            ...sheep,
            position: {
              x: Math.max(0, Math.min(maxW - SHEEP_SIZE, x)),
              y: Math.max(0, Math.min(maxH - SHEEP_SIZE, y)),
            },
            direction: { dx, dy },
          };
        });

        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const a = updated[i];
            const b = updated[j];
            const dx = a.position.x - b.position.x;
            const dy = a.position.y - b.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDist = SHEEP_SIZE;

            if (distance < minDist && distance !== 0) {
              const overlap = minDist - distance;
              const moveX = (dx / distance) * (overlap / 2);
              const moveY = (dy / distance) * (overlap / 2);

              updated[i].position.x += moveX;
              updated[i].position.y += moveY;
              updated[j].position.x -= moveX;
              updated[j].position.y -= moveY;
            } else if (distance === 0) {
              updated[i].position.x += Math.random() * 2 - 1;
              updated[i].position.y += Math.random() * 2 - 1;
            }
          }
        }

        return updated;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [SPEED, showLevelText, isPaused]);

  useEffect(() => {
    if (life <= 0 && blackCaught < sheepCount.black) {
      router.push(`/NewZealandSheepCatch/game/fail?level=${level}`);
    } else if (blackCaught >= sheepCount.black && life > 0) {
      if (level >= 5) {
        router.push('/NewZealandSheepCatch/game/success');
      } else {
        router.push(`/NewZealandSheepCatch/game/level-${level + 1}`);
      }
    }
  }, [life, blackCaught, router, level]);

  const handleSheepClick = (clickedSheep) => {
    if (clickedSheep.type === 'white') {
      setLife(prev => {
        const newLife = Math.max(0, prev - 1);
        setHearts(prevHearts => [
          ...prevHearts,
          { id: Date.now() + Math.random(), x: 16, y: 16 },
        ]);
        return newLife;
      });

      setSheepData(prev => {
        const newSheep = {
          id: Date.now() + Math.random(),
          type: 'white',
          position: {
            x: Math.random() * (containerRef.current.clientWidth - SHEEP_SIZE),
            y: Math.random() * (containerRef.current.clientHeight - SHEEP_SIZE),
          },
          direction: {
            dx: Math.random() * 2 * SPEED - SPEED,
            dy: Math.random() * 2 * SPEED - SPEED,
          },
        };
        return prev.filter(s => s.id !== clickedSheep.id).concat(newSheep);
      });
    } else {
      setBlackCaught(prev => prev + 1);
      setSheepData(prev => prev.filter(s => s.id !== clickedSheep.id));
    }
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center p-2"
      style={{
        backgroundImage: "url('/images/wood.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(1) saturate(1.1)',
      }}
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-[1024px] h-[calc(100vh-32px)] overflow-hidden"
      >
        {/* 背景層 */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/images/background.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(1.2) contrast(0.9)',
          }}
        />

        {/* 邊框 */}
        <div className="absolute top-0 left-0 w-full h-4 bg-[#39210c] z-5" />
        <div className="absolute bottom-0 left-0 w-full h-4 bg-[#39210c] z-5" />
        <div className="absolute top-0 left-0 h-full w-4 bg-[#39210c] z-5" />
        <div className="absolute top-0 right-0 h-full w-4 bg-[#39210c] z-5" />

        {/* 遊戲內容 */}
        <div className="absolute inset-0 z-10 font-pixel">
          {/* 暫停按鈕（用圖片） */}
            <button
              className="absolute top-4 right-5 z-20 w-12 h-12"
              onClick={() => setIsPaused(true)}
            >
              <img
                src="/images/pause.png"
                alt="Pause"
                className="w-full h-full object-contain hover:scale-110 transition-transform"
              />
            </button>


          {/* 暫停視窗 */}
          {isPaused && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60">
                <div className="bg-[#1f1f1f] border-4 border-white p-6 rounded-md flex flex-col gap-4 items-center">
                  <button
                    onClick={() => setIsPaused(false)}
                    className="text-white font-pixel text-2xl border-2 border-white px-4 py-2 hover:bg-white hover:text-black transition"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => router.push('/NewZealandSheepCatch')}
                    className="text-white font-pixel text-2xl border-2 border-white px-4 py-2 hover:bg-white hover:text-black transition"
                  >
                    Home
                  </button>
                </div>
              </div>
            )}

          {/* LEVEL 開場文字 */}
          {showLevelText && (
            <div className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm bg-black/80 animate-fade-out-quick">
              <div className="text-white text-5xl font-bold drop-shadow-lg font-pixel animate-pop-in-quick">
                LEVEL {level}
              </div>
            </div>
          )}

          {/* 生命值愛心 */}
          <div className="absolute top-4 left-5 flex gap-2 z-10">
            {[...Array(3)].map((_, i) => (
              <img
                key={i}
                src={i < life ? '/images/heart.png' : '/images/heart_gray.png'}
                alt="life"
                className="w-10 h-10"
              />
            ))}
          </div>

          {/* 羊群 */}
          {sheepData.map(sheep => (
            <Sheep
              key={sheep.id}
              id={sheep.id}
              type={sheep.type}
              position={sheep.position}
              direction={sheep.direction}
              onClick={() => handleSheepClick(sheep)}
              sheepRefs={sheepRefs}
            />
          ))}

          {/* 掉落愛心動畫 */}
          {hearts.map(h => (
            <FallingHeart
              key={h.id}
              x={h.x}
              y={h.y}
              onDone={() => setHearts(prev => prev.filter(ph => ph.id !== h.id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Level;
