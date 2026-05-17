import { T } from "../data/constants.js"
import { scoreScenarios } from "../utils/calculations.js"

export function ScenarioDots({l}) {
  var r = scoreScenarios(l)
  return (
    <div className="dots">
      {r.map(function(s) {
        return (
          <span
            key={s.id}
            className="dot"
            style={{
              background: s.fit ? T.greenSoft : T.surfaceAlt,
              color: s.fit ? T.green : T.ink3
            }}
          >{s.label}</span>
        )
      })}
    </div>
  )
}
