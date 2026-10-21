"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  HeroDepth,
  ParallaxPanel,
  CareerProgress,
  ScrollTitle,
} from "./Parallax";
import {
  SkillExplorer,
  Credentials,
  ImpactNumber,
  Typewriter,
} from "./Interactive";
import {
  ArrowUpRight,
  ArrowDown,
  Download,
  Code2,
  Layers3,
  Database,
  Workflow,
  Cpu,
  Menu,
  X,
  Check,
  Copy,
  Globe2,
  Smartphone,
} from "lucide-react";

const links = [
  ["About", "about"],
  ["Work", "work"],
  ["How I help", "skills"],
  ["Journey", "experience"],
];
const email = "akulv.work@gmail.com";
function Reveal({ children, className = "", delay = 0 }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`reveal ${className}`}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    document
      .querySelectorAll("section[id]")
      .forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <a href="#top" className="wordmark" aria-label="Akul Varshney home">
          akul<span>.</span>
        </a>
        <nav
          className={open ? "navigation open" : "navigation"}
          aria-label="Main navigation"
          id="main-nav"
        >
          {links.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href={`mailto:${email}`}>
          Let’s talk <ArrowUpRight size={16} />
        </a>
        <button
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
const projects = [
  {
    name: "AI Claims Intelligence",
    category: "AI",
    type: "EXL · INSURANCE OPERATIONS",
    icon: Cpu,
    metric: "Human oversight",
    caption: "AI helps process documents. People review the exceptions.",
    tools: ["FastAPI", "LangGraph", "Azure OpenAI"],
    highlights: [
      "Read claim documents",
      "Flag inconsistent information",
      "Support human review",
    ],
    detail:
      "A claims processing platform that reads documents, organizes key information, and identifies discrepancies for reviewers. I build the services connecting document processing, AI analysis, and the review process.",
    outcome:
      "Gives reviewers structured information and flagged exceptions, with a record of how each result was produced.",
  },
  {
    name: "National Food Supply Chain",
    category: "Systems",
    type: "ORANE · RK GROUP / IRCTC VENDOR",
    icon: Layers3,
    metric: "100K+ daily transactions",
    caption: "Supporting food supply operations across 300+ trains.",
    tools: ["Node.js", "MongoDB", "Redis", "BullMQ"],
    highlights: [
      "Coordinate food supply",
      "Connect business systems",
      "Keep peak operations reliable",
    ],
    detail:
      "A shared platform for coordinating a national food supply chain. I led its architecture within a 4–6-person team, connecting day-to-day transactions with the company’s existing business systems and keeping data reliable during busy periods.",
    outcome:
      "Supported 100K+ daily transactions across 300+ trains with zero data loss, and reduced service response times by 40%.",
  },
  {
    name: "Fleet Management System",
    category: "Systems",
    type: "ORANE · ETHIOPIAN ELECTRIC POWER",
    icon: Globe2,
    metric: "75% faster responses",
    caption: "Transport operations for a fleet of 500+ vehicles.",
    tools: ["React", "Node.js", "Docker"],
    highlights: [
      "Manage bookings & dispatch",
      "Track vehicles in real time",
      "Monitor fuel and approvals",
    ],
    detail:
      "A transport management platform covering vehicle requests, approvals, dispatch, fuel use, and live location tracking. I delivered the complete system and rebuilt its infrastructure to improve speed and operating efficiency.",
    outcome:
      "Cut service response times from 2 seconds to 0.5 seconds and reduced infrastructure costs by approximately 75%.",
  },
  {
    name: "Clinic ERP",
    category: "Freelance",
    type: "FREELANCE · CLINIC OPERATIONS",
    icon: Database,
    metric: "Connected clinic operations",
    caption: "Appointments, staff access, and billing in one place.",
    tools: ["React", "Node.js", "Prisma", "PostgreSQL"],
    highlights: [
      "Avoid booking conflicts",
      "Manage invoices & receipts",
      "See business performance",
    ],
    liveUrl: "https://theglorywellnic.web.app/",
    detail:
      "A clinic management platform bringing appointments, billing, receipts, and reporting into one workspace. Staff access can be configured as the business changes. Used for day-to-day operations at Elaria Esthetique.",
    outcome:
      "Delivered a single workspace for daily clinic operations, with scheduling checks and financial reporting.",
  },
  {
    name: "Enterprise Vendor Platforms",
    category: "AI",
    type: "ORANE · BLACKBERRY, BIBA & AVAADA",
    icon: Workflow,
    metric: "Simpler supplier operations",
    caption: "From supplier onboarding to invoices and quotations.",
    tools: ["React", "Node.js", "Anthropic SDK", "AWS"],
    highlights: [
      "Onboard suppliers",
      "Read invoice information",
      "Assist with quotation requests",
    ],
    detail:
      "Business platforms for managing suppliers, verifying onboarding documents, and handling purchasing workflows. I delivered digital signing, notifications, AI invoice extraction, and an assistant for requests for quotation.",
    outcome:
      "Connected supplier onboarding, document checks, and AI assistance in working enterprise products.",
  },
  {
    name: "Elaria Esthetique",
    category: "Freelance",
    type: "FREELANCE · WELLNESS & AESTHETIC CARE",
    icon: Globe2,
    metric: "A public home for the clinic",
    caption: "A wellness and aesthetic care centre in Gurgaon.",
    tools: ["Responsive design", "Search optimization"],
    highlights: [
      "Present the clinic online",
      "Support mobile visitors",
      "Connect with prospective clients",
    ],
    liveUrl: "https://www.elariaesthetique.in",
    detail:
      "Built the public website for Elaria Esthetique, giving its wellness and aesthetic care business a dedicated online presence. The clinic also uses Clinic ERP for its day-to-day operations.",
    outcome:
      "Delivered the clinic’s public website alongside the software supporting its internal operations.",
  },
  {
    name: "Lumivolt Tech Solar",
    category: "Freelance",
    type: "FREELANCE · SOLAR MANUFACTURING",
    icon: Globe2,
    metric: "A digital business presence",
    caption: "Introducing a solar module manufacturer in Ghaziabad.",
    tools: ["Responsive design", "Search optimization"],
    highlights: [
      "Introduce the business",
      "Present its manufacturing focus",
      "Work across screen sizes",
    ],
    liveUrl: "https://www.lumivolt.co.in",
    detail:
      "Built a website for a next-generation solar module manufacturing facility, presenting the business through a focused, responsive landing page.",
    outcome:
      "Delivered a public-facing site that gives the manufacturer a place to introduce its business online.",
  },
  {
    name: "Sway",
    category: "Personal",
    type: "PERSONAL · SOCIAL DISCOVERY & DATING",
    icon: Smartphone,
    metric: "Trust-first connections",
    caption: "A safer path from verified profiles to real-world dates.",
    tools: [
      "React Native",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Socket.IO",
      "AWS S3",
      "Razorpay",
    ],
    highlights: [
      "Verify identity with Aadhaar KYC",
      "Message and call in real time",
      "Plan dates inside the conversation",
    ],
    detail:
      "A cross-platform social discovery and dating app designed around authenticity, privacy, and real-world connection. I built verified onboarding, a swipe-based discovery experience, multimedia chat and calling, a community feed, and an in-chat dining concierge.",
    outcome:
      "Brings identity verification, private communication, date planning, and VIP subscriptions into one connected mobile experience.",
  },
  {
    name: "Real-Time Interview Platform",
    category: "Personal",
    type: "PERSONAL · COLLABORATIVE HIRING TOOLS",
    icon: Code2,
    metric: "One shared interview space",
    caption: "Code, sketch, and communicate together.",
    tools: ["React", "Node.js", "Flask", "WebSockets"],
    highlights: [
      "Work on code together",
      "Explain ideas on a whiteboard",
      "Automate code evaluation",
    ],
    detail:
      "A personal project that brings a shared code editor, whiteboard, chat, and automated code evaluation into one interview environment.",
    outcome:
      "Combines collaborative interview tools and automated assessment in a single workspace.",
  },
];
function Work() {
  const groups = [
    {
      id: "professional-work",
      kind: "professional",
      title: "Professional work",
      label: "BUILT WITH TEAMS",
      description:
        "Enterprise products delivered through my roles at EXL and Orane Consulting.",
      projects: projects.filter(
        (p) => !["Personal", "Freelance"].includes(p.category),
      ),
    },
    {
      id: "freelance-work",
      kind: "freelance",
      title: "Freelance work",
      label: "BUILT FOR CLIENTS",
      description:
        "Independent client work, bringing product requirements into a working platform.",
      projects: projects.filter((p) => p.category === "Freelance"),
    },
    {
      id: "personal-work",
      kind: "personal",
      title: "Personal projects",
      label: "BUILT FROM CURIOSITY",
      description:
        "Self-directed work exploring trust, collaboration, and real-time experiences.",
      projects: projects.filter((p) => p.category === "Personal"),
    },
  ];
  return (
    <section id="work" className="section container">
      <ScrollTitle label="SELECTED WORK">
        <Reveal>
          <div className="section-heading">
            <div>
              <p className="section-kicker">02 / SELECTED WORK</p>
              <h2>
                Products built.
                <br />
                Problems solved.
              </h2>
            </div>
            <div className="work-jump-links">
              <a href="#professional-work">
                Professional work <ArrowDown size={13} />
              </a>
              <a href="#freelance-work">
                Freelance work <ArrowDown size={13} />
              </a>
              <a href="#personal-work">
                Personal projects <ArrowDown size={13} />
              </a>
            </div>
          </div>
        </Reveal>
      </ScrollTitle>
      {groups.map((group) => (
        <section
          className={`work-collection work-collection-${group.kind} ${group.kind !== "professional" ? "work-collection-independent" : ""}`}
          id={group.id}
          key={group.id}
          aria-labelledby={`${group.id}-title`}
        >
          <Reveal>
            <div className="collection-heading">
              <div>
                <p className="section-kicker">{group.label}</p>
                <h3 id={`${group.id}-title`}>
                  {group.title}
                  <span>{String(group.projects.length).padStart(2, "0")}</span>
                </h3>
                <p className="collection-description">{group.description}</p>
              </div>
              <div className="collection-stamp">
                {group.kind === "professional" ? (
                  <Layers3 size={26} strokeWidth={1.3} />
                ) : (
                  <Code2 size={26} strokeWidth={1.3} />
                )}
                <span>
                  {group.kind === "professional"
                    ? "EXL / ORANE"
                    : group.kind === "freelance"
                      ? "CLIENT ENGAGEMENT"
                      : "SELF-DIRECTED"}
                </span>
              </div>
            </div>
          </Reveal>
          <div className="project-stories">
            {group.projects.map((p, i) => (
              <Reveal key={p.name}>
                <article
                  className={`project-story project-${p.category.toLowerCase()}`}
                >
                  <span className="project-story-number">
                    {group.kind.toUpperCase()} / 0{i + 1}
                  </span>
                  <ParallaxPanel>
                    <div className="project-art-top">
                      <p.icon size={23} strokeWidth={1.4} />
                      <span className="mono">{p.category.toUpperCase()}</span>
                    </div>
                    <p className="delivery-label">WHAT IT DELIVERS</p>
                    <strong>{p.metric}</strong>
                    <p>{p.caption}</p>
                    <ul className="business-highlights">
                      {p.highlights.map((item) => (
                        <li key={item}>
                          <Check size={14} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </ParallaxPanel>
                  <div className="project-body">
                    <div
                      className={`engagement-badge engagement-${group.kind}`}
                    >
                      <span />
                      {group.kind === "professional"
                        ? p.type.startsWith("EXL")
                          ? "At EXL"
                          : "At Orane Consulting"
                        : group.kind === "freelance"
                          ? "Freelance client work"
                          : "Personal project"}
                    </div>
                    <p className="section-kicker">{p.type}</p>
                    <h3 className="business-project-name">{p.name}</h3>
                    <div className="project-detail">
                      <p>{p.detail}</p>
                      <p className="project-outcome">
                        <ArrowUpRight size={16} />
                        <strong>{p.outcome}</strong>
                      </p>
                    </div>
                    {p.liveUrl && (
                      <a
                        className="project-live-link"
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit website <ArrowUpRight size={15} />
                        <span className="typing-accessible">
                          {" "}
                          (opens in a new tab)
                        </span>
                      </a>
                    )}
                    <details className="project-technology">
                      <summary>Technology behind the project</summary>
                      <div className="tags">
                        {p.tools.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                    </details>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
function Experience() {
  const jobs = [
    {
      company: "EXL",
      role: "Consultant 2",
      location: "Gurgaon",
      date: "Jul 2026 — Present",
      current: true,
      intro:
        "Building a claims intelligence platform that helps insurance teams turn complex documents into clear, reviewable information. I connect document processing, AI assistance, and human review so the product supports real operational decisions.",
      areas: [
        {
          title: "Making claim documents useful",
          text: "Build workflows that read claim documents and turn them into organized information. The platform helps reviewers identify unusual values, summarize supporting documents, and check information against policy requirements.",
        },
        {
          title: "Connecting the review process",
          text: "Connect document uploads, processing, and review in one dependable process. Keep records searchable and preserve an audit history so teams can trace where information came from and how it was handled.",
        },
        {
          title: "Keeping people in control",
          text: "Flag conflicting dates, inconsistent information, and unusual costs across documents. Send exceptions to a human reviewer rather than letting questionable information move through unchecked.",
        },
      ],
      tools: [
        "Python",
        "FastAPI",
        "LangGraph",
        "Azure OpenAI",
        "PostgreSQL",
        "ChromaDB",
      ],
    },
    {
      company: "Orane Consulting",
      role: "Software Engineer",
      location: "Noida",
      date: "Mar 2023 — Jun 2026",
      intro:
        "Delivered business software for supply chains, supplier management, and transport operations. Took ownership from system design and development through launch, then improved speed, reliability, and operating costs.",
      areas: [
        {
          title: "National food supply chain · RK Group / IRCTC vendor",
          text: "Led the design of a new platform within a 4–6-person team. Connected food supply operations with existing business systems and built reliable processing for busy periods. The platform supported 100K+ daily transactions across 300+ trains with zero data loss; performance improvements reduced service response times by 40%.",
          metric: "100K+ daily transactions · 40% faster service responses",
        },
        {
          title: "Supplier management · BlackBerry, BIBA & Avaada",
          text: "Delivered platforms covering supplier onboarding, document verification, digital signing, and business notifications. Took the products through deployment and ongoing monitoring, with dependable message delivery and automated releases.",
        },
        {
          title: "Practical AI for purchasing teams",
          text: "Shipped tools that read invoice information and assist suppliers with quotation requests. Built a conversational assistant that connects plain-language requests to business workflows, with safeguards to keep responses grounded in the available information.",
        },
        {
          title: "Fleet operations · Ethiopian Electric Power",
          text: "Delivered booking, approvals, dispatch, fuel management, and live tracking for 500+ vehicles. Created tailored workflows for employees, managers, and fleet teams. Rebuilt the system to cut service response times from 2 seconds to 0.5 seconds and lower infrastructure costs by approximately 75%.",
          metric:
            "500+ vehicles · 75% faster service responses · ~75% lower infrastructure costs",
        },
        {
          title: "Live supplier auctions",
          text: "Built a live bidding system that handles simultaneous bids and keeps participants updated. Added checks and tests to protect the accuracy of bid records during concurrent auctions.",
        },
      ],
      tools: [
        "Node.js",
        "React",
        "MongoDB",
        "Redis",
        "BullMQ",
        "AWS",
        "Docker",
        "Anthropic SDK",
        "Socket.io",
      ],
    },
  ];
  return (
    <section id="experience" className="section container career-section">
      <Reveal>
        <div className="section-heading">
          <div>
            <p className="section-kicker">04 / THE JOURNEY</p>
            <h2>
              Where I’ve worked.
              <br />
              What I’ve delivered.
            </h2>
          </div>
          <a
            className="text-link"
            href="/Akul-Varshney-Resume-2026.pdf"
            download
          >
            Full résumé <Download size={16} />
          </a>
        </div>
      </Reveal>
      <CareerProgress>
        {jobs.map((job, i) => (
          <article className="career-chapter" key={job.company}>
            <div className="career-sidebar">
              <span className="career-number">0{i + 1}</span>
              <p className="career-date">{job.date}</p>
              <h3>{job.company}</h3>
              <p>
                {job.role}
                <br />
                {job.location}
              </p>
              {job.current && (
                <span className="current-label">
                  <span className="status-dot" /> Currently building
                </span>
              )}
            </div>
            <div className="career-content">
              <Reveal>
                <p className="career-intro">{job.intro}</p>
              </Reveal>
              <div className="career-workstreams">
                {job.areas.map((area, j) => (
                  <Reveal key={area.title} className="career-workstream">
                    <div className="workstream-heading">
                      <span>{String(j + 1).padStart(2, "0")}</span>
                      <h4>{area.title}</h4>
                    </div>
                    <p>{area.text}</p>
                    {area.metric && (
                      <div className="career-result">
                        <ArrowUpRight size={15} />
                        {area.metric}
                      </div>
                    )}
                  </Reveal>
                ))}
              </div>
              <details className="project-technology career-technology">
                <summary>Technology used in this role</summary>
                <div className="tags career-tools">
                  {job.tools.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </details>
            </div>
          </article>
        ))}
      </CareerProgress>
      <Reveal>
        <Credentials />
      </Reveal>
    </section>
  );
}

function Contact() {
  const [copyState, setCopyState] = useState("Copy email");
  const [intent, setIntent] = useState("An engineering role");
  const timeout = useRef(null);
  useEffect(() => () => clearTimeout(timeout.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopyState("Copied!");
    } catch {
      setCopyState("Use the email link");
    }
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopyState("Copy email"), 2500);
  }
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <Reveal>
          <p className="section-kicker">05 / WHAT’S NEXT</p>
          <h2>
            Good things start
            <br />
            with a conversation<span className="blue">.</span>
          </h2>
          <p className="contact-intro">
            Have a complex problem or a thoughtful idea?
            <br />
            Let’s build something that matters.
          </p>
          <div
            className="contact-intents"
            role="group"
            aria-label="What would you like to discuss?"
          >
            {["An engineering role", "A project idea", "Just saying hello"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setIntent(item)}
                  aria-pressed={intent === item}
                >
                  {item}
                </button>
              ),
            )}
          </div>
          <div className="contact-actions">
            <a
              className="button primary"
              href={`mailto:${email}?subject=${encodeURIComponent(intent)}`}
            >
              Let’s talk <ArrowUpRight size={18} />
            </a>
            <button className="copy-button" onClick={copy}>
              {copyState === "Copied!" ? (
                <Check size={16} />
              ) : (
                <Copy size={16} />
              )}
              <span aria-live="polite">{copyState}</span>
            </button>
          </div>
          <a className="email-link" href={`mailto:${email}`}>
            {email}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export default function Portfolio() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], [0, reduced ? 0 : 125]);
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <Header />
      <main id="main">
        <section className="hero container" id="top" ref={heroRef}>
          <HeroDepth progress={heroScroll} />
          <div className="hero-copy">
            <Reveal>
              <p className="eyebrow">
                <span className="tiny-cross">+</span> AKUL VARSHNEY{" "}
                <span className="eyebrow-divider" /> SOFTWARE ENGINEER
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1>
                Hi, I’m Akul.
                <br />I make complex
                <br />
                <Typewriter text="feel simple." />
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="hero-description">
                <span className="small-rule" />
                <p>
                  I build software that helps businesses run better—from
                  managing daily operations to making practical use of AI.
                </p>
              </div>
              <div className="hero-actions">
                <a className="button primary" href="#work">
                  Explore my work <ArrowUpRight size={19} />
                </a>
                <a
                  className="text-link"
                  href="/Akul-Varshney-Resume-2026.pdf"
                  download
                >
                  Download résumé <Download size={16} />
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="hero-note">
                <span className="status-dot" />
                <span>
                  Currently building AI-powered products at <strong>EXL</strong>
                </span>
              </div>
            </Reveal>
          </div>
          <motion.div className="hero-visual" style={{ y: heroY }}>
            <Reveal delay={0.2}>
              <figure className="portrait-card">
                <img
                  src="/akul-varshney.webp"
                  alt="Illustrated portrait of Akul Varshney"
                  width="1024"
                  height="1536"
                  fetchPriority="high"
                />
                <figcaption>
                  <strong>Akul Varshney</strong>
                  <span>Software engineer · Product builder</span>
                </figcaption>
              </figure>
            </Reveal>
          </motion.div>
          <div className="hero-bottom mono">
            <span>BUILT WITH CARE. MEASURED BY IMPACT.</span>
            <a href="#about">
              SCROLL TO EXPLORE <ArrowDown size={15} />
            </a>
          </div>
        </section>
        <section className="impact">
          <div className="container impact-grid">
            {[
              ["100K+", "daily transactions supported"],
              ["300+", "trains on one platform"],
              ["75%", "faster fleet service responses"],
              ["3+", "years delivering working products"],
            ].map(([n, l], i) => (
              <Reveal key={n} delay={i * 0.07}>
                <ImpactNumber value={n} />
                <span>{l}</span>
              </Reveal>
            ))}
          </div>
        </section>
        <section id="about" className="section container about-section">
          <Reveal>
            <p className="section-kicker">01 / A LITTLE ABOUT ME</p>
            <h2>
              Think in systems.
              <br />
              <span className="soft">Build for people.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="about-lead">
              I’m Akul, a software engineer who turns complex business needs
              into products people can use.
            </p>
            <p className="body-copy">
              I take ownership from the first requirements through launch and
              improvement. My work spans national supply chains, fleet
              operations, clinic management, and AI-assisted document
              review—with a focus on reliability, usability, and measurable
              results.
            </p>
            <div className="expertise">
              <span>
                <Database size={17} /> Reliable operations
              </span>
              <span>
                <Cpu size={17} /> Practical AI
              </span>
              <span>
                <Code2 size={17} /> End-to-end delivery
              </span>
            </div>
            <p className="education">
              B.Tech in Information Technology
              <br />
              <span>Amity University, Noida · 2019–2023</span>
            </p>
          </Reveal>
        </section>
        <Work />
        <SkillExplorer />
        <Experience />
        <Contact />
      </main>
      <footer className="container footer">
        <a className="wordmark" href="#top" aria-label="Back to top">
          akul<span>.</span>
        </a>
        <p>
          Thoughtfully engineered. © {new Date().getFullYear()} Akul Varshney
        </p>
        <div>
          <a
            href="https://github.com/akulvarshney"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub (opens new tab)"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/akulvarshney"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn (opens new tab)"
          >
            LinkedIn
          </a>
          <a href="#top" aria-label="Back to top">
            <ArrowUpRight size={19} />
          </a>
        </div>
      </footer>
    </MotionConfig>
  );
}
