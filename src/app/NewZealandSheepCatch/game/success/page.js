'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

const Success = () => {
  const router = useRouter()

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen font-pixel text-black p-6 overflow-hidden">
      {/* 背景圖層 */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center filter brightness-100 saturate-110"
        style={{ backgroundImage: "url('/images/wood.png')" }}
      />

      {/* 主要內容 */}
      <div className="animate-fade-in flex flex-col items-center justify-center w-full gap-6">
        <h1 className="text-6xl font-bold text-black drop-shadow-[2px_2px_0_#ffffff]">
          <strong>Level Completed!</strong>
        </h1>

        <button
          onClick={() => router.push('/NewZealandSheepCatch')}
          className="text-2xl px-6 py-3 bg-[#222] text-white border-[4px] border-black hover:bg-gray-800 pixel-border transition duration-200 font-bold"
        >
          <strong>Home</strong>
        </button>
      </div>
    </div>
  )
}

export default Success
