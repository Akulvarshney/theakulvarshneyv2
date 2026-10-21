"use client";
import { type ReactNode } from "react";
import ScrambleText from "./ScrambleText";
import { div } from "framer-motion/client";

interface TechItem {
  name: string;
  category: "AI" | "BACKEND" | "FRONTEND" | "DEVOPS";
  tag: string;
  color: string;
}

const LANE_1: TechItem[] = [
  {
    name: "Python",
    category: "AI",
    tag: "FastAPI / LangGraph",
    color: "#38bdf8",
  },
  {
    name: "Node.js",
    category: "BACKEND",
    tag: "High-Throughput APIs",
    color: "#10b981",
  },
  {
    name: "LangGraph",
    category: "AI",
    tag: "Multi-Agent Workflows",
    color: "#f59e0b",
  },
  {
    name: "BullMQ",
    category: "BACKEND",
    tag: "Redis Task Queues",
    color: "#ef4444",
  },
  {
    name: "PostgreSQL",
    category: "BACKEND",
    tag: "Relational DB / Prisma",
    color: "#6366f1",
  },
  {
    name: "Azure OpenAI",
    category: "AI",
    tag: "LLMs / RAG Workflows",
    color: "#38bdf8",
  },
  {
    name: "Redis",
    category: "BACKEND",
    tag: "In-Memory Caching",
    color: "#ef4444",
  },
  {
    name: "MongoDB",
    category: "BACKEND",
    tag: "Document Store",
    color: "#10b981",
  },
  {
    name: "Anthropic SDK",
    category: "AI",
    tag: "Claude 3.5 Sonnet",
    color: "#d97706",
  },
  {
    name: "WebSockets",
    category: "BACKEND",
    tag: "Socket.IO Realtime",
    color: "#8b5cf6",
  },
  {
    name: "FastAPI",
    category: "AI",
    tag: "Async Microservices",
    color: "#06b6d4",
  },
];

const LANE_2: TechItem[] = [
  {
    name: "TypeScript",
    category: "FRONTEND",
    tag: "Strict Types / SDKs",
    color: "#3b82f6",
  },
  {
    name: "Next.js 15",
    category: "FRONTEND",
    tag: "App Router / SSR",
    color: "#ffffff",
  },
  {
    name: "React Native",
    category: "FRONTEND",
    tag: "iOS & Android",
    color: "#38bdf8",
  },
  {
    name: "React",
    category: "FRONTEND",
    tag: "Modern Web Interfaces",
    color: "#38bdf8",
  },
  {
    name: "Docker",
    category: "DEVOPS",
    tag: "Containerization",
    color: "#0ea5e9",
  },
  {
    name: "AWS",
    category: "DEVOPS",
    tag: "Cloud Infrastructure",
    color: "#f59e0b",
  },
  {
    name: "Framer Motion",
    category: "FRONTEND",
    tag: "Kinetic UI Animations",
    color: "#ec4899",
  },
  {
    name: "Tailwind CSS",
    category: "FRONTEND",
    tag: "Responsive Design",
    color: "#06b6d4",
  },
  {
    name: "Three.js / R3F",
    category: "FRONTEND",
    tag: "3D Visuals & Shaders",
    color: "#10b981",
  },
  {
    name: "GitHub Actions",
    category: "DEVOPS",
    tag: "CI/CD Automation",
    color: "#8b5cf6",
  },
  {
    name: "Azure Cloud",
    category: "DEVOPS",
    tag: "Enterprise Cloud",
    color: "#0284c7",
  },
];

function MarqueeTrack({
  items,
  reverse = false,
}: {
  items: TechItem[];
  reverse?: boolean;
}) {
  // Duplicate for seamless infinite loop
  const duplicated = [...items, ...items, ...items];

  return (
    <div className={`marquee-track-container ${reverse ? "reverse" : ""}`}>
      <div className="marquee-content">
        {duplicated.map((tech, idx) => (
          <div
            key={`${tech.name}-${idx}`}
            className="marquee-tech-pill"
            style={{ "--pill-accent": tech.color } as any}
          >
            <span
              className="pill-dot"
              style={{ backgroundColor: tech.color }}
            />
            <strong className="pill-name">{tech.name}</strong>
            <span className="pill-tag">{tech.tag}</span>
            <span className="pill-cat">{tech.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <div
      className="tech-marquee-wrapper"
      aria-label="Technologies and Tech Stack"
    >
      <div className="marquee-lanes">
        <MarqueeTrack items={LANE_1} reverse={false} />
        <MarqueeTrack items={LANE_2} reverse={true} />
      </div>
    </div>
  );
}
