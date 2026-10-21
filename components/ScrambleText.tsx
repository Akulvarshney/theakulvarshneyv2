"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const GLYPHS = "01_#%<>*+~=XΔΩ/\\[]";

export default function ScrambleText({
  text,
  as: Component = "span",
  className = "",
  scrambleOnMount = false,
  scrambleOnHover = true,
}: {
  text: string;
  as?: any;
  className?: string;
  scrambleOnMount?: boolean;
  scrambleOnHover?: boolean;
}) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isScramblingRef = useRef(false);

  const triggerScramble = useCallback(() => {
    if (isScramblingRef.current) return;
    isScramblingRef.current = true;

    let iteration = 0;
    const maxIterations = text.length * 3;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "\n") return char;
            if (index < iteration / 3) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        isScramblingRef.current = false;
      }

      iteration += 1;
    }, 25);
  }, [text]);

  useEffect(() => {
    setDisplayText(text);
    if (scrambleOnMount) {
      triggerScramble();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, scrambleOnMount, triggerScramble]);

  return (
    <Component
      className={`scramble-text ${className}`}
      onMouseEnter={scrambleOnHover ? triggerScramble : undefined}
      style={{ display: "inline-block" }}
    >
      {displayText}
    </Component>
  );
}
