import { useEffect, useRef, useState } from "react"
import fetchPreview from "../helperFunctions/fetchPreview"

const BAR_DELAYS = [0, 0.18, 0.36, 0.12, 0.42, 0.24, 0.06]

const NOTES = {
  loading: "Snippet wird gesucht …",
  none: "Für diesen Track gibt es kein Snippet — der DJ legt von Hand auf.",
  error: "Snippet-Suche nicht erreichbar — der DJ legt von Hand auf."
}

export default function TrackPlayer(props) {
  const { track, revealed } = props
  const [playing, setPlaying] = useState(false)
  const [status, setStatus] = useState("loading")   // loading | ready | none | error
  const [preview, setPreview] = useState(null)
  const audioRef = useRef(null)

  // Jeder neue Track startet stumm, von vorn und mit frischer Snippet-Suche.
  useEffect(() => {
    let cancelled = false

    setPlaying(false)
    setPreview(null)
    setStatus("loading")

    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }

    fetchPreview(track)
      .then(result => {
        if (cancelled) return
        setPreview(result)
        setStatus(result ? "ready" : "none")
      })
      .catch(() => {
        if (!cancelled) setStatus("error")
      })

    return () => { cancelled = true }
  }, [track])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) {
      // Ohne Snippet treibt der Button nur die Animation.
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

  const cover = revealed && preview && preview.artworkUrl

  return (
    <div className={`track-player${playing ? " is-playing" : ""}`}>
      <div className="vinyl-stage">
        <div className={`vinyl${playing ? " vinyl-spinning" : ""}`}>
          {cover ? (
            <img className="vinyl-cover" src={preview.artworkUrl} alt="" />
          ) : (
            <div className="vinyl-label">{revealed ? track.year : "?"}</div>
          )}
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

      <button
        className="button play-button"
        onClick={togglePlay}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Lädt …" : playing ? "❙❙ Pause" : "▶ Play"}
      </button>

      {status !== "ready" && <p className="player-note">{NOTES[status]}</p>}

      {status === "ready" && (
        <audio
          ref={audioRef}
          src={preview.previewUrl}
          onEnded={() => setPlaying(false)}
        />
      )}
    </div>
  )
}
