# Hospital ERP — Comprehensive UI & UX Design Brief

> **Version:** 2.0  
> **Document Status:** Official Production Design Brief  
> **Target Audience:** Product Designers, Frontend Engineers, Clinical Stakeholders, QA Engineers  
> **Design Philosophy:** Human-Centered Clinical Precision · Zero Cognitive Overload · High-Speed Ergonomics · Total Reliability

---

## 1. Executive Summary & Vision

The **Hospital ERP Frontend** is a mission-critical web application serving healthcare professionals (triage nurses, attending physicians, ward managers, medical receptionists, and hospital administrators). 

In a high-pressure clinical environment, software is not merely an administrative tool—it directly impacts patient safety, treatment latency, and medical team ergonomics. A cluttered or unresponsive UI increases cognitive fatigue, heightens the risk of medication errors, and delays life-saving interventions.

### The Ultimate Goal: **GREAT UX**
To achieve world-class UX, the platform adheres to four foundational pillars:
1. **Zero Cognitive Friction:** The clinician can glance at a screen and comprehend patient acuity, bed status, and pending tasks in less than 2 seconds.
2. **Clinical Safety & Strict Data Containment:** Critical values (BP, SpO2, MRN, Triage category) must never overflow, wrap haphazardly, or overlap neighboring elements.
3. **High-Speed Action Ergonomics:** Repetitive clinical tasks (admissions, bed transfers, triage updates) take maximum 3 clicks, with intuitive keyboard shortcuts and clear visual confirmation.
4. **Adaptive Multi-Device Resilience:** Flawless operation whether docked at a 27" nurse workstation (1920×1080), carried on an iPad/Android tablet during ward rounds (768–1024px), or consulted by an on-call doctor on a smartphone (375px+).

---

## 2. Visual Identity & Color Architecture

Healthcare systems require scientifically calibrated color palettes. Color must signify **meaning and acuity**, not mere decoration.

### 2.1 Brand & Neutral Foundation
| Token Name | Hex Code | Purpose & Usage |
|---|---|---|
| `--color-primary-600` | `#0284c7` | Clinical Sapphire — Primary brand, active states, key CTAs |
| `--color-primary-700` | `#0369a1` | Hover state for primary buttons |
| `--color-primary-800` | `#075985` | Active/Pressed state for primary buttons |
| `--color-primary-50` | `#f0f9ff` | Subtle primary surface / active table row highlight |
| `--color-canvas-bg` | `#f8fafc` | Clean clinical slate background (low glare, reduces eye strain) |
| `--color-surface` | `#ffffff` | Elevated card and container background |
| `--color-text-title` | `#0f172a` | High-contrast headline text (WCAG AAA compliant) |
| `--color-text-body` | `#1e293b` | Primary body and table text |
| `--color-text-muted` | `#64748b` | Secondary labels, descriptions, and timestamps |
| `--color-border-subtle`| `#e2e8f0` | Crisp card borders, table dividers |

---

### 2.2 Emergency Triage Acuity System (P1 – P5)
Standardized according to international Emergency Severity Index (ESI) & Manchester Triage protocols:

```
[ P1 RESUSCITATION ] ─── Crimson Red   (#ef4444 / bg #fef2f2 / border #fecaca) ── Immediate (<0 min)
[ P2 VERY URGENT   ] ─── Tangerine     (#ea580c / bg #fff7ed / border #fed7aa) ── Very Urgent (≤10 min)
[ P3 URGENT        ] ─── Amber Gold    (#d97706 / bg #fffbeb / border #fde68a) ── Urgent (≤60 min)
[ P4 STANDARD      ] ─── Emerald Green (#10b981 / bg #ecfdf5 / border #a7f3d0) ── Routine (≤120 min)
[ P5 NON-URGENT    ] ─── Cobalt Slate  (#0284c7 / bg #f0f9ff / border #bae6fd) ── Non-Urgent (≤240 min)
```

- **Special Motion Rule:** P1 cases display a gentle CSS pulse animation (`clinical-pulse 2s infinite`) to draw peripheral visual attention without causing sensory overload.

---

### 2.3 Bed Management Status Matrix
For Inpatient Ward mapping and interactive bed allocation:

| Bed State | Base Color | Background | Border | Semantic Meaning |
|---|---|---|---|---|
| **Available** | `#10b981` (Emerald) | `#ecfdf5` | `#a7f3d0` | Bed cleaned, sanitized, and ready for immediate admission |
| **Occupied** | `#2563eb` (Royal Blue) | `#eff6ff` | `#bfdbfe` | Admitted patient in bed; display patient name & MRN |
| **Cleaning** | `#d97706` (Warm Amber) | `#fffbeb` | `#fde68a` | Patient discharged; undergoing sanitary turnover |
| **Maintenance**| `#ef4444` (Rose Red) | `#fef2f2` | `#fecaca` | Bed defective or equipment repair in progress |

---

## 3. Typography Hierarchy

The typography system is engineered for **instant scannability and zero ambiguity** between similar alphanumeric glyphs (such as `0` vs `O`, `1` vs `l`).

### 3.1 Font Families
- **Primary Interface Font:** `'Plus Jakarta Sans'`, `'Inter'`, `-apple-system`, `sans-serif`
  - High x-height, crisp open apertures, and modern clinical aesthetic.
- **Monospace Clinical Data Font:** `'JetBrains Mono'`, `'SF Mono'`, `monospace`
  - Used exclusively for **MRN (Medical Record Numbers)**, **Blood Pressure (e.g. 120/80)**, **Timestamps (14:32:05)**, and **Lab Values** to guarantee tabular alignment.

### 3.2 Typographic Scale & Weights
| Level | Font Size | Weight | Line Height | Application |
|---|---|---|---|---|
| **Display Header** | 24px | 800 (ExtraBold) | 32px | Page titles (e.g. "Emergency Workstation", "IPD Live Beds") |
| **Section Title** | 16px–18px | 700 (Bold) | 24px | Card headers, drawer titles, modal headers |
| **Subheading** | 13px–14px | 600 (SemiBold) | 20px | Table column headers, field group legends |
| **Body Primary** | 13px | 500 (Medium) | 18px | Primary table cells, patient names, input values |
| **Body Secondary** | 12px | 400 (Regular) | 16px | Timestamps, secondary descriptions, metadata |
| **Micro Caption** | 10px–11px | 700 (Bold) | 14px | Status tags, uppercase acuity badges, MRN chips |

---

## 4. Layout Architecture & Spatial Grid

### 4.1 Master Shell Architecture
```
┌────────────────────────────────────────────────────────────────────────┐
│  HEADER BAR (Sticky, 64px, z-index: 100, border-bottom: #e2e8f0)      │
│  [Hospital Logo / Title]    [Global Search]     [Shift Info] [Avatar]  │
├──────────────┬─────────────────────────────────────────────────────────┤
│              │  CONTENT WORKSPACE (Fluid max 1600px, padding: 16-24px) │
│  COLLAPSIBLE │  ┌───────────────────────────────────────────────────┐  │
│  SIDEBAR     │  │ 1. KPI STATS ROW (4-5 metric cards)               │  │
│  (240px wide │  ├───────────────────────────────────────────────────┤  │
│   or 80px    │  │ 2. CONTROL & FILTER BAR (Search, Selects, Action) │  │
│   collapsed) │  ├───────────────────────────────────────────────────┤  │
│              │  │ 3. PRIMARY DATA VIEW                              │  │
│              │  │    (Bed Grid / Roster Table / Schedule Matrix)    │  │
│              │  └───────────────────────────────────────────────────┘  │
└──────────────┴─────────────────────────────────────────────────────────┘
```

### 4.2 Data Table Containment Rules (Non-Negotiable)
Following the clinical data containment audit:
1. **Fixed Layout Mandatory:** All data tables MUST include `tableLayout="fixed"`.
2. **Explicit Column Budgeting:** Every single column must declare an explicit pixel `width`.
3. **Scroll Bounds Alignment:** The table's `scroll.x` MUST equal the exact mathematical sum of all column widths.
4. **Ellipsis & Tooltip Pairing:** Any unbounded textual column (e.g., *Chief Complaint*, *Discharge Summary*, *Diagnosis*) must use `textOverflow: 'ellipsis'` with an informative `<Tooltip>` so full details are available on hover without pushing neighboring cells.
5. **Right-Fixed Actions:** Action button clusters are pinned via `fixed: 'right'` to remain perpetually accessible during horizontal scrolling.

---

## 5. Key Component Specifications

### 5.1 KPI Metric Stat Cards
- **Purpose:** Present high-level operational pulse at the top of each clinical station.
- **Styling:**
  - Background: Pure white `#ffffff` or tinted acuity background (e.g., `#fef2f2` for Resuscitation).
  - Border: 1px solid `#e2e8f0` (or accent border `#fecaca`).
  - Corner Radius: `12px`.
  - Elevation: Minimal clean shadow `0 1px 3px rgba(0,0,0,0.03)`.
  - Icon Badge: 36×36px rounded square with high-contrast icon.
  - Number Display: 24px bold numeric display with instant clarity.

### 5.2 Interactive Bed Management Grid
- **Card Anatomy:**
  - Top Bar: Bed Code (e.g. `ICU-01`) + Bed Status Tag (Available / Occupied).
  - Middle: If occupied, patient name, gender, age, MRN, and admitting diagnosis.
  - Bottom: Quick clinical actions (`Admit`, `Transfer`, `Discharge`, `Details`).
- **Interactive Affordance:**
  - Hover raises card by `-2px` with smooth transition (`transition: all 0.2s ease`).
  - Empty beds feature dashed or translucent borders inviting direct 1-click admission.

### 5.3 Clinical Drawers vs. Quick Modals
- **Modals (Dialogs):**
  - Reserved for **focused, atomic transactions** (e.g., Confirm Discharge, Bed Transfer, Quick Patient Check-In).
  - Max width: `560px` to `680px`.
  - Header with prominent title and patient context strip.
- **Drawers (Slide-overs):**
  - Used for **rich, multi-tabbed clinical assessments** (e.g., Full Triage Assessment, Case Details, Bed Stay History).
  - Width: `600px` on desktop, `100vw` on mobile.
  - Keeps underlying dashboard context visually grounded while clinician documents care.

### 5.4 Form Controls & Data Entry
- **Inputs & Selects:** Height `40px`, border radius `8px`, border color `#cbd5e1`.
- **Focus Rings:** Gentle Sapphire glow `box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2)`.
- **Validation Messages:** Positioned directly below field with `#ef4444` rose-red text and icon.

---

## 6. Micro-Interactions & Motion Design

Clinical software must feel snappy, tactile, and reassuring without distracting animations.

### 6.1 Principles of Clinical Motion
1. **Speed & Restraint:** All transitions duration between `150ms` and `250ms` using `cubic-bezier(0.4, 0, 0.2, 1)`.
2. **State Transparency:** When an asynchronous mutation begins (e.g., assigning a bed), buttons immediately enter a loading state (`loading={true}`) to prevent double-submits.
3. **Reassuring Success Feedback:** Instant AntD `message.success()` or notification banner confirming the action with specific identifiers (e.g., *"Patient Abebe Kebede admitted to Bed ICU-02"*).
4. **Destructive Guardrails:** Critical destructive actions (e.g. Discharging an Inpatient, Cancelling Surgery/Appointment) require a two-step `Popconfirm` with distinct Red Danger styling.

---

## 7. Responsive Behavior & Device Matrix

| Viewport | Device Profile | UI Behavior & Adjustments |
|---|---|---|
| **Desktop (≥ 1200px)** | Nurse Stations, Doctor Desks | Full 240px sidebar, multi-column KPI rows, full data tables with horizontal scroll containers, expanded bed grids. |
| **Tablet (768px – 1199px)** | Ward Rounding Tablets (iPads) | Collapsible compact sidebar (80px), 2-column KPI grids, 3-column bed cards, touch-optimized button hit areas (≥40px). |
| **Mobile (320px – 767px)** | On-call Smartphones | Header collapses to hamburger icon with off-canvas slide-out navigation; Modals and Drawers fill full viewport width (`calc(100vw - 16px)`); Tabs become horizontally swipeable. |

---

## 8. Accessibility (A11y) & Safety Standards

1. **WCAG 2.1 Level AA/AAA Compliance:**
   - Text to background contrast ratio ≥ 4.5:1 for regular text and ≥ 7:1 for headings and vital signs.
2. **Never Color-Alone:**
   - Color is never the sole carrier of clinical meaning. Triage badges pair color with text and icons (e.g., `🔴 P1 Immediate`).
3. **Keyboard Operability:**
   - Every modal and drawer supports `Esc` dismissal.
   - Forms support full `Tab` sequence traversal.
4. **Touch Target Sizing:**
   - Interactive buttons, dropdown triggers, and icons have a minimum clickable hit area of 40×40px for error-free finger tapping on touchscreens.

---

## 9. Design System Token Mapping (Codebase Reference)

All future components must reference the centralized theme tokens defined in:
- `src/theme/themeConfig.ts` (`aderaTheme`)
- `src/index.css` (Global layout & containment utilities)

### Example Token Mapping:
```typescript
// Button Token Alignment
Button: {
  controlHeight: 38,
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 13,
  primaryShadow: '0 2px 4px 0 rgba(2, 132, 199, 0.16)',
}

// Table Token Alignment
Table: {
  borderRadius: 12,
  headerBg: '#f8fafc',
  headerColor: '#475569',
  cellPaddingBlock: 12,
  cellPaddingInline: 12,
  fontSize: 13,
}
```

---

## 10. Summary Checklist for Every New Screen
Before any new module or clinical screen is shipped, verify:
- [ ] Table has `tableLayout="fixed"` and `scroll.x` matches column sums.
- [ ] Long text fields have explicit `width`, `ellipsis`, and a `<Tooltip>`.
- [ ] Triage or Acuity statuses use standardized semantic color tokens.
- [ ] Page renders smoothly on 375px mobile viewport without horizontal page break.
- [ ] Destructive actions have explicit two-step confirmations.
- [ ] All 15+ automated integration tests continue to pass.
