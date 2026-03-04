import { useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   X MARBLES TRADING LLC — Operations Platform v2.1
   Deploy via Netlify · All modules · PDF/Excel export
   ═══════════════════════════════════════════════════════════════ */

// ── Tokens ────────────────────────────────────────────────────
const C = {
  bg:"#09090b", surface:"#111113", card:"#18181b", cardHover:"#1f1f23",
  border:"#27272a", borderLight:"#3f3f46",
  gold:"#d4a843", goldLight:"#f0cc7a", goldDim:"#7a5f28", goldBg:"#d4a84312",
  text:"#fafaf9", textMuted:"#a1a1aa", textDim:"#52525b",
  green:"#4ade80", greenBg:"#4ade8012",
  red:"#f87171", redBg:"#f8717112",
  blue:"#60a5fa", blueBg:"#60a5fa12",
  amber:"#fb923c", amberBg:"#fb923c12",
  purple:"#a78bfa", purpleBg:"#a78bfa12",
  teal:"#2dd4bf", tealBg:"#2dd4bf12",
};

const fmt = (n, d=0) => Number(n||0).toLocaleString("en-AE", {minimumFractionDigits:d, maximumFractionDigits:d});
const fmtAED = (n, d=0) => `AED ${fmt(n,d)}`;
const todayStr = () => new Date().toLocaleDateString("en-AE", {day:"2-digit",month:"short",year:"numeric"});
const newQuoteNo = () => `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random()*8000)+1000)}`;

// ── Stone visual map ──────────────────────────────────────────
const SC = {
  "Absolute Black":{bg:"#141416",vein:"#333",txt:"#444"},
  "Galaxy Black":{bg:"#0d0d12",vein:"#2a2a4a",txt:"#4a4a6a"},
  "Kashmir White":{bg:"#e5e1da",vein:"#c5c1b8",txt:"#888"},
  "Bianco Carrara":{bg:"#dbd7cf",vein:"#b8b4ac",txt:"#999"},
  "Calacatta Gold":{bg:"#e6dab8",vein:"#c8a030",txt:"#a07828"},
  "Calacatta Viola":{bg:"#dbd0d8",vein:"#b09090",txt:"#906878"},
  "Statuario":{bg:"#e3e0da",vein:"#aaa",txt:"#999"},
  "Nero Marquina":{bg:"#1c1c1f",vein:"#f0f0f0",txt:"#4a4a4a"},
  "Tan Brown":{bg:"#7a5a3a",vein:"#9a7050",txt:"#b08060"},
  "Tropical Green":{bg:"#3a5040",vein:"#508050",txt:"#70a070"},
  "Turkish Travertine":{bg:"#c6b490",vein:"#a89668",txt:"#887850"},
  "Roman Travertine":{bg:"#d2c29e",vein:"#b8a880",txt:"#9a8860"},
  "Desert Gold":{bg:"#c2a658",vein:"#e0c040",txt:"#907020"},
  "Crema Marfil":{bg:"#e6d6ae",vein:"#c8b888",txt:"#b09860"},
  "Emperador Dark":{bg:"#382018",vein:"#604030",txt:"#705040"},
  "Pietra Grey":{bg:"#585860",vein:"#7a7a82",txt:"#9292a0"},
  "Fantasy Brown":{bg:"#c8b8a8",vein:"#9a8878",txt:"#787060"},
  "Blue Bahia":{bg:"#2a3868",vein:"#5878b8",txt:"#8898c8"},
  "Azul Macaubas":{bg:"#2848a8",vein:"#6888d0",txt:"#9ab8e0"},
  "Onyx Gold":{bg:"#c8a028",vein:"#e8c040",txt:"#a08010"},
};
const sc = (name) => { const k=Object.keys(SC).find(k=>name?.includes(k)); return SC[k]||{bg:"#2a2a2e",vein:"#555",txt:"#444"}; };

// ── Master Data ───────────────────────────────────────────────
const MATERIALS = [
  {id:"M01",name:"Absolute Black Granite",type:"Granite",origin:"India",cat:"Premium",fin:["Polished","Honed","Leathered","Flamed","Sandblasted"],thk:[15,18,20,25,30],sz:["240×120","260×130","280×140","300×160","Random"]},
  {id:"M02",name:"Galaxy Black Granite",type:"Granite",origin:"India",cat:"Luxury",fin:["Polished","Honed"],thk:[18,20,25,30],sz:["240×120","260×130","280×140","Random"]},
  {id:"M03",name:"Kashmir White Granite",type:"Granite",origin:"India",cat:"Mid-Range",fin:["Polished","Honed","Brushed"],thk:[15,18,20,25],sz:["180×90","200×100","240×120","Random"]},
  {id:"M04",name:"Tan Brown Granite",type:"Granite",origin:"India",cat:"Economy",fin:["Polished","Flamed"],thk:[15,18,20],sz:["180×90","240×120","Random"]},
  {id:"M05",name:"Fantasy Brown Granite",type:"Granite",origin:"India",cat:"Mid-Range",fin:["Polished","Honed","Leathered"],thk:[18,20,25],sz:["240×120","260×130","Random"]},
  {id:"M06",name:"Blue Bahia Granite",type:"Granite",origin:"Brazil",cat:"Ultra Luxury",fin:["Polished","Honed"],thk:[20,25,30],sz:["240×120","260×130","Random"]},
  {id:"M07",name:"Bianco Carrara Marble",type:"Marble",origin:"Italy",cat:"Luxury",fin:["Polished","Honed","Brushed"],thk:[15,18,20,25,30],sz:["260×130","280×140","300×160","Random"]},
  {id:"M08",name:"Calacatta Gold Marble",type:"Marble",origin:"Italy",cat:"Ultra Luxury",fin:["Polished","Honed"],thk:[18,20,25,30],sz:["260×130","280×140","300×160","Random"]},
  {id:"M09",name:"Calacatta Viola Marble",type:"Marble",origin:"Italy",cat:"Ultra Luxury",fin:["Polished","Honed"],thk:[18,20,25,30],sz:["260×130","280×140","Random"]},
  {id:"M10",name:"Statuario Marble",type:"Marble",origin:"Italy",cat:"Ultra Luxury",fin:["Polished","Honed"],thk:[18,20,25,30],sz:["260×130","280×140","300×160","Random"]},
  {id:"M11",name:"Nero Marquina Marble",type:"Marble",origin:"Spain",cat:"Premium",fin:["Polished","Honed","Brushed"],thk:[15,18,20,25],sz:["240×120","260×130","Random"]},
  {id:"M12",name:"Crema Marfil Marble",type:"Marble",origin:"Spain",cat:"Mid-Range",fin:["Polished","Honed","Tumbled"],thk:[15,18,20,25],sz:["240×120","260×130","300×160","Random"]},
  {id:"M13",name:"Emperador Dark Marble",type:"Marble",origin:"Spain",cat:"Premium",fin:["Polished","Honed"],thk:[18,20,25],sz:["240×120","260×130","Random"]},
  {id:"M14",name:"Pietra Grey Marble",type:"Marble",origin:"Iran",cat:"Premium",fin:["Polished","Honed","Brushed"],thk:[18,20,25,30],sz:["240×120","260×130","300×160","Random"]},
  {id:"M15",name:"Turkish Travertine",type:"Limestone",origin:"Turkey",cat:"Mid-Range",fin:["Honed","Filled","Tumbled","Brushed"],thk:[15,18,20,25],sz:["40×40","60×60","60×40","80×40","Random"]},
  {id:"M16",name:"Roman Travertine",type:"Limestone",origin:"Italy",cat:"Premium",fin:["Honed","Filled","Polished"],thk:[15,18,20,25,30],sz:["60×60","80×40","120×60","Random"]},
  {id:"M17",name:"Desert Gold Limestone",type:"Limestone",origin:"Egypt",cat:"Mid-Range",fin:["Honed","Sawn","Tumbled"],thk:[15,20,25,30],sz:["40×40","60×60","60×40","Random"]},
  {id:"M18",name:"Azul Macaubas Quartzite",type:"Quartzite",origin:"Brazil",cat:"Ultra Luxury",fin:["Polished","Honed","Leathered"],thk:[18,20,25,30],sz:["260×130","280×140","Random"]},
  {id:"M19",name:"Onyx Gold",type:"Onyx",origin:"Iran",cat:"Ultra Luxury",fin:["Polished"],thk:[15,18,20],sz:["200×100","240×120","Random"]},
];

const YARDS = [
  {id:"Y1",name:"Al Quoz Main Yard",city:"Dubai",country:"UAE",mgr:"Ahmed Al-Rashidi",ph:"+971 55 123 4567",area:"12,000 sqft"},
  {id:"Y2",name:"Jebel Ali Warehouse",city:"Dubai",country:"UAE",mgr:"Ramesh Kumar",ph:"+971 50 987 6543",area:"8,500 sqft"},
  {id:"Y3",name:"Sharjah Industrial",city:"Sharjah",country:"UAE",mgr:"Vijay Nair",ph:"+971 56 234 5678",area:"15,000 sqft"},
  {id:"Y4",name:"Muscat Depot",city:"Muscat",country:"Oman",mgr:"Khalid Al-Balushi",ph:"+968 99 112 233",area:"6,000 sqft"},
  {id:"Y5",name:"Doha Branch",city:"Doha",country:"Qatar",mgr:"Sunil Menon",ph:"+974 66 778 899",area:"5,000 sqft"},
];

const SHIPPING_TERMS = [
  {id:"EXW",name:"EXW – Ex Works",seller:"Nil – buyer collects",buyer:"All costs & risks",desc:"Buyer collects from seller's premises. Maximum risk to buyer.",common:false},
  {id:"FOB",name:"FOB – Free On Board",seller:"To port + loading",buyer:"Ocean freight, insurance, destination",desc:"Seller loads vessel. Risk transfers at port of loading.",common:true},
  {id:"CFR",name:"CFR – Cost & Freight",seller:"Ocean freight to destination",buyer:"Insurance + unloading",desc:"Seller pays freight to destination port. Buyer arranges insurance.",common:false},
  {id:"CIF",name:"CIF – Cost Insurance Freight",seller:"Freight + insurance to destination",buyer:"Unloading, customs, last mile",desc:"Most used in UAE stone imports. Seller covers freight and insurance.",common:true},
  {id:"DAP",name:"DAP – Delivered At Place",seller:"All except import duties",buyer:"Import duty + customs only",desc:"Seller delivers to buyer's named destination. Ideal for GCC projects.",common:true},
  {id:"DDP",name:"DDP – Delivered Duty Paid",seller:"Everything including import duty",buyer:"Nothing",desc:"Maximum cost and risk to seller. Rarely used in stone trade.",common:false},
];

const INVENTORY = [
  {id:"SL-001",matId:"M01",mat:"Absolute Black Granite",type:"Gangsaw Slab",thk:20,size:"280×140",qty:42,sqm:164.6,yard:"Y1",loc:"A3-R1",status:"Available",age:12,cost:38,sell:65,bc:"XM-2401-001",shade:"A",bnd:"BND-0441",damaged:false},
  {id:"SL-002",matId:"M07",mat:"Bianco Carrara Marble",type:"Gangsaw Slab",thk:18,size:"270×130",qty:18,sqm:63.2,yard:"Y1",loc:"B1-R2",status:"Reserved",age:8,cost:72,sell:140,bc:"XM-2401-002",shade:"B+",bnd:"BND-0442",damaged:false,res:"Emaar Towers Proj"},
  {id:"SL-003",matId:"M03",mat:"Kashmir White Granite",type:"Mini Gangsaw",thk:20,size:"180×90",qty:65,sqm:105.3,yard:"Y2",loc:"A1-R3",status:"Available",age:45,cost:28,sell:52,bc:"XM-2312-003",shade:"A",bnd:"BND-0381",damaged:false},
  {id:"SL-004",matId:"M08",mat:"Calacatta Gold Marble",type:"Gangsaw Slab",thk:20,size:"270×130",qty:8,sqm:28.1,yard:"Y1",loc:"C2-R1",status:"Available",age:5,cost:145,sell:280,bc:"XM-2402-004",shade:"A+",bnd:"BND-0461",damaged:false},
  {id:"SL-005",matId:"M04",mat:"Tan Brown Granite",type:"Tiles",thk:15,size:"60×60",qty:420,sqm:420,yard:"Y3",loc:"T1-A1",status:"Non-Moving",age:94,cost:18,sell:28,bc:"XM-2309-005",shade:"Mix",bnd:"BND-0318",damaged:false},
  {id:"SL-006",matId:"M15",mat:"Turkish Travertine",type:"Tiles",thk:18,size:"60×60",qty:280,sqm:280,yard:"Y3",loc:"T1-B2",status:"Non-Moving",age:80,cost:22,sell:38,bc:"XM-2310-006",shade:"A",bnd:"BND-0322",damaged:false},
  {id:"SL-007",matId:"M11",mat:"Nero Marquina Marble",type:"Mini Gangsaw",thk:18,size:"200×100",qty:24,sqm:48.0,yard:"Y2",loc:"B3-R2",status:"Available",age:20,cost:88,sell:170,bc:"XM-2401-007",shade:"A",bnd:"BND-0440",damaged:false},
  {id:"SL-008",matId:"M17",mat:"Desert Gold Limestone",type:"Tiles",thk:20,size:"60×40",qty:195,sqm:195,yard:"Y2",loc:"T2-C1",status:"Available",age:30,cost:25,sell:45,bc:"XM-2312-008",shade:"B",bnd:"BND-0382",damaged:false},
  {id:"SL-009",matId:"M09",mat:"Calacatta Viola Marble",type:"Gangsaw Slab",thk:20,size:"260×130",qty:12,sqm:40.6,yard:"Y1",loc:"C1-R2",status:"Available",age:3,cost:168,sell:320,bc:"XM-2403-009",shade:"A+",bnd:"BND-0471",damaged:false},
  {id:"SL-010",matId:"M14",mat:"Pietra Grey Marble",type:"Mini Gangsaw",thk:18,size:"200×100",qty:30,sqm:60.0,yard:"Y4",loc:"A1-R1",status:"Available",age:14,cost:55,sell:110,bc:"XM-2401-010",shade:"A",bnd:"BND-0443",damaged:false},
  {id:"SL-011",matId:"M10",mat:"Statuario Marble",type:"Gangsaw Slab",thk:20,size:"280×140",qty:6,sqm:23.5,yard:"Y1",loc:"D1-R1",status:"Reserved",age:2,cost:195,sell:380,bc:"XM-2403-012",shade:"A+",bnd:"BND-0472",damaged:false,res:"Aldar Palm Villa"},
  {id:"SL-012",matId:"M18",mat:"Azul Macaubas Quartzite",type:"Gangsaw Slab",thk:20,size:"260×130",qty:10,sqm:33.8,yard:"Y1",loc:"D2-R1",status:"Available",age:7,cost:220,sell:420,bc:"XM-2403-013",shade:"A",bnd:"BND-0473",damaged:false},
  {id:"SL-013",matId:"M01",mat:"Absolute Black Granite",type:"Random Slab",thk:20,size:"Random",qty:8,sqm:18.4,yard:"Y1",loc:"DMG-A1",status:"Damaged",age:15,cost:38,sell:0,bc:"XM-2401-013",shade:"A",bnd:"BND-0441",damaged:true,dmgType:"Corner crack",dmgNotes:"3 slabs corner cracks · 5 surface scratches"},
  {id:"SL-014",matId:"M07",mat:"Bianco Carrara Marble",type:"Random Slab",thk:18,size:"Random",qty:5,sqm:9.2,yard:"Y2",loc:"DMG-B1",status:"Damaged",age:22,cost:72,sell:0,bc:"XM-2401-014",shade:"B",bnd:"BND-0442",damaged:true,dmgType:"Through crack",dmgNotes:"2 full cracks — can yield risers/steps · epoxy resin recommended"},
  {id:"SL-015",matId:"M08",mat:"Calacatta Gold Marble",type:"Random Slab",thk:20,size:"Random",qty:3,sqm:5.8,yard:"Y1",loc:"DMG-C1",status:"Damaged",age:4,cost:145,sell:0,bc:"XM-2402-015",shade:"A",bnd:"BND-0461",damaged:true,dmgType:"Edge chip",dmgNotes:"Edge damage — suitable for cut tiles 30×30cm"},
];

const SHIPMENTS = [
  {id:"SH-2601",po:"PO-2601",sup:"Raj Granites, Ongole",mat:"Absolute Black Granite",thk:20,sqm:300,vessel:"MV Stone Carrier",bl:"INCHE240312",etd:"Mar 05",eta:"Mar 22",status:"In Transit",port:"Jebel Ali",yard:"Y1",val:11400,terms:"CIF"},
  {id:"SH-2602",po:"PO-2602",sup:"Quarella SpA, Verona",mat:"Bianco Carrara Marble",thk:18,sqm:120,vessel:"CMA CGM Titan",bl:"ITVCE240228",etd:"Mar 10",eta:"Apr 08",status:"Loading",port:"Jebel Ali",yard:"Y1",val:8640,terms:"FOB"},
  {id:"SH-2603",po:"PO-2603",sup:"Marmara Taş, Istanbul",mat:"Turkish Travertine",thk:20,sqm:200,vessel:"MSC Aurora",bl:"—",etd:"Mar 18",eta:"Mar 28",status:"Confirmed",port:"Jebel Ali",yard:"Y3",val:4400,terms:"CIF"},
  {id:"SH-2604",po:"PO-2604",sup:"Bhandari Marble",mat:"Calacatta Gold Marble",thk:20,sqm:60,vessel:"TBD",bl:"—",etd:"Apr 02",eta:"Apr 20",status:"PO Placed",port:"Jebel Ali",yard:"Y1",val:8700,terms:"FOB"},
  {id:"SH-2605",po:"PO-2605",sup:"Natural Stone Egypt",mat:"Desert Gold Limestone",thk:25,sqm:150,vessel:"TBD",bl:"—",etd:"Apr 10",eta:"Apr 28",status:"PO Placed",port:"Jebel Ali",yard:"Y2",val:3750,terms:"CIF"},
];

const CUSTOMERS = [
  {id:"C01",name:"Emaar Properties",city:"Dubai",type:"Developer",credit:500000,orders:12,rev:520000,last:"Mar 2026",out:84000},
  {id:"C02",name:"Damac Interiors",city:"Dubai",type:"Developer",credit:400000,orders:15,rev:410000,last:"Mar 2026",out:62000},
  {id:"C03",name:"Al Futtaim Living",city:"Dubai",type:"Contractor",credit:300000,orders:9,rev:284000,last:"Feb 2026",out:45000},
  {id:"C04",name:"Aldar Properties",city:"Abu Dhabi",type:"Developer",credit:600000,orders:7,rev:395000,last:"Mar 2026",out:120000},
  {id:"C05",name:"Gulf Stone Trading",city:"Sharjah",type:"Trader",credit:150000,orders:22,rev:168000,last:"Feb 2026",out:18000},
  {id:"C06",name:"Majid Al Futtaim",city:"Dubai",type:"Retail",credit:200000,orders:6,rev:145000,last:"Jan 2026",out:28000},
];

const SUPPLIERS = [
  {id:"S1",name:"Raj Granites",loc:"Ongole, India",rating:4.8,types:["Granite"],cur:["USD","INR"],lead:25,ontime:94},
  {id:"S2",name:"Bhandari Marble",loc:"Kishangarh, India",rating:4.5,types:["Marble"],cur:["USD","INR"],lead:30,ontime:88},
  {id:"S3",name:"Quarella SpA",loc:"Verona, Italy",rating:4.9,types:["Marble","Limestone"],cur:["EUR"],lead:45,ontime:96},
  {id:"S4",name:"Marmara Taş",loc:"Istanbul, Turkey",rating:4.3,types:["Limestone","Marble"],cur:["USD","EUR"],lead:20,ontime:85},
  {id:"S5",name:"Natural Stone Egypt",loc:"Cairo, Egypt",rating:4.1,types:["Limestone"],cur:["USD"],lead:18,ontime:82},
  {id:"S6",name:"Granitos Extremadura",loc:"Badajoz, Spain",rating:4.6,types:["Marble","Granite"],cur:["EUR"],lead:40,ontime:91},
];

const PROD_JOBS = [
  {id:"PROD-001",src:"SL-013",mat:"Absolute Black Granite",thk:20,inputSqm:18.4,output:"Steps 100×30cm",outQty:22,epoxy:0,resin:45,blade:85,labour:120,yield:78,status:"Completed",date:"2026-02-20"},
  {id:"PROD-002",src:"SL-014",mat:"Bianco Carrara Marble",thk:18,inputSqm:9.2,output:"Risers 100×20cm",outQty:18,epoxy:35,resin:28,blade:60,labour:90,yield:72,status:"In Progress",date:"2026-03-01"},
];

// ── UI Components ─────────────────────────────────────────────
const Tag = ({color=C.goldDim,text,style={}}) => (
  <span style={{background:color+"20",color,border:`1px solid ${color}40`,borderRadius:5,padding:"2px 8px",fontSize:10,fontWeight:700,letterSpacing:0.5,textTransform:"uppercase",whiteSpace:"nowrap",...style}}>{text}</span>
);

const Card = ({children,style={},onClick,hover}) => {
  const [hov,setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov&&hover?C.cardHover:C.card,border:`1px solid ${hov&&hover?C.borderLight:C.border}`,borderRadius:12,padding:20,transition:"all .15s",cursor:onClick?"pointer":"default",...style}}>
      {children}
    </div>
  );
};

const Btn = ({children,onClick,variant="primary",size="md",style={},disabled,icon}) => {
  const sz = {sm:{padding:"5px 12px",fontSize:11},md:{padding:"8px 16px",fontSize:13},lg:{padding:"11px 22px",fontSize:14}}[size];
  const v = {
    primary:{background:`linear-gradient(135deg,${C.gold},${C.goldDim})`,color:"#0a0a0a",border:"none",fontWeight:700},
    ghost:{background:"transparent",color:C.text,border:`1px solid ${C.border}`},
    danger:{background:C.redBg,color:C.red,border:`1px solid ${C.red}44`},
    success:{background:C.greenBg,color:C.green,border:`1px solid ${C.green}44`},
    blue:{background:C.blueBg,color:C.blue,border:`1px solid ${C.blue}44`},
    amber:{background:C.amberBg,color:C.amber,border:`1px solid ${C.amber}44`},
    teal:{background:C.tealBg,color:C.teal,border:`1px solid ${C.teal}44`},
  }[variant]||{};
  return (
    <button onClick={onClick} disabled={disabled}
      style={{...sz,borderRadius:8,cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",opacity:disabled?0.4:1,display:"inline-flex",alignItems:"center",gap:6,transition:"all .15s",...v,...style}}>
      {icon&&<span>{icon}</span>}{children}
    </button>
  );
};

const F = ({label,value,onChange,type="text",unit,placeholder,options,readOnly,span,rows,note}) => (
  <div style={{display:"flex",flexDirection:"column",gap:5,gridColumn:span?`span ${span}`:undefined}}>
    {label && <label style={{fontSize:11,color:C.textMuted,letterSpacing:0.5,textTransform:"uppercase",fontWeight:600}}>{label}</label>}
    {options ? (
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{background:"#0d0d0f",border:`1px solid ${C.border}`,borderRadius:8,color:C.text,padding:"9px 12px",fontSize:13,fontFamily:"inherit",outline:"none"}}>
        {options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
      </select>
    ) : rows ? (
      <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder}
        style={{background:"#0d0d0f",border:`1px solid ${C.border}`,borderRadius:8,color:C.text,padding:"9px 12px",fontSize:13,fontFamily:"inherit",outline:"none",resize:"vertical"}}/>
    ) : (
      <div style={{display:"flex"}}>
        <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} readOnly={readOnly}
          style={{background:"#0d0d0f",border:`1px solid ${C.border}`,borderRadius:unit?"8px 0 0 8px":8,color:readOnly?C.textMuted:C.text,padding:"9px 12px",fontSize:13,fontFamily:"inherit",outline:"none",width:"100%",flex:1}}/>
        {unit && <span style={{background:"#1a1a1e",border:`1px solid ${C.border}`,borderLeft:"none",borderRadius:"0 8px 8px 0",padding:"9px 10px",fontSize:11,color:C.textMuted,whiteSpace:"nowrap"}}>{unit}</span>}
      </div>
    )}
    {note && <div style={{fontSize:10,color:C.textDim}}>{note}</div>}
  </div>
);

const SH = ({title,sub,actions}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
    <div>
      <div style={{fontSize:18,fontWeight:700,color:C.text,fontFamily:"'DM Serif Display',serif"}}>{title}</div>
      {sub && <div style={{fontSize:12,color:C.textMuted,marginTop:3}}>{sub}</div>}
    </div>
    {actions && <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{actions}</div>}
  </div>
);

const Tabs = ({tabs,active,onChange}) => (
  <div style={{display:"flex",gap:3,background:C.surface,borderRadius:10,padding:4,border:`1px solid ${C.border}`,marginBottom:20,flexWrap:"wrap"}}>
    {tabs.map(t=>(
      <button key={t.id} onClick={()=>onChange(t.id)}
        style={{flex:"1 1 auto",minWidth:80,padding:"7px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:active===t.id?700:400,
          background:active===t.id?C.gold:"transparent",color:active===t.id?"#0a0a0a":C.textMuted,transition:"all .15s",whiteSpace:"nowrap"}}>
        {t.icon&&<span style={{marginRight:4}}>{t.icon}</span>}{t.label}
      </button>
    ))}
  </div>
);

const Stat = ({label,value,sub,color=C.gold,icon}) => (
  <Card>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div style={{fontSize:11,color:C.textMuted,letterSpacing:0.5,textTransform:"uppercase",fontWeight:600,lineHeight:1.4}}>{label}</div>
      {icon && <span style={{fontSize:18}}>{icon}</span>}
    </div>
    <div style={{fontSize:22,fontWeight:800,color,fontFamily:"'DM Serif Display',serif",margin:"8px 0 4px",lineHeight:1.2}}>{value}</div>
    {sub && <div style={{fontSize:11,color:C.textDim}}>{sub}</div>}
  </Card>
);

const Bar = ({pct,color=C.gold,h=5}) => (
  <div style={{background:C.border,borderRadius:99,height:h,overflow:"hidden"}}>
    <div style={{width:`${Math.min(pct||0,100)}%`,height:"100%",background:color,borderRadius:99,transition:"width 1s"}}/>
  </div>
);

const Dot = ({status}) => {
  const map = {Available:C.green,Reserved:C.gold,"Non-Moving":C.red,Damaged:C.amber,"In Transit":C.blue,Loading:C.amber,Confirmed:C.green,"PO Placed":C.purple,"In Progress":C.blue,Completed:C.green,Draft:C.textMuted};
  const c = map[status]||C.textMuted;
  return <span style={{display:"inline-flex",alignItems:"center",gap:5}}><span style={{width:7,height:7,borderRadius:"50%",background:c,display:"inline-block",flexShrink:0}}/><span style={{color:c,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>{status}</span></span>;
};

const Tbl = ({headers,rows,style={}}) => (
  <div style={{overflowX:"auto",...style}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
      <thead>
        <tr>{headers.map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",color:C.textDim,fontWeight:600,fontSize:10,letterSpacing:0.6,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap"}}>{h}</th>)}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  </div>
);
const TR = ({cells,onClick}) => (
  <tr onClick={onClick} style={{borderBottom:`1px solid ${C.border}22`,cursor:onClick?"pointer":"default"}}>
    {cells.map((c,i)=><td key={i} style={{padding:"10px 12px",whiteSpace:"nowrap",color:C.text}}>{c}</td>)}
  </tr>
);

// ── PDF Generator ─────────────────────────────────────────────
const printQuote = (proj,mat,stockItem,usePrice,reqSqm,subtotal,discAmt,afterDisc,vat,grand) => {
  const term = SHIPPING_TERMS.find(t=>t.id===proj.terms)||SHIPPING_TERMS[3];
  const qNo = newQuoteNo();
  const w = window.open("","_blank");
  if (!w) { alert("Allow popups to download PDF"); return; }
  w.document.write(`<!DOCTYPE html><html><head><title>Quotation ${qNo}</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Outfit',Arial,sans-serif;color:#1a1a1a;background:#fff;font-size:13px}
    .page{width:210mm;min-height:297mm;margin:0 auto;padding:14mm 16mm;position:relative}
    .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:14px;border-bottom:3px solid #c9a84c;margin-bottom:18px}
    .logo{font-size:30px;font-weight:900;letter-spacing:-1px}.logo span{color:#c9a84c}
    .logo-sub{font-size:9px;color:#999;letter-spacing:2px;text-transform:uppercase;margin-top:2px}
    .contact{font-size:11px;color:#777;margin-top:5px;line-height:1.6}
    .qt-box{background:#fffbf0;border:2px solid #c9a84c;border-radius:8px;padding:10px 16px;text-align:right}
    .qt-no{font-size:22px;font-weight:800;color:#c9a84c}.qt-meta{font-size:11px;color:#888;margin-top:2px}
    .two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px}
    .section-title{font-size:10px;font-weight:700;color:#c9a84c;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid #f0e8d8;padding-bottom:4px;margin-bottom:8px}
    .field{display:flex;justify-content:space-between;padding:4px 0;font-size:12px;border-bottom:1px solid #fafafa}
    .field-label{color:#888}.field-value{font-weight:600}
    .stone-bar{padding:12px 16px;border-radius:6px;margin-bottom:16px;border:1px solid #e0d8c8}
    .stone-name{font-size:18px;font-weight:700}.stone-spec{font-size:11px;color:#888;margin-top:3px}
    table{width:100%;border-collapse:collapse;margin-bottom:12px}
    th{background:#1a1a1a;color:#fff;padding:8px 12px;text-align:left;font-size:11px;letter-spacing:0.5px;text-transform:uppercase}
    td{padding:7px 12px;font-size:12px;border-bottom:1px solid #f5f5f5}
    .subtotal-row{background:#fafafa;font-weight:600}
    .grand-row{background:#1a1a1a}.grand-row td{color:#c9a84c;font-size:15px;font-weight:800;padding:10px 12px}
    .terms-box{background:#fffbf0;border-left:3px solid #c9a84c;padding:10px 14px;font-size:11px;color:#666;margin:12px 0;line-height:1.6}
    .stock-badge{display:inline-block;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700}
    .footer{border-top:1px solid #e0d8c8;padding-top:8px;display:flex;justify-content:space-between;font-size:10px;color:#aaa;margin-top:20px}
    .sig-line{border-bottom:1px solid #999;width:180px;margin-top:30px;margin-bottom:4px}
    @media print{.page{margin:0;padding:14mm 16mm}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style></head><body><div class="page">
  <div class="header">
    <div>
      <div class="logo">X<span>Marbles</span></div>
      <div class="logo-sub">Trading LLC · Dubai, UAE</div>
      <div class="contact">Tel: +971 4 XXX XXXX &nbsp;·&nbsp; info@xmarbles.ae &nbsp;·&nbsp; www.xmarbles.ae<br>TRN: 100XXXXXXXXX3 &nbsp;·&nbsp; Al Quoz Industrial Area, Dubai</div>
    </div>
    <div class="qt-box">
      <div class="qt-no">QUOTATION</div>
      <div class="qt-meta">${qNo}</div>
      <div class="qt-meta">${todayStr()}</div>
      <div class="qt-meta">Valid: ${proj.validDays||15} days</div>
    </div>
  </div>
  <div class="two-col">
    <div>
      <div class="section-title">Quotation To</div>
      <div style="font-size:16px;font-weight:700;margin-bottom:4px">${proj.client||"To Whom It May Concern"}</div>
      <div style="font-size:12px;color:#666">${proj.project||"—"}</div>
      <div style="font-size:12px;color:#666;margin-top:4px">Application: ${proj.zone}</div>
    </div>
    <div>
      <div class="section-title">Shipping Terms</div>
      <div style="font-weight:700;font-size:14px;color:#c9a84c;margin-bottom:4px">${term.name}</div>
      <div style="font-size:11px;color:#777;line-height:1.5">${term.desc}</div>
      <div style="font-size:11px;color:#555;margin-top:4px"><strong>Seller covers:</strong> ${term.seller}</div>
    </div>
  </div>
  <div class="section-title">Material & Pricing</div>
  <div class="stone-bar" style="background:${sc(mat?.name).bg}">
    <div class="stone-name" style="color:${sc(mat?.name).vein}">${mat?.name}</div>
    <div class="stone-spec">${mat?.type} &nbsp;·&nbsp; Origin: ${mat?.origin} &nbsp;·&nbsp; ${proj.thk}mm &nbsp;·&nbsp; ${proj.fin} &nbsp;·&nbsp; Shade: ${proj.shade} &nbsp;·&nbsp; ${mat?.cat}</div>
  </div>
  <table>
    <tr><th>Description</th><th>Net Area</th><th>Wastage</th><th>Supply Qty</th><th>Unit Price</th><th>Amount (AED)</th></tr>
    <tr>
      <td>${mat?.name} – ${proj.thk}mm ${proj.fin}<br><small style="color:#888">${proj.size} · Shade ${proj.shade}</small></td>
      <td>${proj.area} sqm</td><td>${proj.wastage}%</td>
      <td><strong>${reqSqm.toFixed(1)} sqm</strong></td>
      <td>AED ${fmt(usePrice,2)}</td>
      <td><strong>AED ${fmt(subtotal)}</strong></td>
    </tr>
    ${proj.discount>0?`<tr class="subtotal-row"><td colspan="5" style="text-align:right">Discount (${proj.discount}%)</td><td style="color:#dc2626">– AED ${fmt(discAmt)}</td></tr>`:""}
    <tr class="subtotal-row"><td colspan="5" style="text-align:right">Subtotal after Discount</td><td>AED ${fmt(afterDisc)}</td></tr>
    <tr class="subtotal-row"><td colspan="5" style="text-align:right">UAE VAT @ 5%</td><td>AED ${fmt(vat)}</td></tr>
    <tr class="grand-row"><td colspan="5" style="text-align:right;color:#fff">GRAND TOTAL</td><td>AED ${fmt(grand)}</td></tr>
  </table>
  <div style="margin-bottom:12px">
    <span class="stock-badge" style="background:${stockItem?.sqm>=reqSqm?"#dcfce7":"#fee2e2"};color:${stockItem?.sqm>=reqSqm?"#16a34a":"#dc2626"}">
      ${stockItem?.sqm>=reqSqm?`✓ Stock Available: ${fmt(stockItem?.sqm)} sqm in yard`:`⚠ Stock Shortfall – Order Placement Required`}
    </span>
  </div>
  <div class="terms-box">
    <strong>Payment:</strong> 50% advance with order · 50% prior to dispatch &nbsp;|&nbsp;
    <strong>Validity:</strong> ${proj.validDays||15} days from quotation date &nbsp;|&nbsp;
    <strong>Delivery:</strong> Subject to stock availability — lead time confirmed at order<br>
    <em>Natural stone exhibits inherent variations in colour, veining and texture. Physical samples recommended for large-scale projects.</em>
  </div>
  ${proj.notes?`<div style="font-size:12px;color:#555;margin-bottom:12px"><strong>Notes:</strong> ${proj.notes}</div>`:""}
  <div style="display:flex;justify-content:space-between;margin-top:24px">
    <div><div class="sig-line"></div><div style="font-size:11px;color:#888">Prepared by / Sales Executive</div></div>
    <div><div class="sig-line"></div><div style="font-size:11px;color:#888">Authorised Signatory</div></div>
    <div><div class="sig-line"></div><div style="font-size:11px;color:#888">Client Acceptance</div></div>
  </div>
  <div class="footer"><div>X Marbles Trading LLC · Al Quoz, Dubai, UAE</div><div>${qNo} · ${todayStr()}</div><div>Page 1 of 1</div></div>
  </div><script>window.onload=()=>{window.print();window.close();}</script></body></html>`);
  w.document.close();
};

const exportCSV = (data, filename) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [headers,...data.map(r=>headers.map(h=>`"${String(r[h]??'').replace(/"/g,'""')}"`))]
    .map(r=>r.join(",")).join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8,"+encodeURIComponent(csv);
  a.download = filename+".csv";
  a.click();
};

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════
function Dashboard() {
  const inv = INVENTORY.filter(i=>!i.damaged);
  const totalCost = inv.reduce((s,i)=>s+i.sqm*i.cost,0);
  const totalSell = inv.reduce((s,i)=>s+i.sqm*i.sell,0);
  const nonMov = INVENTORY.filter(i=>i.status==="Non-Moving");
  const damaged = INVENTORY.filter(i=>i.damaged);
  const incomSqm = SHIPMENTS.reduce((s,sh)=>s+sh.sqm,0);
  const topMargin = [...inv].sort((a,b)=>((b.sell-b.cost)/b.sell)-((a.sell-a.cost)/a.sell)).slice(0,3);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10}}>
        <Stat icon="💰" label="Stock Cost Value" value={`AED ${fmt(totalCost/1000)}K`} sub={`${fmt(inv.reduce((s,i)=>s+i.sqm,0))} sqm`} color={C.gold}/>
        <Stat icon="📈" label="Potential Revenue" value={`AED ${fmt(totalSell/1000)}K`} sub={`Margin AED ${fmt((totalSell-totalCost)/1000)}K`} color={C.green}/>
        <Stat icon="🚢" label="Incoming" value={`${fmt(incomSqm)} sqm`} sub={`${SHIPMENTS.length} shipments`} color={C.blue}/>
        <Stat icon="⚠️" label="Non-Moving" value={`${nonMov.length} SKUs`} sub={`${fmt(nonMov.reduce((s,i)=>s+i.sqm,0))} sqm`} color={C.red}/>
        <Stat icon="🔨" label="Damaged Stock" value={`${damaged.length} slabs`} sub={`${fmt(damaged.reduce((s,i)=>s+i.sqm,0))} sqm → Production`} color={C.amber}/>
        <Stat icon="🤝" label="Customers" value={`${CUSTOMERS.length} active`} sub={`AED ${fmt(CUSTOMERS.reduce((s,c)=>s+c.rev,0)/1000)}K YTD`} color={C.purple}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:14}}>
        <Card>
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:14}}>Yard-wise Stock Overview</div>
          {YARDS.map(y=>{
            const items = INVENTORY.filter(i=>i.yard===y.id);
            const sqm = items.reduce((s,i)=>s+i.sqm,0);
            const val = items.reduce((s,i)=>s+i.sqm*(i.sell||i.cost),0);
            const dmg = items.filter(i=>i.damaged).length;
            return (
              <div key={y.id} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <div>
                    <span style={{fontSize:12,color:C.text,fontWeight:600}}>{y.name}</span>
                    <span style={{fontSize:10,color:C.textMuted,marginLeft:8}}>{y.city}, {y.country}</span>
                    {dmg>0&&<span style={{fontSize:10,color:C.amber,marginLeft:8}}>⚠ {dmg} damaged</span>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <span style={{fontSize:12,color:C.gold,fontWeight:600}}>{fmt(sqm)} sqm</span>
                    <span style={{fontSize:11,color:C.textDim,marginLeft:8}}>AED {fmt(val/1000)}K</span>
                  </div>
                </div>
                <Bar pct={(sqm/1200)*100} color={sqm>800?C.red:sqm>500?C.amber:C.green}/>
              </div>
            );
          })}
        </Card>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12}}>Stock Aging</div>
            {[["0–30d",i=>i.age<=30,C.green],["31–60d",i=>i.age>30&&i.age<=60,C.amber],["61–90d",i=>i.age>60&&i.age<=90,C.red],[">90d",i=>i.age>90,"#ff4040"]].map(([l,fn,c])=>{
              const cnt = INVENTORY.filter(fn).length;
              return (
                <div key={l} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:11,color:C.textMuted}}>{l}</span>
                    <span style={{fontSize:11,color:c,fontWeight:700}}>{cnt} SKUs</span>
                  </div>
                  <Bar pct={(cnt/INVENTORY.length)*100} color={c}/>
                </div>
              );
            })}
          </Card>
          <Card style={{background:"linear-gradient(160deg,#1a1600,#18181b)",border:`1px solid ${C.goldDim}`}}>
            <div style={{fontSize:11,color:C.goldDim,fontWeight:700,letterSpacing:0.7,textTransform:"uppercase",marginBottom:10}}>⭐ Top Margin SKUs</div>
            {topMargin.map((item,i)=>{
              const mg = ((item.sell-item.cost)/item.sell*100).toFixed(0);
              return (
                <div key={item.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<2?`1px solid ${C.border}`:"none"}}>
                  <div>
                    <div style={{fontSize:12,color:C.text,fontWeight:500}}>{item.mat}</div>
                    <div style={{fontSize:10,color:C.textDim}}>{item.thk}mm · {item.type}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:14,fontWeight:700,color:C.gold}}>{mg}%</div>
                    <div style={{fontSize:10,color:C.textDim}}>AED {item.sell}/m²</div>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      <Card>
        <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12}}>Incoming Shipments</div>
        <Tbl headers={["Shipment","Material","Thickness","Sqm","Vessel","ETA","Terms","Yard","Status","Value"]}
          rows={SHIPMENTS.map(sh=>{
            
            return <TR key={sh.id} cells={[
              <Tag color={C.gold} text={sh.id}/>, sh.mat, `${sh.thk}mm`, sh.sqm+" sqm", sh.vessel,
              <span style={{color:C.blue,fontWeight:600}}>{sh.eta}</span>,
              <Tag color={C.teal} text={sh.terms}/>,
              YARDS.find(y=>y.id===sh.yard)?.name.split(" ")[0],
              <Dot status={sh.status}/>,
              <span style={{color:C.gold,fontWeight:600}}>AED {fmt(sh.val)}</span>
            ]}/>;
          })}/>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card>
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12}}>Customer Credit Utilization</div>
          {CUSTOMERS.map(c=>{
            const util = (c.out/c.credit)*100;
            return (
              <div key={c.id} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,color:C.text}}>{c.name}</span>
                  <span style={{fontSize:12,color:util>80?C.red:util>50?C.amber:C.green,fontWeight:600}}>AED {fmt(c.out)}</span>
                </div>
                <Bar pct={util} color={util>80?C.red:util>50?C.amber:C.green}/>
              </div>
            );
          })}
        </Card>
        <Card>
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12}}>🌍 Country-wise Stock (Director View)</div>
          {["UAE","Oman","Qatar"].map(country=>{
            const ys = YARDS.filter(y=>y.country===country);
            const sqm = INVENTORY.filter(i=>ys.find(y=>y.id===i.yard)).reduce((s,i)=>s+i.sqm,0);
            const val = INVENTORY.filter(i=>ys.find(y=>y.id===i.yard)).reduce((s,i)=>s+i.sqm*(i.sell||i.cost),0);
            return (
              <div key={country} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.border}22`}}>
                <div style={{fontSize:22}}>{country==="UAE"?"🇦🇪":country==="Oman"?"🇴🇲":"🇶🇦"}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.text}}>{country}</div>
                  <div style={{fontSize:11,color:C.textMuted}}>{ys.length} yard(s)</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.gold}}>{fmt(sqm)} sqm</div>
                  <div style={{fontSize:12,color:C.green}}>AED {fmt(val/1000)}K</div>
                </div>
              </div>
            );
          })}
          <div style={{marginTop:12,padding:"8px 12px",background:C.goldBg,borderRadius:7,fontSize:11,color:C.goldDim,border:`1px solid ${C.goldDim}44`}}>
            📊 Full analytics after BUSY bridge integration
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROCUREMENT
// ═══════════════════════════════════════════════════════════════
function Procurement() {
  const [tab,setTab] = useState("lc");
  const [lines,setLines] = useState([
    {id:1,matId:"M01",mat:"Absolute Black Granite",thk:20,size:"280×140",fin:"Polished",qty:200,fob:38,margin:30},
    {id:2,matId:"M07",mat:"Bianco Carrara Marble",thk:18,size:"270×130",fin:"Polished",qty:100,fob:72,margin:35},
  ]);
  const [fixed,setFixed] = useState({terms:"CIF",cur:"USD",rate:3.672,freight:1800,insurance:0.3,duty:5,handling:450,storage:0,inspection:0,vat:5});

  const calc = (l) => {
    const fobAed = l.fob * fixed.rate;
    const totalQty = lines.reduce((s,x)=>s+x.qty,1);
    const freightPer = (fixed.freight / totalQty) * fixed.rate;
    const insPer = ((fobAed + freightPer) * fixed.insurance) / 100;
    const cif = fobAed + freightPer + insPer;
    const customs = (cif * fixed.duty) / 100;
    const handPer = fixed.handling / l.qty;
    const storePer = (fixed.storage||0) / l.qty;
    const inspPer = (fixed.inspection||0) / l.qty;
    const landed = cif + customs + handPer + storePer + inspPer;
    const vatAmt = (landed * fixed.vat) / 100;
    const total = landed + vatAmt;
    const sell = total * (1 + l.margin/100);
    return {fobAed,freightPer,insPer,cif,customs,handPer,landed,vatAmt,total,sell};
  };

  const addLine = () => setLines(p=>[...p,{id:Date.now(),matId:"M01",mat:"Absolute Black Granite",thk:20,size:"280×140",fin:"Polished",qty:100,fob:38,margin:30}]);
  const updL = (id,k,v) => setLines(p=>p.map(l=>l.id===id?{...l,[k]:v}:l));
  const remL = (id) => setLines(p=>p.filter(l=>l.id!==id));

  const termInfo = SHIPPING_TERMS.find(t=>t.id===fixed.terms)||SHIPPING_TERMS[3];

  const doExport = () => {
    exportCSV(lines.map(l=>{
      const c = calc(l);
      return {Material:l.mat,Thickness:l.thk+"mm",Size:l.size,Finish:l.fin,"Qty(sqm)":l.qty,
        [`FOB(${fixed.cur})/sqm`]:l.fob,"FOB(AED)":fmt(c.fobAed,2),"Freight/sqm":fmt(c.freightPer,2),
        "Ins/sqm":fmt(c.insPer,2),"CIF(AED)":fmt(c.cif,2),"Customs":fmt(c.customs,2),
        "Landed":fmt(c.landed,2),"VAT":fmt(c.vatAmt,2),"Total Landed+VAT":fmt(c.total,2),
        "Sell Price":fmt(c.sell,2),"Margin%":l.margin,"Terms":fixed.terms};
    }),"LandedCostCalc");
  };

  return (
    <div>
      <SH title="Procurement Desk" sub="Landed cost calculator · Multi-material shipments · Shipping terms integration"/>
      <Tabs tabs={[{id:"lc",label:"Landed Cost",icon:"🧮"},{id:"compare",label:"Quote Compare",icon:"📊"},{id:"terms",label:"Incoterms",icon:"🚢"},{id:"pos",label:"Purchase Orders",icon:"📋"},{id:"suppliers",label:"Suppliers",icon:"🏭"}]} active={tab} onChange={setTab}/>

      {tab==="lc" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card style={{background:"linear-gradient(135deg,#16140a,#18181b)",border:`1px solid ${C.goldDim}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:700,color:C.gold}}>Shipment Parameters — All Lines</div>
              <div style={{display:"flex",gap:8}}>
                <Btn size="sm" variant="amber" onClick={doExport} icon="↓">Export Excel</Btn>
                <Btn size="sm" variant="primary" onClick={addLine} icon="＋">Add Material</Btn>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:10}}>
              <F label="Incoterms" value={fixed.terms} onChange={v=>setFixed({...fixed,terms:v})} options={SHIPPING_TERMS.map(t=>({value:t.id,label:t.id}))}/>
              <F label="Currency" value={fixed.cur} onChange={v=>setFixed({...fixed,cur:v})} options={[{value:"USD",label:"USD"},{value:"EUR",label:"EUR"},{value:"INR",label:"INR"}]}/>
              <F label="Exchange Rate" value={fixed.rate} onChange={v=>setFixed({...fixed,rate:+v})} type="number" unit="AED"/>
              <F label="Ocean Freight" value={fixed.freight} onChange={v=>setFixed({...fixed,freight:+v})} type="number" unit="USD" note="Per container"/>
              <F label="Insurance" value={fixed.insurance} onChange={v=>setFixed({...fixed,insurance:+v})} type="number" unit="%"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
              <F label="Customs Duty" value={fixed.duty} onChange={v=>setFixed({...fixed,duty:+v})} type="number" unit="%"/>
              <F label="Port+Handling" value={fixed.handling} onChange={v=>setFixed({...fixed,handling:+v})} type="number" unit="AED"/>
              <F label="Storage" value={fixed.storage||0} onChange={v=>setFixed({...fixed,storage:+v})} type="number" unit="AED" note="If applicable"/>
              <F label="Inspection Fee" value={fixed.inspection||0} onChange={v=>setFixed({...fixed,inspection:+v})} type="number" unit="AED"/>
              <F label="UAE VAT" value={fixed.vat} onChange={v=>setFixed({...fixed,vat:+v})} type="number" unit="%"/>
            </div>
            <div style={{marginTop:10,padding:"8px 14px",background:C.goldBg,borderRadius:8,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
              <Tag color={C.gold} text={termInfo.id}/>
              <span style={{fontSize:12,color:C.textMuted}}><strong style={{color:C.goldLight}}>{termInfo.name}</strong> — {termInfo.desc}</span>
              <span style={{fontSize:11,color:C.textDim,marginLeft:"auto"}}>Seller: <strong style={{color:C.text}}>{termInfo.seller}</strong></span>
            </div>
          </Card>

          {lines.map((line,idx)=>{
            const m = MATERIALS.find(x=>x.id===line.matId)||MATERIALS[0];
            const c = calc(line);
            const sColor = sc(line.mat);
            return (
              <Card key={line.id}>
                <div style={{display:"flex",gap:14}}>
                  <div style={{width:68,minWidth:68,borderRadius:8,background:sColor.bg,border:`1px solid ${C.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:6}}>
                    <span style={{fontSize:7,color:sColor.txt,textTransform:"uppercase",letterSpacing:0.5,textAlign:"center"}}>LINE {idx+1}</span>
                    <span style={{fontSize:12,color:sColor.vein,fontWeight:700}}>{line.thk}mm</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                      <div style={{fontSize:13,fontWeight:700,color:C.goldLight}}>{line.mat} · {line.fin}</div>
                      {lines.length>1&&<Btn size="sm" variant="danger" onClick={()=>remL(line.id)}>✕</Btn>}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8,marginBottom:12}}>
                      <F label="Material" value={line.matId} onChange={v=>{const m=MATERIALS.find(x=>x.id===v);updL(line.id,"matId",v);if(m){updL(line.id,"mat",m.name);updL(line.id,"thk",m.thk[0]);updL(line.id,"fin",m.fin[0]);}}} options={MATERIALS.map(m=>({value:m.id,label:m.name}))}/>
                      <F label="Thickness" value={line.thk} onChange={v=>updL(line.id,"thk",+v)} options={m.thk.map(t=>({value:t,label:t+"mm"}))}/>
                      <F label="Size" value={line.size} onChange={v=>updL(line.id,"size",v)} options={m.sz.map(s=>({value:s,label:s==="Random"?s:s+"cm"}))}/>
                      <F label="Finish" value={line.fin} onChange={v=>updL(line.id,"fin",v)} options={m.fin.map(f=>({value:f,label:f}))}/>
                      <F label="Quantity" value={line.qty} onChange={v=>updL(line.id,"qty",+v)} type="number" unit="sqm"/>
                      <F label={`FOB (${fixed.cur})`} value={line.fob} onChange={v=>updL(line.id,"fob",+v)} type="number"/>
                      <F label="Margin %" value={line.margin} onChange={v=>updL(line.id,"margin",+v)} type="number" unit="%"/>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(9,1fr)",gap:5,background:"#0d0d0f",borderRadius:8,padding:"10px 12px"}}>
                      {[["FOB/m²",`AED ${fmt(c.fobAed,2)}`],["Freight",`AED ${fmt(c.freightPer,2)}`],["Insurance",`AED ${fmt(c.insPer,2)}`],["CIF",`AED ${fmt(c.cif,2)}`,C.gold],["Customs",`AED ${fmt(c.customs,2)}`],["Handling",`AED ${fmt(c.handPer,2)}`],["Landed",`AED ${fmt(c.landed,2)}`,C.goldLight],["VAT 5%",`AED ${fmt(c.vatAmt,2)}`],["Sell Price",`AED ${fmt(c.sell,2)}`,C.green]].map(([l,v,col])=>(
                        <div key={l} style={{textAlign:"center"}}>
                          <div style={{fontSize:8,color:C.textDim,textTransform:"uppercase",letterSpacing:0.3}}>{l}</div>
                          <div style={{fontSize:11,fontWeight:700,color:col||C.text,marginTop:2}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {lines.length>1 && (
            <Card style={{background:"linear-gradient(160deg,#0e1a0e,#18181b)",border:`1px solid ${C.green}44`}}>
              <div style={{fontSize:13,fontWeight:700,color:C.green,marginBottom:12}}>Combined Shipment · {fixed.terms}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10}}>
                {[["Lines",lines.length,C.text],["Total Sqm",fmt(lines.reduce((s,l)=>s+l.qty,0))+" m²",C.text],["Total FOB",fmtAED(lines.reduce((s,l)=>s+l.fob*fixed.rate*l.qty,0)),C.gold],["Landed+VAT",fmtAED(lines.reduce((s,l)=>s+calc(l).total*l.qty,0)),C.goldLight],["Revenue",fmtAED(lines.reduce((s,l)=>s+calc(l).sell*l.qty,0)),C.green],["Profit",fmtAED(lines.reduce((s,l)=>s+(calc(l).sell-calc(l).total)*l.qty,0)),C.teal]].map(([l,v,c])=>(
                  <div key={l} style={{textAlign:"center",background:C.card,borderRadius:8,padding:"10px 6px"}}>
                    <div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",marginBottom:3}}>{l}</div>
                    <div style={{fontSize:15,fontWeight:700,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {tab==="terms" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {SHIPPING_TERMS.map(t=>(
            <Card key={t.id} hover style={{borderLeft:`3px solid ${t.common?C.gold:C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div>
                  <Tag color={t.common?C.gold:C.textMuted} text={t.id}/>
                  <div style={{fontSize:15,fontWeight:700,color:C.text,marginTop:6}}>{t.name}</div>
                </div>
                {t.common && <Tag color={C.gold} text="Common in UAE"/>}
              </div>
              <div style={{fontSize:12,color:C.textMuted,marginBottom:12}}>{t.desc}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div style={{background:C.greenBg,borderRadius:7,padding:"8px 10px"}}>
                  <div style={{fontSize:9,color:C.green,fontWeight:700,marginBottom:3,textTransform:"uppercase"}}>Seller Covers</div>
                  <div style={{fontSize:11,color:C.text}}>{t.seller}</div>
                </div>
                <div style={{background:C.redBg,borderRadius:7,padding:"8px 10px"}}>
                  <div style={{fontSize:9,color:C.red,fontWeight:700,marginBottom:3,textTransform:"uppercase"}}>Buyer Covers</div>
                  <div style={{fontSize:11,color:C.text}}>{t.buyer}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab==="compare" && (()=>{
        const CDATA = [
          {mat:"Absolute Black Granite",type:"Granite",thk:"20mm",fin:"Polished",quotes:[
            {sup:"Raj Granites",loc:"Ongole, India",fob:38,terms:"FOB",lead:25,rating:4.8,ontime:94,moq:100,shade:"A",remark:"Consistent quality · Regular supplier · Best bulk rate",rec:true},
            {sup:"Bhandari Marble",loc:"Kishangarh, India",fob:42,terms:"FOB",lead:30,rating:4.3,ontime:85,moq:80,shade:"A+",remark:"Premium shade A+ · Slightly higher · Good for luxury projects",rec:false},
            {sup:"Granitos Extremadura",loc:"Spain",fob:51,terms:"DAP",lead:42,rating:4.6,ontime:91,moq:50,shade:"A",remark:"DAP included — no freight surprise · Slower lead time",rec:false},
          ]},
          {mat:"Bianco Carrara Marble",type:"Marble",thk:"18mm",fin:"Polished",quotes:[
            {sup:"Quarella SpA",loc:"Verona, Italy",fob:72,terms:"CIF",lead:45,rating:4.9,ontime:96,moq:60,shade:"B+",remark:"Best Italian quality · CIF to Jebel Ali · Top choice for Emaar",rec:true},
            {sup:"Granitos Extremadura",loc:"Spain",fob:68,terms:"FOB",lead:40,rating:4.6,ontime:91,moq:50,shade:"A",remark:"Spanish equivalent · Lower price · Add freight separately",rec:false},
            {sup:"Marmara Tas",loc:"Turkey",fob:58,terms:"FOB",lead:22,rating:4.3,ontime:85,moq:40,shade:"B",remark:"Budget option · Shade B — not for ultra-luxury · Fast lead",rec:false},
          ]},
          {mat:"Calacatta Gold Marble",type:"Marble",thk:"20mm",fin:"Polished",quotes:[
            {sup:"Quarella SpA",loc:"Verona, Italy",fob:145,terms:"CIF",lead:45,rating:4.9,ontime:96,moq:30,shade:"A+",remark:"Authentic Calacatta · Only reliable A+ source · No compromise",rec:true},
            {sup:"Bhandari Marble",loc:"Kishangarh, India",fob:118,terms:"FOB",lead:30,rating:4.3,ontime:85,moq:25,shade:"A",remark:"Indian equivalent — not true Calacatta · Lower price",rec:false},
          ]},
          {mat:"Turkish Travertine",type:"Limestone",thk:"20mm",fin:"Honed/Filled",quotes:[
            {sup:"Marmara Tas",loc:"Istanbul, Turkey",fob:22,terms:"FOB",lead:20,rating:4.3,ontime:85,moq:200,shade:"A",remark:"Direct quarry source · Best market price · Consistent fill",rec:true},
            {sup:"Natural Stone Egypt",loc:"Cairo, Egypt",fob:20,terms:"FOB",lead:18,rating:4.1,ontime:82,moq:150,shade:"B",remark:"Cheapest but shade B · Good for outdoor/back-of-house only",rec:false},
          ]},
          {mat:"Azul Macaubas Quartzite",type:"Quartzite",thk:"20mm",fin:"Polished",quotes:[
            {sup:"Brazil Stone Co.",loc:"Sao Paulo, Brazil",fob:220,terms:"CIF",lead:55,rating:4.7,ontime:88,moq:20,shade:"A+",remark:"Exclusive source · Long lead · Book 8 weeks ahead for large projects",rec:true},
          ]},
        ];
        const [selMat,setSelMat] = useState(CDATA[0].mat);
        const group = CDATA.find(g=>g.mat===selMat)||CDATA[0];
        const prices = group.quotes.map(q=>q.fob);
        const minP = Math.min(...prices), maxP = Math.max(...prices);
        const typeColor = {Granite:C.gold,Marble:C.blue,Limestone:C.amber,Quartzite:C.teal}[group.type]||C.textMuted;
        const sColor = sc(group.mat);
        return (
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {CDATA.map(g=>{
                const tc={Granite:C.gold,Marble:C.blue,Limestone:C.amber,Quartzite:C.teal}[g.type]||C.textMuted;
                const active=g.mat===selMat;
                return (<button key={g.mat} onClick={()=>setSelMat(g.mat)} style={{padding:"7px 13px",borderRadius:10,border:`1px solid ${active?tc:C.border}`,cursor:"pointer",background:active?tc+"22":C.card,color:active?tc:C.textMuted,fontSize:11,fontFamily:"inherit",fontWeight:active?700:400,display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:9,height:9,borderRadius:2,background:sc(g.mat).bg,border:`1px solid ${sc(g.mat).vein}`,flexShrink:0}}/>{g.mat.split(" ").slice(0,2).join(" ")} {g.thk}
                </button>);
              })}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:16,padding:"14px 18px",background:sColor.bg,borderRadius:12,border:`1px solid ${C.border}`}}>
              <div style={{flex:1}}>
                <div style={{fontSize:18,fontWeight:700,color:sColor.vein,fontFamily:"'DM Serif Display',serif"}}>{group.mat}</div>
                <div style={{fontSize:11,color:sColor.txt,marginTop:3}}>{group.thk} · {group.fin} · {group.quotes.length} supplier quote{group.quotes.length>1?"s":""} compared</div>
              </div>
              <Tag color={typeColor} text={group.type}/>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:10,color:sColor.txt,textTransform:"uppercase",letterSpacing:0.5}}>Price range</div>
                <div style={{fontSize:16,fontWeight:800,color:sColor.vein}}>${minP}{minP!==maxP?` – $${maxP}`:""}<span style={{fontSize:10,fontWeight:400}}>/sqm FOB</span></div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {group.quotes.map((q,i)=>{
                const pctBar=maxP===minP?100:Math.round(((q.fob-minP)/(maxP-minP))*100);
                const isBest=q.fob===minP, isMost=q.fob===maxP;
                return (
                  <Card key={i} style={{border:`1px solid ${q.rec?C.gold+"66":C.border}`,background:q.rec?"linear-gradient(135deg,#16140a,#18181b)":C.card}}>
                    <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                      <div style={{width:38,minWidth:38,height:38,borderRadius:10,background:q.rec?C.gold:C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:q.rec?"#0a0a0a":C.textDim,flexShrink:0}}>{i+1}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,flexWrap:"wrap",gap:6}}>
                          <div>
                            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                              <span style={{fontSize:14,fontWeight:700,color:C.text}}>{q.sup}</span>
                              {q.rec&&<Tag color={C.gold} text="Recommended"/>}
                              {isBest&&!q.rec&&<Tag color={C.green} text="Best Price"/>}
                            </div>
                            <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{q.loc}</div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontSize:22,fontWeight:800,color:isBest?C.green:isMost?C.red:C.gold,fontFamily:"'DM Serif Display',serif"}}>${q.fob}<span style={{fontSize:11,fontWeight:400,color:C.textMuted}}>/sqm</span></div>
                            <div style={{fontSize:10,color:C.textDim}}>AED {fmt(q.fob*3.672,2)}/sqm</div>
                          </div>
                        </div>
                        <div style={{marginBottom:10}}>
                          <div style={{background:C.border,borderRadius:99,height:6,overflow:"hidden"}}>
                            <div style={{width:`${Math.max(pctBar,8)}%`,height:"100%",background:isBest?C.green:isMost?C.red:C.gold,borderRadius:99}}/>
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",marginTop:3,fontSize:9,color:C.textDim}}>
                            <span>Cheapest ${minP}</span><span>Most expensive ${maxP}</span>
                          </div>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6,marginBottom:10}}>
                          {[["Terms",<Tag key="t" color={C.teal} text={q.terms}/>],["Lead",q.lead+"d"],["MOQ",q.moq+" m²"],["Shade",q.shade],["Rating","★ "+q.rating],["On-Time",q.ontime+"%"]].map(([l,v])=>(
                            <div key={l} style={{background:"#0d0d0f",borderRadius:6,padding:"5px 8px",textAlign:"center"}}>
                              <div style={{fontSize:8,color:C.textDim,textTransform:"uppercase",marginBottom:2}}>{l}</div>
                              <div style={{fontSize:11,fontWeight:600,color:C.text}}>{v}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{padding:"7px 12px",background:q.rec?C.goldBg:C.border+"22",borderRadius:7,borderLeft:`3px solid ${q.rec?C.gold:C.borderLight}`,fontSize:11,color:q.rec?C.goldLight:C.textMuted,lineHeight:1.5}}>
                          💬 {q.remark}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            <Card style={{padding:0}}>
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,fontSize:12,fontWeight:700,color:C.text}}>Side-by-Side Summary · {group.mat}</div>
              <Tbl headers={["Supplier","FOB/sqm","AED/sqm","Terms","Lead","MOQ","Shade","Rating","On-Time","Remark"]}
                rows={group.quotes.map((q,i)=>(
                  <TR key={i} cells={[
                    <span style={{fontWeight:700,color:q.rec?C.gold:C.text}}>{q.sup}{q.rec?" ★":""}</span>,
                    <span style={{color:q.fob===minP?C.green:q.fob===maxP?C.red:C.gold,fontWeight:700}}>${q.fob}</span>,
                    <span style={{color:C.textMuted}}>AED {fmt(q.fob*3.672,2)}</span>,
                    <Tag color={C.teal} text={q.terms}/>,
                    q.lead+"d", q.moq+" m²",
                    <Tag color={q.shade==="A+"?C.purple:C.gold} text={q.shade}/>,
                    <span style={{color:C.gold}}>★ {q.rating}</span>,
                    <span style={{color:q.ontime>=90?C.green:C.amber}}>{q.ontime}%</span>,
                    <span style={{fontSize:10,color:C.textMuted}}>{q.remark.split("·")[0].trim()}</span>
                  ]}/>
                ))}/>
            </Card>
          </div>
        );
      })()}

      {tab==="pos" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
            <Btn variant="amber" size="sm" icon="↓" onClick={()=>exportCSV(SHIPMENTS.map(s=>({ID:s.id,PO:s.po,Supplier:s.sup,Material:s.mat,Thickness:s.thk+"mm",Sqm:s.sqm,Vessel:s.vessel,BL:s.bl,ETD:s.etd,ETA:s.eta,Terms:s.terms,Status:s.status,"Value AED":s.val})),"PurchaseOrders")}>Export Excel</Btn>
            <Btn variant="primary" size="sm" icon="＋">New PO</Btn>
          </div>
          <Card style={{padding:0}}>
            <Tbl headers={["PO#","Supplier","Material","Thickness","Sqm","Vessel","BL","ETD","ETA","Terms","Yard","Status","Value"]}
              rows={SHIPMENTS.map(sh=>{
                
                return <TR key={sh.id} cells={[
                  <Tag color={C.gold} text={sh.po}/>,
                  <span style={{fontSize:11}}>{sh.sup}</span>,
                  sh.mat, `${sh.thk}mm`, sh.sqm+" sqm", sh.vessel,
                  <span style={{fontSize:10,color:C.textMuted}}>{sh.bl}</span>,
                  sh.etd,
                  <span style={{color:C.blue,fontWeight:600}}>{sh.eta}</span>,
                  <Tag color={C.teal} text={sh.terms}/>,
                  YARDS.find(y=>y.id===sh.yard)?.name.split(" ")[0],
                  <Dot status={sh.status}/>,
                  <span style={{color:C.gold,fontWeight:600}}>AED {fmt(sh.val)}</span>
                ]}/>;
              })}/>
          </Card>
        </div>
      )}

      {tab==="suppliers" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          {SUPPLIERS.map(s=>(
            <Card key={s.id} hover>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div><div style={{fontSize:14,fontWeight:700,color:C.text}}>{s.name}</div><div style={{fontSize:11,color:C.textMuted}}>{s.loc}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,color:C.gold}}>★ {s.rating}</div><div style={{fontSize:10,color:C.green}}>{s.ontime}% on-time</div></div>
              </div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                {s.types.map(t=><Tag key={t} color={C.blue} text={t}/>)}
                {s.cur.map(c=><Tag key={c} color={C.goldDim} text={c}/>)}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,color:C.textMuted}}>
                <span>Lead: <strong style={{color:C.text}}>{s.lead}d</strong></span>
                <Btn size="sm" variant="primary">Request Quote</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INVENTORY
// ═══════════════════════════════════════════════════════════════
function Inventory() {
  const [tab,setTab] = useState("browser");
  const [yf,setYf] = useState("ALL");
  const [sf,setSf] = useState("All");
  const [scanInput,setScanInput] = useState("");
  const [scanned,setScanned] = useState(null);
  const [scanMsg,setScanMsg] = useState("");
  const [viewMode,setViewMode] = useState("grid");

  const doScan = () => {
    const f = INVENTORY.find(i=>i.bc===scanInput.trim()||i.id===scanInput.trim()||i.bnd===scanInput.trim());
    if (f) { setScanned(f); setScanMsg(""); } else { setScanMsg("Not found. Try: XM-2401-004 · SL-004 · BND-0461"); setScanned(null); }
  };

  const inv = INVENTORY.filter(i=>(yf==="ALL"||i.yard===yf)&&(sf==="All"||i.status===sf));
  const yards = YARDS.map(y=>({...y,items:INVENTORY.filter(i=>i.yard===y.id),sqm:INVENTORY.filter(i=>i.yard===y.id).reduce((s,i)=>s+i.sqm,0),val:INVENTORY.filter(i=>i.yard===y.id).reduce((s,i)=>s+i.sqm*(i.sell||i.cost),0)}));

  const doExport = () => exportCSV(INVENTORY.map(i=>({ID:i.id,Material:i.mat,Type:i.type,Thickness:i.thk+"mm",Size:i.size,Bundle:i.bnd,Shade:i.shade,Qty:i.qty,Sqm:i.sqm,Yard:YARDS.find(y=>y.id===i.yard)?.name,Location:i.loc,Status:i.status,Age:i.age+"d","Cost/sqm":i.cost,"Sell/sqm":i.sell,Margin:i.sell>0?((i.sell-i.cost)/i.sell*100).toFixed(1)+"%":"—",Barcode:i.bc,Damaged:i.damaged?"Yes":"No","Damage Notes":i.dmgNotes||""})),"Inventory_"+new Date().toISOString().split("T")[0]);

  return (
    <div>
      <SH title="Inventory Tracker" sub="All stock · Gangsaw · Mini Gangsaw · Tiles · Random · Damaged"
        actions={[<Btn key="xl" variant="amber" size="sm" icon="↓" onClick={doExport}>Export Excel</Btn>,<Btn key="add" variant="primary" size="sm" icon="＋">Add Stock</Btn>]}/>
      <Tabs tabs={[{id:"browser",label:"Stock Browser",icon:"🪨"},{id:"yards",label:"Yard Summary",icon:"🏭"},{id:"scan",label:"Scanner",icon:"📦"},{id:"incoming",label:"Incoming",icon:"🚢"},{id:"damaged",label:"Damaged",icon:"⚠️"}]} active={tab} onChange={setTab}/>

      {tab==="browser" && (
        <div>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{display:"flex",gap:5,flex:1,flexWrap:"wrap"}}>
              {["ALL",...YARDS.map(y=>y.id)].map(id=>{
                const label = id==="ALL"?"All":YARDS.find(y=>y.id===id)?.name.split(" ")[0];
                return <button key={id} onClick={()=>setYf(id)} style={{padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:yf===id?700:400,background:yf===id?C.gold:C.card,color:yf===id?"#0a0a0a":C.textMuted}}>{label}</button>;
              })}
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {["All","Available","Reserved","Non-Moving","Damaged"].map(s=>{
                const col = {Available:C.green,Reserved:C.gold,"Non-Moving":C.red,Damaged:C.amber}[s];
                return <button key={s} onClick={()=>setSf(s)} style={{padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:sf===s?700:400,background:sf===s?(col||C.gold):C.card,color:sf===s?"#0a0a0a":C.textMuted}}>{s}</button>;
              })}
              <button onClick={()=>setViewMode(v=>v==="grid"?"table":"grid")} style={{padding:"5px 12px",borderRadius:8,border:`1px solid ${C.border}`,cursor:"pointer",background:C.card,color:C.textMuted,fontSize:11,fontFamily:"inherit"}}>{viewMode==="grid"?"⊞ Table":"⊟ Grid"}</button>
            </div>
          </div>

          {viewMode==="grid" ? (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
              {inv.map(item=>{
                const mg = item.sell>0?((item.sell-item.cost)/item.sell*100).toFixed(0):"—";
                const stCol = {Available:C.green,Reserved:C.gold,"Non-Moving":C.red,Damaged:C.amber}[item.status]||C.textMuted;
                const sColor = sc(item.mat);
                return (
                  <Card key={item.id} hover style={{padding:0,overflow:"hidden",border:`1px solid ${item.damaged?C.amber+"55":C.border}`}}>
                    <div style={{height:52,background:sColor.bg,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 12px"}}>
                      <span style={{fontSize:8,color:sColor.txt,textTransform:"uppercase",letterSpacing:0.6}}>{item.type}</span>
                      <div style={{display:"flex",gap:4,alignItems:"center"}}>
                        {item.damaged&&<span style={{fontSize:9,color:C.amber}}>⚠</span>}
                        <span style={{fontSize:11,color:sColor.vein,fontWeight:700}}>{item.thk}mm</span>
                      </div>
                    </div>
                    <div style={{padding:12}}>
                      <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:2,lineHeight:1.3}}>{item.mat}</div>
                      <div style={{fontSize:10,color:C.textMuted,marginBottom:8}}>{item.size} · Shade {item.shade}</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:8}}>
                        {[["Qty",item.qty],["Sqm",fmt(item.sqm)],["Cost","AED "+item.cost],["Sell",item.damaged?"—":"AED "+item.sell]].map(([l,v])=>(
                          <div key={l}><div style={{fontSize:9,color:C.textDim}}>{l}</div><div style={{fontSize:11,color:C.text,fontWeight:600}}>{v}</div></div>
                        ))}
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <Tag color={stCol} text={item.status}/>
                        {!item.damaged&&<span style={{fontSize:11,fontWeight:700,color:C.gold}}>{mg}%</span>}
                      </div>
                      {item.res&&<div style={{marginTop:6,padding:"3px 7px",background:C.goldBg,borderRadius:4,fontSize:9,color:C.gold}}>🔒 {item.res}</div>}
                      {item.damaged&&<div style={{marginTop:6,padding:"3px 7px",background:C.amberBg,borderRadius:4,fontSize:9,color:C.amber}}>⚠ {item.dmgType}</div>}
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card style={{padding:0}}>
              <Tbl headers={["ID","Material","Type","Thickness","Size","Bundle","Shade","Qty","Sqm","Yard","Loc","Cost","Sell","Margin","Age","Status"]}
                rows={inv.map(item=>{
                  const mg = item.sell>0?((item.sell-item.cost)/item.sell*100).toFixed(0)+"%" :"—";
                  const stCol = {Available:C.green,Reserved:C.gold,"Non-Moving":C.red,Damaged:C.amber}[item.status]||C.textMuted;
                  const ageC = item.age>60?C.red:item.age>30?C.amber:C.green;
                  return <TR key={item.id} cells={[<Tag color={C.gold} text={item.id}/>,item.mat,item.type,`${item.thk}mm`,item.size,item.bnd,item.shade,item.qty,fmt(item.sqm),YARDS.find(y=>y.id===item.yard)?.name.split(" ")[0],item.loc,`AED ${item.cost}`,item.damaged?"—":`AED ${item.sell}`,<span style={{color:item.damaged?C.textMuted:C.gold,fontWeight:700}}>{mg}</span>,<span style={{color:ageC,fontWeight:600}}>{item.age}d</span>,<Tag color={stCol} text={item.status}/>]}/>;
                })}/>
            </Card>
          )}
        </div>
      )}

      {tab==="yards" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {yards.map(y=>(
              <Card key={y.id} hover>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <div><div style={{fontSize:15,fontWeight:700,color:C.text}}>{y.name}</div><div style={{fontSize:11,color:C.textMuted}}>{y.city} · {y.area}</div></div>
                  <Tag color={y.country==="UAE"?C.blue:y.country==="Oman"?C.green:C.purple} text={y.country}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  {[["Sqm",fmt(y.sqm)+" m²",C.gold],["Value","AED "+fmt(y.val/1000)+"K",C.green],["SKUs",y.items.length,C.blue],["Damaged",y.items.filter(i=>i.damaged).length,C.amber]].map(([l,v,c])=>(
                    <div key={l} style={{background:"#0d0d0f",borderRadius:7,padding:"8px 10px",textAlign:"center"}}>
                      <div style={{fontSize:9,color:C.textDim,marginBottom:2}}>{l}</div>
                      <div style={{fontSize:15,fontWeight:700,color:c}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:11,color:C.textMuted}}>Manager: <strong style={{color:C.text}}>{y.mgr}</strong> · {y.ph}</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab==="scan" && (
        <div style={{maxWidth:700,display:"flex",flexDirection:"column",gap:14}}>
          <Card style={{background:"linear-gradient(135deg,#0e1500,#18181b)",border:`1px solid ${C.goldDim}`}}>
            <div style={{fontSize:14,fontWeight:700,color:C.gold,marginBottom:4}}>📦 BUSY Barcode Scanner</div>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:14}}>Enter Slab ID, Bundle No, or scan BUSY barcode · Press Enter</div>
            <div style={{display:"flex",gap:10}}>
              <input value={scanInput} onChange={e=>setScanInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doScan()}
                placeholder="Try: XM-2401-004 · SL-004 · BND-0461"
                style={{flex:1,background:"#0d0d0f",border:`1px solid ${C.borderLight}`,borderRadius:8,color:C.text,padding:"11px 14px",fontSize:13,fontFamily:"inherit",outline:"none"}}/>
              <Btn variant="primary" onClick={doScan} size="lg">Scan</Btn>
            </div>
            {scanMsg&&<div style={{fontSize:12,color:C.amber,marginTop:8}}>⚠ {scanMsg}</div>}
          </Card>
          {scanned && (()=>{
            const mg = scanned.sell>0?((scanned.sell-scanned.cost)/scanned.sell*100).toFixed(0)+"%":"—";
            const stCol = {Available:C.green,Reserved:C.gold,"Non-Moving":C.red,Damaged:C.amber}[scanned.status]||C.textMuted;
            const sColor = sc(scanned.mat);
            return (
              <Card style={{border:`1px solid ${stCol}44`}}>
                <div style={{display:"flex",gap:14}}>
                  <div style={{width:85,minWidth:85,borderRadius:10,background:sColor.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,padding:10}}>
                    <span style={{fontSize:8,color:sColor.txt,textTransform:"uppercase",textAlign:"center"}}>{scanned.type.split(" ")[0]}</span>
                    <span style={{fontSize:13,color:sColor.vein,fontWeight:700}}>{scanned.thk}mm</span>
                    <Tag color={stCol} text={scanned.status}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:17,fontWeight:800,color:stCol,fontFamily:"'DM Serif Display',serif",marginBottom:2}}>✓ {scanned.mat}</div>
                    <div style={{fontSize:11,color:C.textMuted,marginBottom:12}}>{scanned.type} · {scanned.size} · Shade {scanned.shade} · {scanned.bnd}</div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginBottom:12}}>
                      {[["Qty",scanned.qty+" slabs"],["Sqm",fmt(scanned.sqm)+" m²"],["Thickness",scanned.thk+"mm"],["Location",scanned.loc],["Age",scanned.age+"d"],scanned.damaged?["Damage",scanned.dmgType]:["Margin",mg]].map(([l,v])=>(
                        <div key={l} style={{background:"#0d0d0f",borderRadius:7,padding:"8px 10px",textAlign:"center"}}>
                          <div style={{fontSize:9,color:C.textDim}}>{l}</div>
                          <div style={{fontSize:12,fontWeight:700,color:C.text,marginTop:2}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    {scanned.res&&<div style={{marginBottom:10,padding:"7px 12px",background:C.goldBg,borderRadius:7,fontSize:12,color:C.gold}}>🔒 Reserved for: {scanned.res}</div>}
                    {scanned.damaged&&<div style={{marginBottom:10,padding:"7px 12px",background:C.amberBg,borderRadius:7,fontSize:12,color:C.amber}}>⚠ {scanned.dmgNotes}</div>}
                    <div style={{display:"flex",gap:6}}>
                      {scanned.damaged?<Btn size="sm" variant="amber" icon="⚙️">Create Production Job</Btn>:<><Btn size="sm" variant="success">Mark Sold</Btn><Btn size="sm" variant="blue">Reserve</Btn></>}
                      <Btn size="sm" variant="ghost">Transfer Yard</Btn>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })()}
        </div>
      )}

      {tab==="incoming" && (
        <Card style={{padding:0}}>
          <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text}}>Expected Arrivals — Next 60 Days</div>
            <Btn size="sm" variant="amber" icon="↓" onClick={()=>exportCSV(SHIPMENTS.map(s=>({...s})),"ExpectedArrivals")}>Export</Btn>
          </div>
          <Tbl headers={["ID","PO","Material","Thickness","Sqm","Vessel","BL","ETD","ETA","Terms","Yard","Status","Value"]}
            rows={SHIPMENTS.map(sh=>{
              
              return <TR key={sh.id} cells={[<Tag color={C.gold} text={sh.id}/>,<Tag color={C.goldDim} text={sh.po}/>,sh.mat,`${sh.thk}mm`,sh.sqm+" sqm",sh.vessel,<span style={{fontSize:10,color:C.textMuted}}>{sh.bl}</span>,sh.etd,<span style={{color:C.blue,fontWeight:600}}>{sh.eta}</span>,<Tag color={C.teal} text={sh.terms}/>,YARDS.find(y=>y.id===sh.yard)?.name.split(" ")[0],<Dot status={sh.status}/>,<span style={{color:C.gold,fontWeight:600}}>AED {fmt(sh.val)}</span>]}/>;
            })}/>
        </Card>
      )}

      {tab==="damaged" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{padding:"10px 14px",background:C.amberBg,border:`1px solid ${C.amber}44`,borderRadius:8,fontSize:12,color:C.amber,fontWeight:600}}>
            ⚠ {INVENTORY.filter(i=>i.damaged).length} damaged items · {fmt(INVENTORY.filter(i=>i.damaged).reduce((s,i)=>s+i.sqm,0))} sqm · Cost value: AED {fmt(INVENTORY.filter(i=>i.damaged).reduce((s,i)=>s+i.sqm*i.cost,0))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {INVENTORY.filter(i=>i.damaged).map(item=>{
              const sColor = sc(item.mat);
              return (
                <Card key={item.id} style={{border:`1px solid ${C.amber}44`}}>
                  <div style={{height:48,borderRadius:7,background:sColor.bg,marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 12px"}}>
                    <span style={{fontSize:8,color:sColor.txt,textTransform:"uppercase"}}>DAMAGED · {item.type}</span>
                    <span style={{fontSize:11,color:sColor.vein,fontWeight:700}}>{item.thk}mm</span>
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:2}}>{item.mat}</div>
                  <div style={{fontSize:11,color:C.textMuted,marginBottom:10}}>{item.bnd} · Shade {item.shade}</div>
                  <div style={{background:C.amberBg,border:`1px solid ${C.amber}33`,borderRadius:6,padding:"6px 10px",fontSize:11,color:C.amber,marginBottom:10}}>
                    <strong>Type:</strong> {item.dmgType}<br/><span style={{fontSize:10}}>{item.dmgNotes}</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
                    {[["Slabs",item.qty],["Sqm",fmt(item.sqm)+" m²"],["Cost","AED "+item.cost+"/m²"],["Age",item.age+"d"]].map(([l,v])=>(
                      <div key={l} style={{background:"#0d0d0f",borderRadius:6,padding:"5px 8px"}}>
                        <div style={{fontSize:9,color:C.textDim}}>{l}</div>
                        <div style={{fontSize:11,fontWeight:600,color:C.text}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <Btn size="sm" variant="amber" style={{width:"100%",justifyContent:"center"}} icon="⚙️">Create Production Job</Btn>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PRODUCTION
// ═══════════════════════════════════════════════════════════════
function Production() {
  const [tab,setTab] = useState("jobs");
  const [form,setForm] = useState({srcId:"SL-013",output:"Steps 100×30cm",outQty:0,epoxy:0,resin:0,blade:0,labour:0,notes:""});
  const damaged = INVENTORY.filter(i=>i.damaged);
  const OUTPUT_TYPES = ["Steps 100×30cm","Risers 100×20cm","Tiles 30×30cm","Tiles 40×40cm","Tiles 60×60cm","Window Sills","Thresholds","Coping Stones","Kerbs","Custom Cut"];
  const srcItem = INVENTORY.find(i=>i.id===form.srcId)||damaged[0];
  const rawCost = srcItem ? srcItem.sqm*srcItem.cost : 0;
  const totalCost = rawCost+(+form.epoxy||0)+(+form.resin||0)+(+form.blade||0)+(+form.labour||0);
  const cpp = form.outQty>0 ? totalCost/form.outQty : 0;

  return (
    <div>
      <SH title="Production & Recovery" sub="Damaged slab recovery · Cut-to-size · Consumables tracking"/>
      <Tabs tabs={[{id:"jobs",label:"Production Jobs",icon:"📋"},{id:"new",label:"New Job",icon:"⚙️"},{id:"damaged",label:"Damaged Stock",icon:"⚠️"}]} active={tab} onChange={setTab}/>

      {tab==="jobs" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"flex",justifyContent:"flex-end"}}>
            <Btn variant="amber" size="sm" icon="↓" onClick={()=>exportCSV(PROD_JOBS,"ProductionJobs")}>Export</Btn>
          </div>
          <Card style={{padding:0}}>
            <Tbl headers={["Job ID","Source","Material","Thickness","Input sqm","Output","Qty","Epoxy","Resin","Blade","Labour","Yield%","Status","Date"]}
              rows={PROD_JOBS.map(j=>(
                <TR key={j.id} cells={[
                  <Tag color={C.amber} text={j.id}/>, j.src, j.mat, `${j.thk}mm`,
                  j.inputSqm, j.output, j.outQty+" pcs",
                  `AED ${j.epoxy}`, `AED ${j.resin}`, `AED ${j.blade}`, `AED ${j.labour}`,
                  <span style={{color:j.yield>80?C.green:j.yield>60?C.amber:C.red,fontWeight:700}}>{j.yield}%</span>,
                  <Dot status={j.status}/>, j.date
                ]}/>
              ))}/>
          </Card>
        </div>
      )}

      {tab==="new" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Card>
              <div style={{fontSize:13,fontWeight:700,color:C.amber,marginBottom:14}}>Source Material</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <F label="Source Slab" value={form.srcId} onChange={v=>setForm({...form,srcId:v})} options={damaged.map(i=>({value:i.id,label:i.id+" – "+i.mat.split(" ").slice(0,2).join(" ")}))}/>
                <F label="Output Type" value={form.output} onChange={v=>setForm({...form,output:v})} options={OUTPUT_TYPES.map(o=>({value:o,label:o}))}/>
                <F label="Expected Pieces" value={form.outQty} onChange={v=>setForm({...form,outQty:+v})} type="number" unit="pcs"/>
              </div>
            </Card>
            <Card>
              <div style={{fontSize:13,fontWeight:700,color:C.amber,marginBottom:14}}>Consumables & Costs</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <F label="Epoxy / Adhesive" value={form.epoxy} onChange={v=>setForm({...form,epoxy:+v})} type="number" unit="AED" note="Crack filling, edge bonding"/>
                <F label="Resin / Filler" value={form.resin} onChange={v=>setForm({...form,resin:+v})} type="number" unit="AED" note="Surface fill & polish"/>
                <F label="Blade Wear & Cutting" value={form.blade} onChange={v=>setForm({...form,blade:+v})} type="number" unit="AED" note="Diamond blade allocation"/>
                <F label="Labour" value={form.labour} onChange={v=>setForm({...form,labour:+v})} type="number" unit="AED" note="Cutting, finishing, QC"/>
              </div>
              <div style={{marginTop:12}}><F label="Notes" value={form.notes} onChange={v=>setForm({...form,notes:v})} rows={2} placeholder="Project ref, shade matching..."/></div>
            </Card>
          </div>
          <div>
            <Card style={{background:"linear-gradient(160deg,#1a1200,#18181b)",border:`1px solid ${C.amber}44`}}>
              <div style={{fontSize:13,fontWeight:700,color:C.amber,marginBottom:14}}>Cost Summary</div>
              {srcItem&&<div style={{padding:"10px 12px",background:sc(srcItem.mat).bg,borderRadius:8,marginBottom:14}}><div style={{fontSize:13,fontWeight:700,color:sc(srcItem.mat).vein}}>{srcItem.mat} · {srcItem.thk}mm</div><div style={{fontSize:11,color:sc(srcItem.mat).txt,marginTop:2}}>{srcItem.sqm} sqm · {srcItem.dmgNotes}</div></div>}
              {[["Raw Material Cost",fmtAED(rawCost),C.text],["Epoxy / Adhesive",fmtAED(form.epoxy),C.textMuted],["Resin / Filler",fmtAED(form.resin),C.textMuted],["Blade Wear",fmtAED(form.blade),C.textMuted],["Labour",fmtAED(form.labour),C.textMuted],["TOTAL PRODUCTION COST",fmtAED(totalCost),C.amber],["Cost per Piece",form.outQty>0?fmtAED(cpp,2):"—",C.goldLight]].map(([l,v,c],i)=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}22`,fontWeight:i>=5?700:400}}>
                  <span style={{fontSize:12,color:C.textMuted}}>{l}</span>
                  <span style={{fontSize:i>=5?14:12,color:c}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:14,padding:"10px 12px",background:C.greenBg,borderRadius:8,border:`1px solid ${C.green}33`,fontSize:12,color:C.green}}>
                💡 Suggested sell price at 30% margin: <strong>AED {fmt(cpp*1.3,2)}/pc</strong>
              </div>
              <Btn variant="amber" style={{width:"100%",marginTop:14,justifyContent:"center"}} icon="⚙️">Create Production Job</Btn>
            </Card>
          </div>
        </div>
      )}

      {tab==="damaged" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {damaged.map(item=>{
            const sColor = sc(item.mat);
            return (
              <Card key={item.id} style={{border:`1px solid ${C.amber}44`}}>
                <div style={{height:48,borderRadius:7,background:sColor.bg,marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 12px"}}>
                  <span style={{fontSize:8,color:sColor.txt,textTransform:"uppercase"}}>DAMAGED · {item.thk}mm</span>
                  <Tag color={C.amber} text={item.dmgType}/>
                </div>
                <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:8}}>{item.mat}</div>
                <div style={{fontSize:11,color:C.amber,marginBottom:10,lineHeight:1.4}}>{item.dmgNotes}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
                  {[["Slabs",item.qty],["Sqm",fmt(item.sqm)+" m²"],["Cost","AED "+item.cost+"/m²"],["Age",item.age+"d"]].map(([l,v])=>(
                    <div key={l} style={{background:"#0d0d0f",borderRadius:6,padding:"5px 8px"}}><div style={{fontSize:9,color:C.textDim}}>{l}</div><div style={{fontSize:11,fontWeight:600,color:C.text}}>{v}</div></div>
                  ))}
                </div>
                <Btn size="sm" variant="amber" style={{width:"100%",justifyContent:"center"}}>→ Create Job</Btn>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SALES
// ═══════════════════════════════════════════════════════════════
function Sales() {
  const [tab,setTab] = useState("quote");
  const [proj,setProj] = useState({client:"",project:"",zone:"Living/Reception",area:150,matId:"M08",thk:20,fin:"Polished",size:"280×140",shade:"A",wastage:10,price:0,discount:0,terms:"CIF",validDays:15,notes:""});

  const mat = MATERIALS.find(m=>m.id===proj.matId)||MATERIALS[0];
  const stockItem = INVENTORY.find(i=>i.matId===proj.matId&&!i.damaged);
  const usePrice = proj.price>0?proj.price:(stockItem?.sell||0);
  const reqSqm = proj.area*(1+proj.wastage/100);
  const subtotal = reqSqm*usePrice;
  const discAmt = subtotal*proj.discount/100;
  const afterDisc = subtotal-discAmt;
  const vat = afterDisc*0.05;
  const grand = afterDisc+vat;
  const stockOk = stockItem && stockItem.sqm>=reqSqm;
  const sColor = sc(mat.name);

  return (
    <div>
      <SH title="Sales Desk" sub="Project quotations · PDF export · VAT compliant · Shipping terms integrated"/>
      <Tabs tabs={[{id:"kpi",label:"KPI Dashboard",icon:"📊"},{id:"quote",label:"Quote Builder",icon:"📝"},{id:"reqs",label:"Requirements",icon:"📋"},{id:"customers",label:"Customers",icon:"🤝"}]} active={tab} onChange={setTab}/>

      {tab==="kpi" && (()=>{
        const months=["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
        const revData=[2.1,3.4,2.8,4.2,3.9,5.1,4.6,6.2,6.7];
        const tgtData=[3.0,3.0,3.5,3.5,4.0,4.0,4.5,4.5,5.0];
        const gpData=[0.84,1.36,1.12,1.68,1.56,2.04,1.84,2.48,2.68];
        const maxRev=Math.max(...revData,5);
        const SVG_H=110, SVG_W=560;
        const px=(i)=>24+(i*(SVG_W-48)/(months.length-1));
        const py=(v)=>SVG_H-16-((v/maxRev)*(SVG_H-28));
        const linePoints=(data)=>data.map((v,i)=>`${px(i)},${py(v)}`).join(" ");
        const areaPoints=(data)=>`${px(0)},${SVG_H-16} ${linePoints(data)} ${px(data.length-1)},${SVG_H-16}`;

        const revVsTarget=((revData[revData.length-1]/tgtData[tgtData.length-1])*100).toFixed(0);
        const revVsLY=((revData[revData.length-1]/revData[0]-1)*100).toFixed(0);
        const totalRev=revData.reduce((s,v)=>s+v,0);
        const totalGP=gpData.reduce((s,v)=>s+v,0);
        const gpPct=((totalGP/totalRev)*100).toFixed(1);

        const BulletChart=({label,value,target,max,unit,color,note})=>{
          const vPct=(value/max)*100, tPct=(target/max)*100;
          return (
            <Card style={{padding:"14px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{label}</div><div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{note}</div></div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:20,fontWeight:800,color:color,fontFamily:"'DM Serif Display',serif"}}>{value}{unit}</div>
                  <div style={{fontSize:10,color:C.textDim}}>Target: {target}{unit}</div>
                </div>
              </div>
              <div style={{position:"relative",height:20,borderRadius:4,overflow:"hidden",background:"#0d0d0f"}}>
                <div style={{position:"absolute",left:0,top:0,height:"100%",width:"100%",display:"flex"}}>
                  <div style={{width:"33%",background:"#f8717122",borderRight:`1px solid ${C.border}`}}/>
                  <div style={{width:"34%",background:"#fb923c22",borderRight:`1px solid ${C.border}`}}/>
                  <div style={{width:"33%",background:"#4ade8022"}}/>
                </div>
                <div style={{position:"absolute",left:0,top:"25%",height:"50%",width:`${vPct}%`,background:color,borderRadius:3,transition:"width 1s"}}/>
                <div style={{position:"absolute",top:0,left:`${tPct}%`,width:3,height:"100%",background:C.text,borderRadius:1,transform:"translateX(-50%)"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:9,color:C.textDim}}>
                <span>0</span><span style={{color:vPct>=tPct?C.green:C.amber,fontWeight:600}}>{vPct>=tPct?"▲":"▼"} {Math.abs(vPct-tPct).toFixed(0)}% vs target</span><span>{max}{unit}</span>
              </div>
            </Card>
          );
        };

        return (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10}}>
              {[
                ["Revenue MTD","AED 6.7M","vs AED 5.0M target",C.green,"📈"],
                ["Revenue vs LY","+"+revVsLY+"%","YoY growth",C.teal,"🚀"],
                ["Gross Profit","AED 2.68M",gpPct+"% GP margin",C.gold,"💰"],
                ["Active Quotes","14","4 expiring this week",C.blue,"📝"],
                ["Win Rate","68%","vs 60% target",C.green,"🎯"],
                ["Avg Order Size","AED 84K","Top: Emaar AED 220K",C.purple,"💎"],
              ].map(([l,v,s,col,ic])=>(
                <Card key={l} style={{padding:"12px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{fontSize:9,color:C.textMuted,textTransform:"uppercase",letterSpacing:0.6,fontWeight:600,lineHeight:1.4}}>{l}</div>
                    <span style={{fontSize:16}}>{ic}</span>
                  </div>
                  <div style={{fontSize:18,fontWeight:800,color:col,fontFamily:"'DM Serif Display',serif",lineHeight:1.2,marginBottom:3}}>{v}</div>
                  <div style={{fontSize:10,color:C.textDim}}>{s}</div>
                </Card>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              <BulletChart label="Revenue vs Target" value={revVsTarget} target={110} max={150} unit="%" color={+revVsTarget>=110?C.green:C.amber} note={"Target increase = 110%"}/>
              <BulletChart label="GP Margin vs Target" value={+gpPct} target={38} max={60} unit="%" color={+gpPct>=38?C.green:C.amber} note={"GP target = 38%"}/>
              <BulletChart label="Quote Conversion" value={68} target={60} max={100} unit="%" color={C.green} note={"Target conversion = 60%"}/>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
              <Card>
                <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:4}}>Revenue vs Target Trend (9 months)</div>
                <div style={{fontSize:11,color:C.textMuted,marginBottom:12}}>Total Revenue = AED {fmt(totalRev*1000000)} · GP = AED {fmt(totalGP*1000000)}</div>
                <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{width:"100%",overflow:"visible"}}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.gold} stopOpacity="0.3"/>
                      <stop offset="100%" stopColor={C.gold} stopOpacity="0.02"/>
                    </linearGradient>
                    <linearGradient id="gpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.green} stopOpacity="0.25"/>
                      <stop offset="100%" stopColor={C.green} stopOpacity="0.02"/>
                    </linearGradient>
                  </defs>
                  {[0,1,2,3,4].map(i=>{
                    const y=py((maxRev/4)*i);
                    return <line key={i} x1={24} y1={y} x2={SVG_W-24} y2={y} stroke={C.border} strokeWidth={0.5}/>;
                  })}
                  <polygon points={areaPoints(revData)} fill="url(#revGrad)"/>
                  <polygon points={areaPoints(gpData)} fill="url(#gpGrad)"/>
                  <polyline points={linePoints(tgtData)} fill="none" stroke={C.red} strokeWidth={1.5} strokeDasharray="5,4"/>
                  <polyline points={linePoints(revData)} fill="none" stroke={C.gold} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points={linePoints(gpData)} fill="none" stroke={C.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                  {revData.map((v,i)=><circle key={i} cx={px(i)} cy={py(v)} r={i===revData.length-1?5:3} fill={C.gold} stroke="#18181b" strokeWidth={1.5}/>)}
                  {months.map((m,i)=><text key={i} x={px(i)} y={SVG_H} textAnchor="middle" fill={C.textDim} fontSize={9}>{m}</text>)}
                </svg>
                <div style={{display:"flex",gap:16,marginTop:6,justifyContent:"center"}}>
                  {[[C.gold,"Revenue"],[C.green,"Gross Profit"],[C.red+"cc","Target (dashed)"]].map(([c,l])=>(
                    <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:C.textMuted}}>
                      <div style={{width:16,height:2,background:c,borderRadius:1}}/>
                      {l}
                    </div>
                  ))}
                </div>
              </Card>

              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <Card>
                  <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:12}}>Revenue by Product Type</div>
                  {[["Marble",42,C.blue],["Granite",28,C.gold],["Quartzite",18,C.teal],["Limestone",12,C.amber]].map(([l,pct,col])=>(
                    <div key={l} style={{marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:11}}>
                        <span style={{color:C.text}}>{l}</span>
                        <span style={{color:col,fontWeight:700}}>{pct}%</span>
                      </div>
                      <div style={{background:C.border,borderRadius:99,height:8,overflow:"hidden"}}>
                        <div style={{width:`${pct}%`,height:"100%",background:col,borderRadius:99}}/>
                      </div>
                    </div>
                  ))}
                </Card>
                <Card>
                  <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:10}}>Top Customers MTD</div>
                  {[["Emaar Properties","AED 220K",C.gold],["Aldar Properties","AED 185K",C.blue],["Damac Interiors","AED 142K",C.green],["Al Futtaim Living","AED 98K",C.purple]].map(([n,v,c],i)=>(
                    <div key={n} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:i<3?`1px solid ${C.border}22`:"none"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:22,height:22,borderRadius:6,background:c+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:c}}>{i+1}</div>
                        <span style={{fontSize:11,color:C.text}}>{n.split(" ")[0]}</span>
                      </div>
                      <span style={{fontSize:12,fontWeight:700,color:c}}>{v}</span>
                    </div>
                  ))}
                </Card>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              <Card>
                <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:12}}>Quote Pipeline</div>
                {[["Draft",3,C.textMuted],["Sent",5,C.blue],["Viewed",3,C.amber],["Accepted",3,C.green]].map(([s,n,c])=>(
                  <div key={s} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.border}22`}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
                      <span style={{fontSize:12,color:C.text}}>{s}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:80,background:C.border,borderRadius:99,height:5,overflow:"hidden"}}><div style={{width:`${(n/14)*100}%`,height:"100%",background:c,borderRadius:99}}/></div>
                      <span style={{fontSize:12,fontWeight:700,color:c,width:16,textAlign:"right"}}>{n}</span>
                    </div>
                  </div>
                ))}
              </Card>
              <Card>
                <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:12}}>Revenue by Region</div>
                {[["Dubai",58,C.gold],["Abu Dhabi",22,C.blue],["Sharjah",12,C.green],["Oman + Qatar",8,C.purple]].map(([r,pct,col])=>(
                  <div key={r} style={{marginBottom:9}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}>
                      <span style={{color:C.text}}>{r}</span><span style={{color:col,fontWeight:700}}>{pct}%</span>
                    </div>
                    <div style={{background:C.border,borderRadius:99,height:6,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:col,borderRadius:99}}/></div>
                  </div>
                ))}
              </Card>
              <Card style={{background:"linear-gradient(160deg,#0e1200,#18181b)",border:`1px solid ${C.goldDim}`}}>
                <div style={{fontSize:12,fontWeight:700,color:C.gold,marginBottom:12}}>⚡ Sales Actions</div>
                {[["4 quotes expiring in 7 days",C.amber,"Follow up now"],["Statuario Marble — stock low",C.red,"Create PO"],["Emaar Tower A quote accepted",C.green,"Convert to order"],["Aldar Q2 tender open",C.blue,"Prepare proposal"]].map(([t,c,a])=>(
                  <div key={t} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.border}22`}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:c,flexShrink:0}}/>
                      <span style={{fontSize:11,color:C.text,lineHeight:1.3}}>{t}</span>
                    </div>
                    <Btn size="sm" variant="ghost" style={{fontSize:9,padding:"3px 7px",whiteSpace:"nowrap"}}>{a}</Btn>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        );
      })()}

      {tab==="quote" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Card>
              <div style={{fontSize:12,fontWeight:700,color:C.gold,marginBottom:12}}>Client & Project</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <F label="Client" value={proj.client} onChange={v=>setProj({...proj,client:v})} options={[{value:"",label:"Select client..."},...CUSTOMERS.map(c=>({value:c.name,label:c.name}))]}/>
                <F label="Project Reference" value={proj.project} onChange={v=>setProj({...proj,project:v})} placeholder="Villa 12, Tower A..."/>
              </div>
            </Card>
            <Card>
              <div style={{fontSize:12,fontWeight:700,color:C.gold,marginBottom:12}}>Material Specification</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <F label="Application Zone" value={proj.zone} onChange={v=>setProj({...proj,zone:v})} options={["Living/Reception","Bedrooms","Bathrooms","Kitchen","Facade","Pool Deck","Staircase","Full Flooring"].map(z=>({value:z,label:z}))}/>
                <F label="Area Required" value={proj.area} onChange={v=>setProj({...proj,area:+v})} type="number" unit="sqm"/>
                <F label="Material" value={proj.matId} onChange={v=>{const m=MATERIALS.find(x=>x.id===v);setProj({...proj,matId:v,thk:m?.thk[0]||20,fin:m?.fin[0]||"Polished"});}} options={MATERIALS.map(m=>({value:m.id,label:m.name}))}/>
                <F label="Thickness" value={proj.thk} onChange={v=>setProj({...proj,thk:+v})} options={mat.thk.map(t=>({value:t,label:t+"mm"}))}/>
                <F label="Size" value={proj.size} onChange={v=>setProj({...proj,size:v})} options={mat.sz.map(s=>({value:s,label:s}))}/>
                <F label="Finish" value={proj.fin} onChange={v=>setProj({...proj,fin:v})} options={mat.fin.map(f=>({value:f,label:f}))}/>
                <F label="Shade" value={proj.shade} onChange={v=>setProj({...proj,shade:v})} options={["A+","A","B+","B","Mixed","TBD"].map(s=>({value:s,label:s}))}/>
                <F label="Wastage %" value={proj.wastage} onChange={v=>setProj({...proj,wastage:+v})} type="number" unit="%"/>
                <F label="Custom Price (0=stock)" value={proj.price} onChange={v=>setProj({...proj,price:+v})} type="number" unit="AED"/>
                <F label="Discount %" value={proj.discount} onChange={v=>setProj({...proj,discount:+v})} type="number" unit="%"/>
                <F label="Shipping Terms" value={proj.terms} onChange={v=>setProj({...proj,terms:v})} options={SHIPPING_TERMS.map(t=>({value:t.id,label:t.id+" – "+t.name.split("–")[1]?.trim()}))}/>
                <F label="Quote Valid (days)" value={proj.validDays} onChange={v=>setProj({...proj,validDays:+v})} type="number" unit="days"/>
              </div>
            </Card>
            <Card><F label="Notes" value={proj.notes} onChange={v=>setProj({...proj,notes:v})} rows={2} placeholder="Special instructions, delivery address..."/></Card>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{height:85,borderRadius:12,background:sColor.bg,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px"}}>
              <div>
                <div style={{fontSize:19,fontWeight:700,color:sColor.vein,fontFamily:"'DM Serif Display',serif"}}>{mat.name}</div>
                <div style={{fontSize:12,color:sColor.txt}}>{mat.type} · {mat.origin} · {proj.thk}mm · {proj.fin} · Shade {proj.shade}</div>
              </div>
              <Tag color={sColor.vein} text={mat.cat}/>
            </div>

            <Card style={{background:"linear-gradient(160deg,#0e1200,#18181b)",border:`1px solid ${C.goldDim}`}}>
              <div style={{fontSize:13,fontWeight:700,color:C.gold,marginBottom:14}}>{proj.client||"Client"} — {proj.project||"Quotation"} · {todayStr()}</div>
              {[["Material",mat.name,C.text],["Specification",`${proj.thk}mm · ${proj.fin} · Shade ${proj.shade}`,C.textMuted],["Zone",proj.zone,C.textMuted],["Area",`${proj.area} sqm`,C.text],[`Wastage ${proj.wastage}%`,`+${(proj.area*proj.wastage/100).toFixed(1)} sqm`,C.amber],["Supply Qty",`${reqSqm.toFixed(1)} sqm`,C.gold],["Unit Price",`AED ${fmt(usePrice,2)}/sqm`,C.text],["Subtotal",`AED ${fmt(subtotal)}`,C.text],...(proj.discount>0?[[`Discount ${proj.discount}%`,`– AED ${fmt(discAmt)}`,C.red]]:[]),["After Discount",`AED ${fmt(afterDisc)}`,C.goldLight],["UAE VAT 5%",`AED ${fmt(vat)}`,C.textMuted]].map(([l,v,c])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}22`}}>
                  <span style={{fontSize:12,color:C.textMuted}}>{l}</span>
                  <span style={{fontSize:12,color:c,fontWeight:500}}>{v}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 4px"}}>
                <span style={{fontSize:15,fontWeight:700,color:C.text}}>Grand Total</span>
                <span style={{fontSize:22,fontWeight:800,color:C.green,fontFamily:"'DM Serif Display',serif"}}>AED {fmt(grand)}</span>
              </div>
              <div style={{padding:"7px 12px",background:C.goldBg,borderRadius:7,fontSize:11,color:C.gold,marginTop:8}}>
                🚢 {SHIPPING_TERMS.find(t=>t.id===proj.terms)?.name}
              </div>
            </Card>

            <div style={{padding:"10px 14px",background:stockOk?C.greenBg:C.redBg,borderRadius:8,border:`1px solid ${stockOk?C.green:C.red}44`,fontSize:12,color:stockOk?C.green:C.red,fontWeight:600}}>
              {stockOk?`✓ Stock OK: ${fmt(stockItem.sqm)} sqm available at ${stockItem.loc}`:`⚠ Shortfall: only ${fmt(stockItem?.sqm||0)} sqm available — need ${reqSqm.toFixed(1)} sqm`}
            </div>

            <div style={{display:"flex",gap:8}}>
              <Btn variant="primary" style={{flex:1,justifyContent:"center"}} icon="📄" onClick={()=>printQuote(proj,mat,stockItem,usePrice,reqSqm,subtotal,discAmt,afterDisc,vat,grand)}>Download PDF Quote</Btn>
              <Btn variant="amber" icon="📊" onClick={()=>exportCSV([{Client:proj.client,Project:proj.project,Material:mat.name,Thickness:proj.thk+"mm",Finish:proj.fin,Shade:proj.shade,Area:proj.area,Wastage:proj.wastage+"%","Supply Sqm":reqSqm.toFixed(1),"Unit Price AED":usePrice,"Subtotal AED":fmt(subtotal),"Discount AED":fmt(discAmt),"After Disc AED":fmt(afterDisc),"VAT AED":fmt(vat),"Grand Total AED":fmt(grand),"Terms":proj.terms}],"Quotation_"+proj.client)}>Excel</Btn>
              <Btn variant="success" icon="✓">Convert to Order</Btn>
            </div>
          </div>
        </div>
      )}

      {tab==="reqs" && (
        <Card>
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:14}}>Inventory Requirements from Active Orders</div>
          <Tbl headers={["Material","Thickness","Required","In Stock","Incoming","Net Position","Action"]}
            rows={[["Bianco Carrara Marble","18mm",120,63.2,120,63.2],["Absolute Black Granite","20mm",450,164.6,300,14.6],["Calacatta Gold Marble","20mm",80,28.1,60,8.1],["Statuario Marble","20mm",60,23.5,0,-36.5],["Nero Marquina Marble","18mm",30,48.0,0,18]].map(([mat,thk,req,stk,inc,net],i)=>(
              <TR key={i} cells={[mat,thk,<span style={{fontWeight:700}}>{req} sqm</span>,<span style={{color:stk>=req?C.green:C.amber}}>{stk} sqm</span>,<span style={{color:C.blue}}>{inc>0?"+"+inc+" sqm":"—"}</span>,<span style={{color:net>=0?C.green:C.red,fontWeight:700}}>{net>=0?"+":""}{net.toFixed(1)} sqm</span>,net<0?<Btn size="sm" variant="danger">Create PO</Btn>:<Tag color={C.green} text="Covered"/>]}/>
            ))}/>
        </Card>
      )}

      {tab==="customers" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          {CUSTOMERS.map((c,i)=>{
            const util = (c.out/c.credit)*100;
            return (
              <Card key={c.id} hover>
                {i===0&&<div style={{marginBottom:8}}><Tag color={C.gold} text="Top Client"/></div>}
                <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:2}}>{c.name}</div>
                <div style={{fontSize:11,color:C.textMuted,marginBottom:12}}>{c.city} · {c.type}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  {[["Revenue","AED "+fmt(c.rev/1000)+"K",C.gold],["Orders",c.orders,C.text],["Outstanding","AED "+fmt(c.out),util>70?C.red:C.amber],["Last Order",c.last,C.textMuted]].map(([l,v,col])=>(
                    <div key={l} style={{background:"#0d0d0f",borderRadius:7,padding:"8px 10px"}}><div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",marginBottom:2}}>{l}</div><div style={{fontSize:13,fontWeight:600,color:col}}>{v}</div></div>
                  ))}
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.textDim,marginBottom:4}}><span>Credit Utilization</span><span>{util.toFixed(0)}% of AED {fmt(c.credit/1000)}K</span></div>
                  <Bar pct={util} color={util>80?C.red:util>50?C.amber:C.green} h={6}/>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <Btn size="sm" variant="primary" style={{flex:1,justifyContent:"center"}}>New Quote</Btn>
                  <Btn size="sm" variant="ghost">Statement</Btn>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DESIGN PLANNER
// ═══════════════════════════════════════════════════════════════
function DesignPlanner() {
  const [tab,setTab] = useState("planner");
  const [selMat,setSelMat] = useState("M08");
  const [selThk,setSelThk] = useState(20);
  const [zones,setZones] = useState({});
  const [activeZ,setActiveZ] = useState(null);

  const ZONES = [
    {id:"Z1",label:"Main Lobby",area:280,x:20,y:20,w:255,h:120},
    {id:"Z2",label:"Corridor",area:85,x:290,y:20,w:90,h:120},
    {id:"Z3",label:"Living Room",area:145,x:20,y:155,w:155,h:110},
    {id:"Z4",label:"Master Bed",area:120,x:190,y:155,w:110,h:110},
    {id:"Z5",label:"Master Bath",area:60,x:315,y:155,w:65,h:55},
    {id:"Z6",label:"Kitchen",area:75,x:315,y:215,w:65,h:50},
    {id:"Z7",label:"Bedroom 2",area:95,x:20,y:278,w:110,h:90},
    {id:"Z8",label:"Bedroom 3",area:90,x:145,y:278,w:100,h:90},
    {id:"Z9",label:"Terrace",area:120,x:258,y:278,w:122,h:90},
  ];

  const assignZ = (zid) => { const m=MATERIALS.find(x=>x.id===selMat); setZones(p=>({...p,[zid]:{matId:selMat,mat:m?.name,thk:selThk,sell:INVENTORY.find(i=>i.matId===selMat&&!i.damaged)?.sell||0}})); setActiveZ(zid); };
  const getZColor = (zid) => { const a=zones[zid]; if(!a) return {bg:"#222",border:"#333",txt:"#444"}; const s=sc(a.mat); return {bg:s.bg,border:s.vein,txt:s.txt}; };
  const totalArea = ZONES.reduce((s,z)=>s+z.area,0);
  const cost = ZONES.filter(z=>zones[z.id]).reduce((s,z)=>s+z.area*1.1*(zones[z.id]?.sell||0),0);

  return (
    <div>
      <SH title="Design Planner" sub="Floor plan colour planning · Material scheduling · AutoCAD integration roadmap"/>
      <Tabs tabs={[{id:"planner",label:"Colour Planner",icon:"🎨"},{id:"schedule",label:"Material Schedule",icon:"📋"},{id:"workflow",label:"AutoCAD Workflow",icon:"📐"}]} active={tab} onChange={setTab}/>

      {tab==="planner" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:20}}>
          <Card style={{padding:0,overflow:"hidden"}}>
            <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:13,fontWeight:700,color:C.text}}>Interactive Floor Plan</div><div style={{fontSize:11,color:C.textMuted}}>Select material → click zone to assign · Real DXF/DWG upload in v2</div></div>
              <Tag color={C.blue} text={`${Object.keys(zones).length}/${ZONES.length} zones`}/>
            </div>
            <div style={{padding:16,background:"#0d0d0f"}}>
              <svg viewBox="0 0 400 390" style={{width:"100%",borderRadius:8,background:"#111",border:`1px solid ${C.border}`}}>
                {Array.from({length:21}).map((_,i)=><line key={"v"+i} x1={i*20} y1={0} x2={i*20} y2={390} stroke="#1a1a1a" strokeWidth={0.5}/>)}
                {Array.from({length:20}).map((_,i)=><line key={"h"+i} x1={0} y1={i*20} x2={400} y2={i*20} stroke="#1a1a1a" strokeWidth={0.5}/>)}
                {ZONES.map(z=>{const col=getZColor(z.id);const act=activeZ===z.id;return(
                  <g key={z.id} onClick={()=>assignZ(z.id)} style={{cursor:"pointer"}}>
                    <rect x={z.x} y={z.y} width={z.w} height={z.h} fill={col.bg} stroke={act?C.gold:col.border} strokeWidth={act?2:1} rx={2} opacity={0.92}/>
                    <text x={z.x+z.w/2} y={z.y+z.h/2-5} textAnchor="middle" fill={col.txt} fontSize={9} fontWeight={600}>{z.label}</text>
                    <text x={z.x+z.w/2} y={z.y+z.h/2+7} textAnchor="middle" fill={col.txt} fontSize={8}>{z.area} m²</text>
                    {zones[z.id]&&<text x={z.x+z.w/2} y={z.y+z.h/2+18} textAnchor="middle" fill={col.border} fontSize={7}>{zones[z.id].thk}mm</text>}
                  </g>
                );})}
                <text x={373} y={15} fill={C.textDim} fontSize={10} fontWeight={700}>N</text>
                <line x1={378} y1={17} x2={378} y2={28} stroke={C.textDim} strokeWidth={1.5}/>
              </svg>
              <div style={{marginTop:8,display:"flex",gap:8,flexWrap:"wrap"}}>
                {Object.entries(zones).map(([zid,a])=>{const z=ZONES.find(x=>x.id===zid);const s=sc(a.mat);return(<div key={zid} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:C.textMuted}}><div style={{width:11,height:11,borderRadius:2,background:s.bg,border:`1px solid ${s.vein}`}}/><span>{z?.label}: {a.mat?.split(" ").slice(0,2).join(" ")} {a.thk}mm</span></div>);})}
              </div>
            </div>
          </Card>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Card style={{background:"linear-gradient(135deg,#14120a,#18181b)",border:`1px solid ${C.goldDim}`}}>
              <div style={{fontSize:12,fontWeight:700,color:C.gold,marginBottom:10}}>Material Selector</div>
              <F label="Material" value={selMat} onChange={v=>{setSelMat(v);setSelThk(MATERIALS.find(m=>m.id===v)?.thk[0]||20);}} options={MATERIALS.map(m=>({value:m.id,label:m.name}))}/>
              <div style={{marginTop:10}}><F label="Thickness" value={selThk} onChange={v=>setSelThk(+v)} options={(MATERIALS.find(m=>m.id===selMat)?.thk||[20]).map(t=>({value:t,label:t+"mm"}))}/></div>
              <div style={{marginTop:10,height:50,borderRadius:7,background:sc(MATERIALS.find(m=>m.id===selMat)?.name).bg,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:11,color:sc(MATERIALS.find(m=>m.id===selMat)?.name).vein,fontWeight:600,padding:6,textAlign:"center"}}>{MATERIALS.find(m=>m.id===selMat)?.name}</span>
              </div>
              <div style={{marginTop:8,fontSize:10,color:C.textMuted}}>Select material above, then click any floor plan zone.</div>
            </Card>
            <Card>
              <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:10}}>Project Summary</div>
              {[["Total Area",`${totalArea} sqm`],["Zones Assigned",`${Object.keys(zones).length} / ${ZONES.length}`],["Est. Cost (+10% wastage)",`AED ${fmt(cost)}`]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}22`,fontSize:12}}>
                  <span style={{color:C.textMuted}}>{l}</span><span style={{color:C.text,fontWeight:600}}>{v}</span>
                </div>
              ))}
              <Btn variant="primary" style={{width:"100%",marginTop:12,justifyContent:"center"}} onClick={()=>{}}>Generate Schedule →</Btn>
            </Card>
          </div>
        </div>
      )}

      {tab==="schedule" && (
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text}}>Material Schedule</div>
            <Btn size="sm" variant="amber" icon="↓" onClick={()=>exportCSV(ZONES.filter(z=>zones[z.id]).map(z=>{const a=zones[z.id];const m=MATERIALS.find(x=>x.id===a.matId);return{Zone:z.label,"Area sqm":z.area,Material:a.mat,Thickness:a.thk+"mm",Finish:m?.fin[0],"Supply sqm":(z.area*1.1).toFixed(1),"Price/sqm":a.sell,"Total AED":fmt(z.area*1.1*a.sell)}}),"MaterialSchedule")}>Export Excel</Btn>
          </div>
          {Object.keys(zones).length===0?(
            <div style={{padding:40,textAlign:"center",color:C.textDim}}>Assign materials in Colour Planner first.</div>
          ):(
            <Tbl headers={["Zone","Area","Material","Thickness","Finish","Supply Qty","Price/m²","Total","Stock"]}
              rows={ZONES.filter(z=>zones[z.id]).map(z=>{const a=zones[z.id];const si=INVENTORY.find(i=>i.matId===a.matId&&!i.damaged);const sup=z.area*1.1;const m=MATERIALS.find(x=>x.id===a.matId);
                return <TR key={z.id} cells={[z.label,`${z.area} m²`,a.mat,`${a.thk}mm`,m?.fin[0]||"Polished",`${sup.toFixed(1)} sqm`,`AED ${a.sell}`,<span style={{color:C.gold,fontWeight:700}}>AED {fmt(sup*a.sell)}</span>,<Tag color={si&&si.sqm>=sup?C.green:C.red} text={si&&si.sqm>=sup?"In Stock":"Order"}/>]}/>;
              })}/>
          )}
        </Card>
      )}

      {tab==="workflow" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[{s:"01",t:"Upload DXF / DWG",d:"Customer shares AutoCAD floor plan. System auto-extracts room names and dimensions.",icon:"📁",live:false},{s:"02",t:"Auto Zone Detection",d:"Rooms auto-identified. Sales team labels each area — Living, Bathroom, Kitchen, Facade.",icon:"🗂️",live:false},{s:"03",t:"Colour Planning",d:"Assign real materials from live stock visually. Stone swatches show exact appearance.",icon:"🎨",live:true},{s:"04",t:"Material Schedule",d:"Complete schedule: sqm, wastage, thickness, finish per zone. Export PDF/Excel.",icon:"📋",live:true},{s:"05",t:"Stock Check & Sourcing",d:"Auto-check live inventory. Shortfalls trigger procurement requirements.",icon:"📦",live:true},{s:"06",t:"Sales Quotation",d:"One-click: material schedule → formal VAT-compliant quotation ready to send.",icon:"📝",live:true}].map(s=>(
            <Card key={s.s} hover>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{fontSize:24}}>{s.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:5}}>
                    <span style={{fontSize:10,color:C.textDim,fontWeight:700}}>STEP {s.s}</span>
                    <Tag color={s.live?C.green:C.amber} text={s.live?"Live Now":"v2"}/>
                  </div>
                  <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:5}}>{s.t}</div>
                  <div style={{fontSize:12,color:C.textMuted,lineHeight:1.5}}>{s.d}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════
const NAV = [
  {id:"dashboard",icon:"▦",label:"Dashboard"},
  {id:"procurement",icon:"📋",label:"Procurement"},
  {id:"inventory",icon:"🪨",label:"Inventory"},
  {id:"production",icon:"⚙️",label:"Production"},
  {id:"sales",icon:"💼",label:"Sales"},
  {id:"design",icon:"📐",label:"Design Planner"},
];
const ROLES = [{id:"director",label:"Director",color:C.gold},{id:"manager",label:"Manager",color:C.blue},{id:"sales",label:"Sales",color:C.green},{id:"warehouse",label:"Warehouse",color:C.amber}];
const PAGE_LABELS = {dashboard:"Operations Dashboard",procurement:"Procurement Desk",inventory:"Inventory Tracker",production:"Production & Recovery",sales:"Sales Desk",design:"Design Planner"};
const RATES = {"USD":"3.6725","EUR":"3.9820","INR":"0.0431"};

export default function App() {
  const [page,setPage] = useState("dashboard");
  const [role,setRole] = useState("director");
  const [collapsed,setCollapsed] = useState(false);

  return (
    <div style={{fontFamily:"'Outfit',sans-serif",background:C.bg,minHeight:"100vh",color:C.text,display:"flex"}}>
      {/* Sidebar */}
      <div style={{width:collapsed?56:220,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,bottom:0,zIndex:20,transition:"width .2s",overflowX:"hidden"}}>
        {/* Brand */}
        <div style={{padding:collapsed?"16px 12px":"20px 18px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:72}}>
          {!collapsed&&(
            <div>
              <div style={{fontSize:19,fontWeight:900,letterSpacing:-1,fontFamily:"'DM Serif Display',serif",lineHeight:1}}>
                <span style={{color:C.text}}>X</span><span style={{color:C.gold}}>Marbles</span>
              </div>
              <div style={{fontSize:8,color:C.textDim,letterSpacing:1.5,textTransform:"uppercase",marginTop:2}}>Trading LLC</div>
            </div>
          )}
          {collapsed&&<span style={{fontSize:18,fontWeight:900,color:C.gold}}>X</span>}
          <button onClick={()=>setCollapsed(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:14,padding:2,marginLeft:collapsed?"auto":0}}>
            {collapsed?"›":"‹"}
          </button>
        </div>

        {/* Role switcher */}
        {!collapsed&&(
          <div style={{padding:"8px 12px",borderBottom:`1px solid ${C.border}`}}>
            <div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:0.8,marginBottom:5}}>View As</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>
              {ROLES.map(r=>(
                <button key={r.id} onClick={()=>setRole(r.id)}
                  style={{padding:"4px 6px",borderRadius:5,border:role===r.id?`1px solid ${r.color}44`:"1px solid transparent",cursor:"pointer",fontSize:10,fontFamily:"inherit",fontWeight:role===r.id?700:400,background:role===r.id?r.color+"22":"transparent",color:role===r.id?r.color:C.textDim}}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{padding:"10px 6px",flex:1}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setPage(n.id)} title={n.label}
              style={{width:"100%",display:"flex",alignItems:"center",gap:collapsed?0:10,padding:collapsed?"10px 14px":"9px 12px",borderRadius:8,border:"none",cursor:"pointer",justifyContent:collapsed?"center":"flex-start",
                background:page===n.id?C.goldBg:"transparent",color:page===n.id?C.gold:C.textMuted,fontWeight:page===n.id?700:400,fontSize:13,fontFamily:"inherit",textAlign:"left",marginBottom:2,
                borderLeft:page===n.id&&!collapsed?`2px solid ${C.gold}`:"2px solid transparent",transition:"all .15s"}}>
              <span style={{fontSize:14,opacity:page===n.id?1:0.7,flexShrink:0}}>{n.icon}</span>
              {!collapsed&&n.label}
            </button>
          ))}
        </nav>

        {/* BUSY bridge */}
        {!collapsed&&(
          <div style={{margin:10,padding:"8px 12px",background:"#0d0d0f",borderRadius:8,border:`1px solid ${C.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
              <span style={{fontSize:9,color:C.goldDim,fontWeight:700,letterSpacing:0.8,textTransform:"uppercase"}}>BUSY Bridge</span>
              <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:6,height:6,borderRadius:"50%",background:C.green,display:"inline-block"}}/><span style={{fontSize:9,color:C.green}}>Live</span></div>
            </div>
            <div style={{fontSize:9,color:C.textDim}}>Synced today · v21 Saffron</div>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{marginLeft:collapsed?56:220,flex:1,display:"flex",flexDirection:"column",transition:"margin-left .2s",minWidth:0}}>
        {/* Topbar */}
        <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"10px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10,flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:0.8}}>X Marbles Trading LLC</div>
            <div style={{fontSize:16,fontWeight:700,fontFamily:"'DM Serif Display',serif",color:C.text}}>{PAGE_LABELS[page]}</div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            {Object.entries(RATES).map(([cur,rate])=>(
              <div key={cur} style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:9,color:C.textDim}}>{cur}/AED</span>
                <span style={{fontSize:11,fontWeight:700,color:C.gold}}>{rate}</span>
              </div>
            ))}
            <div style={{width:1,height:16,background:C.border}}/>
            <div style={{fontSize:11,color:C.textMuted}}>{todayStr()}</div>
            <div style={{background:ROLES.find(r=>r.id===role)?.color+"22",borderRadius:20,padding:"4px 12px",fontSize:11,color:ROLES.find(r=>r.id===role)?.color,fontWeight:700,border:`1px solid ${ROLES.find(r=>r.id===role)?.color}44`,whiteSpace:"nowrap"}}>
              {ROLES.find(r=>r.id===role)?.label}
            </div>
          </div>
        </div>

        {/* Page */}
        <div style={{padding:"20px 22px",flex:1}}>
          {page==="dashboard"&&<Dashboard/>}
          {page==="procurement"&&<Procurement/>}
          {page==="inventory"&&<Inventory/>}
          {page==="production"&&<Production/>}
          {page==="sales"&&<Sales/>}
          {page==="design"&&<DesignPlanner/>}
        </div>
      </div>
    </div>
  );
}
