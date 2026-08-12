import React, { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceDot, ReferenceLine, ReferenceArea, ResponsiveContainer,
  BarChart, Bar, Cell, AreaChart, Area
} from "recharts";
import {
  Activity, Radio, GitBranch, Brain, RotateCcw,
  CheckCircle2, XCircle, ChevronLeft, HeartPulse, BookOpen
} from "lucide-react";
import ChartContainer from "../components/ChartContainer";

/* ---------------------------------------------------------------
   TOKENS — same system as Modules 1–5, project continuity.
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
  { id: "reflexarc", label: "Reflex Arc", icon: Radio },
  { id: "buffering", label: "Buffering Simulation", icon: Activity },
  { id: "otherreflexes", label: "Other Reflexes", icon: GitBranch },
  { id: "quiz", label: "Self-Test (خودآزمایی)", icon: Brain },
];

export default function CVSBaroreceptorReflex() {
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
            <div style={{ fontSize: 18, fontWeight: 800 }}>Cardiovascular Physiology — Module 6: Baroreceptor Reflex & Autonomic Control</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
              Guyton Ch.18 — the first <i>active</i> control module; everything in Modules 1–5 was mechanical/passive (اولین کنترل فعال عصبی سیستم)
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
        {tab === "reflexarc" && <ReflexArcTab />}
        {tab === "buffering" && <BufferingTab />}
        {tab === "otherreflexes" && <OtherReflexesTab />}
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
function ReflexArcDiagram() {
  const box = (x, y, w, h, label, sub, fill, stroke) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={7} fill={fill} stroke={stroke} strokeWidth="1.5" />
      <text x={x + w / 2} y={y + h / 2 - (sub ? 4 : -4)} fontSize="10.5" fontWeight="700" fill={C.text} textAnchor="middle">{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 11} fontSize="8.5" fill={C.muted} textAnchor="middle">{sub}</text>}
    </g>
  );
  const arrow = (x1, y1, x2, y2, color, label, dashed) => (
    <g>
      <defs>
        <marker id={`arrow-${x1}-${y1}-${x2}-${y2}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2"
        strokeDasharray={dashed ? "4 3" : undefined}
        markerEnd={`url(#arrow-${x1}-${y1}-${x2}-${y2})`} />
      {label && <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 5} fontSize="8.5" fill={color} textAnchor="middle">{label}</text>}
    </g>
  );
  return (
    <svg viewBox="0 0 420 300" style={{ width: "100%", height: 300 }}>
      {box(15, 10, 130, 34, "Carotid sinus", "stretch receptor", C.panel2, C.vein)}
      {box(275, 10, 130, 34, "Aortic arch", "stretch receptor", C.panel2, C.vein)}
      {arrow(80, 44, 130, 92, C.vein, "CN IX")}
      {arrow(340, 44, 220, 92, C.vein, "CN X")}
      {box(130, 92, 160, 34, "NTS (medulla)", "central relay / integration", C.copperDim, C.copper)}
      {arrow(165, 126, 100, 168, C.bad, "inhibits", true)}
      {arrow(275, 126, 320, 168, C.good, "excites")}
      {box(30, 168, 140, 34, "RVLM", "sympathetic/vasomotor center", C.panel2, C.bad)}
      {box(250, 168, 140, 34, "Vagal nuclei", "n. ambiguus / DMNX", C.panel2, C.good)}
      {arrow(60, 202, 60, 244, C.bad, "sym.")}
      {arrow(320, 202, 320, 244, C.good, "vagal")}
      {box(15, 244, 130, 34, "Heart", "rate, conduction, contractility", C.panel2, C.artery)}
      {box(275, 244, 130, 34, "Vessels", "arterioles + veins", C.panel2, C.artery)}
      {arrow(160, 202, 300, 244, C.bad, "sym.", true)}
    </svg>
  );
}
const EFFERENT_TABLE = [
  { target: "SA node (rate)", sym: "↑ Heart rate (β1, positive chronotropy)", para: "↓ Heart rate (dominant vagal tone at rest, negative chronotropy)" },
  { target: "AV node (conduction)", sym: "↑ Conduction velocity (positive dromotropy)", para: "↓ Conduction velocity (can produce AV block at high vagal tone)" },
  { target: "Ventricular muscle", sym: "↑ Contractility (positive inotropy)", para: "Minimal direct effect — sparse vagal innervation of ventricles" },
  { target: "Arterioles", sym: "Vasoconstriction (α1) → ↑ TPR", para: "No significant direct effect on most vascular beds" },
  { target: "Veins", sym: "Venoconstriction → ↑ venous tone / Psf (Module 2)", para: "No significant direct effect" },
];

function FoundationsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Radio}>Where the Sensors Are, and What They Actually Sense</SectionTitle>
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 2 }}>
          Baroreceptors are <b style={{ color: C.text }}>stretch receptors</b> embedded in the vessel wall — they
          respond to wall <i>deformation</i>, not pressure directly, which is why they are more accurately
          called mechanoreceptors. The two key beds are the <b style={{ color: C.text }}>carotid sinus</b>
          (at the internal carotid origin — afferents via cranial nerve <b style={{ color: C.text }}>IX</b>,
          glossopharyngeal) and the <b style={{ color: C.text }}>aortic arch</b> (afferents via cranial nerve
          <b style={{ color: C.text }}> X</b>, vagus). Both converge on the same first central relay: the
          <b style={{ color: C.text }}> Nucleus Tractus Solitarius (NTS)</b> in the medulla.
        </div>
      </Panel>

      <Panel>
        <SectionTitle icon={GitBranch}>The Circuit, Step by Step</SectionTitle>
        <ReflexArcDiagram />
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 2, marginTop: 10 }}>
          ↑MAP → increased wall stretch → increased baroreceptor firing → NTS activated → NTS
          <b style={{ color: C.text }}> inhibits</b> the rostral ventrolateral medulla (RVLM, the main
          sympathetic/vasomotor center) and <b style={{ color: C.text }}>excites</b> the vagal cardioinhibitory
          nuclei (nucleus ambiguus / dorsal motor nucleus of the vagus). Net effect of a
          <i> rise</i> in pressure: sympathetic outflow falls, vagal outflow rises — heart rate falls,
          contractility falls, TPR falls, venous tone falls, and MAP is pulled back down. The reflex is a
          classic <b style={{ color: C.text }}>negative feedback loop</b>: everything works symmetrically in
          reverse for a fall in MAP.
        </div>
      </Panel>

      <Panel>
        <SectionTitle icon={Activity}>Sympathetic vs Parasympathetic — Not Symmetric in What They Control</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {EFFERENT_TABLE.map((r, i) => (
            <div key={i} style={{ padding: 10, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: C.copper, marginBottom: 4 }}>{r.target}</div>
              <div style={{ fontSize: 12, color: C.text }}>Sympathetic: {r.sym}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Parasympathetic: {r.para}</div>
            </div>
          ))}
        </div>
        <Note>
          High-yield asymmetry: the parasympathetic (vagal) limb controls heart rate powerfully but has
          essentially <b style={{ color: C.text }}>no direct effect on TPR, venous tone, or ventricular
          contractility</b> — those are controlled almost exclusively by sympathetic tone (both its activity
          <i> and</i> its withdrawal). A baroreflex-mediated fall in TPR during a hypertensive stimulus is
          sympathetic withdrawal, not active parasympathetic vasodilation — a very common exam trap.
        </Note>
      </Panel>

      <Panel>
        <SectionTitle icon={BookOpen}>Operating Range and "Resetting" — Why the Baroreflex Cannot Fix Chronic Hypertension</SectionTitle>
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 2 }}>
          Baroreceptor firing rate follows a sigmoid (S-shaped) curve against MAP — most sensitive right around
          the normal operating pressure (~90–100 mmHg), and saturated (essentially unresponsive to further
          change) below ~50–60 mmHg and above ~180–200 mmHg (modeled in the next tab). Critically, in chronic
          hypertension the baroreceptors <b style={{ color: C.text }}>reset</b> within 1–2 days — their whole
          sigmoid curve shifts rightward to treat the new, higher pressure as "normal," rather than continuing
          to fight to restore the old, lower pressure. This is exactly why the baroreflex is a fast,
          short-term buffer (seconds to hours) and not a long-term blood-pressure setpoint mechanism — true
          long-term control belongs to the kidney's pressure-natriuresis mechanism (already covered in your
          renal simulator and Module 4's discussion), which does <i>not</i> reset the same way.
        </div>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   MODEL — sigmoid baroreceptor firing curve and derived autonomic
   tone / effector response.
----------------------------------------------------------------*/
function firingRate(MAP, midpoint = 100, slope = 0.07) {
  return 100 / (1 + Math.exp(-slope * (MAP - midpoint)));
}
function autonomicResponse(MAP, midpoint = 100) {
  const firing = firingRate(MAP, midpoint);
  const firingAtBaseline = firingRate(93, midpoint);
  const deltaFiring = firing - firingAtBaseline; // positive if MAP above baseline
  const sympathetic = Math.max(0, Math.min(100, 50 - deltaFiring * 0.9));
  const parasympathetic = Math.max(0, Math.min(100, 50 + deltaFiring * 0.9));
  const symDelta = (sympathetic - 50) / 50; // -1..+1
  return {
    firing,
    sympathetic, parasympathetic,
    dHR: symDelta * 25 - (parasympathetic - 50) * 0.3,
    dContractility: symDelta * 30,
    dTPR: symDelta * 25,
    dVenousTone: symDelta * 20,
  };
}

/* ---------------------------------------------------------------
   TAB 1 — Reflex arc, interactive firing curve + effector snapshot
----------------------------------------------------------------*/
function ReflexArcTab() {
  const [MAP, setMAP] = useState(93);
  const curve = useMemo(() => {
    const arr = [];
    for (let m = 30; m <= 220; m += 2) arr.push({ MAP: m, Firing: +firingRate(m).toFixed(1) });
    return arr;
  }, []);
  const resp = useMemo(() => autonomicResponse(MAP), [MAP]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Radio}>Baroreceptor Firing Rate — Sigmoid Response Curve</SectionTitle>
        <ChartContainer height={220}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curve} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="MAP" stroke={C.muted} fontSize={11} domain={[30, 220]}
                label={{ value: "MAP (mmHg)", position: "insideBottom", offset: -3, fill: C.muted, fontSize: 10.5 }} />
              <YAxis stroke={C.muted} fontSize={11} domain={[0, 100]}
                label={{ value: "Firing rate (% max)", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 10.5 }} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Line type="monotone" dataKey="Firing" stroke={C.copper} strokeWidth={2.4} dot={false} />
              <ReferenceDot x={MAP} y={resp.firing} r={5} fill={C.artery} stroke="none" />
              <ReferenceLine x={93} stroke={C.faint} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <Slider label="Current MAP" min={30} max={220} step={1} value={MAP}
          onChange={setMAP} display={`${MAP} mmHg`} color={C.artery} />
      </Panel>

      <Panel>
        <SectionTitle icon={Activity}>Resulting Autonomic Balance & Effector Response</SectionTitle>
        <AutonomicSeesaw sympathetic={resp.sympathetic} parasympathetic={resp.parasympathetic} />
        <ChartContainer height={160} style={{ marginTop: 14 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: "ΔHR", value: +resp.dHR.toFixed(1) },
              { name: "ΔContractility", value: +resp.dContractility.toFixed(1) },
              { name: "ΔTPR", value: +resp.dTPR.toFixed(1) },
              { name: "ΔVenous tone", value: +resp.dVenousTone.toFixed(1) },
            ]} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis type="number" stroke={C.muted} fontSize={11} domain={[-30, 30]} />
              <YAxis type="category" dataKey="name" stroke={C.muted} fontSize={11} width={100} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <ReferenceLine x={0} stroke={C.faint} />
              <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                {[resp.dHR, resp.dContractility, resp.dTPR, resp.dVenousTone].map((v, i) => (
                  <Cell key={i} fill={v >= 0 ? C.bad : C.good} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <Note>
          This panel shows the immediate reflex output at a given (already-changed) MAP — a snapshot of the
          fast neural response, not the new steady state. To see where the circulation actually settles after
          these effector changes act on the heart and vessels, feed the resulting ΔTPR/Δvenous-tone/ΔHR into
          Module 2's graphical cardiac-function/venous-return intersection, and the ΔContractility/afterload
          into Module 3's PV loop — the baroreflex changes the inputs to those systems, it doesn't replace them.
        </Note>
      </Panel>
    </div>
  );
}
function AutonomicSeesaw({ sympathetic, parasympathetic }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: C.bad, fontWeight: 700 }}>Sympathetic {sympathetic.toFixed(0)}%</span>
        <span style={{ color: C.good, fontWeight: 700 }}>Parasympathetic {parasympathetic.toFixed(0)}%</span>
      </div>
      <div style={{ display: "flex", height: 20, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
        <div style={{ width: `${sympathetic}%`, background: C.bad, transition: "width 0.2s" }} />
        <div style={{ width: `${parasympathetic}%`, background: C.good, transition: "width 0.2s" }} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   TAB 2 — Quantitative buffering simulation (hemorrhage)
----------------------------------------------------------------*/
function bufferedMAP(lossFraction, reflexGain, baselineMAP = 93) {
  let MAP = baselineMAP * (1 - lossFraction);
  const unbuffered = MAP;
  const fBase = firingRate(baselineMAP);
  for (let i = 0; i < 40; i++) {
    const f = firingRate(MAP);
    const sympatheticBoost = Math.max(0, fBase - f) / 100;
    const compensation = reflexGain * sympatheticBoost * baselineMAP;
    const target = unbuffered + compensation;
    MAP = MAP + 0.3 * (target - MAP);
  }
  return { unbuffered, buffered: MAP };
}

function BufferingTab() {
  const [lossPct, setLossPct] = useState(15);
  const [reflexIntact, setReflexIntact] = useState(true);

  const curveData = useMemo(() => {
    const arr = [];
    for (let l = 0; l <= 45; l += 2) {
      const r = bufferedMAP(l / 100, 0.6);
      arr.push({ loss: l, "Without reflex": +r.unbuffered.toFixed(1), "With intact reflex": +r.buffered.toFixed(1), gap: +(r.buffered - r.unbuffered).toFixed(1) });
    }
    return arr;
  }, []);
  const current = bufferedMAP(lossPct / 100, 0.6);
  const shownMAP = reflexIntact ? current.buffered : current.unbuffered;
  const bufferEffectiveness = current.unbuffered < 93 ? Math.max(0, Math.min(100, ((current.buffered - current.unbuffered) / (93 - current.unbuffered)) * 100)) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={Activity}>The "Buffer Nerve" Effect — Hemorrhage Simulation</SectionTitle>
        <ChartContainer height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curveData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={C.border} strokeDasharray="3 3" />
              <XAxis dataKey="loss" stroke={C.muted} fontSize={11}
                label={{ value: "Blood volume lost (%)", position: "insideBottom", offset: -3, fill: C.muted, fontSize: 10.5 }} />
              <YAxis stroke={C.muted} fontSize={11} domain={[30, 100]}
                label={{ value: "MAP (mmHg)", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 10.5 }} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceArea x1={0} x2={25} fill={C.good} fillOpacity={0.06} label={{ value: "compensated", fill: C.good, fontSize: 10, position: "insideTopLeft" }} />
              <ReferenceArea x1={25} x2={45} fill={C.bad} fillOpacity={0.08} label={{ value: "decompensating", fill: C.bad, fontSize: 10, position: "insideTopLeft" }} />
              <Line type="monotone" dataKey="Without reflex" stroke={C.bad} strokeWidth={2} dot={false} strokeDasharray="5 3" />
              <Line type="monotone" dataKey="With intact reflex" stroke={C.good} strokeWidth={2.4} dot={false} />
              <ReferenceDot x={lossPct} y={shownMAP} r={6} fill={C.copper} stroke="#fff" strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <ChartContainer height={90} style={{ marginTop: 4 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={curveData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="loss" stroke={C.muted} fontSize={10} hide />
              <YAxis stroke={C.muted} fontSize={10} domain={[0, 25]} width={30} />
              <Tooltip contentStyle={{ background: C.panel2, border: `1px solid ${C.border}`, fontSize: 12 }} formatter={v => [`${v} mmHg`, "MAP recovered by reflex"]} />
              <Area type="monotone" dataKey="gap" stroke={C.copper} fill={C.copper} fillOpacity={0.25} name="MAP recovered by reflex" />
              <ReferenceDot x={lossPct} y={current.buffered - current.unbuffered} r={4} fill={C.copper} stroke="none" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div style={{ fontSize: 10.5, color: C.muted, textAlign: "center", marginTop: -4 }}>mmHg of MAP actively recovered by the intact reflex, at each severity of blood loss</div>
        <Slider label="Acute blood volume lost" min={0} max={45} step={1} value={lossPct}
          onChange={setLossPct} display={`${lossPct}%`} color={C.bad} />
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button onClick={() => setReflexIntact(true)} style={toggleStyle(reflexIntact)}>Reflex intact</button>
          <button onClick={() => setReflexIntact(false)} style={toggleStyle(!reflexIntact)}>Reflex denervated</button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Readout label="MAP shown" value={shownMAP.toFixed(0)} unit="mmHg" color={reflexIntact ? C.good : C.bad} />
          <Readout label="Drop from baseline" value={(93 - shownMAP).toFixed(0)} unit="mmHg" color={C.hormone} />
          <Readout label="Reflex effectiveness" value={bufferEffectiveness.toFixed(0)} unit="%" color={C.copper} />
        </div>
      </Panel>

      <Panel>
        <Note>
          This is a genuine closed-loop calculation, not a fixed offset: the model solves for where MAP
          settles once the reflex's own compensation (driven by how far MAP has <i>already</i> fallen) is fed
          back in. Two teaching points fall directly out of the shape of these curves: (1) at mild-to-moderate
          blood loss (~10–20%), the intact reflex keeps MAP much closer to baseline than the unbuffered curve —
          this is <b style={{ color: C.text }}>compensated hemorrhagic shock</b>; (2) at severe blood loss
          (~30%+), the two curves converge — the reflex's maximum sympathetic reserve is exhausted (the
          firing-rate curve is already near its lower saturation limit, leaving little further room for
          reflex-driven compensation), which is exactly the transition into
          <b style={{ color: C.text }}> decompensated shock</b>. Denervating the baroreceptors experimentally
          (Guyton's classic finding) produces much larger, more erratic swings in arterial pressure with any
          disturbance — hence "buffer nerves."
        </Note>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------
   TAB 3 — Other cardiovascular reflexes, for contrast
----------------------------------------------------------------*/
const OTHER_REFLEXES = [
  {
    name: "Bainbridge reflex (atrial stretch)",
    stimulus: "↑ Right atrial pressure / venous return (atrial wall stretch)",
    response: "↑ Heart rate (opposite direction from what a pressure-based reflex would predict)",
    note: "Easily confused with the baroreflex, but the sensor, stimulus, and directionality are different — atrial stretch reflexively speeds the heart to keep up with increased venous return, rather than slowing it as a rising arterial pressure would."
  },
  {
    name: "Peripheral chemoreceptors (carotid & aortic bodies)",
    stimulus: "↓O₂, ↑CO₂, ↓pH — primarily a respiratory reflex",
    response: "Cardiovascular effects become significant mainly in severe hypoxia/hypotension: reflex sympathetic activation contributing to pressure support",
    note: "Distinguish from baroreceptors: chemoreceptors are chemically, not mechanically, gated, and their cardiovascular role is a secondary, backup contributor, not the primary fast pressure regulator."
  },
  {
    name: "CNS ischemic response (Cushing reflex)",
    stimulus: "Severe reduction in cerebral blood flow (e.g., rising intracranial pressure, MAP falling below ~50 mmHg)",
    response: "Massive, near-maximal sympathetic activation → marked hypertension, often with reflex bradycardia (secondary baroreflex response to the induced hypertension)",
    note: "The most powerful of all pressure-raising reflexes, but only engages as a last-resort, near-terminal mechanism — not part of everyday pressure regulation."
  },
];

function OtherReflexesTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <SectionTitle icon={GitBranch}>Reflexes Frequently Confused With the Baroreflex</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {OTHER_REFLEXES.map((r, i) => (
            <div key={i} style={{ padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.copper }}>{r.name}</div>
              <div style={{ fontSize: 12.5, color: C.text, marginTop: 4 }}><b>Stimulus:</b> {r.stimulus}</div>
              <div style={{ fontSize: 12.5, color: C.text, marginTop: 2 }}><b>Response:</b> {r.response}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{r.note}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <SectionTitle icon={Activity}>Orthostatic Standing — a Worked Clinical Vignette</SectionTitle>
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 2 }}>
          Standing suddenly pools ~500–700 mL of blood in the dependent leg veins (gravity, against a compliant
          venous system — Module 4's capacitance concept), transiently dropping venous return and MAP. The
          baroreflex responds within 1–2 heartbeats: sympathetic outflow rises (↑HR, ↑contractility, ↑TPR,
          ↑venous tone), pulling MAP back toward baseline within seconds. <b style={{ color: C.text }}>Orthostatic
          hypotension</b> (symptomatic BP drop on standing) reflects a failure somewhere in this arc — most
          often autonomic neuropathy (e.g., diabetic, Parkinsonian), volume depletion (less to buffer with),
          or drugs blunting the sympathetic response (α-blockers, some antihypertensives) — not a failure of
          gravity or of the veins themselves.
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
    stem: "A sudden rise in MAP increases baroreceptor firing. What is the net effect on heart rate, contractility, and TPR?",
    options: ["All three increase", "All three decrease (↓sympathetic outflow, ↑vagal outflow)", "Heart rate decreases but contractility and TPR increase", "No change — baroreceptors only affect respiration"],
    correct: 1,
    explain: "↑Firing → NTS inhibits the sympathetic (vasomotor) center and excites the vagal cardioinhibitory nuclei → sympathetic withdrawal + vagal activation → ↓HR, ↓contractility, ↓TPR, ↓venous tone — a coordinated negative-feedback response pulling MAP back down."
  },
  {
    stem: "Which cranial nerve carries afferent baroreceptor signals from the carotid sinus, and which from the aortic arch?",
    options: ["Both via CN X (vagus)", "Carotid sinus via CN IX (glossopharyngeal); aortic arch via CN X (vagus)", "Carotid sinus via CN X; aortic arch via CN IX", "Both via CN XII (hypoglossal)"],
    correct: 1,
    explain: "The carotid sinus baroreceptors signal via the glossopharyngeal nerve (CN IX, Hering's nerve branch); the aortic arch baroreceptors signal via the vagus nerve (CN X). Both converge on the NTS."
  },
  {
    stem: "During a baroreflex-mediated fall in TPR (e.g., in response to a hypertensive stimulus), what is the direct cause at the level of the arteriolar smooth muscle?",
    options: ["Active parasympathetic vasodilation", "Withdrawal of sympathetic vasoconstrictor tone (parasympathetic fibers do not significantly innervate most arterioles)", "Direct vagal innervation of arterioles causing relaxation", "Release of acetylcholine at the arteriolar wall"],
    correct: 1,
    explain: "Peripheral arterioles receive essentially no significant parasympathetic innervation; the baroreflex's effect on TPR is entirely mediated by changes in sympathetic vasoconstrictor tone (withdrawal lowers TPR, activation raises it), not by an active parasympathetic vasodilator pathway."
  },
  {
    stem: "Why does the baroreflex fail to correct a patient's chronic essential hypertension, even though the baroreceptors are anatomically intact and functional?",
    options: ["Baroreceptors are permanently destroyed in hypertension", "The baroreceptors 'reset' within 1–2 days to treat the new, higher pressure as their new normal operating point, rather than continuing to defend the old pressure", "The vagus nerve stops functioning entirely in hypertension", "Chronic hypertension has no measurable effect on baroreceptor function"],
    correct: 1,
    explain: "Baroreceptor resetting shifts the entire sigmoid firing curve rightward over 1–2 days to match the new chronic pressure — this is exactly why the baroreflex is considered a short-term buffer, not a long-term blood-pressure setpoint mechanism; true long-term control belongs to the renal pressure-natriuresis system."
  },
  {
    stem: "In a hemorrhage-buffering simulation, why does the gap between 'with reflex' and 'without reflex' MAP shrink again at very severe blood loss (e.g., >30–35%)?",
    options: ["The reflex becomes more effective at extreme blood loss", "The baroreceptor firing rate has already approached its lower saturation limit, leaving little further room for reflex-driven sympathetic compensation — the reserve is exhausted", "Parasympathetic tone overrides the reflex at severe blood loss", "Severe blood loss triggers a completely different, unrelated reflex"],
    correct: 1,
    explain: "The sigmoid firing curve saturates at low MAP — once firing is already near its floor, further pressure falls produce little additional change in firing, so little additional sympathetic compensation can be recruited. This marching-toward-saturation is the physiological basis of the transition from compensated to decompensated hemorrhagic shock."
  },
  {
    stem: "A patient's heart rate rises sharply as IV fluids are rapidly infused, raising right atrial pressure — the opposite of what an isolated arterial baroreflex would predict for a rising pressure. What reflex explains this?",
    options: ["The baroreflex, working normally", "The Bainbridge reflex — atrial stretch receptors reflexively increase heart rate to accommodate increased venous return", "The Cushing reflex", "Peripheral chemoreceptor activation"],
    correct: 1,
    explain: "The Bainbridge reflex responds to atrial (not arterial) stretch and increases heart rate as venous return rises — a distinct sensor, stimulus, and directionality from the arterial baroreflex, which would instead tend to slow the heart if arterial pressure itself were rising."
  },
  {
    stem: "A patient with rising intracranial pressure develops severe hypertension together with reflex bradycardia. What is the primary reflex responsible for the hypertension component?",
    options: ["The Bainbridge reflex", "The baroreflex, working to raise pressure", "The CNS ischemic response (Cushing reflex) — severe cerebral ischemia triggers massive, near-maximal sympathetic activation as a last-resort mechanism to restore cerebral perfusion", "Peripheral chemoreceptor stimulation from hypoxia alone"],
    correct: 2,
    explain: "Severely reduced cerebral blood flow (from rising ICP compressing cerebral vessels) triggers the CNS ischemic response — the most powerful pressor reflex in the body, producing marked hypertension; the accompanying bradycardia is then a secondary baroreflex response to that induced hypertension (the Cushing reflex triad also includes irregular respirations)."
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
