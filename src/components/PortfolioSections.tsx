import React, { useEffect, useState } from 'react';
import { Github, Instagram, Linkedin, Mail, Sparkles, Code2, Users, Lightbulb, Palette, Zap, BookOpen, Heart, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

const projects = [
  { title: 'Pretext Kotlin Library', label: 'Open Source · Library', what: 'A Kotlin/JVM text-layout engine built around prepared measurements and fast reusable layout.', why: 'I wanted a layout system that could do more interesting things with text, including dynamic obstacles.', learned: 'Thinking about layout as preparation + cheap reuse changed how I approach performance-sensitive UI work.', github: 'https://github.com/Coderarshil/pretext-kotlin-library' },
  { title: 'MiniCPM-V Apps', label: 'Contribution · Android', what: 'An English-localized, UI/UX-refined Android experience based on OpenBMB MiniCPM-V Apps.', why: 'I wanted the app to feel cleaner, softer and more at home on a modern Android device.', learned: 'Small visual decisions and usability refinements can completely change how a technical product feels.', github: 'https://github.com/Coderarshil/MiniCPM-V-Apps' },
  { title: 'Mosquito Risk', label: 'Open Source · Computational Project', what: 'A climate-informed mosquito risk assessment prototype using weather data and environmental modeling.', why: 'I wanted to turn environmental variables into something understandable and useful through computation.', learned: 'Mixing APIs, mathematical relationships, geospatial thinking and ML ideas is messy — and fun.', github: 'https://github.com/Coderarshil/Mosquito-risk', demo: 'https://mosquito-risk-zeta.vercel.app/' },
];

const skills = [
  ['Fast learner', Lightbulb],
  ['Team worker', Users],
  ['Problem solver', Zap],
  ['Communication', Mail],
  ['Extrovert', Heart],
  ['Adaptive', Sparkles],
  ['Creative', Palette],
  ['Design', Code2],
  ['Experimental', Lightbulb],
  ['Curious', BookOpen],
] as const;

const done = [
  ['Built and open-sourced a Kotlin text-layout library.', '2026'],
  ['Contributed localization + UI/UX refinements to MiniCPM-V Apps.', '2026'],
  ['Built a climate-informed mosquito risk prototype.', '2026'],
  ['Completed NASA Open Science 101.', 'Aug 2026'],
  ['Completed NASA ARSET remote-sensing trainings.', 'Aug 2026'],
  ['Completed Elements of AI.', 'Aug 2026'],
];

const interests = [
  ['AI & Technology', 'thinking, tinkering, testing'], ['Creative technology', 'making ideas feel alive'], ['Design', 'details matter'], ['Android & Web', 'building things that run'], ['Writing & Drawing', 'ideas need somewhere to go'], ['Football', 'the occasional chaos'], ['Anime & Music', 'fuel for the imagination'], ['Japanese', 'まだまだ勉強中 ☕'], ['Open science & learning', 'always one more thing to explore'], ['Experimenting', 'probably my default setting']
];

const certificates = [
  { title: 'Elements of AI', org: 'University of Helsinki / MinnaLearn', date: 'Aug 30, 2026', image: '/certificates/UNIVERSITY OF HELSINKI ELEMENTS OF AI.webp', full: '/certificates/UNIVERSITY OF HELSINKI ELEMENTS OF AI.webp' },
  { title: 'NASA Open Science 101', org: 'NASA', date: 'Aug 17, 2026', image: '/certificates/OpenScience101 Certificate.webp', full: '/certificates/OpenScience101 Certificate.webp' },
  { title: 'Fundamentals of Remote Sensing', org: 'NASA ARSET', date: 'Aug 31, 2026', image: '/certificates/NASA ARSET Fundamentals of Remote Sensing.webp', full: '/certificates/NASA ARSET Fundamentals of Remote Sensing.webp' },
  { title: 'Hyperspectral Data for Land and Coastal Systems', org: 'NASA ARSET', date: 'Aug 31, 2026', image: '/certificates/NASA Hyperspectral Data for Land and Coastal Systems.webp', full: '/certificates/NASA Hyperspectral Data for Land and Coastal Systems.webp' },
];

export function PortfolioSections() {
  return <>
    <About />
    <Experiments />
    <Projects />
    <Skills />
    <ThingsDone />
    <Certifications />
    <Interests />
    <Contact />
  </>;
}

function Wrap({ id, eyebrow, title, children, className='' }: { id:string; eyebrow:string; title:string; children:React.ReactNode; className?:string }) {
  return <section id={id} className={`max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-16 ${className}`}><div className="text-center mb-8 sm:mb-10"><p className="font-handwriting text-xl text-[var(--accent-primary)]">{eyebrow}</p><h2 className="font-serif text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mt-1">{title}</h2></div>{children}</section>;
}

function About() {
  return <Wrap id="about" eyebrow="a tiny introduction ♡" title="About me"><div className="max-w-3xl mx-auto text-center"><p className="text-lg sm:text-xl leading-relaxed text-[var(--text-secondary)]">I’m Arshil — a Class 12 student who likes building things, experimenting with ideas, and learning by getting my hands dirty. I’m especially drawn to AI, design and creative technology, but I’m curious enough to wander into almost anything that looks interesting.</p></div><div className="mt-7 flex flex-wrap justify-center gap-2">{['curious', 'creative', 'adaptive', 'experimental', 'always learning'].map(x => <span key={x} className="px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)] shadow-sm">{x}</span>)}</div><div className="mt-10 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 sm:p-7 text-left relative overflow-hidden"><div className="absolute -top-3 left-[18%] w-20 h-7 bg-white/30 dark:bg-white/10 rotate-[-2deg] border border-black/5 dark:border-white/10"/><p className="font-handwriting text-2xl text-[var(--accent-primary)]">Student life, but make it experimental.</p><div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4"><Info label="School" value="LUCKNOW CHRISTIAN COLLEGE"/><Info label="Class" value="12th"/><Info label="Board" value="Uttar Pradesh Board · 2027"/></div></div></Wrap>;
}

function Info({label,value}:{label:string;value:string}) { return <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4"><p className="text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">{label}</p><p className="mt-1 font-serif text-lg font-bold text-[var(--text-primary)]">{value}</p></div>; }

function Experiments() {
  return <Wrap id="experiments" eyebrow="the little lab" title="I like to experiment."><div className="grid md:grid-cols-3 gap-5">{[
    ['01', 'Try the weird idea', 'Sometimes the fastest way to learn is to build the thing before you fully know how.'],
    ['02', 'Tinker with the details', 'UI, interactions, tiny performance choices — the little things are part of the fun.'],
    ['03', 'Make something playful', 'And yes, that includes keeping a tiny Tic-Tac-Toe game around.'],
  ].map(([n,t,b]) => <motion.div key={n} whileHover={{ y:-5, rotate: n==='02' ? -1 : 0 }} className="bg-[var(--sticky-bg)] border border-[var(--sticky-border)] rounded-xl p-6 shadow-sm"><p className="font-handwriting text-lg text-[var(--sticky-text)]">{n}</p><h3 className="font-serif text-2xl font-bold text-[var(--sticky-text)] mt-1">{t}</h3><p className="text-[var(--sticky-text)]/80 leading-relaxed mt-2">{b}</p></motion.div>)}</div></Wrap>;
}

function Projects() {
  return <Wrap id="projects" eyebrow="things I’ve built" title="Projects"><div className="grid lg:grid-cols-3 gap-5">{projects.map((p, i) => <motion.article key={p.title} whileHover={{ y:-6 }} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm flex flex-col"><div className="h-3 bg-[var(--accent-primary)]"/><div className="p-6 flex-1"><div className="flex items-center justify-between gap-3"><span className="text-xs uppercase tracking-[0.08em] text-[var(--accent-primary)]">{p.label}</span><span className="font-handwriting text-xl text-[var(--accent-light)]">0{i+1}</span></div><h3 className="font-serif text-2xl font-bold text-[var(--text-primary)] mt-2">{p.title}</h3><ProjectPart label="What I built" text={p.what}/><ProjectPart label="Why" text={p.why}/><ProjectPart label="What I learned" text={p.learned}/></div><div className="px-6 pb-6 flex flex-wrap gap-2"><a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-primary)] text-white text-sm">GitHub <Github size={14}/></a>{p.demo && <a href={p.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] text-[var(--text-primary)] text-sm">Demo <ExternalLink size={14}/></a>}</div></motion.article>)}</div></Wrap>;
}
function ProjectPart({label,text}:{label:string;text:string}) { return <div className="mt-4"><p className="font-handwriting text-lg text-[var(--accent-primary)]">{label}</p><p className="text-sm text-[var(--text-secondary)] leading-relaxed">{text}</p></div>; }

function Skills() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  return (
    <Wrap id="skills" eyebrow="how I work ♡" title="Skills" className="skills-section">
      <div className="relative mx-auto w-[min(96vw,700px)] aspect-square sm:mt-2">
        <motion.div
          className="absolute inset-0 rounded-full border border-[var(--border-color)]/35"
          animate={{ opacity: isMobile ? (open ? 1 : 0) : 1 }}
          transition={{ duration: 0.35 }}
          aria-hidden="true"
        />

        <motion.button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-inner flex items-center justify-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/40 skills-center"
          animate={{ width: isMobile ? (open ? 54 : 118) : 160, height: isMobile ? (open ? 54 : 118) : 160, rotate: isMobile && open ? 90 : 0 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          aria-expanded={isMobile ? open : undefined}
          aria-label={isMobile ? (open ? 'Close skills' : 'Show skills') : 'Skills'}
        >
          <span className="skills-desktop-center text-center px-4">
            <span className="block font-handwriting text-2xl text-[var(--accent-primary)]">me, in the middle</span>
            <span className="block font-serif text-xl font-bold leading-tight text-[var(--text-primary)] mt-1">always figuring it out</span>
          </span>
          <motion.span
            className="font-handwriting text-[var(--accent-primary)] skills-mobile-center"
            animate={{ opacity: open ? 0 : 1, scale: open ? 0.65 : 1 }}
            transition={{ duration: 0.2 }}
          >Skills??</motion.span>
          <motion.span
            className="absolute text-2xl text-[var(--accent-primary)] skills-mobile-center"
            animate={{ opacity: open ? 1 : 0, rotate: open ? -90 : 0, scale: open ? 1 : 0.6 }}
            transition={{ duration: 0.22, delay: open ? 0.12 : 0 }}
          >×</motion.span>
        </motion.button>

        {skills.map(([name, Icon], i) => {
          const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <SkillOrbitItem
              key={name}
              name={name}
              Icon={Icon}
              angle={angle}
              index={i}
              open={open}
              isMobile={isMobile}
            />
          );
        })}
      </div>
    </Wrap>
  );
}

function SkillOrbitItem({
  name,
  Icon,
  angle,
  index,
  open,
  isMobile,
}: {
  name: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  angle: number;
  index: number;
  open: boolean;
  isMobile: boolean;
}) {
  // Desktop keeps the original circular orbit. On mobile, use a single
  // carefully spaced ring with positions chosen for the actual chip widths.
  // This keeps every word intact instead of solving collisions by chopping
  // words onto multiple lines.
  const desktopRadius = 255;
  // Mobile uses a collision-free 3-2-2-3 ring layout rather than a
  // mathematically even orbit. This keeps long labels like
  // \"Experimental\" and \"Communication\" intact on narrow screens.
  const mobilePositions = [
    [0, -140], [-105, -60], [105, -60], [110, 0], [110, 60],
    [105, 110], [0, 150], [-105, 110], [-110, 60], [-110, 0],
  ] as const;
  const [mobileX, mobileY] = mobilePositions[index];
  const x = isMobile ? mobileX : Math.cos(angle) * desktopRadius;
  const y = isMobile ? mobileY : Math.sin(angle) * desktopRadius;

  return (
    <motion.div
      className="skill-orbit-item absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      initial={false}
      animate={{
        opacity: isMobile ? (open ? 1 : 0) : 1,
        scale: isMobile ? (open ? 1 : 0.35) : 1,
        x: open ? x : 0,
        y: open ? y : 0,
      }}
      transition={{
        duration: 0.58,
        delay: isMobile ? (open ? index * 0.025 : (skills.length - index) * 0.012) : index * 0.015,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ '--skill-x': `${x}px`, '--skill-y': `${y}px` } as React.CSSProperties}
    >
      <motion.div
        whileHover={{ scale: 1.07 }}
        className="skill-chip w-max min-w-[88px] max-w-[132px] min-h-10 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm px-3 py-2 flex items-center justify-center text-center overflow-visible"
      >
        <div className="flex w-max items-center justify-center gap-1.5 text-[11px] sm:text-xs leading-[1.15] text-[var(--text-primary)] whitespace-nowrap">
          <Icon size={14} className="text-[var(--accent-primary)] shrink-0" />
          <span className="whitespace-nowrap">{name}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ThingsDone() {
  return <Wrap id="done" eyebrow="a few pages from the notebook" title="Things I’ve Done"><div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-4">{done.map(([text,date],i) => <motion.div key={text} whileHover={{ x:i%2?2:-2 }} className="relative bg-[var(--sticky-bg)] border border-[var(--sticky-border)] rounded-xl p-5 shadow-sm"><div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-5 bg-white/30 dark:bg-white/10 border border-black/5 dark:border-white/10 rotate-2"/><div className="flex items-start justify-between gap-3"><p className="font-handwriting text-xl text-[var(--sticky-text)]">{text}</p><span className="text-xs font-medium text-[var(--sticky-text)]/70 mt-1 whitespace-nowrap">{date}</span></div></motion.div>)}</div></Wrap>;
}

function Certifications() {
  const [open,setOpen]=useState<(typeof certificates)[number] | null>(null);
  return <Wrap id="certifications" eyebrow="proof I kept learning" title="Certifications"><div className="grid md:grid-cols-2 gap-5">{certificates.map(c => <motion.button type="button" key={c.title} onClick={()=>setOpen(c)} whileHover={{ y:-5, rotate:c.title.length%2?-0.4:0.4 }} className="text-left bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm"><div className="bg-[var(--bg-secondary)] p-3 border-b border-[var(--border-color)]"><img src={c.image} alt={`${c.title} certificate`} className="w-full aspect-[4/3] object-contain rounded-xl bg-white/50 dark:bg-black/10"/></div><div className="p-5"><p className="text-xs uppercase tracking-[0.08em] text-[var(--accent-primary)]">{c.org}</p><h3 className="font-serif font-bold text-xl text-[var(--text-primary)] mt-1">{c.title}</h3><p className="text-sm text-[var(--text-muted)] mt-2">{c.date}</p><p className="font-handwriting text-lg text-[var(--accent-primary)] mt-3">view certificate →</p></div></motion.button>)}</div><AnimateCert open={open} onClose={()=>setOpen(null)}/></Wrap>;
}
function AnimateCert({open,onClose}:{open:(typeof certificates)[number] | null;onClose:()=>void}) { return <>{open && <motion.div className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}><motion.div onClick={e=>e.stopPropagation()} initial={{opacity:0,scale:0.97,y:10}} animate={{opacity:1,scale:1,y:0}} className="w-full max-w-5xl max-h-[90vh] overflow-auto rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] p-4 sm:p-6 shadow-2xl"><div className="flex items-start justify-between gap-4 mb-4"><div><p className="text-xs uppercase tracking-[0.08em] text-[var(--accent-primary)]">{open.org}</p><h3 className="font-serif text-2xl font-bold text-[var(--text-primary)] mt-1">{open.title}</h3></div><button onClick={onClose} className="text-[var(--accent-primary)] px-3 py-1 rounded-full border border-[var(--border-color)]">close</button></div>{<img src={open.full} alt={open.title} className="w-full rounded-xl"/>}<a href={open.full} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--accent-primary)]">Open full certificate <ExternalLink size={14}/></a></motion.div></motion.div>}</>; }

function Interests() { return <Wrap id="interests" eyebrow="things that pull my attention" title="Interests"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{interests.map(([title,body],i)=><motion.div key={title} whileHover={{ y:-4 }} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm relative overflow-hidden"><div className="absolute -right-8 -top-8 w-20 h-20 rounded-full bg-[var(--accent-primary)]/5"/><p className="font-serif text-xl font-bold text-[var(--text-primary)]">{title}</p><p className="font-handwriting text-lg text-[var(--accent-primary)] mt-1">{body}</p></motion.div>)}</div></Wrap>; }

function Contact() { return <Wrap id="contact" eyebrow="one last cup?" title="Let’s talk" className="contact-section"><div className="contact-card w-full max-w-3xl mx-auto box-border rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6 sm:p-10 text-center relative overflow-visible"><div className="absolute -top-3 left-[22%] w-16 h-7 bg-white/30 dark:bg-white/10 rotate-[-4deg] border border-black/5 dark:border-white/10"/><p className="font-handwriting text-3xl text-[var(--accent-primary)]">Grab a cup and say hello.</p><p className="mt-3 text-[var(--text-secondary)]">Ideas, collaborations, questions, or just a good conversation — my inbox is open.</p><a href="mailto:mohammadarshilsiddiqui.2008@gmail.com" className="flex w-fit max-w-[calc(100%-1rem)] mx-auto items-center justify-center gap-2 mt-6 bg-[var(--accent-primary)] text-white px-5 sm:px-6 py-3 rounded-full font-serif font-bold text-[clamp(0.72rem,3.5vw,1rem)] whitespace-nowrap">mohammadarshilsiddiqui.2008@gmail.com <Mail size={16} className="shrink-0"/></a><div className="mt-6 flex justify-center gap-3">{[[Github,'https://github.com/Coderarshil','GitHub'],[Instagram,'https://instagram.com/arshil7474','Instagram'],[Linkedin,'https://www.linkedin.com/in/mohammad-arshil-siddiqui-0121132a5','LinkedIn']].map(([Icon,href,label])=> <a key={label as string} href={href as string} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--accent-primary)]" aria-label={label as string}><Icon size={17}/></a>)}</div></div></Wrap>; }
