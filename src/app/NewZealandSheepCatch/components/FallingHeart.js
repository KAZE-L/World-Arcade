'use client';
import React, { useEffect, useState } from 'react';

const FallingHeart = ({ x, y, onDone }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onDone) onDone(); // 通知外部移除
    }, 1000); // 與動畫時間一致

    return () => clearTimeout(timer);
  }, [onDone]);

  return visible ? (
    <div
      className="absolute w-8 h-8 bg-no-repeat bg-contain pointer-events-none animate-heart-fall"
      style={{
        left: x,
        top: y,
        backgroundImage: "url('/images/heart.png')",
      }}
    />
  ) : null;
};

export default FallingHeart;
