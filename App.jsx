import React, { useEffect, useMemo, useState } from "react";
import CVSBasicHemodynamics from "./modules/01-basic-hemodynamics";
import CVSFrankStarlingVenousReturn from "./modules/02-frank-starling-venous-return";
import CVSCardiacCyclePVLoop from "./modules/03-cardiac-cycle-pv-loop";
import CVSVascularDistensibility from "./modules/04-vascular-distensibility-pulse-pressure";
import CVSMicrocirculation from "./modules/05-microcirculation-starling-forces";
import CVSBaroreceptorReflex from "./modules/06-baroreceptor-reflex";
import CVSLocalHumoralControl from "./modules/07-local-humoral-control";
import CVSExerciseConceptMap from "./modules/08-exercise-concept-map";

const MODULES = [
  { id: "01", title: "Basic Hemodynamics", subtitle: "Flow, pressure, resistance & Poiseuille", Component: CVSBasicHemodynamics },
  { id: "02", title: "Frank–Starling & Venous Return", subtitle: "Preload, venous return & cardiac function", Component: CVSFrankStarlingVenousReturn },
  { id: "03", title: "Cardiac Cycle & PV Loop", subtitle: "Pressure–volume relationships", Component: CVSCardiacCyclePVLoop },
  { id: "04", title: "Vascular Distensibility & Pulse Pressure", subtitle: "Compliance, stiffness & arterial buffering", Component: CVSVascularDistensibility },
  { id: "05", title: "Microcirculation & Starling Forces", subtitle: "Filtration, glycocalyx & edema", Component: CVSMicrocirculation },
  { id: "06", title: "Baroreceptor Reflex & Autonomic Control", subtitle: "Neural short-term blood pressure regulation", Component: CVSBaroreceptorReflex },
  { id: "07", title: "Local & Humoral Control of Blood Flow", subtitle: "Autoregulation, hyperemia & circulating messengers", Component: CVSLocalHumoralControl },
  { id: "08", title: "Exercise — Integrated Response", subtitle: "Concept map linking Modules 1–7 into one network", Component: CVSExerciseConceptMap },
];

export default function App() {
  const [active, setActive] = useState(() => localStorage.getItem("cvs.active") || "home");
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("cvs.theme");
    if (saved === "light") return false;
    if (saved === "dark") return true;
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? true;
  });

  useEffect(() => {
    localStorage.setItem("cvs.active", active);
    localStorage.setItem("cvs.theme", dark ? "dark" : "light");
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute("content", dark ? "#0b1020" : "#f5f7fb");
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
        <div className="home-actions">
          <a
            className="github-button"
            href="https://github.com/HamedKhaan/CVS-PHYSIO"
            target="_blank"
            rel="noreferrer"
            aria-label="Open the CVS Physiology GitHub repository"
          >
            GitHub ↗
          </a>
          <button className="theme-button" onClick={() => setDark(v => !v)}>
            {dark ? "☀︎ Light" : "☾ Dark"}
          </button>
        </div>
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
        <a href="https://github.com/HamedKhaan/CVS-PHYSIO" target="_blank" rel="noreferrer">github.com/HamedKhaan/CVS-PHYSIO</a>
      </footer>
    </div>
  );
}
