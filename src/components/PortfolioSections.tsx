import React, { useState } from 'react';
import { ArrowUpRight, Github, Instagram, Linkedin, Mail, Sparkles, PenLine, Code2, Users, Lightbulb, Palette, Zap, BookOpen, Trophy, Heart, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

const projects = [
  { title: 'Pretext Kotlin Library', label: 'Open Source · Library', what: 'A Kotlin/JVM text-layout engine built around prepared measurements and fast reusable layout.', why: 'I wanted a layout system that could do more interesting things with text, including dynamic obstacles.', learned: 'Thinking about layout as preparation + cheap reuse changed how I approach performance-sensitive UI work.', github: 'https://github.com/Coderarshil/pretext-kotlin-library' },
  { title: 'MiniCPM-V Apps', label: 'Contribution · Android', what: 'An English-localized, UI/UX-refined Android experience based on OpenBMB MiniCPM-V Apps.', why: 'I wanted the app to feel cleaner, softer and more at home on a modern Android device.', learned: 'Small visual decisions and usability refinements can completely change how a technical product feels.', github: 'https://github.com/Coderarshil/MiniCPM-V-Apps' },
  { title: 'Mosquito Risk', label: 'Open Source · Computational Project', what: 'A climate-informed mosquito risk assessment prototype using weather data and environmental modeling.', why: 'I wanted to turn environmental variables into something understandable and useful through computation.', learned: 'Mixing APIs, mathematical relationships, geospatial thinking and ML ideas is messy — and fun.', github: 'https://github.com/Coderarshil/Mosquito-risk', demo: 'https://mosquito-risk-zeta.vercel.app/' },
];

const skills = [
  ['Fast learner', Lightbulb], ['Team worker', Users], ['Problem solver', Zap], ['Writer', PenLine], ['Communication', Mail], ['Extrovert', Heart], ['Adaptive', Sparkles], ['Creative', Palette], ['Design', Code2], ['Experimental', Lightbulb], ['Curious', BookOpen], ['AI enthusiast', Code2]
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
  { title: 'Elements of AI', org: 'University of Helsinki / MinnaLearn', date: 'Aug 30, 2026', image: '/certificates/elements-of-ai.png', full: '/certificates/elements-of-ai.png', kind: 'image' as const },
  { title: 'NASA Open Science 101', org: 'NASA', date: 'Aug 17, 2026', image: '/certificates/nasa-open-science-101.png', full: '/certificates/OpenScience101-Certificate.pdf', kind: 'pdf' as const },
  { title: 'Fundamentals of Remote Sensing', org: 'NASA ARSET', date: 'Aug 31, 2026', image: '/certificates/nasa-fundamentals-remote-sensing.png', full: '/certificates/NASA-ARSET-Fundamentals-of-Remote-Sensing.pdf#page=2', kind: 'pdf' as const },
  { title: 'Hyperspectral Data for Land and Coastal Systems', org: 'NASA ARSET', date: 'Aug 31, 2026', image: '/certificates/nasa-hyperspectral.png', full: '/certificates/NASA-ARSET-Hyperspectral.pdf', kind: 'pdf' as const },
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
  return (
    <Wrap id="skills" eyebrow="how I work ♡" title="Skills">
      <div className="relative mx-auto w-[min(94vw,520px)] aspect-square">
        <div className="absolute inset-0 rounded-full border border-[var(--border-color)]/45" aria-hidden="true" />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col items-center justify-center text-center shadow-inner px-4">
          <p className="font-handwriting text-xl sm:text-2xl text-[var(--accent-primary)] leading-tight">me, in the middle</p>
          <p className="font-serif text-sm sm:text-xl font-bold leading-tight text-[var(--text-primary)] mt-1">always figuring it out</p>
        </div>

        {skills.map(([name, Icon], i) => {
          const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * 145;
          const y = Math.sin(angle) * 145;
          return (
            <div
              key={name}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ marginLeft: x, marginTop: y }}
            >
              <motion.div
                whileHover={{ scale: 1.07 }}
                className="w-[74px] sm:w-[96px] min-h-9 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm px-2 py-1.5 flex items-center justify-center text-center"
              >
                <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs leading-tight text-[var(--text-primary)]">
                  <Icon size={13} className="text-[var(--accent-primary)] shrink-0" />
                  <span>{name}</span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </Wrap>
  );
}

function ThingsDone() {
  return <Wrap id="done" eyebrow="a few pages from the notebook" title="Things I’ve Done"><div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-4">{done.map(([text,date],i) => <motion.div key={text} whileHover={{ x:i%2?2:-2 }} className="relative bg-[var(--sticky-bg)] border border-[var(--sticky-border)] rounded-xl p-5 shadow-sm"><div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-5 bg-white/30 dark:bg-white/10 border border-black/5 dark:border-white/10 rotate-2"/><div className="flex items-start justify-between gap-3"><p className="font-handwriting text-xl text-[var(--sticky-text)]">{text}</p><span className="text-xs font-medium text-[var(--sticky-text)]/70 mt-1 whitespace-nowrap">{date}</span></div></motion.div>)}</div></Wrap>;
}

function Certifications() {
  const [open,setOpen]=useState<(typeof certificates)[number] | null>(null);
  return <Wrap id="certifications" eyebrow="proof I kept learning" title="Certifications"><div className="grid md:grid-cols-2 gap-5">{certificates.map(c => <motion.button type="button" key={c.title} onClick={()=>setOpen(c)} whileHover={{ y:-5, rotate:c.title.length%2?-0.4:0.4 }} className="text-left bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm"><div className="bg-[var(--bg-secondary)] p-3 border-b border-[var(--border-color)]"><img src={c.image} alt={`${c.title} certificate`} className="w-full aspect-[4/3] object-contain rounded-xl bg-white/50 dark:bg-black/10"/></div><div className="p-5"><p className="text-xs uppercase tracking-[0.08em] text-[var(--accent-primary)]">{c.org}</p><h3 className="font-serif font-bold text-xl text-[var(--text-primary)] mt-1">{c.title}</h3><p className="text-sm text-[var(--text-muted)] mt-2">{c.date}</p><p className="font-handwriting text-lg text-[var(--accent-primary)] mt-3">view certificate →</p></div></motion.button>)}</div><AnimateCert open={open} onClose={()=>setOpen(null)}/></Wrap>;
}
function AnimateCert({open,onClose}:{open:(typeof certificates)[number] | null;onClose:()=>void}) { return <>{open && <motion.div className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}><motion.div onClick={e=>e.stopPropagation()} initial={{opacity:0,scale:0.97,y:10}} animate={{opacity:1,scale:1,y:0}} className="w-full max-w-5xl max-h-[90vh] overflow-auto rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] p-4 sm:p-6 shadow-2xl"><div className="flex items-start justify-between gap-4 mb-4"><div><p className="text-xs uppercase tracking-[0.08em] text-[var(--accent-primary)]">{open.org}</p><h3 className="font-serif text-2xl font-bold text-[var(--text-primary)] mt-1">{open.title}</h3></div><button onClick={onClose} className="text-[var(--accent-primary)] px-3 py-1 rounded-full border border-[var(--border-color)]">close</button></div>{open.kind==='image' ? <img src={open.full} alt={open.title} className="w-full rounded-xl"/> : <iframe src={open.full} title={open.title} className="w-full h-[70vh] rounded-xl border border-[var(--border-color)] bg-white"/>}<a href={open.full} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--accent-primary)]">Open full certificate <ExternalLink size={14}/></a></motion.div></motion.div>}</>; }

function Interests() { return <Wrap id="interests" eyebrow="things that pull my attention" title="Interests"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{interests.map(([title,body],i)=><motion.div key={title} whileHover={{ y:-4 }} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm relative overflow-hidden"><div className="absolute -right-8 -top-8 w-20 h-20 rounded-full bg-[var(--accent-primary)]/5"/><p className="font-serif text-xl font-bold text-[var(--text-primary)]">{title}</p><p className="font-handwriting text-lg text-[var(--accent-primary)] mt-1">{body}</p></motion.div>)}</div></Wrap>; }

function Contact() { return <Wrap id="contact" eyebrow="one last cup?" title="Let’s talk"><div className="max-w-3xl mx-auto rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-7 sm:p-10 text-center relative overflow-hidden"><div className="absolute -top-3 left-[22%] w-16 h-7 bg-white/30 dark:bg-white/10 rotate-[-4deg] border border-black/5 dark:border-white/10"/><p className="font-handwriting text-3xl text-[var(--accent-primary)]">Grab a cup and say hello.</p><p className="mt-3 text-[var(--text-secondary)]">Ideas, collaborations, questions, or just a good conversation — my inbox is open.</p><a href="mailto:arshilaehmad.2000@gmail.com" className="inline-flex items-center gap-2 mt-6 bg-[var(--accent-primary)] text-white px-6 py-3 rounded-full font-serif font-bold">arshilaehmad.2000@gmail.com <Mail size={16}/></a><div className="mt-6 flex justify-center gap-3">{[[Github,'https://github.com/Coderarshil','GitHub'],[Instagram,'https://instagram.com/arshil7474','Instagram'],[Linkedin,'https://www.linkedin.com/in/mohammad-arshil-siddiqui-0121132a5','LinkedIn']].map(([Icon,href,label])=> <a key={label as string} href={href as string} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--accent-primary)]" aria-label={label as string}><Icon size={17}/></a>)}</div></div></Wrap>; }
