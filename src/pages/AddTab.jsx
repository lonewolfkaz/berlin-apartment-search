import { useState } from "react"
import { DISTRICTS } from "../data/districts.js"
import { T, ENERGY } from "../data/constants.js"
import { fmt, calcAllIn } from "../utils/calculations.js"

export function AddTab({onSave}) {
  var s = useState({address:"",district:"moabit",price:"",size:"",rooms:"3",floor:"",totalFloors:"",year:"",energy:"B",broker:false,kfw:"",url:"",notes:""})
  var f = s[0]
  var setF = s[1]
  var set = function(k, v) {
    setF(function(p) {
      var n = {}
      Object.keys(p).forEach(function(x) { n[x] = p[x] })
      n[k] = v
      return n
    })
  }
  var valid = f.address && f.price && f.size && f.year && f.floor && f.totalFloors
  return (
    <div className="add-pad">
      <div className="add-title">Add listing</div>
      <div className="field">
        <label className="label">Address</label>
        <input className="input" value={f.address} onChange={function(e) { set("address", e.target.value) }} placeholder="Lehrter Str. 25" />
      </div>
      <div className="field">
        <label className="label">District</label>
        <select className="input" value={f.district} onChange={function(e) { set("district", e.target.value) }}>
          {DISTRICTS.map(function(d) { return <option key={d.id} value={d.id}>{d.name}</option> })}
        </select>
      </div>
      <div className="grid-2">
        <div>
          <label className="label">Price €</label>
          <input className="input" type="number" value={f.price} onChange={function(e) { set("price", e.target.value) }} />
        </div>
        <div>
          <label className="label">Size m²</label>
          <input className="input" type="number" value={f.size} onChange={function(e) { set("size", e.target.value) }} />
        </div>
      </div>
      <div className="grid-2">
        <div>
          <label className="label">Rooms</label>
          <input className="input" type="number" step="0.5" value={f.rooms} onChange={function(e) { set("rooms", e.target.value) }} />
        </div>
        <div>
          <label className="label">Year</label>
          <input className="input" type="number" value={f.year} onChange={function(e) { set("year", e.target.value) }} />
        </div>
      </div>
      <div className="grid-2">
        <div>
          <label className="label">Floor</label>
          <input className="input" type="number" value={f.floor} onChange={function(e) { set("floor", e.target.value) }} />
        </div>
        <div>
          <label className="label">Total floors</label>
          <input className="input" type="number" value={f.totalFloors} onChange={function(e) { set("totalFloors", e.target.value) }} />
        </div>
      </div>
      <div className="grid-2">
        <div>
          <label className="label">Energy</label>
          <select className="input" value={f.energy} onChange={function(e) { set("energy", e.target.value) }}>
            {ENERGY.map(function(e) { return <option key={e}>{e}</option> })}
          </select>
        </div>
        <div>
          <label className="label">KfW</label>
          <input className="input" value={f.kfw} onChange={function(e) { set("kfw", e.target.value) }} />
        </div>
      </div>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={f.broker}
          onChange={function(e) { set("broker", e.target.checked) }}
          style={{width: 20, height: 20, accentColor: T.rose}}
        /> Broker (3.57%)
      </label>
      {f.price && f.size ? (
        <div className="preview-box">
          <span className="preview-label">Preview: </span>
          <span className="preview-text">€{fmt(Math.round(Number(f.price) / Number(f.size)))}/m² · All-in €{fmt(calcAllIn(Number(f.price), f.broker))}</span>
        </div>
      ) : null}
      <div className="field">
        <label className="label">URL</label>
        <input className="input" value={f.url} onChange={function(e) { set("url", e.target.value) }} />
      </div>
      <div className="field mb-5">
        <label className="label">Notes</label>
        <textarea className="input-area" value={f.notes} onChange={function(e) { set("notes", e.target.value) }} />
      </div>
      <button
        onClick={function() {
          onSave({
            address: f.address,
            district: f.district,
            id: Date.now().toString(36),
            price: Number(f.price),
            size: Number(f.size),
            rooms: Number(f.rooms),
            floor: Number(f.floor),
            totalFloors: Number(f.totalFloors),
            year: Number(f.year),
            energy: f.energy,
            broker: f.broker,
            kfw: f.kfw,
            url: f.url,
            notes: f.notes,
            status: "new",
            created: new Date().toISOString()
          })
          setF({address:"",district:"moabit",price:"",size:"",rooms:"3",floor:"",totalFloors:"",year:"",energy:"B",broker:false,kfw:"",url:"",notes:""})
        }}
        disabled={!valid}
        className={valid ? "btn-primary" : "btn-primary-disabled"}
      >Save listing</button>
    </div>
  )
}
