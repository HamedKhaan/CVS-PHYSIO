import React, { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceDot
} from "recharts";
import {
  Zap, Waves, Gauge, ArrowLeftRight, GitBranch, Brain,
  RotateCcw, CheckCircle2, XCircle, ChevronLeft, HeartPulse
} from "lucide-react";

/* ---------------------------------------------------------------
   TOKENS — instrument-panel palette, shared across the whole
   Cardiovascular Physiology project for visual continuity.
----------------------------------------------------------------*/
const C = {
  bg: "#0F1720", panel: "#16212E", panel2: "#1C2A3A", border: "#2A3B4D",
  text: "#E7ECF2", muted: "#8FA1B3", faint: "#5A6B7D",
  copper: "#C97A4A", copperDim: "#8A5636",
  artery: "#C0453C", vein: "#3E7CB1", capillary: "#4FB8C4",
  hormone: "#E0B34D", good: "#5FA97A", bad: "#C0453C",
};
const mono = { fontFamily: "ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace" };
const sans = { fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif" };

const MODULES = [
  { id: "ohm", label: "Ohm's Law", icon: Zap },
  { id: "poiseuille", label: "Poiseuille's Law", icon: Waves },
  { id: "reynolds", label: "Laminar vs Turbulent", icon: Waves },
  { id: "tree", label: "Vascular Tree Pressure", icon: ArrowLeftRight },
  { id: "continuity", label: "Continuity (Area/Velocity)", icon: Gauge },
  { id: "network", label: "Series / Parallel R", icon: GitBranch },
  { id: "quiz", label: "Self-Test (خودآزمایی)", icon: Brain },
];

export default function CVSBasicHemodynamics() {
  const [tab, setTab] = useState("ohm");
  return (
    <div dir="ltr" style={{ background: C.bg, minHeight: "100vh", color: C.text, ...sans }}>
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
            <div style={{ fontSize: 18, fontWeight: 800 }}>Cardiovascular Physiology — Module 1: Basic Hemodynamics</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>Guyton Ch.14 — Pressure, Flow, Resistance. Foundation for Cardiac Output, Baroreceptor Reflex, and Shock (پیش‌نیاز ماژول‌های بعدی)</div>
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
        {tab === "ohm" && <OhmTab />}
        {tab === "poiseuille" && <PoiseuilleTab />}
        {tab === "reynolds" && <ReynoldsTab />}
        {tab === "tree" && <TreeTab />}
        {tab === "continuity" && <ContinuityTab />}
        {tab === "network" && <NetworkTab />}
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
  return <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.9, background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginTop: 10 }}>{children}</div>;
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
   TAB 1 — Ohm's Law of the circulation: F = ΔP / R
----------------------------------------------------------------*/
function OhmTab() {
  const [dP, setDP] = useState(100);
  const [R, setR] = useState(1);
  const F = dP / R;

  const barData = [
    { name: "ΔP", value: dP, fill: C.artery },
    { name: "R", value: R * 100, fill: C.hormone },
    { name: "F", value: F, fill: C.capillary },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Zap}>Ohm's Law of the Circulation</SectionTitle>
        <div style={{ fontSize: 22, textAlign: "center", ...mono, color: C.copper, margin: "10px 0 16px" }}>
          F = ΔP / R
        </div>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", marginBottom: 14 }}>
          <MiniCircuit dP={dP} R={R} F={F} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Readout label="ΔP (Pressure Gradient)" value={dP} unit="mmHg" color={C.artery} />
          <Readout label="R (Relative Resistance)" value={R.toFixed(2)} unit="×" color={C.hormone} />
          <Readout label="F (Flow)" value={F.toFixed(0)} unit="mL/min" color={C.capillary} />
        </div>
      </Panel>

      <Panel>
        <SectionTitle>Controls</SectionTitle>
        <Slider label="Pressure gradient across the path (ΔP, اختلاف فشار)" min={10} max={200} step={1} value={dP}
          onChange={setDP} display={`${dP} mmHg`} color={C.artery} />
        <Slider label="Relative vascular resistance (R, مقاومت)" min={0.2} max={4} step={0.05} value={R}
          onChange={setR} display={`${R.toFixed(2)}×`} color={C.hormone} />
      </Panel>

      <Panel>
        <SectionTitle>Electrical Circuit Analogy</SectionTitle>
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.9 }}>
          The circulation is not literally a closed electrical circuit, but it obeys the exact same algebra
          as Ohm's Law: pressure acts like voltage (the driving force), vascular resistance behaves like
          electrical resistance, and blood flow (F — think CO or organ blood flow depending on scale) is the
          resulting current. Key exam point: F is always <b style={{ color: C.text }}>directly</b> proportional
          to ΔP and <b style={{ color: C.text }}>inversely</b> proportional to R — every question about the
          effect of shock (ΔP↓), vasoconstriction (تنگی عروقی, R↑), or vasodilation (اتساع عروقی, R↓) on flow
          reduces to this one equation. Note: for the systemic circulation, ΔP is more precisely
          (MAP − CVP), not MAP alone.
        </div>
        <div style={{ height: 180, marginTop: 12 }}>
          <ResponsiveContainer>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke={C.muted} fontSize={12} />
              <YAxis stroke={C.muted} fontSize={11} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
function MiniCircuit({ dP, R, F }) {
  const zigzagW = Math.max(28, Math.min(90, 45 * R));
  const startX = 150 - zigzagW / 2, segs = 6, dx = zigzagW / segs;
  let path = `M ${startX} 45`;
  for (let i = 1; i <= segs; i++) {
    const x = startX + i * dx;
    const y = 45 + (i % 2 === 0 ? 0 : (i % 4 === 1 ? -12 : 12));
    path += ` L ${x} ${y}`;
  }
  return (
    <svg viewBox="0 0 300 100" style={{ width: "100%", maxWidth: 360, height: 100 }}>
      <text x="8" y="18" fontSize="10.5" fill={C.muted}>High pressure end</text>
      <text x="222" y="18" fontSize="10.5" fill={C.muted}>Low pressure end</text>
      <line x1="10" y1="45" x2={startX} y2="45" stroke={C.artery} strokeWidth="6" strokeLinecap="round" />
      <path d={path} stroke={C.hormone} strokeWidth="3" fill="none" strokeLinejoin="round" />
      <line x1={startX + zigzagW} y1="45" x2="290" y2="45" stroke={C.vein} strokeWidth="6" strokeLinecap="round" opacity="0.85" />
      <path d="M 270 45 l -10 -5 v 10 z" fill={C.vein} />
      <text x="20" y="72" fontSize="11" fill={C.text} style={mono}>{dP} mmHg</text>
      <text x={150 - 10} y="72" fontSize="9.5" fill={C.muted}>R</text>
      <text x="235" y="72" fontSize="11" fill={C.text} style={mono}>F={F.toFixed(0)}</text>
    </svg>
  );
}

/* ---------------------------------------------------------------
   TAB 2 — Poiseuille's Law: R = 8ηL / (π r⁴)
----------------------------------------------------------------*/
function PoiseuilleTab() {
  const [radius, setRadius] = useState(1);
  const [length, setLength] = useState(1);
  const [viscosity, setViscosity] = useState(1);

  const R = (8 * viscosity * length) / (Math.PI * radius ** 4);
  const Rbase = (8 * 1 * 1) / (Math.PI * 1 ** 4);
  const Rrel = R / Rbase;

  const radiusCurve = useMemo(() => {
    const arr = [];
    for (let r = 0.4; r <= 1.8; r += 0.02) {
      arr.push({ r: +r.toFixed(2), R: +((8 * viscosity * length) / (Math.PI * r ** 4) / Rbase).toFixed(2) });
    }
    return arr;
  }, [viscosity, length]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Waves}>Poiseuille's Law</SectionTitle>
        <div style={{ fontSize: 20, textAlign: "center", ...mono, color: C.copper, margin: "10px 0 16px" }}>
          R = 8ηL / (πr⁴)
        </div>
        <VesselCrossSection radius={radius} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <Readout label="Resistance relative to baseline" value={Rrel.toFixed(2)} unit="×" color={C.hormone} />
        </div>
      </Panel>

      <Panel>
        <SectionTitle>Controls</SectionTitle>
        <Slider label="Vessel radius (r, شعاع) — smallest change, biggest effect" min={0.4} max={1.8} step={0.02} value={radius}
          onChange={setRadius} display={`${radius.toFixed(2)}×`} color={C.artery} />
        <Slider label="Vessel length (L, طول)" min={0.5} max={2} step={0.05} value={length}
          onChange={setLength} display={`${length.toFixed(2)}×`} />
        <Slider label="Blood viscosity (η, ویسکوزیته) — polycythemia vs anemia" min={0.5} max={2.5} step={0.05} value={viscosity}
          onChange={setViscosity} display={`${viscosity.toFixed(2)}×`} color={C.vein} />
        <Note>
          Hold L and η fixed at r=1.0, then cut the radius to 0.8 (a 20% stenosis) — resistance rises to
          roughly 2.44×, not 1.25×. This gap between linear intuition and the true fourth-power relationship
          is the single most common source of error when predicting how vasoconstriction/vasodilation affects flow.
        </Note>
      </Panel>

      <Panel>
        <SectionTitle>Resistance vs Radius (Fourth-Power Curve)</SectionTitle>
        <div style={{ height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={radiusCurve} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="r" stroke={C.muted} fontSize={11} label={{ value: "Relative radius", position: "insideBottom", offset: -3, fill: C.muted, fontSize: 11 }} />
              <YAxis stroke={C.muted} fontSize={11} domain={[0, 20]} label={{ value: "Relative R", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 10 }} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Line type="monotone" dataKey="R" stroke={C.artery} strokeWidth={2.5} dot={false} />
              <ReferenceDot x={radius} y={Rrel > 20 ? 20 : Rrel} r={5} fill={C.copper} stroke="none" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <Note>
          Physiologic takeaway: resistance vessels (arterioles — عروق مقاومتی) are the body's primary site
          for regulating Total Peripheral Resistance (TPR) precisely because of this sensitivity — arteriolar
          smooth muscle achieves the greatest control over flow and pressure with the smallest change in diameter.
        </Note>
      </Panel>
    </div>
  );
}
function VesselCrossSection({ radius }) {
  const rPix = 8 + radius * 26;
  return (
    <svg viewBox="0 0 300 100" style={{ width: "100%", maxWidth: 300, height: 100, margin: "0 auto", display: "block" }}>
      <circle cx="150" cy="50" r={rPix} fill={C.panel2} stroke={C.artery} strokeWidth="3" />
      <circle cx="150" cy="50" r={Math.max(2, rPix - 6)} fill="none" stroke={C.capillary} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
      <text x="150" y="53" fontSize="10" fill={C.text} textAnchor="middle" style={mono}>r={radius.toFixed(2)}</text>
      <text x="150" y="90" fontSize="10" fill={C.muted} textAnchor="middle">Vessel cross-section (مقطع رگ)</text>
    </svg>
  );
}

/* ---------------------------------------------------------------
   TAB 3 — Laminar vs Turbulent Flow (Reynolds Number)
----------------------------------------------------------------*/
function ReynoldsTab() {
  const [velocity, setVelocity] = useState(1);
  const [diameter, setDiameter] = useState(1);
  const [viscosity, setViscosity] = useState(1);

  const Re = 1400 * velocity * diameter / viscosity;
  const turbulent = Re > 2000;

  const scenarios = [
    { label: "Normal peripheral vessel", v: 1, d: 1, visc: 1 },
    { label: "Anemia (η↓, hyperdynamic flow)", v: 1.3, d: 1, visc: 0.6 },
    { label: "AV fistula / local stenosis (v↑)", v: 2.2, d: 0.6, visc: 1 },
    { label: "Aortic stenosis jet", v: 2.5, d: 0.5, visc: 1 },
    { label: "Peak-systole aorta (physiologic borderline)", v: 1.6, d: 1.4, visc: 1 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Waves}>Reynolds Number — Laminar vs Turbulent Flow</SectionTitle>
        <div style={{ fontSize: 18, textAlign: "center", ...mono, color: C.copper, margin: "6px 0 14px" }}>
          Re = (v · d · ρ) / η
        </div>
        <FlowSVG turbulent={turbulent} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <Readout label="Reynolds Number (relative)" value={Re.toFixed(0)} unit="" color={turbulent ? C.bad : C.good} />
          <Readout label="Flow regime" value={turbulent ? "Turbulent" : "Laminar"} unit="" color={turbulent ? C.bad : C.good} />
        </div>
      </Panel>

      <Panel>
        <SectionTitle>Controls</SectionTitle>
        <Slider label="Velocity (v, سرعت)" min={0.3} max={3} step={0.05} value={velocity}
          onChange={setVelocity} display={`${velocity.toFixed(2)}×`} color={C.artery} />
        <Slider label="Vessel diameter (d, قطر)" min={0.3} max={2} step={0.05} value={diameter}
          onChange={setDiameter} display={`${diameter.toFixed(2)}×`} />
        <Slider label="Viscosity (η, ویسکوزیته) — hematocrit" min={0.4} max={2} step={0.05} value={viscosity}
          onChange={setViscosity} display={`${viscosity.toFixed(2)}×`} color={C.vein} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {scenarios.map((s, i) => (
            <button key={i} onClick={() => { setVelocity(s.v); setDiameter(s.d); setViscosity(s.visc); }}
              style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.panel2, color: C.text, fontFamily: "inherit", fontSize: 12, cursor: "pointer" }}>
              {s.label}
            </button>
          ))}
        </div>
      </Panel>

      <Panel>
        <Note>
          Above a critical Reynolds number (classically ~2000, though the real threshold varies with vessel
          geometry), flow shifts from laminar (parallel layers, silent) to turbulent (chaotic, audible). Three
          clinically common drivers of a rising Re: (1) <b style={{ color: C.text }}>increased velocity</b> at
          a local stenosis or shunt — the origin of a murmur/bruit; (2) <b style={{ color: C.text }}>increased
          diameter</b>, e.g. an aneurysm; (3) <b style={{ color: C.text }}>decreased viscosity</b> in anemia —
          which is why severe anemia alone can produce a flow murmur with no structural valve disease. Subtle
          exam point: in the ascending aorta at peak systole, Re can physiologically cross the threshold —
          mild turbulence there is normal, not always pathologic.
        </Note>
      </Panel>
    </div>
  );
}
function FlowSVG({ turbulent }) {
  return (
    <svg viewBox="0 0 300 100" style={{ width: "100%", height: 100 }}>
      <rect x="10" y="20" width="280" height="60" rx="10" fill="none" stroke={C.border} strokeWidth="2" />
      {!turbulent ? (
        [20, 35, 50, 65, 80].map((y, i) => (
          <line key={i} x1="20" y1={y} x2="280" y2={y} stroke={C.capillary} strokeWidth="2.5" strokeLinecap="round" opacity={0.4 + i * 0.1} />
        ))
      ) : (
        [...Array(5)].map((_, i) => {
          const y0 = 25 + i * 12;
          return (
            <path key={i} d={`M20 ${y0} Q 70 ${y0 - 14} 120 ${y0} T 220 ${y0} T 280 ${y0}`} stroke={C.bad} strokeWidth="2.2" fill="none" opacity="0.75" />
          );
        })
      )}
      <text x="150" y="95" fontSize="11" fill={turbulent ? C.bad : C.good} textAnchor="middle" fontWeight="700">
        {turbulent ? "Turbulent" : "Laminar"}
      </text>
    </svg>
  );
}

/* ---------------------------------------------------------------
   TAB 4 — Pressure distribution along the vascular tree
----------------------------------------------------------------*/
const TREE_SEGMENTS = [
  { name: "Aorta", pressure: 100, color: C.artery },
  { name: "Large arteries", pressure: 98, color: C.artery },
  { name: "Small arteries", pressure: 85, color: C.artery },
  { name: "Arterioles", pressure: 30, color: C.hormone },
  { name: "Capillary (arterial end)", pressure: 25, color: C.capillary },
  { name: "Capillary (venous end)", pressure: 10, color: C.capillary },
  { name: "Venules", pressure: 8, color: C.vein },
  { name: "Small veins", pressure: 5, color: C.vein },
  { name: "Large veins", pressure: 3, color: C.vein },
  { name: "Right atrium (CVP)", pressure: 0, color: C.vein },
];

function TreeTab() {
  const [hoverIdx, setHoverIdx] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={ArrowLeftRight}>Pressure Drop Along the Systemic Vascular Tree</SectionTitle>
        <VesselFunnel />
        <div style={{ height: 280, marginTop: 10 }}>
          <ResponsiveContainer>
            <BarChart data={TREE_SEGMENTS} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke={C.muted} fontSize={11} domain={[0, 105]} label={{ value: "Pressure (mmHg)", position: "insideBottom", offset: -3, fill: C.muted, fontSize: 11 }} />
              <YAxis type="category" dataKey="name" stroke={C.muted} fontSize={10.5} width={130} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Bar dataKey="pressure" radius={[0, 6, 6, 0]} onMouseEnter={(_, i) => setHoverIdx(i)}>
                {TREE_SEGMENTS.map((d, i) => <Cell key={i} fill={d.color} opacity={hoverIdx === i ? 1 : 0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Note>
          Values are approximate, teaching-level numbers (Guyton's classic Ch.14 figure); exact figures vary
          slightly between editions — cross-check against your own textbook's table for the exam. Core point:
          the largest pressure drop (~55 mmHg, from 85 to 30) occurs across the <b style={{ color: C.text }}>arterioles</b>,
          not the capillaries or large arteries. Since pressure drop = flow×resistance and flow is equal across
          all segments in series, this means arterioles alone account for the bulk of TPR — which is why they
          are called resistance vessels and are the primary target of antihypertensive vasodilator drugs.
        </Note>
      </Panel>
    </div>
  );
}
function VesselFunnel() {
  return (
    <svg viewBox="0 0 340 90" style={{ width: "100%", height: 90 }}>
      <line x1="10" y1="45" x2="60" y2="45" stroke={C.artery} strokeWidth="10" strokeLinecap="round" />
      <line x1="60" y1="45" x2="100" y2="45" stroke={C.hormone} strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="170" cy="45" rx="55" ry="24" fill="none" stroke={C.capillary} strokeWidth="4" opacity="0.8" />
      <line x1="240" y1="45" x2="280" y2="45" stroke={C.vein} strokeWidth="8" strokeLinecap="round" opacity="0.85" />
      <line x1="280" y1="45" x2="330" y2="45" stroke={C.vein} strokeWidth="12" strokeLinecap="round" opacity="0.85" />
      <text x="10" y="22" fontSize="9.5" fill={C.muted}>Aorta</text>
      <text x="62" y="22" fontSize="9.5" fill={C.muted}>Arteriole</text>
      <text x="140" y="18" fontSize="9.5" fill={C.muted}>Capillary bed</text>
      <text x="270" y="22" fontSize="9.5" fill={C.muted}>Vena cava</text>
    </svg>
  );
}

/* ---------------------------------------------------------------
   TAB 5 — Continuity: total cross-sectional area vs velocity
----------------------------------------------------------------*/
const CONTINUITY_SEGMENTS = [
  { name: "Aorta", area: 2.5, color: C.artery },
  { name: "Small arteries", area: 20, color: C.artery },
  { name: "Arterioles", area: 40, color: C.hormone },
  { name: "Capillaries", area: 2500, color: C.capillary },
  { name: "Venules", area: 250, color: C.vein },
  { name: "Veins", area: 80, color: C.vein },
  { name: "Vena cava", area: 8, color: C.vein },
];
const CO_ML_PER_SEC = 5000 / 60;

function ContinuityTab() {
  const data = CONTINUITY_SEGMENTS.map(s => ({ ...s, velocity: +(CO_ML_PER_SEC / s.area).toFixed(3) }));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Gauge}>Continuity Principle: Total Cross-Sectional Area vs Velocity</SectionTitle>
        <div style={{ fontSize: 18, textAlign: "center", ...mono, color: C.copper, margin: "6px 0 14px" }}>
          v = F / A
        </div>
        <ContinuityFunnel />
        <div style={{ height: 240, marginTop: 10 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 30 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke={C.muted} fontSize={10} angle={-25} textAnchor="end" interval={0} />
              <YAxis stroke={C.muted} fontSize={11} scale="log" domain={[1, 3000]} label={{ value: "Total cross-sectional area (cm², log)", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 10 }} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }}
                formatter={(v, n, p) => n === "area" ? [`${v} cm²`, "Area"] : v} />
              <Bar dataKey="area" radius={[6, 6, 0, 0]}>
                {data.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
          {data.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "6px 10px", background: C.panel2, borderRadius: 6 }}>
              <span>{s.name}</span>
              <span style={mono}>A={s.area} cm² &nbsp;|&nbsp; v≈{s.velocity < 0.01 ? s.velocity.toFixed(4) : s.velocity} cm/s</span>
            </div>
          ))}
        </div>
        <Note>
          Since total flow (Cardiac Output, ~5000 mL/min) must be identical at every cross-section of the
          systemic circuit, velocity is inversely proportional to total cross-sectional area. The combined
          cross-sectional area of capillaries (~2500 cm²) — due to the enormous number of parallel capillaries —
          is roughly 1000× that of the aorta (~2.5 cm²), so capillary velocity drops by about the same factor.
          This slowdown provides the transit time needed for O₂/CO₂ and nutrient exchange (تبادل مواد) — a
          purposeful design feature, not a coincidence.
        </Note>
      </Panel>
    </div>
  );
}
function ContinuityFunnel() {
  return (
    <svg viewBox="0 0 340 80" style={{ width: "100%", height: 80 }}>
      <line x1="10" y1="40" x2="90" y2="40" stroke={C.artery} strokeWidth="6" strokeLinecap="round" />
      <path d="M90,32 Q170,10 250,32 L250,48 Q170,70 90,48 Z" fill={C.capillary} opacity="0.25" stroke={C.capillary} strokeWidth="2" />
      <line x1="250" y1="40" x2="330" y2="40" stroke={C.vein} strokeWidth="6" strokeLinecap="round" opacity="0.85" />
      <text x="15" y="25" fontSize="9.5" fill={C.muted}>fast (narrow)</text>
      <text x="145" y="18" fontSize="9.5" fill={C.muted}>slow (wide total area)</text>
      <text x="270" y="25" fontSize="9.5" fill={C.muted}>fast again</text>
    </svg>
  );
}

/* ---------------------------------------------------------------
   TAB 6 — Series vs parallel resistance
----------------------------------------------------------------*/
function NetworkTab() {
  const [mode, setMode] = useState("parallel");
  const [n, setN] = useState(3);
  const rEach = 1;
  const totalR = mode === "series" ? rEach * n : rEach / n;
  const F = 100 / totalR;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={GitBranch}>Series vs Parallel Resistance</SectionTitle>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button onClick={() => setMode("series")} style={toggleStyle(mode === "series")}>Series (within one organ)</button>
          <button onClick={() => setMode("parallel")} style={toggleStyle(mode === "parallel")}>Parallel (different organ beds)</button>
        </div>
        <NetworkSVG mode={mode} n={n} />
        <Slider label="Number of segments / vascular beds" min={1} max={6} step={1} value={n}
          onChange={setN} display={`${n}`} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <Readout label="Total relative resistance" value={totalR.toFixed(2)} unit="×" color={C.hormone} />
          <Readout label="Total flow (ΔP=100 fixed)" value={F.toFixed(0)} unit="units" color={C.capillary} />
        </div>
        <Note>
          {mode === "series" ? (
            <>In a <b style={{ color: C.text }}>series</b> arrangement (e.g. aorta←artery←arteriole←capillary
              within one organ bed), resistances simply <b style={{ color: C.text }}>add</b>: R_total = R₁+R₂+...+Rₙ.
              Adding each new segment increases total resistance and decreases flow.</>
          ) : (
            <>In a <b style={{ color: C.text }}>parallel</b> arrangement (e.g. the coronary, cerebral, renal, and
              muscular circulations, all branching simultaneously off the aorta), reciprocals of resistance add:
              1/R_total = 1/R₁+...+1/Rₙ. Adding a new vascular bed (opening an organ, e.g. skeletal-muscle
              vasodilation during exercise) <b style={{ color: C.text }}>lowers</b> whole-body TPR even if no
              single bed's resistance changes. This is why TPR falls sharply during heavy exercise and CO can
              rise dramatically without MAP rising dangerously.</>
          )}
        </Note>
      </Panel>
    </div>
  );
}
function NetworkSVG({ mode, n }) {
  const w = 300, h = 110;
  if (mode === "series") {
    const segW = 220 / n;
    return (
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h }}>
        <line x1="10" y1="55" x2="40" y2="55" stroke={C.artery} strokeWidth="5" strokeLinecap="round" />
        {[...Array(n)].map((_, i) => (
          <rect key={i} x={40 + i * segW} y="45" width={segW - 4} height="20" rx="4" fill={C.panel2} stroke={C.hormone} strokeWidth="2" />
        ))}
        <line x1={40 + n * segW} y1="55" x2={290} y2="55" stroke={C.vein} strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }
  const gap = 90 / Math.max(n, 1);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h }}>
      <line x1="10" y1="55" x2="60" y2="55" stroke={C.artery} strokeWidth="5" strokeLinecap="round" />
      {[...Array(n)].map((_, i) => {
        const y = 15 + i * gap + gap / 2;
        return (
          <g key={i}>
            <line x1="60" y1="55" x2="90" y2={y} stroke={C.artery} strokeWidth="2.5" />
            <rect x="90" y={y - 8} width="120" height="16" rx="4" fill={C.panel2} stroke={C.hormone} strokeWidth="2" />
            <line x1="210" y1={y} x2="240" y2="55" stroke={C.vein} strokeWidth="2.5" />
          </g>
        );
      })}
      <line x1="240" y1="55" x2="290" y2="55" stroke={C.vein} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------------------------------------------------------
   TAB 7 — Quiz
----------------------------------------------------------------*/
const QUESTIONS = [
  {
    stem: "If the resistance of a vascular bed doubles while ΔP stays constant, what happens to flow?",
    options: ["It doubles", "It halves", "It stays the same", "It drops to zero"],
    correct: 1,
    explain: "By F=ΔP/R, with ΔP fixed, flow is inversely proportional to resistance; doubling R halves F."
  },
  {
    stem: "A 20% decrease in an arteriole's radius (length and viscosity unchanged) has approximately what effect on its resistance?",
    options: ["+20%", "+40%", "≈+144% (resistance ×2.44)", "-20%"],
    correct: 2,
    explain: "R ∝ 1/r⁴; with r_new=0.8, resistance rises to (1/0.8)⁴≈2.44× — about +144%, not +20%."
  },
  {
    stem: "Where does the largest pressure drop occur along the systemic vascular tree?",
    options: ["Aorta", "Large arteries", "Arterioles", "Large veins"],
    correct: 2,
    explain: "Arterioles are the principal resistance vessels and account for the majority of TPR, so the largest pressure drop (roughly 85→30 mmHg) occurs across them."
  },
  {
    stem: "Why is blood velocity so much lower in capillaries than in the aorta, even though total flow (CO) is the same at both points?",
    options: ["Capillaries have higher resistance", "Total capillary cross-sectional area is far larger than the aorta's (v=F/A)", "Pressure is zero in capillaries", "Blood is more viscous in capillaries"],
    correct: 1,
    explain: "By the continuity principle v=F/A, with F constant throughout the systemic circuit, velocity is inversely proportional to total cross-sectional area. Because capillaries are so numerous and run in parallel, their combined area is about 1000× the aorta's, so velocity falls proportionally."
  },
  {
    stem: "During heavy exercise, vasodilation in skeletal-muscle vessels does what to Total Peripheral Resistance (TPR), and why?",
    options: ["TPR rises because each muscle bed's own resistance fell", "TPR falls because vascular beds are arranged in parallel, and adding a low-resistance parallel path lowers total resistance", "TPR is unchanged because only local flow is affected", "TPR rises because CO increased"],
    correct: 1,
    explain: "Organ vascular beds branch off the aorta in parallel (1/R_total=Σ1/Rᵢ). Opening the muscle bed is equivalent to adding a low-resistance parallel path, which pulls whole-body TPR down — this is why CO can rise several-fold during exercise without a dangerous rise in MAP."
  },
  {
    stem: "Two vascular beds are connected in series (not parallel), each with a relative resistance of 1. What is the total resistance?",
    options: ["0.5", "1", "2", "4"],
    correct: 2,
    explain: "In series, resistances add algebraically: R_total=R₁+R₂=1+1=2. (In parallel it would instead be 1/R_total=1/1+1/1=2 → R_total=0.5.)"
  },
  {
    stem: "A patient with severe anemia (low hematocrit) develops a flow murmur with no structural valve disease. What is the direct mechanism?",
    options: ["Increased cardiac output alone is sufficient", "Decreased blood viscosity raises the Reynolds number past the turbulence threshold", "Increased hematocrit raises resistance", "Decreased MAP lowers the pressure gradient"],
    correct: 1,
    explain: "Re = v·d·ρ/η; a fall in η (viscosity) alone raises Re and can push flow past the laminar→turbulent threshold, even with completely normal vessel and valve anatomy — this underlies the physiologic (functional) murmur of anemia."
  },
  {
    stem: "Which three factors, independently, raise the Reynolds number and increase the risk of turbulent flow (murmur/bruit)?",
    options: ["↑velocity, ↑diameter, ↓viscosity", "↓velocity, ↓diameter, ↑viscosity", "↑velocity, ↓diameter, ↑viscosity", "Only ↑velocity matters"],
    correct: 0,
    explain: "By Re=v·d·ρ/η, an increase in velocity (e.g. at a local stenosis), an increase in diameter (e.g. an aneurysm), or a decrease in viscosity (anemia) can each independently push Re past the laminar threshold."
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
          <RotateCcw size={14} /> Restart (shuffled)
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
      <div style={{ fontSize: 14.5, lineHeight: 1.8, marginBottom: 14 }}>{q.stem}</div>
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
              fontFamily: "inherit", fontSize: 13, cursor: selected === null ? "pointer" : "default", lineHeight: 1.6
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
            {idx + 1 < order.length ? "Next question" : "See result"} <ChevronLeft size={14} style={{ transform: "rotate(180deg)" }} />
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
