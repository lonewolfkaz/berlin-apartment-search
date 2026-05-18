import { useState, useEffect, useCallback } from "react"
import { Routes, Route, Navigate, useParams } from "react-router-dom"
import { Header } from "./components/Header.jsx"
import { TabBar } from "./components/TabBar.jsx"
import { DistrictsTab } from "./pages/DistrictsTab.jsx"
import { ListingsTab } from "./pages/ListingsTab.jsx"
import { AddTab } from "./pages/AddTab.jsx"
import { DetailPage } from "./pages/DetailPage.jsx"
import { loadListings, addListing, updateStatus, deleteListing } from "./lib/listings"

function DetailRoute({listings, onStatus, onDel}) {
  var params = useParams()
  var l = listings.find(function(x) { return x.id === params.id })
  if (!l) return <Navigate to="/" replace />
  return <DetailPage l={l} onStatus={onStatus} onDel={onDel} />
}

export default function App() {
  var ls = useState([])
  var listings = ls[0]
  var setListings = ls[1]
  var lg = useState(true)
  var loading = lg[0]
  var setLoading = lg[1]
  useEffect(function() {
    loadListings().then(function(data) {
      setListings(data)
    }).catch(function(e) {
      console.error("Failed to load listings:", e)
    }).finally(function() {
      setLoading(false)
    })
  }, [])
  var addL = useCallback(function(data) {
    return addListing(data).then(function(saved) {
      setListings(function(p) { return [saved].concat(p) })
    })
  }, [])
  var delL = useCallback(function(id) {
    return deleteListing(id).then(function() {
      setListings(function(p) { return p.filter(function(l) { return l.id !== id }) })
    })
  }, [])
  var chSt = useCallback(function(id, st) {
    return updateStatus(id, st).then(function() {
      setListings(function(p) {
        return p.map(function(l) { return l.id === id ? Object.assign({}, l, {status: st}) : l })
      })
    })
  }, [])
  return (
    loading ? (
      <div className="app-shell"><div className="loading-center">Loading...</div></div>
    ) : (
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
  )
}
