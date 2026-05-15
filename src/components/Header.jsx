import { fmt } from "../utils/calculations.js"

export function Header({listings}) {
  return (
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
  )
}
