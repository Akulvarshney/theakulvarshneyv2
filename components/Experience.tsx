"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

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
function Header() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
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
  return (
    <header className="site-header wrap">
      <a href="#top" className="identity" aria-label="Akul Varshney home">
        AV<span>/</span>
      </a>
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
          ["About", "about"],
          ["Get in touch", "contact"],
        ].map(([name, id]) => (
          <a key={id} href={"#" + id} onClick={() => setOpen(false)}>
            {name}
            {id === "contact" && <Arrow />}
          </a>
        ))}
      </nav>
    </header>
  );
}
function Hero() {
  const target = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 20]);
  return (
    <section className="hero wrap" id="top" ref={target}>
      <div className="hero-main">
        <motion.h1 style={{ y }}>
          AKUL
          <br />
          VARSHNEY<span className="name-period">.</span>
        </motion.h1>
        <figure className="hero-portrait">
          <img
            src="/akul-varshney.webp"
            alt="Illustrated portrait of Akul Varshney at his desk"
            width="800"
            height="1200"
            fetchPriority="high"
          />
        </figure>
        <div className="hero-intro">
          <Meta>SOFTWARE / AI / SYSTEMS</Meta>
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
          <a href="#work" className="work-link">
            Explore selected work <Arrow down />
          </a>
        </div>
      </div>
      <div className="hero-bottom">
        <Meta>SELECTED WORK, 2023—2026</Meta>
        <p>
          <span className="status-dot" /> Currently building AI systems at EXL
        </p>
        <a href="/Akul-Varshney-Resume.pdf" download>
          Résumé <Arrow />
        </a>
      </div>
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
    <section className="web-work wrap" id="client-work">
      <div className="web-heading">
        <Meta>FREELANCE / DIRECT CLIENT ENGAGEMENTS</Meta>
        <h2>Freelance work.</h2>
        <p>
          Out in the world.
          <br />
          Products and websites built independently for clients.
        </p>
      </div>
      <div className="web-projects">
        <article className="web-project clinic-site">
          <a
            className="site-preview"
            href="https://glorywellnic04.web.app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit GloryWellNic, opens in a new tab"
          >
            <img
              src="/work/clinic.webp"
              alt="Captured GloryWellNic website, showing the clinic management platform"
              width="1440"
              height="960"
              loading="lazy"
            />
            <span className="visit-label">
              Explore live site <Arrow />
            </span>
          </a>
          <div className="web-project-copy">
            <Meta>FEATURED / PRODUCT ENGINEERING</Meta>
            <div className="web-project-title">
              <h3>Clinic ERP</h3>
            </div>
            <p>
              Scheduling, billing, staff access, and reporting. Used for daily
              operations at Elaria Esthetique.
            </p>
            <Meta>REACT / NODE.JS / PRISMA / POSTGRESQL</Meta>
            <a
              className="project-site-link"
              href="https://glorywellnic04.web.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore the platform <Arrow />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </article>
        <article className="web-project elaria-site">
          <a
            className="site-preview"
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
            <span className="visit-label">
              Explore live site <Arrow />
            </span>
          </a>
          <div className="web-project-copy">
            <div className="web-project-title">
              <h3>Elaria Esthetique</h3>
              <span>WEB EXPERIENCE ↗</span>
            </div>
            <p>
              The public home for a wellness and aesthetic care centre in
              Gurgaon.
            </p>
          </div>
        </article>
        <article className="web-project solar-site">
          <a
            className="site-preview"
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
            <span className="visit-label">
              Explore live site <Arrow />
            </span>
          </a>
          <div className="web-project-copy">
            <div className="web-project-title">
              <h3>Lumivolt Tech Solar</h3>
              <span>WEB EXPERIENCE ↗</span>
            </div>
            <p>
              Web presence for a next-generation solar module manufacturer in
              Ghaziabad.
            </p>
          </div>
        </article>
      </div>
      <p className="screen-caption">
        Screens captured from the public websites.
      </p>
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
  company: "exl" | "orane";
  compact?: boolean;
}) {
  return (
    <img
      className={`company-logo company-logo-${company}${compact ? " compact" : ""}`}
      src={`/logos/${company}.png`}
      alt={company === "exl" ? "EXL — Go Beyond" : "Orane Consulting"}
      width={company === "exl" ? 334 : 177}
      height={company === "exl" ? 203 : 59}
      loading="lazy"
    />
  );
}
const professionalProjects = [
  {
    id: "rise", name: "IRCTC RISE", company: "orane" as const,
    discipline: "Enterprise systems", client: "RK Group / IRCTC vendor",
    description: "The software behind a national catering operation. Connected ordering, background processing, and transaction records across 300+ trains.",
    metric: "100K+", outcome: "transactions, every day", stack: "Node.js · Redis · BullMQ · MongoDB",
  },
  {
    id: "claims", name: "AI claims review", company: "exl" as const,
    discipline: "Applied AI", client: "Insurance operations",
    description: "Turning complex insurance documents into structured information. Surfacing inconsistencies and giving human reviewers the context to make decisions.",
    metric: "Human", outcome: "at the centre of every decision", stack: "Python · FastAPI · LangGraph · Azure OpenAI",
  },
  {
    id: "fleet", name: "Fleet operations", company: "orane" as const,
    discipline: "Product & infrastructure", client: "Ethiopian Electric Power",
    description: "One platform for booking, dispatch, fuel, and live tracking across 500 vehicles. Rebuilt the infrastructure to reduce latency and operating costs.",
    metric: "75%", outcome: "faster service responses", stack: "React · Node.js · Docker",
  },
  {
    id: "vendors", name: "Vendor platforms", company: "orane" as const,
    discipline: "Procurement", client: "BlackBerry / BIBA / Avaada",
    description: "From supplier onboarding to invoice extraction. Connected document verification, digital signing, and AI-assisted quotations into a single workflow.",
    metric: "3", outcome: "enterprise client engagements", stack: "React · Node.js · Anthropic SDK · AWS",
  },
];
function ProfessionalWork() {
  return (
    <section className="professional-work" id="professional-work" aria-labelledby="professional-title">
      <div className="wrap">
        <header className="work-editorial-heading">
          <Meta>02 / PROFESSIONAL WORK</Meta>
          <div>
            <h2 id="professional-title">Built for the<br /><span>real world.</span></h2>
            <p>Products that keep operations moving. <br />Selected work with teams at EXL <br />and Orane Consulting.</p>
          </div>
        </header>
        <div className="work-editorial-list">
          {professionalProjects.map((project, index) => (
            <article className="work-editorial-project" key={project.id} id={`work-${project.id}`} aria-labelledby={`title-${project.id}`}>
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
              {index < 3 && <details className="work-editorial-details">
                <summary><span>Explore the {index === 0 ? "system" : index === 1 ? "workflow" : "performance"}</span><span aria-hidden="true">+</span></summary>
                <div className="work-editorial-demo">{index === 0 ? <Rail /> : index === 1 ? <Claims /> : <Fleet />}</div>
              </details>}
            </article>
          ))}
        </div>
        <div className="work-editorial-footnote"><span>TEAMWORK, END-TO-END OWNERSHIP.</span><a href="#about">The experience behind the work <Arrow /></a></div>
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
    >
      <div className="wrap">
        <div className="work-profile-heading">
          <Meta>PERSONAL / SELF-DIRECTED PROJECTS</Meta>
          <h2 id="personal-title">Personal projects.</h2>
          <p>
            My own ideas, built independently. A place to explore mobile
            products, real-time communication, and collaborative tools.
          </p>
        </div>
        <div className="personal-project-list">
          {otherProjects
            .filter((project) => project.category.startsWith("PERSONAL"))
            .map((project, index) => (
              <article key={project.name}>
                <div>
                  <Meta>
                    {index === 0
                      ? "SOCIAL DISCOVERY / MOBILE"
                      : "REAL-TIME COLLABORATION"}
                  </Meta>
                  <h3>{project.name}</h3>
                </div>
                <div>
                  <p>{project.body}</p>
                  <Meta>OWN PROJECT · INDEPENDENTLY BUILT</Meta>
                </div>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
}
function About() {
  return (
    <section className="about wrap" id="about">
      <div className="about-heading">
        <Meta>A BIT ABOUT ME</Meta>
        <h2>
          I like knowing how
          <br />
          the whole thing works.
        </h2>
      </div>
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
            I’m a software engineer based in Gurgaon. At Orane, I took business
            products from requirements through launch, working across supply
            chains, transport, and supplier operations.
          </p>
          <p>
            Now at EXL, I’m building AI-assisted claims workflows. The part I
            care about is what happens after the model responds: the checks, the
            context, and the person who has to trust the result.
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
              <strong>Amity University</strong>
              <span>B.Tech, Information Technology</span>
              <time>2019—2023</time>
            </div>
          </div>
        </div>
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
        <div className="contact-top">
          <Meta>HAVE SOMETHING IN MIND?</Meta>
          <a href="mailto:akulv.work@gmail.com">
            <h2>LET’S TALK.</h2>
            <Arrow />
          </a>
        </div>
        <div className="contact-details">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <button onClick={copyEmail}>
            <span aria-live="polite">{copy}</span> ↗
          </button>
          <p>
            Engineering roles, product ideas,
            <br />
            and interesting problems.
          </p>
        </div>
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
      </div>
    </section>
  );
}
export default function Experience() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <div className="work-divider wrap" id="work">
          <span>Selected work</span>
          <div>
            <a href="#client-work">Freelance</a>
            <a href="#professional-work">Professional</a>
            <a href="#personal-projects">Personal</a>
          </div>
          <Meta>SCROLL TO EXPLORE ↓</Meta>
        </div>
        <WebWork />
        <ProfessionalWork />
        <PersonalProjects />
        <About />
        <Contact />
      </main>
    </MotionConfig>
  );
}
