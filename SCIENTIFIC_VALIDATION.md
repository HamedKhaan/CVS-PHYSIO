# Scientific validation — CVS Interactive Physiology

## Scope

This document records the scientific-validation status of the cardiovascular physiology models in the application. The current project contains **8 modules**. The UI/packaging patch v4.1.2 does not intentionally alter physiological equations or educational text.

The validation is a content/logic audit, not a substitute for formal peer review.

## Modules covered

1. Basic Hemodynamics
2. Frank–Starling & Venous Return
3. Cardiac Cycle & PV Loop
4. Vascular Distensibility & Pulse Pressure
5. Microcirculation & Starling Forces
6. Baroreceptor Reflex & Autonomic Control
7. Local & Humoral Control of Blood Flow
8. Exercise — Integrated Response

## Previously validated model points

### 1. Basic hemodynamics
- Poiseuille relationship is implemented as R = 8ηL/(πr^4), with the expected fourth-power radius dependence.
- Continuity is represented as an idealized steady-flow relationship; velocity falls in the capillary bed because total cross-sectional area is much larger.
- The model is an idealized teaching model; real blood is non-Newtonian and vessels are compliant.

### 2. Frank–Starling / venous return
- The core relationships are physiologically appropriate: cardiac output equals venous return at steady state; preload affects stroke volume; venous return depends on the pressure gradient between mean systemic filling pressure and right atrial pressure and on resistance to venous return.
- The plateau at sufficiently negative right-atrial pressure is consistent with collapsible great veins.
- These are simplified Guyton-style teaching models, not patient-specific hemodynamic simulations.

### 3. Cardiac cycle / pressure-volume loop
- EDV, ESV, SV = EDV − ESV and EF = SV/EDV are correctly represented.
- The four mechanical phases of the LV cycle are represented.
- ESPVR/EDPVR and arterial elastance are useful conceptual models.
- Ees should be interpreted as a derived experimental/physiological index, not an absolutely load-independent clinical truth.

### 4. Vascular distensibility / pulse pressure
- Compliance = ΔV/ΔP and distensibility normalized to initial volume are correctly represented.
- Pulse pressure is ΔP; PP ≈ SV/C is a simplified Windkessel approximation, not a universal clinical equation.
- The regurgitation model is intentionally simplified and is not a clinical quantitative model of aortic regurgitation.

### 5. Microcirculation / Starling forces
- The classic Starling equation is represented as:
  NFP = (Pc − Pi) − σ(πc − πi).
- The classic equation is explicitly a teaching model.
- The modern endothelial glycocalyx/revised-Starling framework is important; the old arterial-end filtration / venous-end reabsorption picture is not a complete modern description.

### 6–8
Modules 6–8 cover baroreceptor/autonomic control, local/humoral blood-flow control, and integrated exercise physiology. Their interactive presentation should be interpreted as conceptual teaching models rather than quantitative patient simulators. Any future content revision should be independently reviewed against a standard cardiovascular physiology text/reference before being labeled scientifically validated.

## Software/content boundary

This application is educational. It is not intended for diagnosis, treatment selection, medication dosing, or clinical decision-making.
