import React, { useState, useMemo } from "react";
import { Brain, RotateCcw, CheckCircle2, XCircle, ChevronLeft, HeartPulse, BookOpen, Share2, Activity } from "lucide-react";

/* ---------------------------------------------------------------
   TOKENS — same system as Modules 1–7.
----------------------------------------------------------------*/
const C = {
  bg: "var(--c-bg)", panel: "var(--c-panel)", panel2: "var(--c-panel2)", border: "var(--c-border)",
  text: "var(--c-text)", muted: "var(--c-muted)", faint: "var(--c-faint)",
  copper: "var(--c-copper)", copperDim: "var(--c-copper-dim)",
  artery: "var(--c-artery)", vein: "var(--c-vein)", capillary: "var(--c-capillary)",
  hormone: "var(--c-hormone)", good: "var(--c-good)", bad: "var(--c-bad)",
};
const mono = { fontFamily: "ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace" };

const TABS = [
  { id: "howto", label: "Reading a Concept Map", icon: BookOpen },
  { id: "map", label: "The Concept Map", icon: Share2 },
  { id: "walkthrough", label: "Numeric Walkthrough", icon: Activity },
  { id: "quiz", label: "Self-Test (خودآزمایی)", icon: Brain },
];

export default function CVSExerciseConceptMap() {
  const [tab, setTab] = useState("howto");
  return (
    <div dir="ltr" style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, Tahoma, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 3px; background: ${C.border}; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: ${C.copper}; cursor: pointer; border: 2px solid ${C.bg}; box-shadow: 0 0 0 1px ${C.copper}; }
        input[type=range]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: ${C.copper}; cursor: pointer; border: 2px solid ${C.bg}; }
      `}</style>

      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "18px 20px", background: C.panel }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <HeartPulse size={22} color={C.copper} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Cardiovascular Physiology — Module 8: Exercise, an Integrated Response</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
              Guyton Ch.21 — a Novak-style concept map tying Modules 1–7 into one network (نقشهٔ مفهومی یکپارچه)
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", overflowX: "auto", borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        {TABS.map(t => {
          const Icon = t.icon; const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 7, padding: "12px 16px", background: "transparent", border: "none",
              cursor: "pointer", color: active ? C.copper : C.muted,
              borderBottom: active ? `2px solid ${C.copper}` : "2px solid transparent",
              fontFamily: "inherit", fontSize: 13, fontWeight: active ? 700 : 500, whiteSpace: "nowrap", flexShrink: 0
            }}>
              <Icon size={16} />{t.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "18px 16px 60px", maxWidth: tab === "map" ? 1000 : 900, margin: "0 auto" }}>
        {tab === "howto" && <HowToTab />}
        {tab === "map" && <MapTab />}
        {tab === "walkthrough" && <WalkthroughTab />}
        {tab === "quiz" && <QuizTab />}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Shared UI
----------------------------------------------------------------*/
function Panel({ children, style }) {
  return <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, ...style }}>{children}</div>;
}
function Readout({ label, value, unit, color }) {
  return (
    <div style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", flex: 1, minWidth: 100 }}>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{label}</div>
      <div style={{ ...mono, fontSize: 20, fontWeight: 700, color: color || C.text }}>
        {value}<span style={{ fontSize: 12, color: C.muted, marginLeft: 3 }}>{unit}</span>
      </div>
    </div>
  );
}
function Slider({ label, value, min, max, step, onChange, display, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
        <span style={{ color: C.muted }}>{label}</span>
        <span style={{ ...mono, color: color || C.copper, fontWeight: 700 }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))} style={{ width: "100%" }} />
    </div>
  );
}
function SectionTitle({ children, icon: Icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10, fontSize: 13.5, fontWeight: 700 }}>
      {Icon && <Icon size={15} color={C.copper} />}{children}
    </div>
  );
}
function Note({ children }) {
  return <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 2, background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginTop: 10 }}>{children}</div>;
}
function toggleStyle(active) {
  return {
    padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12.5,
    border: `1px solid ${active ? C.copper : C.border}`,
    background: active ? C.copperDim : C.panel2,
    color: active ? "#fff" : C.text, fontWeight: active ? 700 : 500,
  };
}

/* ---------------------------------------------------------------
   TAB 0 — How to read a Novak concept map
----------------------------------------------------------------*/
function HowToTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={BookOpen}>Novak's Concept-Mapping Principles, Applied Here</SectionTitle>
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 2 }}>
          A concept map (Novak & Gowin) is not a flowchart of steps — it is a hierarchical network of
          <b style={{ color: C.text }}> propositions</b>: two concept boxes joined by a labeled linking phrase
          that together form a meaningful, readable statement (e.g., <i>"Sympathetic outflow — raises —
          contractility"</i>). Four structural rules were followed in building the map on the next tab:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
          <div style={{ padding: 10, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <b style={{ color: C.copper, fontSize: 12.5 }}>1. Hierarchy (general → specific)</b>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>The most inclusive concept ("Dynamic Exercise") sits at the top; each level down is progressively more specific, ending in concrete, measurable outcomes.</div>
          </div>
          <div style={{ padding: 10, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <b style={{ color: C.copper, fontSize: 12.5 }}>2. Labeled linking phrases</b>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Every arrow carries a verb/phrase (comprises, raises, lowers, permits...) — an unlabeled arrow is not a valid proposition in Novak's method, only a vague association.</div>
          </div>
          <div style={{ padding: 10, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <b style={{ color: C.copper, fontSize: 12.5 }}>3. Cross-links — the real payoff</b>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Dashed amber lines connect concepts from <i>different</i> branches (e.g., Module 6's neural branch to Module 3's cardiac branch). These are what distinguish a concept map from a simple hierarchy — they represent genuine integration across topics, and are usually the hardest, most valuable connections to identify.</div>
          </div>
          <div style={{ padding: 10, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <b style={{ color: C.copper, fontSize: 12.5 }}>4. Specific examples at the terminal nodes</b>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Pill-shaped nodes at the bottom are concrete instances (numbers, named events), not concepts themselves — Novak explicitly separates these from the concept hierarchy proper.</div>
          </div>
        </div>
      </Panel>
      <Panel>
        <Note>
          Suggested active-recall use: cover the map, and from memory try to regenerate as many propositions
          (box—linking phrase—box triples) as you can, especially the cross-links — this is a much stronger
          test of integrated understanding than simply re-reading the finished map, and is the study method
          Novak himself recommended for concept maps.
        </Note>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   TAB 1 — The concept map itself
   Redesigned: generous spacing, larger boxes, and — critically —
   NO text labels drawn on the canvas lines (that was the source of
   overlap). Every proposition is instead listed, fully readable,
   in the legend below the diagram, grouped by relationship type.
----------------------------------------------------------------*/
const NODES = [
  { id: "root", x: 450, y: 10, w: 240, h: 50, lines: ["DYNAMIC EXERCISE", "BEGINS"], style: "root" },
  { id: "central", x: 30, y: 110, w: 260, h: 60, lines: ["Central Command", "(cortical feedforward)"], style: "root" },
  { id: "demand", x: 850, y: 110, w: 260, h: 60, lines: ["↑ Skeletal Muscle", "Metabolic Demand"], style: "root" },

  { id: "neural", x: 20, y: 220, w: 250, h: 54, lines: ["NEURAL / AUTONOMIC", "CONTROL — Module 6"], style: "header", color: C.bad },
  { id: "local", x: 300, y: 220, w: 250, h: 54, lines: ["LOCAL VASCULAR", "CONTROL — Module 7"], style: "header", color: C.hormone },
  { id: "cardiac", x: 580, y: 220, w: 250, h: 54, lines: ["CARDIAC PUMP", "MECHANICS — Module 3"], style: "header", color: C.artery },
  { id: "venous", x: 860, y: 220, w: 250, h: 54, lines: ["VENOUS RETURN &", "ARTERIAL LOAD — Mod. 2/4"], style: "header", color: C.vein },

  { id: "baroreset", x: 20, y: 320, w: 250, h: 72, lines: ["Baroreceptor operating", "point resets upward", "during exercise"] },
  { id: "symp", x: 20, y: 436, w: 250, h: 72, lines: ["↑ Sympathetic outflow to", "heart & non-active", "vascular beds"] },

  { id: "metabolic", x: 300, y: 320, w: 250, h: 72, lines: ["Vasodilator metabolites", "accumulate in active", "muscle"] },
  { id: "recruit", x: 300, y: 436, w: 250, h: 72, lines: ["Capillary recruitment —", "more surface area open", "(Module 5)"] },

  { id: "contractility", x: 580, y: 320, w: 250, h: 72, lines: ["↑ Contractility", "(steeper ESPVR,", "Module 3)"] },
  { id: "hr", x: 580, y: 436, w: 250, h: 72, lines: ["↑ Heart Rate (SA node,", "sympathetic + vagal", "withdrawal)"] },

  { id: "venotone", x: 860, y: 320, w: 250, h: 72, lines: ["↑ Venous tone + muscle/", "respiratory pump →", "↑Psf, ↓RVR (Module 2)"] },
  { id: "tpr", x: 860, y: 436, w: 250, h: 72, lines: ["Net ↓ Total Peripheral", "Resistance (local", "dilation dominates)"] },

  { id: "sv", x: 450, y: 552, w: 260, h: 62, lines: ["↑ Stroke Volume", "(↑preload + ↑contractility)"], style: "converge" },
  { id: "co", x: 445, y: 658, w: 270, h: 62, lines: ["↑ CARDIAC OUTPUT", "(CO = SV × HR)"], style: "converge" },

  { id: "map", x: 230, y: 764, w: 270, h: 74, lines: ["MAP rises only modestly", "— CO↑ largely offset", "by TPR↓"], style: "converge" },
  { id: "pp", x: 660, y: 764, w: 270, h: 74, lines: ["Pulse Pressure widens", "(↑SV, Module 4", "Windkessel)"], style: "converge" },

  { id: "outcome", x: 420, y: 880, w: 320, h: 74, lines: ["O₂ DELIVERY TO ACTIVE", "MUSCLE MATCHES", "METABOLIC DEMAND"], style: "outcome" },

  { id: "ex1", x: 160, y: 996, w: 240, h: 58, lines: ["e.g., CO: 5→25 L/min", "in elite athletes"], style: "example" },
  { id: "ex2", x: 460, y: 996, w: 240, h: 58, lines: ["e.g., active-muscle", "resistance falls ~70%"], style: "example" },
  { id: "ex3", x: 760, y: 996, w: 240, h: 58, lines: ["e.g., HR: 70 → 180+ bpm"], style: "example" },
];

const EDGES = [
  ["root", "central", "triggers (feedforward, just before contraction)", "hier"],
  ["root", "demand", "produces (once muscle contracts)", "hier"],
  ["central", "symp", "pre-activates", "cross"],
  ["demand", "metabolic", "triggers", "cross"],
  ["neural", "baroreset", "comprises", "hier"],
  ["neural", "symp", "comprises", "hier"],
  ["local", "metabolic", "comprises", "hier"],
  ["local", "recruit", "comprises", "hier"],
  ["cardiac", "contractility", "comprises", "hier"],
  ["cardiac", "hr", "comprises", "hier"],
  ["venous", "venotone", "comprises", "hier"],
  ["venous", "tpr", "comprises", "hier"],
  ["symp", "contractility", "raises", "cross"],
  ["symp", "hr", "raises", "cross"],
  ["symp", "venotone", "raises (venoconstriction)", "cross"],
  ["baroreset", "hr", "permits, without triggering reflex bradycardia", "cross"],
  ["metabolic", "tpr", "lowers arteriolar resistance, contributing to", "cross"],
  ["contractility", "sv", "increases", "hier"],
  ["venotone", "sv", "increases preload, increasing", "cross"],
  ["hr", "co", "combines with SV to determine", "hier"],
  ["sv", "co", "combines with HR to determine", "hier"],
  ["co", "map", "raises", "hier"],
  ["tpr", "map", "opposes the rise in, keeping moderate", "cross"],
  ["sv", "pp", "widens", "cross"],
  ["map", "outcome", "provides driving pressure for", "hier"],
  ["co", "outcome", "provides flow for", "hier"],
  ["recruit", "outcome", "increases surface area, supporting", "cross"],
  ["co", "ex1", "for example", "example"],
  ["tpr", "ex2", "for example", "example"],
  ["hr", "ex3", "for example", "example"],
];

function nodeById(id) { return NODES.find(n => n.id === id); }
function shortName(id) { return nodeById(id).lines.join(" ").replace(/—$/, "").trim(); }
function edgePoints(a, b) {
  const acx = a.x + a.w / 2, acy = a.y + a.h / 2;
  const bcx = b.x + b.w / 2, bcy = b.y + b.h / 2;
  const dx = bcx - acx, dy = bcy - acy;
  let p1, p2;
  if (Math.abs(dy) >= Math.abs(dx) * 0.6) {
    p1 = { x: acx, y: dy > 0 ? a.y + a.h : a.y };
    p2 = { x: bcx, y: dy > 0 ? b.y : b.y + b.h };
  } else {
    p1 = { x: dx > 0 ? a.x + a.w : a.x, y: acy };
    p2 = { x: dx > 0 ? b.x : b.x + b.w, y: bcy };
  }
  return { p1, p2 };
}

function ConceptNode({ n }) {
  const styles = {
    root: { fill: C.copperDim, stroke: C.copper, textColor: "#fff", fontWeight: 800 },
    header: { fill: C.panel2, stroke: n.color || C.copper, textColor: n.color || C.text, fontWeight: 800 },
    converge: { fill: C.panel2, stroke: C.capillary, textColor: C.text, fontWeight: 700 },
    outcome: { fill: C.good, stroke: C.good, textColor: "#0F1720", fontWeight: 800 },
    example: { fill: "transparent", stroke: C.faint, textColor: C.muted, fontWeight: 500, dashed: true },
    default: { fill: C.panel2, stroke: C.border, textColor: C.text, fontWeight: 600 },
  };
  const s = styles[n.style] || styles.default;
  const rx = n.style === "example" ? n.h / 2 : 9;
  const lineH = 14.5;
  return (
    <g>
      <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={rx} fill={s.fill} stroke={s.stroke}
        strokeWidth={n.style === "header" ? 2.2 : 1.6} strokeDasharray={s.dashed ? "5 4" : undefined} />
      {n.lines.map((line, i) => (
        <text key={i} x={n.x + n.w / 2} y={n.y + n.h / 2 - ((n.lines.length - 1) * lineH) / 2 + i * lineH + 4}
          fontSize="11.5" fontWeight={s.fontWeight} fill={s.textColor} textAnchor="middle">
          {line}
        </text>
      ))}
    </g>
  );
}

function EdgeLine({ a, b, type }) {
  const { p1, p2 } = edgePoints(a, b);
  const color = type === "cross" ? C.hormone : type === "example" ? C.faint : C.muted;
  const markerId = `m-${a.id}-${b.id}`;
  return (
    <g opacity={type === "example" ? 0.55 : type === "cross" ? 0.55 : 0.85}>
      <defs>
        <marker id={markerId} markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={color} />
        </marker>
      </defs>
      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth={type === "cross" ? 1.5 : 1.6}
        strokeDasharray={type === "cross" ? "6 4" : type === "example" ? "2 4" : undefined}
        markerEnd={`url(#${markerId})`} />
    </g>
  );
}

function PropositionList({ title, color, items }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 6 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {items.map(([from, to, label], i) => (
          <div key={i} style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.7, padding: "6px 9px", background: C.panel2, borderRadius: 6 }}>
            <span style={{ color: C.text, fontWeight: 600 }}>{shortName(from)}</span>
            {label && <span style={{ color, fontStyle: "italic" }}> — {label} — </span>}
            {!label && <span style={{ color }}> → </span>}
            <span style={{ color: C.text, fontWeight: 600 }}>{shortName(to)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapTab() {
  const hierEdges = EDGES.filter(e => e[3] === "hier");
  const crossEdges = EDGES.filter(e => e[3] === "cross");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.copper, textAlign: "center", marginBottom: 4 }}>
          Focus question: How does the cardiovascular system respond to, and support, dynamic exercise?
        </div>
        <div style={{ fontSize: 10.5, color: C.muted, textAlign: "center", marginBottom: 10 }}>
          Solid gray = hierarchical · Dashed amber = cross-link · Dotted = example. Full wording of every link is in the legend below.
        </div>
        <div style={{ overflowX: "auto", overflowY: "hidden", border: `1px solid ${C.border}`, borderRadius: 8 }}>
          <svg viewBox="0 0 1150 1080" style={{ width: 1150, height: 1080, minWidth: 1150, display: "block", background: C.panel2 }}>
            {EDGES.map(([from, to, , type], i) => (
              <EdgeLine key={i} a={nodeById(from)} b={nodeById(to)} type={type} />
            ))}
            {NODES.map(n => <ConceptNode key={n.id} n={n} />)}
          </svg>
        </div>
        <div style={{ fontSize: 10.5, color: C.muted, textAlign: "center", marginTop: 6 }}>Scroll horizontally / pinch-zoom to explore the full map on a small screen.</div>
      </Panel>

      <Panel>
        <SectionTitle icon={Share2}>Cross-Link Propositions — the Integration Payoff</SectionTitle>
        <PropositionList title="These connect different branches of the hierarchy (dashed amber on the map):" color={C.hormone} items={crossEdges} />
      </Panel>

      <Panel>
        <SectionTitle icon={BookOpen}>Hierarchical Propositions</SectionTitle>
        <PropositionList title="These build each branch from general to specific (solid gray on the map):" color={C.muted} items={hierEdges} />
      </Panel>

      <Panel>
        <Note>
          Three cross-links worth reading twice: <b style={{ color: C.text }}>"Metabolic vasodilator
          accumulation — lowers arteriolar resistance, contributing to — net ↓TPR"</b> is why exercising
          muscle's own local control, not the nervous system, is what actually drops total peripheral
          resistance. <b style={{ color: C.text }}>"↓TPR — opposes the rise in, keeping moderate — MAP"</b> is
          why cardiac output can rise 4–6× during exercise while MAP rises only modestly (~10–20 mmHg) — a
          direct consequence of Module 1's Ohm's Law (F=ΔP/R) applied to the whole circulation. And
          <b style={{ color: C.text }}> "Baroreceptor resetting — permits, without triggering reflex
          bradycardia — ↑HR"</b> is why the baroreflex does not fight the exercise response the way it would
          fight an isolated, pathological rise in pressure — its whole operating point moves with the
          exercising state (Module 6).
        </Note>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   TAB 2 — Numeric walkthrough (lightweight integrated snapshot)
----------------------------------------------------------------*/
function exerciseModel(intensity) {
  const HR = 70 + intensity * 130;
  const SV = 70 + intensity * 40;
  const CO = (HR * SV) / 1000;
  const TPRfrac = 1 - intensity * 0.65;
  const MAP = 93 + intensity * 18;
  const PP = 40 + intensity * 45;
  return { HR, SV, CO, TPRfrac, MAP, PP };
}

function WalkthroughTab() {
  const [intensity, setIntensity] = useState(0.5);
  const m = useMemo(() => exerciseModel(intensity), [intensity]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Activity}>Exercise Intensity → Integrated Snapshot</SectionTitle>
        <Slider label="Exercise intensity" min={0} max={1} step={0.02} value={intensity}
          onChange={setIntensity} display={intensity === 0 ? "rest" : `${(intensity * 100).toFixed(0)}%`} color={C.artery} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Readout label="Heart Rate" value={m.HR.toFixed(0)} unit="bpm" color={C.hormone} />
          <Readout label="Stroke Volume" value={m.SV.toFixed(0)} unit="mL" color={C.hormone} />
          <Readout label="Cardiac Output" value={m.CO.toFixed(1)} unit="L/min" color={C.artery} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          <Readout label="TPR (relative to rest)" value={(m.TPRfrac * 100).toFixed(0)} unit="%" color={C.vein} />
          <Readout label="MAP" value={m.MAP.toFixed(0)} unit="mmHg" color={C.copper} />
          <Readout label="Pulse Pressure" value={m.PP.toFixed(0)} unit="mmHg" color={C.capillary} />
        </div>
        <Note>
          Illustrative, schematic numbers (not a validated model) meant to make the map's central claim
          concrete: as intensity rises, CO climbs steeply (HR × SV, Modules 2/3) while TPR falls steeply
          (Module 7's local vasodilation dominating over Module 6's sympathetic vasoconstriction in
          non-active beds) — the net product keeps MAP's rise modest even at near-maximal CO, exactly the
          Ohm's-law relationship (F=ΔP/R, Module 1) the whole map is built on.
        </Note>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   TAB 3 — Quiz
----------------------------------------------------------------*/
const QUESTIONS = [
  {
    stem: "During heavy exercise, cardiac output can rise 4–6 fold, yet MAP rises only modestly (~10–20 mmHg). Using Module 1's Ohm's Law (F=ΔP/R), what does this require?",
    options: ["TPR must rise proportionally with CO", "TPR must fall substantially, roughly in proportion to the rise in CO", "MAP is independent of both CO and TPR during exercise", "CO and TPR are unrelated to MAP during exercise"],
    correct: 1,
    explain: "Since MAP ≈ CO × TPR, a large rise in CO with only a modest rise in MAP mathematically requires a substantial fall in TPR — supplied by local metabolic vasodilation in the exercising muscle beds, which numerically dominates over sympathetic vasoconstriction elsewhere."
  },
  {
    stem: "In the concept map, which link is a genuine cross-link (connecting different branches), rather than a simple hierarchical 'comprises' relationship?",
    options: ["'Neural / Autonomic Control — comprises — ↑ Sympathetic outflow'", "'Local Vascular Control — comprises — Capillary recruitment'", "'Metabolic vasodilator accumulation — lowers arteriolar resistance, contributing to — net ↓TPR'", "'Cardiac Pump Mechanics — comprises — ↑ Contractility'"],
    correct: 2,
    explain: "The first, second, and fourth options are 'is-a/comprises' relationships within a single branch (a header concept to its own child). The third statement connects the Local Vascular Control branch (Module 7) to the Venous Return & Arterial Load branch's TPR concept (Modules 2/4) — a true cross-link across different parts of the hierarchy."
  },
  {
    stem: "Why does the baroreflex not oppose the rise in heart rate during exercise, despite heart rate rising well above resting baroreflex-defended levels?",
    options: ["The baroreflex is completely switched off during exercise", "Central command and exercise-related signals reset the baroreceptor operating point upward, so the reflex now defends a higher pressure/heart-rate range rather than fighting it", "Exercise abolishes all sympathetic outflow", "The vagus nerve is destroyed during exercise"],
    correct: 1,
    explain: "The baroreceptor's whole sigmoid operating curve shifts (resets) during exercise — similar in concept to chronic hypertension resetting (Module 6) but here it is an adaptive, rapid, centrally-driven reset that permits the higher heart rate and pressure needed for exercise, rather than reflexively opposing them."
  },
  {
    stem: "Which combination of Module 2 and Module 7 concepts together raises stroke volume during exercise?",
    options: ["↓Venous tone (Module 2) and ↓contractility (Module 3)", "↑Venous tone/muscle pump raising preload (Module 2) plus ↑contractility from sympathetic stimulation (Module 3) — both push the Frank-Starling operating point and the ESPVR favorably", "Only heart rate changes; stroke volume is fixed", "Baroreceptor resetting alone, with no cardiac mechanical change"],
    correct: 1,
    explain: "Stroke volume rises via two combined mechanisms: increased preload (venoconstriction, the skeletal muscle pump, and the respiratory pump all raise venous return/Psf, Module 2) and increased contractility (sympathetic stimulation steepens ESPVR, Module 3) — both acting together, not either alone."
  },
  {
    stem: "A capillary bed in resting, inactive muscle typically has few open capillaries; during exercise in active muscle, many more capillaries open (recruitment). What is the direct physiological purpose of this, per the concept map's outcome node?",
    options: ["To increase total peripheral resistance", "To increase capillary surface area, supporting O₂ delivery to active muscle matching its metabolic demand", "To decrease local blood flow", "To reduce cardiac output"],
    correct: 1,
    explain: "Capillary recruitment (Module 5) increases the surface area available for diffusional exchange — directly supporting the map's terminal outcome node (O₂ delivery matching metabolic demand), a cross-link from the Local Vascular Control branch straight to the final outcome."
  },
  {
    stem: "Why does pulse pressure widen during exercise even though the underlying arterial compliance (Module 4) has not changed?",
    options: ["Because TPR rises sharply", "Because stroke volume rises, and PP ≈ SV/C — a bigger stroke volume produces a bigger pulse pressure at the same compliance", "Because heart rate alone determines pulse pressure", "Pulse pressure cannot change without a change in arterial stiffness"],
    correct: 1,
    explain: "From Module 4's Windkessel relation, PP ≈ SV/C: raising SV alone (with compliance unchanged) is sufficient to widen pulse pressure — this is a distinct mechanism from the aging-related PP widening seen in Module 4, which instead comes from falling compliance at a roughly fixed SV."
  },
];

function QuizTab() {
  const [order] = useState(() => shuffle(QUESTIONS.map((_, i) => i)));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const q = QUESTIONS[order[idx]];
  const done = idx >= order.length;

  function pick(i) {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore(s => s + 1);
  }
  function next() { setSelected(null); setIdx(i => i + 1); }
  function restart() {
    setIdx(0); setSelected(null); setScore(0);
    order.splice(0, order.length, ...shuffle(QUESTIONS.map((_, i) => i)));
  }

  if (done) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <Panel>
        <SectionTitle icon={Brain}>Result</SectionTitle>
        <div style={{ fontSize: 32, fontWeight: 800, ...mono, color: pct >= 80 ? C.good : pct >= 50 ? C.hormone : C.bad }}>
          {score} / {QUESTIONS.length}
        </div>
        <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{pct}% correct</div>
        <button onClick={restart} style={{ ...toggleStyle(false), marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <RotateCcw size={14} /> Restart, shuffled
        </button>
      </Panel>
    );
  }

  return (
    <Panel>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <SectionTitle icon={Brain}>Question {idx + 1} of {order.length}</SectionTitle>
        <div style={{ ...mono, fontSize: 13, color: C.muted }}>Score: {score}</div>
      </div>
      <div style={{ fontSize: 14.5, lineHeight: 1.9, marginBottom: 14 }}>{q.stem}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct, isSelected = i === selected;
          let bg = C.panel2, border = C.border, icon = null;
          if (selected !== null) {
            if (isCorrect) { bg = "var(--c-good-bg)"; border = C.good; icon = <CheckCircle2 size={16} color={C.good} />; }
            else if (isSelected) { bg = "var(--c-bad-bg)"; border = C.bad; icon = <XCircle size={16} color={C.bad} />; }
          }
          return (
            <button key={i} onClick={() => pick(i)} disabled={selected !== null} style={{
              display: "flex", alignItems: "center", gap: 8, textAlign: "left", padding: "10px 12px",
              borderRadius: 8, border: `1px solid ${border}`, background: bg, color: C.text,
              fontFamily: "inherit", fontSize: 13, cursor: selected === null ? "pointer" : "default", lineHeight: 1.7
            }}>
              <span style={{ flex: 1 }}>{opt}</span>{icon}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <>
          <Note>{q.explain}</Note>
          <button onClick={next} style={{ ...toggleStyle(true), marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
            {idx + 1 < order.length ? "Next question" : "See result"} <ChevronLeft size={14} />
          </button>
        </>
      )}
    </Panel>
  );
}
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
