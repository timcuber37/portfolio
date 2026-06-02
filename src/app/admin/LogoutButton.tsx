'use client'

import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-3 py-2 w-full text-sm text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-md transition-colors"
    >
      <LogOut size={15} />
      Sign Out
    </button>
  )
}
