import { useEffect } from 'react'

// Ref-counted body scroll lock shared across overlays (e.g. a project modal and
// the image lightbox nested inside it). Using one shared counter — and keying the
// effect only on `active` — prevents nested overlays from clobbering each other's
// overflow save/restore, which otherwise leaves the page stuck with no scrollbar.
let lockCount = 0
let savedOverflow = ''

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    if (lockCount === 0) {
      savedOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    lockCount += 1
    return () => {
      lockCount -= 1
      if (lockCount <= 0) {
        lockCount = 0
        document.body.style.overflow = savedOverflow
      }
    }
  }, [active])
}
