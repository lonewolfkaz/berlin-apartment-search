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
              background: s.fit ? T.greenSoft : "#F7F7F5",
              color: s.fit ? T.green : T.ink4
            }}
          >{s.label}</span>
        )
      })}
    </div>
  )
}
