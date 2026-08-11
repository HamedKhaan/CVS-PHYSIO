import React, { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceDot, ReferenceLine, ResponsiveContainer
} from "recharts";
import {
  HeartPulse, Activity, GitMerge, Brain, RotateCcw,
  CheckCircle2, XCircle, ChevronLeft, Droplet
} from "lucide-react";

/* ---------------------------------------------------------------
   TOKENS — identical system to Module 1, project continuity.
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
  { id: "cardiac", label: "Cardiac Function Curve", icon: HeartPulse },
  { id: "venous", label: "Venous Return Curve", icon: Activity },
  { id: "combined", label: "Graphical Intersection", icon: GitMerge },
  { id: "quiz", label: "Self-Test (خودآزمایی)", icon: Brain },
];

export default function CVSFrankStarlingVenousReturn() {
  const [tab, setTab] = useState("cardiac");
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
            <div style={{ fontSize: 18, fontWeight: 800 }}>Cardiovascular Physiology — Module 2: Cardiac Output & Venous Return</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>Guyton Ch.20 — Guyton's classic graphical method for equilibrium CO (روش گرافیکی گایتون برای CO تعادلی). Builds on Module 1 (Ohm's Law, Resistance)</div>
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
        {tab === "cardiac" && <CardiacTab />}
        {tab === "venous" && <VenousTab />}
        {tab === "combined" && <CombinedTab />}
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
        {value}<span style={{ fontSize: 12, color: C.muted, marginRight: 3 }}>{unit}</span>
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
   MODEL — cardiac function (Frank-Starling) and venous return
   curves, in Guyton's real reference units (L/min, mmHg).
----------------------------------------------------------------*/
function cardiacFunction(RAP, contractility, afterload) {
  // saturating (Frank-Starling) curve: rises steeply near RAP≈0, plateaus at high RAP.
  const capacity = Math.max(1, 15 * contractility - afterload);
  const k = 1.5;
  const co = capacity * (1 - Math.exp(-k * (RAP + 4) / capacity));
  return Math.max(0, co);
}
function venousReturn(RAP, Psf, RVR) {
  if (RAP >= Psf) return 0;
  let vr = (Psf - RAP) / RVR;
  const plateau = (Psf / RVR) * 1.25; // great-vein collapse plateau at very negative RAP
  if (RAP < -2) vr = plateau;
  return Math.max(0, vr);
}
function findEquilibrium(cf, vr) {
  let best = { RAP: 0, diff: Infinity };
  for (let RAP = -4; RAP <= 20; RAP += 0.05) {
    const d = Math.abs(cf(RAP) - vr(RAP));
    if (d < best.diff) best = { RAP, diff: d, CO: (cf(RAP) + vr(RAP)) / 2 };
  }
  return best;
}

const CARDIAC_SCENARIOS = {
  normal: { label: "Normal", contractility: 1, afterload: 0 },
  chf: { label: "Heart failure (↓contractility)", contractility: 0.45, afterload: 0 },
  inotrope: { label: "Inotrope/Digitalis (↑contractility)", contractility: 1.4, afterload: 0 },
  hypertension: { label: "Chronic ↑afterload (HTN)", contractility: 1, afterload: 4 },
};
const VENOUS_SCENARIOS = {
  normal: { label: "Normal", Psf: 7, RVR: 1.4 },
  hemorrhage: { label: "Hemorrhage (↓blood volume)", Psf: 4, RVR: 1.4 },
  transfusion: { label: "Transfusion/Overload (↑volume)", Psf: 11, RVR: 1.4 },
  sympathetic: { label: "Sympathetic stress (↑venous tone)", Psf: 9.5, RVR: 1.2 },
  spinal: { label: "Spinal shock (venodilation)", Psf: 3, RVR: 1.6 },
  avfistula: { label: "AV Fistula (↓resistance to VR)", Psf: 7, RVR: 0.6 },
};

/* ---------------------------------------------------------------
   TAB 1 — Cardiac (Frank-Starling) function curve
----------------------------------------------------------------*/
function CardiacTab() {
  const [contractility, setContractility] = useState(1);
  const [afterload, setAfterload] = useState(0);

  const curve = useMemo(() => {
    const arr = [];
    for (let RAP = -4; RAP <= 20; RAP += 0.5) {
      arr.push({ RAP, CO: +cardiacFunction(RAP, contractility, afterload).toFixed(2), Normal: +cardiacFunction(RAP, 1, 0).toFixed(2) });
    }
    return arr;
  }, [contractility, afterload]);

  function applyScenario(key) {
    const s = CARDIAC_SCENARIOS[key];
    setContractility(s.contractility); setAfterload(s.afterload);
  }
  const coAtZero = cardiacFunction(0, contractility, afterload);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={HeartPulse}>Cardiac (Ventricular) Function Curve — Frank-Starling</SectionTitle>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curve} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="RAP" stroke={C.muted} fontSize={11} type="number" domain={[-4, 20]}
                label={{ value: "RAP — Right Atrial Pressure (mmHg)", position: "insideBottom", offset: -3, fill: C.muted, fontSize: 10.5 }} />
              <YAxis stroke={C.muted} fontSize={11} domain={[0, 18]}
                label={{ value: "Cardiac Output (L/min)", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 10.5 }} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {(contractility !== 1 || afterload !== 0) &&
                <Line type="monotone" dataKey="Normal" stroke={C.muted} strokeWidth={1.5} strokeDasharray="5 3" dot={false} opacity={0.6} />}
              <Line type="monotone" dataKey="CO" stroke={C.artery} strokeWidth={2.5} dot={false} name="CO (current)" />
              <ReferenceLine x={0} stroke={C.faint} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <Readout label="CO at RAP=0" value={coAtZero.toFixed(1)} unit="L/min" color={C.artery} />
        </div>
      </Panel>

      <Panel>
        <SectionTitle>Controls</SectionTitle>
        <Slider label="Contractility (inotropy, اینوتروپی) — SNS, digoxin, CHF" min={0.3} max={1.8} step={0.02} value={contractility}
          onChange={setContractility} display={`${contractility.toFixed(2)}×`} color={C.good} />
        <Slider label="Afterload — systemic TPR or valvular stenosis (تنگی)" min={0} max={8} step={0.2} value={afterload}
          onChange={setAfterload} display={`${afterload.toFixed(1)}`} color={C.bad} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          {Object.entries(CARDIAC_SCENARIOS).map(([k, s]) => (
            <button key={k} onClick={() => applyScenario(k)} style={toggleStyle(false)}>{s.label}</button>
          ))}
        </div>
      </Panel>

      <Panel>
        <Note>
          The central Frank-Starling point: <b style={{ color: C.text }}>increasing preload (RAP)</b> stretches
          myocardial fibers further and raises stroke volume (mechanism: near-optimal actin-myosin overlap,
          پوشش‌همپوشانی رشته‌های عضلانی) — this is movement <b style={{ color: C.text }}>along</b> the x-to-y
          curve, not a shift of the curve itself. By contrast, changing contractility shifts the curve
          <b style={{ color: C.text }}> up or down</b> (a vertical shift, independent of preload), and rising
          afterload pulls the curve <b style={{ color: C.text }}>down and to the right</b>. Distinguishing
          "movement along the curve" from "a shift of the curve" is the single most common exam-design pattern
          in this topic.
        </Note>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   TAB 2 — Venous return curve
----------------------------------------------------------------*/
function VenousTab() {
  const [Psf, setPsf] = useState(7);
  const [RVR, setRVR] = useState(1.4);

  const curve = useMemo(() => {
    const arr = [];
    for (let RAP = -4; RAP <= 20; RAP += 0.5) {
      arr.push({ RAP, VR: +venousReturn(RAP, Psf, RVR).toFixed(2), Normal: +venousReturn(RAP, 7, 1.4).toFixed(2) });
    }
    return arr;
  }, [Psf, RVR]);

  function applyScenario(key) {
    const s = VENOUS_SCENARIOS[key];
    setPsf(s.Psf); setRVR(s.RVR);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Activity}>Venous Return Curve</SectionTitle>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curve} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="RAP" stroke={C.muted} fontSize={11} type="number" domain={[-4, 20]}
                label={{ value: "RAP — Right Atrial Pressure (mmHg)", position: "insideBottom", offset: -3, fill: C.muted, fontSize: 10.5 }} />
              <YAxis stroke={C.muted} fontSize={11} domain={[0, 14]}
                label={{ value: "Venous Return (L/min)", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 10.5 }} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {(Psf !== 7 || RVR !== 1.4) &&
                <Line type="monotone" dataKey="Normal" stroke={C.muted} strokeWidth={1.5} strokeDasharray="5 3" dot={false} opacity={0.6} />}
              <Line type="monotone" dataKey="VR" stroke={C.vein} strokeWidth={2.5} dot={false} name="VR (current)" />
              <ReferenceDot x={Psf} y={0} r={5} fill={C.copper} stroke="none" />
              <ReferenceLine x={0} stroke={C.faint} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <Readout label="Mean Systemic Filling Pressure (Psf)" value={Psf.toFixed(1)} unit="mmHg" color={C.copper} />
          <Readout label="Resistance to Venous Return (RVR)" value={RVR.toFixed(2)} unit="mmHg/(L/min)" color={C.hormone} />
        </div>
      </Panel>

      <Panel>
        <SectionTitle>Controls</SectionTitle>
        <Slider label="Psf — Mean Systemic Filling Pressure (blood volume + venous tone)" min={0} max={16} step={0.2} value={Psf}
          onChange={setPsf} display={`${Psf.toFixed(1)} mmHg`} color={C.copper} />
        <Slider label="RVR — Resistance to Venous Return (~0.8 venous + 0.2 arterial)" min={0.4} max={3} step={0.05} value={RVR}
          onChange={setRVR} display={`${RVR.toFixed(2)}`} color={C.hormone} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          {Object.entries(VENOUS_SCENARIOS).map(([k, s]) => (
            <button key={k} onClick={() => applyScenario(k)} style={toggleStyle(false)}>{s.label}</button>
          ))}
        </div>
      </Panel>

      <Panel>
        <Note>
          Key points: <b style={{ color: C.text }}>Psf</b> (the curve's x-intercept, where VR=0) rises or falls
          with blood volume and venous tone (تون وریدی) — this "filling pressure" is defined as the pressure
          that would equalize throughout the entire circulation if the heart were stopped (~7 mmHg normally).
          The curve's slope equals 1/RVR; RVR combines venous resistance (the larger contributor, since veins
          hold most of the blood volume/capacitance) and arterial resistance. Subtle point: at very negative
          RAP (below ~−2 mmHg), the vena cava <b style={{ color: C.text }}>collapses</b> (فروریزش) as it enters
          the thorax, and the curve hits a ceiling (plateau) — VR can no longer rise with further suction.
        </Note>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   TAB 3 — Combined graphical intersection (equilibrium)
----------------------------------------------------------------*/
function CombinedTab() {
  const [contractility, setContractility] = useState(1);
  const [afterload, setAfterload] = useState(0);
  const [Psf, setPsf] = useState(7);
  const [RVR, setRVR] = useState(1.4);

  const cf = RAP => cardiacFunction(RAP, contractility, afterload);
  const vr = RAP => venousReturn(RAP, Psf, RVR);

  const curve = useMemo(() => {
    const arr = [];
    for (let RAP = -4; RAP <= 20; RAP += 0.25) {
      arr.push({ RAP, CO: +cf(RAP).toFixed(2), VR: +vr(RAP).toFixed(2) });
    }
    return arr;
  }, [contractility, afterload, Psf, RVR]);

  const eq = useMemo(() => findEquilibrium(cf, vr), [contractility, afterload, Psf, RVR]);

  const COMBINED_PRESETS = [
    { label: "Normal", contractility: 1, afterload: 0, Psf: 7, RVR: 1.4 },
    { label: "Uncompensated hemorrhage", contractility: 1, afterload: 0, Psf: 3.5, RVR: 1.4 },
    { label: "Acute heart failure", contractility: 0.4, afterload: 0, Psf: 7, RVR: 1.4 },
    { label: "CHF + compensatory fluid retention", contractility: 0.4, afterload: 0, Psf: 11, RVR: 1.4 },
    { label: "Exercise (↑contractility + ↑tone + ↓TPR)", contractility: 1.5, afterload: -2, Psf: 9, RVR: 0.9 },
    { label: "Tension pneumothorax/Tamponade (↑afterload to filling)", contractility: 0.7, afterload: 2, Psf: 7, RVR: 1.4 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={GitMerge}>Graphical Method — Curve Intersection and Equilibrium CO</SectionTitle>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curve} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="RAP" stroke={C.muted} fontSize={11} type="number" domain={[-4, 20]}
                label={{ value: "RAP (mmHg)", position: "insideBottom", offset: -3, fill: C.muted, fontSize: 10.5 }} />
              <YAxis stroke={C.muted} fontSize={11} domain={[0, 16]}
                label={{ value: "Flow (L/min)", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 10.5 }} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="CO" stroke={C.artery} strokeWidth={2.5} dot={false} name="Cardiac function" />
              <Line type="monotone" dataKey="VR" stroke={C.vein} strokeWidth={2.5} dot={false} name="Venous return" />
              <ReferenceDot x={eq.RAP} y={eq.CO} r={7} fill={C.copper} stroke="#fff" strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <Readout label="Equilibrium RAP" value={eq.RAP.toFixed(1)} unit="mmHg" color={C.copper} />
          <Readout label="Equilibrium CO" value={eq.CO.toFixed(2)} unit="L/min" color={C.copper} />
        </div>
      </Panel>

      <Panel>
        <SectionTitle>Controls</SectionTitle>
        <Slider label="Contractility" min={0.3} max={1.8} step={0.02} value={contractility}
          onChange={setContractility} display={`${contractility.toFixed(2)}×`} color={C.good} />
        <Slider label="Afterload" min={-3} max={8} step={0.2} value={afterload}
          onChange={setAfterload} display={`${afterload.toFixed(1)}`} color={C.bad} />
        <Slider label="Psf (Mean Systemic Filling Pressure)" min={0} max={16} step={0.2} value={Psf}
          onChange={setPsf} display={`${Psf.toFixed(1)} mmHg`} color={C.copper} />
        <Slider label="RVR (Resistance to Venous Return)" min={0.4} max={3} step={0.05} value={RVR}
          onChange={setRVR} display={`${RVR.toFixed(2)}`} color={C.hormone} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          {COMBINED_PRESETS.map((s, i) => (
            <button key={i} onClick={() => { setContractility(s.contractility); setAfterload(s.afterload); setPsf(s.Psf); setRVR(s.RVR); }}
              style={toggleStyle(false)}>{s.label}</button>
          ))}
        </div>
      </Panel>

      <Panel>
        <Note>
          Guyton's graphical method: the body must satisfy both equations simultaneously — the heart can only
          pump what returns to it (VR=CO at steady state). The intersection point is the only RAP and CO
          consistent with both systems at once. A classic, counter-intuitive, exam-favorite point: a pure
          <b style={{ color: C.text }}> increase in contractility</b> (with no change in blood volume) raises
          CO but <b style={{ color: C.text }}>lowers</b> the equilibrium RAP (a stronger heart empties the
          atrium faster and more completely). Conversely, the only durable way to raise CO without leaning on
          the heart itself is to shift the venous return curve (blood volume or venous tone, تون وریدی) — no
          matter how strong the heart is, it cannot sustain CO without adequate venous return. This is the
          basis of the CO fall in hemorrhage, occurring even before any drop in contractility.
        </Note>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   TAB 4 — Quiz
----------------------------------------------------------------*/
const QUESTIONS = [
  {
    stem: "A pure increase in preload (RAP), with no change in contractility, does what to the ventricular (Frank-Starling) function curve?",
    options: ["Shifts the curve upward", "Moves rightward along the same curve (not a shift of the curve)", "Shifts the curve downward", "Produces no change at all"],
    correct: 1,
    explain: "Preload is the x-axis; changing preload means moving along the same curve, not shifting it. Only contractility and afterload shift the curve itself."
  },
  {
    stem: "Which of the following shifts the cardiac function curve upward?",
    options: ["Increased RAP", "Decreased venous return", "Increased contractility (e.g., sympathetic stimulation)", "Increased afterload"],
    correct: 2,
    explain: "Increased contractility (positive inotropy) produces more CO at every level of preload — a vertical shift upward. Increased afterload, by contrast, pulls the curve down."
  },
  {
    stem: "What exactly does the Mean Systemic Filling Pressure (Psf) represent?",
    options: ["Resting systolic blood pressure", "The pressure that would equalize throughout the entire circulation if the heart stopped and pressure everywhere equilibrated", "Left atrial pressure", "Peak left-ventricular pressure"],
    correct: 1,
    explain: "Psf is the equilibrium pressure across the whole circulatory system (arterial + venous) in the absence of cardiac pumping; it is mainly a function of blood volume and venous tone, not cardiac performance."
  },
  {
    stem: "In acute, uncompensated hemorrhage, what happens to the venous return curve and to equilibrium CO?",
    options: ["The VR curve shifts right and CO rises", "The VR curve shifts left (Psf↓), and the intersection point moves to a lower RAP and lower CO", "Only the slope of the VR curve changes, not its x-intercept", "The cardiac function curve shifts, not the VR curve"],
    correct: 1,
    explain: "Reduced blood volume lowers Psf and pulls the entire VR curve left/down; the intersection with the (unchanged) cardiac curve now occurs at a lower RAP and lower CO — this is the initial fall in CO in hemorrhagic shock, even before any change in cardiac contractility."
  },
  {
    stem: "Why does a pure increase in cardiac contractility (with no change in blood volume) typically lower the equilibrium RAP?",
    options: ["Because a stronger heart pumps less blood", "Because a stronger heart empties the right atrium faster and more completely, so RAP falls to reach the new equilibrium with the (unchanged) VR curve", "Because venous tone decreases", "Because Psf increases"],
    correct: 1,
    explain: "As the cardiac curve shifts upward (with the VR curve unchanged), the new intersection occurs at a lower RAP and higher CO — Guyton's classic counter-intuitive point: a stronger heart drains the venous system better, it does not congest it."
  },
  {
    stem: "Why does the venous return curve reach a ceiling (plateau) at very negative RAP (e.g., below −2 mmHg)?",
    options: ["Because the heart can no longer beat faster", "Because the vena cava collapses as it enters the thorax, preventing any further increase in flow from more suction", "Because arterial resistance becomes infinite", "Because Psf falls to zero"],
    correct: 1,
    explain: "The great veins have thin, collapsible walls; at very negative internal pressure, the vena cava walls collapse together where it enters the thorax, preventing venous return from rising further with additional suction — a physical ceiling, not a cardiac limitation."
  },
  {
    stem: "Which scenario shifts the VR curve right (↑Psf) AND decreases its slope (↓RVR) simultaneously, and is clinically linked to heavy exercise?",
    options: ["Spinal shock", "Hemorrhage", "Increased sympathetic venous tone + vasodilation of active skeletal muscle", "Cardiac tamponade"],
    correct: 2,
    explain: "In exercise, sympathetic stimulation raises venous tone (Psf↑) while vasodilation in active muscle beds lowers overall resistance to venous return (RVR↓, steeper slope) — combined with increased contractility, this sharply raises CO without a dangerous fall in RAP."
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
