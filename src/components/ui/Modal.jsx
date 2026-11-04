import { useEffect, useId, useRef } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function Modal({ title, description, onClose, children, size = 'md' }) {
  const panelRef = useRef(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const panel = panelRef.current
    const first = panel.querySelector('[data-autofocus]') ?? panel.querySelector(FOCUSABLE)
    first?.focus()

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const items = [...panel.querySelectorAll(FOCUSABLE)]
      if (items.length === 0) return
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  const width = size === 'lg' ? 'sm:max-w-2xl' : 'sm:max-w-md'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={`animate-pop relative flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-card shadow-2xl sm:rounded-2xl dark:bg-[#221e18] ${width}`}
      >
        <div className="border-b border-line px-5 pb-3 pt-5 dark:border-[#3a342b]">
          <h2 id={titleId} className="font-display text-xl font-semibold">
            {title}
          </h2>
          {description && (
            <p id={descId} className="mt-1 text-sm text-ink-soft dark:text-[#a89e90]">
              {description}
            </p>
          )}
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
