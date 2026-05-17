import { STATUS_CONFIG } from "../data/complexes.js"
import { T } from "../data/constants.js"
import { fmt } from "../utils/calculations.js"

function energyColor(e) {
  if (!e) return {c: T.ink4, b: "transparent"}
  if (e === "A+" || e === "A" || e === "B") return {c: T.green, b: T.greenSoft}
  if (e === "C") return {c: T.amber, b: T.amberSoft}
  return {c: T.red, b: T.redSoft}
}

export function ComplexCard({c, isOpen, onToggle}) {
  var isOver = c.status === "over"
  var energyUncertain = c.energy && c.energy.charAt(0) === "~"
  var energyLabel = energyUncertain ? c.energy.slice(1) : c.energy
  var ec = energyColor(energyLabel)
  var cfg = STATUS_CONFIG[c.status]

  function row(label, value) {
    if (!value) return null
    return (
      <div className="row">
        <span className="row-label">{label}</span>
        <span className="row-value">{value}</span>
      </div>
    )
  }

  function handleLink(e) {
    e.stopPropagation()
    if (c.links && c.links.length > 0) {
      window.open(c.links[0].url, "_blank", "noopener")
    }
  }

  return (
    <div className={"cpx-card cpx-card-" + c.status}>
      <div className="cpx-head" onClick={onToggle}>
        <div>
          <div className="cpx-name">
            {c.name}
            {c.links && c.links.length > 0 && (
              <span className="cpx-link" onClick={handleLink} title="Open listing">
                {" ↗"}
              </span>
            )}
          </div>
          <div className="cpx-addr">{c.address} · {c.year}</div>
        </div>
        <div className="cpx-right">
          {energyLabel && (
            <span
              className={"pill" + (energyUncertain ? " cpx-energy-uncertain" : "")}
              style={{color: ec.c, background: ec.b, fontSize: "10px", padding: "2px 6px"}}
            >{energyLabel}</span>
          )}
          <span title={cfg.label}>{cfg.emoji}</span>
          {c.scenario && c.scenario !== "—" && (
            <span className="cpx-scenario">{c.scenario}</span>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="cpx-body">
          <div className="cpx-addr" style={{marginTop: "8px", marginBottom: "4px"}}>
            <span className={isOver ? "cpx-price-over" : "cpx-price"}>
              €{fmt(c.eurSqm[0])}{c.eurSqm[1] !== c.eurSqm[0] ? "–" + fmt(c.eurSqm[1]) : ""}/m²
            </span>
          </div>
          {row("75 m² all-in", "€" + fmt(c.allIn75[0]) + (c.allIn75[1] !== c.allIn75[0] ? "–" + fmt(c.allIn75[1]) : ""))}
          {row("Developer", c.developer)}
          {row("Architect", c.architect)}
          {row("Units", c.etwCount ? c.etwCount + " ETW" : null)}
          {row("Energy", (c.energy || "") + (c.energyKwh ? " · " + c.energyKwh : ""))}
          {row("Heating", c.heating)}
          {row("HBF", c.hbf)}
          {row("Zoo", c.zoo)}
          {row("Transit", c.transit)}
          {row("Schools", c.schools ? c.schools + (c.ndh ? " (ndH " + c.ndh + ")" : "") : (c.ndh ? "ndH " + c.ndh : null))}
          {row("Parks", c.parks)}
          {c.features && c.features.length > 0 && (
            <div className="cpx-features">
              {c.features.map(function(f, i) {
                return <span key={i} className="eq-tag">{f}</span>
              })}
            </div>
          )}
          {c.links && c.links.length > 0 && (
            <div className="cpx-links">
              {c.links.map(function(link, i) {
                return (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="cpx-link-item">
                    {link.name} ↗
                  </a>
                )
              })}
            </div>
          )}
          {c.verify && (
            <div className="cpx-verify">⚠ {c.verify}</div>
          )}
          {c.statusNote && (
            <div className="cpx-status-note">{cfg.emoji} {c.statusNote}</div>
          )}
        </div>
      )}
    </div>
  )
}
