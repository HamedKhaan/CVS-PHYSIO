import React, { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceDot, ReferenceLine, ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";
import {
  Droplets, Activity, Waves, Brain, RotateCcw,
  CheckCircle2, XCircle, ChevronLeft, HeartPulse, BookOpen
} from "lucide-react";

/* ---------------------------------------------------------------
   TOKENS — same system as Modules 1–4, project continuity.
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
  { id: "starling", label: "Starling Forces", icon: Droplets },
  { id: "lymphatics", label: "Lymphatics & Edema", icon: Waves },
  { id: "quiz", label: "Self-Test (خودآزمایی)", icon: Brain },
];

export default function CVSMicrocirculation() {
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
            <div style={{ fontSize: 18, fontWeight: 800 }}>Cardiovascular Physiology — Module 5: Microcirculation & Capillary Exchange</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
              Guyton Ch.16–17 — where all the pressure work of Modules 1–4 finally does its job: exchange at the tissue level (سطح واقعی تبادل مواد)
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
        {tab === "starling" && <StarlingTab />}
        {tab === "lymphatics" && <LymphaticsTab />}
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
   TAB 0 — Foundations: structure + the diffusion-vs-filtration
   distinction most students get wrong.
----------------------------------------------------------------*/
const CAPILLARY_TYPES = [
  { type: "Continuous (پیوسته)", where: "Muscle, skin, lung, brain (with tight junctions)", pores: "Small intercellular clefts (~6–7 nm); brain capillaries have tight junctions — the blood-brain barrier", permeability: "Low–moderate; brain: very low to polar solutes" },
  { type: "Fenestrated (پنجره‌دار)", where: "Kidney glomeruli, intestinal mucosa, endocrine glands, choroid plexus", pores: "Round windows (fenestrae, ~20–100 nm) through the endothelial cell itself, often with a thin diaphragm", permeability: "High — built for rapid fluid/small-solute flux" },
  { type: "Discontinuous / Sinusoidal (سینوسوئیدی)", where: "Liver, spleen, bone marrow", pores: "Large gaps (up to ~1 μm) with an incomplete or absent basement membrane", permeability: "Very high — even whole plasma proteins and cells can cross" },
];

const TRANSPORT_COMPARE = [
  { mech: "Diffusion (نفوذ)", role: "O₂, CO₂, glucose, amino acids, ions — essentially all everyday nutrient/gas exchange", scale: "Enormous: total diffusional exchange of water alone is estimated at ~80× the plasma flow itself" },
  { mech: "Bulk flow / filtration (فیلتراسیون حجمی)", role: "Fluid and solute movement driven by Starling (hydrostatic/oncotic) pressure gradients", scale: "Tiny by comparison: net filtration is only a small fraction (a few %) of plasma flow through capillaries" },
  { mech: "Vesicular transport (وزیکولی)", role: "Larger proteins/macromolecules via pinocytosis, more relevant in continuous capillaries with tight junctions", scale: "Minor quantitatively, but important for select large molecules" },
];

function FoundationsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={BookOpen}>The Most Common Misconception, Corrected First</SectionTitle>
        <Note>
          Many students assume capillary "filtration" (driven by Starling forces) is how O₂, glucose, and
          nutrients reach tissue. It is not. <b style={{ color: C.text }}>Diffusion</b>, driven by concentration
          gradients across the capillary wall, is responsible for the overwhelming majority of solute and gas
          exchange — Guyton notes that the diffusional exchange of water across the capillary wall alone is
          roughly <b style={{ color: C.text }}>~80 times greater</b> than the net rate of plasma flow through
          the capillaries. <b style={{ color: C.text }}>Filtration/Starling forces</b> govern something
          different: the small net movement of fluid <i>volume</i> between plasma and interstitium that
          determines overall fluid balance and edema — not the delivery of nutrients themselves.
        </Note>
      </Panel>

      <Panel>
        <SectionTitle icon={Droplets}>Two Exchange Mechanisms — Very Different Jobs</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TRANSPORT_COMPARE.map((r, i) => (
            <div key={i} style={{ padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.copper }}>{r.mech}</div>
              <div style={{ fontSize: 12.5, color: C.text, marginTop: 3 }}>{r.role}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{r.scale}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionTitle icon={Waves}>Capillary Wall Structure — Three Types</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CAPILLARY_TYPES.map((r, i) => (
            <div key={i} style={{ padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{r.type}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}><b style={{ color: C.text }}>Where:</b> {r.where}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}><b style={{ color: C.text }}>Structure:</b> {r.pores}</div>
              <div style={{ fontSize: 12, color: C.hormone, marginTop: 2 }}>{r.permeability}</div>
            </div>
          ))}
        </div>
        <Note>
          Exam pattern: a question describing unusually high capillary permeability to protein (ascites,
          nephrotic-range change, or drug distribution) is almost always pointing at fenestrated or sinusoidal
          beds; a question about a drug that cannot reach brain tissue is pointing at continuous capillaries
          with tight junctions — the blood-brain barrier.
        </Note>
      </Panel>

      <Panel>
        <SectionTitle icon={BookOpen}>Precapillary Sphincters & Vasomotion</SectionTitle>
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 2 }}>
          True capillaries have no smooth muscle of their own — flow into each capillary is gated by a
          <b style={{ color: C.text }}> precapillary sphincter</b> (اسفنکتر پیش‌مویرگی) at the arteriolar end of
          the metarteriole. These sphincters open and close cyclically (<b style={{ color: C.text }}>vasomotion</b>,
          حرکات وازوموتور), mainly in response to local tissue O₂ and metabolite levels — low local O₂ or
          accumulated CO₂/adenosine/H⁺ relaxes the sphincter and opens flow (local metabolic autoregulation),
          the same core mechanism that governs regional blood-flow control in essentially every organ bed.
          Only a fraction of capillaries are open at rest; more open during increased tissue metabolic demand
          (e.g., exercising muscle), which also increases total capillary surface area available for exchange.
        </div>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   MODEL — the Starling equation for capillary filtration.
----------------------------------------------------------------*/
function starlingNFP({ Pc, Pif, piC, piIf, sigma }) {
  const hydrostaticOut = Pc - Pif;
  const oncoticIn = sigma * (piC - piIf);
  const NFP = hydrostaticOut - oncoticIn;
  return { hydrostaticOut, oncoticIn, NFP };
}
const STARLING_SCENARIOS = {
  normal: { label: "Normal (skeletal muscle, average)", Pc: 17.3, Pif: -3, piC: 28, piIf: 8, sigma: 1 },
  chf: { label: "Heart failure (↑venous pressure → ↑Pc)", Pc: 28, Pif: -3, piC: 28, piIf: 8, sigma: 1 },
  nephrotic: { label: "Nephrotic syndrome (↓piC, hypoalbuminemia)", Pc: 17.3, Pif: -3, piC: 14, piIf: 8, sigma: 1 },
  cirrhosis: { label: "Liver cirrhosis (↓piC, ↓albumin synthesis)", Pc: 17.3, Pif: -3, piC: 12, piIf: 8, sigma: 1 },
  sepsis: { label: "Sepsis / burns (↑permeability, ↓σ, ↑piIf)", Pc: 20, Pif: -1, piC: 22, piIf: 16, sigma: 0.5 },
  inflammation: { label: "Local inflammation (histamine: ↑Pc, arteriolar dilation)", Pc: 26, Pif: 0, piC: 26, piIf: 10, sigma: 0.8 },
};

function StarlingTab() {
  const [Pc, setPc] = useState(17.3);
  const [Pif, setPif] = useState(-3);
  const [piC, setPiC] = useState(28);
  const [piIf, setPiIf] = useState(8);
  const [sigma, setSigma] = useState(1);

  const r = useMemo(() => starlingNFP({ Pc, Pif, piC, piIf, sigma }), [Pc, Pif, piC, piIf, sigma]);
  const filtering = r.NFP > 0.05, absorbing = r.NFP < -0.05;

  function applyScenario(key) {
    const s = STARLING_SCENARIOS[key];
    setPc(s.Pc); setPif(s.Pif); setPiC(s.piC); setPiIf(s.piIf); setSigma(s.sigma);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Droplets}>Classic Starling Equation — Teaching Model</SectionTitle>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, padding: "8px 10px", background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
          <b style={{ color: C.text }}>Modern physiology note:</b> this interactive equation uses the classic
          Starling formulation for calculation practice. In vivo microvascular exchange is strongly influenced
          by the endothelial glycocalyx; sustained venous-end reabsorption is not the default modern model,
          and lymphatic drainage is essential for maintaining interstitial fluid balance.
        </div>
        <div style={{ fontSize: 16, textAlign: "center", ...mono, color: C.copper, margin: "6px 0 14px" }}>
          NFP = (Pc − Pif) − σ(πc − πif)
        </div>
        <CapillarySVG NFP={r.NFP} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <Readout label="Hydrostatic gradient (out)" value={r.hydrostaticOut.toFixed(1)} unit="mmHg" color={C.artery} />
          <Readout label="Oncotic gradient (in)" value={r.oncoticIn.toFixed(1)} unit="mmHg" color={C.vein} />
          <Readout label="Net Filtration Pressure" value={r.NFP.toFixed(1)} unit="mmHg" color={filtering ? C.bad : absorbing ? C.good : C.hormone} />
        </div>
        <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, textAlign: "center", color: filtering ? C.bad : absorbing ? C.good : C.hormone }}>
          {filtering ? "Net filtration (fluid → interstitium)" : absorbing ? "Net absorption (fluid → capillary)" : "Near equilibrium"}
        </div>
      </Panel>

      <Panel>
        <SectionTitle>Controls</SectionTitle>
        <Slider label="Pc — Capillary hydrostatic pressure" min={5} max={40} step={0.5} value={Pc}
          onChange={setPc} display={`${Pc.toFixed(1)} mmHg`} color={C.artery} />
        <Slider label="Pif — Interstitial fluid hydrostatic pressure" min={-8} max={8} step={0.5} value={Pif}
          onChange={setPif} display={`${Pif.toFixed(1)} mmHg`} color={C.vein} />
        <Slider label="πc — Plasma colloid osmotic pressure" min={5} max={35} step={0.5} value={piC}
          onChange={setPiC} display={`${piC.toFixed(1)} mmHg`} color={C.hormone} />
        <Slider label="πif — Interstitial colloid osmotic pressure" min={0} max={20} step={0.5} value={piIf}
          onChange={setPiIf} display={`${piIf.toFixed(1)} mmHg`} color={C.capillary} />
        <Slider label="σ — Reflection coefficient (protein permeability)" min={0.2} max={1} step={0.02} value={sigma}
          onChange={setSigma} display={sigma.toFixed(2)} color={C.bad} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          {Object.entries(STARLING_SCENARIOS).map(([k, s]) => (
            <button key={k} onClick={() => applyScenario(k)} style={toggleStyle(false)}>{s.label}</button>
          ))}
        </div>
      </Panel>

      <Panel>
        <Note>
          Guyton's reference numbers give an NFP of only <b style={{ color: C.text }}>~+0.3 mmHg</b> — filtration
          and absorption are nearly balanced across the whole capillary bed, with the small residual filtered
          fluid (a few L/day) returned to the circulation by the lymphatics (next tab), not by capillary
          re-absorption alone. σ (sigma, the reflection coefficient) matters as much as any pressure: it
          measures how well the capillary wall <i>excludes</i> protein. σ=1 means the wall is perfectly
          impermeable to protein (the oncotic gradient acts at full strength); σ→0 means protein leaks freely,
          and the oncotic gradient can no longer oppose filtration even if πc itself is numerically unchanged —
          exactly what happens in sepsis and burns, where the vessel wall itself becomes the problem, not just
          the pressures.
        </Note>
      </Panel>
    </div>
  );
}
function CapillarySVG({ NFP }) {
  const filtering = NFP > 0.05, absorbing = NFP < -0.05;
  const n = Math.min(6, Math.max(1, Math.round(Math.abs(NFP))));
  return (
    <svg viewBox="0 0 300 100" style={{ width: "100%", height: 100 }}>
      <line x1="20" y1="50" x2="280" y2="50" stroke={C.capillary} strokeWidth="10" strokeLinecap="round" opacity="0.5" />
      <text x="20" y="30" fontSize="10" fill={C.muted}>Arterial end</text>
      <text x="240" y="30" fontSize="10" fill={C.muted}>Venous end</text>
      {[...Array(n)].map((_, i) => {
        const x = 60 + i * 35;
        return filtering
          ? <path key={i} d={`M${x},50 L${x - 6},68 M${x},50 L${x + 6},68`} stroke={C.bad} strokeWidth="2.5" fill="none" />
          : absorbing
            ? <path key={i} d={`M${x - 6},68 L${x},50 M${x + 6},68 L${x},50`} stroke={C.good} strokeWidth="2.5" fill="none" />
            : null;
      })}
      <text x="150" y="90" fontSize="10" fill={C.muted} textAnchor="middle">
        {filtering ? "arrows: net fluid movement into interstitium" : absorbing ? "arrows: net fluid movement into capillary" : "near-balanced — no dominant arrows"}
      </text>
    </svg>
  );
}

/* ---------------------------------------------------------------
   TAB 2 — Lymphatics and edema
----------------------------------------------------------------*/
const EDEMA_CAUSES = [
  { cause: "↑Capillary hydrostatic pressure (Pc)", example: "Heart failure, venous obstruction, fluid overload", mechanism: "Directly increases the outward Starling gradient" },
  { cause: "↓Plasma oncotic pressure (πc)", example: "Nephrotic syndrome, cirrhosis, malnutrition/kwashiorkor", mechanism: "Weakens the inward-pulling force that normally opposes filtration" },
  { cause: "↑Capillary permeability (↓σ)", example: "Sepsis, burns, allergic reactions/histamine, inflammation", mechanism: "Protein leaks into the interstitium, raising πif and collapsing the oncotic gradient" },
  { cause: "Lymphatic obstruction/insufficiency", example: "Filariasis, tumor invasion, post-surgical lymph node removal", mechanism: "Normal Starling forces may be unchanged, but filtered fluid/protein can no longer be returned — a distinct mechanism from all the above" },
];

function LymphaticsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Waves}>Why the Lymphatic System Is Required at All</SectionTitle>
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 2 }}>
          Because NFP is normally slightly positive (net filtration, not net absorption), a small amount of
          fluid and the small amount of protein that does escape the capillary wall would accumulate in the
          interstitium indefinitely if nothing removed it. Lymphatic capillaries — blind-ended, highly
          permeable, one-way-valved vessels — pick up this excess interstitial fluid and protein and return it
          to the venous circulation (via the thoracic duct into the left subclavian vein, and the right
          lymphatic duct on the right). This return is not optional plumbing; it is the mechanism that keeps
          the Starling balance from ever running away, and it is also the <b style={{ color: C.text }}>only</b>
          route by which interstitial protein gets back into plasma.
        </div>
      </Panel>

      <Panel>
        <SectionTitle icon={Droplets}>Edema — Four Distinct Mechanisms, One Common Endpoint</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {EDEMA_CAUSES.map((r, i) => (
            <div key={i} style={{ padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.copper }}>{r.cause}</div>
              <div style={{ fontSize: 12.5, color: C.text, marginTop: 3 }}>{r.example}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{r.mechanism}</div>
            </div>
          ))}
        </div>
        <Note>
          Exam-critical distinction: the first three mechanisms are Starling-force disturbances (this tab's
          equation), while <b style={{ color: C.text }}>lymphatic obstruction</b> is fundamentally different —
          the pressures and permeability may be entirely normal, but the "drain" is blocked. This is why
          lymphedema (e.g., after axillary lymph node dissection) does not respond to diuretics the way
          cardiac or hypoalbuminemic edema does — diuretics change Pc, not lymphatic outflow capacity.
        </Note>
      </Panel>

      <Panel>
        <SectionTitle icon={BookOpen}>Safety Factors Against Edema</SectionTitle>
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 2 }}>
          Guyton describes several negative-feedback "safety factors" that normally keep interstitial fluid
          from accumulating until these mechanisms are substantially overwhelmed: (1) as interstitial fluid
          volume rises, <b style={{ color: C.text }}>lymph flow can increase roughly 10–50 fold</b> to compensate;
          (2) rising interstitial fluid pressure itself opposes further filtration (a self-limiting rise in
          Pif); (3) as fluid filters out, plasma protein becomes more concentrated (πc rises) while
          interstitial protein is washed out/diluted (πif falls), both of which pull the Starling balance back
          toward absorption. Clinically visible edema generally means these safety factors have already been
          substantially exceeded, not that they failed from the first small pressure change.
        </div>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   TAB 3 — Quiz
----------------------------------------------------------------*/
const QUESTIONS = [
  {
    stem: "Which transport mechanism accounts for the overwhelming majority of O₂, CO₂, and glucose exchange across the capillary wall?",
    options: ["Bulk flow driven by Starling (hydrostatic/oncotic) forces", "Diffusion, driven by concentration gradients", "Active transport requiring ATP at the capillary wall", "Vesicular transport (pinocytosis)"],
    correct: 1,
    explain: "Diffusion, not filtration, is responsible for essentially all everyday nutrient and gas exchange — its total capacity vastly exceeds net capillary filtration, which instead governs fluid balance/edema, not nutrient delivery."
  },
  {
    stem: "A drug cannot reach brain tissue despite adequate cerebral blood flow. Which capillary structural feature best explains this?",
    options: ["Sinusoidal capillaries with large gaps", "Fenestrated capillaries with open pores", "Continuous capillaries joined by tight junctions (the blood-brain barrier)", "Absence of a basement membrane"],
    correct: 2,
    explain: "Cerebral capillaries are continuous type with tight intercellular junctions, forming the blood-brain barrier — this severely restricts paracellular passage of polar/large molecules, unlike fenestrated or sinusoidal beds."
  },
  {
    stem: "Using Guyton's reference numbers (Pc=17.3, Pif=−3, πc=28, πif=8 mmHg, σ=1), what is the approximate Net Filtration Pressure, and what does this value mean physiologically?",
    options: ["NFP ≈ +20 mmHg — massive filtration exceeding lymphatic capacity", "NFP ≈ +0.3 mmHg — filtration and absorption are nearly balanced across the capillary bed", "NFP ≈ −20 mmHg — net absorption dominates throughout the capillary", "NFP = 0 exactly — no fluid movement occurs at all"],
    correct: 1,
    explain: "NFP = (17.3−(−3)) − (28−8) = 20.3 − 20 = +0.3 mmHg — only a slight net filtration, consistent with the small amount of fluid that the lymphatics need to return (a few liters per day), not a large imbalance."
  },
  {
    stem: "A patient with sepsis develops diffuse edema despite a normal serum albumin and normal capillary hydrostatic pressure. What is the most likely mechanism?",
    options: ["Increased plasma oncotic pressure", "Decreased reflection coefficient (σ) — protein leaks through damaged capillary walls, raising interstitial oncotic pressure and collapsing the effective oncotic gradient", "Lymphatic hyperplasia", "Isolated increase in interstitial hydrostatic pressure with no other change"],
    correct: 1,
    explain: "In sepsis/burns, capillary wall integrity itself is damaged (↓σ), letting protein leak into the interstitium; this raises πif and effectively neutralizes the oncotic pull that normally opposes filtration, causing edema even with normal Pc and normal plasma albumin."
  },
  {
    stem: "A patient develops arm swelling after axillary lymph node dissection for breast cancer, but has normal cardiac and renal function and normal serum albumin. Why does this edema respond poorly to diuretics?",
    options: ["Because diuretics only work on capillary hydrostatic pressure (Pc), and this edema's problem is impaired lymphatic drainage, not a Starling-force disturbance", "Because diuretics increase πc, worsening the edema", "Because lymphedema is caused by a low reflection coefficient, like sepsis", "Diuretics are actually first-line and highly effective for lymphedema"],
    correct: 0,
    explain: "Lymphedema results from loss of the lymphatic 'drain,' not from an abnormal Starling balance — Pc, πc, and σ can all be normal. Diuretics reduce intravascular/interstitial fluid via renal mechanisms but do not restore lymphatic outflow capacity, so they are largely ineffective here."
  },
  {
    stem: "As interstitial fluid volume begins to rise (early, pre-edema), which of the following is NOT one of the body's normal 'safety factors' that resists further fluid accumulation?",
    options: ["Lymph flow can increase roughly 10–50 fold", "Rising interstitial hydrostatic pressure (Pif) itself opposes further filtration", "Plasma protein becomes more concentrated (↑πc) as fluid filters out, while interstitial protein is diluted (↓πif)", "Capillary hydrostatic pressure automatically falls to zero to halt filtration"],
    correct: 3,
    explain: "Capillary hydrostatic pressure does not automatically fall to zero — that is not one of the recognized safety factors. The real safety factors are increased lymphatic flow, a self-limiting rise in Pif, and the concentrating/diluting effects on πc and πif that both push the balance back toward absorption."
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
