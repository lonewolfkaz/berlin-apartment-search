import { useState } from "react"
import { DISTRICTS, DEMOJI } from "../data/districts.js"
import { T, STATUS_OPTS } from "../data/constants.js"
import { calcAllIn, fmt } from "../utils/calculations.js"
import { Pill } from "../components/Pill.jsx"
import { ScenarioDots } from "../components/ScenarioDots.jsx"

export function ListingsTab({listings, onOpen}) {
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
                <ScenarioDots l={l} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
