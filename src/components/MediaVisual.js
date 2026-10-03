/**
 * Der Tonträger der jeweiligen Sammlung: Platte für Techno, Kassette für HipHop.
 * `label` steht mittig (Jahr oder "?"), `cover` ersetzt es nach der Auflösung.
 */
export default function MediaVisual(props) {
  const { kind, spinning, label, cover, small } = props
  const sizeClass = small ? " media-small" : ""

  if (kind === "cassette") {
    return (
      <div className={`cassette${sizeClass}`}>
        <div className="cassette-screws" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
        <div className="cassette-window">
          <span className={`reel${spinning ? " reel-spinning" : ""}`} />
          <span className="cassette-tape" />
          <span className={`reel${spinning ? " reel-spinning" : ""}`} />
        </div>
        <div className="cassette-label">
          {cover
            ? <img className="cassette-cover" src={cover} alt="" />
            : <span className="cassette-text">{label}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className={`vinyl${spinning ? " vinyl-spinning" : ""}${sizeClass}`}>
      {cover
        ? <img className="vinyl-cover" src={cover} alt="" />
        : <div className="vinyl-label">{label}</div>}
    </div>
  )
}
