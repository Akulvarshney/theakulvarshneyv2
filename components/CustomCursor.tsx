"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [cursorState, setCursorState] = useState<
    "default" | "link" | "explore" | "simulate" | "copy" | "view"
  >("default");
  const [cursorLabel, setCursorLabel] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastPosRef = useRef({ x: 0, y: 0, time: Date.now() });

  // Spring physics for smooth trailing cursor
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Velocity stretch calculation
  const [angle, setAngle] = useState(0);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  const visibleRef = useRef(false);
  const [visible, setVisible] = useState(false);

  // Enable custom cursor on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationFrameId: number;

    const colors = ["#b93717", "#ff6b4a", "#38bdf8", "#10b981", "#f59e0b"];

    function spawnParticle(x: number, y: number, speed: number) {
      if (particlesRef.current.length > 50) return;
      const count = Math.min(Math.floor(speed * 0.15) + 1, 3);
      for (let i = 0; i < count; i++) {
        const pAngle = Math.random() * Math.PI * 2;
        const pSpeed = Math.random() * (speed * 0.08 + 1.2);
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(pAngle) * pSpeed * 0.6,
          vy: Math.sin(pAngle) * pSpeed * 0.6,
          life: 0,
          maxLife: 25 + Math.random() * 20,
          size: 1.5 + Math.random() * 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    function renderParticles() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.life++;

        const progress = p.life / p.maxLife;
        if (progress >= 1) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        const opacity = (1 - progress) * 0.75;
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(renderParticles);
    }

    animationFrameId = requestAnimationFrame(renderParticles);

    const onMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
        smoothX.jump(x);
        smoothY.jump(y);
      }
      mouseX.set(x);
      mouseY.set(y);

      const now = performance.now();
      const dt = Math.max(now - lastPosRef.current.time, 8);
      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = (dist / dt) * 16; // px per standard frame

      // Squash and stretch along movement vector
      if (dist > 2) {
        const moveAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
        setAngle(moveAngle);
        const stretch = Math.min(dist * 0.02, 0.45);
        setScaleX(1 + stretch);
        setScaleY(1 - stretch * 0.5);
      }

      lastPosRef.current = { x, y, time: now };

      // Spawn stardust particles on movement
      if (speed > 4) {
        spawnParticle(x, y, speed);
      }

      // Detect hover target state
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest(".browser-window") || target.closest(".web-project")) {
        setCursorState("explore");
        setCursorLabel("EXPLORE ↗");
      } else if (
        target.closest(".work-editorial-demo") ||
        target.closest(".work-editorial-project")
      ) {
        setCursorState("simulate");
        setCursorLabel("INSPECT");
      } else if (
        target.closest("button")?.textContent?.includes("Copy") ||
        target.closest(".contact-details a")
      ) {
        setCursorState("copy");
        setCursorLabel("CONNECT");
      } else if (target.closest(".hero-portrait")) {
        setCursorState("view");
        setCursorLabel("AKUL");
      } else if (
        target.closest("a, button, [role='button'], input, select, summary")
      ) {
        setCursorState("link");
        setCursorLabel("");
      } else {
        setCursorState("default");
        setCursorLabel("");
      }

      // Card Spotlight: pass mouse position to nearest interactive card
      const card = target.closest(
        ".browser-window, .work-editorial-project, .personal-work article",
      ) as HTMLElement | null;
      if (card) {
        const rect = card.getBoundingClientRect();
        const cardX = x - rect.left;
        const cardY = y - rect.top;
        card.style.setProperty("--mouse-x", `${cardX}px`);
        card.style.setProperty("--mouse-y", `${cardY}px`);
      }
    };

    const onClick = (e: MouseEvent) => {
      // Burst 12 particles on click
      for (let i = 0; i < 12; i++) {
        const pAngle = (i / 12) * Math.PI * 2;
        const pSpeed = 2 + Math.random() * 3.5;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(pAngle) * pSpeed,
          vy: Math.sin(pAngle) * pSpeed,
          life: 0,
          maxLife: 35 + Math.random() * 15,
          size: 2.5 + Math.random() * 3,
          color: colors[i % colors.length],
        });
      }
    };

    const onMouseLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    const onMouseEnter = (e: MouseEvent) => {
      visibleRef.current = true;
      setVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      smoothX.jump(e.clientX);
      smoothY.jump(e.clientY);
    };

    const onTouchStart = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, mouseX, mouseY, smoothX, smoothY]);

  if (!enabled) return null;

  const isExpanded = cursorState !== "default" && cursorState !== "link";
  const isLink = cursorState === "link";

  return (
    <>
      {/* Canvas for trailing stardust particles */}
      <canvas
        ref={canvasRef}
        className="cursor-particle-canvas"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 99990,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Outer fluid aura ring */}
      <motion.div
        className={`custom-cursor-follower ${cursorState}`}
        style={{
          x: smoothX,
          y: smoothY,
          rotate: angle,
          scaleX,
          scaleY,
          pointerEvents: "none",
          opacity: visible ? 1 : 0,
        }}
        animate={{
          width: isExpanded ? 88 : isLink ? 48 : 34,
          height: isExpanded ? 36 : isLink ? 48 : 34,
          borderRadius: isExpanded ? "20px" : "50%",
        }}
        transition={{ type: "spring", damping: 22, stiffness: 300 }}
      >
        {cursorLabel && (
          <motion.span
            className="cursor-label-text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ rotate: -angle }} // counter-rotate label so text remains readable
          >
            {cursorLabel}
          </motion.span>
        )}
      </motion.div>

      {/* Sharp pinpoint dot tracking raw mouse directly */}
      <motion.div
        className="custom-cursor-dot"
        style={{
          x: mouseX,
          y: mouseY,
          pointerEvents: "none",
          opacity: visible ? (isExpanded ? 0 : 1) : 0,
        }}
        animate={{
          scale: isExpanded ? 0 : isLink ? 1.4 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
