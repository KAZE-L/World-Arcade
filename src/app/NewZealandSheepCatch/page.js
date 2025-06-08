'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const romanNumerals = ['I', 'II', 'III', 'IV', 'V']

export default function Home() {
  const [selectedLevel, setSelectedLevel] = useState(1)
  const router = useRouter()

  const handleStart = () => {
    router.push(`/NewZealandSheepCatch/game/level-${selectedLevel}`)
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen font-pixel text-gray-800 p-6 overflow-hidden">
      {/* 背景圖片層（加濾鏡） */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center filter brightness-100 saturate-110"
        style={{ backgroundImage: "url('/images/wood.png')" }}
      />

      {/* 主要內容區塊 */}
      <div className="animate-fade-in flex flex-col items-center justify-center w-full">
        {/* 標題 */}
        <h1 className="text-7xl font-bold mb-4 text-black drop-shadow-[2px_2px_0_#ffffff]">
          <strong>Catch the Black Sheep</strong>
        </h1>
        <h2 className="text-2xl font-bold mb-8 text-black drop-shadow-[1px_1px_0_#ffffff]">
          <strong>Select Level</strong>
        </h2>

        {/* 關卡按鈕 */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {romanNumerals.map((numeral, index) => {
            const level = index + 1
            return (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`w-14 h-14 border-[4px] text-2xl font-bold flex items-center justify-center pixel-border transition duration-150 ${
                  selectedLevel === level
                    ? 'bg-[#222] text-white border-[#222]'
                    : 'bg-white text-black border-black hover:bg-gray-200'
                }`}
              >
                <strong>{numeral}</strong>
              </button>
            )
          })}
        </div>

        {/* 當前選擇 */}
        <p className="mb-6 text-2xl font-bold text-black drop-shadow-[1px_1px_0_#ffffff]">
          <strong>Selected Level: {romanNumerals[selectedLevel - 1]}</strong>
        </p>

        {/* 開始按鈕 */}
        <button
          onClick={handleStart}
          className="text-4xl px-8 py-3 bg-[#222] text-white border-[4px] border-black hover:bg-gray-800 pixel-border transition duration-200 font-bold"
        >
          <strong>▶ Start Game</strong>
        </button>
      </div>
    </div>
  )
}
