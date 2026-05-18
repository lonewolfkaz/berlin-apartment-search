import { DISTRICTS, DEMOJI } from "../data/districts.js"
import { T } from "../data/constants.js"
import { calcAllIn, fmt } from "../utils/calculations.js"
import { Pill } from "./Pill.jsx"
import { ScenarioDots } from "./ScenarioDots.jsx"

var VERDICT_COLORS = {
  match: { color: T.green, bg: T.greenSoft },
  conditional: { color: T.amber, bg: T.amberSoft },
  rejected: { color: T.red, bg: T.redSoft }
}

export function ImportPreview({listing}) {
  var allIn = calcAllIn(listing.price, listing.broker)
  var ppm = Math.round(listing.price / listing.size)
  var dist = DISTRICTS.find(function(d) { return d.id === listing.district })
  var emoji = dist ? (DEMOJI[dist.id] || "") : ""
  var distName = dist ? dist.name : listing.district

  var vc = null
  if (listing.evaluation && listing.evaluation.verdict) {
    vc = VERDICT_COLORS[listing.evaluation.verdict] || null
  }

  return (
    <div className="card mb-4">
      <div className="card-pad">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <div className="listing-addr">{listing.address}</div>
            <div className="listing-meta">
              {emoji + " " + distName} · {listing.rooms} rm · {listing.size} m² · {listing.year}
            </div>
          </div>
          {vc ? <Pill text={listing.evaluation.verdict} color={vc.color} bg={vc.bg} /> : null}
        </div>
        <div className="flex justify-between items-center mt-2.5">
          <div>
            <span className="price-big">€{fmt(allIn)}</span>
            <span className="price-ppm">€{fmt(ppm)}/m²</span>
          </div>
          <ScenarioDots l={listing} />
        </div>
      </div>
    </div>
  )
}
