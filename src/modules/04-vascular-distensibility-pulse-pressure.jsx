import React, { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceDot, ReferenceLine, ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";
import {
  Waves, Activity, Gauge, Brain, RotateCcw,
  CheckCircle2, XCircle, ChevronLeft, HeartPulse, BookOpen
} from "lucide-react";
import ChartContainer from "../components/ChartContainer";

/* ---------------------------------------------------------------
   TOKENS — same system as Modules 1–3, project continuity.
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
  { id: "windkessel", label: "Windkessel Model", icon: Waves },
  { id: "clinical", label: "Pulse Pressure — Clinical", icon: Activity },
  { id: "quiz", label: "Self-Test (خودآزمایی)", icon: Brain },
];

export default function CVSVascularDistensibility() {
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
            <div style={{ fontSize: 18, fontWeight: 800 }}>Cardiovascular Physiology — Module 4: Vascular Distensibility & Pulse Pressure</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
              Guyton Ch.15 — what the arterial tree does with the stroke volume Module 3's ejection just delivered (اتفاقی که برای رانش خون در شریان‌ها می‌افتد)
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
        {tab === "windkessel" && <WindkesselTab />}
        {tab === "clinical" && <ClinicalTab />}
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
   TAB 0 — Foundations: distensibility/compliance definitions
----------------------------------------------------------------*/
const CAPACITANCE_DATA = [
  { name: "Arteries", value: 8, color: C.artery },
  { name: "Arterioles", value: 1, color: C.hormone },
  { name: "Capillaries", value: 1, color: C.capillary },
  { name: "Veins/venules", value: 60, color: C.vein },
  { name: "Pulmonary + heart", value: 30, color: C.copper },
];

function FoundationsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={BookOpen}>Distensibility vs Compliance — Two Related, Not Identical, Terms</SectionTitle>
        <div style={{ fontSize: 18, textAlign: "center", ...mono, color: C.copper, margin: "6px 0 14px" }}>
          Compliance = ΔV/ΔP &nbsp;|&nbsp; Distensibility = ΔV / (ΔP × V₀)
        </div>
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 2 }}>
          <b style={{ color: C.text }}>Compliance</b> (C) is the absolute volume a vessel accepts per unit
          pressure rise — an extensive property that scales with vessel size. <b style={{ color: C.text }}>
          Distensibility</b> is compliance normalized to the vessel's own starting volume — an intensive,
          size-independent property, better for comparing vessel <i>types</i>. Exam trap: <b style={{ color: C.text }}>veins
          are about 6–10× more distensible than arteries of comparable wall type</b>, but because arteries are
          so much narrower, a vein's absolute compliance is even more dramatically higher — around 24× an
          equivalent artery's — which is exactly why veins are called capacitance vessels (عروق ظرفیتی) and
          arteries are called resistance/pressure-reservoir vessels.
        </div>
      </Panel>

      <Panel>
        <SectionTitle icon={Gauge}>Where the Blood Volume Actually Sits</SectionTitle>
        <ChartContainer height={200}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CAPACITANCE_DATA} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke={C.muted} fontSize={11} domain={[0, 65]} label={{ value: "% of total blood volume", position: "insideBottom", offset: -3, fill: C.muted, fontSize: 10.5 }} />
              <YAxis type="category" dataKey="name" stroke={C.muted} fontSize={11} width={110} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {CAPACITANCE_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <Note>
          Roughly 60–70% of total blood volume sits in the systemic veins and venules at any moment — the
          low-pressure, high-compliance "reservoir" of the circulation (Module 2's Psf is set almost entirely
          here). Only a small fraction sits in the high-resistance arterioles and capillaries. This is why the
          sympathetic nervous system targets venous tone (venoconstriction) as its fastest lever to
          auto-transfuse blood back toward the heart during hemorrhage or standing up — far more volume is
          available to mobilize from the venous side than the arterial side.
        </Note>
      </Panel>

      <Panel>
        <SectionTitle icon={Waves}>Why the Arterial System Needs to Be "Elastic" at All</SectionTitle>
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 2 }}>
          Ejection from the LV is intermittent (only ~1/3 of the cardiac cycle, Module 3's ejection phase),
          but tissue perfusion needs to be continuous. The elastic recoil of the aorta and large arteries
          converts this pulsatile inflow into a smoother, nearly continuous outflow at the arteriolar level —
          this is the <b style={{ color: C.text }}>Windkessel effect</b> (اثر ویندکسل — literally "elastic
          reservoir/air chamber" in German), modeled formally in the next tab. Losing this elasticity (aging,
          atherosclerosis) does not just raise blood pressure numbers — it also means arterioles now see a
          much more pulsatile, less continuous pressure waveform, which has real downstream consequences (e.g.
          small-vessel damage in the kidney and brain — a major mechanism of hypertensive end-organ damage).
        </div>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   MODEL — 2-element Windkessel: PP ≈ SV/C; MAP = CO×R;
   diastolic runoff decays exponentially with τ = R×C.
----------------------------------------------------------------*/
function windkesselModel({ SV, HR, R, C_compliance, regurgFraction = 0 }) {
  const effectiveSV = SV * (1 + regurgFraction); // extra volume ejected forward+back in AR
  const CO = (SV * HR) / 1000; // L/min
  const MAP = CO * R;
  let PP = effectiveSV / C_compliance;
  const runoffExtra = regurgFraction * 25; // diastolic runoff drops DBP further in AR
  let DBP = MAP - PP / 3 - runoffExtra;
  let SBP = DBP + PP;
  DBP = Math.max(0, DBP);
  PP = SBP - DBP;
  return { CO, MAP, PP, SBP, DBP };
}
function diastolicDecay(SBP, DBP, tauMs, diastoleDurationMs) {
  // Properly derived from the 2-element Windkessel ODE: dP/dt = -P/(R·C) during
  // diastole (no inflow). Solve for the model's asymptotic pressure P∞ so the
  // curve starts exactly at SBP and reaches exactly DBP at the real diastolic
  // duration — P∞ often comes out below DBP (even negative), a known,
  // textbook-acknowledged artifact of the simplified 2-element model, since
  // diastole is always interrupted by the next beat before equilibrium.
  const r = Math.exp(-diastoleDurationMs / tauMs);
  const Pinf = (DBP - SBP * r) / (1 - r);
  const arr = [];
  for (let t = 0; t <= diastoleDurationMs; t += Math.max(2, diastoleDurationMs / 100)) {
    const P = Pinf + (SBP - Pinf) * Math.exp(-t / tauMs);
    arr.push({ t: +t.toFixed(0), P: +P.toFixed(1) });
  }
  return { curve: arr, Pinf };
}

const WK_SCENARIOS = {
  normal: { label: "Normal", SV: 70, HR: 75, R: 17.8, C_compliance: 1.75, regurgFraction: 0 },
  aging: { label: "Aging / Atherosclerosis (↓compliance)", SV: 70, HR: 75, R: 17.8, C_compliance: 0.7, regurgFraction: 0 },
  ar: { label: "Aortic Regurgitation (diastolic runoff)", SV: 70, HR: 75, R: 15, C_compliance: 1.75, regurgFraction: 0.4 },
  as: { label: "Aortic Stenosis (↓forward SV, pulsus parvus)", SV: 40, HR: 80, R: 20, C_compliance: 1.75, regurgFraction: 0 },
  hypovolemia: { label: "Hypovolemia / Hemorrhage (↓SV)", SV: 40, HR: 110, R: 20, C_compliance: 1.5, regurgFraction: 0 },
  fever: { label: "Fever / Hyperthyroidism (↑SV, ↓TPR)", SV: 85, HR: 100, R: 12, C_compliance: 1.75, regurgFraction: 0 },
};

/* ---------------------------------------------------------------
   TAB 1 — Windkessel model
----------------------------------------------------------------*/
function WindkesselTab() {
  const [SV, setSV] = useState(70);
  const [HR, setHR] = useState(75);
  const [R, setR] = useState(17.8);
  const [Ccap, setCcap] = useState(1.75);

  const m = useMemo(() => windkesselModel({ SV, HR, R, C_compliance: Ccap }), [SV, HR, R, Ccap]);
  // τ = R×C in properly-converted consistent units (R: mmHg·min/L, C: mL/mmHg → convert C to L/mmHg):
  const tauMs = R * (Ccap / 1000) * 60000; // minutes → ms
  const cycleMs = 60000 / HR;
  const systoleMs = Math.min(cycleMs * 0.5, 280 - (HR - 75) * 0.7); // systole shortens modestly with tachycardia
  const diastoleMs = Math.max(80, cycleMs - systoleMs);
  const { curve: decay, Pinf } = useMemo(() => diastolicDecay(m.SBP, m.DBP, tauMs, diastoleMs), [m, tauMs, diastoleMs]);

  function applyScenario(key) {
    const s = WK_SCENARIOS[key];
    setSV(s.SV); setHR(s.HR); setR(s.R); setCcap(s.C_compliance);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Waves}>The Windkessel Reservoir</SectionTitle>
        <ReservoirSVG compliance={Ccap} />
        <div style={{ fontSize: 18, textAlign: "center", ...mono, color: C.copper, margin: "10px 0 6px" }}>
          Pulse Pressure ≈ Stroke Volume / Arterial Compliance
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <Readout label="SBP" value={m.SBP.toFixed(0)} unit="mmHg" color={C.artery} />
          <Readout label="DBP" value={m.DBP.toFixed(0)} unit="mmHg" color={C.vein} />
          <Readout label="Pulse Pressure" value={m.PP.toFixed(0)} unit="mmHg" color={C.hormone} />
          <Readout label="MAP" value={m.MAP.toFixed(0)} unit="mmHg" color={C.copper} />
        </div>
      </Panel>

      <Panel>
        <SectionTitle>Diastolic Pressure Decay (Elastic Recoil)</SectionTitle>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <Readout label="Time constant τ = R×C" value={tauMs.toFixed(0)} unit="ms" color={C.hormone} />
          <Readout label="Diastole duration" value={diastoleMs.toFixed(0)} unit="ms" color={C.vein} />
        </div>
        <ChartContainer height={200}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={decay} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="t" stroke={C.muted} fontSize={11} label={{ value: "Time into diastole (ms)", position: "insideBottom", offset: -3, fill: C.muted, fontSize: 10.5 }} />
              <YAxis stroke={C.muted} fontSize={11} domain={[0, 160]} label={{ value: "Aortic pressure (mmHg)", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 10.5 }} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Line type="monotone" dataKey="P" stroke={C.hormone} strokeWidth={2.3} dot={false} />
              <ReferenceLine y={m.DBP} stroke={C.faint} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <Note>
          During diastole, the aortic valve is closed and no new inflow arrives; the stretched arterial wall
          simply recoils, pushing stored blood forward through the resistance vessels — an exponential decay
          with time constant <b style={{ color: C.text }}>τ = R × C</b>, properly unit-converted here (not just
          scaled for display) — physiologically τ is typically ~1.5–2.5 s for the whole arterial tree, which is
          <i> longer</i> than a single diastole (~500–600 ms at rest). This is precisely why aortic pressure
          only falls <i>part-way</i> toward its theoretical resting value during any one diastole — the next
          heartbeat always interrupts the decay first. Solving the model backward from the real SBP→DBP drop
          over the true diastolic duration gives an asymptotic pressure <b style={{ color: C.text }}>P∞ ≈ {Pinf.toFixed(0)} mmHg</b> —
          often below DBP, sometimes even negative. This is a known, textbook-acknowledged limitation of the
          simplified 2-element Windkessel model, not a real achievable pressure; a stiffer or higher-resistance
          system (shorter τ) decays measurably faster and closer to true equilibrium within one diastole, which
          is part of why pulse-pressure <i>shape</i>, not just its magnitude, changes with arterial stiffening.
        </Note>
      </Panel>

      <Panel>
        <SectionTitle>Controls</SectionTitle>
        <Slider label="Stroke Volume (SV)" min={30} max={110} step={1} value={SV}
          onChange={setSV} display={`${SV} mL`} color={C.artery} />
        <Slider label="Heart Rate (HR)" min={40} max={160} step={1} value={HR}
          onChange={setHR} display={`${HR} bpm`} />
        <Slider label="Total Peripheral Resistance (R)" min={8} max={30} step={0.2} value={R}
          onChange={setR} display={`${R.toFixed(1)} mmHg·min/L`} color={C.bad} />
        <Slider label="Arterial Compliance (C)" min={0.4} max={3} step={0.05} value={Ccap}
          onChange={setCcap} display={`${Ccap.toFixed(2)} mL/mmHg`} color={C.vein} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          {Object.entries(WK_SCENARIOS).map(([k, s]) => (
            <button key={k} onClick={() => applyScenario(k)} style={toggleStyle(false)}>{s.label}</button>
          ))}
        </div>
      </Panel>
    </div>
  );
}
function ReservoirSVG({ compliance }) {
  const bulge = 20 + Math.min(40, compliance * 18);
  return (
    <svg viewBox="0 0 300 110" style={{ width: "100%", height: 110 }}>
      <line x1="10" y1="55" x2="60" y2="55" stroke={C.artery} strokeWidth="7" strokeLinecap="round" />
      <path d={`M60,${55 - 8} Q150,${55 - bulge} 240,${55 - 8} L240,${55 + 8} Q150,${55 + bulge} 60,${55 + 8} Z`}
        fill={C.artery} opacity="0.22" stroke={C.artery} strokeWidth="2" />
      <line x1="240" y1="55" x2="290" y2="55" stroke={C.hormone} strokeWidth="6" strokeLinecap="round" opacity="0.85" />
      <text x="10" y="90" fontSize="9.5" fill={C.muted}>LV ejection (systole)</text>
      <text x="105" y="20" fontSize="9.5" fill={C.muted}>elastic reservoir (aorta)</text>
      <text x="240" y="90" fontSize="9.5" fill={C.muted}>runoff to arterioles</text>
    </svg>
  );
}

/* ---------------------------------------------------------------
   TAB 2 — Clinical determinants of pulse pressure
----------------------------------------------------------------*/
const PP_ROWS = [
  { cond: "Aging / atherosclerosis", sbp: "↑", dbp: "↔ / ↓", pp: "↑↑", why: "Stiff aorta (↓compliance) — same SV now produces a bigger pressure swing; isolated systolic hypertension" },
  { cond: "Aortic regurgitation", sbp: "↑", dbp: "↓↓", pp: "↑↑", why: "Large total SV ejected forward, plus diastolic runoff of blood back into the LV drops DBP further — classic widened/'bounding' pulse" },
  { cond: "Aortic stenosis", sbp: "↓", dbp: "↔", pp: "↓", why: "Forward SV is reduced by the fixed obstruction — pulsus parvus et tardus (small, slow-rising pulse)" },
  { cond: "Hypovolemia / hemorrhage", sbp: "↓", dbp: "↔ / ↑ (early)", pp: "↓", why: "Reduced SV; compensatory tachycardia and vasoconstriction can transiently support DBP even as PP narrows" },
  { cond: "Fever / hyperthyroidism / AV fistula", sbp: "↑", dbp: "↓", pp: "↑", why: "Increased SV/CO combined with markedly reduced TPR — a hyperdynamic, widened-pulse-pressure state" },
  { cond: "Cardiac tamponade", sbp: "↓", dbp: "↔", pp: "↓ (narrow)", why: "Impaired filling limits SV severely; narrow pulse pressure is part of the classic tamponade picture (with pulsus paradoxus)" },
];

function ClinicalTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Activity}>Clinical Determinants of Pulse Pressure</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PP_ROWS.map((r, i) => (
            <div key={i} style={{ padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{r.cond}</span>
                <span style={{ ...mono, fontSize: 12, color: C.muted }}>SBP {r.sbp} · DBP {r.dbp} · PP {r.pp}</span>
              </div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.8 }}>{r.why}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <Note>
          High-yield pattern-recognition rule: <b style={{ color: C.text }}>widened pulse pressure</b> comes
          from either a big forward stroke volume, a very stiff/non-compliant arterial tree, or abnormally low
          diastolic runoff resistance (AR); <b style={{ color: C.text }}>narrow pulse pressure</b> comes from a
          reduced stroke volume (hypovolemia, tamponade, severe AS) or a compensatory rise in DBP from
          vasoconstriction. Because PP ≈ SV/C, any exam vignette that changes either SV or arterial compliance
          without changing the other is testing this single relationship.
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
    stem: "By the simplified Windkessel relation PP ≈ SV/C, what happens to pulse pressure in an elderly patient with a stiff, atherosclerotic aorta, assuming stroke volume is unchanged?",
    options: ["Pulse pressure falls", "Pulse pressure rises (isolated systolic hypertension)", "Pulse pressure is unaffected by arterial compliance", "Only diastolic pressure changes, not pulse pressure"],
    correct: 1,
    explain: "A stiffer aorta has lower compliance (C); with SV unchanged, PP = SV/C must rise. This is the mechanism of isolated systolic hypertension in the elderly — SBP rises, DBP often falls slightly, and PP widens."
  },
  {
    stem: "Why do veins hold roughly 60–70% of total blood volume at rest, despite carrying the same cardiac output as the arterial side?",
    options: ["Veins have a much smaller total cross-sectional area", "Veins are far more distensible/compliant than arteries, so a small pressure holds a disproportionately large volume", "Veins have thicker, stiffer walls than arteries", "Blood is more viscous in veins, slowing its passage and increasing volume"],
    correct: 1,
    explain: "Veins have thin, highly distensible walls — roughly an order of magnitude more compliant than arteries. At low venous pressures, this compliance allows a large volume to be stored, making veins the body's main blood reservoir (capacitance vessels)."
  },
  {
    stem: "What physically causes the exponential decline of aortic pressure during diastole, and what determines how fast it falls?",
    options: ["Continued ejection from the LV; determined by contractility", "Passive elastic recoil of the stretched arterial wall pushing blood through peripheral resistance; the decay time constant is τ = R×C", "Active vasoconstriction of the aorta itself; determined by sympathetic tone alone", "Backflow through the open aortic valve; determined by valve area"],
    correct: 1,
    explain: "With the aortic valve closed and no new inflow, the aorta's stretched elastic wall recoils and drives the stored blood forward through the resistance vessels — a passive process with an exponential decay governed by the time constant τ = R (resistance) × C (compliance)."
  },
  {
    stem: "A patient with severe aortic regurgitation has a bounding pulse with SBP 160 and DBP 50. What best explains the very low diastolic pressure?",
    options: ["Reduced stroke volume from the LV", "Diastolic runoff of blood backward through the incompetent aortic valve into the LV, in addition to normal peripheral runoff", "Increased arterial compliance only", "Increased total peripheral resistance"],
    correct: 1,
    explain: "In aortic regurgitation, blood escapes two ways during diastole — forward through the normal peripheral circulation and backward through the leaky valve into the LV — causing aortic diastolic pressure to fall unusually fast and low, widening pulse pressure from both ends (high SBP from large total SV, low DBP from the extra runoff pathway)."
  },
  {
    stem: "A patient with severe aortic stenosis has a narrow pulse pressure and a slow-rising carotid upstroke (pulsus parvus et tardus). What is the primary mechanism?",
    options: ["Excess arterial compliance", "The fixed valvular obstruction reduces forward stroke volume and slows the rate of ejection, both of which narrow pulse pressure and blunt the upstroke", "Increased venous return", "Decreased total peripheral resistance"],
    correct: 1,
    explain: "The stenotic valve limits both the volume and the rate of forward ejection; a smaller, slower-delivered stroke volume produces a smaller and more gradual rise in arterial pressure — the classic parvus (small) et tardus (delayed) pulse."
  },
  {
    stem: "Why does the sympathetic nervous system preferentially target venous tone (venoconstriction) rather than arteriolar tone as its fastest way to defend cardiac output during acute hemorrhage?",
    options: ["Veins carry more oxygen than arteries", "The venous system holds the large majority of blood volume, so even modest venoconstriction can 'auto-transfuse' a meaningful volume back toward the heart, raising Psf and venous return (Module 2)", "Arterioles cannot constrict at all", "Venoconstriction directly increases myocardial contractility"],
    correct: 1,
    explain: "Because ~60–70% of blood volume sits in the compliant venous reservoir, even a modest reduction in venous compliance (venoconstriction) mobilizes a large volume toward the heart — raising mean systemic filling pressure (Psf) and venous return, exactly as modeled in Module 2's venous return curve."
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
