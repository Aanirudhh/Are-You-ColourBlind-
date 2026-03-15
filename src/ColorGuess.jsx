import { useState, useEffect, useRef } from "react";
import { HslColorPicker } from "react-colorful";
import "./ColorGuess.css";

// ── only math we still need: scoring ─────────────────────────────────────────
function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0)*255), Math.round(f(8)*255), Math.round(f(4)*255)];
}

function colorDist(c1, c2) {
  const [r1,g1,b1] = hslToRgb(c1.h, c1.s, c1.l);
  const [r2,g2,b2] = hslToRgb(c2.h, c2.s, c2.l);
  return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
}
const MAX_DIST = Math.sqrt(3 * 255 * 255);     

function hslToCss({ h, s, l }) {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

function randomHSL() {
  return {
    h: Math.round(Math.random() * 360),
    s: Math.round(30 + Math.random() * 70),
    l: Math.round(25 + Math.random() * 50),
  };
}

function scoreMessage(s) {
  if (s >= 95) return "Perfect eyes, I think you can solve the blue/golden color dress mytery";
  if (s >= 80) return "Thats pretty good , not colorblind ";
  if (s >= 65) return "Not so bad AIs, hahahahah, but you need to try it again";
  if (s < 65) return "You might be colorblind, wanna try again :) ?";
  //return "Keep practicing!";
}

const MEMORIZE_SECS = 5;

// ── component ─────────────────────────────────────────────────────────────────
export default function ColorGuess() {
  const [phase, setPhase] = useState("memorize");
  const [target, setTarget] = useState(randomHSL());
  const [picker, setPicker] = useState({ h: 180, s: 50, l: 50 });
  const [timeLeft, setTimeLeft] = useState(MEMORIZE_SECS);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  function startGame() {
    clearInterval(timerRef.current);
    setTarget(randomHSL());
    setPicker({ h: 180, s: 50, l: 50 });
    setResult(null);
    setPhase("memorize");
    setTimeLeft(MEMORIZE_SECS);
    let rem = MEMORIZE_SECS;
    timerRef.current = setInterval(() => {
      rem -= 1;
      setTimeLeft(rem);
      if (rem <= 0) { clearInterval(timerRef.current); setPhase("guess"); }
    }, 1000);
  }

  function submitGuess() {
    const score = Math.round((1 - colorDist(target, picker) / MAX_DIST) * 100);
    setResult({ score });
    setPhase("result");
  }

  useEffect(() => { startGame(); return () => clearInterval(timerRef.current); }, []);

  const scoreColor = result
    ? result.score >= 80 ? "#1D9E75" : result.score >= 60 ? "#BA7517" : "#D85A30"
    : "#888";

  // ── memorize ──
  if (phase === "memorize") {
    return (
      <div className="cg-fullscreen" style={{ background: hslToCss(target) }}>
        <div className="cg-fullscreen-overlay">
          <p className="cg-fullscreen-countdown">{timeLeft}</p>
          <div className="cg-timer-track">
            <div className="cg-timer-fill" style={{ width: `${(timeLeft / MEMORIZE_SECS) * 100}%` }} />
          </div>
          <p className="cg-fullscreen-hint">Remember this color</p>
        </div>
      </div>
    );
  }

  // ── guess ──
  if (phase === "guess") {
    return (
      <div className="cg-guess-layout" style={{ background: hslToCss(picker) }}>
        <div className="cg-palette-panel">
          <p className="cg-panel-label">Pick the color</p>
          <HslColorPicker color={picker} onChange={setPicker} />
          <div className="cg-panel-footer">
            <div className="cg-your-pick-swatch" style={{ background: hslToCss(picker) }} />
            <span className="cg-your-pick-label">Your pick</span>
            <button className="cg-btn" onClick={submitGuess}>Submit</button>
          </div>
        </div>
      </div>
    );
  }

  // ── result ──
  return (
    <div className="cg-fullscreen" style={{ background: hslToCss(picker) }}>
      <div className="cg-result-overlay">
        <div className="cg-result-swatches">
          <div className="cg-result-swatch-col">
            <div className="cg-result-swatch-col-label">Target</div>
            <div className="cg-result-swatch" style={{ background: hslToCss(target) }} />
          </div>
          <div className="cg-result-swatch-col">
            <div className="cg-result-swatch-col-label">Your pick</div>
            <div className="cg-result-swatch" style={{ background: hslToCss(picker) }} />
          </div>
        </div>
        <div className="cg-score-num" style={{ color: scoreColor }}>{result.score}%</div>
        <div className="cg-score-msg">{scoreMessage(result.score)}</div>
        <button className="cg-btn cg-btn--light" onClick={startGame}>Play again</button>
      </div>
    </div>
  );
}
