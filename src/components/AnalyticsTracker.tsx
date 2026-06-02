'use client'

import { useEffect } from 'react'

export default function AnalyticsTracker() {
  useEffect(() => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'pageview', page: '/' }),
    }).catch(() => {})
  }, [])

  return null
}
