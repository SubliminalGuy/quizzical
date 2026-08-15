import { useEffect, useRef, useState } from "react"

const BAR_DELAYS = [0, 0.18, 0.36, 0.12, 0.42, 0.24, 0.06]

export default function TrackPlayer(props) {
  const { track, revealed } = props
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  // Every new track starts silent and from the top.
  useEffect(() => {
    setPlaying(false)
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }, [track])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) {
      // No preview file yet — the button only drives the visuals for now.
      setPlaying(prev => !prev)
      return
    }
    if (playing) {
      audio.pause()
    } else {
      audio.play().catch(() => setPlaying(false))
    }
    setPlaying(prev => !prev)
  }

  return (
    <div className={`track-player${playing ? " is-playing" : ""}`}>
      <div className="vinyl-stage">
        <div className={`vinyl${playing ? " vinyl-spinning" : ""}`}>
          <div className="vinyl-label">
            {revealed ? track.year : "?"}
          </div>
        </div>
      </div>

      <div className="track-meta">
        {revealed ? (
          <>
            <p className="track-title">{track.title}</p>
            <p className="track-artist">{track.artist}</p>
            <p className="track-genre">{track.genre}</p>
          </>
        ) : (
          <>
            <p className="track-title track-title-hidden">? ? ?</p>
            <p className="track-artist">Unbekannter Track</p>
            <p className="track-genre">Irgendwo zwischen 1990 und 1999</p>
          </>
        )}
      </div>

      <div className="equalizer" aria-hidden="true">
        {BAR_DELAYS.map((delay, i) => (
          <span key={i} style={{ animationDelay: `${delay}s` }} />
        ))}
      </div>

      <button className="button play-button" onClick={togglePlay}>
        {playing ? "❙❙ Pause" : "▶ Play"}
      </button>

      {!track.previewUrl && (
        <p className="player-note">Audio-Snippets folgen — bis dahin legt der DJ von Hand auf.</p>
      )}

      {track.previewUrl && (
        <audio
          ref={audioRef}
          src={track.previewUrl}
          onEnded={() => setPlaying(false)}
        />
      )}
    </div>
  )
}
