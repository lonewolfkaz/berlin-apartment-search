export function Pill({text, color, bg}) {
  return <span className="pill" style={{color: color, background: bg}}>{text}</span>
}
