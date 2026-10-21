"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import Magnetic from "./Magnetic";
import ScrambleText from "./ScrambleText";

interface TechPill {
  name: string;
  level: "Advanced" | "Production" | "Core";
  highlight: string;
}

interface TechDomain {
  id: string;
  title: string;
  badge: string;
  icon: string;
  summary: string;
  stack: TechPill[];
  metric: string;
  metricLabel: string;
}

const TECH_DOMAINS: TechDomain[] = [
  {
    id: "ai",
    title: "AI & Applied Intelligence",
    badge: "LLMS · AGENTS · REASONING",
    icon: "🤖",
    summary:
      "Building resilient agentic workflows, multi-document RAG pipelines, and grounded evaluation frameworks where humans stay in the loop.",
    metric: "100%",
    metricLabel: "Audit trail on agent reasoning",
    stack: [
      {
        name: "Python",
        level: "Production",
        highlight: "Async pipelines & model orchestration",
      },
      {
        name: "LangGraph",
        level: "Production",
        highlight: "Cyclic multi-agent state machines",
      },
      {
        name: "Azure OpenAI",
        level: "Production",
        highlight: "Enterprise GPT-4o & embeddings",
      },
      {
        name: "FastAPI",
        level: "Production",
        highlight: "Sub-50ms inference gateways",
      },
      {
        name: "Anthropic SDK",
        level: "Production",
        highlight: "Claude 3.5 Sonnet extraction",
      },
      {
        name: "RAG & Vector Search",
        level: "Advanced",
        highlight: "Document grounding & chunking",
      },
    ],
  },
  {
    id: "backend",
    title: "Backend & Distributed Queues",
    badge: "CONCURRENCY · CACHING · DATABASES",
    icon: "⚡",
    summary:
      "Architecting reliable queue workers, fault-tolerant database schemas, and high-concurrency order systems handling national peak volumes.",
    metric: "100K+",
    metricLabel: "Daily transactions supported",
    stack: [
      {
        name: "Node.js",
        level: "Production",
        highlight: "High-throughput asynchronous servers",
      },
      {
        name: "BullMQ",
        level: "Production",
        highlight: "Redis-backed task queue orchestration",
      },
      {
        name: "Redis",
        level: "Production",
        highlight: "Distributed locks & micro-caching",
      },
      {
        name: "PostgreSQL",
        level: "Production",
        highlight: "Relational data & Prisma schemas",
      },
      {
        name: "MongoDB",
        level: "Production",
        highlight: "High-write transaction ledgers",
      },
      {
        name: "WebSockets / Socket.IO",
        level: "Production",
        highlight: "Real-time bi-directional messaging",
      },
    ],
  },
  {
    id: "frontend",
    title: "Frontend & Mobile Engineering",
    badge: "INTERACTIVE UI · NEXT.JS · REACT NATIVE",
    icon: "✨",
    summary:
      "Crafting tactile, responsive, and visually stunning digital products across web and native mobile with buttery 60/120fps animations.",
    metric: "<1.2s",
    metricLabel: "First Contentful Paint on production apps",
    stack: [
      {
        name: "TypeScript",
        level: "Production",
        highlight: "Type-safe architectures across the stack",
      },
      {
        name: "Next.js 15",
        level: "Production",
        highlight: "App Router, Server Components & SEO",
      },
      {
        name: "React Native",
        level: "Production",
        highlight: "Cross-platform iOS & Android mobile apps",
      },
      {
        name: "React 19",
        level: "Production",
        highlight: "Modern hooks, concurrent UI & state",
      },
      {
        name: "Tailwind CSS",
        level: "Production",
        highlight: "Modular design tokens & responsive UI",
      },
      {
        name: "Framer Motion",
        level: "Production",
        highlight: "Physics-based gestures & layout springs",
      },
      {
        name: "Three.js / R3F",
        level: "Advanced",
        highlight: "Interactive WebGL visualizers & shaders",
      },
    ],
  },
  {
    id: "cloud",
    title: "Cloud, Infrastructure & DevOps",
    badge: "CONTAINERS · CI/CD · OBSERVABILITY",
    icon: "☁️",
    summary:
      "Packaging applications into resilient Docker containers, automating delivery pipelines, and maintaining cost-effective cloud deployments.",
    metric: "75%",
    metricLabel: "Infrastructure cost reduction achieved",
    stack: [
      {
        name: "AWS",
        level: "Production",
        highlight: "S3, EC2, RDS, Lambda & IAM roles",
      },
      {
        name: "Microsoft Azure",
        level: "Production",
        highlight: "Azure App Services & Key Vault",
      },
      {
        name: "Docker",
        level: "Production",
        highlight: "Multi-stage production container builds",
      },
      {
        name: "GitHub Actions",
        level: "Production",
        highlight: "Automated linting, tests & deployment",
      },
      {
        name: "Linux & Nginx",
        level: "Production",
        highlight: "Reverse proxy, SSL & server hardening",
      },
    ],
  },
];

export default function TechStackSection() {
  const [activeTab, setActiveTab] = useState("ai");
  const activeDomain =
    TECH_DOMAINS.find((d) => d.id === activeTab) || TECH_DOMAINS[0];

  return (
    <section className="tech-stack-section" id="skills">
      <div className="wrap">
        <ScrollReveal preset="fade-left" duration={0.9} parallax={18}>
          <div className="section-header-banner light">
            <div className="section-header-top">
              <Magnetic strength={0.25}>
                <div className="section-index-badge">
                  <span className="badge-num">STACK</span>
                  <span className="badge-sep">/</span>
                  <ScrambleText
                    text="CORE CAPABILITIES & TOOLS"
                    className="badge-cat"
                  />
                </div>
              </Magnetic>
              <div className="section-header-rule" />
              <span className="section-count-tag">
                4 DOMAINS · 24+ TECHNOLOGIES
              </span>
            </div>
            <div className="section-header-content">
              <h2>Technologies I work with.</h2>
              <p>
                From low-level queue workers and distributed databases to
                multi-agent AI systems, modern web applications, and native
                mobile apps.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Interactive Domain Tabs with Magnetic pull */}
        <div className="domain-tabs-row">
          {TECH_DOMAINS.map((domain) => {
            const isSelected = domain.id === activeTab;
            return (
              <Magnetic key={domain.id} strength={0.25}>
                <button
                  className={`domain-tab-btn ${isSelected ? "active" : ""}`}
                  onClick={() => setActiveTab(domain.id)}
                  aria-pressed={isSelected}
                >
                  <span className="tab-icon">{domain.icon}</span>
                  <span className="tab-title">{domain.title}</span>
                  {isSelected && (
                    <motion.span
                      layoutId="tab-underline"
                      className="tab-underline"
                    />
                  )}
                </button>
              </Magnetic>
            );
          })}
        </div>

        {/* Active Domain Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDomain.id}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="domain-display-card"
          >
            <div className="domain-card-header">
              <div>
                <span className="domain-card-badge">{activeDomain.badge}</span>
                <h3>{activeDomain.title}</h3>
                <p>{activeDomain.summary}</p>
              </div>
              <div className="domain-metric-badge">
                <strong>{activeDomain.metric}</strong>
                <span>{activeDomain.metricLabel}</span>
              </div>
            </div>

            <div className="domain-stack-grid">
              {activeDomain.stack.map((item, index) => (
                <motion.div
                  key={item.name}
                  className="domain-stack-item"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <div className="stack-item-top">
                    <strong className="stack-item-name">{item.name}</strong>
                    <span className="stack-item-level">{item.level}</span>
                  </div>
                  <p className="stack-item-highlight">{item.highlight}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
