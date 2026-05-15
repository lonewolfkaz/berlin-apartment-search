import { useLocation, useNavigate } from "react-router-dom"

var TABS = [
  {id:"districts", path:"/districts", icon:"🗺️", label:"Districts"},
  {id:"listings", path:"/", icon:"📋", label:"Listings"},
  {id:"add", path:"/add", icon:"➕", label:"Add"}
]

export function TabBar() {
  var location = useLocation()
  var navigate = useNavigate()
  var path = location.pathname
  var active = path === "/districts" ? "districts"
    : path === "/add" ? "add"
    : "listings"
  return (
    <div className="tabs">
      {TABS.map(function(t) {
        return (
          <button
            key={t.id}
            onClick={function() { navigate(t.path) }}
            className={"tab-btn " + (active === t.id ? "tab-btn-on" : "tab-btn-off")}
          >
            <div className="tab-icon">{t.icon}</div>{t.label}
          </button>
        )
      })}
    </div>
  )
}
