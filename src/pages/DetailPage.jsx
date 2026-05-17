import { useNavigate } from "react-router-dom"
import { DISTRICTS, DEMOJI } from "../data/districts.js"
import { T, STATUS_OPTS } from "../data/constants.js"
import { calcAllIn, scoreScenarios, fmt } from "../utils/calculations.js"
import { Pill } from "../components/Pill.jsx"
import { Section } from "../components/Section.jsx"

export function DetailPage({l, onStatus, onDel}) {
  var navigate = useNavigate()
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
        <button onClick={function() { navigate("/") }} className="btn-text">← Pipeline</button>
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
          <Section title="Summary">
            {row("Building", ev.building)}
            {row("Unit", ev.unit)}
            {row("Transit", ev.transit)}
            {row("Schools", ev.schools, ev.schools.indexOf("75%") >= 0 ? T.red : T.ink)}
            {row("Parks", ev.parks)}
            {ev.hausgeld ? row("Hausgeld", "€" + ev.hausgeld + "/mo") : null}
          </Section>
        )}
        <Section title="Budget">
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
        </Section>
        {ev && ev.hc && (
          <Section title="Requirements">
            {ev.hc.map(function(h, i) {
              return (
                <div key={i} className="req-row">
                  <span className="icon-sq icon-sq-text" style={{background: h[1] ? T.greenSoft : T.redSoft}}>{h[1] ? "✓" : "✗"}</span>
                  <span className="req-label">{h[0]}</span>
                  <span className="req-detail" style={{color: h[1] ? T.green : T.red}}>{h[2]}</span>
                </div>
              )
            })}
          </Section>
        )}
        <Section title="Scenarios" open={false}>
          {res.map(function(r) {
            return (
              <div key={r.id} className="scenario-row">
                <div className="scenario-head">
                  <span
                    className="icon-sq"
                    style={{
                      background: r.fit ? T.greenSoft : T.surfaceAlt,
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
        </Section>
        {ev && ev.pros && (
          <Section title="Pros" open={false}>
            {ev.pros.map(function(p, i) {
              return (
                <div key={i} className="proco-row">
                  <span className="proco-icon" style={{background: T.greenSoft, color: T.green}}>+</span>
                  <span className="proco-text">{p}</span>
                </div>
              )
            })}
          </Section>
        )}
        {ev && ev.cons && (
          <Section title="Cons" open={false}>
            {ev.cons.map(function(p, i) {
              return (
                <div key={i} className="proco-row">
                  <span className="proco-icon" style={{background: T.redSoft, color: T.red}}>−</span>
                  <span className="proco-text">{p}</span>
                </div>
              )
            })}
          </Section>
        )}
        {ev && ev.eq && (
          <Section title="Ausstattung" open={false}>
            <div className="flex flex-wrap gap-1.5">
              {ev.eq.map(function(a, i) {
                return <span key={i} className="eq-tag">{a}</span>
              })}
            </div>
          </Section>
        )}
        {ev && ev.qs && (
          <Section title="Questions" open={false}>
            {ev.qs.map(function(q, i) {
              return (
                <div key={i} className="qs-row">{i + 1}. {q}</div>
              )
            })}
          </Section>
        )}
        {l.notes && (
          <Section title="Notes" open={false}>
            <div className="notes-text">{l.notes}</div>
          </Section>
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
              if (confirm("Delete?")) { onDel(l.id); navigate("/") }
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
