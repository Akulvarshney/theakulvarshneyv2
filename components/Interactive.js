'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useSpring, useInView } from 'framer-motion';
import { Check, Code2, Cpu, Database, Layers3, Play, Sparkles, Workflow, Zap } from 'lucide-react';

const stack = [
  {name:'Experience', tech:'React / Next.js', icon:Code2, text:'The part you feel. Responsive interfaces, clear feedback, and careful interaction design.'},
  {name:'Orchestration', tech:'Node.js / FastAPI', icon:Workflow, text:'The part that connects. APIs and async workflows that keep complex products moving.'},
  {name:'Intelligence', tech:'LangGraph / Azure AI', icon:Cpu, text:'The part that reasons. Multi-agent workflows with grounded outputs and human review.'},
  {name:'Foundation', tech:'PostgreSQL / Redis', icon:Database, text:'The part you trust. Well-designed data, caching, and resilient infrastructure.'},
];
export function EngineeringScene() {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(1);
  const [pulse, setPulse] = useState(0);
  const reduced = useReducedMotion();
  const rx = useSpring(0, {stiffness:90,damping:20});
  const ry = useSpring(0, {stiffness:90,damping:20});
  function move(e){if(reduced || e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();rx.set((.5-(e.clientY-r.top)/r.height)*14);ry.set(((e.clientX-r.left)/r.width-.5)*18);}
  return <div className={`engineering-scene ${expanded?'unpacked':''}`} onPointerMove={move} onPointerLeave={()=>{rx.set(0);ry.set(0);}}>
    <div className="scene-top"><span><span className="status-dot"/> INTERACTIVE SYSTEM</span><span>V.01</span></div>
    <motion.div className="scene-stage" style={{rotateX:rx,rotateY:ry}}>
      <div className="scene-halo"/><div className="orbit orbit-one"/><div className="orbit orbit-two"/>
      <div className="scene-core"><Cpu size={42} strokeWidth={1}/><span>AV / ENGINE</span></div>
      {stack.map((item,i)=><motion.button key={item.name} className={`scene-layer scene-layer-${i} ${active===i?'selected':''}`} animate={{y:expanded?(i-1.5)*83:(i-1.5)*68,x:expanded?0:(1.5-i)*17,rotate:expanded?0:-12,scale:active===i?1.04:1}} transition={{type:'spring',stiffness:150,damping:19}} onClick={()=>{setActive(i);setPulse(v=>v+1);}} aria-pressed={active===i} aria-label={`Explore ${item.name}`}><item.icon size={22}/><span><b>{item.name}</b><small>{item.tech}</small></span><span className="scene-layer-index">0{i+1}</span>{active===i && <span key={pulse} className="signal-flash"/>}</motion.button>)}
      <span className="scene-coordinate">28.4595° N / 77.0266° E</span>
    </motion.div>
    <div className="scene-controls"><button onClick={()=>setExpanded(!expanded)} aria-pressed={expanded}><Layers3 size={15}/>{expanded?'Collapse the stack':'Unpack the stack'}<span>{expanded?'−':'+'}</span></button><span>MOVE · CLICK · EXPLORE</span></div>
    <div className="scene-description" aria-live="polite"><AnimatePresence mode="wait"><motion.p key={active} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} transition={{duration:.16}}>{stack[active].text}</motion.p></AnimatePresence></div>
  </div>;
}

const skillGroups=[
  {name:'Business operations',icon:Database,title:'Software that keeps work moving.',description:'Connect everyday processes, information, and teams in systems designed to stay reliable as a business grows.',tools:['Node.js','FastAPI','PostgreSQL','MongoDB','Redis'],proof:'100K+ daily transactions supported across a national food supply chain.'},
  {name:'Practical AI',icon:Cpu,title:'Help with the time-consuming parts.',description:'Use AI to organize documents, extract useful information, and assist with routine tasks—with human review where it matters.',tools:['LangGraph','Azure OpenAI','Anthropic SDK','Python'],proof:'Delivered invoice extraction, quotation assistance, and claims processing workflows.'},
  {name:'Product experience',icon:Code2,title:'Make the next step clear.',description:'Build interfaces that help people complete their work, from managing a clinic to coordinating vehicles or conducting an interview.',tools:['React','Next.js','TypeScript','React Native'],proof:'Delivered dashboards, collaborative tools, and workflows tailored to different users.'},
  {name:'Delivery & improvement',icon:Workflow,title:'Launch, learn, and improve.',description:'Take products into everyday use, monitor their performance, and improve speed and running costs as needs evolve.',tools:['AWS','Azure','Docker','GitHub Actions'],proof:'Approximately 75% lower fleet infrastructure costs after rebuilding the system.'},
];
export function SkillExplorer(){
 return <section id="skills" className="section container skills-section"><div className="section-heading"><div><p className="section-kicker">03 / HOW I HELP</p><h2>From business need<br/>to a working product.</h2></div><p>A practical partner across<br/>the life of a product.</p></div><div className="skill-mosaic">{skillGroups.map((s,i)=><motion.article key={s.name} className={`skill-tile skill-tile-${i}`} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.5}}><div className="skill-tile-top"><s.icon size={28} strokeWidth={1.4}/><span>0{i+1} / {s.name.toUpperCase()}</span></div><h3>{s.title}</h3><p>{s.description}</p><details className="project-technology skill-technology"><summary>Tools I use</summary><div className="skill-tools">{s.tools.map(t=><span key={t}>{t}</span>)}</div></details><div className="skill-proof"><Zap size={16}/>{s.proof}</div></motion.article>)}</div></section>;
}

export function ProjectDemo({project}){
 const [playing,setPlaying]=useState(false); const [step,setStep]=useState(-1);const timer=useRef(null);useEffect(()=>()=>clearInterval(timer.current),[]);
 function play(){setPlaying(true);setStep(0);let n=0;clearInterval(timer.current);timer.current=setInterval(()=>{n++;setStep(n);if(n===3){clearInterval(timer.current);setPlaying(false);}},700);}
 return <div className="project-demo"><div className="demo-track">{project.flow.map((s,i)=><div key={s} className={step>=i?'done':''}><span className="demo-node">{step>i?<Check size={15}/>:i+1}</span><span>{s}</span>{i<2&&<i className={step>i?'connected':''}/>}</div>)}</div><div className="demo-bottom"><span aria-live="polite">{step===3?'Workflow complete':playing?project.flow[step]+'…':'A conceptual workflow preview'}</span><button onClick={play} disabled={playing} aria-label={`Play ${project.name} workflow`}><Play size={12}/>{playing?'Running':step===3?'Replay':'Try it'}</button></div></div>;
}

export function Credentials(){
 const groups=[{title:'Learning & certifications',items:['AWS Academy Graduate — Cloud Foundations','CCNAv7 — Enterprise Networking, Security & Automation','AI Coder: Vibe Coder to Agentic Engineer — Udemy','AI-First Product Management — Airtribe · In progress']},{title:'Research & recognition',items:['Emerald — MSME Resilience','Springer — AI & Cloud Software','IEEE — Face Mask Detection & e-Challan',"Achiever’s Award — Knowledge Creation & Research Contribution"]}];
 return <div className="credential-library"><p className="section-kicker">CURIOSITY DOESN’T CLOCK OUT</p><h3>Always a student.</h3><div className="credential-columns">{groups.map(group=><div key={group.title}><h4>{group.title}</h4><ul>{group.items.map(item=><li key={item}><Sparkles size={14}/>{item}</li>)}</ul></div>)}</div></div>;
}

export function ImpactNumber({value}) {
  const ref=useRef(null); const inView=useInView(ref,{once:true,amount:.5}); const reduced=useReducedMotion();
  const target=parseInt(value,10); const suffix=value.replace(/^\d+/, ''); const [number,setNumber]=useState(target);
  useEffect(()=>{if(!inView||reduced)return;let frame;let start;function tick(time){if(start===undefined)start=time;const progress=Math.min((time-start)/1400,1);setNumber(Math.round(target*(1-Math.pow(1-progress,3))));if(progress<1)frame=requestAnimationFrame(tick);}frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[inView,reduced,target]);
  return <strong ref={ref} aria-label={value}><span aria-hidden="true">{number}{suffix}</span></strong>;
}

export function Typewriter({text}) {
  const ref = useRef(null);
  const visible = useInView(ref);
  const reduced = useReducedMotion();
  const [length, setLength] = useState(0);
  useEffect(() => {
    if (!visible || reduced || !text.length) return;
    let timer;
    let index = 0;
    let deleting = false;
    setLength(0);
    const tick = () => {
      index += deleting ? -1 : 1;
      setLength(index);
      let delay = deleting ? 55 : 95;
      if (index === text.length) {
        deleting = true;
        delay = 1800;
      } else if (index === 0) {
        deleting = false;
        delay = 500;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 650);
    return () => clearTimeout(timer);
  }, [visible, reduced, text]);
  return <span ref={ref} className="typewriter"><span className="typing-accessible">{text}</span><span className="typing-space hero-gradient" aria-hidden="true">{text}</span><span className="typing-ink" aria-hidden="true"><span className="hero-gradient">{reduced ? text : text.slice(0,length)}</span><span className="typing-cursor"/></span></span>;
}
