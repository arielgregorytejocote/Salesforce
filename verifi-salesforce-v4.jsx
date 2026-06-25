import React, { useState } from "react";
import {
  ChevronRight, ChevronDown, ChevronLeft, AlertTriangle, CheckCircle2, Clock, Truck,
  X, Info, Eye, MousePointerClick, Smartphone, Lock, FileText, Mail, Plus, Package,
  Building2, ArrowRight, Search, Settings, Bell, Pencil, Star, MoreHorizontal, Filter,
} from "lucide-react";

/* ════════ SLDS palette — muted, authentic ════════ */
const C = {
  page: "#F3F3F3", card: "#fff", border: "#DDDBDA", borderLt: "#EAEAEA",
  text: "#181818", sub: "#5C5C5C", subLt: "#706E6B", link: "#0176D3", linkDk: "#014486",
  band1: "#EAF0F6", band2: "#E1E9F2",
  navBar: "#FFFFFF", topBar: "#16325C",
  ok: "#2E844A", okBg: "#EFFCF4", warn: "#A56500", warnBg: "#FEF3E7",
  info: "#0176D3", infoBg: "#EEF4FE", neutral: "#5C5C5C", neutralBg: "#F2F2F2",
  err: "#BA0517", errBg: "#FEF1EE",
  iconCase: "#F2842B", iconInstall: "#0B827C", iconAsset: "#5C5BC9",
};
const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/* ════════ data ════════ */
const FILES = {
  deinstall: { n: "Field Service Technician V5 De-install Checklist", k: "82KB" },
  reinstall: { n: "Field Service Technician V5 Re-install Checklist", k: "84KB" },
  commission: { n: "Field Service Technician V5 Truck Commissioning Checklist", k: "75KB" },
  install: { n: "Field Service Technician V5 Installation Checklist", k: "90KB" },
  testing: { n: "Field Service Technician V5 Truck Testing Checklist", k: "79KB" },
  returnOrder: { n: "V5 Return Order Checklist", k: "61KB" },
};
const W = (id, type, unit, truck, status, file, billable, billed) => ({ id, type, unit, truck, status, file, billable, billed });

const CASES = {
  "00005001": {
    id: "00005001", rtype: "Unit Movement", icon: C.iconCase, intent: "Transfer (Another Truck)",
    subject: "Transfer — 1 unit to a new truck", account: "Acme Ready Mix", status: "In Progress",
    owner: "J. Rivera", created: "6/02/2026", priority: "Medium", origin: "Phone",
    wolis: [
      W("WOLI-5001", "Deinstall", "U-25101AA001", "201", "Work Complete", "deinstall", "De-install (Verifi) — Billable: Yes", true),
      W("WOLI-5002", "Reinstall", "U-25101AA001", "—", "On Hold", "reinstall", "pending work", false),
    ],
    files: ["deinstall", "reinstall", "commission"],
  },
  "00005003": {
    id: "00005003", rtype: "Unit Movement", icon: C.iconCase, intent: "Transfer (Another Truck)",
    subject: "Reinstall on hold — awaiting truck", account: "Globex Concrete", status: "On Hold",
    owner: "A. Park", created: "5/19/2026", priority: "Medium", origin: "Email",
    wolis: [
      W("WOLI-5031", "Deinstall", "U-25088BB044", "118", "Billed", "deinstall", "De-install (Verifi) — Billable: Yes", true),
      W("WOLI-5032", "Reinstall", "U-25088BB044", "—", "On Hold", "reinstall", "pending work", false),
    ],
    files: ["deinstall", "reinstall"],
  },
  "00005005": {
    id: "00005005", rtype: "Unit Movement", icon: C.iconCase, intent: "Deinstall – Return to Verifi",
    subject: "Return 1 unit to Verifi", account: "Umbrella Aggregates", status: "Pending Finance",
    owner: "J. Rivera", created: "6/10/2026", priority: "High", origin: "Phone",
    wolis: [W("WOLI-5051", "Deinstall", "U-25140DD300", "440", "Pending Finance", "deinstall", "pending approval", false)],
    files: ["deinstall", "returnOrder"],
  },
  "00006001": {
    id: "00006001", rtype: "New Install", icon: C.iconInstall, intent: "New Install",
    subject: "New install — 2 units (awaiting trucks)", account: "Initech Materials", status: "Awaiting Trucks",
    owner: "M. Singh", created: "6/12/2026", priority: "Medium", origin: "Order",
    wolis: [
      W("WOLI-6001", "Install", "U-25210CC101", "—", "Awaiting Trucks", "install", "pending work", false),
      W("WOLI-6002", "Install", "U-25210CC102", "—", "Awaiting Trucks", "install", "pending work", false),
    ],
    files: ["install", "testing"],
  },
  "00006002": {
    id: "00006002", rtype: "New Install", icon: C.iconInstall, intent: "New Install",
    subject: "New install — 1 unit", account: "Umbrella Aggregates", status: "In Progress",
    owner: "M. Singh", created: "6/05/2026", priority: "Low", origin: "Order",
    wolis: [W("WOLI-6021", "Install", "U-25140DD455", "501", "Activated", "install", "pending work", false)],
    files: ["install", "testing"],
  },
};

const UNITS = {
  "U-25101AA001": { id: "U-25101AA001", serial: "TCG-7001", truck: "201", acct: "Acme Ready Mix", ver: "V5", mod: "Base + Water", payer: "PY-44120", soldTo: "Acme HQ", contract: "Acme West", mode: "Active", type: "Mixer", firstComm: "3/19/2024", lastComm: "3/19/2024", openWoli: "WOLI-5002", openCase: "00005001",
    history: [["3/19/2024", "Commissioned", "Truck 201"], ["6/02/2026", "De-install (Transfer)", "Off Truck 201"], ["6/02/2026", "Reinstall created", "On Hold – awaiting truck"]] },
  "U-25101AA002": { id: "U-25101AA002", serial: "TCG-7002", truck: "202", acct: "Acme Ready Mix", ver: "V5", mod: "Base + Water + Admix", payer: "PY-44120", soldTo: "Acme HQ", contract: "Acme West", mode: "Active", type: "Mixer", firstComm: "1/10/2025", lastComm: "1/10/2025", openWoli: null, openCase: null,
    history: [["1/10/2025", "Commissioned", "Truck 202"]] },
  "U-25088BB044": { id: "U-25088BB044", serial: "TCG-6044", truck: "118", acct: "Globex Concrete", ver: "V3", mod: "Base + Water", payer: "PY-39001", soldTo: "Globex HQ", contract: "Globex Central", mode: "Active", type: "Mixer", firstComm: "8/02/2023", lastComm: "8/02/2023", openWoli: "WOLI-5032", openCase: "00005003",
    history: [["8/02/2023", "Commissioned", "Truck 118"], ["5/19/2026", "De-install (Transfer)", "Off Truck 118"], ["5/19/2026", "Reinstall created", "On Hold"]] },
  "U-25210CC101": { id: "U-25210CC101", serial: "—", truck: "—", acct: "Initech Materials", ver: "V5", mod: "Base + Water", payer: "PY-50220", soldTo: "Initech HQ", contract: "Initech East", mode: "Awaiting Install", type: "Mixer", firstComm: "", lastComm: "", openWoli: "WOLI-6001", openCase: "00006001",
    history: [["6/11/2026", "Unit created (shipped)", "No truck yet"], ["6/12/2026", "New Install WOLI created", "Awaiting truck"]] },
};
const ACCT_UNITS = (acct) => Object.values(UNITS).filter((u) => u.acct === acct);

/* ════════ atoms ════════ */
const statusStyle = (s) => {
  const m = {
    "In Progress": [C.info, C.infoBg], "On Hold": [C.warn, C.warnBg], "Pending Finance": ["#7526E3", "#F4EEFC"],
    "Awaiting Trucks": [C.warn, C.warnBg], Closed: [C.ok, C.okBg], "Work Complete": ["#0B827C", "#E9F6F5"],
    Billed: [C.ok, C.okBg], Activated: [C.info, C.infoBg], "Ready to Dispatch": [C.info, C.infoBg],
  };
  return m[s] || [C.neutral, C.neutralBg];
};
const Status = ({ s }) => { const [c, bg] = statusStyle(s); return <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium" style={{ color: c, background: bg }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />{s}</span>; };
const Btn = ({ children, onClick, brand, sm, disabled }) => (
  <button onClick={onClick} disabled={disabled} className={`rounded font-medium ${sm ? "text-xs px-2.5 py-1" : "text-sm px-3 py-1.5"}`}
    style={brand ? { background: disabled ? "#C9D9EC" : C.link, color: "#fff", border: `1px solid ${disabled ? "#C9D9EC" : C.link}` } : { background: "#fff", color: disabled ? "#C9C7C5" : C.link, border: `1px solid ${C.border}` }}>{children}</button>
);
const Tag = ({ children, c = C.neutral }) => <span className="inline-block rounded px-1.5 py-0.5 text-[11px] font-medium" style={{ color: c, background: c + "18" }}>{children}</span>;

/* ════════ app shell ════════ */
export default function App() {
  const [tab, setTab] = useState("cases");
  const [openCase, setOpenCase] = useState(null);
  const [openUnit, setOpenUnit] = useState(null);
  const [toast, setToast] = useState(null);
  const flash = (m, k = "ok") => { setToast({ m, k }); setTimeout(() => setToast(null), 3000); };
  const goUnit = (id) => { setOpenUnit(id); setTab("units"); };

  return (
    <div style={{ background: C.page, fontFamily: font, minHeight: "100vh" }} className="text-[13px]" >
      {/* utility bar */}
      <div style={{ background: C.topBar }} className="text-white px-4 py-1.5 flex items-center gap-3">
        <span className="font-semibold text-sm">Verifi</span>
        <div className="flex-1 max-w-md mx-auto flex items-center gap-2 rounded px-2 py-1" style={{ background: "rgba(255,255,255,.15)" }}>
          <Search size={13} /><span className="text-xs opacity-80">Search Salesforce…</span>
        </div>
        <Bell size={15} className="opacity-80" /><Settings size={15} className="opacity-80" />
        <span className="w-6 h-6 rounded-full text-[11px] flex items-center justify-center" style={{ background: "#5C7CB0" }}>LJ</span>
      </div>
      {/* app + object nav */}
      <div style={{ background: C.navBar, borderBottom: `1px solid ${C.border}` }} className="px-4 flex items-center gap-1">
        <span className="font-semibold text-sm pr-4 py-2.5" style={{ color: C.text }}>Service Console</span>
        {[["cases", "Cases"], ["units", "Units"], ["guided", "Guided Walkthrough"]].map(([k, l]) => (
          <button key={k} onClick={() => { setTab(k); setOpenCase(null); setOpenUnit(null); }} className="px-3 py-2.5 text-sm relative"
            style={{ color: tab === k ? C.text : C.sub, fontWeight: tab === k ? 600 : 400, borderBottom: tab === k ? `3px solid ${C.link}` : "3px solid transparent" }}>{l}</button>
        ))}
      </div>

      <div className="px-4 py-4 max-w-6xl mx-auto">
        {tab === "cases" && (openCase
          ? <CaseRecord c={CASES[openCase]} onBack={() => setOpenCase(null)} onUnit={goUnit} flash={flash} />
          : <CaseList onOpen={setOpenCase} onNew={() => setTab("guided")} />)}
        {tab === "units" && (openUnit
          ? <UnitRecord u={UNITS[openUnit]} onBack={() => setOpenUnit(null)} onCase={(id) => { setOpenCase(id); setTab("cases"); }} />
          : <UnitList onOpen={setOpenUnit} />)}
        {tab === "guided" && <Guided flash={flash} onUnit={goUnit} />}
      </div>

      {toast && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded px-4 py-2.5 text-sm text-white flex items-center gap-2 shadow-lg" style={{ background: toast.k === "err" ? C.err : C.ok, maxWidth: 560 }}>{toast.k === "err" ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}{toast.m}</div>}
    </div>
  );
}

/* ════════ Cases list view ════════ */
function CaseList({ onOpen, onNew }) {
  return (
    <div className="rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: C.iconCase }}><FileText size={16} color="#fff" /></div>
          <div><div className="text-xs" style={{ color: C.sub }}>Cases</div>
            <div className="flex items-center gap-1 font-semibold text-base">All Open Cases <ChevronDown size={15} /></div></div>
        </div>
        <div className="flex items-center gap-2">
          <Btn sm onClick={onNew}>New</Btn>
          <span className="flex items-center gap-1 text-xs" style={{ color: C.sub }}><Filter size={13} /> Filters</span>
        </div>
      </div>
      <div className="px-4 py-1.5 text-xs" style={{ color: C.sub, borderBottom: `1px solid ${C.borderLt}` }}>{Object.keys(CASES).length} items · sorted by Date Created · updated a few seconds ago</div>
      <table className="w-full text-sm">
        <thead><tr style={{ color: C.sub }} className="text-xs">
          {["", "Case Number", "Record Type", "Subject", "Account", "Status", "WOLIs", "Owner"].map((h) => <th key={h} className="text-left font-medium px-3 py-2" style={{ borderBottom: `1px solid ${C.borderLt}` }}>{h}</th>)}
        </tr></thead>
        <tbody>
          {Object.values(CASES).map((c) => (
            <tr key={c.id} onClick={() => onOpen(c.id)} className="cursor-pointer hover:bg-[#F3F9FE]" style={{ borderBottom: `1px solid ${C.borderLt}` }}>
              <td className="pl-3 py-2.5"><div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: c.icon }}>{c.rtype === "New Install" ? <Plus size={13} color="#fff" /> : <Truck size={13} color="#fff" />}</div></td>
              <td className="px-3 py-2.5" style={{ color: C.link, fontWeight: 500 }}>{c.id}</td>
              <td className="px-3 py-2.5">{c.rtype}</td>
              <td className="px-3 py-2.5">{c.subject}</td>
              <td className="px-3 py-2.5" style={{ color: C.link }}>{c.account}</td>
              <td className="px-3 py-2.5"><Status s={c.status} /></td>
              <td className="px-3 py-2.5">{c.wolis.length}</td>
              <td className="px-3 py-2.5">{c.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ════════ Record chrome (theme band + highlights + tabs) ════════ */
function ThemeBand({ icon, eyebrow, title, fields, actions }) {
  return (
    <div className="rounded-t-lg overflow-hidden" style={{ border: `1px solid ${C.border}`, borderBottom: "none" }}>
      <div style={{ background: `linear-gradient(180deg, ${C.band1}, ${C.band2})`, backgroundImage: `radial-gradient(${C.border}55 0.5px, transparent 0.5px)`, backgroundSize: "10px 10px" }} className="px-4 pt-3 pb-2">
        <div className="text-xs" style={{ color: C.subLt }}>{eyebrow}</div>
      </div>
      <div className="px-4 py-3 flex items-start justify-between gap-4 flex-wrap" style={{ background: C.card }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: icon }}>{eyebrow.includes("Asset") || eyebrow.includes("Unit") ? <Package size={20} color="#fff" /> : eyebrow.includes("Install") ? <Plus size={20} color="#fff" /> : <Truck size={20} color="#fff" />}</div>
          <div><div className="text-lg font-semibold leading-tight">{title}</div>
            <div className="flex gap-5 mt-1">{fields.map((f) => <div key={f[0]}><div className="text-[11px]" style={{ color: C.subLt }}>{f[0]}</div><div className="text-sm" style={{ color: f[2] ? C.link : C.text }}>{f[1]}</div></div>)}</div></div>
        </div>
        <div className="flex gap-2 items-center">{actions}</div>
      </div>
    </div>
  );
}
function RecordTabs({ tabs, active, onTab }) {
  return <div className="flex gap-1 px-3" style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: "none", borderBottom: `1px solid ${C.border}` }}>
    {tabs.map((t) => <button key={t} onClick={() => onTab(t)} className="px-3 py-2 text-sm relative" style={{ color: active === t ? C.text : C.sub, fontWeight: active === t ? 600 : 400, borderBottom: active === t ? `3px solid ${C.link}` : "3px solid transparent" }}>{t}</button>)}
  </div>;
}
function Section({ title, children, collapsible, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return <div className="rounded-lg mb-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
    <button onClick={() => collapsible && setOpen(!open)} className="w-full flex items-center gap-1 px-4 py-2.5 text-left" style={{ borderBottom: open ? `1px solid ${C.border}` : "none" }}>
      {collapsible && <ChevronRight size={14} style={{ transform: open ? "rotate(90deg)" : "none", color: C.sub }} />}
      <span className="text-sm font-semibold">{title}</span>
    </button>
    {open && <div className="px-4 py-2">{children}</div>}
  </div>;
}
const DetailRow = ({ label, value, link }) => (
  <div className="flex items-center justify-between gap-3 py-2" style={{ borderBottom: `1px solid ${C.borderLt}` }}>
    <div className="min-w-0"><div className="text-[11px]" style={{ color: C.subLt }}>{label}</div>
      <div className="text-sm truncate" style={{ color: link ? C.link : C.text, fontWeight: link ? 500 : 400 }}>{value || <span style={{ color: "#C9C7C5" }}>—</span>}</div></div>
    <Pencil size={12} style={{ color: "#B0ADAB" }} />
  </div>
);
const TwoCol = ({ rows }) => <div className="grid md:grid-cols-2 gap-x-8">{rows.map((r, i) => <DetailRow key={i} label={r[0]} value={r[1]} link={r[2]} />)}</div>;
function RelatedList({ title, columns, rows, footer }) {
  return <div className="rounded-lg mb-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
    <div className="px-4 py-2.5 text-sm font-semibold" style={{ borderBottom: `1px solid ${C.border}` }}>{title}</div>
    <table className="w-full text-sm"><thead><tr style={{ color: C.sub }} className="text-xs">{columns.map((c) => <th key={c} className="text-left font-medium px-3 py-2">{c}</th>)}</tr></thead>
      <tbody>{rows}</tbody></table>
    {footer && <div className="px-4 py-2 text-xs" style={{ color: C.sub, borderTop: `1px solid ${C.borderLt}` }}>{footer}</div>}
  </div>;
}
function FilesRelated({ files }) {
  return <div className="rounded-lg mb-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
    <div className="px-4 py-2.5 text-sm font-semibold flex items-center gap-2" style={{ borderBottom: `1px solid ${C.border}` }}><FileText size={15} color={C.sub} /> Files ({files.length}) <span className="text-xs font-normal" style={{ color: C.sub }}>· auto-attached by intent + version</span></div>
    {files.map((k) => { const f = FILES[k]; return <div key={k} className="flex items-center gap-3 px-4 py-2.5" style={{ borderBottom: `1px solid ${C.borderLt}` }}>
      <div className="w-8 h-9 rounded flex items-center justify-center text-[8px] font-bold text-white" style={{ background: "#2B78C2" }}>DOCX</div>
      <div className="min-w-0"><div className="text-sm truncate" style={{ color: C.link }}>{f.n}</div><div className="text-xs" style={{ color: C.sub }}>SharePoint link · {f.k} · docx</div></div></div>; })}
  </div>;
}

/* ════════ Case record ════════ */
function CaseRecord({ c, onBack, onUnit, flash }) {
  const [tab, setTab] = useState("Related");
  const acctUnits = ACCT_UNITS(c.account);
  return (
    <div>
      <button onClick={onBack} className="text-xs mb-2 flex items-center gap-1" style={{ color: C.link }}><ChevronLeft size={13} /> Cases</button>
      <ThemeBand icon={c.icon} eyebrow={`${c.rtype} Case`} title={`${c.id}`}
        fields={[["Account", c.account, true], ["Status", c.status], ["Owner", c.owner], ["Intent", c.intent]]}
        actions={<><Btn sm>Edit</Btn><Btn sm>Send to Command Center</Btn><Btn sm>Send to SAP / Jim</Btn></>} />
      <RecordTabs tabs={["Related", "Details"]} active={tab} onTab={setTab} />
      <div className="mt-3">
        {tab === "Details" ? (
          <Section title="Case Information">
            <TwoCol rows={[["Case Number", c.id], ["Record Type", c.rtype], ["Movement Intent", c.intent], ["Account", c.account, true],
              ["Status", c.status], ["Owner", c.owner, true], ["Priority", c.priority], ["Case Origin", c.origin], ["Date Created", c.created], ["Subject", c.subject]]} />
          </Section>
        ) : (
          <>
            <RelatedList title={`Work Order Line Items (${c.wolis.length})`} columns={["WOLI", "Type", "Unit", "Truck", "Status", "Checklist", "Billable line"]}
              rows={c.wolis.map((w) => (
                <tr key={w.id} style={{ borderTop: `1px solid ${C.borderLt}` }}>
                  <td className="px-3 py-2.5" style={{ color: C.link, fontWeight: 500 }}>{w.id}</td>
                  <td className="px-3 py-2.5">{w.type}</td>
                  <td className="px-3 py-2.5 cursor-pointer" style={{ color: C.link }} onClick={() => onUnit(w.unit)}>{w.unit}</td>
                  <td className="px-3 py-2.5">{w.truck}</td>
                  <td className="px-3 py-2.5"><Status s={w.status} /></td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: C.sub }}>{FILES[w.file].n.replace("Field Service Technician ", "")}</td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: w.billed ? C.ok : C.sub }}>{w.billable}</td>
                </tr>
              ))} />
            <FilesRelated files={c.files} />
            <RelatedList title={`Units on this Account (${acctUnits.length})`} columns={["Unit", "Truck", "Version", "Modules", "Open WOLI"]}
              footer="You only ever see units tied to this case's account."
              rows={acctUnits.map((u) => (
                <tr key={u.id} className="cursor-pointer hover:bg-[#F3F9FE]" onClick={() => onUnit(u.id)} style={{ borderTop: `1px solid ${C.borderLt}` }}>
                  <td className="px-3 py-2.5" style={{ color: C.link, fontWeight: 500 }}>{u.id}</td>
                  <td className="px-3 py-2.5">{u.truck}</td><td className="px-3 py-2.5">{u.ver}</td><td className="px-3 py-2.5">{u.mod}</td>
                  <td className="px-3 py-2.5">{u.openWoli ? <span className="flex items-center gap-1 text-xs" style={{ color: C.warn }}><Lock size={12} /> {u.openWoli}</span> : <span className="text-xs" style={{ color: C.sub }}>none</span>}</td>
                </tr>
              ))} />
            {c.status === "On Hold" && <div className="rounded px-4 py-3 mb-3 flex items-start gap-2 text-sm" style={{ background: C.warnBg, border: `1px solid ${C.warn}33` }}>
              <Info size={16} style={{ color: C.warn, marginTop: 2 }} /><div><b style={{ color: C.warn }}>On Hold — not lost.</b> The de-install is billed and locked. The owed reinstall sits in the Pending Reinstalls queue with a <b>Reminder at 30 days</b>, and the unit carries a Reinstall-Owed flag — so it can't be forgotten or duplicated.</div></div>}
          </>
        )}
      </div>
    </div>
  );
}

/* ════════ Units ════════ */
function UnitList({ onOpen }) {
  const [acct, setAcct] = useState("Acme Ready Mix");
  const units = ACCT_UNITS(acct);
  return (
    <div className="rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: C.iconAsset }}><Package size={16} color="#fff" /></div>
          <div><div className="text-xs" style={{ color: C.sub }}>Units (Assets)</div><div className="font-semibold text-base">Units by Account</div></div></div>
        <select value={acct} onChange={(e) => setAcct(e.target.value)} className="rounded px-2 py-1.5 text-sm" style={{ border: `1px solid ${C.border}` }}>
          {[...new Set(Object.values(UNITS).map((u) => u.acct))].map((a) => <option key={a}>{a}</option>)}
        </select>
      </div>
      <div className="px-4 py-1.5 text-xs" style={{ color: C.sub, borderBottom: `1px solid ${C.borderLt}` }}>Account-scoped — only {acct}'s units are shown.</div>
      <table className="w-full text-sm"><thead><tr style={{ color: C.sub }} className="text-xs">{["Unit Id", "Serial", "Truck", "Version", "Modules", "Mode", "Open WOLI"].map((h) => <th key={h} className="text-left font-medium px-3 py-2" style={{ borderBottom: `1px solid ${C.borderLt}` }}>{h}</th>)}</tr></thead>
        <tbody>{units.map((u) => (
          <tr key={u.id} onClick={() => onOpen(u.id)} className="cursor-pointer hover:bg-[#F3F9FE]" style={{ borderBottom: `1px solid ${C.borderLt}` }}>
            <td className="px-3 py-2.5" style={{ color: C.link, fontWeight: 500 }}>{u.id}</td><td className="px-3 py-2.5">{u.serial}</td><td className="px-3 py-2.5">{u.truck}</td>
            <td className="px-3 py-2.5">{u.ver}</td><td className="px-3 py-2.5">{u.mod}</td><td className="px-3 py-2.5"><Status s={u.mode === "Active" ? "In Progress" : "Awaiting Trucks"} /></td>
            <td className="px-3 py-2.5">{u.openWoli ? <span className="flex items-center gap-1 text-xs" style={{ color: C.warn }}><Lock size={12} /> {u.openWoli}</span> : <span className="text-xs" style={{ color: C.sub }}>none</span>}</td>
          </tr>))}</tbody></table>
    </div>
  );
}
function UnitRecord({ u, onBack, onCase }) {
  return (
    <div>
      <button onClick={onBack} className="text-xs mb-2 flex items-center gap-1" style={{ color: C.link }}><ChevronLeft size={13} /> Units</button>
      <ThemeBand icon={C.iconAsset} eyebrow="Asset · Unit" title={u.id}
        fields={[["Account", u.acct, true], ["Truck", u.truck], ["Version", u.ver], ["Mode", u.mode]]} actions={<Btn sm>Edit</Btn>} />
      <div className="mt-3">
        {u.openWoli && <div className="rounded px-4 py-2.5 mb-3 flex items-center gap-2 text-sm" style={{ background: C.warnBg, border: `1px solid ${C.warn}33` }}>
          <Lock size={15} style={{ color: C.warn }} /><span>This unit already has an open WOLI (<b>{u.openWoli}</b>) on Case <button className="underline" style={{ color: C.link }} onClick={() => onCase(u.openCase)}>{u.openCase}</button>. A new movement can't be started for it — duplicates are blocked here.</span></div>}
        <Section title="Integration Details" collapsible>
          <TwoCol rows={[["First Commissioned", u.firstComm], ["Payer Number", u.payer], ["Last Commissioned", u.lastComm], ["Sold To", u.soldTo],
            ["Truck Decommission Date", u.history.find((h) => h[1].includes("De-install")) ? u.history.find((h) => h[1].includes("De-install"))[0] : ""], ["Contract Group", u.contract],
            ["Unit Removal Date", ""], ["Truck Mode", u.mode], ["Truck Number", u.truck], ["Modules", u.mod], ["Unit Id", u.id], ["Type", u.type], ["Serial Number", u.serial]]} />
        </Section>
        <RelatedList title={`Movement History (${u.history.length})`} columns={["Date", "Event", "Result"]}
          rows={u.history.map((h, i) => <tr key={i} style={{ borderTop: `1px solid ${C.borderLt}` }}><td className="px-3 py-2.5">{h[0]}</td><td className="px-3 py-2.5">{h[1]}</td><td className="px-3 py-2.5" style={{ color: C.sub }}>{h[2]}</td></tr>)}
          footer="Full lifecycle stays on the unit — the next person sees everything that ever happened to it." />
      </div>
    </div>
  );
}

/* ════════ GUIDED WALKTHROUGH (restyled, On Hold, reminder) ════════ */
function Guided({ flash, onUnit }) {
  const [phase, setPhase] = useState("pick"); // pick | create | run
  const [intent, setIntent] = useState("Transfer (Another Truck)");
  return phase === "pick" ? <GPick onPick={(k) => setPhase(k === "ordering" ? "order" : "create")} setPhase={setPhase} />
    : phase === "create" ? <GCreate intent={intent} setIntent={setIntent} flash={flash} onSave={() => setPhase("run")} onCancel={() => setPhase("pick")} />
      : phase === "order" ? <GOrdering flash={flash} onRestart={() => setPhase("pick")} />
        : <GRun intent={intent} flash={flash} onUnit={onUnit} onRestart={() => setPhase("pick")} />;
}
const Legend = () => <div className="flex flex-wrap gap-4 text-[11px]" style={{ color: C.sub }}>
  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: C.link }} /> Your action</span>
  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: "#fff", border: `1px solid ${C.border}` }} /> Other role / system (context)</span>
</div>;
const Caption = ({ see, doText, you }) => <div className="rounded px-3 py-2 mb-3" style={{ background: C.infoBg, border: `1px solid ${C.link}22` }}>
  <div className="flex items-start gap-2 text-xs mb-1"><Eye size={13} color={C.link} className="mt-0.5" /><span><b style={{ color: C.linkDk }}>You're seeing:</b> {see}</span></div>
  <div className="flex items-start gap-2 text-xs"><MousePointerClick size={13} color={you ? C.link : C.sub} className="mt-0.5" /><span><b style={{ color: you ? C.link : C.sub }}>Your move:</b> {doText}</span></div>
</div>;

function GPick({ onPick }) {
  const fake = ["Account Configuration", "Annual Planning", "Mixes / Slumps", "Reporting / Data", "SBM Case", "SCC Case", "Service Case", "Settings / Code", "Ticketing", "Software Releases"];
  return <div className="rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}>
    <div className="px-4 py-3 text-base font-semibold" style={{ borderBottom: `1px solid ${C.border}` }}>New Case</div>
    <div className="px-4 py-3">
      <div className="mb-3"><Legend /></div>
      <p className="text-xs mb-3" style={{ color: C.sub }}>Two record types are live in this demo; the rest are greyed and not clickable.</p>
      {fake.map((f) => <label key={f} className="flex items-center gap-2 py-1.5 opacity-35"><span className="w-4 h-4 rounded-full border" style={{ borderColor: C.sub }} /><span className="text-sm">{f}</span></label>)}
      {[["movement", "Unit Movement", "Move, remove, or reinstall an existing unit"], ["ordering", "New Unit Ordering → New Install", "Order parts for a brand-new install (read-only)"]].map(([k, n, d]) => (
        <button key={k} onClick={() => onPick(k)} className="flex items-start gap-2 py-2.5 w-full text-left rounded px-2 mt-1 hover:bg-[#F3F9FE]">
          <span className="w-4 h-4 rounded-full border-2 mt-0.5" style={{ borderColor: C.link }} />
          <span><span className="text-sm font-semibold">{n}</span><span className="block text-xs" style={{ color: C.sub }}>{d}</span></span></button>
      ))}
    </div>
    <div className="px-4 py-3 flex justify-end gap-2" style={{ borderTop: `1px solid ${C.border}`, background: "#FAFAF9" }}><Btn sm>Cancel</Btn><Btn sm brand>Next</Btn></div>
  </div>;
}

function GCreate({ intent, setIntent, flash, onSave, onCancel }) {
  const [acct, setAcct] = useState("Acme Ready Mix");
  const [picked, setPicked] = useState(["U-25101AA001"]);
  const units = ACCT_UNITS(acct);
  const wolis = { "Transfer (Another Truck)": ["Deinstall", "Reinstall"], "Transfer to Another Account": ["Deinstall", "Reinstall"], "Deinstall – Return to Verifi": ["Deinstall"], "Deinstall – Keep at Account": ["Deinstall"], "Reinstall Only": ["Reinstall"] }[intent];
  const toggle = (u) => { if (u.openWoli) return flash(`Blocked: ${u.id} already has an open WOLI on ${u.openCase}.`, "err"); setPicked((p) => p.includes(u.id) ? p.filter((x) => x !== u.id) : [...p, u.id]); };
  return <div className="rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}>
    <div className="px-4 py-3 text-base font-semibold flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>New Case · Unit Movement <Tag c={C.linkDk}>one screen</Tag></div>
    <div className="px-4 py-3">
      <Legend />
      <Caption you see="The single create screen. Intent is the first choice — it decides which WOLIs get generated." doText="Pick the intent (radio) and the account's units, then Save." />
      <div className="text-xs mb-1 font-medium" style={{ color: C.sub }}>1 · Movement Intent — choose like a record type</div>
      <div className="grid md:grid-cols-2 gap-1 mb-3">
        {Object.keys(wolis ? { "Transfer (Another Truck)": 0, "Transfer to Another Account": 0, "Deinstall – Return to Verifi": 0, "Deinstall – Keep at Account": 0, "Reinstall Only": 0 } : {}).map((k) => (
          <button key={k} onClick={() => setIntent(k)} className="flex items-center gap-2 py-1.5 px-2 rounded text-left hover:bg-[#F3F9FE]">
            <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: intent === k ? C.link : C.border }}>{intent === k && <span className="w-2 h-2 rounded-full" style={{ background: C.link }} />}</span>
            <span className="text-sm">{k}</span></button>
        ))}
      </div>
      <div className="text-xs mb-3" style={{ color: C.link }}>→ spawns {wolis.map((w) => `1 ${w}`).join(" + ")} per unit{intent.includes("Return") ? " · Finance gate first" : ""}</div>

      <div className="grid md:grid-cols-2 gap-4 mb-3">
        <div><div className="text-xs mb-1 font-medium" style={{ color: C.sub }}>2 · Account</div>
          <select value={acct} onChange={(e) => { setAcct(e.target.value); setPicked([]); }} className="w-full rounded px-2 py-1.5 text-sm" style={{ border: `1px solid ${C.border}` }}>{[...new Set(Object.values(UNITS).map((u) => u.acct))].map((a) => <option key={a}>{a}</option>)}</select></div>
      </div>
      <div className="text-xs mb-1 font-medium" style={{ color: C.sub }}>3 · Add Units <span style={{ fontWeight: 400 }}>— only {acct}'s units are shown · max 20</span></div>
      {units.length === 0 && <div className="text-xs py-3" style={{ color: C.sub }}>No movable units on this account in the demo.</div>}
      {units.map((u) => { const on = picked.includes(u.id), blk = !!u.openWoli; return (
        <button key={u.id} onClick={() => toggle(u)} className="flex items-center justify-between rounded px-3 py-2 mb-1 w-full text-left" style={{ border: `1px solid ${blk ? "#F3C9C0" : on ? C.link : C.border}`, background: blk ? C.errBg : on ? "#F3F9FE" : "#fff" }}>
          <span><span className="text-sm font-medium" style={{ color: C.link }}>{u.id}</span><span className="block text-xs" style={{ color: C.sub }}>Truck {u.truck} · {u.ver} {u.mod}</span></span>
          {blk ? <span className="flex items-center gap-1 text-xs" style={{ color: C.err }}><Lock size={12} /> open WOLI on {u.openCase}</span> : on ? <CheckCircle2 size={15} color={C.link} /> : <Plus size={14} color={C.sub} />}</button>); })}
      {wolis.includes("Reinstall") && <div className="rounded px-3 py-2 mt-2 text-xs flex items-start gap-2" style={{ background: C.warnBg, color: C.warn }}><Info size={13} className="mt-0.5" />Know the new truck #? You can stamp it now — but knowing ≠ ready. The reinstall stays On Hold until someone Activates it.</div>}
    </div>
    <div className="px-4 py-3 flex justify-end gap-2" style={{ borderTop: `1px solid ${C.border}`, background: "#FAFAF9" }}>
      <Btn sm onClick={onCancel}>Cancel</Btn><Btn sm brand onClick={() => { flash(`Case created · ${picked.length} unit(s)`); onSave(); }}>Save & generate WOLIs</Btn></div>
  </div>;
}

function GRun({ intent, flash, onRestart }) {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [activated, setActivated] = useState(false);
  const [approved, setApproved] = useState(false);
  const [modal, setModal] = useState(null);
  const isReturn = intent.includes("Return");
  const hasRe = !intent.includes("Return") && intent !== "Deinstall – Keep at Account";

  const base = (status, woStatus) => ({
    id: "00005099", rtype: isReturn ? "Unit Movement" : "Unit Movement", icon: C.iconCase, intent, subject: intent,
    account: "Acme Ready Mix", status, owner: "J. Rivera", created: "today", priority: "Medium", origin: "Phone",
    wolis: isReturn ? [W("WOLI-5901", "Deinstall", "U-25101AA001", "201", woStatus.d, "deinstall", done ? "De-install Return (Verifi) — Billable: Yes" : "pending work", done)]
      : [W("WOLI-5901", "Deinstall", "U-25101AA001", "201", woStatus.d, "deinstall", done ? "De-install (Verifi) — Billable: Yes" : "pending work", done),
      ...(hasRe ? [W("WOLI-5902", "Reinstall", "U-25101AA001", activated ? "314" : "—", woStatus.r, "reinstall", "pending work", false)] : [])],
    files: isReturn ? ["deinstall", "returnOrder"] : ["deinstall", "reinstall", "commission"],
  });

  const transfer = [
    { short: "Created", you: false, see: "Your new case as a real record — generated WOLIs and the right attached guides.", doText: "Read, then Next.", node: <CaseMini c={base("In Progress", { d: "Ready to Dispatch", r: "On Hold" })} /> },
    { short: "Dispatch", you: true, see: "The de-install WOLI ready to pick up. The On Hold reinstall isn't dispatchable yet.", doText: "Start the de-install (blue = your action).",
      node: <div><CaseMini c={base("In Progress", { d: "Ready to Dispatch", r: "On Hold" })} /><div className="mt-2"><Btn brand onClick={() => { flash("Assigned to you."); setIdx(2); }}>Start de-install WOLI</Btn></div></div> },
    { short: "Checklist", you: true, see: "The FST app — the checklist for this WOLI's type & version.", doText: "Open it and sign off; that marks the work complete.",
      node: <Phone><Status s={done ? "Work Complete" : "Ready to Dispatch"} /><div className="text-sm font-semibold mt-2">De-install · U-25101AA001</div><div className="text-xs" style={{ color: C.sub }}>Truck 201 · Acme Ready Mix · V5</div>{done ? <div className="mt-3 flex items-center gap-1 text-sm" style={{ color: C.ok }}><CheckCircle2 size={15} /> Signed off</div> : <button onClick={() => setModal("cl")} className="w-full mt-3 rounded py-2 text-sm font-semibold text-white" style={{ background: C.link }}>Open V5 De-install checklist</button>}</Phone> },
    { short: "Handoffs", you: false, see: "What fires automatically on Work Complete.", doText: "Read, then Next.", node: <Handoffs /> },
    ...(hasRe ? [{ short: "On Hold", you: false, see: "The case goes On Hold (off active lists). The owed reinstall can't be lost or duplicated.", doText: "Read, then Next.",
      node: <div><CaseMini c={base("On Hold", { d: "Billed", r: "On Hold" })} /><div className="rounded px-4 py-3 mt-2 flex items-start gap-2 text-sm" style={{ background: C.warnBg, border: `1px solid ${C.warn}33` }}><Info size={15} style={{ color: C.warn, marginTop: 2 }} /><div><b style={{ color: C.warn }}>On Hold.</b> Lives in the Pending Reinstalls queue + a Reinstall-Owed flag on the unit/account + a <b>reminder at 30 days</b>.</div></div></div> },
    { short: "Reopen", you: true, see: "The On Hold reinstall, internally and in the customer portal.", doText: "Mark the truck ready — internally, or the customer can from the portal.",
      node: <div><CaseMini c={base(activated ? "In Progress" : "On Hold", { d: "Billed", r: activated ? "Activated" : "On Hold" })} />
        <div className="grid md:grid-cols-2 gap-3 mt-2">
          <div className="rounded p-3" style={{ border: `1px solid ${C.border}` }}><div className="text-xs font-semibold mb-2" style={{ color: C.sub }}>Internal — FSM / CSM</div>{activated ? <Status s="Activated" /> : <Btn brand onClick={() => setModal("rd")}>Mark truck ready</Btn>}</div>
          <div className="rounded p-3" style={{ border: `1px solid ${C.border}` }}><div className="text-xs font-semibold mb-2" style={{ color: C.sub }}>Customer — Portal</div>{activated ? <span className="text-sm" style={{ color: C.ok }}>✓ Team notified</span> : <button onClick={() => setModal("rd")} className="rounded px-3 py-1.5 text-sm text-white font-medium" style={{ background: C.link }}>My new truck is ready</button>}</div>
        </div></div> }] : []),
    { short: "Close", you: false, see: "All WOLIs done → the case rolls up to Closed.", doText: "Done.", node: <CaseMini c={base("Closed", { d: "Billed", r: "Billed" })} /> },
  ];
  const returnSteps = [
    { short: "Held", you: false, see: "Created but HELD for Finance — depreciation must be agreed before any work.", doText: "Field team waits; Finance approves (their action, shown in white).",
      node: <div><CaseMini c={base("Pending Finance", { d: "Pending Finance" })} /><div className="rounded p-3 mt-2" style={{ border: `1px solid ${C.border}` }}><div className="text-xs mb-2" style={{ color: C.sub }}>First Commissioned 3/19/2024 · field team sees “work can't start yet.”</div><div className="flex items-center gap-2"><Btn onClick={() => { setApproved(true); flash("Finance approved — Return Order created."); }}>{approved ? "Approved ✓" : "Approve (Finance)"}</Btn><span className="text-xs flex items-center gap-1" style={{ color: C.sub }}><Mail size={12} /> dual-notify: button + email</span></div></div></div> },
    { short: "RO chain", you: false, see: "The return chain — the billing gap, handled.", doText: "Read; your part (de-install) is highlighted.",
      node: <div className="rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}>{[["Finance approves depreciation", "Finance", 0], ["Return Order auto-created", "System", 0], ["FST performs de-install", "FST", 1], ["Supply Chain confirms parts received", "Supply Chain", 0], ["Unit removed in Hub (data flow)", "Hub", 0]].map((r, i, a) => <div key={i} className="flex items-center gap-3 px-4 py-2.5" style={{ background: r[2] ? C.infoBg : "transparent", borderBottom: i < a.length - 1 ? `1px solid ${C.borderLt}` : "none" }}><span className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center" style={{ background: r[2] ? C.link : C.neutralBg, color: r[2] ? "#fff" : C.sub }}>{i + 1}</span><span className="flex-1 text-sm" style={{ fontWeight: r[2] ? 600 : 400 }}>{r[0]}</span><Tag c={r[2] ? C.link : C.neutral}>{r[1]}</Tag></div>)}</div> },
    { short: "De-install", you: true, see: "The FST app — the de-install checklist for the return.", doText: "Open and sign off.",
      node: <Phone><Status s={done ? "Work Complete" : "Ready to Dispatch"} /><div className="text-sm font-semibold mt-2">De-install (Return) · U-25101AA001</div><div className="text-xs" style={{ color: C.sub }}>Truck 201 · V5</div>{done ? <div className="mt-3 flex items-center gap-1 text-sm" style={{ color: C.ok }}><CheckCircle2 size={15} /> Signed off</div> : <button onClick={() => setModal("cl")} className="w-full mt-3 rounded py-2 text-sm font-semibold text-white" style={{ background: C.link }}>Open checklist</button>}</Phone> },
    { short: "Unit gone", you: false, see: "The unit disappears from the account — but the record must not.", doText: "Read carefully — this is what broke the old case.",
      node: <div><div className="rounded px-4 py-3 mb-3 flex items-start gap-2 text-sm" style={{ background: C.errBg, border: `1px solid ${C.err}33` }}><AlertTriangle size={16} style={{ color: C.err, marginTop: 2 }} /><div><b style={{ color: C.err }}>Unit disappears, record survives.</b> The data flow removes the unit; the live Asset is gone. Because the WOLI is stamped (Unit ID, TCG, Truck) at creation, the case/WOLI persists — you keep the bill + history. Same for over-ordered returns.</div></div><CaseMini c={base("In Progress", { d: "Billed" })} /></div> },
    { short: "Close", you: false, see: "Closed; the returned unit's history stays intact.", doText: "Done.", node: <CaseMini c={base("Closed", { d: "Billed" })} /> },
  ];
  const steps = isReturn ? returnSteps : transfer;
  const last = steps.length - 1, s = steps[idx];

  return <div>
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-semibold" style={{ color: C.sub }}>Guided · {intent} · step {idx + 1}/{steps.length}</span>
      <button onClick={onRestart} className="text-xs" style={{ color: C.link }}>↺ Start over</button>
    </div>
    <div className="flex gap-1 mb-3 flex-wrap">{steps.map((st, i) => { const on = i === idx, dn = i < idx; return (
      <button key={i} onClick={() => setIdx(i)} className="flex items-center gap-1.5 rounded px-2 py-1 text-[11px]" style={{ background: on ? C.link : dn ? C.okBg : "#fff", color: on ? "#fff" : dn ? C.ok : C.sub, border: `1px solid ${on ? C.link : C.border}`, fontWeight: on ? 600 : 500 }}>
        <span className="w-4 h-4 rounded-full text-[9px] flex items-center justify-center" style={{ background: on ? "rgba(255,255,255,.3)" : dn ? C.ok : C.neutralBg, color: on ? "#fff" : dn ? "#fff" : C.sub }}>{dn ? "✓" : i + 1}</span>{st.short}{st.you && <span style={{ color: on ? "#fff" : C.link }}>•</span>}</button>); })}</div>
    <Legend />
    <div className="mt-2"><Caption see={s.see} doText={s.doText} you={s.you} />{s.node}</div>
    <div className="flex items-center justify-between mt-4">
      <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} className="flex items-center gap-1 rounded text-sm px-3 py-1.5" style={{ border: `1px solid ${C.border}`, color: idx === 0 ? "#C9C7C5" : C.link }}><ChevronLeft size={14} /> Back</button>
      {idx < last ? <Btn brand onClick={() => setIdx(idx + 1)}>Next step ›</Btn> : <span className="text-sm flex items-center gap-1" style={{ color: C.ok }}><CheckCircle2 size={16} /> End of walkthrough</span>}
    </div>
    {modal === "cl" && <ChecklistModal onClose={() => setModal(null)} onDone={() => { setDone(true); setModal(null); flash("Checklist signed off — Work Complete."); setIdx((i) => Math.min(last, i + 1)); }} />}
    {modal === "rd" && <ReadyModal onClose={() => setModal(null)} onDone={(t) => { setActivated(true); setModal(null); flash(`Truck ${t} ready — reinstall Activated & auto-assigned.`); }} />}
  </div>;
}
/* compact case render reused in guided */
function CaseMini({ c }) {
  return <div>
    <ThemeBand icon={c.icon} eyebrow={`${c.rtype} Case`} title={c.id} fields={[["Account", c.account, true], ["Status", c.status], ["Intent", c.intent]]} actions={<Btn sm>Edit</Btn>} />
    <RelatedList title={`Work Order Line Items (${c.wolis.length})`} columns={["WOLI", "Type", "Unit", "Truck", "Status", "Billable line"]}
      rows={c.wolis.map((w) => <tr key={w.id} style={{ borderTop: `1px solid ${C.borderLt}` }}><td className="px-3 py-2.5" style={{ color: C.link, fontWeight: 500 }}>{w.id}</td><td className="px-3 py-2.5">{w.type}</td><td className="px-3 py-2.5" style={{ color: C.link }}>{w.unit}</td><td className="px-3 py-2.5">{w.truck}</td><td className="px-3 py-2.5"><Status s={w.status} /></td><td className="px-3 py-2.5 text-xs" style={{ color: w.billed ? C.ok : C.sub }}>{w.billable}</td></tr>)} />
    <FilesRelated files={c.files} />
  </div>;
}
function Handoffs() {
  return <div className="rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}><div className="px-4 py-2.5 text-sm font-semibold" style={{ borderBottom: `1px solid ${C.border}` }}>Fires automatically on Work Complete</div>
    {[[Building2, "Send to Command Center", "fires on completion · CC items TBD (docs for now)"], [Package, "Send to SAP / Jim", "asset moved → auto-email now; auto-push later"], [FileText, "CSM billing review queued", "did we / didn't we + which line. No dollars on the case."]].map(([I, t, d], i, a) => <div key={i} className="flex items-start gap-3 px-4 py-2.5" style={{ borderBottom: i < a.length - 1 ? `1px solid ${C.borderLt}` : "none" }}><I size={17} color={C.link} className="mt-0.5" /><div><span className="text-sm font-medium">{t}</span><span className="block text-xs" style={{ color: C.sub }}>{d}</span></div><CheckCircle2 size={15} color={C.ok} className="ml-auto mt-0.5" /></div>)}</div>;
}
function Phone({ children }) {
  return <div className="mx-auto" style={{ width: 310 }}>
    <div className="text-center text-xs mb-1" style={{ color: C.sub }}><Smartphone size={12} className="inline mr-1" />What the FST sees</div>
    <div className="rounded-[24px] p-2" style={{ background: "#1d1d1f" }}><div className="rounded-[18px] overflow-hidden" style={{ background: "#fff", minHeight: 360 }}>
      <div className="text-white text-xs px-4 py-2" style={{ background: C.topBar }}>Verifi Field Service</div><div className="p-3">{children}</div></div></div></div>;
}

/* ════════ Ordering → New Install (guided) ════════ */
function GOrdering({ flash, onRestart }) {
  const [idx, setIdx] = useState(0);
  const [conf, setConf] = useState(false);
  const [done, setDone] = useState(false);
  const [modal, setModal] = useState(null);
  const installCase = (status) => ({ id: "00006099", rtype: "New Install", icon: C.iconInstall, intent: "New Install", account: "Initech Materials", status, owner: "M. Singh",
    wolis: [W("WOLI-6091", "Install", "U-25210CC101", conf ? "301" : "—", conf ? (done ? "Work Complete" : "Activated") : "Awaiting Trucks", "install", "pending work", false), W("WOLI-6092", "Install", "U-25210CC102", conf ? "302" : "—", conf ? "Activated" : "Awaiting Trucks", "install", "pending work", false)], files: ["install", "testing"] });
  const steps = [
    { short: "Order", you: false, see: "A submitted New Unit Order (read-only). You receive installs from this — you don't fill it.", doText: "Just read. Ordering parts is what starts the install.",
      node: <div className="rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}><div className="px-4 py-2.5 text-sm font-semibold flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>New Unit Ordering — submitted <Tag>read-only</Tag></div><div className="px-4 py-2"><TwoCol rows={[["Order Date", "6/02/2026"], ["Customer Account", "Initech Materials", true], ["Ordered By", "Sample Installer"], ["Desired Install Start", "6/20/2026"], ["Delivery Address", "100 Sample Rd"], ["measurement (Base v5)", "2"], ["temperate water", "2"], ["in-cab displays", "2"]]} /></div></div> },
    { short: "Parts → Units", you: false, see: "Parts ship → unit IDs created → Hub creates the unit → it flows into SF with no truck yet.", doText: "Read, then Next.",
      node: <div className="rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}>{[[Package, "Supply Chain ships parts"], [Plus, "Unit IDs generated — one per unit, no truck"], [Building2, "Hub creates the unit numbers"], [ArrowRight, "Data flow → SF Assets (truck empty)"]].map(([I, t], i, a) => <div key={i} className="flex items-center gap-3 px-4 py-2.5" style={{ borderBottom: i < a.length - 1 ? `1px solid ${C.borderLt}` : "none" }}><I size={17} color={C.link} /><span className="text-sm">{t}</span></div>)}</div> },
    { short: "Auto case", you: false, see: "Because you ordered parts, the New Install case is auto-created — one Install WOLI per unit.", doText: "Read — this is the New Install case (billed differently than a reinstall).",
      node: <CaseMini c={installCase("Awaiting Trucks")} /> },
    { short: "Confirm trucks", you: true, see: "Incoming units waiting on trucks — inside the New Install case.", doText: "Confirm trucks as they arrive; that activates the Install WOLIs (built into this flow).",
      node: <div className="rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}><div className="px-4 py-2.5 text-sm font-semibold" style={{ borderBottom: `1px solid ${C.border}` }}>Confirm trucks as they arrive</div>{["U-25210CC101", "U-25210CC102"].map((u, i) => <div key={u} className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `1px solid ${C.borderLt}` }}><span className="text-sm">{u} · V5</span>{conf ? <span className="text-xs flex items-center gap-1" style={{ color: C.ok }}><CheckCircle2 size={13} /> Truck {30 + i}1 → Activated</span> : <Btn sm brand onClick={() => { setConf(true); flash("Trucks confirmed — Install WOLIs activated."); }}>Confirm truck</Btn>}</div>)}</div> },
    { short: "Install", you: true, see: "The FST app — the install checklist (V5).", doText: "Open and sign off.",
      node: <Phone><Status s={done ? "Work Complete" : "Activated"} /><div className="text-sm font-semibold mt-2">New Install · U-25210CC101</div><div className="text-xs" style={{ color: C.sub }}>Truck 301 · Initech Materials · V5</div>{done ? <div className="mt-3 flex items-center gap-1 text-sm" style={{ color: C.ok }}><CheckCircle2 size={15} /> Signed off</div> : <button onClick={() => setModal("cl")} className="w-full mt-3 rounded py-2 text-sm font-semibold text-white" style={{ background: C.link }}>Open V5 Install checklist</button>}</Phone> },
    { short: "Complete", you: false, see: "On completion the install routes to Jim for IO-closure paperwork; the usual handoffs fire.", doText: "Read, then Next.",
      node: <div className="rounded-lg" style={{ background: C.card, border: `1px solid ${C.border}` }}>{[[Package, "Routes to Jim — IO closure paperwork", "Jim finishes & passes back"], [Building2, "Send to Command Center", "documentation for now"], [FileText, "CSM billing review queued", "Install (billed differently) — Billable? Y/N. No $."]].map(([I, t, d], i, a) => <div key={i} className="flex items-start gap-3 px-4 py-2.5" style={{ borderBottom: i < a.length - 1 ? `1px solid ${C.borderLt}` : "none" }}><I size={17} color={C.link} className="mt-0.5" /><div><span className="text-sm font-medium">{t}</span><span className="block text-xs" style={{ color: C.sub }}>{d}</span></div></div>)}</div> },
    { short: "Close", you: false, see: "Install WOLIs closed → case closes; units now live on their trucks with full history.", doText: "Done.", node: <CaseMini c={installCase("Closed")} /> },
  ];
  const last = steps.length - 1, s = steps[idx];
  return <div>
    <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold" style={{ color: C.sub }}>New Unit Ordering → New Install · step {idx + 1}/{steps.length}</span><button onClick={onRestart} className="text-xs" style={{ color: C.link }}>↺ Start over</button></div>
    <div className="flex gap-1 mb-3 flex-wrap">{steps.map((st, i) => { const on = i === idx, dn = i < idx; return <button key={i} onClick={() => setIdx(i)} className="flex items-center gap-1.5 rounded px-2 py-1 text-[11px]" style={{ background: on ? C.link : dn ? C.okBg : "#fff", color: on ? "#fff" : dn ? C.ok : C.sub, border: `1px solid ${on ? C.link : C.border}`, fontWeight: on ? 600 : 500 }}><span className="w-4 h-4 rounded-full text-[9px] flex items-center justify-center" style={{ background: on ? "rgba(255,255,255,.3)" : dn ? C.ok : C.neutralBg, color: on ? "#fff" : dn ? "#fff" : C.sub }}>{dn ? "✓" : i + 1}</span>{st.short}{st.you && <span style={{ color: on ? "#fff" : C.link }}>•</span>}</button>; })}</div>
    <Legend /><div className="mt-2"><Caption see={s.see} doText={s.doText} you={s.you} />{s.node}</div>
    <div className="flex items-center justify-between mt-4"><button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} className="flex items-center gap-1 rounded text-sm px-3 py-1.5" style={{ border: `1px solid ${C.border}`, color: idx === 0 ? "#C9C7C5" : C.link }}><ChevronLeft size={14} /> Back</button>{idx < last ? <Btn brand onClick={() => setIdx(idx + 1)}>Next step ›</Btn> : <span className="text-sm flex items-center gap-1" style={{ color: C.ok }}><CheckCircle2 size={16} /> End</span>}</div>
    {modal === "cl" && <ChecklistModal install onClose={() => setModal(null)} onDone={() => { setDone(true); setModal(null); flash("Install checklist signed off."); setIdx((i) => Math.min(last, i + 1)); }} />}
  </div>;
}

/* ════════ modals ════════ */
function ChecklistModal({ onClose, onDone, install }) {
  const items = install ? ["Air OK / no leaks", "Hydraulics leak-free", ">5 satellites", "Cellular & backend connected", "Commissioning done", "Docs complete"] : ["System powered down safely", "Unit removed from truck", "Components bagged & labeled", "Truck wiring capped", "Photos taken"];
  const [c, setC] = useState(items.map(() => true));
  return <Overlay title={`${install ? "V5 Install" : "V5 De-install"} Checklist`} onClose={onClose}>
    <div className="rounded px-3 py-2 mb-3 text-xs flex items-start gap-2" style={{ background: C.warnBg, color: C.warn }}><Info size={13} className="mt-0.5" />Placeholder items — FSM to assign the real checklist (by WOLI type + version).</div>
    {items.map((it, i) => <label key={it} className="flex items-center gap-2 py-1.5 text-sm"><input type="checkbox" checked={c[i]} onChange={() => setC((p) => p.map((v, j) => j === i ? !v : v))} /> {it}</label>)}
    <div className="grid grid-cols-2 gap-3 mt-2"><div><div className="text-xs mb-1" style={{ color: C.sub }}>Sign-off (initials)</div><input defaultValue="MR" className="w-full rounded px-2 py-1.5 text-sm" style={{ border: `1px solid ${C.border}` }} /></div><div><div className="text-xs mb-1" style={{ color: C.sub }}>Comments</div><input className="w-full rounded px-2 py-1.5 text-sm" style={{ border: `1px solid ${C.border}` }} placeholder="Optional" /></div></div>
    <div className="flex justify-end gap-2 mt-3"><Btn sm onClick={onClose}>Cancel</Btn><Btn sm brand onClick={onDone}>Sign off & complete</Btn></div>
  </Overlay>;
}
function ReadyModal({ onClose, onDone }) {
  const [t, setT] = useState("");
  return <Overlay title="Mark truck ready" onClose={onClose}>
    <div className="text-xs mb-1" style={{ color: C.sub }}>New truck number</div>
    <input autoFocus value={t} onChange={(e) => setT(e.target.value)} placeholder="e.g. 314" className="w-full rounded px-2 py-1.5 text-sm mb-2" style={{ border: `1px solid ${C.border}` }} />
    <p className="text-xs mb-3" style={{ color: C.sub }}>On save: stamps the truck, lifts the hold, sets the reinstall to Activated, auto-assigns the FST.</p>
    <div className="flex justify-end gap-2"><Btn sm onClick={onClose}>Cancel</Btn><Btn sm brand onClick={() => t.trim() && onDone(t.trim())}>Activate reinstall</Btn></div>
  </Overlay>;
}
function Overlay({ title, onClose, children }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.4)" }}>
    <div className="rounded-lg w-full max-w-md" style={{ background: "#fff", maxHeight: "90vh", overflow: "auto" }}>
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white" style={{ borderBottom: `1px solid ${C.border}` }}><span className="font-semibold">{title}</span><button onClick={onClose}><X size={18} color={C.sub} /></button></div>
      <div className="px-4 py-3">{children}</div></div></div>;
}
