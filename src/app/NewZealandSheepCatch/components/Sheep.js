'use client';
import React, { useRef, useEffect, useState } from 'react';

const Sheep = ({ id, type, position, direction, onClick, sheepRefs }) => {
  const ref = useRef(null);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (ref.current) {
      sheepRefs.current[id] = {
        ref,
        type,
        position,
        direction,
      };
    }
    return () => {
      delete sheepRefs.current[id];
    };
  }, [id, type, position, direction, sheepRefs]);

  const handleClick = () => {
    setIsFading(true);
    setTimeout(() => {
      onClick();
    }, 200);
  };

  const src = type === 'black' ? '/images/black.png' : '/images/white.png';

  return (
    <img
      ref={ref}
      src={src}
      alt={`${type} sheep`}
      className={`absolute w-32 h-32 cursor-pointer transition-opacity duration-200 ${isFading ? 'opacity-0' : 'opacity-100'}`}
      style={{
        left: position.x,
        top: position.y,
        transition: 'opacity 0.2s ease',
      }}
      onClick={handleClick}
    />
  );
};

export default Sheep;
