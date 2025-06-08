'use client';

import { useEffect, useRef } from 'react';

export default function ClientLayout({ children }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const handleClick = () => {
      audioRef.current?.play();
      window.removeEventListener('click', handleClick);
    };
    window.addEventListener('click', handleClick);
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/bgMusic.mp4" loop preload="auto" />
      {children}
    </>
  );
}