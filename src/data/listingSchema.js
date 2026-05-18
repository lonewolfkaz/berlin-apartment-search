import { DISTRICTS } from "./districts.js"
import { ENERGY } from "./constants.js"

var DISTRICT_IDS = DISTRICTS.map(function(d) { return d.id })

export var LISTING_FIELDS = {
  required: {
    address:     { type: "string",  description: "Full street address (e.g. Lehrter Str. 25, 10557 Berlin)" },
    district:    { type: "string",  description: "District ID", enum: DISTRICT_IDS },
    price:       { type: "number",  description: "Kaufpreis in EUR" },
    size:        { type: "number",  description: "Wohnfläche in m²" },
    rooms:       { type: "number",  description: "Number of rooms (e.g. 3 or 2.5)" },
    floor:       { type: "number",  description: "Floor number (0 = Erdgeschoss)" },
    totalFloors: { type: "number",  description: "Total floors in building" },
    year:        { type: "number",  description: "Baujahr" },
    energy:      { type: "string",  description: "Energieklasse", enum: ENERGY }
  },
  optional: {
    broker: { type: "boolean", default: false, description: "Makler involved (adds 3.57% to Nebenkosten)" },
    kfw:    { type: "string",  default: "",    description: "KfW Effizienzhaus class (e.g. KfW 55)" },
    url:    { type: "string",  default: "",    description: "Listing URL" },
    notes:  { type: "string",  default: "",    description: "Free-text notes" },
    ev:     { type: "object",  default: null,  description: "Evaluation object from Claude analysis" }
  }
}

export var SCHEMA_TEXT = JSON.stringify({
  address: "Lehrter Str. 25, 10557 Berlin",
  district: "moabit",
  price: 520000,
  size: 78,
  rooms: 3,
  floor: 2,
  totalFloors: 5,
  year: 2019,
  energy: "B",
  broker: false,
  kfw: "",
  url: "https://example.com/listing",
  notes: "Bezugsfrei ab sofort",
  ev: {
    verdict: "match",
    vt: "MATCH — fits all core criteria",
    building: "2019, 5 fl, modern Neubau",
    unit: "3 rooms, 78 m², 2.OG, Energieklasse B",
    transit: "12 min HBF",
    schools: "Mitte — 75% ndH",
    parks: "Fritz-Schloss-Park",
    hausgeld: 320,
    hc: [
      ["Not EG", true, "2.OG"],
      ["Not DG", true, "2/5"],
      ["Inside Ring", true, "Yes"],
      ["U/S 15min", true, "U9 Turmstr 8min"],
      ["Parks", true, "Fritz-Schloss-Park"],
      ["Schools <40%", false, "75% ndH"],
      ["Budget", true, "562K all-in"]
    ],
    pros: ["Bezugsfrei", "No broker", "Good transit"],
    cons: ["Bad schools", "Moabit noise"],
    qs: ["WEG Protokolle", "Hausgeld history"],
    eq: ["Fussbodenheizung", "Aufzug", "Balkon"]
  }
}, null, 2)

export var SCHEMA_FIELDS_TEXT = "REQUIRED FIELDS:\n"
  + "  address     — string — Full street address\n"
  + "  district    — string — One of: " + DISTRICT_IDS.join(", ") + "\n"
  + "  price       — number — Kaufpreis in EUR\n"
  + "  size        — number — Wohnfläche in m²\n"
  + "  rooms       — number — Room count (e.g. 3 or 2.5)\n"
  + "  floor       — number — Floor number (0 = EG)\n"
  + "  totalFloors — number — Total floors in building\n"
  + "  year        — number — Baujahr\n"
  + "  energy      — string — One of: " + ENERGY.join(", ") + "\n"
  + "\nOPTIONAL FIELDS:\n"
  + "  broker      — boolean — Makler involved (default: false)\n"
  + "  kfw         — string  — KfW class (default: \"\")\n"
  + "  url         — string  — Listing URL (default: \"\")\n"
  + "  notes       — string  — Free-text notes (default: \"\")\n"
  + "  ev          — object  — Claude evaluation object (default: null)"

function coerceNumber(val, name) {
  if (typeof val === "number") return { value: val, error: null }
  if (typeof val === "string") {
    var n = Number(val)
    if (!isNaN(n) && val.trim() !== "") return { value: n, error: null }
  }
  return { value: null, error: name + " must be a number" }
}

export function validateListing(data) {
  var errors = []

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { valid: false, listing: null, errors: ["Input must be a JSON object"] }
  }

  var listing = {}

  var reqStr = ["address"]
  for (var i = 0; i < reqStr.length; i++) {
    var k = reqStr[i]
    if (data[k] == null || String(data[k]).trim() === "") {
      errors.push(k + " is required")
    } else {
      listing[k] = String(data[k])
    }
  }

  if (data.district == null || String(data.district).trim() === "") {
    errors.push("district is required")
  } else if (DISTRICT_IDS.indexOf(String(data.district)) === -1) {
    errors.push("district must be one of: " + DISTRICT_IDS.join(", "))
  } else {
    listing.district = String(data.district)
  }

  var reqNum = ["price", "size", "rooms", "floor", "totalFloors", "year"]
  for (var j = 0; j < reqNum.length; j++) {
    var nk = reqNum[j]
    if (data[nk] == null) {
      errors.push(nk + " is required")
    } else {
      var r = coerceNumber(data[nk], nk)
      if (r.error) {
        errors.push(r.error)
      } else {
        listing[nk] = r.value
      }
    }
  }

  if (data.energy == null || String(data.energy).trim() === "") {
    errors.push("energy is required")
  } else if (ENERGY.indexOf(String(data.energy)) === -1) {
    errors.push("energy must be one of: " + ENERGY.join(", "))
  } else {
    listing.energy = String(data.energy)
  }

  if (errors.length > 0) {
    return { valid: false, listing: null, errors: errors }
  }

  listing.broker = data.broker === true
  listing.kfw = data.kfw != null ? String(data.kfw) : ""
  listing.url = data.url != null ? String(data.url) : ""
  listing.notes = data.notes != null ? String(data.notes) : ""
  var evData = data.evaluation || data.ev
  listing.evaluation = (evData != null && typeof evData === "object" && !Array.isArray(evData)) ? evData : null

  return { valid: true, listing: listing, errors: [] }
}
