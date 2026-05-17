import { calcAllIn, fmt } from "../utils/calculations.js"

export function Header({listings}) {
  var total = listings.length
  var active = listings.filter(function(l) { return l.status !== "rejected" }).length
  var avgAllIn = total > 0
    ? Math.round(listings.reduce(function(sum, l) { return sum + calcAllIn(l.price, l.broker) }, 0) / total)
    : 0
  return (
    <div className="app-header">
      <div className="app-eyebrow">Berlin</div>
      <div className="app-title">Apartment Search</div>
      <div className="stats-row">
        {[["Budget", "€640K"], ["/m²", "~€7.9K"], ["Avg", "€" + fmt(avgAllIn)]].map(function(x, i) {
          return (
            <div key={i}>
              <div className="stat-label">{x[0]}</div>
              <div className="stat-value">{x[1]}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
