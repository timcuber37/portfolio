import Link from 'next/link'
import { LayoutDashboard, FileText } from 'lucide-react'
import LogoutButton from './LogoutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <aside className="w-56 border-r border-zinc-800 flex flex-col p-4 shrink-0">
        <div className="mb-8 px-2">
          <p className="text-sm font-semibold text-white">Admin Panel</p>
          <p className="text-xs text-zinc-500 mt-0.5">Timothy Yang</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          <NavLink href="/admin" icon={LayoutDashboard} label="Analytics" />
          <NavLink href="/admin/content" icon={FileText} label="Content" />
        </nav>
        <div className="mt-auto pt-4 border-t border-zinc-800">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}

function NavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ElementType
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors"
    >
      <Icon size={15} />
      {label}
    </Link>
  )
}
