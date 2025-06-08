'use client'

export default function GameOverlay({ win, onNext, onHome }) {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-50 text-white text-center p-8">
      <h1 className="text-4xl font-bold mb-4">
        {win ? '🎉 通關成功！' : '💀 遊戲結束'}
      </h1>
      <div className="flex gap-4 mt-4">
        {win ? (
          <button
            onClick={onNext}
            className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg"
          >
            下一關
          </button>
        ) : (
          <button
            onClick={onNext}
            className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg"
          >
            重新挑戰
          </button>
        )}
        <button
          onClick={onHome}
          className="bg-gray-500 hover:bg-gray-600 px-6 py-2 rounded-lg"
        >
          回首頁
        </button>
      </div>
    </div>
  )
}
