import { describe, it, expect } from "vitest"
import { COMPLEXES, STATUS_PRIORITY, STATUS_CONFIG } from "../src/data/complexes.js"
import { DISTRICTS } from "../src/data/districts.js"

var DISTRICT_IDS = DISTRICTS.map(function(d) { return d.id })

describe("COMPLEXES data", function() {

  it("contains 15 entries", function() {
    expect(COMPLEXES.length).toBe(15)
  })

  it("every complex has a valid district id", function() {
    COMPLEXES.forEach(function(c) {
      expect(DISTRICT_IDS).toContain(c.district)
    })
  })

  it("every complex has a unique id", function() {
    var ids = COMPLEXES.map(function(c) { return c.id })
    var unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it("every complex has a valid status", function() {
    var validStatuses = Object.keys(STATUS_PRIORITY)
    COMPLEXES.forEach(function(c) {
      expect(validStatuses).toContain(c.status)
    })
  })

  it("eurSqm is a two-element number array", function() {
    COMPLEXES.forEach(function(c) {
      expect(c.eurSqm.length).toBe(2)
      expect(typeof c.eurSqm[0]).toBe("number")
      expect(typeof c.eurSqm[1]).toBe("number")
    })
  })

  it("allIn75 is a two-element number array", function() {
    COMPLEXES.forEach(function(c) {
      expect(c.allIn75.length).toBe(2)
      expect(typeof c.allIn75[0]).toBe("number")
      expect(typeof c.allIn75[1]).toBe("number")
    })
  })
})

describe("STATUS_PRIORITY", function() {

  it("has all 5 status types", function() {
    expect(Object.keys(STATUS_PRIORITY).sort()).toEqual(
      ["monitor", "none", "over", "possible", "sale"]
    )
  })

  it("sale has highest priority (lowest number)", function() {
    expect(STATUS_PRIORITY.sale).toBe(0)
    expect(STATUS_PRIORITY.over).toBe(4)
  })
})

describe("STATUS_CONFIG", function() {

  it("has config for every status in STATUS_PRIORITY", function() {
    Object.keys(STATUS_PRIORITY).forEach(function(s) {
      expect(STATUS_CONFIG[s]).toBeDefined()
      expect(STATUS_CONFIG[s].emoji).toBeDefined()
      expect(STATUS_CONFIG[s].label).toBeDefined()
    })
  })
})

describe("district grouping", function() {

  function getComplexes(distId) {
    return COMPLEXES
      .filter(function(c) { return c.district === distId })
      .sort(function(a, b) { return STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status] })
  }

  it("pankow has 3 complexes", function() {
    expect(getComplexes("pankow").length).toBe(3)
  })

  it("moabit has 2 complexes", function() {
    expect(getComplexes("moabit").length).toBe(2)
  })

  it("wilmersdorf has 3 complexes", function() {
    expect(getComplexes("wilmersdorf").length).toBe(3)
  })

  it("friedenau has 2 complexes", function() {
    expect(getComplexes("friedenau").length).toBe(2)
  })

  it("charlottenburg has 3 complexes", function() {
    expect(getComplexes("charlottenburg").length).toBe(3)
  })

  it("prenzlberg has 1 complex", function() {
    expect(getComplexes("prenzlberg").length).toBe(1)
  })

  it("bavarian has 1 strategy entry", function() {
    expect(getComplexes("bavarian").length).toBe(1)
    expect(getComplexes("bavarian")[0].id).toBe("bavarian-strategy")
  })

  it("sorts by status priority (sale first)", function() {
    var pankow = getComplexes("pankow")
    expect(pankow[0].status).toBe("sale")
    expect(pankow[pankow.length - 1].status).toBe("none")
  })

  it("weissensee has 0 complexes", function() {
    expect(getComplexes("weissensee").length).toBe(0)
  })
})
