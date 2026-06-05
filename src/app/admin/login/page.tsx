'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      // Full-page navigation so middleware + the /admin page re-render with the
      // freshly-set admin_session cookie (a soft router.push serves stale,
      // pre-login state from the client cache until a manual refresh).
      window.location.assign('/admin')
    } else {
      setError('Invalid password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg">
            <Lock size={18} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white">Admin Panel</h1>
            <p className="text-xs text-zinc-500">Timothy Yang&apos;s Portfolio</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-zinc-500 mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
              placeholder="Enter admin password"
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
