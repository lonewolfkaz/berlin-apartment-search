import { useState } from "react"
import { DISTRICTS, DEMOJI } from "../data/districts.js"
import { COMPLEXES, STATUS_PRIORITY } from "../data/complexes.js"
import { T } from "../data/constants.js"
import { fmt } from "../utils/calculations.js"
import { Pill } from "../components/Pill.jsx"
import { ComplexCard } from "../components/ComplexCard.jsx"

function getComplexes(distId) {
  return COMPLEXES
    .filter(function(c) { return c.district === distId })
    .sort(function(a, b) { return STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status] })
}

export function DistrictsTab() {
  var s = useState(-1)
  var openIdx = s[0]
  var setOpenIdx = s[1]
  var oc = useState(new Set())
  var openCpx = oc[0]
  var setOpenCpx = oc[1]
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

  function toggleCpx(id) {
    setOpenCpx(function(prev) {
      var next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  return (
    <div className="tab-pad">
      {vis.map(function(d, i) {
        var bg = bLabel(d.budgetFit)
        var sc = sLabel(d.schoolRating)
        var isOpen = openIdx === i
        return (
          <div key={d.id} className="card mb-2.5">
            <div onClick={function() { setOpenIdx(isOpen ? -1 : i); setOpenCpx(new Set()) }} className="dist-head">
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
                {(function() {
                  var cpxList = getComplexes(d.id)
                  if (cpxList.length === 0) return null
                  var isBavarian = d.id === "bavarian"
                  if (isBavarian && cpxList.length === 1 && cpxList[0].id === "bavarian-strategy") {
                    return (
                      <div>
                        <div className="cpx-section">Wohnquartiere</div>
                        <div className="cpx-strategy">
                          🎭 {cpxList[0].statusNote}
                        </div>
                      </div>
                    )
                  }
                  return (
                    <div>
                      <div className="cpx-section">Wohnquartiere ({cpxList.length})</div>
                      {cpxList.map(function(c) {
                        return (
                          <ComplexCard
                            key={c.id}
                            c={c}
                            isOpen={openCpx.has(c.id)}
                            onToggle={function() { toggleCpx(c.id) }}
                          />
                        )
                      })}
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
