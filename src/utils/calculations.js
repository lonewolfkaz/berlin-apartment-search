import { SCENARIOS } from "../data/scenarios.js"
import { ENERGY } from "../data/constants.js"

export const fmt = function(n) {
  return typeof n === "number" ? n.toLocaleString("de-DE") : ""
}

export function calcAllIn(p, b) {
  return Math.round(p * (1 + 0.06 + 0.02 + (b ? 0.0357 : 0)))
}

export function scoreScenarios(l) {
  var a = calcAllIn(l.price, l.broker)
  return SCENARIOS.map(function(sc) {
    var ch = [
      {name:"Budget", pass: a <= sc.maxAllIn},
      {name:"Size", pass: l.size >= sc.minM2},
      {name:"Rooms", pass: l.rooms >= sc.minRooms},
      {name:"Year", pass: l.year >= sc.yearMin && l.year <= sc.yearMax},
      {name:"Floor", pass: l.floor > 0 && l.floor < l.totalFloors},
      {name:"Energy", pass: (function() {
        var i = ENERGY.indexOf(l.energy), m = ENERGY.indexOf("C")
        return i >= 0 && m >= 0 && i <= m
      })()}
    ]
    var passed = ch.filter(function(c) { return c.pass }).length
    return Object.assign({}, sc, {checks: ch, passed: passed, total: ch.length, fit: passed === ch.length})
  })
}
