import { useState, useEffect, useCallback } from "react"

/* ── design tokens — used only for dynamic inline colors ── */
const T = {
  ink: "#1A1A1A",
  ink2: "#3D3D3D",
  ink3: "#6B6B6B",
  ink4: "#A3A3A3",
  rose: "#FF385C",
  green: "#1A7F37",
  greenSoft: "#DAFBE1",
  amber: "#BF8700",
  amberSoft: "#FFF8C5",
  red: "#CF222E",
  redSoft: "#FFEBE9",
  blue: "#0969DA",
  blueSoft: "#DDF4FF",
  purple: "#8250DF",
  purpleSoft: "#FBEFFF"
}

const DISTRICTS = [
  {id:"friedenau",name:"Friedenau",priceRange:[6000,7500],allIn75:[486000,607000],complexes:"3–6",probability:"25–35%",budgetFit:"yes",schoolRating:"good",ndh:"25–35%",germanPct:"65–75%",goodSchools:"3–4",schoolNames:"Stechlinsee-GS, Ruppin-GS, Fläming-GS",notes:"Best balance. Friedenauer Höhe (Q4 2026). S1/U9 Bundesplatz, 20–25 min HBF.",knownComplexes:"Friedenauer Höhe, Handjerystr, Rubensstr",ring:true},
  {id:"pankow",name:"Pankow-Süd",priceRange:[6500,7500],allIn75:[526000,607000],complexes:"5–8",probability:"20–30%",budgetFit:"yes",schoolRating:"excellent",ndh:"20–28%",germanPct:"72–80%",goodSchools:"5–7",schoolNames:"Elizabeth-Shaw-GS, Arnold-Zweig-GS, GS unter den Bäumen",notes:"Outside Ring, BEST schools. Bezirk Pankow = 24.8% ndH.",knownComplexes:"Immergrün, Thulestr. 40, Thule48",ring:false},
  {id:"weissensee",name:"Weißensee",priceRange:[6000,7200],allIn75:[486000,583000],complexes:"3–5",probability:"15–20%",budgetFit:"yes",schoolRating:"excellent",ndh:"20–30%",germanPct:"70–80%",goodSchools:"3–5",schoolNames:"Schule am Hamburger Platz, GS im Moselviertel",notes:"Outside Ring exception. Southern strip near S Greifswalder.",knownComplexes:"Charlottenburger Str. 48–49, Langhansstr",ring:false},
  {id:"wilmersdorf",name:"Wilmersdorf-Süd",priceRange:[6500,7800],allIn75:[526000,632000],complexes:"5–8",probability:"20–25%",budgetFit:"yes",schoolRating:"good",ndh:"25–38%",germanPct:"62–75%",goodSchools:"4–5",schoolNames:"Birger-Forell-GS, Cecilien-GS, Eisenzahn-GS",notes:"4.8% without BBR (2nd best). U7/U3, 25–30 min HBF.",knownComplexes:"Wilhelmsaue 32, Aachener Str. 35–38",ring:true},
  {id:"moabit",name:"Moabit",priceRange:[6500,8000],allIn75:[526000,648000],complexes:"8–12",probability:"20–25%",budgetFit:"yes",schoolRating:"poor",ndh:"55–75%",germanPct:"25–45%",goodSchools:"0–2",schoolNames:"Bezirk Mitte = 75% ndH",notes:"Best transit (10–15 min HBF), worst schools.",knownComplexes:"Lehrter Str 23–25c, Seydlitzstr, Rathenower Str",ring:true},
  {id:"bavarian",name:"Bavarian Quarter",priceRange:[6500,8000],allIn75:[526000,648000],complexes:"3–5",probability:"10–15%",budgetFit:"yes",schoolRating:"good",ndh:"30–42%",germanPct:"58–70%",goodSchools:"2–3",schoolNames:"Barbarossa-GS, Spreewald-GS",notes:"Best part of T-Schöneberg. Limited modern stock.",knownComplexes:"Kernsanierung Altbau",ring:true},
  {id:"charlottenburg",name:"Charlottenburg",priceRange:[7000,8500],allIn75:[567000,688000],complexes:"5–8",probability:"10–15%",budgetFit:"tight",schoolRating:"good",ndh:"28–45%",germanPct:"55–72%",goodSchools:"3–5",schoolNames:"Lietzensee-GS, Wald-GS",notes:"57.4% Abitur (best). Lower half fits.",knownComplexes:"Kantstr, Sophie-Charlotten-Str",ring:true},
  {id:"prenzlberg",name:"Prenzlauer Berg",priceRange:[7500,9500],allIn75:[607000,769000],complexes:"10–15",probability:"5–10%",budgetFit:"tight",schoolRating:"excellent",ndh:"15–25%",germanPct:"75–85%",goodSchools:"8–12",schoolNames:"Thomas-Mann-GS, Bötzow-GS",notes:"Excellent schools but expensive.",knownComplexes:"Greifswalder Str, Bötzowviertel",ring:true},
  {id:"mitte",name:"Mitte",priceRange:[8000,10000],allIn75:[648000,810000],complexes:"5–8",probability:"5–8%",budgetFit:"over",schoolRating:"poor",ndh:"65–80%",germanPct:"20–35%",goodSchools:"0–1",schoolNames:"75% ndH. Papageno-GS only",notes:"Too expensive + bad schools.",knownComplexes:"Mittenmang, Chausseestr",ring:true},
  {id:"friedrichswerder",name:"Friedrichswerder",priceRange:[9000,12000],allIn75:[729000,972000],complexes:"1–2",probability:"<1%",budgetFit:"no",schoolRating:"poor",ndh:"65–80%",germanPct:"20–35%",goodSchools:"0",schoolNames:"No acceptable schools",notes:"Unrealistic.",knownComplexes:"Kronprinzengärten",ring:true},
  {id:"other",name:"Other",priceRange:[5000,10000],allIn75:[0,0],complexes:"—",probability:"—",budgetFit:"unknown",schoolRating:"unknown",ndh:"—",germanPct:"—",goodSchools:"—",schoolNames:"—",notes:"",knownComplexes:"—",ring:false}
]

const DEMOJI = {friedenau:"🌿",pankow:"🌲",weissensee:"🌳",wilmersdorf:"🏘️",moabit:"🌉",bavarian:"🎭",charlottenburg:"👑",prenzlberg:"☕",mitte:"🏛️",friedrichswerder:"🏰",other:"📍"}

const ENERGY = ["A+","A","B","C","D","E","F","G","H"]

const SCENARIOS = [
  {id:"anchor",name:"Anchor",label:"A",maxAllIn:620000,minM2:75,minRooms:3,yearMin:2005,yearMax:2025},
  {id:"s1",name:"Kernsaniert",label:"1",maxAllIn:550000,minM2:75,minRooms:3,yearMin:1900,yearMax:2025},
  {id:"s2",name:"Neubau",label:"2",maxAllIn:590000,minM2:70,minRooms:2.5,yearMin:2020,yearMax:2030},
  {id:"s3",name:"Modern Best.",label:"3",maxAllIn:600000,minM2:71,minRooms:3,yearMin:2005,yearMax:2020},
  {id:"s4",name:"Pankow",label:"4",maxAllIn:600000,minM2:72,minRooms:3,yearMin:2012,yearMax:2025}
]

const STATUS_OPTS = [
  {id:"new",label:"New",color:T.blue,bg:T.blueSoft},
  {id:"viewed",label:"Viewed",color:T.amber,bg:T.amberSoft},
  {id:"contacted",label:"Contacted",color:T.purple,bg:T.purpleSoft},
  {id:"offer",label:"Offer",color:T.green,bg:T.greenSoft},
  {id:"rejected",label:"Rejected",color:T.red,bg:T.redSoft}
]

const fmt = function(n) { return typeof n === "number" ? n.toLocaleString("de-DE") : "" }

function calcAllIn(p, b) {
  return Math.round(p * (1 + 0.06 + 0.02 + (b ? 0.0357 : 0)))
}

function scoreScenarios(l) {
  var a = calcAllIn(l.price, l.broker)
  return SCENARIOS.map(function(sc) {
    var ch = [
      {name:"Budget", pass: a <= sc.maxAllIn},
      {name:"Size", pass: l.size >= sc.minM2},
      {name:"Rooms", pass: l.rooms >= sc.minRooms},
      {name:"Year", pass: l.year >= sc.yearMin && l.year <= sc.yearMax},
      {name:"Floor", pass: l.floor > 0 && l.floor < l.totalFloors},
      {name:"Energy", pass: (function() {
        var i = ENERGY.indexOf(l.energy), m = ENERGY.indexOf("C")
        return i >= 0 && m >= 0 && i <= m
      })()}
    ]
    var passed = ch.filter(function(c) { return c.pass }).length
    return Object.assign({}, sc, {checks: ch, passed: passed, total: ch.length, fit: passed === ch.length})
  })
}

/* ── SEEDS ── */
const SEEDS = [
  {id:"ch48c11",address:"Charlottenburger Str. 48–49, WE C1.1",district:"weissensee",price:475000,size:67.25,rooms:3,floor:1,totalFloors:4,year:2023,energy:"B",broker:false,kfw:"",url:"https://kolarski.landingpage.immobilien/public/a/einheit/uNHLVfGYiAoMrSFQ8tx3vBbC/3C31RAgiPLnCHdUwUyqUZqhR",status:"contacted",created:"2025-05-14T10:00:00Z",
    notes:"🔑 KEY. Target €430–450K + parking. Viewing #2 Sat 13:00.",
    ev:{verdict:"conditional",vt:"⚠️ CONDITIONAL — fits budget at negotiated price, but fails size/Ring/transit.",
      building:"2023, 4 fl, VICTORIA GmbH, Zvi Hecker, 84 ETW",unit:"3 rooms, 67.25 m², 1.OG, Energieklasse B",transit:"25–35 min HBF (Tram only)",schools:"Pankow — 24.8% ndH",parks:"Weißer See",hausgeld:280,
      hc:[["Not EG",true,"1.OG"],["Not DG",true,"1/4"],["Inside Ring",false,"Weißensee"],["U/S ≤15min",false,"No U/S"],["Parks",true,"Weißer See"],["Schools <40%",true,"~25%"],["Budget",true,"€513K"],["Size ≥72m²",false,"67.25m²"],["HBF",false,"25–35min"]],
      pros:["Neubau 2023","No broker","Active WEG Beirat","Target €430–450K","Best school district","Liked in person","Parking available"],
      cons:["67m² < 72m² min","Outside Ring, no U/S","25–35 min HBF","5 Gutachten (defects)","Lawsuit vs VICTORIA GmbH","2 water incidents 2025","Hausgeld €280 +21%/2yr","Sanierungsgebiet"],
      qs:["Negotiate €430–450K + parking","WoFlV Loggia coefficient?","Lawsuit status","Steigleitung scope","Ausgleichsbetrag"],
      eq:["Fußbodenheizung","Fernwärme","Aufzug","Loggia","Fahrradraum","TG-Stellplatz","Keller"]}},
  {id:"kurf46",address:"Kurfürstenstraße 46, 10785 Berlin",district:"mitte",price:640000,size:75,rooms:3,floor:2,totalFloors:6,year:2021,energy:"A",broker:true,kfw:"",url:"https://immodo-berlin.landingpage.immobilien/public/a/einheit/N8LpigcFb6ZuXSkaNMWeiHjh/sJzFNd53o9uYfvLCnjbEhFDg",status:"rejected",created:"2025-05-13T10:00:00Z",
    notes:"❌ All-in €714K = over budget. Straßenstrich.",
    ev:{verdict:"rejected",vt:"❌ PASS — over budget +€74K, Straßenstrich, bad schools.",
      building:"2021, 6 fl, IMMODO Berlin, Luxus Neubau",unit:"3 rooms, 75 m², 2.OG, Energieklasse A",transit:"~10–12 min HBF",schools:"Mitte — 75% ndH",parks:"Tiergarten, Gleisdreieck",hausgeld:438,
      hc:[["Not EG",true,"2.OG"],["Not DG",true,"2/6"],["Inside Ring",true,"Yes"],["U/S ≤15min",true,"U1/U2 ~8min"],["Parks",true,"Tiergarten"],["Schools <40%",false,"75% ndH"],["Budget",false,"€714K"],["Location",false,"Straßenstrich"]],
      pros:["Baujahr 2021 neuwertig","Energieklasse A","Fernwärme + FBH","Luxus Ausstattung","~10 min HBF"],
      cons:["Straßenstrich location","€714K over budget","Hausgeld €438","1 bath for 3 rooms","Mitte 75% ndH"],
      qs:["WEG Wirtschaftsplan","Teilungserklärung","Visit evening","Schulsprengel"],
      eq:["Fußbodenheizung","Fernwärme","Aufzug","Markenküche","Parkett","Elektrische Jalousien","Südbalkon","Keller","Barrierefrei"]}}
]

/* ── storage (localStorage) ── */
const SK = "berlin-triage-listings"

function loadLst() {
  var s = []
  try {
    var r = localStorage.getItem(SK)
    if (r) s = JSON.parse(r)
  } catch (e) {
    console.error(e)
  }
  var ids = new Set(SEEDS.map(function(x) { return x.id }))
  var ext = s.filter(function(l) { return !ids.has(l.id) })
  var sm = {}
  s.forEach(function(l) { sm[l.id] = l.status })
  return SEEDS.map(function(x) {
    return sm[x.id] ? Object.assign({}, x, {status: sm[x.id]}) : x
  }).concat(ext)
}

function saveLst(a) {
  try { localStorage.setItem(SK, JSON.stringify(a)) }
  catch (e) { console.error(e) }
}

/* ── Pill ── */
function Pill({text, color, bg}) {
  return <span className="pill" style={{color: color, background: bg}}>{text}</span>
}

/* ── Score dots ── */
function Dots({l}) {
  var r = scoreScenarios(l)
  return (
    <div className="dots">
      {r.map(function(s) {
        return (
          <span
            key={s.id}
            className="dot"
            style={{
              background: s.fit ? T.greenSoft : "#F7F7F5",
              color: s.fit ? T.green : T.ink4
            }}
          >{s.label}</span>
        )
      })}
    </div>
  )
}

/* ── Collapsible section ── */
function Sec({title, children, open: io}) {
  var s = useState(io !== false)
  var open = s[0]
  var setOpen = s[1]
  return (
    <div className="sec-wrap">
      <div
        onClick={function() { setOpen(!open) }}
        className={"sec-head" + (open ? "" : " sec-head-closed")}
      >
        <span className="sec-title">{title}</span>
        <span className={"sec-chev" + (open ? " sec-chev-open" : "")}>▾</span>
      </div>
      {open && <div className="sec-body">{children}</div>}
    </div>
  )
}

/* ── Detail page ── */
function Detail({l, onBack, onStatus, onDel}) {
  var allIn = calcAllIn(l.price, l.broker)
  var ppm = Math.round(l.price / l.size)
  var dist = DISTRICTS.find(function(d) { return d.id === l.district })
  var st = STATUS_OPTS.find(function(s) { return s.id === l.status }) || STATUS_OPTS[0]
  var res = scoreScenarios(l)
  var ev = l.ev
  var gst = Math.round(l.price * 0.06)
  var nt = Math.round(l.price * 0.02)
  var mk = l.broker ? Math.round(l.price * 0.0357) : 0
  var row = function(a, b, c) {
    return (
      <div className="row">
        <span className="row-label">{a}</span>
        <span className="row-value" style={c ? {color: c} : null}>{b}</span>
      </div>
    )
  }
  var verdictBg = ev && (ev.verdict === "rejected" ? T.redSoft : ev.verdict === "match" ? T.greenSoft : T.amberSoft)
  var verdictFg = ev && (ev.verdict === "rejected" ? T.red : ev.verdict === "match" ? T.green : T.amber)
  return (
    <div className="bottom-spacer">
      <div className="topbar">
        <button onClick={onBack} className="btn-text">← Back</button>
        <Pill text={st.label} color={st.color} bg={st.bg} />
      </div>
      <div className="detail-hero">
        <div className="detail-addr">{l.address}</div>
        <div className="detail-sub">{dist ? (DEMOJI[dist.id] || "") + " " + dist.name : "?"} · {l.rooms} rooms · {l.size} m² · {l.year}</div>
        <div className="detail-price-row">
          <span className="detail-price">€{fmt(allIn)}</span>
          <span className="detail-price-tag">all-in</span>
        </div>
        <div className="detail-meta">€{fmt(l.price)} · €{fmt(ppm)}/m² · {l.broker ? "Makler" : "Provisionsfrei"}</div>
      </div>
      <div className="divider" />
      <div className="detail-body">
        {ev && (
          <div className="verdict-box" style={{background: verdictBg}}>
            <div className="verdict-label" style={{color: verdictFg}}>Verdict</div>
            <div className="verdict-text">{ev.vt}</div>
          </div>
        )}
        {ev && (
          <Sec title="Summary">
            {row("Building", ev.building)}
            {row("Unit", ev.unit)}
            {row("Transit", ev.transit)}
            {row("Schools", ev.schools, ev.schools.indexOf("75%") >= 0 ? T.red : T.ink)}
            {row("Parks", ev.parks)}
            {ev.hausgeld ? row("Hausgeld", "€" + ev.hausgeld + "/mo") : null}
          </Sec>
        )}
        <Sec title="Budget">
          {row("Kaufpreis", "€" + fmt(l.price))}
          {row("Grunderwerbsteuer", "€" + fmt(gst))}
          {row("Notar + Grundbuch", "€" + fmt(nt))}
          {l.broker ? row("Makler", "€" + fmt(mk)) : null}
          <div className="budget-total">
            <span className="budget-total-label">Total all-in</span>
            <span className="budget-total-value" style={{color: allIn <= 640000 ? T.green : T.red}}>€{fmt(allIn)}</span>
          </div>
          {allIn > 640000 && (
            <div className="budget-warn">Over budget by €{fmt(allIn - 640000)}</div>
          )}
        </Sec>
        {ev && ev.hc && (
          <Sec title="Requirements">
            {ev.hc.map(function(h, i) {
              return (
                <div key={i} className="req-row">
                  <span className="icon-sq icon-sq-text" style={{background: h[1] ? T.greenSoft : T.redSoft}}>{h[1] ? "✓" : "✗"}</span>
                  <span className="req-label">{h[0]}</span>
                  <span className="req-detail" style={{color: h[1] ? T.green : T.red}}>{h[2]}</span>
                </div>
              )
            })}
          </Sec>
        )}
        <Sec title="Scenarios" open={false}>
          {res.map(function(r) {
            return (
              <div key={r.id} className="scenario-row">
                <div className="scenario-head">
                  <span
                    className="icon-sq"
                    style={{
                      background: r.fit ? T.greenSoft : "#F7F7F5",
                      color: r.fit ? T.green : T.ink4,
                      fontSize: 11,
                      fontWeight: 700
                    }}
                  >{r.label}</span>
                  <span className="scenario-name" style={{color: r.fit ? T.ink : T.ink3}}>{r.name}</span>
                  <span className="scenario-pass" style={{color: r.fit ? T.green : T.ink4}}>{r.passed}/{r.total}</span>
                </div>
                <div className="scenario-checks">
                  {r.checks.map(function(ch, i) {
                    return (
                      <span
                        key={i}
                        className="check-chip"
                        style={{
                          background: ch.pass ? T.greenSoft : T.redSoft,
                          color: ch.pass ? T.green : T.red
                        }}
                      >{ch.name}</span>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </Sec>
        {ev && ev.pros && (
          <Sec title="Pros" open={false}>
            {ev.pros.map(function(p, i) {
              return (
                <div key={i} className="proco-row">
                  <span className="proco-icon" style={{background: T.greenSoft, color: T.green}}>+</span>
                  <span className="proco-text">{p}</span>
                </div>
              )
            })}
          </Sec>
        )}
        {ev && ev.cons && (
          <Sec title="Cons" open={false}>
            {ev.cons.map(function(p, i) {
              return (
                <div key={i} className="proco-row">
                  <span className="proco-icon" style={{background: T.redSoft, color: T.red}}>−</span>
                  <span className="proco-text">{p}</span>
                </div>
              )
            })}
          </Sec>
        )}
        {ev && ev.eq && (
          <Sec title="Ausstattung" open={false}>
            <div className="flex flex-wrap gap-1.5">
              {ev.eq.map(function(a, i) {
                return <span key={i} className="eq-tag">{a}</span>
              })}
            </div>
          </Sec>
        )}
        {ev && ev.qs && (
          <Sec title="Questions" open={false}>
            {ev.qs.map(function(q, i) {
              return (
                <div key={i} className="qs-row">{i + 1}. {q}</div>
              )
            })}
          </Sec>
        )}
        {l.notes && (
          <Sec title="Notes" open={false}>
            <div className="notes-text">{l.notes}</div>
          </Sec>
        )}
        <div className="action-row">
          <select
            value={l.status}
            onChange={function(e) { onStatus(l.id, e.target.value) }}
            className="select"
          >
            {STATUS_OPTS.map(function(s) {
              return <option key={s.id} value={s.id}>{s.label}</option>
            })}
          </select>
          <button
            onClick={function() {
              if (confirm("Delete?")) { onDel(l.id); onBack() }
            }}
            className="btn-danger"
          >Delete</button>
        </div>
      </div>
      {l.url && (
        <div className="fixed-cta">
          <a href={l.url} target="_blank" rel="noopener noreferrer" className="btn-dark">View listing →</a>
        </div>
      )}
    </div>
  )
}

/* ── Districts ── */
function DistrictsTab() {
  var s = useState(0)
  var openIdx = s[0]
  var setOpenIdx = s[1]
  var vis = DISTRICTS.filter(function(d) { return d.id !== "other" })
  var bLabel = function(f) {
    if (f === "yes") return {t: "In budget", c: T.green, b: T.greenSoft}
    if (f === "tight") return {t: "Tight", c: T.amber, b: T.amberSoft}
    return {t: "Over", c: T.red, b: T.redSoft}
  }
  var sLabel = function(r) {
    if (r === "excellent") return {t: "★★★", c: T.green}
    if (r === "good") return {t: "★★☆", c: T.blue}
    if (r === "poor") return {t: "★☆☆", c: T.red}
    return {t: "—", c: T.ink4}
  }
  return (
    <div className="tab-pad">
      {vis.map(function(d, i) {
        var bg = bLabel(d.budgetFit)
        var sc = sLabel(d.schoolRating)
        var isOpen = openIdx === i
        return (
          <div key={d.id} className="card mb-2.5">
            <div onClick={function() { setOpenIdx(isOpen ? -1 : i) }} className="dist-head">
              <div>
                <div className="dist-name">{(DEMOJI[d.id] || "") + " " + d.name}</div>
                <div className="dist-price">€{fmt(d.priceRange[0])}–{fmt(d.priceRange[1])}/m²</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold" style={{color: sc.c}}>{sc.t}</span>
                <Pill text={bg.t} color={bg.c} bg={bg.b} />
              </div>
            </div>
            {isOpen && (
              <div className="dist-body">
                <div className="dist-stat-grid">
                  <div className="dist-stat">
                    <div className="dist-stat-label">75 m² all-in</div>
                    <div className="dist-stat-value">€{fmt(d.allIn75[0])}–{fmt(d.allIn75[1])}</div>
                  </div>
                  <div className="dist-stat">
                    <div className="dist-stat-label">Complexes</div>
                    <div className="dist-stat-value">{d.complexes} · {d.probability}</div>
                  </div>
                </div>
                <div className="dist-line mt-2.5"><b>Schools:</b> {d.schoolNames}</div>
                <div className="dist-line mt-1.5">ndH: {d.ndh} · German: {d.germanPct} · {d.goodSchools} good GS</div>
                <div className="text-[13px] text-ink2 leading-relaxed mt-2">{d.notes}</div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Listings ── */
function ListingsTab({listings, onOpen}) {
  var s = useState("all")
  var filter = s[0]
  var setFilter = s[1]
  var filtered = filter === "all" ? listings : listings.filter(function(l) { return l.status === filter })
  if (!listings.length) {
    return (
      <div className="empty">
        <div className="empty-icon">🏠</div>
        <div className="empty-title">No listings yet</div>
        <div className="empty-sub">Paste a listing in chat to get started</div>
      </div>
    )
  }
  return (
    <div className="tab-pad">
      <div className="filter-strip">
        {[{id:"all", label:"All (" + listings.length + ")"}].concat(STATUS_OPTS).map(function(s) {
          return (
            <button
              key={s.id}
              onClick={function() { setFilter(s.id) }}
              className={filter === s.id ? "chip-on" : "chip-off"}
            >{s.label}</button>
          )
        })}
      </div>
      {filtered.slice().sort(function(a, b) { return new Date(b.created) - new Date(a.created) }).map(function(l) {
        var allIn = calcAllIn(l.price, l.broker)
        var ppm = Math.round(l.price / l.size)
        var dist = DISTRICTS.find(function(d) { return d.id === l.district })
        var st = STATUS_OPTS.find(function(s) { return s.id === l.status }) || STATUS_OPTS[0]
        return (
          <div key={l.id} onClick={function() { onOpen(l.id) }} className="card mb-3 cursor-pointer">
            <div className="card-pad">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <div className="listing-addr">{l.address}</div>
                  <div className="listing-meta">{dist ? (DEMOJI[dist.id] || "") + " " + dist.name : "?"} · {l.rooms} rm · {l.size} m² · {l.year}</div>
                </div>
                <Pill text={st.label} color={st.color} bg={st.bg} />
              </div>
              <div className="flex justify-between items-center mt-2.5">
                <div>
                  <span className="price-big">€{fmt(allIn)}</span>
                  <span className="price-ppm">€{fmt(ppm)}/m²</span>
                </div>
                <Dots l={l} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Add ── */
function AddTab({onSave}) {
  var s = useState({address:"",district:"moabit",price:"",size:"",rooms:"3",floor:"",totalFloors:"",year:"",energy:"B",broker:false,kfw:"",url:"",notes:""})
  var f = s[0]
  var setF = s[1]
  var set = function(k, v) {
    setF(function(p) {
      var n = {}
      Object.keys(p).forEach(function(x) { n[x] = p[x] })
      n[k] = v
      return n
    })
  }
  var valid = f.address && f.price && f.size && f.year && f.floor && f.totalFloors
  return (
    <div className="add-pad">
      <div className="add-title">Add listing</div>
      <div className="field">
        <label className="label">Address</label>
        <input className="input" value={f.address} onChange={function(e) { set("address", e.target.value) }} placeholder="Lehrter Str. 25" />
      </div>
      <div className="field">
        <label className="label">District</label>
        <select className="input" value={f.district} onChange={function(e) { set("district", e.target.value) }}>
          {DISTRICTS.map(function(d) { return <option key={d.id} value={d.id}>{d.name}</option> })}
        </select>
      </div>
      <div className="grid-2">
        <div>
          <label className="label">Price €</label>
          <input className="input" type="number" value={f.price} onChange={function(e) { set("price", e.target.value) }} />
        </div>
        <div>
          <label className="label">Size m²</label>
          <input className="input" type="number" value={f.size} onChange={function(e) { set("size", e.target.value) }} />
        </div>
      </div>
      <div className="grid-2">
        <div>
          <label className="label">Rooms</label>
          <input className="input" type="number" step="0.5" value={f.rooms} onChange={function(e) { set("rooms", e.target.value) }} />
        </div>
        <div>
          <label className="label">Year</label>
          <input className="input" type="number" value={f.year} onChange={function(e) { set("year", e.target.value) }} />
        </div>
      </div>
      <div className="grid-2">
        <div>
          <label className="label">Floor</label>
          <input className="input" type="number" value={f.floor} onChange={function(e) { set("floor", e.target.value) }} />
        </div>
        <div>
          <label className="label">Total floors</label>
          <input className="input" type="number" value={f.totalFloors} onChange={function(e) { set("totalFloors", e.target.value) }} />
        </div>
      </div>
      <div className="grid-2">
        <div>
          <label className="label">Energy</label>
          <select className="input" value={f.energy} onChange={function(e) { set("energy", e.target.value) }}>
            {ENERGY.map(function(e) { return <option key={e}>{e}</option> })}
          </select>
        </div>
        <div>
          <label className="label">KfW</label>
          <input className="input" value={f.kfw} onChange={function(e) { set("kfw", e.target.value) }} />
        </div>
      </div>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={f.broker}
          onChange={function(e) { set("broker", e.target.checked) }}
          style={{width: 20, height: 20, accentColor: T.rose}}
        /> Broker (3.57%)
      </label>
      {f.price && f.size ? (
        <div className="preview-box">
          <span className="preview-label">Preview: </span>
          <span className="preview-text">€{fmt(Math.round(Number(f.price) / Number(f.size)))}/m² · All-in €{fmt(calcAllIn(Number(f.price), f.broker))}</span>
        </div>
      ) : null}
      <div className="field">
        <label className="label">URL</label>
        <input className="input" value={f.url} onChange={function(e) { set("url", e.target.value) }} />
      </div>
      <div className="field mb-5">
        <label className="label">Notes</label>
        <textarea className="input-area" value={f.notes} onChange={function(e) { set("notes", e.target.value) }} />
      </div>
      <button
        onClick={function() {
          onSave({
            address: f.address,
            district: f.district,
            id: Date.now().toString(36),
            price: Number(f.price),
            size: Number(f.size),
            rooms: Number(f.rooms),
            floor: Number(f.floor),
            totalFloors: Number(f.totalFloors),
            year: Number(f.year),
            energy: f.energy,
            broker: f.broker,
            kfw: f.kfw,
            url: f.url,
            notes: f.notes,
            status: "new",
            created: new Date().toISOString()
          })
          setF({address:"",district:"moabit",price:"",size:"",rooms:"3",floor:"",totalFloors:"",year:"",energy:"B",broker:false,kfw:"",url:"",notes:""})
        }}
        disabled={!valid}
        className={valid ? "btn-primary" : "btn-primary-disabled"}
      >Save listing</button>
    </div>
  )
}

/* ── App ── */
export default function App() {
  var ts = useState("listings")
  var tab = ts[0]
  var setTab = ts[1]
  var ls = useState(SEEDS)
  var listings = ls[0]
  var setListings = ls[1]
  var ld = useState(false)
  var loaded = ld[0]
  var setLoaded = ld[1]
  var ds = useState(null)
  var detailId = ds[0]
  var setDetailId = ds[1]
  useEffect(function() {
    setListings(loadLst())
    setLoaded(true)
  }, [])
  useEffect(function() {
    if (loaded) saveLst(listings)
  }, [listings, loaded])
  var addL = useCallback(function(l) {
    setListings(function(p) { return p.concat([l]) })
    setTab("listings")
  }, [])
  var delL = useCallback(function(id) {
    setListings(function(p) { return p.filter(function(l) { return l.id !== id }) })
    setDetailId(null)
  }, [])
  var chSt = useCallback(function(id, st) {
    setListings(function(p) {
      return p.map(function(l) { return l.id === id ? Object.assign({}, l, {status: st}) : l })
    })
  }, [])
  var dl = detailId ? listings.find(function(l) { return l.id === detailId }) : null
  if (dl) {
    return (
      <div className="app-shell">
        <Detail l={dl} onBack={function() { setDetailId(null) }} onStatus={chSt} onDel={delL} />
      </div>
    )
  }
  var tabs = [
    {id:"districts", icon:"🗺️", label:"Districts"},
    {id:"listings", icon:"📋", label:"Listings"},
    {id:"add", icon:"➕", label:"Add"}
  ]
  return (
    <div className="app-shell">
      <div className="app-header">
        <div className="app-eyebrow">Berlin</div>
        <div className="app-title">Apartment Search</div>
        <div className="stats-row">
          {[["Budget", "€640K"], ["/m² max", "~€7.9K"], ["Tracked", "" + listings.length]].map(function(x, i) {
            return (
              <div key={i}>
                <div className="stat-label">{x[0]}</div>
                <div className="stat-value">{x[1]}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="tabs">
        {tabs.map(function(t) {
          return (
            <button
              key={t.id}
              onClick={function() { setTab(t.id) }}
              className={"tab-btn " + (tab === t.id ? "tab-btn-on" : "tab-btn-off")}
            >
              <div className="tab-icon">{t.icon}</div>{t.label}
            </button>
          )
        })}
      </div>
      {tab === "districts" && <DistrictsTab />}
      {tab === "listings" && <ListingsTab listings={listings} onOpen={setDetailId} />}
      {tab === "add" && <AddTab onSave={addL} />}
    </div>
  )
}
