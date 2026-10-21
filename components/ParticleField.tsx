"use client";
import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Filter THREE.Clock deprecation warning from @react-three/fiber internal clock
if (typeof window !== "undefined") {
  const origWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Clock: This module has been deprecated") ||
        args[0].includes("THREE.Clock"))
    ) {
      return;
    }
    origWarn.apply(console, args);
  };
}

/* ------------------------------------------------------------------ */
/*  Scroll reactor for particles                                      */
/* ------------------------------------------------------------------ */

const scrollTracker = { velocity: 0 };
if (typeof window !== "undefined") {
  let lastScrollY = window.scrollY;
  let lastTime = performance.now();
  window.addEventListener(
    "scroll",
    () => {
      const now = performance.now();
      const dt = Math.max(now - lastTime, 16);
      const dy = window.scrollY - lastScrollY;
      scrollTracker.velocity = Math.min(Math.max(dy / dt, -5), 5);
      lastScrollY = window.scrollY;
      lastTime = now;
    },
    { passive: true },
  );
}

/* ------------------------------------------------------------------ */
/*  Interactive particle cloud that reacts to mouse & scroll           */
/* ------------------------------------------------------------------ */

interface ParticleCloudProps {
  count?: number;
  color?: string;
  size?: number;
  spread?: number;
  speed?: number;
  interactive?: boolean;
}

function ParticleCloud({
  count = 300,
  color = "#b93717",
  size = 0.02,
  spread = 10,
  speed = 0.3,
  interactive = true,
}: ParticleCloudProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const { positions, originalPositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * (spread * 0.4);
      const z = (Math.random() - 0.5) * 3;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
    }
    return { positions, originalPositions };
  }, [count, spread]);

  const onPointerMove = useCallback(
    (e: { point: THREE.Vector3 }) => {
      if (!interactive) return;
      mouse.current.set(
        e.point.x / (viewport.width * 0.5),
        e.point.y / (viewport.height * 0.5),
      );
    },
    [interactive, viewport],
  );

  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    scrollTracker.velocity *= 0.94;
    timeRef.current += Math.min(delta, 0.1);

    const sVel = scrollTracker.velocity * 0.15;
    const t = timeRef.current * speed;
    const pos = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      const ox = originalPositions[i * 3];
      const oy = originalPositions[i * 3 + 1];
      const oz = originalPositions[i * 3 + 2];

      const drift =
        Math.sin(ox * 0.5 + t) * 0.12 + Math.cos(oy * 0.7 + t * 0.8) * 0.08;

      let mx = 0,
        my = 0;
      if (interactive) {
        const dx = ox - mouse.current.x * spread * 0.5;
        const dy = oy - mouse.current.y * spread * 0.2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 3.2) {
          const force = ((3.2 - dist) / 3.2) * 1.4;
          mx = (dx / dist) * force;
          my = (dy / dist) * force;
        }
      }

      pos.array[i * 3] = ox + drift + mx;
      pos.array[i * 3 + 1] = oy + drift * 0.5 + my - sVel;
      pos.array[i * 3 + 2] = oz + Math.sin(t * 0.5 + i * 0.1) * 0.05;
    }
    pos.needsUpdate = true;
  });

  return (
    <group>
      {interactive && (
        <mesh onPointerMove={onPointerMove} visible={false}>
          <planeGeometry args={[spread * 2, spread * 2]} />
          <meshBasicMaterial />
        </mesh>
      )}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={size}
          color={color}
          transparent
          opacity={0.65}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Connected lines between nearby particles                           */
/* ------------------------------------------------------------------ */

function ConnectedMesh({
  count = 80,
  color = "#171918",
  spread = 8,
}: {
  count?: number;
  color?: string;
  spread?: number;
}) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const maxDist = 1.8;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * (spread * 0.3);
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      velocities[i * 3] = (Math.random() - 0.5) * 0.008;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    return { positions, velocities };
  }, [count, spread]);

  const linePositions = useMemo(
    () => new Float32Array(count * count * 6),
    [count],
  );

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;
    scrollTracker.velocity *= 0.94;
    const sVel = scrollTracker.velocity * 0.02;

    const pAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      for (let d = 0; d < 3; d++) {
        pAttr.array[i * 3 + d] += velocities[i * 3 + d];
      }
      pAttr.array[i * 3 + 1] -= sVel;

      if (Math.abs(pAttr.array[i * 3]) > spread * 0.5) velocities[i * 3] *= -1;
      if (Math.abs(pAttr.array[i * 3 + 1]) > spread * 0.15)
        velocities[i * 3 + 1] *= -1;
      if (Math.abs(pAttr.array[i * 3 + 2]) > 1) velocities[i * 3 + 2] *= -1;
    }
    pAttr.needsUpdate = true;

    let lineIdx = 0;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pAttr.array[i * 3] - pAttr.array[j * 3];
        const dy = pAttr.array[i * 3 + 1] - pAttr.array[j * 3 + 1];
        const dz = pAttr.array[i * 3 + 2] - pAttr.array[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < maxDist) {
          linePositions[lineIdx++] = pAttr.array[i * 3];
          linePositions[lineIdx++] = pAttr.array[i * 3 + 1];
          linePositions[lineIdx++] = pAttr.array[i * 3 + 2];
          linePositions[lineIdx++] = pAttr.array[j * 3];
          linePositions[lineIdx++] = pAttr.array[j * 3 + 1];
          linePositions[lineIdx++] = pAttr.array[j * 3 + 2];
        }
      }
    }

    const lineGeo = linesRef.current.geometry;
    lineGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions.slice(0, lineIdx), 3),
    );
    lineGeo.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color={color}
          transparent
          opacity={0.5}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color={color} transparent opacity={0.09} />
      </lineSegments>
    </group>
  );
}

type FieldVariant = "particles" | "mesh" | "dual";

interface ParticleFieldProps {
  variant?: FieldVariant;
  color?: string;
  className?: string;
  height?: number | string;
}

export default function ParticleField({
  variant = "particles",
  color = "#b93717",
  className = "",
  height = "100%",
}: ParticleFieldProps) {
  return (
    <div
      className={`particle-field ${className}`}
      style={{
        height,
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent", pointerEvents: "auto" }}
      >
        {variant === "particles" && <ParticleCloud color={color} />}
        {variant === "mesh" && <ConnectedMesh color={color} />}
        {variant === "dual" && (
          <>
            <ParticleCloud color={color} count={200} size={0.018} />
            <ConnectedMesh color={color} count={40} />
          </>
        )}
      </Canvas>
    </div>
  );
}
