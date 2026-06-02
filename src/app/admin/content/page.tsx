'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Eye, EyeOff, Save } from 'lucide-react'

interface Project {
  id: number
  title: string
  description: string
  tech: string[]
  bullets: string[]
  screenshots: string[]
  startDate: string
  endDate?: string | null
  githubUrl?: string | null
  liveUrl?: string | null
  visible: boolean
}

interface Skill {
  id: number
  name: string
  category: string
  visible: boolean
}

interface Settings {
  name?: string
  tagline?: string
  bio?: string
  email?: string
  github?: string
  linkedin?: string
}

type Tab = 'settings' | 'projects' | 'skills'

export default function ContentEditor() {
  const [tab, setTab] = useState<Tab>('settings')
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [settings, setSettings] = useState<Settings>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/projects').then((r) => r.json()).then(setProjects)
    fetch('/api/admin/skills').then((r) => r.json()).then(setSkills)
    fetch('/api/admin/settings').then((r) => r.json()).then(setSettings)
  }, [])

  const saveSettings = async () => {
    setSaving(true)
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleProjectVisibility = async (p: Project) => {
    const updated = { ...p, visible: !p.visible }
    await fetch(`/api/admin/projects/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setProjects(projects.map((x) => (x.id === p.id ? updated : x)))
  }

  const deleteProject = async (id: number) => {
    if (!confirm('Delete this project?')) return
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    setProjects(projects.filter((p) => p.id !== id))
  }

  const toggleSkillVisibility = async (s: Skill) => {
    const updated = { ...s, visible: !s.visible }
    await fetch(`/api/admin/skills/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setSkills(skills.map((x) => (x.id === s.id ? updated : x)))
  }

  const deleteSkill = async (id: number) => {
    if (!confirm('Delete this skill?')) return
    await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' })
    setSkills(skills.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white mb-1">Content</h1>
        <p className="text-sm text-zinc-500">Manage your portfolio content</p>
      </div>

      <div className="flex gap-1 border-b border-zinc-800">
        {(['settings', 'projects', 'skills'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-blue-500 text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'settings' && (
        <div className="max-w-lg space-y-4">
          {(
            [
              ['name', 'Name', 'Timothy Yang'],
              ['tagline', 'Tagline', 'Full Stack Software Engineer'],
              ['bio', 'Bio', ''],
              ['email', 'Email', ''],
              ['github', 'GitHub URL', ''],
              ['linkedin', 'LinkedIn URL', ''],
            ] as [keyof Settings, string, string][]
          ).map(([key, label, placeholder]) => (
            <div key={key}>
              <label className="text-xs text-zinc-500 mb-1.5 block">{label}</label>
              {key === 'bio' ? (
                <textarea
                  rows={4}
                  value={settings[key] ?? ''}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={settings[key] ?? ''}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                />
              )}
            </div>
          ))}
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
          >
            <Save size={14} />
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      )}

      {tab === 'projects' && (
        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-start justify-between gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${p.visible ? 'text-white' : 'text-zinc-500'}`}>
                  {p.title}
                </p>
                <p className="text-xs text-zinc-600 mt-0.5">
                  {p.startDate} — {p.endDate ?? 'Present'}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tech.slice(0, 5).map((t) => (
                    <span key={t} className="px-2 py-0.5 text-xs bg-zinc-800 text-zinc-500 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleProjectVisibility(p)}
                  className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                  title={p.visible ? 'Hide' : 'Show'}
                >
                  {p.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={() => deleteProject(p.id)}
                  className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          <p className="text-xs text-zinc-600 pt-2">
            To add or fully edit projects, use the seed script or Prisma Studio (<code className="bg-zinc-900 px-1 rounded">npx prisma studio</code>).
          </p>
        </div>
      )}

      {tab === 'skills' && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition-colors ${
                  s.visible
                    ? 'border-zinc-700 text-zinc-300 bg-zinc-900'
                    : 'border-zinc-800 text-zinc-600 bg-zinc-950'
                }`}
              >
                <span>{s.name}</span>
                <button
                  onClick={() => toggleSkillVisibility(s)}
                  className="text-zinc-600 hover:text-white transition-colors"
                >
                  {s.visible ? <Eye size={11} /> : <EyeOff size={11} />}
                </button>
                <button
                  onClick={() => deleteSkill(s.id)}
                  className="text-zinc-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-600 pt-2">
            To add skills, use Prisma Studio (<code className="bg-zinc-900 px-1 rounded">npx prisma studio</code>).
          </p>
        </div>
      )}
    </div>
  )
}
