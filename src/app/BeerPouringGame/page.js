'use client';

import { useRouter } from 'next/navigation';

export default function StartPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/BeerPouringGame/game/1');
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center" 
    style={{ backgroundImage: 'url("/START_PAGE.png")' }}>
      <div className="bg-[#555555]/40 backdrop-blur-md flex flex-col items-center justify-center w-full h-[500px] max-md:h-[450px] max-sm:h-[300px] max-w-[800px] max-h-[600px] rounded-4xl m-16 p-4">
        <h1 className=" text-[clamp(2rem,6vw,5rem)] text-center text-[#F5C451] font-pixelify mt-16 mb-6 max-sm:mt-10 max-sm:mb-2 ">Pour the beer</h1>
        <div className="mt-4 mb-4 max-md:mt-3 max-md:mb-3">
          <h3 className=" text-[clamp(0.5rem,3vw,2rem)] text-center text-[#F5C451] font-pixelify">Welcome To Germany!!!</h3>
          <h3 className=" text-[clamp(0.5rem,3vw,2rem)] text-center text-[#F5C451] font-pixelify mt-1 mb-1">Press Space to Pour</h3>
          <h3 className=" text-[clamp(0.5rem,3vw,2rem)] text-center text-[#F5C451] font-pixelify mt-1 mb-1">Second Press to Stop</h3>
        </div>
        <button onClick={handleStart} className=" bg-[#A85D22]/90 mb-4 max-md:mb-3 rounded-2xl w-[clamp(100px,40vw,300px)] h-[clamp(60px,30vw,90px)] items-center justify-center cursor-pointer">
        
          <h2 className="text-[clamp(0.5rem,8vw,3.5rem)] text-center text-[#F5C451] font-pixelify mt-1 mb-1">Play</h2>
        </button>
      </div>
    </div>
  );
}
