import { useState } from "react"
import { DISTRICTS, DEMOJI } from "../data/districts.js"
import { T } from "../data/constants.js"
import { fmt } from "../utils/calculations.js"
import { Pill } from "../components/Pill.jsx"

export function DistrictsTab() {
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
