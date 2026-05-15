import { useState, useEffect, useCallback } from "react"
import { Routes, Route, Navigate, useParams } from "react-router-dom"
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

function DetailRoute({listings, onStatus, onDel}) {
  var params = useParams()
  var l = listings.find(function(x) { return x.id === params.id })
  if (!l) return <Navigate to="/" replace />
  return <DetailPage l={l} onStatus={onStatus} onDel={onDel} />
}

export default function App() {
  var ls = useState(SEEDS)
  var listings = ls[0]
  var setListings = ls[1]
  var ld = useState(false)
  var loaded = ld[0]
  var setLoaded = ld[1]
  useEffect(function() {
    setListings(loadLst())
    setLoaded(true)
  }, [])
  useEffect(function() {
    if (loaded) saveLst(listings)
  }, [listings, loaded])
  var addL = useCallback(function(l) {
    setListings(function(p) { return p.concat([l]) })
  }, [])
  var delL = useCallback(function(id) {
    setListings(function(p) { return p.filter(function(l) { return l.id !== id }) })
  }, [])
  var chSt = useCallback(function(id, st) {
    setListings(function(p) {
      return p.map(function(l) { return l.id === id ? Object.assign({}, l, {status: st}) : l })
    })
  }, [])
  return (
    <Routes>
      <Route path="/listing/:id" element={
        <div className="app-shell">
          <DetailRoute listings={listings} onStatus={chSt} onDel={delL} />
        </div>
      } />
      <Route path="*" element={
        <div className="app-shell">
          <Header listings={listings} />
          <TabBar />
          <Routes>
            <Route path="/" element={<ListingsTab listings={listings} />} />
            <Route path="/districts" element={<DistrictsTab />} />
            <Route path="/add" element={<AddTab onSave={addL} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      } />
    </Routes>
  )
}
