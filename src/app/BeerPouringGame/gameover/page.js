'use client';

import { useRouter } from 'next/navigation';

export default function GameOverPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/BeerPouringGame');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: 'url("/Game_over.png")' }}
    >
      <div className="bg-[#555555]/40 backdrop-blur-md flex flex-col items-center justify-center w-full h-[400px] max-md:h-[450px] max-sm:h-[300px] max-w-[600px] max-h-[600px] rounded-4xl m-16 p-4">
        <h1 className=" text-[clamp(5rem,6vw,6rem)] max-md:text-6xl text-center text-[#F5C451] font-pixelify mt-12 mb-12">Game over</h1>
        <button onClick={handleStart} className=" bg-[#A85D22]/90 mb-4 max-md:mb-3 rounded-2xl w-[clamp(100px,40vw,300px)] h-[clamp(60px,30vw,90px)] items-center justify-center cursor-pointer">
          <h2 className="text-[clamp(0.5rem,8vw,3.5rem)] text-center text-[#F5C451] font-pixelify mt-1 mb-1">Restart</h2>
        </button>
      </div>
    </div>
  );
}
