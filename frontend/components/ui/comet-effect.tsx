"use client";

import { useEffect, useState } from 'react';

const CometEffect = () => {
  const [comets, setComets] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setComets(prevComets => [
        ...prevComets,
        { x: e.clientX, y: e.clientY, id: Date.now() }
      ]);

      setTimeout(() => {
        setComets(prev => prev.slice(1));
      }, 200); // Comet tail length
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
      {comets.map((comet, index) => (
        <div
          key={comet.id}
          className="absolute rounded-full bg-gradient-to-b from-purple-400 to-pink-400"
          style={{
            left: comet.x,
            top: comet.y,
            width: `${5 - index * 0.2}px`,
            height: `${5 - index * 0.2}px`,
            opacity: 1 - index / comets.length,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(2px)',
            transition: 'opacity 0.5s linear'
          }}
        />
      ))}
    </div>
  );
};

export default CometEffect; 