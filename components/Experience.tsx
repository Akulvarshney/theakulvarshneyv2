"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

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
import {
  motion,
  MotionConfig,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import dynamic from "next/dynamic";
import ScrollReveal, {
  RevealItem,
  ScrollParallax,
  ScrollParallaxImage,
  InteractiveCard3D,
} from "./ScrollReveal";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });
const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });
import Magnetic from "./Magnetic";
import ScrambleText from "./ScrambleText";
import TechMarquee from "./TechMarquee";
import TechStackSection from "./TechStackSection";

const EMAIL = "akulv.work@gmail.com";
function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={down ? "arrow down" : "arrow"}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function Meta({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`meta ${className}`}>{children}</p>;
}

function SectionHeader({
  number,
  category,
  title,
  subtitle,
  count,
  theme = "light",
}: {
  number: string;
  category: string;
  title: string;
  subtitle: string;
  count?: string;
  theme?: "light" | "dark";
}) {
  return (
    <div className={`section-header-banner ${theme}`}>
      <div className="section-header-top">
        <Magnetic strength={0.25}>
          <div className="section-index-badge">
            <span className="badge-num">{number}</span>
            <span className="badge-sep">/</span>
            <ScrambleText text={category} className="badge-cat" />
          </div>
        </Magnetic>
        <div className="section-header-rule" />
        {count && <span className="section-count-tag">{count}</span>}
      </div>
      <div className="section-header-content">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  const { scrollY } = useScroll();

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;

    // Keep visible and clean when near the top of page
    if (latest <= 60) {
      setVisible(true);
      setScrolled(false);
      return;
    }

    setScrolled(true);

    // Prevent bounce at bottom of page
    if (typeof window !== "undefined") {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (latest >= maxScroll - 30) {
        return;
      }
    }

    if (diff > 8) {
      // User is scrolling down -> smoothly animate out
      setVisible(false);
    } else if (diff < -5) {
      // User is scrolling up -> smoothly pop back in
      setVisible(true);
    }
  });

  const isVisible = visible || open;

  return (
    <>
      <motion.header
        className={`site-header-fixed ${scrolled ? "scrolled" : ""}`}
        initial={false}
        animate={isVisible ? "visible" : "hidden"}
        variants={{
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              y: {
                type: "spring",
                stiffness: 260,
                damping: 26,
                mass: 0.8,
              },
              opacity: {
                duration: 0.28,
                ease: "easeOut",
              },
            },
          },
          hidden: {
            y: "-100%",
            opacity: 0,
            transition: {
              y: {
                duration: 0.32,
                ease: [0.32, 0, 0.67, 0],
              },
              opacity: {
                duration: 0.22,
                ease: "easeInOut",
              },
            },
          },
        }}
      >
        <div className="site-header wrap">
          <Magnetic strength={0.35}>
            <a href="#top" className="identity" aria-label="Akul Varshney home">
              AV<span>/</span>
            </a>
          </Magnetic>
          <p>
            Software engineer
            <br />
            <span>Gurgaon, India</span>
          </p>
          <button
            className="menu-toggle"
            ref={trigger}
            aria-controls="main-nav"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? "Close −" : "Menu +"}
          </button>
          <nav
            className={open ? "navigation open" : "navigation"}
            id="main-nav"
            aria-label="Main navigation"
          >
            {[
              ["Selected work", "work"],
              ["Tech stack", "skills"],
              ["About", "about"],
              ["Get in touch", "contact"],
            ].map(([name, id]) => (
              <Magnetic key={id} strength={0.3}>
                <a
                  href={"#" + id}
                  onClick={() => {
                    setOpen(false);
                    setVisible(true);
                  }}
                >
                  {name}
                  {id === "contact" && <Arrow />}
                </a>
              </Magnetic>
            ))}
          </nav>
        </div>
      </motion.header>
      <div className="site-header-spacer" aria-hidden="true" />
    </>
  );
}
function Hero() {
  const target = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end start"],
  });
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const yPortrait = useTransform(scrollYProgress, [0, 1], [0, 65]);
  const yIntro = useTransform(scrollYProgress, [0, 1], [0, 35]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  return (
    <section
      className="hero wrap"
      id="top"
      ref={target}
      style={{ position: "relative" }}
    >
      <ParticleField
        variant="dual"
        color="#b93717"
        className="hero-particles"
      />
      <motion.div
        className="hero-main"
        style={{ position: "relative", zIndex: 1, opacity: heroOpacity }}
      >
        <motion.h1
          style={{ y: yTitle }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          AKUL
          <br />
          VARSHNEY<span className="name-period">.</span>
        </motion.h1>
        <motion.figure
          className="hero-portrait"
          style={{ y: yPortrait }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/akul-varshney.webp"
            alt="Illustrated portrait of Akul Varshney at his desk"
            width="800"
            height="1200"
            fetchPriority="high"
          />
          {/* Floating Pop-Out Chips Breaking Outside the Portrait */}
          <motion.div
            className="floating-chip chip-hero-1"
            animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="chip-icon">⚡</span>
            <span>100K+ Req / Day · Live Queues</span>
          </motion.div>
          <motion.div
            className="floating-chip chip-hero-2"
            animate={{ y: [0, 10, 0], rotate: [2, -2, 2] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
          >
            <span className="chip-icon">🤖</span>
            <span>LangGraph Multi-Agents</span>
          </motion.div>
          <motion.div
            className="floating-chip chip-hero-3"
            animate={{ y: [0, -8, 0], rotate: [-1, 2, -1] }}
            transition={{
              duration: 4.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
          >
            <span className="chip-icon">📱</span>
            <span>React Native & WebSockets</span>
          </motion.div>
        </motion.figure>
        <motion.div style={{ y: yIntro }}>
          <ScrollReveal
            preset="fade-up"
            delay={0.4}
            className="hero-intro"
            parallax={15}
          >
            <Meta>
              <ScrambleText text="SOFTWARE / AI / SYSTEMS" />
            </Meta>
            <p>
              I build the software
              <br />
              behind the operation.
            </p>
            <div className="hero-context">
              Rail catering. Insurance claims.
              <br />
              Fleet management. Clinic operations.
              <br />
              <span>Different problems. End-to-end ownership.</span>
            </div>
            <Magnetic strength={0.3}>
              <a href="#work" className="work-link">
                Explore selected work <Arrow down />
              </a>
            </Magnetic>
          </ScrollReveal>
        </motion.div>
      </motion.div>
      <ScrollReveal preset="fade-up" delay={0.6} parallax={10}>
        <div className="hero-bottom">
          <Meta>SELECTED WORK, 2023—2026</Meta>
          <p>
            <span className="status-dot" /> Currently building AI systems at EXL
          </p>
          <Magnetic strength={0.3}>
            <a href="/Akul-Varshney-Resume.pdf" download>
              Résumé <Arrow />
            </a>
          </Magnetic>
        </div>
      </ScrollReveal>
    </section>
  );
}
const stages = ["Request", "Queue", "Worker", "Database"];
const normalLogs = [
  "POST /orders → accepted",
  "BullMQ → job added to queue",
  "Worker → fulfilment processed",
  "MongoDB → record persisted",
];
const peakLogs = [
  "POST /orders → accepted",
  "BullMQ → waiting for worker capacity",
  "Worker → queued job processed",
  "MongoDB → record persisted",
];
function OrderLab() {
  const [step, setStep] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [peak, setPeak] = useState(false);
  const reduced = useReducedMotion();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  function run() {
    timers.current.forEach(clearTimeout);
    if (reduced) {
      setStep(3);
      setBusy(false);
      return;
    }
    setBusy(true);
    setStep(0);
    [1, 2, 3].forEach((i) =>
      timers.current.push(
        setTimeout(
          () => {
            setStep(i);
            if (i === 3) setBusy(false);
          },
          i * (peak ? 1100 : 700),
        ),
      ),
    );
  }
  return (
    <div className="order-lab">
      <div className="lab-toolbar">
        <span>
          <i /> RISE / REQUEST LIFECYCLE
        </span>
        <span>INTERACTIVE MODEL · SAMPLE DATA</span>
      </div>
      <div className="lab-body">
        <div className="lab-system">
          <div className="lab-system-head">
            <Meta>ONE ORDER, END TO END</Meta>
            <button
              className="load-toggle"
              aria-pressed={peak}
              disabled={busy}
              onClick={() => {
                setPeak(!peak);
                setStep(-1);
              }}
            >
              <span className={peak ? "switch on" : "switch"} />
              {peak ? "Peak load" : "Normal load"}
            </button>
          </div>
          <div className="system-track" aria-label="Order processing stages">
            {stages.map((stage, i) => (
              <div
                key={stage}
                className={`system-stage ${step === i ? "current" : ""} ${step > i ? "complete" : ""}`}
              >
                <div className="stage-port">
                  {step > i ? "✓" : String(i + 1).padStart(2, "0")}
                </div>
                <strong>{stage}</strong>
                <span>
                  {
                    [
                      "Node.js API",
                      "Redis / BullMQ",
                      "Async processing",
                      "MongoDB",
                    ][i]
                  }
                </span>
                {i < 3 && (
                  <div
                    className={`stage-connection ${step > i ? "traced" : ""}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="run-controls">
            <button className="run-button" onClick={run} disabled={busy}>
              {busy
                ? "Processing order…"
                : step === 3
                  ? "Run again"
                  : "Run an order"}
              <span aria-hidden="true">↗</span>
            </button>
            <p>
              {peak
                ? "The queue absorbs demand while a worker becomes available."
                : "Follow an order from API request to a persistent record."}
            </p>
          </div>
        </div>
        <div className="event-log" aria-live="polite" aria-atomic="true">
          <div className="log-title">
            <Meta>EVENT LOG</Meta>
            <span>{step === 3 ? "COMPLETE" : busy ? "RUNNING" : "READY"}</span>
          </div>
          <div className="log-entries">
            {step === -1 ? (
              <p className="log-empty">
                Waiting for an order
                <span className="terminal-caret" aria-hidden="true">
                  _
                </span>
              </p>
            ) : (
              (peak ? peakLogs : normalLogs)
                .slice(0, step + 1)
                .map((log, i) => (
                  <p key={log}>
                    <span>0{i + 1}</span>
                    <code>{log}</code>
                  </p>
                ))
            )}
          </div>
          <p className="log-foot">
            {step === 3
              ? "01 order persisted. Workflow complete."
              : "No live systems are connected."}
          </p>
        </div>
      </div>
      <div className="lab-bottom">
        <span>ASYNCHRONOUS BY DESIGN</span>
        <span>REQUEST → PROCESS → PERSIST</span>
      </div>
    </div>
  );
}
function Rail() {
  return (
    <article className="rail-project wrap" id="rise">
      <div className="project-topline">
        <div className="project-employer">
          <CompanyLogo company="orane" compact />
          <Meta>01 / ENTERPRISE SYSTEMS</Meta>
        </div>
        <Meta>ORANE CONSULTING · RK GROUP / IRCTC VENDOR</Meta>
      </div>
      <div className="rail-heading">
        <h2>IRCTC RISE</h2>
        <div>
          <p>
            National food supply. <br />
            Built to keep moving.
          </p>
          <span>Architecture led within a 4–6 person team.</span>
        </div>
      </div>
      <OrderLab />
      <div className="rail-details">
        <p>
          A shared platform for catering operations across 300+ trains. I
          connected business systems, background processing, and reliable
          transaction records.
        </p>
        <div className="rail-outcomes">
          <div>
            <strong>100K+</strong>
            <span>daily transactions</span>
          </div>
          <div>
            <strong>40%</strong>
            <span>faster service responses</span>
          </div>
        </div>
      </div>
      <details className="engineering-notes">
        <summary>
          Engineering notes<span>+</span>
        </summary>
        <p>
          Node.js services connect business workflows. Redis and BullMQ support
          background processing, while MongoDB holds operational records. The
          supplied project results include zero data loss across 100K+ daily
          transactions. The model above illustrates those relationships; it does
          not reproduce private implementation details.
        </p>
      </details>
    </article>
  );
}
function Claims() {
  const [document, setDocument] = useState<"invoice" | "summary">("invoice");
  const [review, setReview] = useState(false);
  return (
    <article className="claims-project" id="claims">
      <div className="wrap claims-layout">
        <div className="claims-description">
          <div className="project-employer">
            <CompanyLogo company="exl" compact />
            <Meta>02 / APPLIED AI · EXL</Meta>
          </div>
          <h2>
            Documents in.
            <br />
            Decisions <br />
            with context.
          </h2>
          <p>
            I build services that turn insurance documents into structured
            information, flag inconsistencies, and keep a human reviewer in
            control.
          </p>
          <p className="project-stack">
            Python / FastAPI
            <br />
            LangGraph / Azure OpenAI
          </p>
          <div className="claims-instruction">
            <span>↗</span>
            <p>
              Switch between the documents.
              <br />
              The discharge dates don’t match.
            </p>
          </div>
        </div>
        <div className="review-workspace">
          <div className="workspace-header">
            <strong>Claims review</strong>
            <span>DEMO / CLM–0248</span>
          </div>
          <div
            className="document-tabs"
            role="group"
            aria-label="Select claim document"
          >
            <button
              aria-pressed={document === "invoice"}
              onClick={() => setDocument("invoice")}
            >
              <span>▤</span> Hospital invoice
            </button>
            <button
              aria-pressed={document === "summary"}
              onClick={() => setDocument("summary")}
            >
              <span>▤</span> Discharge summary
            </button>
          </div>
          <div className="evidence-sheet">
            <div className="sheet-header">
              <Meta>ILLUSTRATIVE DOCUMENT</Meta>
              <span>0{document === "invoice" ? 1 : 2}/02</span>
            </div>
            <h3>
              {document === "invoice"
                ? "Hospital invoice"
                : "Discharge summary"}
            </h3>
            <dl>
              <div>
                <dt>Claim reference</dt>
                <dd>CLM–2026–0248</dd>
              </div>
              <div>
                <dt>Admission date</dt>
                <dd>09 August 2026</dd>
              </div>
              <div className="evidence-flag">
                <dt>Discharge date</dt>
                <dd>
                  {document === "invoice" ? "12" : "14"} August 2026{" "}
                  <span>!</span>
                </dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>
                  {document === "invoice"
                    ? "Invoice, page 1"
                    : "Summary, page 2"}
                </dd>
              </div>
            </dl>
            <div className="source-lines" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="review-finding" aria-live="polite">
            <span className="finding-icon">{review ? "✓" : "!"}</span>
            <div>
              <strong>
                {review
                  ? "Added to review queue"
                  : "Conflicting discharge dates"}
              </strong>
              <p>
                {review
                  ? "Both documents and their source references are attached."
                  : "Invoice: 12 Aug · Discharge summary: 14 Aug"}
              </p>
            </div>
          </div>
          <button className="review-action" onClick={() => setReview(!review)}>
            {review ? "Reset demonstration" : "Send to human review"}
            <Arrow />
          </button>
          <p className="workspace-note">
            LOCAL DEMONSTRATION · NO CLAIMS ARE SUBMITTED
          </p>
        </div>
      </div>
    </article>
  );
}
function Fleet() {
  const [after, setAfter] = useState(true);
  return (
    <article className="fleet-project wrap" id="fleet">
      <div className="project-topline">
        <div className="project-employer">
          <CompanyLogo company="orane" compact />
          <Meta>03 / SYSTEM PERFORMANCE</Meta>
        </div>
        <Meta>ORANE · ETHIOPIAN ELECTRIC POWER</Meta>
      </div>
      <div className="fleet-grid">
        <div>
          <h2>
            500 vehicles.
            <br />
            One less
            <br />
            bottleneck.
          </h2>
          <p className="fleet-description">
            Booking, approvals, dispatch, fuel, and live tracking in one
            platform. I delivered the system, then rebuilt its infrastructure to
            cut response time and operating cost.
          </p>
          <Meta>REACT / NODE.JS / DOCKER</Meta>
        </div>
        <div className="performance-lab">
          <div className="performance-top">
            <Meta>SERVICE RESPONSE TIME</Meta>
            <div role="group" aria-label="Compare fleet performance">
              <button aria-pressed={!after} onClick={() => setAfter(false)}>
                Before
              </button>
              <button aria-pressed={after} onClick={() => setAfter(true)}>
                After
              </button>
            </div>
          </div>
          <div className="performance-number" aria-live="polite">
            {after ? "0.5" : "2.0"}
            <span>seconds</span>
          </div>
          <div
            className="performance-chart"
            aria-label={
              after ? "Response time: 0.5 seconds" : "Response time: 2 seconds"
            }
          >
            <div
              className={
                after ? "performance-bar optimized" : "performance-bar"
              }
            >
              <span>{after ? "AFTER REBUILD" : "ORIGINAL SYSTEM"}</span>
            </div>
            <div className="chart-axis">
              <span>0</span>
              <span>0.5</span>
              <span>1.0</span>
              <span>1.5</span>
              <span>2.0s</span>
            </div>
          </div>
          <div className="performance-results">
            <p>
              <strong>75%</strong> faster responses
            </p>
            <p>
              <strong>~75%</strong> lower infrastructure costs
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
function WebWork() {
  return (
    <section
      className="web-work"
      id="client-work"
      style={{ position: "relative" }}
    >
      <ParticleField
        variant="particles"
        color="#b93717"
        className="web-particles"
      />
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <ScrollReveal preset="fade-left" duration={0.9} parallax={18}>
          <SectionHeader
            number="01"
            category="FREELANCE & COMMERCIAL CLIENTS"
            count="3 PRODUCTION PLATFORMS"
            title="Freelance work."
            subtitle="Out in the world. High-touch client systems, custom healthcare ERPs, and public web experiences shipped directly to production."
          />
        </ScrollReveal>

        <div className="web-projects">
          {/* 01. Clinic ERP — Featured Showcase spanning full width */}
          <ScrollReveal
            as="article"
            className="web-project clinic-site"
            preset="fade-up"
            duration={0.85}
          >
            <div className="browser-window">
              <div className="floating-card-pill pill-top-right">
                <span className="pill-pulse" />
                <span>✓ 0-Conflict Scheduling · Live ERP</span>
              </div>
              <div className="browser-bar">
                <div className="browser-dots">
                  <span className="dot dot-close" />
                  <span className="dot dot-min" />
                  <span className="dot dot-max" />
                </div>
                <div className="browser-address">
                  <span>🔒 https://theglorywellnic.web.app/</span>
                </div>
                <div className="browser-badge">
                  <span className="live-pulse-dot" />
                  <span>PRODUCTION</span>
                </div>
              </div>
              <a
                className="browser-content"
                href="https://theglorywellnic.web.app/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit TheGloryWellNic, opens in a new tab"
              >
                <img
                  src="/work/clinic.webp"
                  alt="Captured GloryWellNic website, showing the clinic management platform"
                  width="1440"
                  height="960"
                  loading="lazy"
                />
                <span className="browser-overlay">
                  Explore live platform <Arrow />
                </span>
              </a>
            </div>

            <div className="web-project-copy">
              <Meta>01 / FEATURED · HEALTHCARE SAAS</Meta>
              <div className="web-project-title">
                <h3>Clinic ERP</h3>
                <span className="badge-tag">CLIENT PLATFORM</span>
              </div>
              <p>
                A unified clinical management workspace replacing fragmented
                spreadsheets and manual paper trails. Powers appointment
                workflows, automated billing, patient records, and staff
                management for Elaria Esthetique.
              </p>
              <ul className="project-highlights">
                <li>
                  <span className="check-icon">✓</span> Multi-doctor scheduling
                  with zero conflict overlaps
                </li>
                <li>
                  <span className="check-icon">✓</span> Automated patient
                  billing, GST receipts & daily totals
                </li>
                <li>
                  <span className="check-icon">✓</span> Role-based access
                  control (Doctor, Reception, Admin)
                </li>
              </ul>
              <div className="tech-tags">
                <span>REACT</span>
                <span>NODE.JS</span>
                <span>PRISMA</span>
                <span>POSTGRESQL</span>
              </div>
              <Magnetic strength={0.35}>
                <a
                  className="project-site-link"
                  href="https://theglorywellnic.web.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore the platform <Arrow />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Magnetic>
            </div>
          </ScrollReveal>

          {/* 02. Elaria Esthetique — Left Column */}
          <ScrollReveal
            as="article"
            className="web-project elaria-site"
            preset="fade-up"
            duration={0.8}
            delay={0.1}
          >
            <div className="browser-window">
              <div className="floating-card-pill pill-bottom-right">
                <span>✦ Luxury Aesthetic Care</span>
              </div>
              <div className="browser-bar">
                <div className="browser-dots">
                  <span className="dot dot-close" />
                  <span className="dot dot-min" />
                  <span className="dot dot-max" />
                </div>
                <div className="browser-address">
                  <span>🔒 https://www.elariaesthetique.in</span>
                </div>
                <div className="browser-badge">
                  <span className="live-pulse-dot" />
                  <span>ONLINE</span>
                </div>
              </div>
              <a
                className="browser-content"
                href="https://www.elariaesthetique.in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Elaria Esthetique, opens in a new tab"
              >
                <img
                  src="/work/elaria.webp"
                  alt="Captured Elaria Esthetique website"
                  width="1440"
                  height="1000"
                  loading="lazy"
                />
                <span className="browser-overlay">
                  Explore live site <Arrow />
                </span>
              </a>
            </div>

            <div className="web-project-copy">
              <Meta>02 / WELLNESS & AESTHETIC CARE</Meta>
              <div className="web-project-title">
                <h3>Elaria Esthetique</h3>
                <span className="badge-tag">PUBLIC HOME</span>
              </div>
              <p>
                The digital public home for an aesthetic care clinic in Gurgaon.
                Crafted with an editorial luxury aesthetic, responsive
                treatments gallery, and direct appointment inquiry channels.
              </p>
              <ul className="project-highlights">
                <li>
                  <span className="check-icon">✓</span> Custom luxury aesthetic
                  & typography
                </li>
                <li>
                  <span className="check-icon">✓</span> Mobile-optimized
                  treatments catalog & inquiries
                </li>
              </ul>
              <div className="tech-tags">
                <span>NEXT.JS</span>
                <span>TAILWIND</span>
                <span>FRAMER MOTION</span>
                <span>SEO</span>
              </div>
              <Magnetic strength={0.35}>
                <a
                  className="project-site-link"
                  href="https://www.elariaesthetique.in"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit live website <Arrow />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Magnetic>
            </div>
          </ScrollReveal>

          {/* 03. Lumivolt Tech Solar — Right Column */}
          <ScrollReveal
            as="article"
            className="web-project solar-site"
            preset="fade-up"
            duration={0.8}
            delay={0.2}
          >
            <div className="browser-window">
              <div className="floating-card-pill pill-top-left">
                <span>⚡ Industrial PV Spec Sheets</span>
              </div>
              <div className="browser-bar">
                <div className="browser-dots">
                  <span className="dot dot-close" />
                  <span className="dot dot-min" />
                  <span className="dot dot-max" />
                </div>
                <div className="browser-address">
                  <span>🔒 https://www.lumivolt.co.in</span>
                </div>
                <div className="browser-badge">
                  <span className="live-pulse-dot" />
                  <span>ONLINE</span>
                </div>
              </div>
              <a
                className="browser-content"
                href="https://www.lumivolt.co.in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Lumivolt Tech Solar, opens in a new tab"
              >
                <img
                  src="/work/lumivolt.webp"
                  alt="Captured Lumivolt solar manufacturing website"
                  width="1440"
                  height="960"
                  loading="lazy"
                />
                <span className="browser-overlay">
                  Explore live site <Arrow />
                </span>
              </a>
            </div>

            <div className="web-project-copy">
              <Meta>03 / SOLAR MANUFACTURING</Meta>
              <div className="web-project-title">
                <h3>Lumivolt Tech Solar</h3>
                <span className="badge-tag">CLEANTECH B2B</span>
              </div>
              <p>
                Comprehensive digital presence for an advanced photovoltaic
                module manufacturing facility in Ghaziabad. Highlights
                manufacturing lines, module technical sheets, and industrial
                procurement.
              </p>
              <ul className="project-highlights">
                <li>
                  <span className="check-icon">✓</span> Industrial product
                  specification sheets
                </li>
                <li>
                  <span className="check-icon">✓</span> High-speed landing page
                  with RFP forms
                </li>
              </ul>
              <div className="tech-tags">
                <span>REACT</span>
                <span>RESPONSIVE UI</span>
                <span>PERFORMANCE</span>
                <span>B2B LEAD GEN</span>
              </div>
              <Magnetic strength={0.35}>
                <a
                  className="project-site-link"
                  href="https://www.lumivolt.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit live website <Arrow />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Magnetic>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
const otherProjects = [
  {
    name: "Sway",
    category: "PERSONAL / MOBILE",
    body: "A social discovery app with verified onboarding, private messaging and calling, a community feed, and in-chat date planning. Built with React Native, Node.js, PostgreSQL, Redis, and Socket.IO.",
  },
  {
    name: "Enterprise vendor platforms",
    category: "ORANE / PROCUREMENT",
    body: "Supplier onboarding, document verification, digital signing, invoice extraction, and quotation assistance for BlackBerry, BIBA, and Avaada. React, Node.js, Anthropic SDK, and AWS connect the workflows.",
  },
  {
    name: "Real-time interview platform",
    category: "PERSONAL / COLLABORATION",
    body: "A shared code editor, whiteboard, chat, and automated code evaluation in a single interview workspace. Built with React, Node.js, Flask, and WebSockets.",
  },
];
function CompanyLogo({
  company,
  compact = false,
}: {
  company: "exl" | "orane" | "amity";
  compact?: boolean;
}) {
  const meta = {
    exl: { alt: "EXL — Go Beyond", width: 334, height: 203 },
    orane: { alt: "Orane Consulting", width: 177, height: 59 },
    amity: { alt: "Amity University", width: 263, height: 73 },
  }[company];

  return (
    <img
      className={`company-logo company-logo-${company}${compact ? " compact" : ""}`}
      src={`/logos/${company}.png`}
      alt={meta.alt}
      width={meta.width}
      height={meta.height}
      loading="lazy"
    />
  );
}
const professionalProjects = [
  {
    id: "rise",
    name: "IRCTC RISE",
    company: "orane" as const,
    discipline: "Enterprise systems",
    client: "RK Group / IRCTC vendor",
    description:
      "The software behind a national catering operation. Connected ordering, background processing, and transaction records across 300+ trains.",
    metric: "100K+",
    outcome: "transactions, every day",
    stack: "Node.js · Redis · BullMQ · MongoDB",
  },
  {
    id: "claims",
    name: "AI claims review",
    company: "exl" as const,
    discipline: "Applied AI",
    client: "Insurance operations",
    description:
      "Turning complex insurance documents into structured information. Surfacing inconsistencies and giving human reviewers the context to make decisions.",
    metric: "Human",
    outcome: "at the centre of every decision",
    stack: "Python · FastAPI · LangGraph · Azure OpenAI",
  },
  {
    id: "fleet",
    name: "Fleet operations",
    company: "orane" as const,
    discipline: "Product & infrastructure",
    client: "Ethiopian Electric Power",
    description:
      "One platform for booking, dispatch, fuel, and live tracking across 500 vehicles. Rebuilt the infrastructure to reduce latency and operating costs.",
    metric: "75%",
    outcome: "faster service responses",
    stack: "React · Node.js · Docker",
  },
  {
    id: "vendors",
    name: "Vendor platforms",
    company: "orane" as const,
    discipline: "Procurement",
    client: "BlackBerry / BIBA / Avaada",
    description:
      "From supplier onboarding to invoice extraction. Connected document verification, digital signing, and AI-assisted quotations into a single workflow.",
    metric: "3",
    outcome: "enterprise client engagements",
    stack: "React · Node.js · Anthropic SDK · AWS",
  },
];
function ProfessionalWork() {
  return (
    <section
      className="professional-work"
      id="professional-work"
      aria-labelledby="professional-title"
      style={{ position: "relative" }}
    >
      <ParticleField
        variant="mesh"
        color="#171918"
        className="professional-particles"
      />
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <ScrollReveal preset="blur-in" duration={1} parallax={18}>
          <SectionHeader
            number="02"
            category="SCALE & ENTERPRISE OPERATIONS"
            count="4 PRODUCTION SYSTEMS"
            title="Enterprise systems."
            subtitle="High-throughput systems, AI claims intelligence, and transport platforms delivered with engineering teams at EXL and Orane Consulting."
            theme="dark"
          />
        </ScrollReveal>
        <div className="work-editorial-list">
          {professionalProjects.map((project, index) => (
            <ScrollReveal
              key={project.id}
              preset="slide-rotate"
              delay={index * 0.08}
              duration={0.8}
              parallax={10}
            >
              <article
                className="work-editorial-project"
                id={`work-${project.id}`}
                aria-labelledby={`title-${project.id}`}
              >
                <div className="work-editorial-meta">
                  <span className="work-editorial-number">0{index + 1}</span>
                  <CompanyLogo company={project.company} compact />
                  <Meta>{project.discipline}</Meta>
                </div>
                <div className="work-editorial-copy">
                  <Meta>{project.client}</Meta>
                  <h3 id={`title-${project.id}`}>{project.name}</h3>
                  <p>{project.description}</p>
                  <span className="work-editorial-stack">{project.stack}</span>
                </div>
                <div className="work-editorial-outcome">
                  <strong>{project.metric}</strong>
                  <span>{project.outcome}</span>
                </div>
                {index < 3 && (
                  <details className="work-editorial-details">
                    <summary>
                      <span>
                        Explore the{" "}
                        {index === 0
                          ? "system"
                          : index === 1
                            ? "workflow"
                            : "performance"}
                      </span>
                      <span aria-hidden="true">+</span>
                    </summary>
                    <div className="work-editorial-demo">
                      {index === 0 ? (
                        <Rail />
                      ) : index === 1 ? (
                        <Claims />
                      ) : (
                        <Fleet />
                      )}
                    </div>
                  </details>
                )}
              </article>
            </ScrollReveal>
          ))}
        </div>
        <div className="work-editorial-footnote">
          <span>TEAMWORK, END-TO-END OWNERSHIP.</span>
          <a href="#about">
            The experience behind the work <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
function PersonalProjects() {
  return (
    <section
      className="personal-work"
      id="personal-projects"
      aria-labelledby="personal-title"
      style={{ position: "relative" }}
    >
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <ScrollReveal preset="fade-left" duration={0.9} parallax={18}>
          <SectionHeader
            number="03"
            category="SELF-DIRECTED LABS"
            count="2 INDEPENDENT PROJECTS"
            title="Personal projects."
            subtitle="My own ideas, built independently. Exploring mobile architectures, real-time WebSockets, and collaborative developer tools."
          />
        </ScrollReveal>

        <div className="web-projects">
          {/* 01. Sway — Social Discovery Mobile Architecture */}
          <ScrollReveal
            as="article"
            className="web-project sway-site"
            preset="fade-up"
            duration={0.85}
          >
            <div className="browser-window">
              <div className="floating-card-pill pill-top-right">
                <span className="pill-pulse" />
                <span>💬 Sub-50ms Socket.IO Chat</span>
              </div>
              <div className="floating-card-pill pill-bottom-left">
                <span>☕ Date: Blue Tokai · 4 PM</span>
              </div>
              <div className="browser-bar">
                <div className="browser-dots">
                  <span className="dot dot-close" />
                  <span className="dot dot-min" />
                  <span className="dot dot-max" />
                </div>
                <div className="browser-address">
                  <span>🔒 sway.social / mobile-app</span>
                </div>
                <div className="browser-badge">
                  <span className="live-pulse-dot" />
                  <span>ACTIVE LAB</span>
                </div>
              </div>
              <div className="browser-content">
                <img
                  src="/work/sway.jpg"
                  alt="Sway mobile social discovery app UI showing Aadhaar verification, discovery profile, and in-chat date planning"
                  width="1440"
                  height="960"
                  loading="lazy"
                />
                <span className="browser-overlay">
                  Explore architecture details <Arrow />
                </span>
              </div>
            </div>

            <div className="web-project-copy">
              <Meta>01 / SOCIAL DISCOVERY & MOBILE ARCHITECTURE</Meta>
              <div className="web-project-title">
                <h3>Sway</h3>
                <span className="badge-tag">IOS & ANDROID</span>
              </div>
              <p>
                A high-trust social discovery platform engineered with verified
                identity onboarding, private encrypted messaging and calling,
                community feeds, and interactive in-chat date planning.
              </p>
              <ul className="project-highlights">
                <li>
                  <span className="check-icon">✓</span> Aadhaar KYC verification
                  & fraud-prevention onboarding
                </li>
                <li>
                  <span className="check-icon">✓</span> Sub-50ms real-time chat
                  & WebRTC voice/video streams via Socket.IO
                </li>
                <li>
                  <span className="check-icon">✓</span> Interactive in-chat date
                  planner with mutual calendar confirmation
                </li>
              </ul>
              <div className="tech-tags">
                <span>REACT NATIVE</span>
                <span>NODE.JS</span>
                <span>POSTGRESQL</span>
                <span>REDIS</span>
                <span>SOCKET.IO</span>
              </div>
              <Magnetic strength={0.35}>
                <a
                  className="project-site-link"
                  href="https://github.com/akulvarshney"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View project on GitHub <Arrow />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Magnetic>
            </div>
          </ScrollReveal>

          {/* 02. Real-Time Interview Platform — Collaborative Workspace */}
          <ScrollReveal
            as="article"
            className="web-project interview-site"
            preset="fade-up"
            duration={0.85}
            delay={0.15}
          >
            <div className="browser-window">
              <div className="floating-card-pill pill-top-right">
                <span className="pill-pulse" />
                <span>✓ 8/8 Tests Passing (231ms)</span>
              </div>
              <div className="floating-card-pill pill-bottom-left">
                <span>⚡ Monaco Multi-Cursor Sync</span>
              </div>
              <div className="browser-bar">
                <div className="browser-dots">
                  <span className="dot dot-close" />
                  <span className="dot dot-min" />
                  <span className="dot dot-max" />
                </div>
                <div className="browser-address">
                  <span>🔒 codesync-interview.dev</span>
                </div>
                <div className="browser-badge">
                  <span className="live-pulse-dot" />
                  <span>DESKTOP WEB</span>
                </div>
              </div>
              <div className="browser-content">
                <img
                  src="/work/codesync.jpg"
                  alt="Real-time interview platform showing Monaco code editor, interactive whiteboard system design, and automated test runners"
                  width="1440"
                  height="960"
                  loading="lazy"
                />
                <span className="browser-overlay">
                  Explore workspace architecture <Arrow />
                </span>
              </div>
            </div>

            <div className="web-project-copy">
              <Meta>02 / COLLABORATIVE TOOLING & REAL-TIME WEBSOCKETS</Meta>
              <div className="web-project-title">
                <h3>Real-Time Interview Platform</h3>
                <span className="badge-tag">DEV TOOLING</span>
              </div>
              <p>
                A unified technical interview workspace uniting a shared Monaco
                code editor, interactive digital whiteboard, real-time
                audio/chat, and automated code test execution in a single
                synchronized environment.
              </p>
              <ul className="project-highlights">
                <li>
                  <span className="check-icon">✓</span> Real-time multi-cursor
                  Monaco code editor & interactive whiteboard
                </li>
                <li>
                  <span className="check-icon">✓</span> Sandboxed code execution
                  engine with live automated test assertions
                </li>
                <li>
                  <span className="check-icon">✓</span> WebSockets synchronized
                  state with low-latency audio integration
                </li>
              </ul>
              <div className="tech-tags">
                <span>REACT</span>
                <span>NODE.JS</span>
                <span>FLASK</span>
                <span>WEBSOCKETS</span>
                <span>MONACO</span>
              </div>
              <Magnetic strength={0.35}>
                <a
                  className="project-site-link"
                  href="https://github.com/akulvarshney"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View project on GitHub <Arrow />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Magnetic>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
function About() {
  return (
    <section className="about" id="about">
      <div className="wrap">
        <ScrollReveal preset="fade-left" duration={0.9} parallax={18}>
          <SectionHeader
            number="04"
            category="ENGINEERING ETHOS & CAREER"
            title="I like knowing how the whole thing works."
            subtitle="From interface design to background queues, databases, and deployment."
          />
        </ScrollReveal>
        <ScrollReveal
          preset="fade-up"
          delay={0.2}
          duration={0.85}
          parallax={14}
        >
          <div className="about-body">
            <div className="about-note">
              <p>
                From the interface to the queue
                <br />
                to the database to deployment.
              </p>
              <a href="/Akul-Varshney-Resume.pdf" download>
                Read my résumé <Arrow />
              </a>
            </div>
            <div>
              <p>
                I’m a software engineer based in Gurgaon. At Orane, I took
                business products from requirements through launch, working
                across supply chains, transport, and supplier operations.
              </p>
              <p>
                Now at EXL, I’m building AI-assisted claims workflows. The part
                I care about is what happens after the model responds: the
                checks, the context, and the person who has to trust the result.
              </p>
              <div className="experience-list">
                <div>
                  <strong className="career-employer">
                    <CompanyLogo company="exl" compact />
                    <span className="sr-only">EXL</span>
                  </strong>
                  <span>Consultant 2</span>
                  <time>2026—Present</time>
                </div>
                <div>
                  <strong className="career-employer">
                    <CompanyLogo company="orane" compact />
                    <span className="sr-only">Orane Consulting</span>
                  </strong>
                  <span>Software Engineer</span>
                  <time>2023—2026</time>
                </div>
                <div>
                  <strong className="career-employer">
                    <CompanyLogo company="amity" compact />
                    <span className="sr-only">Amity University</span>
                  </strong>
                  <span>B.Tech, Information Technology</span>
                  <time>2019—2023</time>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
function Contact() {
  const [copy, setCopy] = useState("Copy address");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopy("Copied");
    } catch {
      setCopy("Use email link");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopy("Copy address"), 2500);
  }
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <ScrollReveal preset="scale-up" duration={0.8} parallax={22}>
          <div className="contact-top">
            <Meta>HAVE SOMETHING IN MIND?</Meta>
            <Magnetic strength={0.4}>
              <a href="mailto:akulv.work@gmail.com">
                <h2>LET’S TALK.</h2>
                <Arrow />
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
        <ScrollReveal preset="fade-up" delay={0.2} duration={0.8} parallax={12}>
          <div className="contact-details">
            <Magnetic strength={0.3}>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </Magnetic>
            <Magnetic strength={0.35}>
              <button onClick={copyEmail}>
                <span aria-live="polite">{copy}</span> ↗
              </button>
            </Magnetic>
            <p>
              Engineering roles, product ideas,
              <br />
              and interesting problems.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal preset="fade-up" delay={0.35} parallax={6}>
          <footer>
            <span>© {new Date().getFullYear()} Akul Varshney</span>
            <div>
              <a
                href="https://github.com/akulvarshney"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <Arrow />
                <span className="sr-only">(opens in new tab)</span>
              </a>
              <a
                href="https://linkedin.com/in/akulvarshney"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn <Arrow />
                <span className="sr-only">(opens in new tab)</span>
              </a>
              <a href="#top">Back to top ↑</a>
            </div>
          </footer>
        </ScrollReveal>
      </div>
    </section>
  );
}
function WorkGateway() {
  const chapters = [
    { num: "01", label: "Freelance", count: "3", href: "#client-work" },
    { num: "02", label: "Enterprise", count: "4", href: "#professional-work" },
    { num: "03", label: "Personal", count: "4", href: "#personal-projects" },
    { num: "04", label: "Tech Stack", count: "24+", href: "#skills" },
  ];

  return (
    <section
      className="work-gateway-section"
      id="work"
      aria-label="Selected Work Index"
    >
      <div className="wrap">
        <ScrollReveal preset="fade-up" duration={0.8} parallax={12}>
          <div className="work-gateway-bar">
            {/* Left: Index Meta */}
            <div className="gateway-index-block">
              <span className="gateway-live-dot" />
              <strong className="gateway-index-title">SELECTED WORK</strong>
              <span className="gateway-index-meta">
                11 PLATFORMS · 2023—2026
              </span>
            </div>

            {/* Center: Sleek Segmented Pill Navigation */}
            <nav
              className="gateway-nav-dock"
              aria-label="Work sections quick navigation"
            >
              {chapters.map((ch) => (
                <Magnetic key={ch.num} strength={0.2}>
                  <a href={ch.href} className="gateway-nav-pill">
                    <span className="pill-num">{ch.num}</span>
                    <span className="pill-label">{ch.label}</span>
                    <span className="pill-count">{ch.count}</span>
                  </a>
                </Magnetic>
              ))}
            </nav>

            {/* Right: Scroll Indicator */}
            <Magnetic strength={0.2}>
              <a
                href="#client-work"
                className="gateway-scroll-link"
                aria-label="Scroll to first project"
              >
                <span className="scroll-label">EXPLORE</span>
                <span className="scroll-arrow">↓</span>
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default function Experience() {
  return (
    <MotionConfig reducedMotion="never">
      <CustomCursor />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <TechMarquee />
        <WorkGateway />

        {/* SECTION 01: FREELANCE WORK (Crisp Studio White) */}
        <WebWork />

        {/* SECTION 02: ENTERPRISE WORK (Deep Obsidian Terminal) */}
        <ProfessionalWork />

        {/* SECTION 03: PERSONAL PROJECTS (Crisp Studio White matching Freelance) */}
        <PersonalProjects />

        {/* SECTION 04: TECH STACK & CAPABILITIES EXPLORER */}
        <TechStackSection />

        {/* SECTION 05: ABOUT (Clean Paper Canvas) */}
        <About />

        {/* SECTION 06: CONTACT (Deep Obsidian Finale) */}
        <Contact />
      </main>
    </MotionConfig>
  );
}
