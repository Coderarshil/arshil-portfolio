import React, { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

// ─── Types ────────────────────────────────────────────────────────────────────
type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[];
type Difficulty = "easy" | "medium" | "hard";
type GameMode = "vs-ai" | "vs-player";
type Screen = "setup" | "game";

// ─── Dark Mode Hook ───────────────────────────────────────────────────────────
function useIsDark() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("espresso-mode")
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("espresso-mode"))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

// ─── Palettes ─────────────────────────────────────────────────────────────────
const LIGHT = {
  easy:   { bg: "#daefc5", txt: "#38601f", brd: "#bcd9a5", sh: "rgba(56,96,31,0.2)",   icon: "🌿", label: "Easy" },
  medium: { bg: "#fef5c2", txt: "#78591a", brd: "#ecd97e", sh: "rgba(120,89,26,0.2)",  icon: "☕", label: "Medium" },
  hard:   { bg: "#fde4ef", txt: "#8a2150", brd: "#f2accb", sh: "rgba(138,33,80,0.2)",  icon: "🔥", label: "Hard" },
};
const DARK = {
  easy:   { bg: "#1a2e12", txt: "#8aba78", brd: "#2b4820", sh: "rgba(138,186,120,0.18)", icon: "🌿", label: "Easy" },
  medium: { bg: "#2a1e06", txt: "#c8952a", brd: "#473410", sh: "rgba(200,149,42,0.18)",  icon: "☕", label: "Medium" },
  hard:   { bg: "#1e1030", txt: "#a87ec8", brd: "#362055", sh: "rgba(168,126,200,0.18)", icon: "🔥", label: "Hard" },
};

// ─── Win / Message Data ───────────────────────────────────────────────────────
const WIN_M  = ["Nice move.", "Clean win.", "The barista noticed.", "Well played.", "Lucky shot."];
const LOSE_M = ["That was rough.", "Try again?", "The barista saw that.", "Spilled your coffee."];
const DRAW_M = ["Both coffees got cold.", "A peaceful draw.", "Nobody wins today.", "Cozy stalemate."];
const pick   = (a: string[]) => a[Math.floor(Math.random() * a.length)];

// ─── Game Logic ───────────────────────────────────────────────────────────────
const WIN_COMBOS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function checkWinner(b: Board): Player | "draw" | null {
  for (const [a, c, d] of WIN_COMBOS) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a] as Player;
  }
  return b.every(Boolean) ? "draw" : null;
}

function getWinCombo(b: Board): number[] | null {
  for (const combo of WIN_COMBOS) {
    const [a, c, d] = combo;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return combo;
  }
  return null;
}

// Alpha-beta pruning (Hard AI)
function alphaBeta(b: Board, maxing: boolean, depth: number, alpha: number, beta: number): number {
  const w = checkWinner(b);
  if (w === "O") return 10 - depth;
  if (w === "X") return depth - 10;
  if (w === "draw") return 0;
  const moves = b.reduce<number[]>((a, v, i) => (v ? a : [...a, i]), []);
  if (!moves.length) return 0;
  if (maxing) {
    for (const i of moves) {
      b[i] = "O";
      const val = alphaBeta(b, false, depth + 1, alpha, beta);
      b[i] = null;
      if (val > alpha) alpha = val;
      if (beta <= alpha) break;
    }
    return alpha;
  } else {
    for (const i of moves) {
      b[i] = "X";
      const val = alphaBeta(b, true, depth + 1, alpha, beta);
      b[i] = null;
      if (val < beta) beta = val;
      if (beta <= alpha) break;
    }
    return beta;
  }
}

function getAI(b: Board, d: Difficulty): number {
  const empties = b.reduce<number[]>((a, v, i) => (v ? a : [...a, i]), []);
  if (d === "easy") return empties[Math.floor(Math.random() * empties.length)];
  if (d === "medium") {
    for (const i of empties) { const t = [...b]; t[i] = "O"; if (checkWinner(t) === "O") return i; }
    for (const i of empties) { const t = [...b]; t[i] = "X"; if (checkWinner(t) === "X") return i; }
    if (!b[4]) return 4;
    const corners = [0,2,6,8].filter(i => !b[i]);
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
    return empties[Math.floor(Math.random() * empties.length)];
  }
  // Hard: alpha-beta
  const copy = [...b];
  let best = -Infinity, move = empties[0];
  for (const i of empties) {
    copy[i] = "O";
    const val = alphaBeta(copy, false, 0, -Infinity, Infinity);
    copy[i] = null;
    if (val > best) { best = val; move = i; }
  }
  return move;
}

// ─── Sound Engine ─────────────────────────────────────────────────────────────
function useSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  };

  return useCallback((type: "move" | "win" | "draw" | "open" | "close" | "pin") => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;
      const out = ctx.destination;
      if (type === "move") {
        const sz = Math.floor(ctx.sampleRate * 0.07);
        const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < sz; i++) d[i] = (Math.random()*2-1) * Math.pow(1-i/sz, 2.5);
        const src = ctx.createBufferSource(); src.buffer = buf;
        const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 3200; f.Q.value = 1.1;
        const g = ctx.createGain(); g.gain.setValueAtTime(0.14, now);
        src.connect(f); f.connect(g); g.connect(out); src.start();
      } else if (type === "win") {
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = freq;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0, now + i*0.08);
          g.gain.linearRampToValueAtTime(0.09, now + i*0.08 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, now + i*0.08 + 0.32);
          o.connect(g); g.connect(out);
          o.start(now + i*0.08); o.stop(now + i*0.08 + 0.34);
        });
      } else if (type === "draw") {
        const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = 440;
        const g = ctx.createGain(); g.gain.setValueAtTime(0.07, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        o.connect(g); g.connect(out); o.start(); o.stop(now + 0.42);
      } else if (type === "open") {
        const sz = Math.floor(ctx.sampleRate * 0.16);
        const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < sz; i++) d[i] = (Math.random()*2-1)*Math.sin((i/sz)*Math.PI)*0.3;
        const src = ctx.createBufferSource(); src.buffer = buf;
        const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 900;
        const g = ctx.createGain(); g.gain.setValueAtTime(0.08, now);
        src.connect(f); f.connect(g); g.connect(out); src.start();
      } else if (type === "close") {
        const o = ctx.createOscillator(); o.type = "sine";
        o.frequency.setValueAtTime(440, now);
        o.frequency.linearRampToValueAtTime(280, now + 0.22);
        const g = ctx.createGain(); g.gain.setValueAtTime(0.07, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        o.connect(g); g.connect(out); o.start(); o.stop(now + 0.26);
      } else if (type === "pin") {
        const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = 880;
        const g = ctx.createGain(); g.gain.setValueAtTime(0.1, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        o.connect(g); g.connect(out); o.start(); o.stop(now + 0.08);
      }
    } catch {}
  }, [enabled]);
}

// ─── SVG Components ───────────────────────────────────────────────────────────
const GRID = [
  "M 54.3,4 C 53.8,22 54.6,40 54.0,57 C 54.4,71 53.7,92 54.1,108 C 53.9,123 54.5,141 54,158",
  "M 107.7,4 C 108.2,22 107.4,40 108.0,57 C 107.6,71 108.3,92 107.9,108 C 108.1,123 107.5,141 108,158",
  "M 4,54.3 C 22,53.8 40,54.6 57,54.0 C 71,54.4 92,53.7 108,54.1 C 123,53.9 141,54.5 158,54",
  "M 4,107.7 C 22,108.2 40,107.4 57,108.0 C 71,107.6 92,108.3 108,107.9 C 123,108.1 141,107.5 158,108",
];

function SoundToggle({ on, onToggle, color }: { on: boolean; onToggle: () => void; color: string }) {
  return (
    <button
      data-nodrag="true"
      onClick={onToggle}
      title={on ? "Mute" : "Unmute"}
      style={{
        background: "none", border: "none", padding: 4, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: 0.55, transition: "opacity 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "0.55")}
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        {/* Speaker body — hand-drawn trapezoid */}
        <path d="M1.5,5 L1.5,10 L4.5,10 L8,12.5 L8,2.5 L4.5,5 Z"
          stroke={color} strokeWidth="1.1" strokeLinejoin="round" />
        {on ? (
          <>
            <path d="M10,5.5 C11.2,6.4 11.2,8.6 10,9.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none"
              style={{ strokeDasharray: 6, strokeDashoffset: 0, transition: "stroke-dashoffset 0.2s ease" }} />
            <path d="M11.8,3.8 C13.8,5.1 13.8,9.9 11.8,11.2" stroke={color} strokeWidth="1.1" strokeLinecap="round" fill="none"
              style={{ strokeDasharray: 10, strokeDashoffset: 0, transition: "stroke-dashoffset 0.2s ease" }} />
          </>
        ) : (
          <>
            <line x1="10.5" y1="5.5" x2="13.5" y2="9.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
            <line x1="13.5" y1="5.5" x2="10.5" y2="9.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
          </>
        )}
      </svg>
    </button>
  );
}

function ThumbPin({ up }: { up: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
      transform: `translateY(${up ? -8 : 0}px) rotate(${up ? -6 : 0}deg)`,
      transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%",
        background: "radial-gradient(circle at 38% 32%, #ff7878 0%, #d32f2f 55%, #911 100%)",
        boxShadow: "0 3px 9px rgba(200,50,50,0.5), inset 0 1px 3px rgba(255,220,220,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <line x1="2" y1="2" x2="6" y2="6" stroke="rgba(0,0,0,0.38)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="6" y1="2" x2="2" y2="6" stroke="rgba(0,0,0,0.38)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ width: 2, height: 9, background: "linear-gradient(#aaa,#777)", borderRadius: "0 0 2px 2px" }} />
    </div>
  );
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────
function SetupScreen({
  difficulty, setDifficulty, mode, setMode, onStart, colors, isDark, stats,
}: {
  difficulty: Difficulty; setDifficulty: (d: Difficulty) => void;
  mode: GameMode; setMode: (m: GameMode) => void;
  onStart: () => void; colors: typeof LIGHT.easy; isDark: boolean;
  stats: { wins: number; losses: number; draws: number };
}) {
  const palette = isDark ? DARK : LIGHT;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 10, color: colors.txt, opacity: 0.45, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 3 }}>
          a tiny desk distraction
        </div>
        <div style={{ fontSize: 23, color: colors.txt, fontWeight: 700, lineHeight: 1.1 }}>
          Tic-Tac-Toe?
        </div>
        {(stats.wins + stats.losses + stats.draws) > 0 && (
          <div style={{ fontSize: 10, color: colors.txt, opacity: 0.32, marginTop: 2 }}>
            {stats.wins}W · {stats.losses}L · {stats.draws}D
          </div>
        )}
      </div>

      {/* Difficulty */}
      <div>
        <div style={{ fontSize: 9, color: colors.txt, opacity: 0.42, textAlign: "center", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5 }}>
          difficulty
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {(["easy", "medium", "hard"] as Difficulty[]).map(d => {
            const c = palette[d];
            const active = difficulty === d;
            return (
              <button key={d} data-nodrag="true" onClick={() => setDifficulty(d)}
                style={{
                  flex: 1, padding: "6px 2px", borderRadius: 3,
                  background: active ? c.bg : `${c.bg}66`,
                  border: `1.5px solid ${active ? c.txt : c.brd}`,
                  color: c.txt, fontSize: 11,
                  fontFamily: "'Caveat', cursive",
                  cursor: "pointer", fontWeight: active ? 700 : 400,
                  transform: active ? "scale(1.06) rotate(-0.4deg)" : "scale(1)",
                  transition: "all 0.16s ease",
                  boxShadow: active ? `0 2px 8px ${c.sh}` : "none",
                  lineHeight: 1.5,
                }}>
                {c.icon}<br />{c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode */}
      <div>
        <div style={{ fontSize: 9, color: colors.txt, opacity: 0.42, textAlign: "center", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5 }}>
          mode
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {([["vs-ai", "🤖 vs AI"], ["vs-player", "👥 2 players"]] as [GameMode, string][]).map(([m, label]) => (
            <button key={m} data-nodrag="true" onClick={() => setMode(m)}
              style={{
                flex: 1, padding: "6px 3px", borderRadius: 3,
                background: mode === m ? `${colors.txt}18` : "transparent",
                border: `1.5px solid ${mode === m ? colors.txt : colors.brd}`,
                color: colors.txt, fontSize: 11,
                fontFamily: "'Caveat', cursive",
                cursor: "pointer", fontWeight: mode === m ? 700 : 400,
                transition: "all 0.16s ease",
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <button data-nodrag="true" onClick={onStart}
        style={{
          padding: "9px 0", borderRadius: 3,
          background: colors.txt, color: colors.bg,
          border: "none", fontFamily: "'Caveat', cursive",
          fontSize: 17, fontWeight: 700, cursor: "pointer",
          boxShadow: `0 3px 12px ${colors.sh}`,
          transition: "opacity 0.15s",
          letterSpacing: "0.01em",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.86")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        Let's play →
      </button>
    </div>
  );
}

// ─── Game Board ───────────────────────────────────────────────────────────────
function GameBoard({
  board, winner, winCombo, onCell, aiThinking, turn, mode, difficulty, msg, colors, onReset, onBack,
}: {
  board: Board; winner: Player | "draw" | null; winCombo: number[] | null;
  onCell: (i: number) => void; aiThinking: boolean; turn: Player;
  mode: GameMode; difficulty: Difficulty; msg: string;
  colors: typeof LIGHT.easy; onReset: () => void; onBack: () => void;
}) {
  const [gridReady, setGridReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGridReady(true), 50); return () => clearTimeout(t); }, []);

  const winLine = winCombo ? (() => {
    const [a, , c] = winCombo;
    return {
      x1: (a%3)*54+27, y1: Math.floor(a/3)*54+27,
      x2: (c%3)*54+27, y2: Math.floor(c/3)*54+27,
    };
  })() : null;

  const status = winner
    ? msg
    : aiThinking ? "thinking…"
    : mode === "vs-ai" ? "your turn"
    : `${turn}'s turn`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{
        fontSize: winner ? 14 : 12, color: colors.txt,
        fontWeight: winner ? 700 : 400, textAlign: "center", minHeight: 20, lineHeight: 1.4,
        transition: "font-size 0.18s ease",
      }}>
        {status}
      </div>

      <div data-nodrag="true">
        <svg width="162" height="162" viewBox="0 0 162 162" style={{ display: "block" }}>
          {/* Wobbly grid lines — draw in on mount */}
          <g stroke={colors.txt} strokeWidth="1.7" fill="none" strokeLinecap="round">
            {GRID.map((d, i) => (
              <path key={i} d={d} style={{
                strokeDasharray: 180,
                strokeDashoffset: gridReady ? 0 : 180,
                opacity: gridReady ? 0.38 : 0,
                transition: `stroke-dashoffset 0.5s ease ${i*0.09}s, opacity 0.3s ease ${i*0.09}s`,
              }} />
            ))}
          </g>

          {/* Cells */}
          {board.map((cell, idx) => {
            const col = idx % 3, row = Math.floor(idx / 3);
            const cx = col*54+27, cy = row*54+27;
            const inWin = winCombo?.includes(idx);
            return (
              <g key={idx} onClick={() => !winner && !board[idx] && !aiThinking && onCell(idx)}
                style={{ cursor: board[idx] || winner || aiThinking ? "default" : "pointer" }}>
                <rect x={col*54+2} y={row*54+2} width={50} height={50} fill="transparent" />
                {inWin && (
                  <rect x={col*54+5} y={row*54+5} width={44} height={44}
                    fill={`${colors.txt}0f`} rx={2}
                    style={{ animation: "ttt-fadeIn 0.3s ease" }} />
                )}
                {cell === "X" && (
                  <g opacity={inWin ? 1 : 0.85}>
                    <line x1={cx-14} y1={cy-14} x2={cx+14} y2={cy+14}
                      stroke={colors.txt} strokeWidth="2.5" strokeLinecap="round"
                      style={{ strokeDasharray: 40, strokeDashoffset: 40, animation: "ttt-draw 0.25s ease-out both" }} />
                    <line x1={cx+14} y1={cy-14} x2={cx-14} y2={cy+14}
                      stroke={colors.txt} strokeWidth="2.5" strokeLinecap="round"
                      style={{ strokeDasharray: 40, strokeDashoffset: 40, animation: "ttt-draw 0.25s ease-out 0.1s both" }} />
                  </g>
                )}
                {cell === "O" && (
                  <circle cx={cx} cy={cy} r={15}
                    stroke={colors.txt} strokeWidth="2.5" fill="none" strokeLinecap="round"
                    opacity={inWin ? 1 : 0.85}
                    style={{ strokeDasharray: 95, strokeDashoffset: 95, animation: "ttt-draw 0.38s ease-out both" }} />
                )}
              </g>
            );
          })}

          {/* Win strike-through */}
          {winLine && (
            <line x1={winLine.x1} y1={winLine.y1} x2={winLine.x2} y2={winLine.y2}
              stroke={colors.txt} strokeWidth="2.2" strokeLinecap="round" opacity={0.32}
              style={{ strokeDasharray: 200, strokeDashoffset: 200, animation: "ttt-strike 0.4s ease-out 0.18s forwards" }} />
          )}
        </svg>
      </div>

      {/* Keyboard hint */}
      <div style={{ fontSize: 9, color: colors.txt, opacity: 0.28, letterSpacing: "0.04em" }}>
        1–9 also works
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 5, width: "100%" }}>
        {[["again", onReset], ["← menu", onBack]].map(([label, action]) => (
          <button key={label as string} data-nodrag="true" onClick={action as () => void}
            style={{
              flex: 1, padding: "6px 0", borderRadius: 3,
              background: "transparent", border: `1.5px solid ${colors.brd}`,
              color: colors.txt, fontSize: 12, fontFamily: "'Caveat', cursive",
              cursor: "pointer", opacity: 0.7, transition: "opacity 0.14s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "0.7")}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 9, color: colors.txt, opacity: 0.3, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {(isDark => isDark ? DARK : LIGHT)(document.documentElement.classList.contains("espresso-mode"))[difficulty].icon}{" "}
        {difficulty} · {mode === "vs-ai" ? "vs computer" : "2 players"}
      </div>
    </div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────
export interface TicTacToeWidgetProps { onClose: () => void; }

export function TicTacToeWidget({ onClose }: TicTacToeWidgetProps) {
  const isDark = useIsDark();
  const palette = isDark ? DARK : LIGHT;

  // Game state
  const [screen, setScreen]         = useState<Screen>("setup");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [mode, setMode]             = useState<GameMode>("vs-ai");
  const [board, setBoard]           = useState<Board>(Array(9).fill(null));
  const [turn, setTurn]             = useState<Player>("X");
  const [winner, setWinner]         = useState<Player | "draw" | null>(null);
  const [winCombo, setWinCombo]     = useState<number[] | null>(null);
  const [msg, setMsg]               = useState("");
  const [aiThinking, setAIThinking] = useState(false);
  const [soundOn, setSoundOn]       = useState(true);
  const [stats, setStats]           = useState<{wins:number,losses:number,draws:number}>(() => {
    try { return JSON.parse(localStorage.getItem("ttt-stats") || '{"wins":0,"losses":0,"draws":0}'); }
    catch { return {wins:0,losses:0,draws:0}; }
  });

  const colors = palette[difficulty];
  const play   = useSound(soundOn);

  // Drag state
  const initPos = () => ({
    x: Math.max(8, window.innerWidth  - 224),
    y: Math.max(8, window.innerHeight - 420),
  });
  const [pos, setPos]         = useState(initPos);
  const [dragging, setDragging] = useState(false);
  const [rot, setRot]           = useState(-1.5);
  const [pinUp, setPinUp]       = useState(false);
  const [closing, setClosing]   = useState(false);
  const [mounted, setMounted]   = useState(false);
  const dragOff  = useRef({ x: 0, y: 0 });
  const prevPos  = useRef(initPos());
  const aiTimer  = useRef<ReturnType<typeof setTimeout>>();

  // Unfold on mount
  useEffect(() => {
    play("open");
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Drag
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-nodrag]")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true); setPinUp(true);
    dragOff.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    prevPos.current = pos;
  }, [pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const nx = e.clientX - dragOff.current.x;
    const ny = e.clientY - dragOff.current.y;
    const vx = nx - prevPos.current.x;
    prevPos.current = { x: nx, y: ny };
    setPos({ x: nx, y: ny });
    setRot(Math.max(-14, Math.min(14, vx * 0.7)));
  }, [dragging]);

  const onPointerUp = useCallback(() => {
    setDragging(false); setPinUp(false); setRot(-1.5);
  }, []);

  // Close
  const doClose = useCallback(() => {
    play("close");
    setClosing(true);
    setTimeout(onClose, 420);
  }, [onClose, play]);

  // Pin click
  const onPinClick = useCallback(() => {
    play("pin");
    doClose();
  }, [play, doClose]);

  // Apply move
  const applyMove = useCallback((b: Board, idx: number, player: Player) => {
    const nb = [...b]; nb[idx] = player;
    setBoard(nb);
    const w = checkWinner(nb);
    if (w) {
      setWinner(w);
      if (w !== "draw") setWinCombo(getWinCombo(nb));
      if (w === "draw")          { setMsg(pick(DRAW_M)); play("draw"); }
      else if (mode === "vs-ai") { setMsg(w === "X" ? pick(WIN_M) : pick(LOSE_M)); play("win"); }
      else                       { setMsg(`${w} wins — ${pick(WIN_M)}`); play("win"); }
      // Stats (only vs-ai)
      if (mode === "vs-ai") {
        setStats(prev => {
          const next = { ...prev };
          if (w === "draw") next.draws++;
          else if (w === "X") next.wins++;
          else next.losses++;
          localStorage.setItem("ttt-stats", JSON.stringify(next));
          return next;
        });
      }
      return true;
    }
    return false;
  }, [mode, play]);

  const handleCell = useCallback((idx: number) => {
    if (board[idx] || winner || aiThinking) return;
    play("move");
    const over = applyMove(board, idx, turn);
    if (!over) {
      if (mode === "vs-ai") setAIThinking(true);
      else setTurn(t => t === "X" ? "O" : "X");
    }
  }, [board, winner, aiThinking, turn, mode, applyMove, play]);

  // AI
  useEffect(() => {
    if (!aiThinking || winner) return;
    aiTimer.current = setTimeout(() => {
      const move = getAI(board, difficulty);
      play("move");
      const over = applyMove(board, move, "O");
      if (!over) setTurn("X");
      setAIThinking(false);
    }, 320 + Math.random() * 260);
    return () => clearTimeout(aiTimer.current);
  }, [aiThinking, board, difficulty, winner, applyMove, play]);

  // Keyboard
  useEffect(() => {
    if (screen !== "game") return;
    const handler = (e: KeyboardEvent) => {
      const n = parseInt(e.key);
      if (n >= 1 && n <= 9) handleCell(n - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, handleCell]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null)); setTurn("X");
    setWinner(null); setWinCombo(null); setMsg(""); setAIThinking(false);
  }, []);

  const startGame = useCallback(() => { resetGame(); setScreen("game"); }, [resetGame]);

  // Clamped position
  const cx = Math.max(0, Math.min(pos.x, window.innerWidth  - 212));
  const cy = Math.max(0, Math.min(pos.y, window.innerHeight - 350));

  return createPortal(
    <>
      <style>{`
        @keyframes ttt-draw    { to { stroke-dashoffset: 0; } }
        @keyframes ttt-strike  { to { stroke-dashoffset: 0; } }
        @keyframes ttt-fadeIn  { from { opacity:0 } to { opacity:1 } }
      `}</style>

      {/* Outer: handles position, unfold, close animation */}
      <div
        style={{
          position: "fixed", left: cx, top: cy, zIndex: 9999,
          transformOrigin: "top center",
          transform: `scaleY(${mounted && !closing ? 1 : 0}) translateY(${closing ? "-12px" : "0"})`,
          opacity: mounted && !closing ? 1 : 0,
          transition: dragging ? "none" : `transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.38s ease`,
          userSelect: "none", touchAction: "none",
          fontFamily: "'Caveat', cursive",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Inner: handles drag tilt */}
        <div style={{
          transform: `rotate(${rot}deg) scale(${dragging ? 1.04 : 1})`,
          transition: dragging ? "none" : "transform 0.42s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          {/* Pin (centered above note) */}
          <div
            data-nodrag="true"
            onClick={onPinClick}
            title="Close"
            style={{
              position: "absolute", top: -12, left: "50%",
              transform: "translateX(-50%)",
              cursor: "pointer", zIndex: 10,
              display: "flex", flexDirection: "column", alignItems: "center",
            }}
          >
            <ThumbPin up={pinUp} />
          </div>

          {/* Sticky note */}
          <div style={{
            width: 210,
            background: `linear-gradient(148deg, ${colors.bg} 0%, ${colors.bg}f2 100%)`,
            borderRadius: "2px 2px 6px 6px",
            border: `1px solid ${colors.brd}`,
            boxShadow: dragging
              ? `0 24px 56px ${colors.sh}, 0 8px 20px rgba(0,0,0,0.12)`
              : `0 5px 22px ${colors.sh}, 0 2px 8px rgba(0,0,0,0.06)`,
            padding: "28px 14px 16px",
            position: "relative",
            transition: dragging ? "none" : "box-shadow 0.3s ease, background 0.35s ease, border-color 0.35s ease",
            clipPath: "polygon(0 0, 100% 0, 100% 93%, 87% 100%, 0 100%)",
          }}>
            {/* Sound toggle — top right */}
            <div
              data-nodrag="true"
              style={{ position: "absolute", top: 7, right: 8 }}
              onClick={() => setSoundOn(v => !v)}
            >
              <SoundToggle on={soundOn} onToggle={() => setSoundOn(v => !v)} color={colors.txt} />
            </div>

            {/* Paper corner curl */}
            <div style={{
              position: "absolute", bottom: 0, right: 0,
              width: 26, height: 26,
              background: `linear-gradient(225deg, ${colors.brd} 40%, transparent 62%)`,
              borderRadius: "4px 0 0 0", opacity: 0.55,
              pointerEvents: "none",
            }} />

            {screen === "setup" ? (
              <SetupScreen
                difficulty={difficulty} setDifficulty={setDifficulty}
                mode={mode} setMode={setMode}
                onStart={startGame} colors={colors} isDark={isDark} stats={stats}
              />
            ) : (
              <GameBoard
                board={board} winner={winner} winCombo={winCombo}
                onCell={handleCell} aiThinking={aiThinking} turn={turn}
                mode={mode} difficulty={difficulty} msg={msg} colors={colors}
                onReset={resetGame}
                onBack={() => { resetGame(); setScreen("setup"); }}
              />
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
