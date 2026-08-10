import React, { useEffect, useMemo, useState } from "react";
import CVSBasicHemodynamics from "./modules/01-basic-hemodynamics";
import CVSFrankStarlingVenousReturn from "./modules/02-frank-starling-venous-return";
import CVSCardiacCyclePVLoop from "./modules/03-cardiac-cycle-pv-loop";
import CVSVascularDistensibility from "./modules/04-vascular-distensibility-pulse-pressure";
import CVSMicrocirculation from "./modules/05-microcirculation-starling-forces";

const MODULES = [
  { id: "01", title: "Basic Hemodynamics", subtitle: "Flow, pressure, resistance & Poiseuille", Component: CVSBasicHemodynamics },
  { id: "02", title: "Frank–Starling & Venous Return", subtitle: "Preload, venous return & cardiac function", Component: CVSFrankStarlingVenousReturn },
  { id: "03", title: "Cardiac Cycle & PV Loop", subtitle: "Pressure–volume relationships", Component: CVSCardiacCyclePVLoop },
  { id: "04", title: "Vascular Distensibility & Pulse Pressure", subtitle: "Compliance, stiffness & arterial buffering", Component: CVSVascularDistensibility },
  { id: "05", title: "Microcirculation & Starling Forces", subtitle: "Filtration, glycocalyx & edema", Component: CVSMicrocirculation },
  { id: "06", title: "Module 06", subtitle: "Reserved for the next cardiovascular physiology module", Component: null },
  { id: "07", title: "Module 07", subtitle: "Reserved for the next cardiovascular physiology module", Component: null },
  { id: "08", title: "Module 08", subtitle: "Reserved for the next cardiovascular physiology module", Component: null },
];

export default function App() {
  const [active, setActive] = useState(() => localStorage.getItem("cvs.active") || "home");
  const [dark, setDark] = useState(() => localStorage.getItem("cvs.theme") !== "light");

  useEffect(() => {
    localStorage.setItem("cvs.active", active);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [active, dark]);

  const current = useMemo(() => MODULES.find(m => m.id === active), [active]);

  if (current?.Component) {
    const Module = current.Component;
    return (
      <div className="app-shell">
        <header className="app-bar">
          <button className="top-button" onClick={() => setActive("home")} aria-label="Back to modules">← Modules</button>
          <div className="app-title">{current.id} · {current.title}</div>
          <button className="top-button" onClick={() => setDark(v => !v)} aria-label="Toggle theme">{dark ? "☀︎" : "☾"}</button>
        </header>
        <main className="module-host"><Module /></main>
      </div>
    );
  }

  return (
    <div className="home">
      <header className="home-hero">
        <div>
          <div className="eyebrow">INTERACTIVE PHYSIOLOGY</div>
          <h1>Cardiovascular System</h1>
          <p>Interactive models for understanding cardiovascular physiology — designed for study, exploration and clinical reasoning.</p>
        </div>
        <button className="theme-button" onClick={() => setDark(v => !v)}>{dark ? "☀︎ Light" : "☾ Dark"}</button>
      </header>

      <section className="module-grid" aria-label="Modules">
        {MODULES.map(m => (
          <button
            key={m.id}
            className={`module-card ${!m.Component ? "placeholder" : ""}`}
            onClick={() => m.Component && setActive(m.id)}
            disabled={!m.Component}
          >
            <span className="module-number">{m.id}</span>
            <span className="module-card-title">{m.title}</span>
            <span className="module-card-subtitle">{m.subtitle}</span>
            <span className="module-card-action">{m.Component ? "Open module →" : "Coming later"}</span>
          </button>
        ))}
      </section>

      <footer className="home-footer">
        <span>Offline-first architecture</span>
        <span>React · Vite · Capacitor-ready</span>
      </footer>
    </div>
  );
            }
