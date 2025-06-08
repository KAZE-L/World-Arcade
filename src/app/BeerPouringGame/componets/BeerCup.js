'use client';

export default function BeerCup({ progress = 0, goal = 80, height = 300 }) {
  const progressHeight = (progress / 100) * height *0.7;
  const goalY = (goal / 100) * height * 0.7 ;

  return (
    <div
      className="relative mx-auto rounded-b-xl overflow-hidden bg-[url('/beerGlass.png')] bg-no-repeat bg-contain bg-bottom"
      style={{ width: `${height}px`, height: `${height}px` }}
    >
      {/* 黃色倒酒進度條 */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[47%] bg-yellow-400 rounded-b-2xl transition-all duration-3 00 ease-in-out"
        style={{ height: `${progressHeight}px` }}
      />

      {/* 紅色目標線（視覺達標準） */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2  w-[60%] border-t-2 border-red-500"
        style={{ bottom: `${goalY}px` }}
      />
    </div>
  );
}