import Link from 'next/link'
import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './SocialIcons'

export default function Footer({ settings }: { settings: Record<string, string> }) {
  return (
    <footer className="border-t border-zinc-200 py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} Timothy Yang
        </p>
        <div className="flex items-center gap-5">
          <a
            href={settings.github ?? 'https://github.com/timcuber37'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <GithubIcon size={16} />
          </a>
          <a
            href={settings.linkedin ?? 'https://linkedin.com/in/timyang37'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <LinkedinIcon size={16} />
          </a>
          <a
            href={`mailto:${settings.email ?? 'timcuber37@gmail.com'}`}
            className="text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <Mail size={16} />
          </a>
        </div>
        <Link href="/admin" className="text-xs text-zinc-300 hover:text-zinc-500 transition-colors">
          Admin
        </Link>
      </div>
    </footer>
  )
}
