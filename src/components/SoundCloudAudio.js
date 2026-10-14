import { useEffect, useRef } from "react"

const API_SRC = "https://w.soundcloud.com/player/api.js"

const PLAYER_OPTIONS = [
  "auto_play=false",
  "visual=false",
  "show_artwork=false",
  "show_user=false",
  "show_comments=false",
  "show_teaser=false",
  "sharing=false",
  "buying=false",
  "download=false"
].join("&")

let apiPromise = null

/** Lädt die Widget-API einmal pro Seite. */
function loadWidgetApi() {
  if (window.SC && window.SC.Widget) return Promise.resolve(window.SC.Widget)
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = API_SRC
    script.onload = () => resolve(window.SC && window.SC.Widget)
    script.onerror = () => {
      apiPromise = null
      reject(new Error("SoundCloud-Widget nicht erreichbar"))
    }
    document.head.appendChild(script)
  })
  return apiPromise
}

/**
 * Spielt einen fest eingetragenen SoundCloud-Track ab.
 *
 * Das Widget steckt in einem iframe, der gelegt werden muss, damit überhaupt
 * Ton kommt — sichtbar wäre er allerdings ein Spoiler, weil er Titel und
 * Interpret anzeigt. Deshalb steht er hier klein und durchsichtig im Layout
 * und wird über die Widget-API gesteuert.
 */
export default function SoundCloudAudio(props) {
  const { url, playing, onEnded, onFail } = props
  const frameRef = useRef(null)
  const widgetRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    widgetRef.current = null

    loadWidgetApi()
      .then(Widget => {
        if (cancelled || !Widget || !frameRef.current) return
        const widget = Widget(frameRef.current)
        widget.bind(Widget.Events.READY, () => {
          if (!cancelled) widgetRef.current = widget
        })
        widget.bind(Widget.Events.FINISH, () => {
          if (!cancelled && onEnded) onEnded()
        })
        widget.bind(Widget.Events.ERROR, () => {
          if (!cancelled && onFail) onFail()
        })
      })
      .catch(() => { if (!cancelled && onFail) onFail() })

    return () => {
      cancelled = true
      widgetRef.current = null
    }
    // onEnded und onFail sind stabile Handler aus TrackPlayer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  useEffect(() => {
    const widget = widgetRef.current
    if (!widget) return
    if (playing) widget.play()
    else widget.pause()
  }, [playing])

  return (
    <iframe
      ref={frameRef}
      className="soundcloud-frame"
      title="SoundCloud"
      allow="autoplay"
      scrolling="no"
      frameBorder="no"
      src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&${PLAYER_OPTIONS}`}
    />
  )
}
