import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const projects = [
  {
    title: 'Pretext Kotlin Library',
    label: 'Open Source · Library',
    what: 'A Kotlin/JVM text-layout engine built around cached font measurements and reusable layout work.',
    why: 'I wanted a cleaner way to deal with text wrapping when the layout has things in the way.',
    learned: 'How a small, focused library can balance measurement, layout and performance.',
    github: 'https://github.com/Coderarshil/pretext-kotlin-library',
    accent: 'paper',
  },
  {
    title: 'MiniCPM-V Apps',
    label: 'Contribution · Android',
    what: 'An English localization and UI/UX refinement of OpenBMB MiniCPM-V Apps.',
    why: 'I liked the project and wanted the Android experience to feel clearer, softer and more polished.',
    learned: 'How small visual and usability changes can make an existing product feel much more natural.',
    github: 'https://github.com/Coderarshil/MiniCPM-V-Apps',
    demo: 'https://github.com/Coderarshil/MiniCPM-V-Apps/releases/tag/v1.0.0',
    demoLabel: 'Demo APK',
    accent: 'pixel',
  },
  {
    title: 'Mosquito Risk',
    label: 'Open Source · Prototype',
    what: 'A climate-informed computational framework for environmental mosquito risk assessment.',
    why: 'I wanted to experiment with weather, biological relationships and modelling in one place.',
    learned: 'How APIs, feature engineering, mathematical modelling and geospatial ideas can come together.',
    github: 'https://github.com/Coderarshil/Mosquito-risk',
    demo: 'https://mosquito-risk-zeta.vercel.app/',
    accent: 'weather',
  },
];

const interests = [
  'AI & technology', 'creative technology', 'design', 'Android', 'web', 'writing',
  'drawing', 'football', 'anime', 'music', 'Japanese', 'open science', 'learning', 'experimenting'
];

const certificates = [
  {
    title: 'NASA Open Science 101',
    org: 'NASA',
    date: 'Aug 17, 2026',
    file: '/certificates/OpenScience101 Certificate.pdf',
  },
  {
    title: 'Fundamentals of Remote Sensing',
    org: 'NASA ARSET',
    date: 'Aug 31, 2026',
    file: '/certificates/NASA ARSET Fundamentals of Remote Sensing.pdf',
  },
  {
    title: 'Hyperspectral Data for Land and Coastal Systems',
    org: 'NASA ARSET',
    date: 'Aug 31, 2026',
    file: '/certificates/NASA certificate code 5970827782MA.pdf',
  },
];

const things = [
  { date: '2026', text: 'Built and published an open-source Kotlin library.' },
  { date: '2026', text: 'Contributed Android localization and UI/UX improvements to MiniCPM-V Apps.' },
  { date: '2026', text: 'Built a climate-informed mosquito risk prototype and public demo.' },
  { date: '2026', text: 'Completed NASA Open Science and remote-sensing training.' },
];

function getAge() {
  const today = new Date();
  const birth = new Date(2008, 8, 24);
  let age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday = today.getMonth() < 8 || (today.getMonth() === 8 && today.getDate() < 24);
  if (beforeBirthday) age -= 1;
  return age;
}

function App() {
  const [dark, setDark] = useState(false);
  const [cupActive, setCupActive] = useState(false);
  const [showGame, setShowGame] = useState(true);
  const [activeCert, setActiveCert] = useState(null);
  const age = useMemo(getAge, []);

  useEffect(() => {
    const saved = localStorage.getItem('arshil-theme');
    if (saved === 'dark') setDark(true);
    if (saved === 'light') setDark(false);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('espresso-mode', dark);
    localStorage.setItem('arshil-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleTheme = () => setDark(v => !v);

  return (
    <div className={`site ${dark ? 'dark' : 'light'}`}>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 80 80"><path d="M19 30h34v21c0 10-7 15-17 15S19 61 19 51V30Z"/><path d="M53 35h7c6 0 9 4 9 8s-3 8-9 8h-7"/><path d="M29 22c0-6 5-7 5-12M42 22c0-6 5-7 5-12"/></svg>
          </span>
          <span className="brand-text">Mohammad Arshil Siddiqui</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary">
          {['Home','About','Projects','Skills','Things I’ve Done','Certifications','Interests','Contact'].map(item => (
            <a key={item} href={'#' + item.toLowerCase().replaceAll(' ','-').replaceAll('’','')}>
              {item}
            </a>
          ))}
        </nav>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle light and dark mode">
          <span>{dark ? '☾' : '☀'}</span><span>{dark ? 'espresso' : 'cappuccino'}</span>
        </button>
      </header>

      <main>
        <section id="home" className="hero section-shell">
          <div className="hero-copy reveal">
            <p className="eyebrow">a little corner of the internet</p>
            <h1>Hi, I’m <em>Arshil</em></h1>
            <p className="hero-role">Student <span>•</span> Developer <span>•</span> AI Enthusiast</p>
            <p className="hero-intro">Hi, I’m Arshil, a <strong>{age}-year-old</strong> student creative developer and AI enthusiast.</p>
            <p className="tagline">“Instead of complaining about the problem, why not fix it?”</p>
            <div className="hero-actions">
              <a className="btn primary" href="#projects">See what I’ve built</a>
              <a className="btn ghost" href="#about">A little more about me</a>
            </div>
            <div className="scribble-note">curiosity first <span>↗</span></div>
          </div>

          <div className={`hero-art ${cupActive ? 'cup-active' : ''}`}>
            <button className="cup-button" onClick={() => setCupActive(v => !v)} aria-label="Interact with the coffee portrait">
              <img src={dark ? '/hero-dark.png' : '/hero-light.png'} alt="Coffee cup portrait artwork of Arshil" />
              <span className="cup-glow" />
              <span className="cup-steam steam-one" />
              <span className="cup-steam steam-two" />
              <span className="cup-note">{cupActive ? 'Yep, that’s me. ☕' : 'click the cup'}</span>
            </button>
            <div className="energy-note">{dark ? 'espresso' : 'cappuccino'} energy included.</div>
          </div>
        </section>

        <section id="about" className="section-shell about-section section">
          <div className="section-heading reveal">
            <p className="eyebrow">about</p>
            <h2>Just enough to get the idea.</h2>
          </div>
          <div className="about-grid">
            <div className="paper-card intro-card reveal">
              <p>
                I like making things, taking them apart, trying the weird idea, and seeing what happens. I’m especially into AI, creative technology, design and little experiments that turn into real projects.
              </p>
            </div>
            <div className="paper-card education-card reveal">
              <span className="small-label">right now</span>
              <h3>LUCKNOW CHRISTIAN COLLEGE</h3>
              <p>Class 12 · Uttar Pradesh Board</p>
              <span className="scribble">expected 2027 ↗</span>
            </div>
          </div>
        </section>

        <section id="projects" className="section-shell section">
          <div className="section-heading reveal">
            <p className="eyebrow">projects</p>
            <h2>Things I built because I wanted to see if I could.</h2>
          </div>
          <div className="project-grid">
            {projects.map((p, i) => (
              <article className={`project-card reveal ${p.accent}`} key={p.title} style={{'--delay': `${i*80}ms`}}>
                <div className="project-top">
                  <span className="project-label">{p.label}</span>
                  <span className="project-index">0{i+1}</span>
                </div>
                <div className="project-art" aria-hidden="true">
                  {p.accent === 'paper' && <><span className="shape shape-a"/><span className="shape shape-b"/><span className="scribble-line">layout</span></>}
                  {p.accent === 'pixel' && <><div className="pixel-window"><span/><span/><span/><span/></div></>}
                  {p.accent === 'weather' && <><div className="weather-orbit"/><span className="weather-drop">☁</span></>}
                </div>
                <h3>{p.title}</h3>
                <p className="what"><strong>what:</strong> {p.what}</p>
                <p><strong>why:</strong> {p.why}</p>
                <p><strong>learned:</strong> {p.learned}</p>
                <div className="project-links">
                  <a href={p.github} target="_blank" rel="noreferrer">GitHub ↗</a>
                  {p.demo && <a href={p.demo} target="_blank" rel="noreferrer">Live demo ↗</a>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="section-shell section skills-section">
          <div className="section-heading reveal">
            <p className="eyebrow">skills</p>
            <h2>How I tend to work.</h2>
          </div>
          <div className="skill-constellation reveal">
            {[
              ['Fast learner','keep moving'],['Team worker','better together'],['Problem solver','find the route'],['Writer','make the idea clear'],
              ['Communicator','say what matters'],['Extrovert','curious out loud'],['Adaptive','change the plan'],['Creative','try another angle'],['Design','make it feel right'],['Experimental','break the pattern'],['Curious','ask why'],['AI enthusiast','always exploring']
            ].map(([name, sub], i) => (
              <div key={name} className={`skill-card skill-${i%6}`}><strong>{name}</strong><span>{sub}</span></div>
            ))}
            <div className="skill-center"><span>me</span><small>still figuring it out</small></div>
          </div>
        </section>

        <section id="things-ive-done" className="section-shell section">
          <div className="section-heading reveal">
            <p className="eyebrow">things i’ve done</p>
            <h2>A few pages from the notebook.</h2>
          </div>
          <div className="timeline scrapbook">
            {things.map((t, i) => (
              <div className="timeline-item reveal" key={i}>
                <div className="timeline-dot" />
                <span className="timeline-date">{t.date}</span>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="certifications" className="section-shell section">
          <div className="section-heading reveal">
            <p className="eyebrow">certifications</p>
            <h2>Little receipts that say I kept learning.</h2>
          </div>
          <div className="cert-grid">
            {certificates.map((c, i) => (
              <button className="cert-card reveal" style={{'--rot': `${[-1.2,1.1,-0.7][i]}deg`}} key={c.title} onClick={() => setActiveCert(c)}>
                <div className="cert-paper">
                  <div className="cert-scan"><iframe title={c.title} src={c.file} /></div>
                  <div className="cert-info">
                    <span>{c.org}</span>
                    <h3>{c.title}</h3>
                    <p>{c.date} · click to view</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="interests" className="section-shell section interests-section">
          <div className="section-heading reveal">
            <p className="eyebrow">interests</p>
            <h2>A coffee menu, basically.</h2>
          </div>
          <div className="interest-stage reveal">
            <div className="menu-card">
              <p className="menu-kicker">order for arshil</p>
              <div className="menu-lines">
                <div><span>01</span><strong>AI & technology</strong><em>always curious</em></div>
                <div><span>02</span><strong>design & drawing</strong><em>make it feel right</em></div>
                <div><span>03</span><strong>football / anime / music</strong><em>off-screen mode</em></div>
                <div><span>04</span><strong>Japanese & open science</strong><em>learning something new</em></div>
              </div>
            </div>
            <div className="floating-tags">
              {interests.map((item, i) => <span key={item} style={{'--i': i}}>{item}</span>)}
            </div>
          </div>
        </section>

        <section id="contact" className="section-shell section contact-section">
          <div className="contact-card reveal">
            <div>
              <p className="eyebrow">contact</p>
              <h2>Let’s talk.<br/><em>Maybe over coffee.</em></h2>
              <p>Have an idea, a project, or just something interesting to share?</p>
            </div>
            <div className="contact-actions">
              <a className="btn primary" href="mailto:arshilaehmad.2000@gmail.com">Email me ↗</a>
              <a className="social-link" href="https://github.com/Coderarshil" target="_blank" rel="noreferrer">GitHub</a>
              <a className="social-link" href="https://instagram.com/arshil7474" target="_blank" rel="noreferrer">Instagram</a>
              <a className="social-link" href="https://www.linkedin.com/in/mohammad-arshil-siddiqui-0121132a5" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </section>
      </main>

      {showGame && <TicTacToe onClose={() => setShowGame(false)} />}

      {activeCert && (
        <div className="modal-backdrop" onClick={() => setActiveCert(null)}>
          <div className="cert-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveCert(null)} aria-label="Close certificate">×</button>
            <div className="cert-modal-head"><span>{activeCert.org}</span><h3>{activeCert.title}</h3><p>{activeCert.date}</p></div>
            <iframe title={activeCert.title + ' certificate'} src={activeCert.file} />
          </div>
        </div>
      )}

      <footer className="site-footer">
        <div className="footer-hand">Made with curiosity, experiments & a little too much coffee.</div>
        <div className="footer-sub">© {new Date().getFullYear()} Mohammad Arshil Siddiqui</div>
      </footer>

      <MobileNav />
    </div>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="mobile-nav">
        <a href="#home">⌂<span>Home</span></a>
        <a href="#about">◌<span>About</span></a>
        <button onClick={() => setOpen(v => !v)} className="mobile-coffee" aria-label="Open navigation">☕</button>
        <a href="#projects">▦<span>Projects</span></a>
        <a href="#contact">✉<span>Contact</span></a>
      </div>
      {open && <div className="mobile-more" onClick={() => setOpen(false)}>
        <div className="mobile-more-card" onClick={e => e.stopPropagation()}>
          {['Skills','Things I’ve Done','Certifications','Interests'].map(item => <a key={item} href={'#'+item.toLowerCase().replaceAll(' ','-').replaceAll('’','')} onClick={() => setOpen(false)}>{item}</a>)}
        </div>
      </div>}
    </>
  );
}

function TicTacToe({onClose}) {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [turn, setTurn] = useState('X');
  const [winner, setWinner] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const check = b => wins.find(([a,c,d]) => b[a] && b[a]===b[c] && b[a]===b[d]);
  const reset = () => { setBoard(Array(9).fill('')); setTurn('X'); setWinner(''); };
  const move = i => {
    if (board[i] || winner) return;
    const next = [...board]; next[i] = turn;
    if (check(next)) setWinner(turn);
    else if (next.every(Boolean)) setWinner('draw');
    else setTurn(turn === 'X' ? 'O' : 'X');
    setBoard(next);
  };

  return <div className={`ttt-note ${collapsed ? 'collapsed' : ''}`}>
    <button className="ttt-pin" onClick={() => setCollapsed(v => !v)}>✦</button>
    {collapsed ? <button className="ttt-collapsed" onClick={() => setCollapsed(false)}>tiny experiment →</button> : <>
      <div className="ttt-top"><span>I like experimenting. Here’s a tiny one.</span><button onClick={onClose} aria-label="Close game">×</button></div>
      <h3>Take a break.<br/>Challenge me.</h3>
      <div className="ttt-board">{board.map((v,i)=><button key={i} onClick={()=>move(i)} aria-label={`Cell ${i+1}`}>{v}</button>)}</div>
      <div className="ttt-status">{winner ? (winner==='draw' ? 'draw — again?' : `${winner} wins ☕`) : `${turn} to move`}</div>
      <div className="ttt-controls"><button onClick={reset}>again</button><button onClick={onClose}>close</button></div>
    </>}
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
