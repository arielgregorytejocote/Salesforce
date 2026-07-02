import React, { useState } from "react";
import {
  ChevronRight, ChevronDown, ChevronLeft, AlertTriangle, CheckCircle2, Clock, Truck,
  X, Info, Lock, FileText, Plus, Package, Search, Settings, Bell, Pencil,
  ShieldCheck, RotateCcw, Users, DollarSign, ArrowRight,
  Upload, Wrench, ClipboardList, Ship, Boxes, LayoutDashboard, CircleDot, Circle, UserCheck,
} from "lucide-react";

/* ════ palette ════ */
const C = {
  page: "#F3F3F3", border: "#DDDBDA", borderLt: "#EAEAEA",
  text: "#181818", sub: "#5C5C5C", subLt: "#706E6B", link: "#0176D3", linkDk: "#014486",
  band1: "#EAF0F6", band2: "#E1E9F2", topBar: "#16325C",
  ok: "#2E844A", okBg: "#EFFCF4", warn: "#A56500", warnBg: "#FEF3E7",
  info: "#0176D3", infoBg: "#EEF4FE", purp: "#7526E3", purpBg: "#F4EEFC",
  err: "#BA0517", errBg: "#FEF1EE", neutral: "#5C5C5C", neutralBg: "#F2F2F2",
  green: "#3BA755", greenCell: "#D6F0DC", orange: "#E8762A", orangeCell: "#FBE3D0",
  iconOrder: "#0B827C", iconCase: "#F2842B", iconAsset: "#5C5BC9",
};
const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/* ════ roles ════ */
const ROLES = ["CSM", "FSM", "FST (Verifi)", "3rd Party Crew", "Finance (Jim)", "Supply Chain (James K)", "Regional Manager"];
const roleColor = { CSM: C.link, FSM: C.purp, "FST (Verifi)": C.iconOrder, "3rd Party Crew": C.orange, "Finance (Jim)": C.purp, "Supply Chain (James K)": C.orange, "Regional Manager": C.linkDk };

/* ════ master lists ════ */
const SYSTYPES = ["V3", "V3 w/ Admix", "V5 Basic (VAS)", "Spark", "V5 w/ Temperate Water (module-only upgrade)", "V5 w/ Cold Water (module-only upgrade)", "V5 w/ Admix (module-only upgrade)"];
const INSTALL_REASON = ["Fleet expansion", "New Account", "Upgrade"];
const MOVE_REASON = ["De-install & Re-install (new truck)", "De-install – Return to Verifi", "De-install – Keep at Account", "Re-Install due to Truck Damage/Paint/New Drum/etc.", "Account Change (no field work)"];
const TYPE_OF_INSTALL = ["New Install", "Upgrade"];
const WORKBY = ["Verifi", "Customer", "3rd Party"];
const POSTINSTALL = ["Air system works & free of leaks (OEM + Verifi)", "Water system works & free of leaks (OEM + Verifi)", "Hydraulic connections free of leaks (OEM + Verifi)", "System has greater than 5 satellites", "Connected to cellular network & backend", "Hydraulic connections correct (Charge & Discharge)", "Registering drum speeds correctly", "Adding fluids (water & admix) accurately (WNM)", "All connections properly tightened", "All cables & hoses secured / protected from abrasion", "Truck free & cleaned of installation debris", "All Documentation Complete"];
const VERIFI_COMMISSION = ["Tilt", "Settings", "System config (e.g. Beck, 12yrd, pump)", "Firmware", "Software", "Commission (HUB)", "Software / Setting Updates", "CAN / Component Testing", "Admix testing", "FDM Bypassed?"];
const PRESET_FILES = ["v5 equipment & install content.pdf", "v5 install Guide.pdf", "FST V5 Installation Checklist.docx"];
const UNIT_JOURNEY = ["Parts Ordered", "Shipped", "Unit Created", "Installed", "Validated", "Closed", "Returned / Billed"];
const LIFECYCLE = ["Pending", "Awaiting Ship Date", "Units Shipped", "Units Arrived", "Closed"];

/* ════ Unit ID generator — ID Manager format U-YYMMHRRLSSS ════ */
const HW_CODE = { V3: "3", V4: "4", V5: "5", "V5 Basic (VAS)": "5", Spark: "S", Neo: "N" };
let SEQ = 7;
const genUnitId = (sys, lease, region = "US") => {
  const d = new Date(2026, 6, 2); // 07/02/26 demo date
  const yy = String(d.getFullYear() - 2000).padStart(2, "0"), mm = String(d.getMonth() + 1).padStart(2, "0");
  return `U-${yy}${mm}${HW_CODE[sys] || "5"}${region}${lease === "Purchase" ? "P" : "L"}${String(SEQ++).padStart(3, "0")}`;
};

/* ════ seed data ════ */
const ACCOUNT = "Northgate Ready Mix"; // region US in the Account ID sheet
function coli(id, type, unit, truck, status, by, extra = {}) {
  return { id, type, unit, truck, status, by, stampedTruck: truck, ...extra,
    fields: { mixer: "McNeilus", propulsion: "Pump", sysType: "V5 Basic (VAS)", tcg: unit, wds: "WDS-" + id.slice(-3), vin: "1M2" + id.slice(-4) } };
}
const seedUnits = {
  "U-26065USL001": { id: "U-26065USL001", serial: "TC4-101", truck: "T-301", acct: ACCOUNT, ver: "V5", mode: "Active", journey: 4, openColi: "COLI-4101", openCase: "CASE-00041", history: [["6/20", "Parts ordered", "ORD-00021"], ["7/01", "Shipped · ID generated", "U-26065USL001"], ["7/01", "Installed, pending validation", "COLI-4101"]] },
  "U-26065USL002": { id: "U-26065USL002", serial: "TC4-102", truck: "—", acct: ACCOUNT, ver: "V5", mode: "Ghost", journey: 2, openColi: "COLI-4102", openCase: "CASE-00041", history: [["7/01", "Shipped · ID generated", "—"]] },
  "U-25123USL044": { id: "U-25123USL044", serial: "TC4-044", truck: "—", acct: ACCOUNT, ver: "V3", mode: "Active", journey: 3, openColi: "COLI-5502", openCase: "CASE-00055", history: [["8/02/23", "Commissioned", "T-118"], ["6/19/26", "De-installed (validated)", "COLI-5501"], ["6/19/26", "Re-install created", "On Hold"]] },
  "U-25099USL033": { id: "U-25099USL033", serial: "TC4-033", truck: "T-140", acct: ACCOUNT, ver: "V3", mode: "Active", journey: 3, openColi: "COLI-6001", openCase: "CASE-00060", history: [["8/02/23", "Commissioned", "T-140"]] },
};
const seedCases = {
  "ORD-00021": { id: "ORD-00021", kind: "Ordering", account: ACCOUNT, reason: "New Install (Fleet expansion)", subject: "Order parts — 2-truck fleet expansion", status: "In Progress", owner: "Demo CSM", created: "6/20/2026", truckCount: 2, system: "V5 Basic (VAS)", typeOfInstall: "New Install", contract: "NRM-2026", contractModel: "Lease", laborType: "Internal (Bruski)",
    rmNeeded: false, rmApproved: true, finApproved: true, finance: { kind: "IO (Lease)", state: "Created", number: "IO-88213" },
    ship: { est: "6/30/2026", actual: "7/01/2026", shipped: true }, scFiles: ["packing_list_ORD-00021.pdf", "shipment_manifest_ORD-00021.xlsx"], laborProcessed: false, closed: false, linkedCase: "CASE-00041" },
  "CASE-00041": { id: "CASE-00041", kind: "Operational", account: ACCOUNT, reason: "New Install", installType: "New Install", subject: "Install — 2 trucks (from ORD-00021)", status: "In Progress", owner: "Demo CSM", created: "7/01/2026", by: "3rd Party", system: "V5 Basic (VAS)", truckCount: 2, location: "Plant 4", fsmOwner: "Account Team — Northgate", linkedOrder: "ORD-00021", lifecycle: "Units Shipped", unitsAccepted: false,
    colis: [coli("COLI-4101", "Install", "U-26065USL001", "T-301", "Submitted – Pending FSM", "3rd Party"), coli("COLI-4102", "Install", "U-26065USL002", "T-302", "Not Started", "3rd Party")] },
  "CASE-00055": { id: "CASE-00055", kind: "Operational", account: ACCOUNT, reason: "De-install & Re-install (new truck)", installType: "—", subject: "Move unit to a new truck (the double)", status: "On Hold", owner: "Demo CSM", created: "6/19/2026", by: "Verifi", system: "V3", truckCount: 1, location: "Plant 2", fsmOwner: "Account Team — Northgate", lifecycle: "Units Arrived", unitsAccepted: true,
    colis: [coli("COLI-5501", "De-install", "U-25123USL044", "T-118", "Billed", "Verifi", { validated: true }), coli("COLI-5502", "Re-Install", "U-25123USL044", "—", "On Hold – Awaiting Truck", "Verifi", { held: true })] },
  "CASE-00060": { id: "CASE-00060", kind: "Operational", account: ACCOUNT, reason: "De-install – Return to Verifi", installType: "—", subject: "Return 1 unit to Verifi", status: "Pending Finance", owner: "Demo CSM", created: "6/26/2026", by: "Verifi", system: "V3", truckCount: 1, location: "Plant 2", fsmOwner: "Account Team — Northgate", lifecycle: "Units Arrived", unitsAccepted: true, returnParts: true, firstComm: "8/02/2023",
    colis: [coli("COLI-6001", "De-install", "U-25099USL033", "T-140", "Pending Finance", "Verifi")] },
};

/* ════ atoms ════ */
const sStyle = (s) => ({ "In Progress": [C.info, C.infoBg], "On Hold": [C.warn, C.warnBg], "On Hold – Awaiting Truck": [C.warn, C.warnBg], "Pending Finance": [C.purp, C.purpBg], "Submitted – Pending FSM": [C.purp, C.purpBg], "Not Started": [C.neutral, C.neutralBg], Locked: [C.neutral, C.neutralBg], Closed: [C.ok, C.okBg], "Work Complete": ["#0B827C", "#E9F6F5"], Billed: [C.ok, C.okBg], "Units Shipped": [C.info, C.infoBg], "Units Arrived": [C.info, C.infoBg], Created: [C.ok, C.okBg], Requested: [C.warn, C.warnBg], Activated: [C.info, C.infoBg], Complete: [C.ok, C.okBg] }[s] || [C.neutral, C.neutralBg]);
const Status = ({ s }) => { const [c, bg] = sStyle(s); return <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium" style={{ color: c, background: bg }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />{s}</span>; };
const Tag = ({ children, c = C.neutral }) => <span className="inline-block rounded px-1.5 py-0.5 text-[11px] font-medium" style={{ color: c, background: c + "18" }}>{children}</span>;
const Btn = ({ children, onClick, brand, sm, disabled, title }) => <button title={title} onClick={onClick} disabled={disabled} className={`rounded font-medium ${sm ? "text-xs px-2.5 py-1" : "text-sm px-3 py-1.5"}`} style={brand ? { background: disabled ? "#C9D9EC" : C.link, color: "#fff", border: `1px solid ${disabled ? "#C9D9EC" : C.link}` } : { background: "#fff", color: disabled ? "#C9C7C5" : C.link, border: `1px solid ${C.border}` }}>{children}</button>;
const Lbl = ({ children }) => <div className="text-xs mb-1" style={{ color: C.sub }}>{children}</div>;
const Sel = ({ value, set, opts }) => <select value={value} onChange={(e) => set && set(e.target.value)} className="w-full rounded px-2 py-1.5 text-sm" style={{ border: `1px solid ${C.border}` }}>{opts.map((o) => <option key={o}>{o}</option>)}</select>;
const Inp = (p) => <input {...p} className="w-full rounded px-2 py-1.5 text-sm" style={{ border: `1px solid ${C.border}` }} />;
const Callout = ({ color = C.link, bg = C.infoBg, icon: I = Info, title, children }) => <div className="rounded px-4 py-3 mb-3 flex items-start gap-2 text-sm" style={{ background: bg, border: `1px solid ${color}33` }}><I size={16} style={{ color, marginTop: 2 }} /><div><b style={{ color }}>{title}.</b> {children}</div></div>;
const Section = ({ title, children, badge }) => <div className="rounded-lg mb-3" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="px-4 py-2.5 text-sm font-semibold flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>{title}{badge}</div><div className="px-4 py-2">{children}</div></div>;
const DRow = ({ label, value, link, req }) => <div className="flex items-center justify-between gap-3 py-2" style={{ borderBottom: `1px solid ${C.borderLt}` }}><div className="min-w-0"><div className="text-[11px]" style={{ color: C.subLt }}>{req && <span style={{ color: C.err }}>*</span>}{label}</div><div className="text-sm truncate" style={{ color: link ? C.link : C.text, fontWeight: link ? 500 : 400 }}>{value || <span style={{ color: "#C9C7C5" }}>—</span>}</div></div><Pencil size={12} style={{ color: "#B0ADAB" }} /></div>;
const TwoCol = ({ rows }) => <div className="grid md:grid-cols-2 gap-x-8">{rows.map((r, i) => <DRow key={i} label={r[0]} value={r[1]} link={r[2]} req={r[3]} />)}</div>;
function Related({ title, columns, rows, footer, badge }) {
  return <div className="rounded-lg mb-3" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="px-4 py-2.5 text-sm font-semibold flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>{title}{badge}</div><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr style={{ color: C.sub }} className="text-xs">{columns.map((c) => <th key={c} className="text-left font-medium px-3 py-2 whitespace-nowrap">{c}</th>)}</tr></thead><tbody>{rows}</tbody></table></div>{footer && <div className="px-4 py-2 text-xs" style={{ color: C.sub, borderTop: `1px solid ${C.borderLt}` }}>{footer}</div>}</div>;
}
function ThemeBand({ icon, eyebrow, title, fields, actions }) {
  return <div className="rounded-t-lg overflow-hidden" style={{ border: `1px solid ${C.border}`, borderBottom: "none" }}><div style={{ background: `linear-gradient(180deg,${C.band1},${C.band2})` }} className="px-4 pt-3 pb-2"><div className="text-xs" style={{ color: C.subLt }}>{eyebrow}</div></div>
    <div className="px-4 py-3 flex items-start justify-between gap-4 flex-wrap" style={{ background: "#fff" }}><div className="flex items-center gap-3"><div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: icon }}>{eyebrow.includes("Unit") ? <Package size={20} color="#fff" /> : eyebrow.includes("Ordering") ? <Boxes size={20} color="#fff" /> : <Truck size={20} color="#fff" />}</div><div><div className="text-lg font-semibold leading-tight">{title}</div><div className="flex gap-5 mt-1 flex-wrap">{fields.map((f) => <div key={f[0]}><div className="text-[11px]" style={{ color: C.subLt }}>{f[0]}</div><div className="text-sm" style={{ color: f[2] ? C.link : C.text }}>{f[1]}</div></div>)}</div></div></div><div className="flex gap-2 items-center flex-wrap">{actions}</div></div></div>;
}
const RecTabs = ({ tabs, active, onTab }) => <div className="flex gap-1 px-3" style={{ background: "#fff", border: `1px solid ${C.border}`, borderTop: "none" }}>{tabs.map((t) => <button key={t} onClick={() => onTab(t)} className="px-3 py-2 text-sm" style={{ color: active === t ? C.text : C.sub, fontWeight: active === t ? 600 : 400, borderBottom: active === t ? `3px solid ${C.link}` : "3px solid transparent" }}>{t}</button>)}</div>;
function Overlay({ title, onClose, children, wide }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.4)" }}><div className="rounded-lg w-full" style={{ background: "#fff", maxWidth: wide ? 720 : 460, maxHeight: "92vh", overflow: "auto" }}><div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white z-10" style={{ borderBottom: `1px solid ${C.border}` }}><span className="font-semibold">{title}</span><button onClick={onClose}><X size={18} color={C.sub} /></button></div><div className="px-4 py-3">{children}</div></div></div>;
}
const Stages = ({ list, at, color = C.link }) => <div className="flex gap-1 my-3 flex-wrap">{list.map((s, i) => <div key={s} className="flex-1 text-center text-[11px] py-1.5 rounded" style={{ minWidth: 74, background: i === at ? color : i < at ? color + "22" : "#F3F2F2", color: i === at ? "#fff" : i < at ? color : C.sub, fontWeight: i === at ? 600 : 400 }}>{s}</div>)}</div>;
const WithNotes = ({ notes, children }) => <div className="flex gap-4 flex-wrap items-start"><div className="flex-1" style={{ minWidth: 340 }}>{children}</div><aside style={{ width: 250 }} className="shrink-0"><div className="rounded-lg" style={{ background: "#FAFAFB", border: `1px solid ${C.border}` }}><div className="px-3 py-2 text-xs font-semibold flex items-center gap-1" style={{ color: C.iconAsset, borderBottom: `1px solid ${C.borderLt}` }}><Info size={12} /> Logic & rules</div><div className="px-3 py-2 space-y-3">{notes.map((n, i) => <div key={i} className="text-[11px]" style={{ color: C.sub }}><b style={{ color: C.text }}>{n[0]}</b><div className="mt-0.5">{n[1]}</div></div>)}</div></div></aside></div>;

/* ════ role-gated button ════ */
function RoleBtn({ need, role, setRole, onClick, children, brand = true, sm = true }) {
  const allowed = Array.isArray(need) ? need : [need];
  const ok = allowed.includes(role);
  if (ok) return <Btn sm={sm} brand={brand} onClick={onClick}>{children}</Btn>;
  return <span className="inline-flex items-center gap-1.5 flex-wrap"><Btn sm={sm} disabled title={`Only ${allowed.join(" / ")}`}>{children}</Btn><button onClick={() => setRole(allowed[0])} className="text-[11px] underline" style={{ color: roleColor[allowed[0]] || C.link }}>switch to {allowed[0]}</button></span>;
}
/* next-step handoff banner */
function NextStep({ text, owner, role, setRole }) {
  const col = roleColor[owner] || C.link;
  return <div className="rounded px-4 py-2 my-3 flex items-center gap-2 text-sm flex-wrap" style={{ background: col + "10", border: `1px solid ${col}33` }}><ArrowRight size={15} style={{ color: col }} /><span><b style={{ color: col }}>Next step ({owner}):</b> {text}</span>{role !== owner && <button onClick={() => setRole(owner)} className="text-xs underline ml-1" style={{ color: col }}>switch role →</button>}</div>;
}

/* ════ APP ════ */
export default function App() {
  const [cases, setCases] = useState(seedCases);
  const [units, setUnits] = useState(seedUnits);
  const [role, setRole] = useState("CSM");
  const [tab, setTab] = useState("cases");
  const [openCase, setOpenCase] = useState(null);
  const [openUnit, setOpenUnit] = useState(null);
  const [toast, setToast] = useState(null);
  const flash = (m, k = "ok") => { setToast({ m, k }); setTimeout(() => setToast(null), 3600); };
  const upd = (id, patch) => setCases((p) => ({ ...p, [id]: { ...p[id], ...patch } }));
  const updUnit = (id, patch) => setUnits((p) => ({ ...p, [id]: { ...p[id], ...patch } }));
  const openC = (id) => { setOpenCase(id); setOpenUnit(null); setTab("cases"); };
  const openU = (id) => { setOpenUnit(id); setTab("units"); };
  const shared = { cases, units, role, setRole, upd, updUnit, setCases, setUnits, flash, openC, openU };

  const TABS = [["cases", "Cases", ClipboardList], ["units", "Units", Package], ["pending", "Pending Re-installs", RotateCcw], ["sc", "Supply Chain", Ship], ["fin", "Billing / Finance", DollarSign], ["fsm", "FSM", Wrench], ["mgmt", "Management", LayoutDashboard]];
  return (
    <div style={{ background: C.page, fontFamily: font, minHeight: "100vh" }} className="text-[13px]">
      <div style={{ background: C.topBar }} className="text-white px-4 py-1.5 flex items-center gap-3">
        <span className="font-semibold text-sm">Verifi</span>
        <div className="flex-1 max-w-sm mx-auto hidden md:flex items-center gap-2 rounded px-2 py-1" style={{ background: "rgba(255,255,255,.15)" }}><Search size={13} /><span className="text-xs opacity-80">Search Salesforce…</span></div>
        <div className="flex items-center gap-1.5 rounded px-2 py-1" style={{ background: "rgba(255,255,255,.15)" }}><UserCheck size={13} /><span className="text-xs">Viewing as</span>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="text-xs rounded px-1 py-0.5" style={{ background: "#fff", color: C.text }}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></div>
        <Bell size={15} className="opacity-80" />
      </div>
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}` }} className="px-4 flex items-center gap-1 flex-wrap">
        <button onClick={() => { setTab("cases"); setOpenCase(null); setOpenUnit(null); }} className="font-semibold text-sm pr-3 py-2.5 hover:underline">Verifi Console</button>
        {TABS.map(([k, l, I]) => <button key={k} onClick={() => { setTab(k); setOpenCase(null); setOpenUnit(null); }} className="px-2.5 py-2.5 text-sm flex items-center gap-1.5" style={{ color: tab === k ? C.text : C.sub, fontWeight: tab === k ? 600 : 400, borderBottom: tab === k ? `3px solid ${C.link}` : "3px solid transparent" }}><I size={14} />{l}</button>)}
      </div>
      <div className="px-4 py-4 max-w-7xl mx-auto">
        {tab === "cases" && (openCase ? <CaseRouter {...shared} c={cases[openCase]} onBack={() => setOpenCase(null)} /> : <CasesHome {...shared} onOpen={setOpenCase} />)}
        {tab === "units" && (openUnit ? <UnitRecord {...shared} u={units[openUnit]} onBack={() => setOpenUnit(null)} /> : <UnitList {...shared} />)}
        {tab === "pending" && <Pending {...shared} />}
        {tab === "sc" && <SupplyChain {...shared} />}
        {tab === "fin" && <Finance {...shared} />}
        {tab === "fsm" && <FSMTab {...shared} />}
        {tab === "mgmt" && <Mgmt {...shared} />}
      </div>
      {toast && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded px-4 py-2.5 text-sm text-white flex items-center gap-2 shadow-lg z-50" style={{ background: toast.k === "err" ? C.err : C.ok, maxWidth: 660 }}>{toast.k === "err" ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}{toast.m}</div>}
    </div>
  );
}

/* ════ shared flow logic — the ONE state machine ════ */
function orderNext(o) {
  if (o.closed) return null;
  if (o.rmNeeded && !o.rmApproved) return ["Approve the order (truck count > 20).", "Regional Manager"];
  if (!o.ship.shipped) return ["Upload shipping docs & Mark Shipped — this generates Unit IDs and auto-opens the install case.", "Supply Chain (James K)"];
  if (o.finance.state !== "Created") return ["Create the IO / GL (parallel — doesn't block install).", "Finance (Jim)"];
  if (!o.laborProcessed) return ["Process install labor (Bruski invoice) against the project.", "Supply Chain (James K)"];
  return ["Everything processed — close the Supply Chain order.", "Supply Chain (James K)"];
}
function opNext(c) {
  if (c.status === "Closed") return null;
  if (c.status === "Pending Finance") return ["Approve the return (depreciation review) so work can start.", "Finance (Jim)"];
  if (c.accountChange) return ["Process the account change (no field work).", "CSM"];
  if (c.lifecycle === "Units Shipped" && !c.unitsAccepted) return ["Confirm the units arrived on site — this unlocks the COLIs.", "FSM"];
  if (c.colis.some((w) => w.held)) return ["Owed re-install is safe On Hold — Mark Ready on the Pending Re-installs tab when the truck is ready.", "FSM"];
  if (c.colis.some((w) => w.status === "Submitted – Pending FSM")) return ["Validate the 3rd-party work (only the FSM can — the crew can't accept their own work).", "FSM"];
  if (c.colis.some((w) => ["Not Started", "In Progress"].includes(w.status))) return [`Complete the ${c.by === "Verifi" ? "install" : "3rd-party"} COLI checklists.`, c.by === "Verifi" ? "FST (Verifi)" : "3rd Party Crew"];
  return ["All COLIs complete & validated — confirm billable + month and close the case (auto-creates the Return Order for excess).", "CSM"];
}

/* ════ CASES ════ */
function CasesHome({ cases, onOpen, setCases, flash, role, setRole }) {
  const [mode, setMode] = useState("list");
  const addCase = (c) => { setCases((p) => ({ ...p, [c.id]: c })); setMode("list"); onOpen(c.id); };
  if (mode === "pick") return <TypePicker onPick={setMode} onCancel={() => setMode("list")} />;
  if (mode === "ordering") return <CreateOrdering onCancel={() => setMode("list")} onSave={addCase} flash={flash} />;
  if (mode === "operational") return <CreateOperational cases={cases} onCancel={() => setMode("list")} onSave={addCase} flash={flash} />;
  return <WithNotes notes={[["One flow, many owners", "Each case shows its next step AND whose move it is. Use 'Viewing as' (top right) to play each role — buttons are locked to their owner."], ["Two connected cases", "Ordering → (ship) → Operational. Linked, not parent-child."]]}>
    <div className="rounded-lg" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}><div className="flex items-center gap-2"><div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: C.iconCase }}><ClipboardList size={16} color="#fff" /></div><div><div className="text-xs" style={{ color: C.sub }}>Cases</div><div className="flex items-center gap-1 font-semibold text-base">{ACCOUNT} — Open Cases <ChevronDown size={15} /></div></div></div><Btn sm brand onClick={() => setMode("pick")}>New</Btn></div>
      <table className="w-full text-sm"><thead><tr style={{ color: C.sub }} className="text-xs">{["", "Case", "Type", "Reason", "Stage", "Next step is with"].map((h) => <th key={h} className="text-left font-medium px-3 py-2" style={{ borderBottom: `1px solid ${C.borderLt}` }}>{h}</th>)}</tr></thead>
        <tbody>{Object.values(cases).map((c) => { const nx = c.kind === "Ordering" ? orderNext(c) : opNext(c); return <tr key={c.id} onClick={() => onOpen(c.id)} className="cursor-pointer hover:bg-[#F3F9FE]" style={{ borderBottom: `1px solid ${C.borderLt}` }}><td className="pl-3 py-2.5"><div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: c.kind === "Ordering" ? C.iconOrder : C.iconCase }}>{c.kind === "Ordering" ? <Boxes size={13} color="#fff" /> : <Truck size={13} color="#fff" />}</div></td><td className="px-3 py-2.5" style={{ color: C.link, fontWeight: 500 }}>{c.id}</td><td className="px-3 py-2.5">{c.kind}</td><td className="px-3 py-2.5">{c.reason}</td><td className="px-3 py-2.5"><Status s={c.closed ? "Complete" : c.status} /></td><td className="px-3 py-2.5">{nx ? <Tag c={roleColor[nx[1]]}>{nx[1]}</Tag> : <Tag c={C.ok}>done</Tag>}</td></tr>; })}</tbody></table>
    </div>
  </WithNotes>;
}
function TypePicker({ onPick, onCancel }) {
  const fake = ["Account Configuration", "Customer Onboarding (parked)", "Service Case", "Reporting / Data", "Ticketing"];
  const live = [["ordering", "Ordering Case", "Parts → approvals → Finance + Supply Chain → auto-opens the install case on ship"], ["operational", "Operational Case — Verified Installs", "Install / de-install / re-install / transfer. COLI per truck, checklist-gated."]];
  return <div className="rounded-lg" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="px-4 py-3 text-base font-semibold" style={{ borderBottom: `1px solid ${C.border}` }}>New Case</div><div className="px-4 py-3">{fake.map((f) => <label key={f} className="flex items-center gap-2 py-1.5 opacity-35"><Circle size={15} /><span className="text-sm">{f}</span></label>)}{live.map(([k, n, d]) => <button key={k} onClick={() => onPick(k)} className="flex items-start gap-2 py-2.5 w-full text-left rounded px-2 mt-1 hover:bg-[#F3F9FE]"><CircleDot size={15} className="mt-0.5" color={C.link} /><span><span className="text-sm font-semibold">{n}</span><span className="block text-xs" style={{ color: C.sub }}>{d}</span></span><ChevronRight size={15} className="ml-auto mt-0.5" color={C.link} /></button>)}</div><div className="px-4 py-3 flex justify-end" style={{ borderTop: `1px solid ${C.border}`, background: "#FAFAF9" }}><Btn sm onClick={onCancel}>Cancel</Btn></div></div>;
}

function CreateOrdering({ onCancel, onSave, flash }) {
  const [count, setCount] = useState(3);
  const [contract, setContract] = useState("NRM-2026 · Lease");
  const [toi, setToi] = useState("New Install");
  const has = !contract.startsWith("None"); const rm = count > 20, fin = count > 40;
  return <WithNotes notes={[["Type of Install", "New Install or Upgrade — Upgrades order through here too (module-only options on System Type) and may have return parts."], ["Contract in Salesforce", "Lease vs Purchase from the SF contract/pricebook. No contract → Finance must approve."], ["Thresholds", ">20 trucks → RM. >40 → Finance."]]}>
    <div className="rounded-lg" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
      <div className="px-4 py-3 text-base font-semibold text-center" style={{ borderBottom: `1px solid ${C.border}` }}>New Case: Ordering</div>
      <div className="px-5 py-4"><div className="grid md:grid-cols-2 gap-4">
        <div><Lbl>* Account</Lbl><Sel value={ACCOUNT} opts={[ACCOUNT]} /></div><div><Lbl>* System Type</Lbl><Sel value="V5 Basic (VAS)" opts={SYSTYPES} /></div>
        <div><Lbl>* Truck Count</Lbl><Inp type="number" value={count} onChange={(e) => setCount(+e.target.value || 0)} /></div><div><Lbl>* Type of Install</Lbl><Sel value={toi} set={setToi} opts={TYPE_OF_INSTALL} /></div>
        <div><Lbl>* Contract (Salesforce)</Lbl><Sel value={contract} set={setContract} opts={["NRM-2026 · Lease", "NRM-2026 · Purchase", "None on file"]} /></div><div><Lbl>* Install Labor (Bruski — labor invoicing)</Lbl><Sel value="Internal (Bruski)" opts={["Internal (Bruski)", "Paid (3rd party)"]} /></div>
      </div>
        {!has && <Callout color={C.err} bg={C.errBg} icon={AlertTriangle} title="No contract on file">Finance must approve before parts can be ordered.</Callout>}
        {(rm || fin) && <Callout color={C.purp} bg={C.purpBg} icon={ShieldCheck} title="Approval needed">{rm && "Truck count > 20 → Regional Manager approval. "}{fin && "Truck count > 40 → Finance approval."}</Callout>}
      </div>
      <div className="px-4 py-3 flex justify-end gap-2" style={{ borderTop: `1px solid ${C.border}`, background: "#FAFAF9" }}><Btn sm onClick={onCancel}>Cancel</Btn><Btn sm brand onClick={() => { onSave({ id: "ORD-000" + (30 + Math.floor(Math.random() * 60)), kind: "Ordering", account: ACCOUNT, reason: toi, subject: "Order parts", status: "In Progress", owner: "Demo CSM", created: "today", truckCount: count, system: "V5 Basic (VAS)", typeOfInstall: toi, contract: contract.split(" ")[0], contractModel: contract.includes("Lease") ? "Lease" : "Purchase", laborType: "Internal (Bruski)", rmNeeded: rm, rmApproved: !rm, finApproved: !fin, finance: { kind: contract.includes("Lease") ? "IO (Lease)" : "GL/CC (Purchase)", state: "Requested", number: "—" }, ship: { est: "7/10/2026", actual: "—", shipped: false }, scFiles: [], laborProcessed: false, closed: false, linkedCase: null }); flash("Ordering case created — next step is with " + (rm ? "the Regional Manager." : "Supply Chain.")); }}>Save</Btn></div>
    </div>
  </WithNotes>;
}

function CreateOperational({ cases, onCancel, onSave, flash }) {
  const [reason, setReason] = useState("De-install & Re-install (new truck)");
  const [by, setBy] = useState("Verifi");
  const isDouble = reason.startsWith("De-install & Re-install"), isReturn = reason.includes("Return"), isAcct = reason.startsWith("Account Change");
  return <WithNotes notes={[["Dup guard", "A unit with an open COLI can't get another — blocked at creation."], ["The double", "Creates de-install + auto-held re-install (Pending Re-installs tab)."]]}>
    <div className="rounded-lg" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
      <div className="px-4 py-3 text-base font-semibold text-center" style={{ borderBottom: `1px solid ${C.border}` }}>New Case: Operational — Verified Installs</div>
      <div className="px-5 py-4"><div className="grid md:grid-cols-2 gap-4">
        <div><Lbl>* Account</Lbl><Sel value={ACCOUNT} opts={[ACCOUNT]} /></div><div><Lbl>* Install Reason</Lbl><Sel value={reason} set={setReason} opts={[...INSTALL_REASON, ...MOVE_REASON]} /></div>
        <div><Lbl>* System Type</Lbl><Sel value="V3" opts={SYSTYPES} /></div><div><Lbl>* Work Performed by</Lbl><Sel value={by} set={setBy} opts={WORKBY} /></div>
      </div>
        {isReturn && <Callout color={C.purp} bg={C.purpBg} icon={DollarSign} title="Finance gate">Return to Verifi opens Pending Finance; approval triggers the Return Order.</Callout>}
      </div>
      <div className="px-4 py-3 flex justify-end gap-2" style={{ borderTop: `1px solid ${C.border}`, background: "#FAFAF9" }}><Btn sm onClick={onCancel}>Cancel</Btn><Btn sm brand onClick={() => { const u = "U-25123USL044"; if (!isAcct && Object.values(cases).some((c) => c.colis && c.colis.some((w) => w.unit === u && !["Billed", "Closed", "Work Complete"].includes(w.status)))) return flash("Blocked — that unit already has an open COLI (dup guard).", "err"); onSave({ id: "CASE-000" + (66 + Math.floor(Math.random() * 33)), kind: "Operational", account: ACCOUNT, reason, subject: reason, status: isReturn ? "Pending Finance" : "In Progress", owner: "Demo CSM", created: "today", by, system: "V3", truckCount: 1, location: "Plant 4", fsmOwner: "Account Team — Northgate", lifecycle: "Units Arrived", unitsAccepted: true, returnParts: isReturn, firstComm: "8/02/2023", accountChange: isAcct ? { from: ACCOUNT, to: "Northgate — South Yard" } : null, colis: isAcct ? [] : [coli("COLI-X1", isReturn || isDouble ? "De-install" : "Install", "U-25099USL033", "T-140", isReturn ? "Pending Finance" : "Not Started", by), ...(isDouble ? [coli("COLI-X2", "Re-Install", "U-25099USL033", "—", "On Hold – Awaiting Truck", by, { held: true })] : [])] }); flash("Case created."); }}>Save</Btn></div>
    </div>
  </WithNotes>;
}

/* ════ Case router ════ */
function CaseRouter(p) { return p.c.kind === "Ordering" ? <OrderingRecord {...p} /> : <OperationalRecord {...p} />; }

function OrderingRecord({ c, onBack, flash, upd, setCases, setUnits, role, setRole, openC }) {
  const nx = orderNext(c);
  const ship = () => {
    const nid = "CASE-00" + (900 + Math.floor(Math.random() * 90));
    const newUnits = Array.from({ length: c.truckCount }).map(() => genUnitId(c.system, c.contractModel));
    setUnits((p) => { const q = { ...p }; newUnits.forEach((uid) => { q[uid] = { id: uid, serial: "TC4-" + uid.slice(-3), truck: "—", acct: c.account, ver: "V5", mode: "Ghost", journey: 1, openColi: null, openCase: nid, history: [["today", "Shipped · ID auto-generated", uid]] }; }); return q; });
    setCases((p) => ({ ...p, [nid]: { id: nid, kind: "Operational", account: c.account, reason: "New Install", installType: c.typeOfInstall, subject: `Install (from ${c.id})`, status: "In Progress", owner: "Demo CSM", created: "today", by: "3rd Party", system: c.system, truckCount: c.truckCount, location: "Plant 4", fsmOwner: "Account Team — Northgate", lifecycle: "Units Shipped", unitsAccepted: false, linkedOrder: c.id, colis: newUnits.map((uid, i) => coli("COLI-" + nid.slice(-3) + "-" + (i + 1), "Install", uid, "—", "Locked", "3rd Party")) }, [c.id]: { ...c, ship: { ...c.ship, shipped: true, actual: "today" }, scFiles: [...c.scFiles, "packing_list_" + c.id + ".pdf"], linkedCase: nid } }));
    flash(`Shipped → Unit IDs auto-generated (${newUnits[0]}…) → Supply Chain tasked to create in Hub → install case ${nid} created, waiting for FSM to accept the units.`);
  };
  return <WithNotes notes={[["Files here = Supply Chain uploads", "Packing lists & shipment docs James K uploads from the SC tab appear on this case."], ["Unit IDs on ship", "Auto-generated in the ID-Manager format U-YYMM·HW·Region·Lease·Seq — Salesforce knows the account, so the region comes free."], ["Order closeout", "Ship → labor processed → Close order (Supply Chain)."]]}>
    <div><button onClick={onBack} className="text-xs mb-2 flex items-center gap-1" style={{ color: C.link }}><ChevronLeft size={13} /> Cases</button>
      <ThemeBand icon={C.iconOrder} eyebrow="Ordering Case" title={c.id} fields={[["Account", c.account, true], ["Trucks", c.truckCount], ["Type of Install", c.typeOfInstall], ["Contract", `${c.contract} · ${c.contractModel}`], ["Status", c.closed ? "Complete" : c.status]]} actions={c.linkedCase && <Btn sm onClick={() => openC(c.linkedCase)}>Open install case →</Btn>} />
      {nx && <NextStep text={nx[0]} owner={nx[1]} role={role} setRole={setRole} />}
      <div className="mt-1">
        {c.rmNeeded && !c.rmApproved && <Callout color={C.linkDk} bg={C.infoBg} icon={ShieldCheck} title="RM approval required (>20 trucks)"><RoleBtn need="Regional Manager" role={role} setRole={setRole} onClick={() => { upd(c.id, { rmApproved: true }); flash("RM approved — Supply Chain can ship."); }}>Approve order</RoleBtn></Callout>}
        <Section title="Approvals & routing"><TwoCol rows={[["FSM aligned", "Yes"], ["CSM aligned", "Yes"], ["RM approval (>20)", c.rmNeeded ? (c.rmApproved ? "Approved" : "Required") : "n/a"], ["Finance approval (>40)", "n/a"], ["Install Manager — who installs?", "3rd-party crew (confirmed)"], ["Install Labor (Bruski)", c.laborType]]} /></Section>
        <div className="grid md:grid-cols-2 gap-3">
          <Section title="Finance task (parallel — never blocks)" badge={<Tag c={C.purp}>Jim</Tag>}><TwoCol rows={[["Type", c.finance.kind], ["State", c.finance.state], ["Number", c.finance.number]]} />{c.finance.state !== "Created" && <div className="mt-1"><RoleBtn need="Finance (Jim)" role={role} setRole={setRole} onClick={() => { upd(c.id, { finance: { ...c.finance, state: "Created", number: "IO-" + (88000 + Math.floor(Math.random() * 999)) } }); flash("IO created — number flows back to the case & SC tracker."); }}>Create IO</RoleBtn></div>}</Section>
          <Section title="Supply Chain task" badge={<Tag c={C.orange}>James K</Tag>}><TwoCol rows={[["Est. Ship", c.ship.est], ["Actual Ship", c.ship.actual], ["Shipped", c.ship.shipped ? "Yes" : "No"], ["Labor processed", c.laborProcessed ? "Yes" : "No"]]} />
            <div className="flex gap-2 mt-1 flex-wrap">{!c.ship.shipped && <RoleBtn need="Supply Chain (James K)" role={role} setRole={setRole} onClick={ship}>Mark Shipped (generates Unit IDs)</RoleBtn>}
              {c.ship.shipped && !c.laborProcessed && <RoleBtn need="Supply Chain (James K)" role={role} setRole={setRole} onClick={() => { upd(c.id, { laborProcessed: true }); flash("Labor invoiced against the project."); }}>Process labor</RoleBtn>}
              {c.ship.shipped && c.laborProcessed && !c.closed && <RoleBtn need="Supply Chain (James K)" role={role} setRole={setRole} onClick={() => { upd(c.id, { closed: true, status: "Complete" }); flash("Supply Chain order closed — tracker goes green."); }}>Close Supply Chain order</RoleBtn>}</div></Section>
        </div>
        <Section title="Files — Supply Chain uploads" badge={<Tag c={C.orange}>uploaded by SC</Tag>}>{c.scFiles.length === 0 ? <p className="text-xs py-1" style={{ color: C.sub }}>Nothing yet — Supply Chain uploads the packing list / shipment docs here (from the SC tab or on ship).</p> : c.scFiles.map((f) => <div key={f} className="flex items-center gap-2 py-1.5 text-sm" style={{ color: C.link, borderBottom: `1px solid ${C.borderLt}` }}><FileText size={13} />{f}</div>)}</Section>
      </div>
    </div>
  </WithNotes>;
}

/* ════ Operational record ════ */
function OperationalRecord({ c, cases, onBack, flash, upd, role, setRole, openC, openU, updUnit }) {
  const [tab, setTab] = useState("Related");
  const [coliOpen, setColiOpen] = useState(null);
  const nx = opNext(c);
  const stageIdx = c.status === "Closed" ? 4 : Math.max(0, LIFECYCLE.indexOf(c.lifecycle));
  const locked = c.lifecycle === "Units Shipped" && !c.unitsAccepted;
  const allDone = c.colis.length > 0 && c.colis.every((w) => (["Work Complete", "Billed"].includes(w.status) && w.validated) || w.held);
  const acceptUnits = () => { upd(c.id, { unitsAccepted: true, lifecycle: "Units Arrived", colis: c.colis.map((w) => w.status === "Locked" ? { ...w, status: "Not Started" } : w) }); c.colis.forEach((w) => updUnit(w.unit, { journey: 2 })); flash("Units accepted on site → lifecycle = Units Arrived → COLIs unlocked for the crew."); };
  const validateFsm = (id) => { upd(c.id, { colis: c.colis.map((w) => w.id === id ? { ...w, status: "Work Complete", validated: true } : w) }); const w = c.colis.find((x) => x.id === id); if (w) updUnit(w.unit, { journey: 4, truck: w.stampedTruck !== "—" ? w.stampedTruck : "T-NEW" }); flash("FSM validated → data-flow check confirms the truck → billing row created on the Finance tab → sent to Command Center."); };
  return <WithNotes notes={[["Units must be accepted first", "COLIs are LOCKED until the FSM confirms the units arrived — you can't close work on units nobody accepted."], ["FSM-only validation", "3rd-party close = Submitted. Only the FSM role can validate — the crew literally can't press it."], ["Everything connects", "Validation creates the billing row (Finance tab), advances the unit journey, and moves the Management dashboard."]]}>
    <div><button onClick={onBack} className="text-xs mb-2 flex items-center gap-1" style={{ color: C.link }}><ChevronLeft size={13} /> Cases</button>
      <ThemeBand icon={C.iconCase} eyebrow="Operational Case · Verified Installs" title={c.id} fields={[["Account", c.account, true], ["Install Reason", c.reason], ["Work By", c.by], ["Status", c.status]]} actions={c.linkedOrder && <Btn sm onClick={() => openC(c.linkedOrder)}>← {c.linkedOrder}</Btn>} />
      {nx && <NextStep text={nx[0]} owner={nx[1]} role={role} setRole={setRole} />}
      <RecTabs tabs={["Related", "Details"]} active={tab} onTab={setTab} />
      {!c.returnParts && !c.accountChange && <Stages list={LIFECYCLE} at={stageIdx} />}
      {tab === "Details" ? <Section title="Case Information"><TwoCol rows={[["Case Number", c.id], ["Install Reason", c.reason], ["System Type", c.system], ["Work Performed by", c.by], ["Truck Count", c.truckCount], ["Location", c.location], ["FSM Owner (account team)", c.fsmOwner], ["Linked Ordering Case", c.linkedOrder || "—", true]]} /></Section> : <>
        {locked && <Callout color={C.warn} bg={C.warnBg} icon={Lock} title="Units shipped — awaiting acceptance">The COLIs are locked until the FSM confirms the units arrived on site. <span className="ml-1"><RoleBtn need="FSM" role={role} setRole={setRole} onClick={acceptUnits}>Confirm units arrived</RoleBtn></span></Callout>}
        {c.status === "Pending Finance" && <Callout color={C.purp} bg={C.purpBg} icon={DollarSign} title="Finance review (depreciation)">First Commissioned {c.firstComm}. <span className="ml-1"><RoleBtn need="Finance (Jim)" role={role} setRole={setRole} onClick={() => { upd(c.id, { status: "In Progress", colis: c.colis.map((w) => ({ ...w, status: "Not Started" })) }); flash("Finance approved → Return Order created (Supply Chain tab)."); }}>Approve return</RoleBtn></span></Callout>}
        {c.accountChange && <Section title="Account Change" badge={<Tag c={C.purp}>not field work</Tag>}><TwoCol rows={[["From", c.accountChange.from, true], ["To", c.accountChange.to, true], ["Routed to", "Command Center / FSM"], ["Billing", "Usually none — being refined"]]} /></Section>}
        {c.colis.length > 0 && <Related title={`COLIs — one per truck (${c.colis.length})`} columns={["COLI", "Type", "Unit", "Truck", "Work By", "Status", ""]}
          footer={locked ? "Locked until units are accepted by the FSM." : allDone ? "All complete & validated → CSM can close the case." : "Parent closes only when every child is complete & validated."}
          rows={c.colis.map((w) => <tr key={w.id} className={locked ? "" : "cursor-pointer hover:bg-[#F3F9FE]"} onClick={() => !locked && !w.held && setColiOpen(w)} style={{ borderTop: `1px solid ${C.borderLt}`, opacity: locked ? 0.55 : 1 }}><td className="px-3 py-2.5" style={{ color: C.link, fontWeight: 500 }}>{w.id}</td><td className="px-3 py-2.5">{w.type}</td><td className="px-3 py-2.5" style={{ color: C.link }} onClick={(e) => { e.stopPropagation(); openU(w.unit); }}>{w.unit}</td><td className="px-3 py-2.5">{w.truck}</td><td className="px-3 py-2.5">{w.by}</td><td className="px-3 py-2.5"><Status s={w.status} /></td>
            <td className="px-3 py-2.5">{w.status === "Submitted – Pending FSM" && <RoleBtn need="FSM" role={role} setRole={setRole} onClick={(e) => { validateFsm(w.id); }}>Validate (FSM only)</RoleBtn>}{w.validated && <span className="text-xs flex items-center gap-1" style={{ color: C.ok }}><ShieldCheck size={12} /> verified by data flow</span>}{w.held && <span className="text-xs" style={{ color: C.warn }}>held → Pending Re-installs</span>}</td></tr>)} />}
        {c.returnParts && c.status !== "Pending Finance" && <Section title="Return Order (auto-created)" badge={<Tag c={C.orange}>RO</Tag>}><TwoCol rows={[["Units going back (tagged)", c.colis[0] && c.colis[0].unit], ["Ship to", c.by === "Verifi" ? "Verifi Returns [address]" : "FSM route → owner"], ["Pack list (DRAFT)", "wire harness, controller, sensor kit — write Unit # LARGE"], ["Tracking", "Ladder + reminders on the Supply Chain tab"]]} /></Section>}
        <div className="flex justify-end mt-2"><RoleBtn need="CSM" role={role} setRole={setRole} onClick={() => { if (!allDone) return flash("Can't close — children not all complete & validated.", "err"); upd(c.id, { status: "Closed", lifecycle: "Closed" }); c.colis.forEach((w) => !w.held && updUnit(w.unit, { journey: 5, openColi: null })); flash("Case closed → IO Closure auto-populated from COLI forms → Return Order for excess → billing submitted."); }}>Close case (CSM confirms billable + month)</RoleBtn></div>
      </>}
      {coliOpen && <ColiModal w={coliOpen} role={role} setRole={setRole} onClose={() => setColiOpen(null)} onSubmit={(ready) => { const isThird = coliOpen.by !== "Verifi"; upd(c.id, { colis: c.colis.map((x) => x.id === coliOpen.id ? { ...x, status: ready ? (isThird ? "Submitted – Pending FSM" : "Work Complete") : "On Hold", validated: !isThird && ready } : x) }); if (!isThird && ready) { updUnit(coliOpen.unit, { journey: 4 }); } setColiOpen(null); flash(ready ? (isThird ? "Submitted — waiting on the FSM to validate (crew can't self-accept)." : "Checklist complete → data-flow verified → billing row created.") : "Service Ready = No → On Hold, FSM reminded, optional rush-parts."); }} />}
    </div>
  </WithNotes>;
}

/* ════ COLI modal ════ */
function ColiModal({ w, role, setRole, onClose, onSubmit }) {
  const [scr, setScr] = useState(0);
  const isThird = w.by !== "Verifi";
  const canWork = isThird ? ["3rd Party Crew", "FSM"].includes(role) : ["FST (Verifi)", "FSM"].includes(role);
  const items = w.type === "Install" ? POSTINSTALL : ["System powered down safely", "Unit removed from truck", "Components bagged & labeled for return", "Truck wiring capped / secured", "Photos taken of removal"];
  const commission = w.type === "Install" ? VERIFI_COMMISSION : [];
  const [chk, setChk] = useState([...items, ...commission].map(() => true));
  const [ready, setReady] = useState("Yes"); const [shipBack, setShipBack] = useState(true);
  const done = chk.every(Boolean);
  const f = w.fields;
  return <Overlay title={`${w.id} · ${w.type} COLI`} onClose={onClose} wide>
    <div className="mb-2 flex items-center gap-2"><Status s={w.status} />{w.validated && <Tag c={C.ok}>verified by data flow</Tag>}</div>
    {scr === 0 && <>
      <Section title="Truck & System (mandatory to close)"><TwoCol rows={[["Truck Number (auto)", w.truck, false, true], ["VIN (optional)", f.vin], ["System Type", f.sysType, false, true], ["TCG / Unit #", f.tcg, false, true], ["Mixer Make", f.mixer, false, true], ["WDS #", f.wds, false, true], ["Propulsion", f.propulsion, false, true], ["Parts consumed", "Wire harness ×1"]]} />{isThird && <p className="text-xs mt-1" style={{ color: C.warn }}>3rd party can't see the Hub — TCG entered manually; the FSM validates after the work.</p>}</Section>
      <div className="flex flex-wrap gap-1 mb-2">{PRESET_FILES.map((x) => <span key={x} className="flex items-center gap-1 text-[11px] rounded px-2 py-0.5" style={{ background: "#EEF4FE", color: C.link }}><FileText size={10} />{x}</span>)}</div>
      {["Work Complete", "Billed", "Submitted – Pending FSM"].includes(w.status) ? <Callout color={C.ok} bg={C.okBg} icon={CheckCircle2} title="Closure recorded">{w.status === "Submitted – Pending FSM" ? "Waiting on FSM validation (on the case)." : "Operational billing: event date = date the work happened; CSM confirms billable + month at case close."}</Callout>
        : canWork ? <div className="flex justify-end"><Btn brand onClick={() => setScr(1)}>Open Post-{w.type} Checklist</Btn></div>
          : <Callout color={C.warn} bg={C.warnBg} icon={Lock} title="Wrong role">Only the {isThird ? "3rd Party Crew" : "FST (Verifi)"} (or FSM) completes this checklist. <button onClick={() => setRole(isThird ? "3rd Party Crew" : "FST (Verifi)")} className="underline text-xs" style={{ color: C.link }}>switch role →</button></Callout>}
    </>}
    {scr === 1 && <>
      {!done && <div className="rounded px-3 py-2 mb-3 text-sm" style={{ background: C.errBg, color: C.err }}><b>You have not completed all checklist items.</b></div>}
      <div className="grid md:grid-cols-2 gap-x-8">{items.map((it, i) => <label key={it} className="flex items-start gap-2 py-1.5 text-sm"><input type="checkbox" checked={chk[i]} onChange={() => setChk((p) => p.map((v, j) => j === i ? !v : v))} className="mt-0.5" />{it}</label>)}</div>
      {commission.length > 0 && <><div className="text-sm font-bold mt-3 mb-1">Verifi — Commissioning & Testing</div><div className="grid md:grid-cols-2 gap-x-8">{commission.map((it, i) => { const idx = items.length + i; return <label key={it} className="flex items-center gap-2 py-1.5 text-sm"><input type="checkbox" checked={chk[idx]} onChange={() => setChk((p) => p.map((v, j) => j === idx ? !v : v))} />{it}</label>; })}</div></>}
      <div className="mt-3"><Lbl>* System is Service Ready</Lbl><Sel value={ready} set={setReady} opts={["Yes", "No"]} /></div>
      <label className="flex items-center gap-2 text-sm mt-2"><input type="checkbox" checked={shipBack} onChange={() => setShipBack(!shipBack)} /> * Install equipment shipped back</label>
      <div className="flex justify-end gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${C.border}` }}><Btn onClick={() => setScr(0)}>Back</Btn><Btn brand disabled={!done || !shipBack} onClick={() => onSubmit(ready === "Yes")}>{ready === "No" ? "Save — put On Hold" : isThird ? "Submit → pending FSM validation" : "Close COLI"}</Btn></div>
    </>}
  </Overlay>;
}

/* ════ Units ════ */
function UnitList({ units, openU }) {
  return <WithNotes notes={[["ID format", "U-YYMM·HW·Region·Lease·Seq, auto-generated at ship from the account (ID-Manager system)."], ["Journey", "The unit is the thread — every team sees the same journey through its own lens."]]}>
    <div className="rounded-lg" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}><div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: C.iconAsset }}><Package size={16} color="#fff" /></div><div><div className="text-xs" style={{ color: C.sub }}>Units (Assets)</div><div className="font-semibold text-base">{ACCOUNT} — Units</div></div></div>
      <table className="w-full text-sm"><thead><tr style={{ color: C.sub }} className="text-xs">{["Unit Id", "Serial", "Truck", "Ver", "Mode", "Journey", "Open COLI"].map((h) => <th key={h} className="text-left font-medium px-3 py-2" style={{ borderBottom: `1px solid ${C.borderLt}` }}>{h}</th>)}</tr></thead>
        <tbody>{Object.values(units).map((u) => <tr key={u.id} onClick={() => openU(u.id)} className="cursor-pointer hover:bg-[#F3F9FE]" style={{ borderBottom: `1px solid ${C.borderLt}` }}><td className="px-3 py-2.5" style={{ color: C.link, fontWeight: 500 }}>{u.id}</td><td className="px-3 py-2.5">{u.serial}</td><td className="px-3 py-2.5">{u.truck}</td><td className="px-3 py-2.5">{u.ver}</td><td className="px-3 py-2.5">{u.mode}</td><td className="px-3 py-2.5 text-xs" style={{ color: C.sub }}>{UNIT_JOURNEY[u.journey]}</td><td className="px-3 py-2.5">{u.openColi ? <span className="text-xs flex items-center gap-1" style={{ color: C.warn }}><Lock size={12} /> {u.openColi}</span> : <span className="text-xs" style={{ color: C.sub }}>none</span>}</td></tr>)}</tbody></table>
    </div>
  </WithNotes>;
}
function UnitRecord({ u, onBack, openC }) {
  return <div><button onClick={onBack} className="text-xs mb-2 flex items-center gap-1" style={{ color: C.link }}><ChevronLeft size={13} /> Units</button>
    <ThemeBand icon={C.iconAsset} eyebrow="Asset · Unit" title={u.id} fields={[["Account", u.acct, true], ["Truck", u.truck], ["Version", u.ver], ["Mode", u.mode]]} actions={<Btn sm>Edit</Btn>} />
    <div className="mt-3">
      <Section title="Unit Journey"><Stages list={UNIT_JOURNEY} at={u.journey} color={C.iconAsset} /></Section>
      {u.openColi && <Callout color={C.warn} bg={C.warnBg} icon={Lock} title="Open COLI — duplicates blocked">Open COLI <b>{u.openColi}</b> on <button className="underline" style={{ color: C.link }} onClick={() => openC(u.openCase)}>{u.openCase}</button>.</Callout>}
      <Related title={`History (${u.history.length})`} columns={["Date", "Event", "Ref"]} rows={u.history.map((h, i) => <tr key={i} style={{ borderTop: `1px solid ${C.borderLt}` }}><td className="px-3 py-2.5">{h[0]}</td><td className="px-3 py-2.5">{h[1]}</td><td className="px-3 py-2.5" style={{ color: C.sub }}>{h[2]}</td></tr>)} />
    </div></div>;
}

/* ════ Pending Re-installs ════ */
function Pending({ cases, upd, openC, flash, role, setRole }) {
  const rows = [];
  Object.values(cases).forEach((c) => c.colis && c.colis.forEach((w) => w.held && rows.push({ ...w, caseId: c.id, account: c.account })));
  return <WithNotes notes={[["The re-find", "Held re-installs live only here — never lost, never duplicated. 30-day reminder."], ["Stays held", "Even if the truck # is known — until the FSM/CSM says go."]]}>
    <div className="rounded-lg" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${C.border}` }}><RotateCcw size={16} color={C.iconAsset} /><div className="font-semibold text-base">Pending Re-installs</div></div>
      {rows.length === 0 ? <div className="px-4 py-8 text-center text-sm" style={{ color: C.sub }}>Nothing pending.</div> : <table className="w-full text-sm"><thead><tr style={{ color: C.sub }} className="text-xs">{["COLI", "Case", "Unit", "Held", "Age", ""].map((h) => <th key={h} className="text-left font-medium px-3 py-2">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r) => <tr key={r.id} style={{ borderTop: `1px solid ${C.borderLt}` }}><td className="px-3 py-2.5" style={{ color: C.link }}>{r.id}</td><td className="px-3 py-2.5 cursor-pointer" style={{ color: C.link }} onClick={() => openC(r.caseId)}>{r.caseId}</td><td className="px-3 py-2.5" style={{ color: C.link }}>{r.unit}</td><td className="px-3 py-2.5">6/19/2026</td><td className="px-3 py-2.5"><span className="flex items-center gap-1" style={{ color: C.ok }}><Clock size={13} /> 13 days</span></td><td className="px-3 py-2.5"><RoleBtn need={["FSM", "CSM"]} role={role} setRole={setRole} onClick={() => { upd(r.caseId, { colis: cases[r.caseId].colis.map((w) => w.id === r.id ? { ...w, held: false, status: "Not Started", truck: "T-777", stampedTruck: "T-777" } : w), status: "In Progress" }); flash("Marked ready — truck stamped; the re-install is now live on the case & FSM worklist."); }}>Mark Ready</RoleBtn></td></tr>)}</tbody></table>}
    </div>
  </WithNotes>;
}

/* ════ Supply Chain ════ */
function SupplyChain({ cases, upd, flash, role, setRole, openC }) {
  const [ret, setRet] = useState(1);
  const RET = ["Requested", "BOL Requested", "Picked Up", "Shipped", "Received", "Processed"];
  const orders = Object.values(cases).filter((c) => c.kind === "Ordering");
  const cols = ["Project", "Trucks", "System", "Install Labor", "IO/PO/GL/CC", "Est. Ship", "Actual Ship", "Labor Processed", "Returns Processed", "Order Closed", "Comments"];
  return <WithNotes notes={[["One row per order", "The tracker reads live from the Ordering cases — green means done, no re-typing."], ["Uploads land on the case", "Packing list / shipment docs uploaded here appear in the Ordering case's Files."], ["Returns ladder", "Auto-created on case close; dates + reminders at each stage."]]}>
    <div>
      <div className="rounded px-3 py-2 mb-3 flex items-center gap-2 text-xs" style={{ background: C.purpBg, border: `1px solid ${C.purp}33` }}><Users size={14} style={{ color: C.purp }} /><span><b style={{ color: C.purp }}>Supply Chain (James K) dashboard.</b> Primary owner changeable — anyone can be tagged in.</span></div>
      <div className="rounded-lg mb-3 overflow-x-auto" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="px-4 py-2.5 text-sm font-semibold" style={{ borderBottom: `1px solid ${C.border}` }}>Project Tracker (live from Ordering cases)</div>
        <table className="text-sm w-full"><thead><tr style={{ color: C.sub, background: "#FAFAF9" }} className="text-xs">{cols.map((h) => <th key={h} className="text-left font-medium px-2 py-2 whitespace-nowrap">{h}</th>)}</tr></thead>
          <tbody>{orders.map((o) => { const cell = (v, done) => <td className="px-2 py-2 text-xs whitespace-nowrap text-center" style={{ background: done ? C.greenCell : "transparent", color: done ? C.green : C.text }}>{v}</td>; return <tr key={o.id} style={{ borderTop: `1px solid ${C.borderLt}` }}><td className="px-2 py-2 text-xs cursor-pointer" style={{ color: C.link }} onClick={() => openC(o.id)}>{o.id}</td>{cell(o.truckCount, true)}{cell("V5", true)}{cell(o.laborType.split(" ")[0], true)}{cell(o.finance.number, o.finance.state === "Created")}{cell(o.ship.est, true)}{cell(o.ship.actual, o.ship.shipped)}{cell(o.laborProcessed ? "✓" : "—", o.laborProcessed)}{cell("—", false)}{cell(o.closed ? "✓" : "—", o.closed)}{cell(o.closed ? "complete" : "on track", false)}</tr>; })}</tbody></table></div>
      <Section title="Actions on ORD-00021" badge={<Tag c={C.orange}>James K</Tag>}><div className="flex gap-2 flex-wrap">
        <RoleBtn need="Supply Chain (James K)" role={role} setRole={setRole} onClick={() => { const o = orders[0]; upd(o.id, { scFiles: [...o.scFiles, "shipment_docs_" + Date.now().toString().slice(-4) + ".pdf"] }); flash("Uploaded — the file now shows on the Ordering case."); }}>Upload shipment docs → case</RoleBtn>
        <RoleBtn need="Supply Chain (James K)" role={role} setRole={setRole} onClick={() => flash("Units created in Hub — they flow back into Salesforce.")}>Create units in Hub</RoleBtn></div></Section>
      <Section title="Returns — skeleton" badge={<Tag c={C.orange}>FSM responsible</Tag>}><Stages list={RET} at={ret} color={C.orange} /><TwoCol rows={[["Return Order", "RO-2210 (auto on case close)"], ["Unit tagged", "U-25099USL033"], ["Pickup", ret >= 2 ? "7/03" : "—"], ["Shipped", ret >= 3 ? "7/04" : "—"]]} /><div className="flex gap-2 mt-2">{ret < RET.length - 1 && <RoleBtn need="Supply Chain (James K)" role={role} setRole={setRole} onClick={() => { setRet(ret + 1); flash(`Return → "${RET[ret + 1]}" · reminder set.`); }}>Advance to {RET[ret + 1]}</RoleBtn>}</div></Section>
    </div>
  </WithNotes>;
}

/* ════ Finance ════ */
function Finance({ cases, upd, flash, role, setRole }) {
  const orders = Object.values(cases).filter((c) => c.kind === "Ordering");
  const billing = [];
  Object.values(cases).forEach((c) => c.kind === "Operational" && c.colis.forEach((w) => (["Work Complete", "Billed"].includes(w.status) && w.validated) && billing.push({ ...w, caseId: c.id })));
  return <WithNotes notes={[["Two money tracks", "IO/GL here is Jim's SAP paperwork — parallel, non-blocking. Billing rows appear automatically the moment a COLI is closed & validated."], ["Right month", "Operational billing date = the date the work happened; CSM confirms at case close."]]}>
    <div>
      <div className="rounded px-3 py-2 mb-3 flex items-center gap-2 text-xs" style={{ background: C.purpBg, border: `1px solid ${C.purp}33` }}><Users size={14} style={{ color: C.purp }} /><span><b style={{ color: C.purp }}>Billing / Finance (Jim) dashboard.</b> Primary owner changeable.</span></div>
      <div className="grid md:grid-cols-2 gap-3">
        <Section title="IO / GL requests">{orders.map((o) => <div key={o.id} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${C.borderLt}` }}><span className="text-sm">{o.id} · {o.finance.kind}</span><span className="flex items-center gap-2"><Status s={o.finance.state} />{o.finance.state !== "Created" && <RoleBtn need="Finance (Jim)" role={role} setRole={setRole} onClick={() => { upd(o.id, { finance: { ...o.finance, state: "Created", number: "IO-" + (88000 + Math.floor(Math.random() * 999)) } }); flash("IO created — flows to the case & SC tracker."); }}>Create</RoleBtn>}</span></div>)}</Section>
        <Section title="Billing (auto from COLI closure)">{billing.length === 0 ? <p className="text-xs py-2" style={{ color: C.sub }}>No rows yet — close & validate a COLI and it appears here automatically.</p> : billing.map((b) => <div key={b.id} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${C.borderLt}` }}><span className="text-sm">{b.id} · {b.type} · {b.unit}</span><Tag c={C.ok}>billable — work date stamped</Tag></div>)}</Section>
      </div>
    </div>
  </WithNotes>;
}

/* ════ FSM tab ════ */
function FSMTab({ cases, openC }) {
  const rows = [];
  Object.values(cases).forEach((c) => c.kind === "Operational" && c.colis.forEach((w) => rows.push({ ...w, caseId: c.id, locked: c.lifecycle === "Units Shipped" && !c.unitsAccepted })));
  const needsAction = rows.filter((r) => r.status === "Submitted – Pending FSM").length + Object.values(cases).filter((c) => c.kind === "Operational" && c.lifecycle === "Units Shipped" && !c.unitsAccepted).length;
  return <WithNotes notes={[["FSM's two jobs here", "1) Accept arriving units (unlocks COLIs). 2) Validate 3rd-party work after it's done."], ["No Service Appointment", "COLIs hang here on their own — off FST dispatch & KPIs."]]}>
    <div>{needsAction > 0 && <Callout color={C.purp} bg={C.purpBg} icon={ShieldCheck} title={`${needsAction} item(s) need the FSM`}>Open the case to accept units or validate submitted work.</Callout>}
      <div className="rounded-lg" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="px-4 py-2.5 text-sm font-semibold flex items-center gap-2" style={{ borderBottom: `1px solid ${C.border}` }}><Wrench size={15} color={C.sub} /> COLI Worklist — {ACCOUNT} account team</div>
        <table className="w-full text-sm"><thead><tr style={{ color: C.sub }} className="text-xs">{["COLI", "Case", "Type", "Unit", "Work By", "Status", ""].map((h) => <th key={h} className="text-left font-medium px-3 py-2">{h}</th>)}</tr></thead>
          <tbody>{rows.map((w) => <tr key={w.id} style={{ borderTop: `1px solid ${C.borderLt}`, opacity: w.locked ? 0.55 : 1 }}><td className="px-3 py-2.5" style={{ color: C.link }}>{w.id}</td><td className="px-3 py-2.5 cursor-pointer" style={{ color: C.link }} onClick={() => openC(w.caseId)}>{w.caseId}</td><td className="px-3 py-2.5">{w.type}</td><td className="px-3 py-2.5">{w.unit}</td><td className="px-3 py-2.5">{w.by}</td><td className="px-3 py-2.5"><Status s={w.status} /></td><td className="px-3 py-2.5">{w.locked && <Tag c={C.warn}>accept units first</Tag>}{w.status === "Submitted – Pending FSM" && <Tag c={C.purp}>validate on case</Tag>}{w.held && <Tag c={C.warn}>held</Tag>}</td></tr>)}</tbody></table>
      </div>
    </div>
  </WithNotes>;
}

/* ════ Management ════ */
function Mgmt({ cases }) {
  const stages = ["Ordering", "Finance/Ship", "Install (COLIs)", "Validation", "Closing", "Returns/Billed"];
  const projects = Object.values(cases).map((c) => {
    let at = 0;
    if (c.kind === "Ordering") at = c.closed ? 5 : c.ship.shipped ? 2 : c.finance.state === "Created" ? 1 : 0;
    else { const done = c.colis.filter((w) => w.validated).length; at = c.status === "Closed" ? 5 : c.status === "Pending Finance" ? 1 : done === c.colis.length && c.colis.length ? 4 : c.colis.some((w) => w.status === "Submitted – Pending FSM") ? 3 : 2; }
    return { name: `${c.id} · ${c.reason}`, at };
  });
  return <WithNotes notes={[["Live, not typed", "This board is computed from the case state — approve, ship, validate anywhere and it moves here."]]}>
    <div><Callout color={C.iconAsset} bg="#F1EFFB" icon={LayoutDashboard} title="Management — project by stage">Where everything is, across the whole flow.</Callout>
      <div className="rounded-lg overflow-x-auto" style={{ background: "#fff", border: `1px solid ${C.border}` }}><div className="grid" style={{ gridTemplateColumns: `230px repeat(${stages.length},1fr)`, minWidth: 680 }}><div className="px-3 py-2 text-xs font-semibold" style={{ color: C.sub, borderBottom: `1px solid ${C.border}` }}>Project</div>{stages.map((s) => <div key={s} className="px-2 py-2 text-[11px] font-semibold text-center" style={{ color: C.sub, borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.borderLt}` }}>{s}</div>)}{projects.map((p) => <React.Fragment key={p.name}><div className="px-3 py-3 text-sm" style={{ borderBottom: `1px solid ${C.borderLt}`, color: C.link }}>{p.name}</div>{stages.map((s, i) => <div key={s} className="px-2 py-3 flex items-center justify-center" style={{ borderBottom: `1px solid ${C.borderLt}`, borderLeft: `1px solid ${C.borderLt}` }}>{i < p.at ? <CheckCircle2 size={16} color={C.ok} /> : i === p.at ? <span className="w-3 h-3 rounded-full" style={{ background: C.info }} /> : <span className="w-3 h-3 rounded-full" style={{ background: "#E5E5E5" }} />}</div>)}</React.Fragment>)}</div></div>
    </div>
  </WithNotes>;
}
