import React, { useState } from "react";
import {
  ChevronRight, ChevronDown, ChevronLeft, AlertTriangle, CheckCircle2, Clock, Truck,
  X, Info, Lock, FileText, Plus, Package, Building2, Search, Settings, Bell, Pencil,
  Calendar, MapPin, UserCheck, ShieldCheck, RotateCcw, Users, DollarSign, ArrowRight,
  Upload, Wrench, ClipboardList, Ship, Boxes, LayoutDashboard, CircleDot, Circle, Trash2,
  History, KeyRound,
} from "lucide-react";

/* ════ palette ════ */
const C = {
  page: "#F3F3F3", card: "#fff", border: "#DDDBDA", borderLt: "#EAEAEA",
  text: "#181818", sub: "#5C5C5C", subLt: "#706E6B", link: "#0176D3", linkDk: "#014486",
  band1: "#EAF0F6", band2: "#E1E9F2", topBar: "#16325C",
  ok: "#2E844A", okBg: "#EFFCF4", warn: "#A56500", warnBg: "#FEF3E7",
  info: "#0176D3", infoBg: "#EEF4FE", purp: "#7526E3", purpBg: "#F4EEFC",
  err: "#BA0517", errBg: "#FEF1EE", neutral: "#5C5C5C", neutralBg: "#F2F2F2",
  green: "#3BA755", greenCell: "#D6F0DC", orange: "#E8762A", orangeCell: "#FBE3D0",
  iconOrder: "#0B827C", iconCase: "#F2842B", iconAsset: "#5C5BC9",
};
const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/* ════ master lists ════ */
const MIXERS = ["McNeilus", "Beck", "Terex / Terex Advance", "Revolution Concrete Mixers", "Oshkosh", "ConTech", "Continental"];
const PROPULSION = ["Pump", "Pressure"];
const SYSTYPES = ["V3", "V3 w/ Admix", "V5 Basic (VAS)", "Spark", "V5 w/ Temperate Water (module-only upgrade)", "V5 w/ Cold Water (module-only upgrade)", "V5 w/ Admix (module-only upgrade)"];
const INSTALL_REASON = ["Fleet expansion", "New Account", "Upgrade"];
const MOVE_REASON = ["De-install & Re-install (new truck)", "De-install – Return to Verifi", "De-install – Keep at Account", "Re-Install due to Truck Damage/Paint/New Drum/etc.", "Account Change (no field work)"];
const TYPE_OF_INSTALL = ["Full", "Partial", "Retrofit"];
const WORKBY = ["Verifi", "Customer", "3rd Party"];
const POSTINSTALL = ["Air system works & free of leaks (OEM + Verifi)", "Water system works & free of leaks (OEM + Verifi)", "Hydraulic connections free of leaks (OEM + Verifi)", "System has greater than 5 satellites", "Connected to cellular network & backend", "Hydraulic connections correct (Charge & Discharge)", "Registering drum speeds correctly", "Adding fluids (water & admix) accurately (WNM)", "All connections properly tightened", "All cables & hoses secured / protected from abrasion", "Truck free & cleaned of installation debris", "All Documentation Complete"];
const VERIFI_COMMISSION = ["Tilt", "Settings", "System config (e.g. Beck, 12yrd, pump)", "Firmware", "Software", "Commission (HUB)", "Software / Setting Updates", "CAN / Component Testing", "Admix testing", "FDM Bypassed?"];
const OPS_CHECKLIST = [["Verifi POC", "FSM"], ["Scope Document Created", "Install Specialist"], ["Parts Order Placed", "CSM"], ["Internal Meeting Conducted", "Install Specialist"], ["Locations & Install Order Identified", "Install Specialist"], ["Implementation Sheet Updated", "Install Specialist"], ["Install Team Selected & Scheduled", "Install Specialist"], ["Kickoff Meeting with Install Team", "Install Specialist"], ["Return Shipment BOL Request → routes to owner", "FSM"]];
const PRESET_FILES = ["v5 equipment & install content.pdf", "v5 install Guide.pdf", "FST V5 Installation Checklist.docx", "FST V5 Air Schematics Checklist.docx", "FST V5 Truck Testing Checklist.docx"];
const PERMISSIONS = [["Field Technicians", "Create & update Verified Installs cases"], ["Install Contractor", "Update cases (future placeholder)"], ["FSMs & FSTs", "Create, review, approve, close"], ["Operations Manager", "Full access"], ["Salesforce Admins", "Full config & governance"]];
const UNIT_JOURNEY = ["Parts Ordered", "Shipped", "Unit Created", "Installed", "Validated", "Closed", "Returned / Billed"];

/* ════ pre-filled single customer ════ */
const ACCOUNT = "Northgate Ready Mix";
function coli(id, type, unit, truck, status, by, extra = {}) {
  return { id, type, unit, truck, status, by, stampedTruck: type === "Re-Install" ? "—" : truck, ...extra,
    fields: { mixer: "McNeilus", propulsion: "Pump", sysType: "V5 Basic (VAS)", tcg: unit, wds: "WDS-" + id.slice(-3), vin: "1M2" + id.slice(-4), plant: "Plant 4", installDate: "7/01/2026", contractor: by === "3rd Party" ? "3rd-party crew" : "Verifi FST", cabMake: "Freightliner", admix: "No", tc4: "TC4-" + id.slice(-3), wdsMac: "AA:BB:" + id.slice(-2), ballValve: "No", spraybar: "No" } };
}
const seedCases = {
  "ORD-00021": { id: "ORD-00021", kind: "Ordering", account: ACCOUNT, reason: "New Install (Fleet expansion)", subject: "Order parts — 3-truck fleet expansion", status: "In Progress", owner: "Demo CSM", created: "6/20/2026", truckCount: 3, system: "V5 Basic (VAS)", typeOfInstall: "Full", contract: "NRM-2026", contractModel: "Lease", laborType: "Internal", linkedCase: "CASE-00041", approvals: { rm: "n/a (≤20)", finance: "n/a (≤40)" }, finance: { kind: "IO (Lease)", state: "Created", number: "IO-88213" }, ship: { est: "6/30/2026", actual: "7/01/2026", shipped: true } },
  "CASE-00041": { id: "CASE-00041", kind: "Operational", account: ACCOUNT, reason: "New Install", installType: "New Install", subject: "Install — 3 trucks (from ORD-00021)", status: "In Progress", owner: "Demo CSM", created: "7/01/2026", by: "3rd Party", system: "V5 Basic (VAS)", truckCount: 3, location: "Plant 4", fsmOwner: "Account Team — Northgate", linkedOrder: "ORD-00021", lifecycle: "Units Arrived",
    colis: [coli("COLI-4101", "Install", "U-25301AA001", "T-301", "Work Complete", "3rd Party", { validated: true }), coli("COLI-4102", "Install", "U-25301AA002", "T-302", "In Progress", "3rd Party"), coli("COLI-4103", "Install", "U-25301AA003", "T-303", "Not Started", "3rd Party")] },
  "CASE-00055": { id: "CASE-00055", kind: "Operational", account: ACCOUNT, reason: "De-install & Re-install (new truck)", installType: "—", subject: "Move unit to a new truck (the double)", status: "On Hold", owner: "Demo CSM", created: "6/19/2026", by: "Verifi", system: "V3", truckCount: 1, location: "Plant 2", fsmOwner: "Account Team — Northgate", lifecycle: "—",
    colis: [coli("COLI-5501", "De-install", "U-25288BB044", "T-118", "Billed", "Verifi", { validated: true }), coli("COLI-5502", "Re-Install", "U-25288BB044", "—", "On Hold – Awaiting Truck", "Verifi", { held: true })] },
  "CASE-00060": { id: "CASE-00060", kind: "Operational", account: ACCOUNT, reason: "De-install – Return to Verifi", installType: "—", subject: "Return 1 unit to Verifi", status: "Pending Finance", owner: "Demo CSM", created: "6/26/2026", by: "Verifi", system: "V3", truckCount: 1, location: "Plant 2", fsmOwner: "Account Team — Northgate", lifecycle: "—", returnParts: true, firstComm: "8/02/2023",
    colis: [coli("COLI-6001", "De-install", "U-25277CC099", "T-140", "Pending Finance", "Verifi")] },
  "CASE-00062": { id: "CASE-00062", kind: "Operational", account: ACCOUNT, reason: "Account Change (no field work)", installType: "—", subject: "Move unit between accounts (same parent)", status: "Command Center Action", owner: "Demo CSM", created: "6/22/2026", by: "—", system: "V5", truckCount: 1, location: "—", fsmOwner: "Account Team — Northgate", lifecycle: "—", accountChange: { from: ACCOUNT, to: "Northgate — South Yard" }, colis: [] },
};
const UNITS = {
  "U-25301AA001": { id: "U-25301AA001", serial: "TC4-101", truck: "T-301", acct: ACCOUNT, ver: "V5", mod: "Base + Water", payer: "PY-70001", soldTo: "Northgate HQ", contract: "NRM-2026", mode: "Active", openColi: null, openCase: null, journey: 5, history: [["6/20", "Parts ordered", "ORD-00021"], ["7/01", "Shipped & created", "—"], ["7/01", "Installed & validated", "COLI-4101"]] },
  "U-25301AA002": { id: "U-25301AA002", serial: "TC4-102", truck: "T-302", acct: ACCOUNT, ver: "V5", mod: "Base + Water", payer: "PY-70001", soldTo: "Northgate HQ", contract: "NRM-2026", mode: "Ghost", openColi: "COLI-4102", openCase: "CASE-00041", journey: 3, history: [["7/01", "Shipped & created", "—"], ["7/02", "Install in progress", "COLI-4102"]] },
  "U-25301AA003": { id: "U-25301AA003", serial: "TC4-103", truck: "T-303", acct: ACCOUNT, ver: "V5", mod: "Base + Water", payer: "PY-70001", soldTo: "Northgate HQ", contract: "NRM-2026", mode: "Ghost", openColi: "COLI-4103", openCase: "CASE-00041", journey: 2, history: [["7/01", "Shipped & created", "awaiting install"]] },
  "U-25288BB044": { id: "U-25288BB044", serial: "TC4-044", truck: "—", acct: ACCOUNT, ver: "V3", mod: "Base + Water", payer: "PY-70001", soldTo: "Northgate HQ", contract: "NRM-2026", mode: "Active", openColi: "COLI-5502", openCase: "CASE-00055", journey: 4, history: [["8/02/23", "Commissioned", "Truck T-118"], ["6/19/26", "De-installed (validated)", "COLI-5501"], ["6/19/26", "Re-install created", "On Hold – awaiting truck"]] },
};
const ACCT_UNITS = (a) => Object.values(UNITS).filter((u) => u.acct === a);

/* ════ atoms ════ */
const sStyle = (s) => ({ "In Progress": [C.info, C.infoBg], "On Hold": [C.warn, C.warnBg], "On Hold – Awaiting Truck": [C.warn, C.warnBg], "Pending Finance": [C.purp, C.purpBg], "Pending FSM Validation": [C.purp, C.purpBg], "Command Center Action": [C.purp, C.purpBg], "Not Started": [C.neutral, C.neutralBg], Closed: [C.ok, C.okBg], "Work Complete": ["#0B827C", "#E9F6F5"], Billed: [C.ok, C.okBg], "Units Arrived": [C.info, C.infoBg], Created: [C.ok, C.okBg], Requested: [C.warn, C.warnBg], Activated: [C.info, C.infoBg] }[s] || [C.neutral, C.neutralBg]);
const Status = ({ s }) => { const [c, bg] = sStyle(s); return <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium" style={{ color: c, background: bg }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />{s}</span>; };
const Tag = ({ children, c = C.neutral }) => <span className="inline-block rounded px-1.5 py-0.5 text-[11px] font-medium" style={{ color: c, background: c + "18" }}>{children}</span>;
const Btn = ({ children, onClick, brand, sm, disabled }) => <button onClick={onClick} disabled={disabled} className={`rounded font-medium ${sm ? "text-xs px-2.5 py-1" : "text-sm px-3 py-1.5"}`} style={brand ? { background: disabled ? "#C9D9EC" : C.link, color: "#fff", border: `1px solid ${disabled ? "#C9D9EC" : C.link}` } : { background: "#fff", color: disabled ? "#C9C7C5" : C.link, border: `1px solid ${C.border}` }}>{children}</button>;
const Lbl = ({ children }) => <div className="text-xs mb-1" style={{ color: C.sub }}>{children}</div>;
const Sel = ({ value, set, opts }) => <select value={value} onChange={(e) => set && set(e.target.value)} className="w-full rounded px-2 py-1.5 text-sm" style={{ border: `1px solid ${C.border}` }}>{opts.map((o) => <option key={o}>{o}</option>)}</select>;
const Inp = (p) => <input {...p} className="w-full rounded px-2 py-1.5 text-sm" style={{ border: `1px solid ${C.border}` }} />;
const Callout = ({ color = C.link, bg = C.infoBg, icon: I = Info, title, children }) => <div className="rounded px-4 py-3 mb-3 flex items-start gap-2 text-sm" style={{ background: bg, border: `1px solid ${color}33` }}><I size={16} style={{ color, marginTop: 2 }} /><div><b style={{ color }}>{title}.</b> {children}</div></div>;
const Section = ({ title, children, badge }) => <div className="rounded-lg mb-3" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="px-4 py-2.5 text-sm font-semibold flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>{title}{badge}</div><div className="px-4 py-2">{children}</div></div>;
const DRow = ({ label, value, link, req, flag }) => <div className="flex items-center justify-between gap-3 py-2" style={{ borderBottom: `1px solid ${C.borderLt}` }}><div className="min-w-0"><div className="text-[11px]" style={{ color: C.subLt }}>{req && <span style={{ color: C.err }}>*</span>}{label}</div><div className="text-sm truncate flex items-center gap-1" style={{ color: link ? C.link : C.text, fontWeight: link ? 500 : 400 }}>{value || <span style={{ color: "#C9C7C5" }}>—</span>}{flag && <span title="validation flag — fix this data"><AlertTriangle size={12} color={C.err} /></span>}</div></div><Pencil size={12} style={{ color: "#B0ADAB" }} /></div>;
const TwoCol = ({ rows }) => <div className="grid md:grid-cols-2 gap-x-8">{rows.map((r, i) => <DRow key={i} label={r[0]} value={r[1]} link={r[2]} req={r[3]} flag={r[4]} />)}</div>;
function Related({ title, columns, rows, footer, badge }) {
  return <div className="rounded-lg mb-3" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="px-4 py-2.5 text-sm font-semibold flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>{title}{badge}</div><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr style={{ color: C.sub }} className="text-xs">{columns.map((c) => <th key={c} className="text-left font-medium px-3 py-2 whitespace-nowrap">{c}</th>)}</tr></thead><tbody>{rows}</tbody></table></div>{footer && <div className="px-4 py-2 text-xs" style={{ color: C.sub, borderTop: `1px solid ${C.borderLt}` }}>{footer}</div>}</div>;
}
function ThemeBand({ icon, eyebrow, title, fields, actions }) {
  return <div className="rounded-t-lg overflow-hidden" style={{ border: `1px solid ${C.border}`, borderBottom: "none" }}><div style={{ background: `linear-gradient(180deg,${C.band1},${C.band2})`, backgroundImage: `radial-gradient(${C.border}55 .5px,transparent .5px)`, backgroundSize: "10px 10px" }} className="px-4 pt-3 pb-2"><div className="text-xs" style={{ color: C.subLt }}>{eyebrow}</div></div>
    <div className="px-4 py-3 flex items-start justify-between gap-4 flex-wrap" style={{ background: "#fff" }}><div className="flex items-center gap-3"><div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: icon }}>{eyebrow.includes("Unit") ? <Package size={20} color="#fff" /> : eyebrow.includes("Ordering") ? <Boxes size={20} color="#fff" /> : <Truck size={20} color="#fff" />}</div><div><div className="text-lg font-semibold leading-tight">{title}</div><div className="flex gap-5 mt-1 flex-wrap">{fields.map((f) => <div key={f[0]}><div className="text-[11px]" style={{ color: C.subLt }}>{f[0]}</div><div className="text-sm" style={{ color: f[2] ? C.link : C.text }}>{f[1]}</div></div>)}</div></div></div><div className="flex gap-2 items-center flex-wrap">{actions}</div></div></div>;
}
const RecTabs = ({ tabs, active, onTab }) => <div className="flex gap-1 px-3" style={{ background: "#fff", border: `1px solid ${C.border}`, borderTop: "none" }}>{tabs.map((t) => <button key={t} onClick={() => onTab(t)} className="px-3 py-2 text-sm" style={{ color: active === t ? C.text : C.sub, fontWeight: active === t ? 600 : 400, borderBottom: active === t ? `3px solid ${C.link}` : "3px solid transparent" }}>{t}</button>)}</div>;
function Overlay({ title, onClose, children, wide }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.4)" }}><div className="rounded-lg w-full" style={{ background: "#fff", maxWidth: wide ? 720 : 460, maxHeight: "92vh", overflow: "auto" }}><div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white z-10" style={{ borderBottom: `1px solid ${C.border}` }}><span className="font-semibold">{title}</span><button onClick={onClose}><X size={18} color={C.sub} /></button></div><div className="px-4 py-3">{children}</div></div></div>;
}
const OwnerBar = ({ role }) => <div className="rounded px-3 py-2 mb-3 flex items-center gap-2 text-xs" style={{ background: C.purpBg, border: `1px solid ${C.purp}33` }}><Users size={14} style={{ color: C.purp }} /><span><b style={{ color: C.purp }}>{role}.</b> One primary owner assigned but changeable — anyone can be tagged in so no one is stacked.</span></div>;
const Stages = ({ list, at, color = C.link }) => <div className="flex gap-1 my-3 flex-wrap">{list.map((s, i) => <div key={s} className="flex-1 text-center text-[11px] py-1.5 rounded" style={{ minWidth: 74, background: i === at ? color : i < at ? color + "22" : "#F3F2F2", color: i === at ? "#fff" : i < at ? color : C.sub, fontWeight: i === at ? 600 : 400 }}>{s}</div>)}</div>;
/* side logic rail */
const WithNotes = ({ notes, children }) => <div className="flex gap-4 flex-wrap items-start"><div className="flex-1" style={{ minWidth: 340 }}>{children}</div><aside style={{ width: 250 }} className="shrink-0"><div className="rounded-lg" style={{ background: "#FAFAFB", border: `1px solid ${C.border}` }}><div className="px-3 py-2 text-xs font-semibold flex items-center gap-1" style={{ color: C.iconAsset, borderBottom: `1px solid ${C.borderLt}` }}><Info size={12} /> Logic & rules</div><div className="px-3 py-2 space-y-3">{notes.map((n, i) => <div key={i} className="text-[11px]" style={{ color: C.sub }}><b style={{ color: C.text }}>{n[0]}</b><div className="mt-0.5">{n[1]}</div></div>)}</div></div></aside></div>;

/* ════ APP ════ */
export default function App() {
  const [cases, setCases] = useState(seedCases);
  const [tab, setTab] = useState("cases");
  const [openCase, setOpenCase] = useState(null);
  const [openUnit, setOpenUnit] = useState(null);
  const [toast, setToast] = useState(null);
  const flash = (m, k = "ok") => { setToast({ m, k }); setTimeout(() => setToast(null), 3400); };
  const home = () => { setTab("cases"); setOpenCase(null); setOpenUnit(null); };
  const upd = (id, patch) => setCases((p) => ({ ...p, [id]: { ...p[id], ...patch } }));
  const openU = (u) => { setOpenUnit(u); setTab("units"); };
  const openC = (id) => { setOpenCase(id); setTab("cases"); };

  const TABS = [["cases", "Cases", ClipboardList], ["units", "Units", Package], ["pending", "Pending Re-installs", RotateCcw], ["sc", "Supply Chain", Ship], ["fin", "Billing / Finance", DollarSign], ["fsm", "FSM", Wrench], ["mgmt", "Management", LayoutDashboard]];
  return (
    <div style={{ background: C.page, fontFamily: font, minHeight: "100vh" }} className="text-[13px]">
      <div style={{ background: C.topBar }} className="text-white px-4 py-1.5 flex items-center gap-3"><span className="font-semibold text-sm">Verifi</span><div className="flex-1 max-w-md mx-auto flex items-center gap-2 rounded px-2 py-1" style={{ background: "rgba(255,255,255,.15)" }}><Search size={13} /><span className="text-xs opacity-80">Search Salesforce…</span></div><Bell size={15} className="opacity-80" /><Settings size={15} className="opacity-80" /><span className="w-6 h-6 rounded-full text-[11px] flex items-center justify-center" style={{ background: "#5C7CB0" }}>U</span></div>
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}` }} className="px-4 flex items-center gap-1 flex-wrap"><button onClick={home} className="font-semibold text-sm pr-3 py-2.5 hover:underline">Verifi Console</button>
        {TABS.map(([k, l, I]) => <button key={k} onClick={() => { setTab(k); setOpenCase(null); setOpenUnit(null); }} className="px-2.5 py-2.5 text-sm flex items-center gap-1.5" style={{ color: tab === k ? C.text : C.sub, fontWeight: tab === k ? 600 : 400, borderBottom: tab === k ? `3px solid ${C.link}` : "3px solid transparent" }}><I size={14} />{l}</button>)}</div>
      <div className="px-4 py-4 max-w-7xl mx-auto">
        {tab === "cases" && (openCase ? <CaseRouter c={cases[openCase]} onBack={() => setOpenCase(null)} onUnit={openU} flash={flash} upd={upd} onCase={setOpenCase} setCases={setCases} /> : <CasesHome cases={cases} onOpen={setOpenCase} addCase={(c) => { setCases((p) => ({ ...p, [c.id]: c })); setOpenCase(c.id); }} flash={flash} />)}
        {tab === "units" && (openUnit ? <UnitRecord u={UNITS[openUnit]} onBack={() => setOpenUnit(null)} onCase={openC} flash={flash} /> : <UnitList onOpen={setOpenUnit} />)}
        {tab === "pending" && <Pending cases={cases} upd={upd} onCase={openC} flash={flash} />}
        {tab === "sc" && <SupplyChain flash={flash} />}
        {tab === "fin" && <Finance flash={flash} />}
        {tab === "fsm" && <FSM cases={cases} onCase={openC} />}
        {tab === "mgmt" && <Mgmt cases={cases} />}
      </div>
      {toast && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded px-4 py-2.5 text-sm text-white flex items-center gap-2 shadow-lg" style={{ background: toast.k === "err" ? C.err : C.ok, maxWidth: 640 }}>{toast.k === "err" ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}{toast.m}</div>}
    </div>
  );
}

/* ════ CASES home ════ */
function CasesHome({ cases, onOpen, addCase, flash }) {
  const [mode, setMode] = useState("list");
  if (mode === "pick") return <TypePicker onPick={setMode} onCancel={() => setMode("list")} />;
  if (mode === "ordering") return <CreateOrdering onCancel={() => setMode("list")} onSave={addCase} flash={flash} />;
  if (mode === "operational") return <CreateOperational onCancel={() => setMode("list")} onSave={addCase} flash={flash} />;
  return <WithNotes notes={[["Two connected cases", "Ordering handles parts/approvals/finance/supply-chain; on ship it spins up a linked Operational case. Linked, not parent-child — no 'don't touch the parent' risk."], ["Enter once", "Mandatory fields + forced steps; the system routes the next action. Replaces the triplicate spreadsheets/WOs/paperwork."]]}>
    <div className="rounded-lg" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}><div className="flex items-center gap-2"><div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: C.iconCase }}><ClipboardList size={16} color="#fff" /></div><div><div className="text-xs" style={{ color: C.sub }}>Cases</div><div className="flex items-center gap-1 font-semibold text-base">{ACCOUNT} — Open Cases <ChevronDown size={15} /></div></div></div><Btn sm brand onClick={() => setMode("pick")}>New</Btn></div>
      <table className="w-full text-sm"><thead><tr style={{ color: C.sub }} className="text-xs">{["", "Case", "Type", "Reason", "Stage", "Trucks", "Owner"].map((h) => <th key={h} className="text-left font-medium px-3 py-2" style={{ borderBottom: `1px solid ${C.borderLt}` }}>{h}</th>)}</tr></thead>
        <tbody>{Object.values(cases).map((c) => <tr key={c.id} onClick={() => onOpen(c.id)} className="cursor-pointer hover:bg-[#F3F9FE]" style={{ borderBottom: `1px solid ${C.borderLt}` }}><td className="pl-3 py-2.5"><div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: c.kind === "Ordering" ? C.iconOrder : C.iconCase }}>{c.kind === "Ordering" ? <Boxes size={13} color="#fff" /> : <Truck size={13} color="#fff" />}</div></td><td className="px-3 py-2.5" style={{ color: C.link, fontWeight: 500 }}>{c.id}</td><td className="px-3 py-2.5">{c.kind}</td><td className="px-3 py-2.5">{c.reason}</td><td className="px-3 py-2.5"><Status s={c.status} /></td><td className="px-3 py-2.5">{c.truckCount}</td><td className="px-3 py-2.5">{c.owner}</td></tr>)}</tbody></table>
    </div>
  </WithNotes>;
}
function TypePicker({ onPick, onCancel }) {
  const fake = ["Account Configuration", "Customer Onboarding (parked)", "Service Case", "Reporting / Data", "Ticketing"];
  const live = [["ordering", "Ordering Case", "Parts → approvals → Finance + Supply Chain → auto-opens the install case on ship"], ["operational", "Operational Case — Verified Installs", "Install / de-install / re-install / transfer. WOLI per truck, checklist-gated closure."]];
  return <div className="rounded-lg" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="px-4 py-3 text-base font-semibold" style={{ borderBottom: `1px solid ${C.border}` }}>New Case</div><div className="px-4 py-3"><p className="text-xs mb-3" style={{ color: C.sub }}>Two live record types. Onboarding parked; greyed types not in this demo.</p>{fake.map((f) => <label key={f} className="flex items-center gap-2 py-1.5 opacity-35"><Circle size={15} /><span className="text-sm">{f}</span></label>)}{live.map(([k, n, d]) => <button key={k} onClick={() => onPick(k)} className="flex items-start gap-2 py-2.5 w-full text-left rounded px-2 mt-1 hover:bg-[#F3F9FE]"><CircleDot size={15} className="mt-0.5" color={C.link} /><span><span className="text-sm font-semibold">{n}</span><span className="block text-xs" style={{ color: C.sub }}>{d}</span></span><ChevronRight size={15} className="ml-auto mt-0.5" color={C.link} /></button>)}</div><div className="px-4 py-3 flex justify-end" style={{ borderTop: `1px solid ${C.border}`, background: "#FAFAF9" }}><Btn sm onClick={onCancel}>Cancel</Btn></div></div>;
}

/* ════ Create Ordering ════ */
function CreateOrdering({ onCancel, onSave, flash }) {
  const [count, setCount] = useState(3);
  const [contract, setContract] = useState("NRM-2026 · Lease");
  const [labor, setLabor] = useState("Internal");
  const has = !contract.startsWith("None"); const rm = count > 20, fin = count > 40;
  return <WithNotes notes={[["Contract lives in Salesforce", "Real SF Contract on the account; lease vs purchase read from the contract/pricebook. No contract → Finance must approve."], ["Approvals by truck count", ">20 → RM approves. >40 → Finance approves."], ["IO starts early", "Finance/Jim's IO or GL is kicked off now and runs in parallel — it never blocks the install."], ["Ship generates units", "On ship, Unit IDs are generated and Supply Chain is tasked to create them in the Hub; the linked install case auto-opens."]]}>
    <div className="rounded-lg" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
      <div className="px-4 py-3 text-base font-semibold text-center" style={{ borderBottom: `1px solid ${C.border}` }}>New Case: Ordering</div>
      <div className="px-5 py-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div><Lbl>* Account</Lbl><Sel value={ACCOUNT} opts={[ACCOUNT]} /></div><div><Lbl>* System Type</Lbl><Sel value="V5 Basic (VAS)" opts={SYSTYPES} /></div>
          <div><Lbl>* Truck Count</Lbl><Inp type="number" value={count} onChange={(e) => setCount(+e.target.value || 0)} /></div><div><Lbl>* Type of Install</Lbl><Sel value="Full" opts={TYPE_OF_INSTALL} /></div>
          <div><Lbl>* Contract (Salesforce)</Lbl><Sel value={contract} set={setContract} opts={["NRM-2026 · Lease", "NRM-2026 · Purchase", "None on file"]} /></div><div><Lbl>* Labor</Lbl><Sel value={labor} set={setLabor} opts={["Internal", "Paid (3rd party)"]} /></div>
        </div>
        <Section title="Contract check & approvals">{has ? <div className="flex items-center gap-2 text-sm py-1"><CheckCircle2 size={15} color={C.ok} /> Contract on file — <b>{contract.includes("Lease") ? "Lease" : "Purchase"}</b> model.</div> : <div className="flex items-center gap-2 text-sm py-1"><AlertTriangle size={15} color={C.err} /> No contract → <b>Finance must approve</b> first.</div>}
          <TwoCol rows={[["RM approval (>20)", rm ? "Required" : "Not required", false, rm], ["Finance approval (>40)", fin ? "Required" : "Not required", false, fin], ["Install Manager confirms installer", "Requested"], ["Labor → Finance + Supply Chain", labor]]} /></Section>
      </div>
      <div className="px-4 py-3 flex justify-end gap-2" style={{ borderTop: `1px solid ${C.border}`, background: "#FAFAF9" }}><Btn sm onClick={onCancel}>Cancel</Btn><Btn sm brand onClick={() => { onSave({ id: "ORD-000" + (30 + Math.floor(Math.random() * 60)), kind: "Ordering", account: ACCOUNT, reason: "New Install", subject: "Order parts", status: "In Progress", owner: "Demo CSM", created: "today", truckCount: count, system: "V5 Basic (VAS)", typeOfInstall: "Full", contract: contract.split(" ")[0], contractModel: contract.includes("Lease") ? "Lease" : "Purchase", laborType: labor, approvals: { rm: rm ? "Required" : "n/a", finance: fin ? "Required" : "n/a" }, finance: { kind: contract.includes("Lease") ? "IO (Lease)" : "GL/CC (Purchase)", state: "Requested", number: "—" }, ship: { est: "—", actual: "—", shipped: false } }); flash("Ordering case created — Finance & Supply Chain tasks started."); }}>Save</Btn></div>
    </div>
  </WithNotes>;
}

/* ════ Create Operational (dup-guard + double + account change + bulk upload) ════ */
function CreateOperational({ onCancel, onSave, flash }) {
  const [reason, setReason] = useState("De-install & Re-install (new truck)");
  const [by, setBy] = useState("Verifi");
  const [picked, setPicked] = useState([]);
  const [dest, setDest] = useState("Northgate — South Yard");
  const [bulk, setBulk] = useState(false);
  const isAcct = reason.startsWith("Account Change"), isReturn = reason.includes("Return"), isDouble = reason.startsWith("De-install & Re-install"), isInstall = INSTALL_REASON.includes(reason);
  const toggle = (u) => { if (u.openColi) return flash(`Blocked — ${u.id} already has an open COLI on ${u.openCase}. No duplicate.`, "err"); setPicked((p) => p.includes(u.id) ? p.filter((x) => x !== u.id) : [...p, u.id]); };
  const build = () => {
    const id = "CASE-000" + (66 + Math.floor(Math.random() * 33));
    if (isAcct) return { id, kind: "Operational", account: ACCOUNT, reason, subject: reason, status: "Command Center Action", owner: "Demo CSM", created: "today", by: "—", system: "V5", truckCount: 1, location: "—", fsmOwner: "Account Team — Northgate", accountChange: { from: ACCOUNT, to: dest }, colis: [] };
    const units = bulk ? ["U-BULK01", "U-BULK02", "U-BULK03"] : (picked.length ? picked : ["U-25301AA002"]);
    const colis = [];
    units.forEach((u, i) => {
      colis.push(coli("COLI-N" + i + "a", isInstall ? "Install" : "De-install", u, "T-90" + i, "Not Started", by));
      if (isDouble) colis.push(coli("COLI-N" + i + "b", "Re-Install", u, "—", "On Hold – Awaiting Truck", by, { held: true }));
    });
    return { id, kind: "Operational", account: ACCOUNT, reason, installType: reason, subject: reason, status: isReturn ? "Pending Finance" : (isDouble ? "In Progress" : "In Progress"), owner: "Demo CSM", created: "today", by, system: "V5 Basic (VAS)", truckCount: units.length, location: "Plant 4", fsmOwner: "Account Team — Northgate", lifecycle: "Units Arrived", colis, returnParts: isReturn, firstComm: "8/02/2023" };
  };
  return <WithNotes notes={[["Duplicate guard", "A unit can only have one open COLI. Picking one that already has an open COLI is blocked at creation — the unit does the looking-back."], ["The double", "'De-install & Re-install' creates a de-install COLI + a paired re-install COLI that auto-holds until you Mark Ready on the Pending Re-installs tab — even if the truck # is known."], ["Bulk", "Excel upload = one WOLI per truck row; validates format, links to Assets. Parent closes only when all children complete."], ["Account Change", "No field work — asks from/to accounts and routes a Command Center / FSM action (usually no billing; being refined)."]]}>
    <div className="rounded-lg" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
      <div className="px-4 py-3 text-base font-semibold text-center" style={{ borderBottom: `1px solid ${C.border}` }}>New Case: Operational — Verified Installs</div>
      <div className="px-5 py-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div><Lbl>* Account</Lbl><Sel value={ACCOUNT} opts={[ACCOUNT]} /></div><div><Lbl>* Install Reason</Lbl><Sel value={reason} set={setReason} opts={[...INSTALL_REASON, ...MOVE_REASON]} /></div>
          <div><Lbl>* System Type</Lbl><Sel value="V5 Basic (VAS)" opts={SYSTYPES} /></div><div><Lbl>* Work Performed by</Lbl><Sel value={by} set={setBy} opts={WORKBY} /></div>
          {isAcct && <div className="md:col-span-2 grid md:grid-cols-2 gap-4"><div><Lbl>* Account (from)</Lbl><Sel value={ACCOUNT} opts={[ACCOUNT]} /></div><div><Lbl>* Destination Account (to)</Lbl><Sel value={dest} set={setDest} opts={["Northgate — South Yard", "Northgate — East Plant"]} /></div></div>}
        </div>
        {isReturn && <Callout color={C.purp} bg={C.purpBg} icon={DollarSign} title="Triggers Finance review">Return to Verifi opens Pending Finance (depreciation); nothing dispatches until approved → triggers the Return Order.</Callout>}
        {by !== "Verifi" && !isAcct && <Callout color={C.purp} bg={C.purpBg} icon={ShieldCheck} title="3rd party / Customer">No Service Appointment. Manual TCG entry; the FSM validates the work <b>after</b> it's done.</Callout>}
        {!isAcct && <><div className="flex items-center justify-between mt-2"><Lbl>Units on {ACCOUNT}</Lbl><label className="flex items-center gap-1 text-xs" style={{ color: C.link }}><input type="checkbox" checked={bulk} onChange={() => setBulk(!bulk)} /> <Upload size={12} /> Bulk: upload truck list (Excel)</label></div>
          {bulk ? <div className="rounded px-3 py-2 text-xs" style={{ background: C.infoBg, color: C.linkDk }}>Parsed 3 rows from <b>northgate_trucks.xlsx</b> → will create 3 WOLIs (validated, linked to Assets).</div>
            : ACCT_UNITS(ACCOUNT).map((u) => { const on = picked.includes(u.id), blk = !!u.openColi; return <button key={u.id} onClick={() => toggle(u)} className="flex items-center justify-between rounded px-3 py-2 mb-1 w-full text-left" style={{ border: `1px solid ${blk ? "#F3C9C0" : on ? C.link : C.border}`, background: blk ? C.errBg : on ? "#F3F9FE" : "#fff" }}><span><span className="text-sm font-medium" style={{ color: C.link }}>{u.id}</span><span className="block text-xs" style={{ color: C.sub }}>Truck {u.truck} · {u.ver} {u.mod}</span></span>{blk ? <span className="text-xs flex items-center gap-1" style={{ color: C.err }}><Lock size={12} /> open COLI</span> : on ? <CheckCircle2 size={15} color={C.link} /> : <Plus size={14} color={C.sub} />}</button>; })}
        </>}
      </div>
      <div className="px-4 py-3 flex justify-end gap-2" style={{ borderTop: `1px solid ${C.border}`, background: "#FAFAF9" }}><Btn sm onClick={onCancel}>Cancel</Btn><Btn sm brand onClick={() => { onSave(build()); flash(isAcct ? "Account Change → Command Center action created." : (isDouble ? "Case created — de-install + auto-held re-install (see Pending Re-installs)." : "Case created — WOLIs auto-generated.")); }}>Save</Btn></div>
    </div>
  </WithNotes>;
}

/* ════ Case router ════ */
function CaseRouter(p) { return p.c.kind === "Ordering" ? <OrderingRecord {...p} /> : <OperationalRecord {...p} />; }

function OrderingRecord({ c, onBack, flash, upd, onCase, setCases }) {
  const ship = () => { upd(c.id, { ship: { ...c.ship, shipped: true, actual: "today" } }); const nid = "CASE-00" + (900 + Math.floor(Math.random() * 90)); setCases((p) => ({ ...p, [nid]: { id: nid, kind: "Operational", account: c.account, reason: "New Install", installType: "New Install", subject: "Install (from " + c.id + ")", status: "In Progress", owner: "Demo CSM", created: "today", by: "3rd Party", system: c.system, truckCount: c.truckCount, location: "Plant 4", fsmOwner: "Account Team — Northgate", lifecycle: "Units Shipped", linkedOrder: c.id, colis: Array.from({ length: c.truckCount }).map((_, i) => coli("COLI-S" + i, "Install", "U-NEW0" + i, "—", "Not Started", "3rd Party")) }, [c.id]: { ...c, ship: { ...c.ship, shipped: true, actual: "today" }, linkedCase: nid } })); flash("Shipped → Unit IDs generated · Supply Chain tasked to create in Hub · install case " + nid + " auto-created."); };
  return <WithNotes notes={[["Parallel Finance", "IO/GL started early; nothing waits on it."], ["Rotating owners", "Finance (Jim) & Supply Chain (James K) pages have a changeable primary owner."], ["Preset docs", "Install guides auto-attach and carry to each COLI."]]}>
    <div><button onClick={onBack} className="text-xs mb-2 flex items-center gap-1" style={{ color: C.link }}><ChevronLeft size={13} /> Cases</button>
      <ThemeBand icon={C.iconOrder} eyebrow="Ordering Case" title={c.id} fields={[["Account", c.account, true], ["Truck Count", c.truckCount], ["Contract", `${c.contract} · ${c.contractModel}`], ["Status", c.status]]} actions={<><Btn sm>Edit</Btn>{c.linkedCase && <Btn sm onClick={() => onCase(c.linkedCase)}>Open install case →</Btn>}</>} />
      <div className="mt-3">
        <Callout title={`Contract — ${c.contractModel}`}>{c.contractModel === "Lease" ? "Finance/Jim creates an IO (charge material)." : "Finance/Jim sets up GL / cost center + offset."} Started early — nothing waits on it.</Callout>
        <Section title="Approvals & routing"><TwoCol rows={[["FSM aligned", "Yes"], ["CSM aligned", "Yes"], ["RM approval (>20 trucks)", c.approvals.rm], ["Finance approval (>40 trucks)", c.approvals.finance], ["Install Manager — who installs?", "3rd-party crew (confirmed)"], ["Labor", c.laborType]]} /></Section>
        <div className="grid md:grid-cols-2 gap-3">
          <Section title="Finance task (parallel)" badge={<Tag c={C.purp}>Jim</Tag>}><TwoCol rows={[["Type", c.finance.kind], ["State", c.finance.state], ["Number", c.finance.number]]} /></Section>
          <Section title="Supply Chain task" badge={<Tag c={C.orange}>James K</Tag>}><TwoCol rows={[["Est. Ship", c.ship.est], ["Actual Ship", c.ship.actual], ["Shipped", c.ship.shipped ? "Yes" : "No"]]} />{!c.ship.shipped && <div className="mt-1"><Btn sm brand onClick={ship}>Mark Shipped</Btn></div>}</Section>
        </div>
        <Section title="Files (preset install docs)"><div className="flex flex-wrap gap-2">{PRESET_FILES.map((f) => <span key={f} className="flex items-center gap-1 text-xs rounded px-2 py-1" style={{ background: "#EEF4FE", color: C.link }}><FileText size={11} />{f}</span>)}</div></Section>
      </div>
    </div>
  </WithNotes>;
}

/* ════ Operational record ════ */
function OperationalRecord({ c, onBack, onUnit, flash, upd, onCase }) {
  const [tab, setTab] = useState("Related");
  const [coliOpen, setColiOpen] = useState(null);
  const [newTruck, setNewTruck] = useState(false);
  const isReturn = c.returnParts, isTransfer = c.reason.includes("Re-install") || c.reason.includes("Re-Install") || c.reason.startsWith("De-install &");
  const stages = ["Pending", "Awaiting Ship Date", "Units Shipped", "Units Arrived", "Closed"];
  const stageIdx = c.status === "Closed" ? 4 : Math.max(0, stages.indexOf(c.lifecycle));
  const allDone = c.colis.length > 0 && c.colis.every((w) => ["Work Complete", "Billed", "Closed"].includes(w.status) || w.held);
  const closeColi = (id) => upd(c.id, { colis: c.colis.map((w) => w.id === id ? { ...w, status: "Work Complete", validated: c.by === "Verifi" } : w) });
  return <WithNotes notes={[["Forced steps", "Can't close a COLI until every mandatory field + checklist item is done. A validation flag appears if data is wrong so you can fix it."], ["Data-flow validation", "On close, the stamped truck is compared to the unit's live truck field — 'Verified ✓' proves the work actually happened."], ["3rd-party", "FSM validates AFTER the work; that's what clears the flag before billing."], ["Send to CC", "Fires on COLI closure. Billing submits on COLI closure too — IO/GL is a separate Jim process."], ["Parent gate", "Parent closes only when all child COLIs are complete."], ["KPI-safe", "Verified Installs excluded from Break/Fix, PM & Labor KPIs."]]}>
    <div><button onClick={onBack} className="text-xs mb-2 flex items-center gap-1" style={{ color: C.link }}><ChevronLeft size={13} /> Cases</button>
      <ThemeBand icon={C.iconCase} eyebrow="Operational Case · Verified Installs" title={c.id} fields={[["Account", c.account, true], ["Install Reason", c.reason], ["Work By", c.by], ["Status", c.status]]} actions={<><Btn sm onClick={() => setNewTruck(true)}>+ New Truck</Btn>{c.linkedOrder && <Btn sm onClick={() => onCase(c.linkedOrder)}>← {c.linkedOrder}</Btn>}</>} />
      <RecTabs tabs={["Related", "Details", "Files", "History"]} active={tab} onTab={setTab} />
      {!isReturn && !c.accountChange && <Stages list={stages} at={stageIdx} />}
      <div className="mt-1">
        {tab === "Details" && <><Section title="Case Information"><TwoCol rows={[["Case Number", c.id], ["Record Type", "Verified Installs"], ["Install Reason", c.reason], ["Account", c.account, true], ["System Type", c.system], ["Work Performed by", c.by], ["Truck Count", c.truckCount], ["Location", c.location], ["FSM Owner (by account team)", c.fsmOwner], ["Type of Install", c.installType], ["Linked Ordering Case", c.linkedOrder || "—", true]]} /></Section>
          <Section title="Onboarding / Installation Checklist (Ops)" badge={<Tag>Doc 2</Tag>}>{OPS_CHECKLIST.map(([t, o]) => <label key={t} className="flex items-center justify-between py-1.5 text-sm" style={{ borderBottom: `1px solid ${C.borderLt}` }}><span className="flex items-center gap-2"><input type="checkbox" defaultChecked={t.includes("POC") || t.includes("Parts")} /> {t}</span><Tag>{o}</Tag></label>)}</Section>
          <Section title="Permissions & Access" badge={<Tag>Doc 1 §8</Tag>}>{PERMISSIONS.map(([r, a]) => <div key={r} className="flex justify-between py-1.5 text-sm" style={{ borderBottom: `1px solid ${C.borderLt}` }}><span>{r}</span><span style={{ color: C.sub }}>{a}</span></div>)}</Section></>}
        {tab === "Files" && <Section title={`Files (${PRESET_FILES.length})`}><p className="text-xs mb-2" style={{ color: C.sub }}>Preset install docs auto-attach to the case and each COLI.</p>{PRESET_FILES.map((f) => <div key={f} className="flex items-center gap-2 py-1.5 text-sm" style={{ color: C.link, borderBottom: `1px solid ${C.borderLt}` }}><FileText size={13} />{f}</div>)}</Section>}
        {tab === "History" && <Related title="Case History" columns={["Date", "Field", "Change"]} rows={[["6/19", "Status", "New → In Progress"], ["6/19", "COLI-5501", "→ Work Complete → Billed"], ["6/19", "COLI-5502", "created On Hold – Awaiting Truck"]].map((h, i) => <tr key={i} style={{ borderTop: `1px solid ${C.borderLt}` }}><td className="px-3 py-2.5">{h[0]}</td><td className="px-3 py-2.5">{h[1]}</td><td className="px-3 py-2.5" style={{ color: C.sub }}>{h[2]}</td></tr>)} />}
        {tab === "Related" && <>
          {c.status === "Pending Finance" && <Callout color={C.purp} bg={C.purpBg} icon={DollarSign} title="Finance review (depreciation)">First Commissioned {c.firstComm}. No COLI dispatches until approved → triggers Return Order. <Btn sm onClick={() => { upd(c.id, { status: "In Progress", colis: c.colis.map((w) => ({ ...w, status: "Not Started" })) }); flash("Finance approved → Return Order created."); }}>Approve (Finance)</Btn></Callout>}
          {c.accountChange && <Section title="Account Change" badge={<Tag c={C.purp}>not field work</Tag>}><TwoCol rows={[["Account (from)", c.accountChange.from, true], ["Account (to)", c.accountChange.to, true], ["Action routed to", "Command Center / FSM"], ["Billing", "Usually none — being refined"]]} /></Section>}
          {isTransfer && <Callout color={C.orange} bg={C.orangeCell} icon={RotateCcw} title="Transfer → special financial path XXXXX">Parts consumption runs through the <b>transfer IO / PR-against-the-case</b>, not the regular WO path.</Callout>}
          {c.colis.length > 0 && <Related title={`COLIs — one per truck (${c.colis.length})`} columns={["COLI", "Type", "Unit", "Truck", "Work By", "Status", ""]} footer={allDone ? "All children complete → parent can close." : "Parent closes only when every child COLI is complete."}
            rows={c.colis.map((w) => <tr key={w.id} className="cursor-pointer hover:bg-[#F3F9FE]" onClick={() => setColiOpen(w)} style={{ borderTop: `1px solid ${C.borderLt}` }}><td className="px-3 py-2.5" style={{ color: C.link, fontWeight: 500 }}>{w.id}</td><td className="px-3 py-2.5">{w.type}</td><td className="px-3 py-2.5" style={{ color: C.link }} onClick={(e) => { e.stopPropagation(); onUnit(w.unit); }}>{w.unit}</td><td className="px-3 py-2.5">{w.truck}</td><td className="px-3 py-2.5">{w.by}</td><td className="px-3 py-2.5"><Status s={w.status} /></td><td className="px-3 py-2.5">{w.validated && <span className="text-xs flex items-center gap-1" style={{ color: C.ok }}><ShieldCheck size={12} /> verified</span>}{w.held && <span className="text-xs" style={{ color: C.warn }}>Mark Ready in Pending tab</span>}</td></tr>)} />}
          {c.by !== "Verifi" && c.colis.length > 0 && <Callout color={C.purp} bg={C.purpBg} icon={ShieldCheck} title="3rd-party validation (after work)">FSM validates the crew's work after it's done, clearing the data flag before it's real & billable.</Callout>}
          {isReturn && <ReturnManifest by={c.by} />}
          {c.colis.length > 0 && <Section title="IO Closure (auto from COLI closure forms)"><p className="text-xs" style={{ color: C.sub }}>COLI closure forms auto-populate the IO Closure; when returns process, it completes and triggers billing to submit.</p></Section>}
          <div className="flex justify-end"><Btn brand disabled={!allDone} onClick={() => { upd(c.id, { status: "Closed" }); flash("Case closed — all children complete."); }}>Close case</Btn></div>
        </>}
      </div>
      {coliOpen && <ColiModal w={coliOpen} onClose={() => setColiOpen(null)} onComplete={() => { closeColi(coliOpen.id); setColiOpen(null); flash("COLI closed → data-flow verified → sent to Command Center → billing submitted."); }} />}
      {newTruck && <Overlay title="New Truck (Save & New repeats)" onClose={() => setNewTruck(false)}><Lbl>* Truck Name</Lbl><Inp placeholder="e.g. T-401" autoFocus /><p className="text-xs mt-2 mb-3" style={{ color: C.sub }}>Per Doc 1: on New Truck the only field is the truck name → Save & New repeats to add the next.</p><div className="flex justify-end gap-2"><Btn onClick={() => setNewTruck(false)}>Cancel</Btn><Btn brand onClick={() => flash("Truck added — Save & New ready for the next.")}>Save & New</Btn></div></Overlay>}
    </div>
  </WithNotes>;
}
function ReturnManifest({ by }) {
  return <Section title="Return Order (auto-created)" badge={<Tag c={C.orange}>RO</Tag>}><TwoCol rows={[["Units going back (tag the unit)", "U-25277CC099"], ["Ship to", by === "Verifi" ? "Verifi Returns [address]" : "FSM route → owner"], ["Shipping docs", "Upload BOL on the case"]]} /><div className="rounded px-3 py-2 mt-2 text-xs" style={{ background: C.warnBg, color: C.warn }}><b>Pack list (DRAFT):</b> wire harness, controller, sensor kit. Write Unit # large on parts & label. Full ladder + reminders on the Supply Chain tab.</div></Section>;
}

/* ════ COLI modal — full field set + checklist + validation ════ */
function ColiModal({ w, onClose, onComplete }) {
  const [screen, setScreen] = useState("detail");
  const f = w.fields; const thirdParty = w.by !== "Verifi"; const done = ["Work Complete", "Billed"].includes(w.status);
  const badTcg = false; // could flag
  return <Overlay title={`${w.id} · ${w.type} COLI`} onClose={onClose} wide>
    {w.held && <Callout color={C.warn} bg={C.warnBg} icon={Clock} title="On Hold – awaiting truck">Re-found & marked ready only from the <b>Pending Re-installs</b> tab — stays here even if the truck # is known.</Callout>}
    {screen === "detail" ? <>
      <div className="mb-2"><Status s={w.status} /></div>
      <Section title="Truck & System (mandatory to close)"><TwoCol rows={[["Truck Number (auto)", w.truck, false, true], ["VIN Number", f.vin], ["System Type", f.sysType, false, true], ["TCG / Unit #", f.tcg, false, true, badTcg], ["Mixer Make", f.mixer, false, true], ["WDS #", f.wds, false, true], ["Propulsion Type", f.propulsion, false, true], ["Stamped Truck (for validation)", w.stampedTruck]]} /></Section>
      <Section title="Configuration & Components (Doc 2)"><TwoCol rows={[["Install Contractor", f.contractor], ["Plant Name", f.plant], ["Install Date", f.installDate], ["Cab Make", f.cabMake], ["Admix Install", f.admix], ["TC4 Serial #", f.tc4], ["WDS MAC ID #", f.wdsMac], ["Ball valve Replaced", f.ballValve], ["Spray bar Relocation", f.spraybar]]} /></Section>
      <Section title="Parts consumed"><TwoCol rows={[["Parts consumed", "Wire harness ×1"], ["Note", "Changing a COLI notifies the team — labor/billing may change"]]} /></Section>
      {done && <Section title="Closure validation"><div className="flex items-center gap-2 text-sm py-1"><CheckCircle2 size={15} color={C.ok} /><b>Verified by data flow ✓</b> — unit's live truck field matches the stamped change.</div><div className="text-xs mt-1" style={{ color: C.sub }}>{thirdParty ? "3rd-party validation can lag longer than the usual ~1-hr data delay." : "Shows 'not yet reflected' during the ~1-hr delay, then flips to verified."}</div><div className="rounded px-3 py-2 mt-2 text-xs" style={{ background: C.infoBg, color: C.linkDk }}><b>Operational billing:</b> event date = the date the work happened. CSM confirms Billable + correct month at close.</div></Section>}
      <div className="flex flex-wrap gap-1 mb-3">{PRESET_FILES.slice(0, 3).map((x) => <span key={x} className="flex items-center gap-1 text-[11px] rounded px-2 py-0.5" style={{ background: "#EEF4FE", color: C.link }}><FileText size={10} />{x}</span>)}</div>
      {!done && !w.held && <div className="rounded px-3 py-3" style={{ background: C.infoBg, border: `1px solid ${C.link}22` }}><div className="flex items-center justify-between"><span className="text-sm font-semibold">Post-{w.type} Checklist</span><Btn brand onClick={() => setScreen("checklist")}>Open checklist</Btn></div><p className="text-xs mt-1" style={{ color: C.sub }}>Forced steps — can't close until every mandatory field & checklist item is done. {thirdParty && "3rd-party close = pending FSM validation."}</p></div>}
    </> : <ChecklistFlow type={w.type} thirdParty={thirdParty} onBack={() => setScreen("detail")} onDone={onComplete} />}
  </Overlay>;
}
function ChecklistFlow({ type, thirdParty, onBack, onDone }) {
  const [scr, setScr] = useState(0);
  const items = type === "Install" ? POSTINSTALL : ["System powered down safely", "Unit removed from truck", "Components bagged & labeled for return", "Truck wiring capped / secured", "Photos taken of removal"];
  const commission = type === "Install" ? VERIFI_COMMISSION : [];
  const [chk, setChk] = useState([...items, ...commission].map(() => false));
  const [ready, setReady] = useState("Yes"); const [ship, setShip] = useState(true);
  const done = chk.every(Boolean);
  return <>{scr === 0 && <><div className="text-sm font-semibold mb-2">Post-{type} Checklist</div>{!done && <div className="rounded px-3 py-2 mb-3 text-sm" style={{ background: C.errBg, color: C.err }}><b>You have not completed all checklist items.</b> All required before closure.</div>}
    <div className="grid md:grid-cols-2 gap-x-8">{items.map((it, i) => <label key={it} className="flex items-start gap-2 py-1.5 text-sm"><input type="checkbox" checked={chk[i]} onChange={() => setChk((p) => p.map((v, j) => j === i ? !v : v))} className="mt-0.5" />{it}</label>)}</div>
    {commission.length > 0 && <><div className="text-sm font-bold mt-3 mb-1">Verifi — Commissioning & Testing (FS / Install Mgr)</div><div className="grid md:grid-cols-2 gap-x-8">{commission.map((it, i) => { const idx = items.length + i; return <label key={it} className="flex items-center gap-2 py-1.5 text-sm"><input type="checkbox" checked={chk[idx]} onChange={() => setChk((p) => p.map((v, j) => j === idx ? !v : v))} />{it}</label>; })}</div></>}
    <Nav onBack={onBack} onNext={() => setScr(1)} nextDisabled={!done} /></>}
    {scr === 1 && <><Lbl>* System is Service Ready (tied to billing & lifecycle)</Lbl><Sel value={ready} set={setReady} opts={["Yes", "No"]} />{ready === "No" && <div className="rounded px-3 py-2 mt-2 text-xs" style={{ background: C.warnBg, color: C.warn }}>Not Service Ready → On Hold, not billable, FSM reminded, optional rush-parts.</div>}
      <label className="flex items-center gap-2 text-sm mt-2"><input type="checkbox" checked={ship} onChange={() => setShip(!ship)} /> * Install equipment shipped back</label>
      <div className="mt-2"><Lbl>Install Team Lead sign-off (initials)</Lbl><Inp defaultValue="AB" /></div>
      <div className="rounded px-3 py-2 mt-2 text-xs" style={{ background: "#FAFAFB", color: C.sub, borderLeft: `3px solid ${C.iconAsset}` }}>Cannot close without: Truck #, TCG/Unit #, Mixer Make, WDS #, Propulsion Type, Service Ready, Equipment ship back.</div>
      <Nav onBack={() => setScr(0)} onDone={() => (ready === "Yes" && ship) && onDone()} doneLabel={thirdParty ? "Submit → pending FSM validation" : "Close COLI"} doneDisabled={ready !== "Yes" || !ship} /></>}</>;
}
const Nav = ({ onBack, onNext, onDone, doneLabel, nextDisabled, doneDisabled }) => <div className="flex justify-end gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>{onBack && <Btn onClick={onBack}>Back</Btn>}{onNext && <Btn brand disabled={nextDisabled} onClick={onNext}>Next</Btn>}{onDone && <Btn brand disabled={doneDisabled} onClick={onDone}>{doneLabel}</Btn>}</div>;

/* ════ Units ════ */
function UnitList({ onOpen }) {
  return <WithNotes notes={[["Account-scoped", "You only see one account's units."], ["Duplicate guard", "A unit with an open COLI is flagged; a new movement is blocked."], ["Per-unit journey", "Open a unit to see its state machine: ordered → shipped → created → installed → validated → closed → returned/billed."]]}>
    <div className="rounded-lg" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}><div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: C.iconAsset }}><Package size={16} color="#fff" /></div><div><div className="text-xs" style={{ color: C.sub }}>Units (Assets)</div><div className="font-semibold text-base">{ACCOUNT} — Units</div></div></div>
      <table className="w-full text-sm"><thead><tr style={{ color: C.sub }} className="text-xs">{["Unit Id", "Serial", "Truck", "Ver", "Mode", "Journey", "Open COLI"].map((h) => <th key={h} className="text-left font-medium px-3 py-2" style={{ borderBottom: `1px solid ${C.borderLt}` }}>{h}</th>)}</tr></thead>
        <tbody>{ACCT_UNITS(ACCOUNT).map((u) => <tr key={u.id} onClick={() => onOpen(u.id)} className="cursor-pointer hover:bg-[#F3F9FE]" style={{ borderBottom: `1px solid ${C.borderLt}` }}><td className="px-3 py-2.5" style={{ color: C.link, fontWeight: 500 }}>{u.id}</td><td className="px-3 py-2.5">{u.serial}</td><td className="px-3 py-2.5">{u.truck}</td><td className="px-3 py-2.5">{u.ver}</td><td className="px-3 py-2.5">{u.mode}</td><td className="px-3 py-2.5 text-xs" style={{ color: C.sub }}>{UNIT_JOURNEY[u.journey]}</td><td className="px-3 py-2.5">{u.openColi ? <span className="text-xs flex items-center gap-1" style={{ color: C.warn }}><Lock size={12} /> {u.openColi}</span> : <span className="text-xs" style={{ color: C.sub }}>none</span>}</td></tr>)}</tbody></table>
    </div>
  </WithNotes>;
}
function UnitRecord({ u, onBack, onCase, flash }) {
  return <WithNotes notes={[["The thread", "This journey is the connective tissue — every team looks at the same unit through their own lens."], ["Delete / return", "Deletion & return follow the RO process; a full-unit return tags this unit as the one going back."]]}>
    <div><button onClick={onBack} className="text-xs mb-2 flex items-center gap-1" style={{ color: C.link }}><ChevronLeft size={13} /> Units</button>
      <ThemeBand icon={C.iconAsset} eyebrow="Asset · Unit" title={u.id} fields={[["Account", u.acct, true], ["Truck", u.truck], ["Version", u.ver], ["Mode", u.mode]]} actions={<><Btn sm>Edit</Btn><Btn sm onClick={() => flash("Return / delete follows the RO process (Supply Chain tab).")}>Return / Delete</Btn></>} />
      <div className="mt-3">
        <Section title="Unit Journey (state machine)"><Stages list={UNIT_JOURNEY} at={u.journey} color={C.iconAsset} /><div className="text-xs" style={{ color: C.sub }}>Where this unit is right now: <b>{UNIT_JOURNEY[u.journey]}</b>.</div></Section>
        {u.openColi && <Callout color={C.warn} bg={C.warnBg} icon={Lock} title="Open COLI — duplicates blocked">Open COLI <b>{u.openColi}</b> on Case <button className="underline" style={{ color: C.link }} onClick={() => onCase(u.openCase)}>{u.openCase}</button>.</Callout>}
        <Section title="Integration Details"><TwoCol rows={[["First Commissioned", "—"], ["Payer Number", u.payer], ["Truck Number", u.truck], ["Sold To", u.soldTo], ["Truck Mode", u.mode], ["Contract Group", u.contract], ["Unit Id", u.id], ["Modules", u.mod], ["Serial Number", u.serial], ["Type", "Mixer"]]} /></Section>
        <Related title={`History (${u.history.length})`} columns={["Date", "Event", "Ref"]} rows={u.history.map((h, i) => <tr key={i} style={{ borderTop: `1px solid ${C.borderLt}` }}><td className="px-3 py-2.5">{h[0]}</td><td className="px-3 py-2.5">{h[1]}</td><td className="px-3 py-2.5" style={{ color: C.sub }}>{h[2]}</td></tr>)} />
      </div>
    </div>
  </WithNotes>;
}

/* ════ Pending Re-installs ════ */
function Pending({ cases, upd, onCase, flash }) {
  const rows = [];
  Object.values(cases).forEach((c) => c.colis && c.colis.forEach((w) => w.held && rows.push({ ...w, caseId: c.id, account: c.account })));
  const markReady = (caseId, id) => { upd(caseId, { colis: cases[caseId].colis.map((w) => w.id === id ? { ...w, held: false, status: "Activated", truck: "T-777" } : w) }); flash("Marked ready — truck stamped, activated & assigned; moves to the FSM worklist."); };
  return <WithNotes notes={[["The re-find", "Held re-installs live only here so they're never re-found or duplicated."], ["Reminder at 30 days", "So a held re-install can't drag on."], ["Truck ≠ ready", "It stays On Hold even if the truck # is known — until you Mark Ready."]]}>
    <div className="rounded-lg" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${C.border}` }}><RotateCcw size={16} color={C.iconAsset} /><div><div className="text-xs" style={{ color: C.sub }}>Worklist</div><div className="font-semibold text-base">Pending Re-installs</div></div></div>
      {rows.length === 0 ? <div className="px-4 py-8 text-center text-sm" style={{ color: C.sub }}>Nothing pending.</div> : <table className="w-full text-sm"><thead><tr style={{ color: C.sub }} className="text-xs">{["COLI", "Case", "Account", "Unit", "Held", "Age", ""].map((h) => <th key={h} className="text-left font-medium px-3 py-2">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r) => <tr key={r.id} style={{ borderTop: `1px solid ${C.borderLt}` }}><td className="px-3 py-2.5" style={{ color: C.link }}>{r.id}</td><td className="px-3 py-2.5 cursor-pointer" style={{ color: C.link }} onClick={() => onCase(r.caseId)}>{r.caseId}</td><td className="px-3 py-2.5">{r.account}</td><td className="px-3 py-2.5" style={{ color: C.link }}>{r.unit}</td><td className="px-3 py-2.5">6/19/2026</td><td className="px-3 py-2.5"><span className="flex items-center gap-1" style={{ color: C.ok }}><Clock size={13} /> 12 days</span></td><td className="px-3 py-2.5"><Btn sm brand onClick={() => markReady(r.caseId, r.id)}>Mark Ready</Btn></td></tr>)}</tbody></table>}
    </div>
  </WithNotes>;
}

/* ════ Supply Chain ════ */
function SupplyChain({ flash }) {
  const [ret, setRet] = useState(1);
  const cols = ["Project", "Location", "Trucks", "System", "Req. Submitted", "Req. On-Site", "Install Labor", "Shipment List", "IO/PO/GL/CC", "Est. Ship", "Actual Ship", "Shipment Processed", "Fleet", "Short", "Drop", "Labor Processed", "Returns Processed", "Comments"];
  const row = ["ORD-00021", "Plant 4", "3", "V5 VAS", "✓", "✓", "Bruski", "✓", "IO-88213", "6/30", "7/01", "SAP 7/02", "✓", "", "", "", "", "on track"];
  const RET = ["Requested", "BOL Requested", "Picked Up", "Shipped", "Received", "Processed"];
  return <WithNotes notes={[["Replaces the sheet", "Every column from your tracker; green = done."], ["Who owns what", "Install Labor = Bruski; IO/GL = Jim; Shipment Processed = SAP date; Fleet = warehouse; Short = follow-up; Drop = bulk; Returns = excess equipment."], ["Returns skeleton", "Auto-created on case close, with dates + reminders at each stage so returns can't drag."]]}>
    <div><OwnerBar role="Supply Chain (James K) dashboard" />
      <div className="rounded-lg mb-3 overflow-x-auto" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="px-4 py-2.5 text-sm font-semibold" style={{ borderBottom: `1px solid ${C.border}` }}>Supply Chain — Project Tracker</div>
        <table className="text-sm"><thead><tr style={{ color: C.sub, background: "#FAFAF9" }} className="text-xs">{cols.map((h, i) => <th key={h} className="text-left font-medium px-2 py-2 whitespace-nowrap" style={{ background: i >= 6 && i <= 11 ? C.orangeCell : "transparent" }}>{h}</th>)}</tr></thead>
          <tbody><tr style={{ borderTop: `1px solid ${C.borderLt}` }}>{row.map((v, i) => { const g = v === "✓"; return <td key={i} className="px-2 py-2 text-xs whitespace-nowrap text-center" style={{ background: g ? C.greenCell : "transparent", color: g ? C.green : C.text }}>{v}</td>; })}</tr></tbody></table></div>
      <Section title="Unit creation task (on ship)"><div className="flex items-center justify-between"><span className="text-sm">ORD-00021 → create 3 Unit IDs in the Hub</span><Btn sm brand onClick={() => flash("Units created in Hub — they flow back into Salesforce.")}>Create in Hub</Btn></div></Section>
      <Section title="Returns — skeleton (was unstructured)" badge={<Tag c={C.orange}>FSM responsible</Tag>}><Stages list={RET} at={ret} color={C.orange} /><TwoCol rows={[["Return Order", "RO-2210 (auto on case close)"], ["Unit tagged", "U-25277CC099"], ["Pickup date", ret >= 2 ? "7/03/2026" : "—"], ["Shipped date", ret >= 3 ? "7/04/2026" : "—"], ["BOL / shipping docs", "Uploaded on case"], ["Owner", "FSM → routes to owner"]]} /><div className="flex gap-2 mt-2">{ret < RET.length - 1 && <Btn sm brand onClick={() => { setRet(ret + 1); flash(`Return → "${RET[ret + 1]}" · reminder set.`); }}>Advance to {RET[ret + 1]}</Btn>}<Btn sm>Send reminder</Btn></div></Section>
    </div>
  </WithNotes>;
}

/* ════ Finance ════ */
function Finance({ flash }) {
  const [state, setState] = useState("Requested");
  return <WithNotes notes={[["Two money tracks", "IO/GL (this tab) is Jim's SAP paperwork — parallel, non-blocking. Billing is separate: it submits on COLI closure."], ["States", "Requested → Created (Jim's form populates the number). Lease → IO; Purchase → GL + offset."], ["Labor change", "If a COLI's labor changes, the team is notified — billing changes."]]}>
    <div><OwnerBar role="Billing / Finance (Jim) dashboard" />
      <div className="grid md:grid-cols-2 gap-3"><Section title="IO / GL requests (Jim)"><table className="w-full text-sm"><thead><tr style={{ color: C.sub }} className="text-xs">{["Order", "Model", "Type", "State", "Number"].map((h) => <th key={h} className="text-left font-medium px-2 py-1.5">{h}</th>)}</tr></thead><tbody><tr style={{ borderTop: `1px solid ${C.borderLt}` }}><td className="px-2 py-2" style={{ color: C.link }}>ORD-00021</td><td className="px-2 py-2">Lease</td><td className="px-2 py-2">IO</td><td className="px-2 py-2"><Status s={state} /></td><td className="px-2 py-2">{state === "Created" ? "IO-88213" : "—"}</td></tr></tbody></table>{state === "Requested" && <div className="mt-2"><Btn sm brand onClick={() => { setState("Created"); flash("IO created — number populated & flows back to the case."); }}>Create IO (populate number)</Btn></div>}</Section>
        <Section title="Billing (COLI closure)"><table className="w-full text-sm"><thead><tr style={{ color: C.sub }} className="text-xs">{["COLI", "Type", "Billable", "Status"].map((h) => <th key={h} className="text-left font-medium px-2 py-1.5">{h}</th>)}</tr></thead><tbody><tr style={{ borderTop: `1px solid ${C.borderLt}` }}><td className="px-2 py-2" style={{ color: C.link }}>COLI-4101</td><td className="px-2 py-2">Install</td><td className="px-2 py-2">Yes</td><td className="px-2 py-2"><Status s="Work Complete" /></td></tr></tbody></table></Section></div>
    </div>
  </WithNotes>;
}

/* ════ FSM ════ */
function FSM({ cases, onCase }) {
  const rows = [];
  Object.values(cases).forEach((c) => c.kind === "Operational" && c.colis.forEach((w) => rows.push({ ...w, caseId: c.id })));
  return <WithNotes notes={[["No Service Appointment", "COLIs hang here on their own (often 3rd-party), so they never hit FST dispatch or KPIs."], ["Owner", "Assigned by the account team owner (trucks map to the account)."], ["3rd-party", "FSM validates after the work to clear the flag before billing."]]}>
    <div><Callout title="COLIs live here — no Service Appointment">Assigned by account team; 3rd-party validated after the work.</Callout>
      <div className="rounded-lg" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="px-4 py-2.5 text-sm font-semibold flex items-center gap-2" style={{ borderBottom: `1px solid ${C.border}` }}><Wrench size={15} color={C.sub} /> COLI Worklist — {ACCOUNT} account team</div>
        <table className="w-full text-sm"><thead><tr style={{ color: C.sub }} className="text-xs">{["COLI", "Case", "Type", "Unit", "Truck", "Work By", "Status", ""].map((h) => <th key={h} className="text-left font-medium px-3 py-2">{h}</th>)}</tr></thead>
          <tbody>{rows.map((w) => <tr key={w.id} className="hover:bg-[#F3F9FE]" style={{ borderTop: `1px solid ${C.borderLt}` }}><td className="px-3 py-2.5" style={{ color: C.link }}>{w.id}</td><td className="px-3 py-2.5 cursor-pointer" style={{ color: C.link }} onClick={() => onCase(w.caseId)}>{w.caseId}</td><td className="px-3 py-2.5">{w.type}</td><td className="px-3 py-2.5">{w.unit}</td><td className="px-3 py-2.5">{w.truck}</td><td className="px-3 py-2.5">{w.by}</td><td className="px-3 py-2.5"><Status s={w.status} /></td><td className="px-3 py-2.5">{w.by !== "Verifi" && w.status === "Work Complete" && <Tag c={C.purp}>FSM validate (after)</Tag>}{w.held && <Tag c={C.warn}>held</Tag>}</td></tr>)}</tbody></table>
      </div>
    </div>
  </WithNotes>;
}

/* ════ Management ════ */
function Mgmt({ cases }) {
  const stages = ["Ordering", "Finance/Ship", "Install (COLIs)", "Closing", "Returns", "Billed"];
  const projects = [{ name: "ORD-00021 · Northgate fleet (3)", at: 2 }, { name: "CASE-00055 · double (1)", at: 3 }, { name: "CASE-00060 · return (1)", at: 4 }];
  return <WithNotes notes={[["Where is everything", "Project-by-stage across the whole flow. Blue = current, green = done."], ["Audience", "Management + billing + supply-chain visibility — the 'where are we' view."]]}>
    <div><Callout color={C.iconAsset} bg="#F1EFFB" icon={LayoutDashboard} title="Management — project by stage">Ordering → finance/ship → install → closing → returns → billed.</Callout>
      <div className="rounded-lg overflow-x-auto" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="grid" style={{ gridTemplateColumns: `210px repeat(${stages.length},1fr)`, minWidth: 640 }}><div className="px-3 py-2 text-xs font-semibold" style={{ color: C.sub, borderBottom: `1px solid ${C.border}` }}>Project</div>{stages.map((s) => <div key={s} className="px-2 py-2 text-[11px] font-semibold text-center" style={{ color: C.sub, borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.borderLt}` }}>{s}</div>)}{projects.map((p) => <React.Fragment key={p.name}><div className="px-3 py-3 text-sm" style={{ borderBottom: `1px solid ${C.borderLt}`, color: C.link }}>{p.name}</div>{stages.map((s, i) => <div key={s} className="px-2 py-3 flex items-center justify-center" style={{ borderBottom: `1px solid ${C.borderLt}`, borderLeft: `1px solid ${C.borderLt}` }}>{i < p.at ? <CheckCircle2 size={16} color={C.ok} /> : i === p.at ? <span className="w-3 h-3 rounded-full" style={{ background: C.info }} /> : <span className="w-3 h-3 rounded-full" style={{ background: "#E5E5E5" }} />}</div>)}</React.Fragment>)}</div></div>
      <div className="grid md:grid-cols-4 gap-3 mt-3">{[["Open projects", "3"], ["Awaiting Finance", "1"], ["Returns outstanding", "1"], ["Held re-installs", "1"]].map(([l, v]) => <div key={l} className="rounded-lg px-4 py-3" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="text-2xl font-semibold">{v}</div><div className="text-xs" style={{ color: C.sub }}>{l}</div></div>)}</div>
    </div>
  </WithNotes>;
}
