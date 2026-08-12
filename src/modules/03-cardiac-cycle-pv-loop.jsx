import React, { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceDot, ReferenceLine, ResponsiveContainer, ReferenceArea
} from "recharts";
import {
  HeartPulse, Activity, Volume2, Brain, RotateCcw,
  CheckCircle2, XCircle, ChevronLeft, Waves, BookOpen, Ruler
} from "lucide-react";
import ChartContainer from "../components/ChartContainer";

/* ---------------------------------------------------------------
   TOKENS — same system as Modules 1–2, project continuity.
----------------------------------------------------------------*/
const C = {
  bg: "var(--c-bg)", panel: "var(--c-panel)", panel2: "var(--c-panel2)", border: "var(--c-border)",
  text: "var(--c-text)", muted: "var(--c-muted)", faint: "var(--c-faint)",
  copper: "var(--c-copper)", copperDim: "var(--c-copper-dim)",
  artery: "var(--c-artery)", vein: "var(--c-vein)", capillary: "var(--c-capillary)",
  hormone: "var(--c-hormone)", good: "var(--c-good)", bad: "var(--c-bad)",
};
const mono = { fontFamily: "ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace" };

const MODULES = [
  { id: "foundations", label: "Foundations", icon: BookOpen },
  { id: "wiggers", label: "Wiggers Diagram", icon: Activity },
  { id: "pvloop", label: "Pressure-Volume Loop", icon: HeartPulse },
  { id: "sounds", label: "Heart Sounds & Valves", icon: Volume2 },
  { id: "quiz", label: "Self-Test (خودآزمایی)", icon: Brain },
];

export default function CVSCardiacCyclePVLoop() {
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
            <div style={{ fontSize: 18, fontWeight: 800 }}>Cardiovascular Physiology — Module 3: The Cardiac Cycle & Pressure-Volume Loop</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
              Guyton Ch.9 — starts from muscle-level basics, then builds up to Module 2's contractility, preload, and afterload terms (پایه سلولی این اصطلاحات)
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
        {tab === "wiggers" && <WiggersTab />}
        {tab === "pvloop" && <PVLoopTab />}
        {tab === "sounds" && <SoundsTab />}
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
   TAB 0 — Foundations: where preload/afterload/contractility, EDV/
   ESV/SV/EF, and the ESPVR/EDPVR curves actually come from.
----------------------------------------------------------------*/
function sarcomereTension(L) {
  // Guyton's classic length-tension curve (schematic, μm): ascending limb,
  // a short plateau of maximal overlap, then a descending limb.
  let active;
  if (L < 1.6) active = 0;
  else if (L < 2.0) active = ((L - 1.6) / 0.4) * 100;
  else if (L <= 2.2) active = 100;
  else if (L < 3.6) active = 100 * (1 - (L - 2.2) / 1.4);
  else active = 0;
  const passive = L > 2.0 ? 6 * (Math.exp(1.6 * Math.max(0, L - 2.0)) - 1) : 0; // parallel elastic (titin) component, exponential
  return { active: Math.max(0, active), passive, total: Math.max(0, active) + passive };
}

function FoundationsTab() {
  const [sarcLen, setSarcLen] = useState(2.1);
  const [radius, setRadius] = useState(1);
  const [thickness, setThickness] = useState(1);
  const [pressure, setPressure] = useState(1);

  const tensionCurve = useMemo(() => {
    const arr = [];
    for (let L = 1.4; L <= 3.6; L += 0.05) {
      const t = sarcomereTension(L);
      arr.push({ L: +L.toFixed(2), Active: +t.active.toFixed(1), Passive: +Math.min(100, t.passive).toFixed(1) });
    }
    return arr;
  }, []);
  const currentT = sarcomereTension(sarcLen);

  const T = (pressure * 100 * radius) / 2; // Law of Laplace, relative units (P baseline=100)
  const stress = T / thickness;

  const LAPLACE_SCENARIOS = [
    { label: "Normal", radius: 1, thickness: 1, pressure: 1 },
    { label: "Dilated cardiomyopathy (↑radius, ↓thickness)", radius: 1.6, thickness: 0.7, pressure: 1 },
    { label: "Concentric hypertrophy / chronic HTN (↑thickness)", radius: 1, thickness: 1.6, pressure: 1.4 },
    { label: "Acute pressure overload (↑pressure only)", radius: 1, thickness: 1, pressure: 1.8 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={BookOpen}>Preload, Afterload, Contractility — Plain Definitions</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.vein}` }}>
            <div style={{ fontWeight: 700, color: C.vein, fontSize: 13 }}>Preload (پیش‌بار)</div>
            <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.9, marginTop: 4 }}>
              The degree of myocardial fiber stretch just before contraction begins. Clinically approximated by
              End-Diastolic Volume (EDV) or End-Diastolic Pressure (EDP). Determined mainly by venous return
              (Module 2's VR curve) — preload is what fills the ventricle, not a property of the muscle itself.
            </div>
          </div>
          <div style={{ padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.artery}` }}>
            <div style={{ fontWeight: 700, color: C.artery, fontSize: 13 }}>Afterload (پس‌بار)</div>
            <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.9, marginTop: 4 }}>
              The load, or resistance, the ventricle must contract against to eject blood — approximated by
              aortic pressure or arterial elastance (Ea, Module 1's TPR concept). It is what the muscle pushes
              against, not what stretches it beforehand.
            </div>
          </div>
          <div style={{ padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.hormone}` }}>
            <div style={{ fontWeight: 700, color: C.hormone, fontSize: 13 }}>Contractility (قدرت انقباضی)</div>
            <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.9, marginTop: 4 }}>
              The intrinsic strength of contraction at a <i>given</i> preload and afterload — independent of
              loading conditions. Set at the cellular level by how much Ca²⁺ becomes available to the
              contractile proteins (see excitation-contraction coupling below); this is what sympathetic
              stimulation, digoxin, and heart failure change.
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <SectionTitle icon={Ruler}>Where Frank-Starling Actually Comes From: the Sarcomere Length-Tension Curve</SectionTitle>
        <ChartContainer height={220}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tensionCurve} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="L" type="number" domain={[1.4, 3.6]} stroke={C.muted} fontSize={11}
                label={{ value: "Sarcomere length (μm)", position: "insideBottom", offset: -3, fill: C.muted, fontSize: 10.5 }} />
              <YAxis stroke={C.muted} fontSize={11} domain={[0, 100]}
                label={{ value: "Tension (% of max)", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 10.5 }} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="Active" stroke={C.artery} strokeWidth={2.4} dot={false} name="Active tension" />
              <Line type="monotone" dataKey="Passive" stroke={C.vein} strokeWidth={1.8} strokeDasharray="4 3" dot={false} name="Passive (elastic) tension" />
              <ReferenceDot x={sarcLen} y={currentT.active} r={5} fill={C.copper} stroke="none" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <Slider label="Sarcomere length (stretch, کشش سارکومر)" min={1.4} max={3.6} step={0.02} value={sarcLen}
          onChange={setSarcLen} display={`${sarcLen.toFixed(2)} μm`} color={C.copper} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Readout label="Active tension" value={currentT.active.toFixed(0)} unit="% max" color={C.artery} />
        </div>
        <Note>
          Every point on Module 2's Frank-Starling curve and every point on the PV-loop's EDPVR is ultimately a
          single sarcomere sitting somewhere on <i>this</i> curve. Optimal actin-myosin filament overlap occurs
          at ~2.0–2.2 μm (the plateau — maximal number of cross-bridges can form) — this is the physical basis
          of "more stretch → more force," but only up to this point. The normal heart operates on the
          <b style={{ color: C.text }}> ascending limb</b>, well below the plateau, which is exactly why
          increasing preload almost always increases force in vivo — the descending limb (over-stretch, force
          falls) is rarely reached physiologically except in severely dilated, failing hearts, where it
          contributes to a vicious cycle of worsening function. The passive (elastic, titin-based) curve rising
          at high stretch is the cellular ancestor of the whole-ventricle EDPVR curve seen in the PV-Loop tab —
          both are physiologically exponential (steep at high volume, flat at low volume), not linear.
        </Note>
      </Panel>

      <Panel>
        <SectionTitle icon={Ruler}>Law of Laplace — Wall Tension, Radius, and Thickness</SectionTitle>
        <div style={{ fontSize: 18, textAlign: "center", ...mono, color: C.copper, margin: "6px 0 14px" }}>
          T ≈ (P × r) / 2 &nbsp;|&nbsp; Wall stress σ = T / h
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Readout label="Wall tension (T)" value={T.toFixed(0)} unit="relative" color={C.artery} />
          <Readout label="Wall stress (σ)" value={stress.toFixed(0)} unit="relative" color={C.bad} />
        </div>
        <Slider label="Chamber radius (r) — dilation" min={0.5} max={2} step={0.02} value={radius}
          onChange={setRadius} display={`${radius.toFixed(2)}×`} color={C.artery} />
        <Slider label="Wall thickness (h) — hypertrophy" min={0.4} max={2} step={0.02} value={thickness}
          onChange={setThickness} display={`${thickness.toFixed(2)}×`} color={C.hormone} />
        <Slider label="Intracavitary pressure (P)" min={0.5} max={2} step={0.02} value={pressure}
          onChange={setPressure} display={`${pressure.toFixed(2)}×`} color={C.vein} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          {LAPLACE_SCENARIOS.map((s, i) => (
            <button key={i} onClick={() => { setRadius(s.radius); setThickness(s.thickness); setPressure(s.pressure); }}
              style={toggleStyle(false)}>{s.label}</button>
          ))}
        </div>
        <Note>
          For a chamber approximated as a thin-walled sphere, the wall must generate more tension to hold the
          same internal pressure as the chamber gets <b style={{ color: C.text }}>bigger</b> (↑r) — this is why
          a <b style={{ color: C.text }}>dilated</b> ventricle is mechanically inefficient: it needs more
          tension (more O₂, more sarcomere force) to generate the same pressure than a normal-sized one, which
          worsens dysfunction — a vicious cycle in systolic heart failure. Conversely, a chamber that becomes
          <b style={{ color: C.text }}> thicker</b> (↑h, concentric hypertrophy) reduces wall stress for the
          same pressure — the compensatory response to chronic pressure overload (e.g., long-standing
          hypertension or aortic stenosis), at the cost of impaired relaxation and diastolic stiffness (this is
          exactly how HFpEF, seen in the PV-Loop tab, develops).
        </Note>
      </Panel>

      <Panel>
        <SectionTitle icon={BookOpen}>Excitation-Contraction Coupling — the Cellular Root of Contractility</SectionTitle>
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 2 }}>
          An action potential opens L-type Ca²⁺ channels in the sarcolemma; the resulting Ca²⁺ influx triggers
          <b style={{ color: C.text }}> Calcium-Induced Calcium Release (CICR)</b> from the sarcoplasmic
          reticulum — a much larger internal Ca²⁺ store. Cytosolic Ca²⁺ binds troponin C, shifting tropomyosin
          and exposing myosin-binding sites on actin, allowing cross-bridge cycling (تشکیل و شکست پل‌های
          عرضی). Anything that raises the amount of Ca²⁺ reaching the contractile proteins —
          <b style={{ color: C.text }}> sympathetic stimulation</b> (β1 → more Ca²⁺ channel opening),
          <b style={{ color: C.text }}> digoxin</b> (inhibits Na⁺/K⁺-ATPase → less Na⁺/Ca²⁺ exchanger-driven
          Ca²⁺ extrusion → more intracellular Ca²⁺) — increases contractility (steepens ESPVR/Ees). Anything
          that impairs this cascade (ischemia, acidosis, β-blocker overdose, myocardial fibrosis) decreases it.
        </div>
      </Panel>

      <Panel>
        <SectionTitle icon={BookOpen}>Basic Volume/Pressure Vocabulary</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            ["EDV", "End-Diastolic Volume", "~120 mL", "Volume just before contraction begins (= preload target)"],
            ["ESV", "End-Systolic Volume", "~50 mL", "Volume remaining just after ejection ends"],
            ["SV", "Stroke Volume = EDV − ESV", "~70 mL", "Volume ejected per beat"],
            ["EF", "Ejection Fraction = SV / EDV", "~55–65%", "Fraction of EDV ejected — the standard systolic-function index"],
            ["CO", "Cardiac Output = SV × HR", "~5 L/min", "Total forward flow per minute (links to Module 2)"],
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 10px", background: C.panel2, borderRadius: 8, alignItems: "baseline" }}>
              <span style={{ ...mono, fontSize: 13, fontWeight: 800, color: C.copper, width: 40, flexShrink: 0 }}>{r[0]}</span>
              <span style={{ fontSize: 12.5, flex: 1 }}>{r[1]} <span style={{ color: C.muted }}>— {r[3]}</span></span>
              <span style={{ ...mono, fontSize: 12, color: C.good, flexShrink: 0 }}>{r[2]}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   MODEL — piecewise-smooth Wiggers-style waveforms and a
   Suga/Sunagawa-style pressure-volume loop (ESPVR × Ea coupling).
----------------------------------------------------------------*/
const PHASES = [
  { key: "ivc", label: "Isovolumic Contraction", start: 0, end: 0.10 },
  { key: "ej", label: "Ejection", start: 0.10, end: 0.35 },
  { key: "ivr", label: "Isovolumic Relaxation", start: 0.35, end: 0.42 },
  { key: "rapid", label: "Rapid Filling", start: 0.42, end: 0.58 },
  { key: "diastasis", label: "Diastasis", start: 0.58, end: 0.88 },
  { key: "atrial", label: "Atrial Systole (Atrial Kick)", start: 0.88, end: 1.0 },
];
function ease(x) { return 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, x))); }

function wiggersPoint(frac, EDV, ESV, peakSys, aoDiastolic) {
  let LV, LA, Ao, Vol;
  const SV = EDV - ESV;
  if (frac < 0.10) { // isovolumic contraction
    const f = ease(frac / 0.10);
    LV = 6 + f * (aoDiastolic - 6);
    Vol = EDV;
    Ao = aoDiastolic;
    LA = 6;
  } else if (frac < 0.35) { // ejection
    const f = (frac - 0.10) / 0.25;
    const bulge = Math.sin(Math.PI * f) * (peakSys - aoDiastolic) * 0.9;
    LV = aoDiastolic + bulge + (f > 0.5 ? -(f - 0.5) * 0.4 * (peakSys - aoDiastolic) : 0);
    Ao = LV; // aortic valve open, tracks LV
    Vol = EDV - ease(f) * SV;
    LA = 6 + f * 2;
  } else if (frac < 0.42) { // isovolumic relaxation
    const f = ease((frac - 0.35) / 0.07);
    LV = peakSys * 0.55 * (1 - f) + 5 * f;
    Ao = aoDiastolic * 0.97 - f * 8; // dicrotic notch then slow diastolic runoff
    Vol = ESV;
    LA = 8;
  } else if (frac < 0.58) { // rapid filling
    const f = ease((frac - 0.42) / 0.16);
    LV = 5 + f * 1;
    Ao = aoDiastolic * 0.89 - f * 5;
    Vol = ESV + f * (EDV * 0.85 - ESV);
    LA = 8 - f * 3;
  } else if (frac < 0.88) { // diastasis
    const f = (frac - 0.58) / 0.30;
    LV = 6 + f * 1.5;
    Ao = aoDiastolic * 0.80 - f * 4;
    Vol = EDV * 0.85 + f * (EDV * 0.94 - EDV * 0.85);
    LA = 5 + f * 1;
  } else { // atrial kick
    const f = ease((frac - 0.88) / 0.12);
    LV = 7.5 + f * 2.5;
    Ao = aoDiastolic * 0.76 - f * 2;
    Vol = EDV * 0.94 + f * (EDV - EDV * 0.94);
    LA = 6 + f * 4;
  }
  return { LV: +LV.toFixed(1), LA: +LA.toFixed(1), Ao: +Ao.toFixed(1), Vol: +Vol.toFixed(1) };
}

function pvModel({ preload, afterload, contractility, stiffness }) {
  // EDPVR uses the physiologically-accepted exponential (Klotz-type) form,
  // not a parabola: P = a·(e^(b·(V−V0)) − 1). b (curvature) scales with
  // chamber stiffness — this is what actually steepens in HFpEF/hypertrophy.
  const V0_ed = 20, V0_es = 10;
  const a = 0.557;               // EDPVR scale constant (calibrated so EDV≈120 mL at Pfill=5 mmHg, stiffness=1)
  const b = 0.023 * stiffness;   // EDPVR curvature (1/mL)
  const Ees = 3.0 * contractility;
  const Ea = 1.714 * afterload;
  const EDV = V0_ed + Math.log(preload / a + 1) / b;
  const ESV = (Ea * EDV + Ees * V0_es) / (Ees + Ea);
  const SV = Math.max(0, EDV - ESV);
  const EF = EDV > 0 ? (SV / EDV) * 100 : 0;
  const peakSys = Ees * (ESV - V0_es);
  const aoDiastolic = peakSys * 0.72;
  const edp = a * (Math.exp(b * (EDV - V0_ed)) - 1);
  return { EDV, ESV, SV, EF, peakSys, aoDiastolic, edp, Ees, Ea, a, b, V0_ed, V0_es };
}
function edpvrCurve(a, b, V0, Vmax) {
  const arr = [];
  for (let V = V0; V <= Vmax; V += 2) arr.push({ V, P: +(a * (Math.exp(b * (V - V0)) - 1)).toFixed(2) });
  return arr;
}
function pvLoopPath(m) {
  const { EDV, ESV, a, b, V0_ed, peakSys, aoDiastolic, V0_es, Ees } = m;
  const pts = [];
  for (let V = ESV; V <= EDV; V += (EDV - ESV) / 14) pts.push({ V: +V.toFixed(1), P: +(a * (Math.exp(b * (V - V0_ed)) - 1)).toFixed(1) });
  pts.push({ V: +EDV.toFixed(1), P: +aoDiastolic.toFixed(1) });
  const nEj = 10;
  for (let i = 1; i <= nEj; i++) {
    const f = i / nEj, V = EDV - f * (EDV - ESV);
    const bulge = Math.sin(Math.PI * f) * (peakSys - aoDiastolic) * 0.35;
    const P = aoDiastolic + f * (peakSys - aoDiastolic) + bulge;
    pts.push({ V: +V.toFixed(1), P: +P.toFixed(1) });
  }
  pts.push({ V: +ESV.toFixed(1), P: +(a * (Math.exp(b * (ESV - V0_ed)) - 1)).toFixed(1) });
  return pts;
}

/* ---------------------------------------------------------------
   TAB 1 — Wiggers diagram
----------------------------------------------------------------*/
function WiggersTab() {
  const [preload, setPreload] = useState(5);
  const [afterload, setAfterload] = useState(1);
  const [contractility, setContractility] = useState(1);

  const m = useMemo(() => pvModel({ preload, afterload, contractility, stiffness: 1 }), [preload, afterload, contractility]);

  const data = useMemo(() => {
    const arr = [];
    for (let f = 0; f <= 1; f += 0.01) {
      const p = wiggersPoint(f, m.EDV, m.ESV, m.peakSys, m.aoDiastolic);
      arr.push({ t: +(f * 800).toFixed(0), ...p });
    }
    return arr;
  }, [m]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Activity}>Wiggers Diagram — Pressure Traces Across One Cardiac Cycle (نمودار ویگرز)</SectionTitle>
        <ChartContainer height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="t" stroke={C.muted} fontSize={11} domain={[0, 800]}
                label={{ value: "Time (ms) — one cycle at ~75 bpm", position: "insideBottom", offset: -3, fill: C.muted, fontSize: 10.5 }} />
              <YAxis stroke={C.muted} fontSize={11} domain={[0, 140]}
                label={{ value: "Pressure (mmHg)", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 10.5 }} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="LV" stroke={C.artery} strokeWidth={2.3} dot={false} name="LV pressure" />
              <Line type="monotone" dataKey="Ao" stroke={C.hormone} strokeWidth={2} dot={false} name="Aortic pressure" />
              <Line type="monotone" dataKey="LA" stroke={C.vein} strokeWidth={1.6} dot={false} name="LA pressure" />
              <ReferenceLine x={80} stroke={C.faint} strokeDasharray="3 3" label={{ value: "S1", fill: C.muted, fontSize: 10, position: "top" }} />
              <ReferenceLine x={280} stroke={C.faint} strokeDasharray="3 3" label={{ value: "S2", fill: C.muted, fontSize: 10, position: "top" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <ChartContainer height={130} style={{ marginTop: 6 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="t" stroke={C.muted} fontSize={10} domain={[0, 800]} />
              <YAxis stroke={C.muted} fontSize={10} domain={[0, 160]} label={{ value: "LV Volume (mL)", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 9.5 }} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Line type="monotone" dataKey="Vol" stroke={C.capillary} strokeWidth={2.2} dot={false} name="LV volume" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <Readout label="EDV" value={m.EDV.toFixed(0)} unit="mL" color={C.capillary} />
          <Readout label="ESV" value={m.ESV.toFixed(0)} unit="mL" color={C.capillary} />
          <Readout label="Stroke Volume" value={m.SV.toFixed(0)} unit="mL" color={C.good} />
          <Readout label="EF" value={m.EF.toFixed(0)} unit="%" color={C.hormone} />
        </div>
      </Panel>

      <Panel>
        <SectionTitle>Controls (کنترل‌ها)</SectionTitle>
        <Slider label="Preload — venous filling pressure (RAP-linked, Module 2)" min={2} max={12} step={0.2} value={preload}
          onChange={setPreload} display={`${preload.toFixed(1)} mmHg`} color={C.vein} />
        <Slider label="Afterload — arterial elastance (TPR-linked, Module 1)" min={0.5} max={2} step={0.02} value={afterload}
          onChange={setAfterload} display={`${afterload.toFixed(2)}×`} color={C.artery} />
        <Slider label="Contractility (Ees)" min={0.3} max={2} step={0.02} value={contractility}
          onChange={setContractility} display={`${contractility.toFixed(2)}×`} color={C.hormone} />
      </Panel>

      <Panel>
        <Note>
          Five mechanical events per beat (پنج فاز مکانیکی): <b style={{ color: C.text }}>isovolumic contraction</b> (انقباض ایزوولومیک —
          both valves closed, pressure rises with no volume change), <b style={{ color: C.text }}>ejection</b> (رانش خون — aortic
          valve open, LV and aortic pressure track together), <b style={{ color: C.text }}>isovolumic relaxation</b> (شل‌شدگی
          ایزوولومیک — both valves closed again, pressure falls sharply), <b style={{ color: C.text }}>rapid filling</b> (پرشدگی
          سریع — mitral valve opens once LV pressure drops below LA pressure), and <b style={{ color: C.text }}>atrial systole
          / atrial kick</b> (انقباض دهلیزی — contributes the final ~20% of EDV). The aortic pressure trace shows a
          <b style={{ color: C.text }}> dicrotic notch</b> (بریدگی دای‌کروتیک) at aortic valve closure — a brief backflow
          against the closing cusps, and a classic exam landmark for identifying S2 on a pressure tracing.
        </Note>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   TAB 2 — Pressure-Volume Loop
----------------------------------------------------------------*/
const PV_SCENARIOS = {
  normal: { label: "Normal", preload: 5, afterload: 1, contractility: 1, stiffness: 1 },
  hemorrhage: { label: "Hemorrhage (↓preload)", preload: 2, afterload: 1, contractility: 1, stiffness: 1 },
  overload: { label: "Volume overload (↑preload)", preload: 10, afterload: 1, contractility: 1, stiffness: 1 },
  htn: { label: "Hypertension / Aortic stenosis (↑afterload)", preload: 5, afterload: 1.7, contractility: 1, stiffness: 1 },
  hfref: { label: "Systolic HF — HFrEF (↓Ees, dilated)", preload: 6, afterload: 1, contractility: 0.4, stiffness: 0.7 },
  hfpef: { label: "Diastolic HF — HFpEF (↑stiffness, EF preserved)", preload: 10, afterload: 1, contractility: 1, stiffness: 1.7 },
  inotrope: { label: "Inotrope / Digitalis (↑Ees)", preload: 5, afterload: 1, contractility: 1.6, stiffness: 1 },
};

function PVLoopTab() {
  const [preload, setPreload] = useState(5);
  const [afterload, setAfterload] = useState(1);
  const [contractility, setContractility] = useState(1);
  const [stiffness, setStiffness] = useState(1);

  const m = useMemo(() => pvModel({ preload, afterload, contractility, stiffness }), [preload, afterload, contractility, stiffness]);
  const loop = useMemo(() => pvLoopPath(m), [m]);
  const edpvr = useMemo(() => edpvrCurve(m.a, m.b, m.V0_ed, Math.max(140, m.EDV + 15)), [m]);
  const espvrLine = useMemo(() => [
    { V: m.V0_es, P: 0 }, { V: m.EDV + 10, P: m.Ees * (m.EDV + 10 - m.V0_es) }
  ], [m]);

  function applyScenario(key) {
    const s = PV_SCENARIOS[key];
    setPreload(s.preload); setAfterload(s.afterload); setContractility(s.contractility); setStiffness(s.stiffness);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={HeartPulse}>Pressure-Volume Loop (حلقه فشار-حجم بطنی)</SectionTitle>
        <ChartContainer height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="V" type="number" domain={[0, 180]} stroke={C.muted} fontSize={11}
                label={{ value: "LV Volume (mL)", position: "insideBottom", offset: -3, fill: C.muted, fontSize: 10.5 }} allowDuplicatedCategory={false} />
              <YAxis dataKey="P" type="number" domain={[0, 160]} stroke={C.muted} fontSize={11}
                label={{ value: "LV Pressure (mmHg)", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 10.5 }} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line data={edpvr} dataKey="P" stroke={C.vein} strokeWidth={1.6} strokeDasharray="5 3" dot={false} name="EDPVR (compliance)" />
              <Line data={espvrLine} dataKey="P" stroke={C.hormone} strokeWidth={1.6} strokeDasharray="5 3" dot={false} name="ESPVR (contractility)" />
              <Line data={loop} dataKey="P" stroke={C.artery} strokeWidth={2.6} dot={false} name="PV loop" />
              <ReferenceDot x={m.EDV} y={m.edp} r={4} fill={C.copper} stroke="none" />
              <ReferenceDot x={m.ESV} y={m.peakSys} r={4} fill={C.copper} stroke="none" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <Readout label="EDV" value={m.EDV.toFixed(0)} unit="mL" color={C.capillary} />
          <Readout label="ESV" value={m.ESV.toFixed(0)} unit="mL" color={C.capillary} />
          <Readout label="Stroke Volume" value={m.SV.toFixed(0)} unit="mL" color={C.good} />
          <Readout label="EF" value={m.EF.toFixed(0)} unit="%" color={C.hormone} />
        </div>
      </Panel>

      <Panel>
        <SectionTitle>Controls (کنترل‌ها)</SectionTitle>
        <Slider label="Preload (filling pressure)" min={2} max={12} step={0.2} value={preload}
          onChange={setPreload} display={`${preload.toFixed(1)} mmHg`} color={C.vein} />
        <Slider label="Afterload (arterial elastance, Ea)" min={0.5} max={2} step={0.02} value={afterload}
          onChange={setAfterload} display={`${afterload.toFixed(2)}×`} color={C.artery} />
        <Slider label="Contractility (Ees — ESPVR slope)" min={0.3} max={2} step={0.02} value={contractility}
          onChange={setContractility} display={`${contractility.toFixed(2)}×`} color={C.hormone} />
        <Slider label="Diastolic stiffness (EDPVR curvature — hypertrophy/fibrosis)" min={0.4} max={3} step={0.05} value={stiffness}
          onChange={setStiffness} display={`${stiffness.toFixed(2)}×`} color={C.bad} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          {Object.entries(PV_SCENARIOS).map(([k, s]) => (
            <button key={k} onClick={() => applyScenario(k)} style={toggleStyle(false)}>{s.label}</button>
          ))}
        </div>
      </Panel>

      <Panel>
        <Note>
          Four corners of the loop = the four phases: bottom-right → <b style={{ color: C.text }}>isovolumic contraction</b> (vertical,
          up the right side), top-right → <b style={{ color: C.text }}>ejection</b> (leftward along the top), top-left →
          <b style={{ color: C.text }}> isovolumic relaxation</b> (vertical, down the left side), bottom-left →
          <b style={{ color: C.text }}> filling</b> (rightward along EDPVR). <b style={{ color: C.text }}>ESPVR</b> slope = Ees =
          load-independent index of contractility (شاخص انقباض‌پذیری مستقل از بار); <b style={{ color: C.text }}>EDPVR</b> curvature
          = chamber stiffness/compliance. Exam-critical distinction: <b style={{ color: C.text }}>HFrEF</b> shifts ESPVR down/right
          (↓Ees) — loop widens and shifts right, EF falls. <b style={{ color: C.text }}>HFpEF</b> steepens EDPVR (↑stiffness) —
          high filling pressures for a small EDV, EF often normal, but symptoms of congestion still occur because filling
          pressure (not EF) drives pulmonary edema.
        </Note>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   TAB 3 — Heart sounds and valve timing
----------------------------------------------------------------*/
const SOUND_ROWS = [
  { sound: "S1", timing: "Onset of isovolumic contraction", cause: "Mitral + tricuspid valve closure (شروع سیستول بطنی)", murmur: "Pansystolic murmurs (e.g., mitral regurgitation) start here" },
  { sound: "S2", timing: "Onset of isovolumic relaxation", cause: "Aortic + pulmonic valve closure — the dicrotic notch (پایان سیستول)", murmur: "Diastolic murmurs (e.g., aortic regurgitation) start here" },
  { sound: "S3", timing: "Early-to-mid rapid filling", cause: "Abnormal in adults >~40y: rapid filling into a stiff/dilated (often failing) ventricle (نشانهٔ نارسایی بطنی سیستولیک)", murmur: "—" },
  { sound: "S4", timing: "Late diastole, with the atrial kick", cause: "Atrial contraction against a stiff, non-compliant ventricle (نشانهٔ اختلال دیاستولیک/هایپرتروفی)", murmur: "—" },
];

function SoundsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Volume2}>Heart Sounds & Valve Timing (صداهای قلبی و زمان‌بندی دریچه‌ها)</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SOUND_ROWS.map((r, i) => (
            <div key={i} style={{ padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ ...mono, fontSize: 15, fontWeight: 800, color: C.copper }}>{r.sound}</span>
                <span style={{ fontSize: 12.5, color: C.text }}>{r.timing}</span>
              </div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8 }}>{r.cause}</div>
              {r.murmur !== "—" && <div style={{ fontSize: 12, color: C.hormone, marginTop: 3 }}>{r.murmur}</div>}
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionTitle>Valve Opening/Closing Logic (منطق باز و بسته شدن دریچه‌ها)</SectionTitle>
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 2 }}>
          Every AV valve (mitral/tricuspid) or semilunar valve (aortic/pulmonic) simply follows the local
          pressure gradient — <b style={{ color: C.text }}>no active control, purely mechanical</b> (کاملاً مکانیکی، بدون
          کنترل فعال): mitral valve <b style={{ color: C.text }}>closes</b> the instant LV pressure exceeds LA pressure
          (marks S1, start of isovolumic contraction) and <b style={{ color: C.text }}>opens</b> the instant LV pressure
          falls back below LA pressure (start of rapid filling). Aortic valve <b style={{ color: C.text }}>opens</b> once
          LV pressure exceeds aortic diastolic pressure (start of ejection) and <b style={{ color: C.text }}>closes</b> the
          instant LV pressure falls below aortic pressure (marks S2, the dicrotic notch). This single rule — valves
          open toward lower pressure, close against backflow — explains every murmur-timing question: a murmur heard
          in systole originates from an AV valve that should be closed (regurgitation) or a semilunar valve that
          should be open but is narrowed (stenosis), and vice versa in diastole.
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
    stem: "During isovolumic contraction, LV pressure rises steeply while LV volume stays constant. Which two valves are closed?",
    options: ["Mitral and aortic", "Mitral and pulmonic", "Tricuspid and pulmonic", "Aortic and pulmonic"],
    correct: 0,
    explain: "Both the mitral (AV) and aortic (semilunar) valves are closed — the LV is a sealed chamber, so pressure rises with no change in volume, by definition of 'isovolumic'."
  },
  {
    stem: "What event does S2 (the second heart sound) correspond to, and what landmark does it produce on the aortic pressure trace?",
    options: ["Mitral valve closure; no landmark on aortic trace", "Aortic valve closure; the dicrotic notch", "Aortic valve opening; peak systolic pressure", "Atrial contraction; the 'a' wave"],
    correct: 1,
    explain: "S2 marks aortic (and pulmonic) valve closure at the end of ejection — a brief backflow against the closing cusps produces the small dip-and-rebound called the dicrotic notch on the aortic pressure curve."
  },
  {
    stem: "The slope of the End-Systolic Pressure-Volume Relationship (ESPVR), Ees, is considered the best load-independent index of which parameter?",
    options: ["Preload", "Afterload", "Contractility", "Heart rate"],
    correct: 2,
    explain: "Because ESPVR is measured across varying loading conditions, its slope (Ees) reflects the intrinsic contractile state of the ventricle independent of a single preload/afterload combination — unlike EF or stroke volume, which both depend on loading conditions."
  },
  {
    stem: "A patient has heart failure with preserved ejection fraction (HFpEF) due to concentric LV hypertrophy. Which PV-loop change best fits this picture?",
    options: ["ESPVR slope decreases (↓Ees), loop shifts right", "EDPVR steepens (↑stiffness) — higher filling pressure needed for the same EDV", "Loop widens with a much larger stroke volume", "No change in any curve; only heart rate changes"],
    correct: 1,
    explain: "HFpEF is a diastolic problem: a stiff, hypertrophied ventricle needs a higher filling pressure to reach a normal EDV — the EDPVR curve steepens. ESPVR (systolic function/EF) is typically preserved, which is exactly why 'ejection fraction' is preserved despite clinical heart failure."
  },
  {
    stem: "In dilated cardiomyopathy (systolic heart failure, HFrEF), what happens to ESV, EDV, and EF relative to normal?",
    options: ["ESV↓, EDV↓, EF↑", "ESV↑, EDV↑ (compensatory), EF↓", "ESV unchanged, EDV↓, EF↑", "All three unchanged; only heart rate rises"],
    correct: 1,
    explain: "Reduced Ees (weak contractility) shifts ESPVR down/right, so for a given afterload the ventricle can't eject down to a low ESV — ESV rises. The Frank-Starling mechanism (Module 2) then raises EDV to try to compensate via increased preload, but SV and EF still fall net because the ESV increase dominates."
  },
  {
    stem: "Why does isolated afterload elevation (e.g., severe aortic stenosis or malignant hypertension) reduce stroke volume even if contractility (Ees) is completely normal?",
    options: ["It has no effect on stroke volume if Ees is normal", "A steeper arterial elastance (Ea) line forces the ejection to stop at a higher ESV before reaching the ESPVR's lowest achievable volume", "It only affects diastolic filling, not ejection", "It decreases EDV directly, independent of ESV"],
    correct: 1,
    explain: "ESV is set by where the ESPVR line intersects the afterload (Ea) line. A steeper Ea line (higher afterload) intersects ESPVR at a higher volume — the ventricle simply cannot eject against a stiffer/higher resistance system down to its normal ESV, so SV = EDV − ESV falls even with unchanged contractility."
  },
  {
    stem: "A student says: 'S3 is always a normal finding.' What is the accurate correction?",
    options: ["S3 is always pathologic at any age", "A physiologic S3 can be normal in children and young healthy adults, but a new S3 in an adult over ~40 usually signals rapid filling into a failing, volume-overloaded ventricle", "S3 only occurs with valve stenosis, never with heart failure", "S3 and S4 are the same sound produced at different volumes"],
    correct: 1,
    explain: "S3 timing corresponds to early rapid filling; it can be a normal, high-compliance finding in the young, but in an older adult it is a classic sign of systolic heart failure (volume overload filling a poorly contracting, often dilated ventricle)."
  },
  {
    stem: "A student says: 'On the sarcomere length-tension curve, the normal heart operates near the descending limb, so any increase in preload should decrease force.' What is the correct correction?",
    options: ["This is correct — the normal heart is always near the descending limb", "The normal heart operates on the ascending limb, well below the plateau, which is exactly why increasing preload increases force in vivo; the descending limb is reached mainly in severely dilated, failing hearts", "Sarcomere length has no relationship to force generation", "The descending limb only applies to skeletal muscle, not cardiac muscle"],
    correct: 1,
    explain: "Physiologically, the normal ventricle operates on the ascending limb of the length-tension curve, so Frank-Starling's 'more stretch → more force' holds true across the normal physiologic range; reaching the flat/descending portion is a feature of pathologic dilation, not normal function."
  },
  {
    stem: "By the Law of Laplace, why is a dilated (enlarged) ventricle mechanically inefficient at generating pressure compared to a normal-sized one?",
    options: ["Dilation increases wall thickness, raising oxygen demand", "For the same internal pressure, a larger radius requires more wall tension — a dilated chamber must generate more tension (and more O₂ consumption) to produce the same pressure", "Dilation has no effect on wall tension, only on stroke volume", "Dilation always increases contractility to compensate automatically"],
    correct: 1,
    explain: "T ≈ P·r/2: at a fixed pressure, tension rises linearly with radius. A dilated ventricle must generate disproportionately more wall tension for the same pressure output, worsening the energetic burden on an already-failing muscle — a self-reinforcing (vicious) cycle in systolic heart failure."
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
        <SectionTitle icon={Brain}>Result (نتیجه)</SectionTitle>
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
