// src/app/components/LifeDisplay.js
export default function LifeDisplay({ life }) {
  const totalLives = 3;
  return (
    <div className="absolute top-4 right-4 flex gap-2 z-50">
      {Array.from({ length: totalLives }).map((_, i) => (
        <img
          key={i}
          src={i < life ? "/images/heart.png" : "/images/heart_gray.png"}
          alt="life"
          className="w-8 h-8"
        />
      ))}
    </div>
  );
}
