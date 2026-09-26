'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

// Mobile gets shorter travel; reduced motion keeps every layer stationary.
function useTravel() {
  const reduced = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced ? 0 : mobile ? .25 : 1;
}

export function HeroDepth({ progress }) {
  const travel = useTravel();
  const y = useTransform(progress, [0, 1], [0, 200 * travel]);
  const rotate = useTransform(progress, [0, 1], [-25, -25 + 40 * travel]);
  const scale = useTransform(progress, [0, 1], [1, 1 + .35 * travel]);
  const nearY = useTransform(progress, [0, 1], [0, -100 * travel]);
  return <div className="hero-depth" aria-hidden="true"><motion.div className="hero-depth-ring" style={{y,rotate,scale}}/><motion.div className="hero-depth-grid" style={{y:nearY}}/><motion.span className="hero-depth-label" style={{y}}>DESIGN / BUILD / REFINE</motion.span></div>;
}

export function ParallaxPanel({ children }) {
  const ref = useRef(null);
  const travel = useTravel();
  const { scrollYProgress } = useScroll({target:ref,offset:['start end','end start']});
  const smooth = useSpring(scrollYProgress,{stiffness:110,damping:30});
  const y = useTransform(smooth,[0,1],[42*travel,-42*travel]);
  const rotate = useTransform(smooth,[0,1],[2*travel,-2*travel]);
  const depthY = useTransform(smooth,[0,1],[-60*travel,60*travel]);
  const depthRotate = useTransform(smooth,[0,1],[-25*travel,60*travel]);
  return <div className="project-art-shell" ref={ref}><motion.div className="project-art" style={{y,rotate}}><motion.div aria-hidden="true" className="project-depth-ring" style={{y:depthY,rotate:depthRotate}}/>{children}</motion.div></div>;
}

export function CareerProgress({children}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({target:ref,offset:['start 65%','end 75%']});
  const progress = useSpring(scrollYProgress,{stiffness:130,damping:30});
  return <div className="career-timeline" ref={ref}><div className="career-scroll-rail" aria-hidden="true"><motion.span style={{scaleY:reduced?1:progress}}/></div>{children}</div>;
}

export function ScrollTitle({children, label}) {
  const ref=useRef(null);
  const travel=useTravel();
  const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});
  const x=useTransform(scrollYProgress,[0,1],[85*travel,-85*travel]);
  return <div className="scroll-title" ref={ref}><motion.span className="scroll-title-backdrop" aria-hidden="true" style={{x}}>{label}</motion.span><div className="scroll-title-content">{children}</div></div>;
}
