import { useEffect, useRef } from 'react'

export default function TrailerModal({ video, title, onClose }) {
  const close = useRef(null)
  useEffect(() => {
    close.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-label={`${title} trailer`} onClick={(e) => e.stopPropagation()}>
        <button ref={close} className="modal-close" onClick={onClose} aria-label="Close trailer">✕</button>
        <div className="trailer-frame">
          <iframe
            src={`https://www.youtube.com/embed/${video.key}?autoplay=1`}
            title={`${title} trailer`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}
