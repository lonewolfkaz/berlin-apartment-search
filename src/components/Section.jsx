import { useState } from "react"

export function Section({title, children, open: io}) {
  var s = useState(io !== false)
  var open = s[0]
  var setOpen = s[1]
  return (
    <div className="sec-wrap">
      <div
        onClick={function() { setOpen(!open) }}
        className={"sec-head" + (open ? "" : " sec-head-closed")}
      >
        <span className="sec-title">{title}</span>
        <span className={"sec-chev" + (open ? " sec-chev-open" : "")}>▾</span>
      </div>
      {open && <div className="sec-body">{children}</div>}
    </div>
  )
}
