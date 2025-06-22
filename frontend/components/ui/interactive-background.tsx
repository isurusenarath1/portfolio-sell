"use client";

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const InteractiveBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);
  
  const springConfig = { damping: 30, stiffness: 100, mass: 2 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const transformX1 = useTransform(smoothMouseX, [0, 1920], [-100, 100]);
  const transformY1 = useTransform(smoothMouseY, [0, 1080], [-100, 100]);

  const transformX2 = useTransform(smoothMouseX, [0, 1920], [100, -100]);
  const transformY2 = useTransform(smoothMouseY, [0, 1080], [100, -100]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-900">
      {/* Spheres */}
      <motion.div
        style={{ x: transformX1, y: transformY1 }}
        className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-600/40 opacity-70 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' }
        }}
      />
      <motion.div
        style={{ x: transformX2, y: transformY2 }}
        className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-pink-600/40 opacity-60 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
          transition: { duration: 12, repeat: Infinity, ease: 'easeInOut' }
        }}
      />
       <motion.div
        className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800/50 opacity-50 blur-2xl"
        animate={{
          scale: [1, 1.1, 1],
          transition: { duration: 15, repeat: Infinity, ease: 'easeInOut' }
        }}
      />

      {/* Noise Texture */}
      <div className="noise-texture" />
    </div>
  );
};

export default InteractiveBackground; 