"use client";
import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function Magnetic({
  children,
  className = "",
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 220, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Safe maximum displacement clamp (prevents elements from shooting out of frame)
    const maxOffset = 12;
    const rawDx = (clientX - centerX) * strength;
    const rawDy = (clientY - centerY) * strength;
    const dx = Math.max(-maxOffset, Math.min(maxOffset, rawDx));
    const dy = Math.max(-maxOffset, Math.min(maxOffset, rawDy));

    x.set(dx);
    y.set(dy);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`magnetic-wrap ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: smoothX,
        y: smoothY,
        display: "inline-block",
      }}
    >
      {children}
    </motion.div>
  );
}
