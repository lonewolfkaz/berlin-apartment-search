import { useState, useRef } from "react"

export function DropZone({onFile, error, parsed}) {
  var s = useState(false)
  var dragOver = s[0]
  var setDragOver = s[1]
  var inputRef = useRef(null)

  var cls = "drop-zone"
  if (dragOver) cls = cls + " drop-zone-over"
  else if (error) cls = cls + " drop-zone-error"
  else if (parsed) cls = cls + " drop-zone-success"

  function handleDrag(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDragIn(e) {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }

  function handleDragOut(e) {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFile(e.dataTransfer.files[0])
    }
  }

  function handleClick() {
    if (inputRef.current) inputRef.current.click()
  }

  function handleChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      onFile(e.target.files[0])
      e.target.value = ""
    }
  }

  return (
    <div
      className={cls}
      onDragOver={handleDrag}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="drop-icon">{parsed && !error ? "✓" : "📄"}</div>
      <div className="drop-text">
        {parsed && !error ? "File loaded — ready to save" : "Drop a .json file here"}
      </div>
      <button type="button" className="drop-browse" onClick={function(e) { e.stopPropagation(); handleClick() }}>
        Browse files
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        onChange={handleChange}
        style={{display: "none"}}
      />
      {error ? <div className="drop-error">{error}</div> : null}
    </div>
  )
}
