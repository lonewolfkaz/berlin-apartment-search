import { describe, it, expect } from "vitest"
import { validateListing } from "../src/data/listingSchema.js"

var VALID = {
  address: "Lehrter Str. 25, 10557 Berlin",
  district: "moabit",
  price: 520000,
  size: 78,
  rooms: 3,
  floor: 2,
  totalFloors: 5,
  year: 2019,
  energy: "B"
}

describe("validateListing", function() {

  it("accepts a valid listing with all required fields", function() {
    var r = validateListing(VALID)
    expect(r.valid).toBe(true)
    expect(r.errors).toEqual([])
    expect(r.listing.address).toBe("Lehrter Str. 25, 10557 Berlin")
    expect(r.listing.price).toBe(520000)
    expect(r.listing.district).toBe("moabit")
  })

  it("rejects when required fields are missing", function() {
    var r = validateListing({ district: "moabit", energy: "B" })
    expect(r.valid).toBe(false)
    expect(r.errors).toContain("address is required")
    expect(r.errors).toContain("price is required")
    expect(r.errors).toContain("size is required")
    expect(r.errors).toContain("rooms is required")
    expect(r.errors).toContain("floor is required")
    expect(r.errors).toContain("totalFloors is required")
    expect(r.errors).toContain("year is required")
  })

  it("silently ignores unknown fields", function() {
    var input = Object.assign({}, VALID, { foo: "bar", baz: 123 })
    var r = validateListing(input)
    expect(r.valid).toBe(true)
    expect(r.listing.foo).toBeUndefined()
    expect(r.listing.baz).toBeUndefined()
  })

  it("rejects invalid district", function() {
    var input = Object.assign({}, VALID, { district: "narnia" })
    var r = validateListing(input)
    expect(r.valid).toBe(false)
    expect(r.errors[0]).toContain("district must be one of")
  })

  it("rejects invalid energy class", function() {
    var input = Object.assign({}, VALID, { energy: "Z" })
    var r = validateListing(input)
    expect(r.valid).toBe(false)
    expect(r.errors[0]).toContain("energy must be one of")
  })

  it("coerces string numbers to Number", function() {
    var input = Object.assign({}, VALID, { price: "475000", size: "67.25" })
    var r = validateListing(input)
    expect(r.valid).toBe(true)
    expect(r.listing.price).toBe(475000)
    expect(r.listing.size).toBe(67.25)
  })

  it("rejects non-numeric strings", function() {
    var input = Object.assign({}, VALID, { price: "not-a-number" })
    var r = validateListing(input)
    expect(r.valid).toBe(false)
    expect(r.errors).toContain("price must be a number")
  })

  it("strips id, status, and created from input", function() {
    var input = Object.assign({}, VALID, { id: "fake", status: "viewed", created: "2020-01-01" })
    var r = validateListing(input)
    expect(r.valid).toBe(true)
    expect(r.listing.id).toBeUndefined()
    expect(r.listing.status).toBeUndefined()
    expect(r.listing.created).toBeUndefined()
  })

  it("applies defaults for optional fields when omitted", function() {
    var r = validateListing(VALID)
    expect(r.valid).toBe(true)
    expect(r.listing.broker).toBe(false)
    expect(r.listing.kfw).toBe("")
    expect(r.listing.url).toBe("")
    expect(r.listing.notes).toBe("")
    expect(r.listing.ev).toBe(null)
  })

  it("passes through ev object as-is", function() {
    var ev = { verdict: "match", vt: "MATCH", pros: ["a"], cons: ["b"] }
    var input = Object.assign({}, VALID, { ev: ev })
    var r = validateListing(input)
    expect(r.valid).toBe(true)
    expect(r.listing.ev).toEqual(ev)
  })

  it("rejects non-object input", function() {
    expect(validateListing(null).valid).toBe(false)
    expect(validateListing("string").valid).toBe(false)
    expect(validateListing([1, 2]).valid).toBe(false)
  })
})
