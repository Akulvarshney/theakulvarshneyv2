"use client";
import { useRef, useMemo, type ReactElement } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Scroll State Reactor                                              */
/* ------------------------------------------------------------------ */

const scrollState = { y: 0, targetY: 0, velocity: 0 };
if (typeof window !== "undefined") {
  let lastScrollY = window.scrollY;
  let lastTime = performance.now();
  window.addEventListener(
    "scroll",
    () => {
      const now = performance.now();
      const dt = Math.max(now - lastTime, 16);
      const dy = window.scrollY - lastScrollY;
      scrollState.targetY = window.scrollY;
      scrollState.velocity = Math.min(Math.max(dy / dt, -6), 6);
      lastScrollY = window.scrollY;
      lastTime = now;
    },
    { passive: true },
  );
}

/* ------------------------------------------------------------------ */
/*  Animated geometry meshes – reactive to scroll & time               */
/* ------------------------------------------------------------------ */

function WaveGrid() {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(16, 3, 128, 24);
    return g;
  }, []);

  useFrame((_, delta) => {
    scrollState.y += (scrollState.targetY - scrollState.y) * 0.1;
    scrollState.velocity *= 0.94;
    timeRef.current += Math.min(delta, 0.1);

    const t = timeRef.current;
    const sy = scrollState.y * 0.003;
    const sVel = Math.abs(scrollState.velocity) * 0.35;
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z =
        Math.sin(x * 0.6 + t * 0.8 + sy) *
        Math.cos(y * 1.2 + t * 0.5) *
        (0.35 + sVel);
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    if (meshRef.current) {
      meshRef.current.rotation.x = -0.65 + Math.sin(sy * 0.6) * 0.15;
      meshRef.current.rotation.z = Math.sin(t * 0.2 + sy) * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geo}>
      <meshBasicMaterial wireframe color="#b93717" transparent opacity={0.22} />
    </mesh>
  );
}

function FloatingRings() {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const ringCount = 7;
  const rings = useMemo(() => {
    return Array.from({ length: ringCount }, (_, i) => ({
      radius: 0.5 + i * 0.35,
      speed: 0.3 + Math.random() * 0.4,
      phase: (Math.PI * 2 * i) / ringCount,
      yOffset: (Math.random() - 0.5) * 0.6,
    }));
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    scrollState.y += (scrollState.targetY - scrollState.y) * 0.1;
    scrollState.velocity *= 0.94;
    timeRef.current += Math.min(delta, 0.1);

    const t = timeRef.current;
    const sy = scrollState.y * 0.0025;
    const sVel = scrollState.velocity * 0.04;

    groupRef.current.rotation.z = t * 0.06 + sy;
    groupRef.current.rotation.x = Math.sin(sy) * 0.25 + sVel;

    groupRef.current.children.forEach((child, i) => {
      const ring = rings[i];
      if (ring) {
        child.rotation.x = Math.sin(t * ring.speed + ring.phase + sy) * 0.6;
        child.rotation.y =
          Math.cos(t * ring.speed * 0.7 + ring.phase + sy) * 0.6;
        child.position.y = ring.yOffset + Math.sin(t * 0.4 + ring.phase) * 0.15;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, ring.yOffset, 0]}>
          <torusGeometry args={[ring.radius, 0.015, 16, 64]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#b93717" : "#171918"}
            transparent
            opacity={0.28 - i * 0.02}
          />
        </mesh>
      ))}
    </group>
  );
}

function DriftingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 600;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      velocities[i * 3] = (Math.random() - 0.5) * 0.006;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.004;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    scrollState.y += (scrollState.targetY - scrollState.y) * 0.1;
    scrollState.velocity *= 0.94;

    const sVel = scrollState.velocity * 0.025;
    const pos = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      pos.array[i * 3] += velocities[i * 3];
      pos.array[i * 3 + 1] += velocities[i * 3 + 1] - sVel;
      pos.array[i * 3 + 2] += velocities[i * 3 + 2];

      if (Math.abs(pos.array[i * 3]) > 9) velocities[i * 3] *= -1;
      if (pos.array[i * 3 + 1] > 2) pos.array[i * 3 + 1] = -2;
      if (pos.array[i * 3 + 1] < -2) pos.array[i * 3 + 1] = 2;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#b93717"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function MorphingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const originalPositions = useRef<Float32Array | null>(null);

  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1.2, 4);
    return g;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    scrollState.y += (scrollState.targetY - scrollState.y) * 0.1;
    scrollState.velocity *= 0.94;
    timeRef.current += Math.min(delta, 0.1);

    const t = timeRef.current;
    const sy = scrollState.y * 0.003;
    const sVel = Math.abs(scrollState.velocity) * 0.25;
    const pos = geo.attributes.position;

    if (!originalPositions.current) {
      originalPositions.current = new Float32Array(pos.array);
    }

    for (let i = 0; i < pos.count; i++) {
      const ox = originalPositions.current[i * 3];
      const oy = originalPositions.current[i * 3 + 1];
      const oz = originalPositions.current[i * 3 + 2];
      const noise =
        Math.sin(ox * 2 + t * 0.7 + sy) *
        Math.cos(oy * 2.5 + t * 0.5) *
        (0.15 + sVel);
      pos.setX(i, ox + ox * noise);
      pos.setY(i, oy + oy * noise);
      pos.setZ(i, oz + oz * noise);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    meshRef.current.rotation.y = t * 0.15 + sy * 1.2;
    meshRef.current.rotation.x = t * 0.08 + sy * 0.8;
  });

  return (
    <mesh ref={meshRef} geometry={geo}>
      <meshBasicMaterial wireframe color="#171918" transparent opacity={0.16} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Divider variants                                                    */
/* ------------------------------------------------------------------ */

type DividerVariant = "wave" | "rings" | "particles" | "sphere";

const scenes: Record<DividerVariant, () => ReactElement> = {
  wave: WaveGrid,
  rings: FloatingRings,
  particles: DriftingParticles,
  sphere: MorphingSphere,
};

/* ------------------------------------------------------------------ */
/*  Exported component                                                  */
/* ------------------------------------------------------------------ */

interface SectionDividerProps {
  variant?: DividerVariant;
  label?: string;
  className?: string;
  /** Divider height in px. Default 180 */
  height?: number;
}

export default function SectionDivider({
  variant = "wave",
  label,
  className = "",
  height = 180,
}: SectionDividerProps) {
  const Scene = scenes[variant];

  return (
    <div
      className={`section-divider section-divider--${variant} ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
      {label && <span className="section-divider__label">{label}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ChapterBreak — Monumental full-bleed section transition cover      */
/* ------------------------------------------------------------------ */

export interface ChapterBreakProps {
  number: string;
  tag: string;
  title: string;
  description: string;
  theme?: "light" | "dark" | "blueprint";
  variant?: DividerVariant;
}

export function ChapterBreak({
  number,
  tag,
  title,
  description,
  theme = "light",
  variant = "wave",
}: ChapterBreakProps) {
  const Scene = scenes[variant];

  return (
    <div className={`chapter-break chapter-break--${theme}`} aria-hidden="true">
      <div className="chapter-break__watermark">{number}</div>
      <div className="chapter-break__canvas">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </div>
      <div className="chapter-break__content wrap">
        <div className="chapter-break__badge">
          <span className="chapter-break__num">CHAPTER {number}</span>
          <span className="chapter-break__slash">//</span>
          <span className="chapter-break__tag">{tag}</span>
        </div>
        <h2 className="chapter-break__title">{title}</h2>
        <p className="chapter-break__desc">{description}</p>
      </div>
    </div>
  );
}
