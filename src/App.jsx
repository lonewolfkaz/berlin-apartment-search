import { useState, useEffect, useCallback } from "react"
import { SEEDS } from "./data/seeds.js"
import { Header } from "./components/Header.jsx"
import { TabBar } from "./components/TabBar.jsx"
import { DistrictsTab } from "./pages/DistrictsTab.jsx"
import { ListingsTab } from "./pages/ListingsTab.jsx"
import { AddTab } from "./pages/AddTab.jsx"
import { DetailPage } from "./pages/DetailPage.jsx"

const SK = "berlin-triage-listings"

function loadLst() {
  var s = []
  try {
    var r = localStorage.getItem(SK)
    if (r) s = JSON.parse(r)
  } catch (e) {
    console.error(e)
  }
  var ids = new Set(SEEDS.map(function(x) { return x.id }))
  var ext = s.filter(function(l) { return !ids.has(l.id) })
  var sm = {}
  s.forEach(function(l) { sm[l.id] = l.status })
  return SEEDS.map(function(x) {
    return sm[x.id] ? Object.assign({}, x, {status: sm[x.id]}) : x
  }).concat(ext)
}

function saveLst(a) {
  try { localStorage.setItem(SK, JSON.stringify(a)) }
  catch (e) { console.error(e) }
}

export default function App() {
  var ts = useState("listings")
  var tab = ts[0]
  var setTab = ts[1]
  var ls = useState(SEEDS)
  var listings = ls[0]
  var setListings = ls[1]
  var ld = useState(false)
  var loaded = ld[0]
  var setLoaded = ld[1]
  var ds = useState(null)
  var detailId = ds[0]
  var setDetailId = ds[1]
  useEffect(function() {
    setListings(loadLst())
    setLoaded(true)
  }, [])
  useEffect(function() {
    if (loaded) saveLst(listings)
  }, [listings, loaded])
  var addL = useCallback(function(l) {
    setListings(function(p) { return p.concat([l]) })
    setTab("listings")
  }, [])
  var delL = useCallback(function(id) {
    setListings(function(p) { return p.filter(function(l) { return l.id !== id }) })
    setDetailId(null)
  }, [])
  var chSt = useCallback(function(id, st) {
    setListings(function(p) {
      return p.map(function(l) { return l.id === id ? Object.assign({}, l, {status: st}) : l })
    })
  }, [])
  var dl = detailId ? listings.find(function(l) { return l.id === detailId }) : null
  if (dl) {
    return (
      <div className="app-shell">
        <DetailPage l={dl} onBack={function() { setDetailId(null) }} onStatus={chSt} onDel={delL} />
      </div>
    )
  }
  return (
    <div className="app-shell">
      <Header listings={listings} />
      <TabBar tab={tab} setTab={setTab} />
      {tab === "districts" && <DistrictsTab />}
      {tab === "listings" && <ListingsTab listings={listings} onOpen={setDetailId} />}
      {tab === "add" && <AddTab onSave={addL} />}
    </div>
  )
}
