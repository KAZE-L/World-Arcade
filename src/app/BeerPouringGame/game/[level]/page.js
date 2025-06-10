'use client';

import BeerCup from '@/app/BeerPouringGame/componets/BeerCup';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function GamePage() {
  const { level } = useParams();
  const router = useRouter();

  const [progress, setProgress] = useState(0);
  const [isPouring, setIsPouring] = useState(false);
  const [keyPressCount, setKeyPressCount] = useState(0);
  const [shouldCheckResult, setShouldCheckResult] = useState(false);
  const intervalRef = useRef(null);

  const goalMap = {
    1: 80,
    2: 90,
    3: 95,
  };
  const numericLevel = parseInt(level);
  const goal = goalMap[numericLevel] || 100;

  const startPouring = () => {
    if (intervalRef.current) return;
    setIsPouring(true);
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          stopPouring();
          return 100;
        }
        return prev + 1;
      });
    }, 50);
  };

  const stopPouring = () => {
    setIsPouring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setShouldCheckResult(true);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space') {
        setKeyPressCount(prev => {
          const newCount = prev + 1;
          if (newCount === 1) startPouring();
          if (newCount === 2) stopPouring();
          return newCount;
        });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPouring]);

  useEffect(() => {
    if (shouldCheckResult) {
      if (progress >= goal && progress <= 100) {
        if (numericLevel < 3) {
          router.push(`/BeerPouringGame/game/${numericLevel + 1}`);
        } else {
          router.push('/BeerPouringGame/win');
        }
      } else {
        router.push('/BeerPouringGame/gameover');
      }
    }
  }, [shouldCheckResult]);

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="w-full min-w-[300px] h-full bg-center bg-no-repeat bg-cover scale-100 max-md:scale-[0.9] transition-transform duration-500"
      style={{ backgroundImage: "url('/Gaming.png')" }}>
        <div className="flex flex-col items-center justify-center min-h-screen text-white">
          <h1 className="text-[clamp(3rem,5vw,10rem)] font-bold fixed top-12 xl:top-18 text-center text-black font-pixelify">Level {level}</h1>
          <div className="absolute bottom-10 w-full flex justify-center">
            <BeerCup progress={progress} goal={goal} height={400}/>
          </div>
        </div>
      </div>
    </div>
  );
}
