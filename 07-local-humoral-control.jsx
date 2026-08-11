import React, { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceDot, ReferenceLine, ReferenceArea, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import {
  Zap, Activity, Droplet, Brain, RotateCcw,
  CheckCircle2, XCircle, ChevronLeft, HeartPulse, BookOpen, Waves
} from "lucide-react";

/* ---------------------------------------------------------------
   TOKENS — same system as Modules 1–6, project continuity.
----------------------------------------------------------------*/
const C = {
  bg: "#0F1720", panel: "#16212E", panel2: "#1C2A3A", border: "#2A3B4D",
  text: "#E7ECF2", muted: "#8FA1B3", faint: "#5A6B7D",
  copper: "#C97A4A", copperDim: "#8A5636",
  artery: "#C0453C", vein: "#3E7CB1", capillary: "#4FB8C4",
  hormone: "#E0B34D", good: "#5FA97A", bad: "#C0453C",
};
const mono = { fontFamily: "ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace" };

const MODULES = [
  { id: "foundations", label: "Foundations", icon: BookOpen },
  { id: "autoregulation", label: "Autoregulation", icon: Activity },
  { id: "hyperemia", label: "Hyperemia", icon: Waves },
  { id: "humoral", label: "Humoral Control", icon: Droplet },
  { id: "quiz", label: "Self-Test (خودآزمایی)", icon: Brain },
];

export default function CVSLocalHumoralControl() {
  const [tab, setTab] = useState("foundations");
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
            <div style={{ fontSize: 18, fontWeight: 800 }}>Cardiovascular Physiology — Module 7: Local & Humoral Control of Blood Flow</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
              Guyton Ch.17 — how each tissue overrides the nervous system to get exactly the flow it needs (کنترل موضعی که بر عصب غلبه می‌کند)
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", overflowX: "auto", borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        {MODULES.map(t => {
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

      <div style={{ padding: "18px 16px 60px", maxWidth: 900, margin: "0 auto" }}>
        {tab === "foundations" && <FoundationsTab />}
        {tab === "autoregulation" && <AutoregulationTab />}
        {tab === "hyperemia" && <HyperemiaTab />}
        {tab === "humoral" && <HumoralTab />}
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
   TAB 0 — Foundations
----------------------------------------------------------------*/
function EndotheliumSVG() {
  return (
    <svg viewBox="0 0 380 120" style={{ width: "100%", height: 120 }}>
      <rect x="10" y="45" width="360" height="30" rx="4" fill={C.panel2} stroke={C.artery} strokeWidth="1.5" />
      {[...Array(9)].map((_, i) => (
        <circle key={i} cx={30 + i * 40} cy="60" r="3" fill={C.capillary} opacity="0.7" />
      ))}
      <line x1="10" y1="60" x2="370" y2="60" stroke={C.capillary} strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
      <text x="15" y="40" fontSize="9" fill={C.muted}>flowing blood → shear stress on wall</text>
      {[60, 140, 220, 300].map((x, i) => (
        <g key={i}>
          <path d={`M${x},75 q6,14 0,26`} stroke={C.good} strokeWidth="1.6" fill="none" markerEnd="url(#noArrow)" />
        </g>
      ))}
      <defs>
        <marker id="noArrow" markerWidth="6" markerHeight="6" refX="4" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill={C.good} />
        </marker>
      </defs>
      <text x="190" y="115" fontSize="9.5" fill={C.good} textAnchor="middle">NO / prostacyclin released toward smooth muscle → vasodilation</text>
      <text x="15" y="30" fontSize="9.5" fill={C.text} fontWeight="700">Endothelium</text>
    </svg>
  );
}

const TIMESCALE_DATA = [
  { name: "Neural (baroreflex)", value: 1, color: C.bad },
  { name: "Local metabolic", value: 20, color: C.hormone },
  { name: "Endothelial (NO)", value: 40, color: C.capillary },
  { name: "Humoral (RAAS)", value: 600, color: C.vein },
  { name: "Renal pressure-natriuresis", value: 5000, color: C.copper },
];

function FoundationsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={BookOpen}>Three Layers of Control, on Three Very Different Clocks</SectionTitle>
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 2 }}>
          Module 6 covered the fastest layer: the nervous system, acting in seconds, primarily defending
          <i> systemic</i> MAP with no regard for any individual organ's own metabolic needs. This module covers
          two more layers that override or complement that neural control at the level of the individual
          tissue: <b style={{ color: C.text }}>local (intrinsic) control</b> — the tissue adjusting its own
          arteriolar tone based on its own metabolic state, requiring no nerves or hormones at all — and
          <b style={{ color: C.text }}> humoral control</b> — circulating chemical messengers acting over
          seconds to days. Critically, local control can and does <i>override</i> sympathetic vasoconstrictor
          tone in an actively metabolizing tissue — a working skeletal muscle vasodilates despite ongoing
          sympathetic discharge, because local metabolic signals are strong enough to overwhelm the neural
          input at the arteriolar smooth muscle.
        </div>
      </Panel>

      <Panel>
        <SectionTitle icon={Activity}>Typical Onset Time — Log Scale</SectionTitle>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TIMESCALE_DATA} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" scale="log" domain={[1, 10000]} stroke={C.muted} fontSize={10.5}
                label={{ value: "Approx. onset time (seconds, log scale)", position: "insideBottom", offset: -3, fill: C.muted, fontSize: 10 }} />
              <YAxis type="category" dataKey="name" stroke={C.muted} fontSize={11} width={150} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {TIMESCALE_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Note>
          This is the single most useful organizing fact in this whole area: fast systems (neural, local
          metabolic) buy time; slow systems (RAAS, and ultimately the kidney's pressure-natriuresis mechanism
          from your renal simulator) set the actual long-term operating point. A question describing a
          response within seconds is neural or local; one unfolding over minutes-to-hours is humoral; one
          unfolding over days is renal/renal-hormonal.
        </Note>
      </Panel>

      <Panel>
        <SectionTitle icon={Droplet}>Endothelium: Not Just a Lining</SectionTitle>
        <EndotheliumSVG />
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 2, marginTop: 10 }}>
          The vascular endothelium is itself an active local-control organ, releasing both vasodilators and
          vasoconstrictors in response to physical and chemical stimuli — most importantly
          <b style={{ color: C.text }}> shear stress</b> (frictional drag of flowing blood on the vessel wall):
          <ul style={{ margin: "6px 0 0 0", paddingLeft: 18 }}>
            <li><b style={{ color: C.text }}>Nitric oxide (NO)</b> — released continuously in proportion to shear
              stress; the dominant local vasodilator; short half-life (seconds); its loss (endothelial
              dysfunction — smoking, diabetes, atherosclerosis) is an early, clinically important lesion.</li>
            <li><b style={{ color: C.text }}>Prostacyclin (PGI₂)</b> — vasodilator, also inhibits platelet
              aggregation.</li>
            <li><b style={{ color: C.text }}>Endothelin</b> — the most potent endogenous vasoconstrictor known;
              released with vessel injury; contributes to the pathophysiology of some forms of hypertension.</li>
          </ul>
        </div>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   TAB 1 — Autoregulation: metabolic vs myogenic theory
----------------------------------------------------------------*/
function MyogenicMetabolicSVG() {
  return (
    <svg viewBox="0 0 380 130" style={{ width: "100%", height: 130 }}>
      <text x="90" y="14" fontSize="10" fill={C.artery} textAnchor="middle" fontWeight="700">Myogenic (stretch → constrict)</text>
      <line x1="30" y1="40" x2="150" y2="40" stroke={C.artery} strokeWidth="14" strokeLinecap="round" opacity="0.35" />
      <line x1="30" y1="40" x2="150" y2="40" stroke={C.artery} strokeWidth="6" strokeLinecap="round" />
      <path d="M20,25 l10,15 l-10,15" stroke={C.artery} strokeWidth="2" fill="none" />
      <path d="M160,25 l-10,15 l10,15" stroke={C.artery} strokeWidth="2" fill="none" />
      <text x="90" y="65" fontSize="8.5" fill={C.muted} textAnchor="middle">↑pressure stretches wall → smooth muscle contracts → lumen narrows</text>

      <text x="290" y="14" fontSize="10" fill={C.hormone} textAnchor="middle" fontWeight="700">Metabolic (metabolites → dilate)</text>
      <line x1="230" y1="40" x2="350" y2="40" stroke={C.hormone} strokeWidth="6" strokeLinecap="round" opacity="0.9" />
      {[250, 270, 290, 310, 330].map((x, i) => <circle key={i} cx={x} cy={40} r="3" fill={C.bad} opacity="0.75" />)}
      <text x="290" y="65" fontSize="8.5" fill={C.muted} textAnchor="middle">↓flow → adenosine/CO₂/K⁺ accumulate → smooth muscle relaxes → lumen widens</text>
    </svg>
  );
}

/* ---------------------------------------------------------------
   TAB 1 — Autoregulation: metabolic vs myogenic theory
----------------------------------------------------------------*/
function autoregFlow(P, midpoint = 100, plateauStrength = 1) {
  // schematic autoregulation curve: near-flat plateau around normal pressure,
  // with the plateau's flatness controlled by plateauStrength (0 = pure passive/Ohm's law, 1 = ideal autoregulation)
  const passive = P / midpoint;
  const idealPlateau = 1 + 0.15 * Math.tanh((P - midpoint) / 40);
  return passive * (1 - plateauStrength) + idealPlateau * plateauStrength;
}

function AutoregulationTab() {
  const [plateauStrength, setPlateauStrength] = useState(0.85);
  const curve = useMemo(() => {
    const arr = [];
    for (let P = 20; P <= 220; P += 5) {
      arr.push({ P, Flow: +autoregFlow(P, 100, plateauStrength).toFixed(2), Passive: +(P / 100).toFixed(2) });
    }
    return arr;
  }, [plateauStrength]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Activity}>Autoregulation of Blood Flow</SectionTitle>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curve} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="P" stroke={C.muted} fontSize={11} label={{ value: "Perfusion pressure (mmHg)", position: "insideBottom", offset: -3, fill: C.muted, fontSize: 10.5 }} />
              <YAxis stroke={C.muted} fontSize={11} domain={[0, 2.5]} label={{ value: "Flow (relative to normal)", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 10.5 }} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceArea x1={70} x2={175} fill={C.good} fillOpacity={0.06} label={{ value: "autoregulatory range", fill: C.good, fontSize: 10, position: "insideTop" }} />
              <Line type="monotone" dataKey="Passive" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Passive (Ohm's law only)" />
              <Line type="monotone" dataKey="Flow" stroke={C.artery} strokeWidth={2.4} dot={false} name="Autoregulated flow" />
              <ReferenceLine x={100} stroke={C.faint} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <Slider label="Autoregulatory strength (0 = none, 1 = near-perfect)" min={0} max={1} step={0.02} value={plateauStrength}
          onChange={setPlateauStrength} display={plateauStrength.toFixed(2)} color={C.good} />
      </Panel>

      <Panel>
        <SectionTitle icon={BookOpen}>Two Competing (Complementary) Explanations</SectionTitle>
        <MyogenicMetabolicSVG />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
          <div style={{ padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.hormone}` }}>
            <div style={{ fontWeight: 700, color: C.hormone, fontSize: 13 }}>Metabolic theory (نظریهٔ متابولیک)</div>
            <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.9, marginTop: 4 }}>
              A fall in perfusion pressure transiently reduces flow → vasodilator metabolites (adenosine, CO₂,
              K⁺, H⁺, low local O₂) accumulate faster than they're washed out → arterioles dilate → flow is
              restored toward the tissue's actual metabolic need. This is the dominant mechanism in most organs
              (heart, brain, skeletal muscle) and is the same mechanism behind active and reactive hyperemia
              (next tab) — all three phenomena share one explanation.
            </div>
          </div>
          <div style={{ padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.artery}` }}>
            <div style={{ fontWeight: 700, color: C.artery, fontSize: 13 }}>Myogenic theory (نظریهٔ میوژنیک)</div>
            <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.9, marginTop: 4 }}>
              Sudden stretch of vascular smooth muscle (from a rise in pressure) directly triggers reflex
              contraction — the Bayliss effect — independent of any metabolic signal. This is fast (myogenic
              tone changes within seconds, Module 1's kidney autoregulation) and particularly important in the
              kidney and brain, where flow must stay tightly stable despite everyday swings in systemic MAP.
            </div>
          </div>
        </div>
        <Note>
          Neither theory alone explains all autoregulation data perfectly, and most organs likely use both
          simultaneously in different proportions — the kidney relies heavily on both myogenic tone and
          tubuloglomerular feedback (a metabolic/chemical variant, covered in your renal simulator); the heart
          and brain lean more heavily on the metabolic theory.
        </Note>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   TAB 2 — Hyperemia (active vs reactive)
----------------------------------------------------------------*/
function hyperemiaCurve(kind, magnitude) {
  const arr = [];
  for (let t = -20; t <= 200; t += 2) {
    let flow = 1;
    if (kind === "active") {
      if (t >= 0 && t <= 120) flow = 1 + magnitude * (1 - Math.exp(-t / 15));
      else if (t > 120) flow = 1 + magnitude * Math.exp(-(t - 120) / 25);
    } else {
      // reactive: occlusion from t=0 to t=40 (flow=0), then overshoot and decay back to baseline
      if (t >= 0 && t < 40) flow = 0;
      else if (t >= 40) {
        const tt = t - 40;
        flow = 1 + magnitude * 1.8 * Math.exp(-tt / 20);
      }
    }
    arr.push({ t, flow: +Math.max(0, flow).toFixed(2) });
  }
  return arr;
}

function HyperemiaTab() {
  const [kind, setKind] = useState("active");
  const [magnitude, setMagnitude] = useState(1.2);
  const data = useMemo(() => hyperemiaCurve(kind, magnitude), [kind, magnitude]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Waves}>Active vs Reactive Hyperemia</SectionTitle>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button onClick={() => setKind("active")} style={toggleStyle(kind === "active")}>Active hyperemia (↑metabolism)</button>
          <button onClick={() => setKind("reactive")} style={toggleStyle(kind === "reactive")}>Reactive hyperemia (post-occlusion)</button>
        </div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="t" stroke={C.muted} fontSize={11} label={{ value: "Time (s, schematic)", position: "insideBottom", offset: -3, fill: C.muted, fontSize: 10.5 }} />
              <YAxis stroke={C.muted} fontSize={11} domain={[0, 5]} label={{ value: "Flow (relative to resting)", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 10.5 }} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              {kind === "reactive" && <ReferenceArea x1={0} x2={40} fill={C.bad} fillOpacity={0.12} label={{ value: "occlusion", fill: C.bad, fontSize: 10 }} />}
              <Line type="monotone" dataKey="flow" stroke={C.capillary} strokeWidth={2.4} dot={false} />
              <ReferenceLine y={1} stroke={C.faint} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <Slider label={kind === "active" ? "Metabolic demand increase" : "Occlusion severity (debt magnitude)"} min={0.3} max={2.5} step={0.05} value={magnitude}
          onChange={setMagnitude} display={`${magnitude.toFixed(2)}×`} color={C.capillary} />
      </Panel>

      <Panel>
        <Note>
          Both are the metabolic theory acting in two different circumstances, and both are exam-favorite
          "same mechanism, different trigger" pairs: <b style={{ color: C.text }}>active hyperemia</b> — a
          tissue's own increased metabolic rate (e.g., exercising muscle) causes vasodilator metabolites to
          accumulate faster than they're washed out, raising flow to match demand, with flow settling back to
          baseline once the extra metabolic activity stops. <b style={{ color: C.text }}>Reactive hyperemia</b> —
          after a period of occluded flow (e.g., a blood-pressure cuff), vasodilator metabolites accumulate
          with essentially no washout at all, so flow overshoots well above baseline the instant occlusion is
          released, then gradually returns to baseline as the "oxygen debt" is repaid. The longer/more severe
          the occlusion, the larger the overshoot — this relationship is itself used clinically as a bedside
          test of the local microvascular reserve of a limb.
        </Note>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   TAB 3 — Humoral control
----------------------------------------------------------------*/
function OpposingSystemsSVG() {
  return (
    <svg viewBox="0 0 380 90" style={{ width: "100%", height: 90 }}>
      <text x="90" y="16" fontSize="10.5" fontWeight="700" fill={C.vein} textAnchor="middle">RAAS + ADH</text>
      <text x="90" y="28" fontSize="8.5" fill={C.muted} textAnchor="middle">↓volume/pressure trigger</text>
      <rect x="20" y="36" width="140" height="18" rx="9" fill={C.vein} opacity="0.3" />
      <text x="90" y="49" fontSize="8.5" fill={C.text} textAnchor="middle">retain Na⁺/H₂O · constrict · ↑MAP</text>

      <line x1="180" y1="45" x2="200" y2="45" stroke={C.faint} strokeWidth="2" />
      <text x="190" y="38" fontSize="14" fill={C.faint} textAnchor="middle">⇄</text>

      <text x="290" y="16" fontSize="10.5" fontWeight="700" fill={C.capillary} textAnchor="middle">ANP / BNP</text>
      <text x="290" y="28" fontSize="8.5" fill={C.muted} textAnchor="middle">↑volume / atrial-wall stretch trigger</text>
      <rect x="220" y="36" width="140" height="18" rx="9" fill={C.capillary} opacity="0.3" />
      <text x="290" y="49" fontSize="8.5" fill={C.text} textAnchor="middle">excrete Na⁺/H₂O · dilate · ↓MAP</text>

      <text x="190" y="75" fontSize="8.5" fill={C.muted} textAnchor="middle">same variable (ECF volume / MAP), opposite-direction triggers and effects</text>
    </svg>
  );
}

/* ---------------------------------------------------------------
   TAB 3 — Humoral control
----------------------------------------------------------------*/
const HUMORAL_AGENTS = [
  { name: "Norepinephrine / Epinephrine", source: "Adrenal medulla (sympathetic activation)", effect: "Vasoconstriction (α-dominant, most beds); epinephrine can vasodilate skeletal muscle/coronary beds at low doses via β2", speed: "Seconds" },
  { name: "Angiotensin II", source: "RAAS cascade (renin from JGA → ANG I → ACE → ANG II)", effect: "Potent arteriolar vasoconstriction; also stimulates aldosterone and thirst/ADH", speed: "Minutes" },
  { name: "Vasopressin (ADH)", source: "Posterior pituitary, released with ↑osmolality or severe ↓volume/pressure", effect: "Potent vasoconstrictor at high (non-physiologic-osmoregulatory) concentrations, e.g., severe hemorrhage; main day-to-day role is renal water reabsorption (your renal simulator)", speed: "Minutes" },
  { name: "Atrial/B-type Natriuretic Peptide (ANP/BNP)", source: "Atrial (ANP) / ventricular (BNP) myocytes, released with wall stretch (↑volume)", effect: "Vasodilation; promotes renal Na⁺/water excretion — opposes RAAS", speed: "Minutes" },
  { name: "Bradykinin", source: "Kallikrein-kinin system, activated in glandular tissue and inflammation", effect: "Potent vasodilator, increases capillary permeability", speed: "Seconds–minutes" },
  { name: "Histamine", source: "Mast cells / basophils, released with tissue injury or allergic reaction", effect: "Arteriolar vasodilation + venular permeability increase (the basis of local inflammatory edema)", speed: "Seconds" },
];

function HumoralTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Droplet}>Major Circulating Vasoactive Substances</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {HUMORAL_AGENTS.map((r, i) => (
            <div key={i} style={{ padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: C.copper }}>{r.name}</span>
                <span style={{ fontSize: 11, color: C.muted, ...mono }}>{r.speed}</span>
              </div>
              <div style={{ fontSize: 12, color: C.text, marginTop: 3 }}><b>Source:</b> {r.source}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}><b>Effect:</b> {r.effect}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <OpposingSystemsSVG />
        <Note>
          Two opposing systems worth pairing in memory: <b style={{ color: C.text }}>RAAS/ADH</b> (retain
          Na⁺/water, vasoconstrict, raise pressure) vs <b style={{ color: C.text }}>natriuretic peptides</b>
          (excrete Na⁺/water, vasodilate, lower pressure) — released in direct response to the volume/stretch
          state their opposite number is trying to correct. This is the same RAAS and ADH machinery already
          covered at the tubular level in your renal simulator; here the emphasis is their direct vascular
          tone effects, which act on a much faster timescale (minutes) than their renal excretory effects
          (hours).
        </Note>
      </Panel>

      <Panel>
        <SectionTitle icon={BookOpen}>Neural vs Local vs Humoral — Side by Side</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            ["Neural (Module 6)", "Seconds", "Whole-body MAP, redistributes flow away from non-essential beds", "Rapid onset AND rapid offset; resets with chronic stimuli (baroreceptors)"],
            ["Local (this module)", "Seconds–minutes", "Matches flow to that specific tissue's own metabolic need", "Can override sympathetic tone locally; does not defend systemic MAP"],
            ["Humoral (this module)", "Minutes–hours", "Broader, often whole-body vascular tone plus fluid/electrolyte balance", "Slower onset, typically slower offset — bridges short-term neural control and long-term renal control"],
          ].map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.6fr 1.6fr", gap: 8, padding: "8px 10px", background: C.panel2, borderRadius: 8, fontSize: 11.5 }}>
              <span style={{ fontWeight: 700, color: C.copper }}>{row[0]}</span>
              <span style={{ ...mono, color: C.text }}>{row[1]}</span>
              <span style={{ color: C.text }}>{row[2]}</span>
              <span style={{ color: C.muted }}>{row[3]}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   TAB 4 — Quiz
----------------------------------------------------------------*/
const QUESTIONS = [
  {
    stem: "During intense exercise, sympathetic vasoconstrictor tone is high throughout the body, yet blood flow to the exercising muscle itself rises dramatically. What explains this apparent contradiction?",
    options: ["Sympathetic tone actually decreases specifically in exercising muscle", "Local metabolic vasodilator signals (adenosine, K⁺, CO₂, low O₂) in the active tissue override sympathetic vasoconstrictor tone at the arteriolar level", "Exercising muscle has no sympathetic innervation at all", "This is purely a myogenic, not metabolic, phenomenon"],
    correct: 1,
    explain: "Local control can locally overpower systemic neural vasoconstrictor tone — the accumulating metabolic vasodilators in actively working muscle are strong enough to dilate the local arterioles despite ongoing sympathetic discharge elsewhere in the body."
  },
  {
    stem: "Which theory of autoregulation best explains the very fast (within seconds), pressure-triggered constriction seen in renal and cerebral vessels, independent of any metabolic signal?",
    options: ["Metabolic theory", "Myogenic theory (Bayliss effect) — vascular smooth muscle contracts reflexively in response to stretch", "Humoral theory", "Reactive hyperemia"],
    correct: 1,
    explain: "The myogenic (Bayliss) mechanism is a direct, fast, stretch-triggered contraction of vascular smooth muscle in response to a rise in pressure, independent of tissue metabolism — particularly prominent in the kidney and brain, where flow must remain tightly stable."
  },
  {
    stem: "After releasing a blood-pressure cuff that had occluded a limb's circulation for several minutes, blood flow transiently rises well above its resting baseline before returning to normal. What is this phenomenon called, and what causes it?",
    options: ["Active hyperemia, caused by increased local metabolic rate", "Reactive hyperemia, caused by accumulated vasodilator metabolites during the occlusion, now driving an overshoot in flow", "The myogenic response, caused by sudden pressure release", "The baroreflex, caused by a sudden fall in MAP"],
    correct: 1,
    explain: "Reactive hyperemia follows a period of occluded flow: vasodilator metabolites accumulate with no washout during occlusion, producing an overshoot in flow once perfusion resumes — the same metabolic-theory mechanism as active hyperemia, but triggered by occlusion rather than increased metabolic demand."
  },
  {
    stem: "Endothelial dysfunction (reduced nitric oxide bioavailability, e.g., from chronic smoking or diabetes) primarily impairs which local control mechanism?",
    options: ["Myogenic autoregulation only", "Shear-stress-mediated vasodilation, since NO is released continuously by the endothelium in proportion to flow-induced shear stress", "The baroreflex arc", "Renal pressure-natriuresis"],
    correct: 1,
    explain: "Nitric oxide is the dominant endothelium-derived vasodilator, released continuously in response to shear stress from flowing blood; its loss in endothelial dysfunction impairs flow-mediated vasodilation and is considered an early lesion in the development of atherosclerosis and hypertension."
  },
  {
    stem: "A patient in severe, decompensated hemorrhagic shock has extremely high circulating levels of both angiotensin II and vasopressin (ADH). What is the primary purpose of ADH acting as a vasoconstrictor in this setting, compared with its everyday physiological role?",
    options: ["ADH's everyday role is also primarily vasoconstriction", "ADH's everyday (physiologic) role is osmoregulation via renal water reabsorption; only at the very high concentrations seen in severe hypovolemia/hypotension does it act as a significant vasoconstrictor — a backup pressor mechanism", "ADH has no vasoconstrictor properties at any concentration", "ADH acts exclusively on the heart, not blood vessels"],
    correct: 1,
    explain: "At normal physiologic concentrations, ADH's dominant role is renal water reabsorption (osmoregulation, already covered in your renal simulator). Only at the much higher concentrations released during severe hemorrhage/hypotension does its vasoconstrictor property become a clinically significant pressor mechanism — a good example of a hormone with concentration-dependent, context-dependent roles."
  },
  {
    stem: "Which pair of substances exert directly opposing effects on both vascular tone and renal sodium/water handling, released in response to opposite volume-status triggers?",
    options: ["Nitric oxide and endothelin", "Renin-Angiotensin-Aldosterone System (RAAS)/ADH vs Natriuretic Peptides (ANP/BNP)", "Histamine and bradykinin", "Norepinephrine and epinephrine"],
    correct: 1,
    explain: "RAAS and ADH are released in response to low volume/pressure and act to vasoconstrict and retain Na⁺/water; natriuretic peptides are released in response to atrial/ventricular stretch (high volume) and act to vasodilate and excrete Na⁺/water — a classic opposing-pair relationship."
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
            if (isCorrect) { bg = "#173226"; border = C.good; icon = <CheckCircle2 size={16} color={C.good} />; }
            else if (isSelected) { bg = "#331a18"; border = C.bad; icon = <XCircle size={16} color={C.bad} />; }
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
