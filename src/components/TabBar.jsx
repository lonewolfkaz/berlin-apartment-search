var TABS = [
  {id:"districts", icon:"🗺️", label:"Districts"},
  {id:"listings", icon:"📋", label:"Listings"},
  {id:"add", icon:"➕", label:"Add"}
]

export function TabBar({tab, setTab}) {
  return (
    <div className="tabs">
      {TABS.map(function(t) {
        return (
          <button
            key={t.id}
            onClick={function() { setTab(t.id) }}
            className={"tab-btn " + (tab === t.id ? "tab-btn-on" : "tab-btn-off")}
          >
            <div className="tab-icon">{t.icon}</div>{t.label}
          </button>
        )
      })}
    </div>
  )
}
