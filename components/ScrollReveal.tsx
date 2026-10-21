"use client";
import { useRef, type ReactNode } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  type Variant,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Preset animation variants                                          */
/* ------------------------------------------------------------------ */

export type RevealPreset =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale-up"
  | "blur-in"
  | "slide-rotate"
  | "stagger-children";

const presets: Record<RevealPreset, { hidden: Variant; visible: Variant }> = {
  "fade-up": {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  "scale-up": {
    hidden: { opacity: 0, scale: 0.88 },
    visible: { opacity: 1, scale: 1 },
  },
  "blur-in": {
    hidden: { opacity: 0, filter: "blur(14px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  "slide-rotate": {
    hidden: { opacity: 0, y: 35, rotate: -2 },
    visible: { opacity: 1, y: 0, rotate: 0 },
  },
  "stagger-children": {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  },
};

/* ------------------------------------------------------------------ */
/*  ScrollReveal Component                                            */
/* ------------------------------------------------------------------ */

interface ScrollRevealProps {
  children: ReactNode;
  preset?: RevealPreset;
  /** Delay in seconds */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
  /** InView threshold 0–1 */
  threshold?: number;
  /** Trigger once or repeat */
  once?: boolean;
  /** Continuous parallax distance on Y axis in px */
  parallax?: number;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer";
  style?: React.CSSProperties;
}

export default function ScrollReveal({
  children,
  preset = "fade-up",
  delay = 0,
  duration = 0.75,
  threshold = 0.1,
  once = false,
  parallax,
  className = "",
  as = "div",
  style = {},
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    parallax ? [-parallax, parallax] : [0, 0],
  );
  const parallaxY = useSpring(rawParallaxY, { stiffness: 180, damping: 25 });

  const variants = presets[preset];
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      style={{
        ...(parallax ? { y: parallaxY } : {}),
        ...style,
      }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  ScrollParallax — Continuous scroll-driven translation             */
/* ------------------------------------------------------------------ */

export function ScrollParallax({
  children,
  speed = 30,
  className = "",
  style = {},
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  const smoothY = useSpring(y, { stiffness: 200, damping: 28 });

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  ScrollParallaxImage — Inner parallax movement on image             */
/* ------------------------------------------------------------------ */

export function ScrollParallaxImage({
  src,
  alt,
  width,
  height,
  className = "",
}: {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1.01, 1.06]);

  return (
    <div
      ref={ref}
      style={{
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          y,
          scale,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          willChange: "transform",
        }}
        className={className}
        loading="lazy"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  InteractiveCard3D — 3D cursor tilt with spring response           */
/* ------------------------------------------------------------------ */

export function InteractiveCard3D({
  children,
  className = "",
  style = {},
  maxTilt = 7,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 280, damping: 22 });
  const mouseY = useSpring(y, { stiffness: 280, damping: 22 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        ...style,
      }}
      className={className}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          height: "100%",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Child item for staggered reveals                                    */
/* ------------------------------------------------------------------ */

export function RevealItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
