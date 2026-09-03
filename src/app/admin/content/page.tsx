'use client'

import { useEffect, useRef, useState } from 'react'
import { Trash2, Eye, EyeOff, Save, Download, X, Plus, ChevronUp, ChevronDown, Upload } from 'lucide-react'
import { upload } from '@vercel/blob/client'
import {
  toMedia,
  isBlobUrl,
  firstFrame,
  youtubePoster,
  MAX_UPLOAD_BYTES,
  UPLOAD_CONTENT_TYPES,
} from '@/lib/media'

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

interface Experience {
  id: number
  title: string
  company: string
  location: string
  startDate: string
  endDate?: string | null
  bullets: string[]
  gpa?: string | null
  type: string
  visible: boolean
}

interface Skill {
  id: number
  name: string
  category: string
  visible: boolean
}

interface CustomSection {
  id: number
  label: string
  heading: string
  body: string
  visible: boolean
  order: number
}

interface GhRepo {
  full_name: string
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  archived: boolean
}

type Tab = 'settings' | 'projects' | 'experience' | 'sections' | 'skills'

type SectionDraft = {
  label: string
  heading: string
  body: string
  visible: boolean
}

type ProjectDraft = {
  title: string
  description: string
  techText: string
  bulletsText: string
  startDate: string
  endDate: string
  githubUrl: string
  liveUrl: string
  visible: boolean
  media: string[]
}

type ExpDraft = {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  bulletsText: string
  gpa: string
  type: string
  visible: boolean
}

const SETTING_FIELDS: { key: string; label: string; type: 'input' | 'textarea'; group: string }[] = [
  { key: 'name', label: 'Name', type: 'input', group: 'Profile' },
  { key: 'tagline', label: 'Tagline', type: 'input', group: 'Profile' },
  { key: 'bio', label: 'Bio (Hero + About intro)', type: 'textarea', group: 'Profile' },
  { key: 'email', label: 'Email', type: 'input', group: 'Profile' },
  { key: 'github', label: 'GitHub URL', type: 'input', group: 'Profile' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'input', group: 'Profile' },
  { key: 'phone', label: 'Phone', type: 'input', group: 'Profile' },
  { key: 'heroRoles', label: 'Hero rotating roles (one per line)', type: 'textarea', group: 'Hero' },
  { key: 'aboutHeading', label: 'About heading', type: 'input', group: 'About' },
  { key: 'aboutPara2', label: 'About paragraph 2', type: 'textarea', group: 'About' },
  { key: 'aboutPara3', label: 'About paragraph 3', type: 'textarea', group: 'About' },
  { key: 'projectsHeading', label: 'Projects heading', type: 'input', group: 'Section headings' },
  { key: 'skillsHeading', label: 'Skills heading', type: 'input', group: 'Section headings' },
  { key: 'experienceHeading', label: 'Experience heading', type: 'input', group: 'Section headings' },
  { key: 'beyondHeading', label: 'Beyond heading', type: 'input', group: 'Beyond Code' },
  { key: 'beyondIntro', label: 'Beyond intro', type: 'textarea', group: 'Beyond Code' },
  { key: 'beyondCubingDesc', label: 'Speedcubing card description', type: 'textarea', group: 'Beyond Code' },
  { key: 'youtubeUrl', label: 'YouTube URL', type: 'input', group: 'Beyond Code' },
  { key: 'wcaUrl', label: 'WCA profile URL', type: 'input', group: 'Beyond Code' },
  { key: 'beyondKoreanTitle', label: 'Second card title', type: 'input', group: 'Beyond Code' },
  { key: 'beyondKoreanDesc', label: 'Second card description', type: 'textarea', group: 'Beyond Code' },
  { key: 'contactHeading', label: 'Contact heading', type: 'input', group: 'Contact' },
  { key: 'contactIntro', label: 'Contact intro', type: 'textarea', group: 'Contact' },
]

const INPUT =
  'w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors'

const splitComma = (s: string) => s.split(',').map((t) => t.trim()).filter(Boolean)
const splitLines = (s: string) => s.split('\n').map((t) => t.trim()).filter(Boolean)

const emptyProject: ProjectDraft = {
  title: '',
  description: '',
  techText: '',
  bulletsText: '',
  startDate: '',
  endDate: '',
  githubUrl: '',
  liveUrl: '',
  visible: true,
  media: [],
}

const emptyExp: ExpDraft = {
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  bulletsText: '',
  gpa: '',
  type: 'work',
  visible: true,
}

const emptySection: SectionDraft = { label: '', heading: '', body: '', visible: true }

export default function ContentEditor() {
  const [tab, setTab] = useState<Tab>('settings')
  const [projects, setProjects] = useState<Project[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // GitHub import
  const [importOpen, setImportOpen] = useState(false)
  const [repos, setRepos] = useState<GhRepo[]>([])
  const [reposLoading, setReposLoading] = useState(false)
  const [reposError, setReposError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [importing, setImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<Record<string, string>>({})

  // AI refine
  const [refiningId, setRefiningId] = useState<number | null>(null)
  const [refineText, setRefineText] = useState('')
  const [refineBusy, setRefineBusy] = useState(false)
  const [refineStatus, setRefineStatus] = useState<Record<number, string>>({})

  // Project / experience / skill editing
  const [editProjectId, setEditProjectId] = useState<number | 'new' | null>(null)
  const [projectDraft, setProjectDraft] = useState<ProjectDraft>(emptyProject)
  const [editExpId, setEditExpId] = useState<number | 'new' | null>(null)
  const [expDraft, setExpDraft] = useState<ExpDraft>(emptyExp)
  const [editSkillId, setEditSkillId] = useState<number | null>(null)
  const [skillDraft, setSkillDraft] = useState({ name: '', category: '' })
  const [newSkill, setNewSkill] = useState({ name: '', category: '' })

  // Custom sections
  const [sections, setSections] = useState<CustomSection[]>([])
  const [editSectionId, setEditSectionId] = useState<number | 'new' | null>(null)
  const [sectionDraft, setSectionDraft] = useState<SectionDraft>(emptySection)

  useEffect(() => {
    fetch('/api/admin/projects').then((r) => r.json()).then(setProjects)
    fetch('/api/admin/experience').then((r) => r.json()).then(setExperience)
    fetch('/api/admin/skills').then((r) => r.json()).then(setSkills)
    fetch('/api/admin/sections').then((r) => r.json()).then(setSections)
    fetch('/api/admin/settings').then((r) => r.json()).then(setSettings)
  }, [])

  // ---- Settings ----
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

  // ---- GitHub import ----
  const openImport = async () => {
    setImportOpen(true)
    if (repos.length || reposLoading) return
    setReposLoading(true)
    setReposError(null)
    try {
      const res = await fetch('/api/admin/github/repos')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to load repositories')
      setRepos(data)
    } catch (e) {
      setReposError(e instanceof Error ? e.message : 'Failed to load repositories')
    } finally {
      setReposLoading(false)
    }
  }

  const runImport = async () => {
    setImporting(true)
    for (const full_name of selected) {
      setImportStatus((s) => ({ ...s, [full_name]: 'Importing…' }))
      try {
        const res = await fetch('/api/admin/projects/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name }),
        })
        const project = await res.json()
        if (!res.ok) throw new Error(project.error ?? 'Import failed')
        setProjects((prev) => {
          const idx = prev.findIndex((p) => p.id === project.id)
          if (idx === -1) return [...prev, project]
          const copy = [...prev]
          copy[idx] = project
          return copy
        })
        setImportStatus((s) => ({ ...s, [full_name]: project._action === 'updated' ? 'Updated ✓' : 'Added ✓' }))
      } catch (e) {
        setImportStatus((s) => ({ ...s, [full_name]: e instanceof Error ? e.message : 'Error' }))
      }
    }
    setSelected(new Set())
    setImporting(false)
  }

  // ---- AI refine ----
  const applyRefine = async (p: Project) => {
    if (!refineText.trim()) return
    setRefineBusy(true)
    setRefineStatus((s) => ({ ...s, [p.id]: 'Refining…' }))
    try {
      const res = await fetch(`/api/admin/projects/${p.id}/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instruction: refineText }),
      })
      const updated = await res.json()
      if (!res.ok) throw new Error(updated.error ?? 'Refine failed')
      setProjects((prev) => prev.map((x) => (x.id === p.id ? updated : x)))
      setRefiningId(null)
      setRefineStatus((s) => ({ ...s, [p.id]: 'Updated ✓' }))
    } catch (e) {
      setRefineStatus((s) => ({ ...s, [p.id]: e instanceof Error ? e.message : 'Error' }))
    } finally {
      setRefineBusy(false)
    }
  }

  // ---- Projects ----
  const startEditProject = (p: Project) => {
    setRefiningId(null)
    setEditProjectId(p.id)
    setProjectDraft({
      title: p.title,
      description: p.description,
      techText: p.tech.join(', '),
      bulletsText: p.bullets.join('\n'),
      startDate: p.startDate,
      endDate: p.endDate ?? '',
      githubUrl: p.githubUrl ?? '',
      liveUrl: p.liveUrl ?? '',
      visible: p.visible,
      media: p.screenshots,
    })
  }

  const saveProject = async () => {
    const payload = {
      title: projectDraft.title,
      description: projectDraft.description,
      tech: splitComma(projectDraft.techText),
      bullets: splitLines(projectDraft.bulletsText),
      startDate: projectDraft.startDate,
      endDate: projectDraft.endDate.trim() || null,
      githubUrl: projectDraft.githubUrl.trim() || null,
      liveUrl: projectDraft.liveUrl.trim() || null,
      visible: projectDraft.visible,
      screenshots: projectDraft.media,
    }
    const isNew = editProjectId === 'new'
    const res = await fetch(isNew ? '/api/admin/projects' : `/api/admin/projects/${editProjectId}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const saved = await res.json()
    if (!res.ok) return
    setProjects((prev) => (isNew ? [...prev, saved] : prev.map((p) => (p.id === saved.id ? saved : p))))
    setEditProjectId(null)
  }

  const deleteProject = async (id: number) => {
    if (!confirm('Delete this project?')) return
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    setProjects(projects.filter((p) => p.id !== id))
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

  // Move a project up (-1) or down (+1) and persist the new order.
  const moveProject = async (index: number, dir: -1 | 1) => {
    const next = index + dir
    if (next < 0 || next >= projects.length) return
    const reordered = [...projects]
    ;[reordered[index], reordered[next]] = [reordered[next], reordered[index]]
    setProjects(reordered)
    await fetch('/api/admin/projects/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: reordered.map((p) => p.id) }),
    })
  }

  // ---- Experience ----
  const startEditExp = (e: Experience) => {
    setEditExpId(e.id)
    setExpDraft({
      title: e.title,
      company: e.company,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate ?? '',
      bulletsText: e.bullets.join('\n'),
      gpa: e.gpa ?? '',
      type: e.type,
      visible: e.visible,
    })
  }

  const saveExp = async () => {
    const payload = {
      title: expDraft.title,
      company: expDraft.company,
      location: expDraft.location,
      startDate: expDraft.startDate,
      endDate: expDraft.endDate.trim() || null,
      bullets: splitLines(expDraft.bulletsText),
      // Only education entries carry a GPA; clear it if the type changed away.
      gpa: expDraft.type === 'education' ? expDraft.gpa.trim() : '',
      type: expDraft.type,
      visible: expDraft.visible,
    }
    const isNew = editExpId === 'new'
    const res = await fetch(isNew ? '/api/admin/experience' : `/api/admin/experience/${editExpId}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const saved = await res.json()
    if (!res.ok) return
    setExperience((prev) => (isNew ? [...prev, saved] : prev.map((e) => (e.id === saved.id ? saved : e))))
    setEditExpId(null)
  }

  const deleteExp = async (id: number) => {
    if (!confirm('Delete this entry?')) return
    await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' })
    setExperience(experience.filter((e) => e.id !== id))
  }

  const toggleExpVisibility = async (e: Experience) => {
    const updated = { ...e, visible: !e.visible }
    await fetch(`/api/admin/experience/${e.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setExperience(experience.map((x) => (x.id === e.id ? updated : x)))
  }

  // Move an experience entry up (-1) or down (+1) and persist the new order.
  const moveExp = async (index: number, dir: -1 | 1) => {
    const next = index + dir
    if (next < 0 || next >= experience.length) return
    const reordered = [...experience]
    ;[reordered[index], reordered[next]] = [reordered[next], reordered[index]]
    setExperience(reordered)
    await fetch('/api/admin/experience/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: reordered.map((e) => e.id) }),
    })
  }

  // ---- Skills ----
  const addSkill = async () => {
    if (!newSkill.name.trim() || !newSkill.category.trim()) return
    const res = await fetch('/api/admin/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSkill),
    })
    const skill = await res.json()
    if (!res.ok) return
    setSkills((prev) => [...prev, skill])
    setNewSkill({ name: '', category: '' })
  }

  const saveSkill = async (s: Skill) => {
    const updated = { ...s, name: skillDraft.name, category: skillDraft.category }
    await fetch(`/api/admin/skills/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setSkills(skills.map((x) => (x.id === s.id ? updated : x)))
    setEditSkillId(null)
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

  // ---- Custom sections ----
  const startEditSection = (s: CustomSection) => {
    setEditSectionId(s.id)
    setSectionDraft({ label: s.label, heading: s.heading, body: s.body, visible: s.visible })
  }

  const saveSection = async () => {
    const isNew = editSectionId === 'new'
    const res = await fetch(isNew ? '/api/admin/sections' : `/api/admin/sections/${editSectionId}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sectionDraft),
    })
    const saved = await res.json()
    if (!res.ok) return
    setSections((prev) => (isNew ? [...prev, saved] : prev.map((s) => (s.id === saved.id ? saved : s))))
    setEditSectionId(null)
  }

  const deleteSection = async (id: number) => {
    if (!confirm('Delete this section?')) return
    await fetch(`/api/admin/sections/${id}`, { method: 'DELETE' })
    setSections(sections.filter((s) => s.id !== id))
  }

  const toggleSectionVisibility = async (s: CustomSection) => {
    const updated = { ...s, visible: !s.visible }
    await fetch(`/api/admin/sections/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setSections(sections.map((x) => (x.id === s.id ? updated : x)))
  }

  const moveSection = async (index: number, dir: -1 | 1) => {
    const next = index + dir
    if (next < 0 || next >= sections.length) return
    const reordered = [...sections]
    ;[reordered[index], reordered[next]] = [reordered[next], reordered[index]]
    setSections(reordered)
    await fetch('/api/admin/sections/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: reordered.map((s) => s.id) }),
    })
  }

  const groups = [...new Set(SETTING_FIELDS.map((f) => f.group))]
  const btn = 'flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white mb-1">Content</h1>
        <p className="text-sm text-zinc-500">Manage your portfolio content</p>
      </div>

      <div className="flex gap-1 border-b border-zinc-800">
        {(['settings', 'projects', 'experience', 'sections', 'skills'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-blue-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ===================== SETTINGS ===================== */}
      {tab === 'settings' && (
        <div className="max-w-lg space-y-6">
          {groups.map((group) => (
            <div key={group} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{group}</p>
              {SETTING_FIELDS.filter((f) => f.group === group).map((field) => (
                <div key={field.key}>
                  <label className="text-xs text-zinc-500 mb-1.5 block">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      rows={field.key === 'bio' ? 4 : 3}
                      value={settings[field.key] ?? ''}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      className={`${INPUT} resize-none`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={settings[field.key] ?? ''}
                      onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                      className={INPUT}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
          <button onClick={saveSettings} disabled={saving} className={btn}>
            <Save size={14} />
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      )}

      {/* ===================== PROJECTS ===================== */}
      {tab === 'projects' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">{projects.length} project(s)</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditProjectId('new')
                  setProjectDraft(emptyProject)
                }}
                className="flex items-center gap-2 px-3 py-1.5 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 text-sm font-medium rounded-md transition-colors"
              >
                <Plus size={14} /> New project
              </button>
              <button onClick={() => (importOpen ? setImportOpen(false) : openImport())} className={btn}>
                <Download size={14} />
                {importOpen ? 'Close importer' : 'Import from GitHub'}
              </button>
            </div>
          </div>

          {importOpen && (
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">Select repositories to import</p>
                <button onClick={() => setImportOpen(false)} className="text-zinc-500 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-zinc-500">
                Claude drafts a title, description, bullets, and tech from each repo&apos;s README. Re-importing
                refreshes those fields and keeps your screenshots.
              </p>
              {reposLoading && <p className="text-sm text-zinc-500">Loading repositories…</p>}
              {reposError && <p className="text-sm text-red-400">{reposError}</p>}
              {!reposLoading && !reposError && (
                <div className="max-h-80 overflow-y-auto space-y-1.5 pr-1">
                  {repos.map((r) => {
                    const status = importStatus[r.full_name]
                    return (
                      <label key={r.full_name} className="flex items-start gap-3 p-2.5 rounded-md hover:bg-zinc-900 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selected.has(r.full_name)}
                          onChange={() =>
                            setSelected((prev) => {
                              const n = new Set(prev)
                              if (n.has(r.full_name)) n.delete(r.full_name)
                              else n.add(r.full_name)
                              return n
                            })
                          }
                          className="mt-1 accent-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white truncate">{r.name}</span>
                            {r.language && <span className="text-xs text-zinc-500">{r.language}</span>}
                            {r.archived && <span className="text-xs text-amber-500">archived</span>}
                            {status && <span className="text-xs text-blue-400">{status}</span>}
                          </div>
                          {r.description && <p className="text-xs text-zinc-500 truncate mt-0.5">{r.description}</p>}
                        </div>
                      </label>
                    )
                  })}
                  {repos.length === 0 && <p className="text-sm text-zinc-500">No repositories found.</p>}
                </div>
              )}
              <button onClick={runImport} disabled={importing || selected.size === 0} className={btn}>
                <Download size={14} />
                {importing ? 'Importing…' : `Import ${selected.size || ''} selected`}
              </button>
            </div>
          )}

          {editProjectId === 'new' && (
            <ProjectForm draft={projectDraft} setDraft={setProjectDraft} onSave={saveProject} onCancel={() => setEditProjectId(null)} title="New project" />
          )}

          {projects.map((p, i) => (
            <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-lg">
              <div className="flex items-start justify-between gap-4 p-4">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div className="flex flex-col shrink-0 -ml-1">
                    <button
                      onClick={() => moveProject(i, -1)}
                      disabled={i === 0}
                      className="p-0.5 text-zinc-600 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-600 transition-colors"
                      title="Move up"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      onClick={() => moveProject(i, 1)}
                      disabled={i === projects.length - 1}
                      className="p-0.5 text-zinc-600 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-600 transition-colors"
                      title="Move down"
                    >
                      <ChevronDown size={15} />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${p.visible ? 'text-white' : 'text-zinc-500'}`}>{p.title}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {p.startDate} — {p.endDate ?? 'Present'}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.tech.slice(0, 6).map((t) => (
                        <span key={t} className="px-2 py-0.5 text-xs bg-zinc-800 text-zinc-500 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => (editProjectId === p.id ? setEditProjectId(null) : startEditProject(p))}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      editProjectId === p.id ? 'border-blue-500 text-blue-400' : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setRefiningId((cur) => (cur === p.id ? null : p.id))
                      setRefineText('')
                      setEditProjectId(null)
                    }}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      refiningId === p.id ? 'border-blue-500 text-blue-400' : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                    }`}
                    title="Rewrite this project's text with Claude"
                  >
                    Refine with AI
                  </button>
                  <button onClick={() => toggleProjectVisibility(p)} className="p-1.5 text-zinc-500 hover:text-white transition-colors" title={p.visible ? 'Hide' : 'Show'}>
                    {p.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => deleteProject(p.id)} className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {editProjectId === p.id && (
                <div className="border-t border-zinc-800 p-4">
                  <ProjectForm draft={projectDraft} setDraft={setProjectDraft} onSave={saveProject} onCancel={() => setEditProjectId(null)} />
                </div>
              )}

              {refiningId === p.id && (
                <div className="border-t border-zinc-800 p-4 space-y-2">
                  <textarea
                    rows={2}
                    value={refineText}
                    onChange={(e) => setRefineText(e.target.value)}
                    placeholder="How should Claude rewrite this? e.g. “Make the bullets more concise and emphasize the AI work”"
                    className={`${INPUT} resize-none`}
                  />
                  <div className="flex items-center gap-3">
                    <button onClick={() => applyRefine(p)} disabled={refineBusy || !refineText.trim()} className={btn}>
                      {refineBusy ? 'Refining…' : 'Apply'}
                    </button>
                    <button onClick={() => setRefiningId(null)} className="text-sm text-zinc-500 hover:text-white transition-colors">
                      Cancel
                    </button>
                    {refineStatus[p.id] && <span className="text-xs text-zinc-400">{refineStatus[p.id]}</span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===================== EXPERIENCE ===================== */}
      {tab === 'experience' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">{experience.length} entr(ies)</p>
            <button
              onClick={() => {
                setEditExpId('new')
                setExpDraft(emptyExp)
              }}
              className="flex items-center gap-2 px-3 py-1.5 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 text-sm font-medium rounded-md transition-colors"
            >
              <Plus size={14} /> New entry
            </button>
          </div>

          {editExpId === 'new' && (
            <ExpForm draft={expDraft} setDraft={setExpDraft} onSave={saveExp} onCancel={() => setEditExpId(null)} />
          )}

          {experience.map((e, i) => (
            <div key={e.id} className="bg-zinc-900 border border-zinc-800 rounded-lg">
              <div className="flex items-start justify-between gap-4 p-4">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div className="flex flex-col shrink-0 -ml-1">
                    <button onClick={() => moveExp(i, -1)} disabled={i === 0} className="p-0.5 text-zinc-600 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-600 transition-colors" title="Move up">
                      <ChevronUp size={15} />
                    </button>
                    <button onClick={() => moveExp(i, 1)} disabled={i === experience.length - 1} className="p-0.5 text-zinc-600 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-600 transition-colors" title="Move down">
                      <ChevronDown size={15} />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${e.visible ? 'text-white' : 'text-zinc-500'}`}>
                      {e.title} <span className="text-zinc-600 font-normal">· {e.type}</span>
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{e.company} · {e.location}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">{e.startDate} — {e.endDate ?? 'Present'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => (editExpId === e.id ? setEditExpId(null) : startEditExp(e))}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      editExpId === e.id ? 'border-blue-500 text-blue-400' : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                    }`}
                  >
                    Edit
                  </button>
                  <button onClick={() => toggleExpVisibility(e)} className="p-1.5 text-zinc-500 hover:text-white transition-colors" title={e.visible ? 'Hide' : 'Show'}>
                    {e.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => deleteExp(e.id)} className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {editExpId === e.id && (
                <div className="border-t border-zinc-800 p-4">
                  <ExpForm draft={expDraft} setDraft={setExpDraft} onSave={saveExp} onCancel={() => setEditExpId(null)} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===================== CUSTOM SECTIONS ===================== */}
      {tab === 'sections' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">{sections.length} custom section(s)</p>
            <button
              onClick={() => {
                setEditSectionId('new')
                setSectionDraft(emptySection)
              }}
              className="flex items-center gap-2 px-3 py-1.5 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 text-sm font-medium rounded-md transition-colors"
            >
              <Plus size={14} /> New section
            </button>
          </div>
          <p className="text-xs text-zinc-600">
            Custom sections render on the page between the Beyond and Contact sections, in this order.
          </p>

          {editSectionId === 'new' && (
            <SectionForm draft={sectionDraft} setDraft={setSectionDraft} onSave={saveSection} onCancel={() => setEditSectionId(null)} />
          )}

          {sections.map((s, i) => (
            <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-lg">
              <div className="flex items-start justify-between gap-4 p-4">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div className="flex flex-col shrink-0 -ml-1">
                    <button onClick={() => moveSection(i, -1)} disabled={i === 0} className="p-0.5 text-zinc-600 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-600 transition-colors" title="Move up">
                      <ChevronUp size={15} />
                    </button>
                    <button onClick={() => moveSection(i, 1)} disabled={i === sections.length - 1} className="p-0.5 text-zinc-600 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-600 transition-colors" title="Move down">
                      <ChevronDown size={15} />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${s.visible ? 'text-white' : 'text-zinc-500'}`}>{s.heading || s.label || '(untitled)'}</p>
                    {s.label && <p className="text-xs text-zinc-600 mt-0.5 uppercase tracking-wider">{s.label}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => (editSectionId === s.id ? setEditSectionId(null) : startEditSection(s))}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      editSectionId === s.id ? 'border-blue-500 text-blue-400' : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                    }`}
                  >
                    Edit
                  </button>
                  <button onClick={() => toggleSectionVisibility(s)} className="p-1.5 text-zinc-500 hover:text-white transition-colors" title={s.visible ? 'Hide' : 'Show'}>
                    {s.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => deleteSection(s.id)} className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {editSectionId === s.id && (
                <div className="border-t border-zinc-800 p-4">
                  <SectionForm draft={sectionDraft} setDraft={setSectionDraft} onSave={saveSection} onCancel={() => setEditSectionId(null)} />
                </div>
              )}
            </div>
          ))}
          {sections.length === 0 && <p className="text-sm text-zinc-500">No custom sections yet — click “New section” to add one.</p>}
        </div>
      )}

      {/* ===================== SKILLS ===================== */}
      {tab === 'skills' && (
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-end gap-2 p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
            <div className="flex-1">
              <label className="text-xs text-zinc-500 mb-1 block">Name</label>
              <input value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} className={INPUT} placeholder="e.g. Rust" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-zinc-500 mb-1 block">Category</label>
              <input value={newSkill.category} onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })} className={INPUT} placeholder="e.g. Languages" />
            </div>
            <button onClick={addSkill} disabled={!newSkill.name.trim() || !newSkill.category.trim()} className={btn}>
              <Plus size={14} /> Add
            </button>
          </div>

          <div className="space-y-1.5">
            {skills.map((s) => (
              <div key={s.id} className="flex items-center gap-2 p-2.5 bg-zinc-900 border border-zinc-800 rounded-md">
                {editSkillId === s.id ? (
                  <>
                    <input value={skillDraft.name} onChange={(e) => setSkillDraft({ ...skillDraft, name: e.target.value })} className={`${INPUT} flex-1`} />
                    <input value={skillDraft.category} onChange={(e) => setSkillDraft({ ...skillDraft, category: e.target.value })} className={`${INPUT} flex-1`} />
                    <button onClick={() => saveSkill(s)} className={btn}>
                      <Save size={13} /> Save
                    </button>
                    <button onClick={() => setEditSkillId(null)} className="text-sm text-zinc-500 hover:text-white px-2">Cancel</button>
                  </>
                ) : (
                  <>
                    <span className={`flex-1 text-sm ${s.visible ? 'text-white' : 'text-zinc-500'}`}>{s.name}</span>
                    <span className="text-xs text-zinc-500 w-32 shrink-0">{s.category}</span>
                    <button
                      onClick={() => {
                        setEditSkillId(s.id)
                        setSkillDraft({ name: s.name, category: s.category })
                      }}
                      className="px-2 py-1 text-xs rounded border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
                    >
                      Edit
                    </button>
                    <button onClick={() => toggleSkillVisibility(s)} className="p-1 text-zinc-500 hover:text-white transition-colors" title={s.visible ? 'Hide' : 'Show'}>
                      {s.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => deleteSkill(s.id)} className="p-1 text-zinc-500 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// --- Inline form components (module-level so inputs keep focus across re-renders) ---

const FORM_INPUT =
  'w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-zinc-500 mb-1 block">{label}</label>
      {children}
    </div>
  )
}

const asMB = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)}MB`

// Where a media entry lives, which decides whether we may delete the file itself.
function originOf(src: string) {
  if (isBlobUrl(src)) return { label: 'uploaded', deletable: true }
  if (toMedia(src).kind === 'youtube') return { label: 'YouTube', deletable: false }
  return { label: 'public/', deletable: false }
}

function MediaManager({
  media,
  setMedia,
}: {
  media: string[]
  setMedia: (next: (current: string[]) => string[]) => void
}) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [urlText, setUrlText] = useState('')
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)
  const busy = Object.keys(progress).length > 0

  const move = (i: number, dir: number) =>
    setMedia((cur) => {
      const j = i + dir
      if (j < 0 || j >= cur.length) return cur
      const next = [...cur]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })

  const remove = async (i: number) => {
    const src = media[i]
    // An upload is ours to delete; a committed file or a YouTube link is only unlinked.
    if (originOf(src).deletable) {
      const alsoDelete = confirm(
        'Delete the uploaded file from Blob storage too?\n\n' +
          'OK — remove it here and delete the file permanently.\n' +
          'Cancel — remove it here only; the file stays in storage.'
      )
      if (alsoDelete) {
        const res = await fetch('/api/admin/media', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: src }),
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          setError(body.error ?? 'Could not delete the file from storage.')
          return
        }
      }
    }
    setMedia((cur) => cur.filter((_, k) => k !== i))
  }

  const addUrls = () => {
    const entries = splitLines(urlText)
    if (!entries.length) return
    setMedia((cur) => [...cur, ...entries.filter((e) => !cur.includes(e))])
    setUrlText('')
  }

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setError(null)
    for (const file of Array.from(files)) {
      if (!UPLOAD_CONTENT_TYPES.includes(file.type)) {
        setError(`${file.name}: ${file.type || 'unknown type'} is not an accepted image or video.`)
        continue
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        setError(`${file.name} is ${asMB(file.size)} — over the ${asMB(MAX_UPLOAD_BYTES)} limit.`)
        continue
      }
      try {
        setProgress((p) => ({ ...p, [file.name]: 0 }))
        const blob = await upload(`projects/${file.name}`, file, {
          access: 'public',
          handleUploadUrl: '/api/admin/media/upload',
          // Big files get split into parts uploaded in parallel and retried
          // individually; below this the extra round trips aren't worth it.
          multipart: file.size > 5 * 1024 * 1024,
          onUploadProgress: ({ percentage }) =>
            setProgress((p) => ({ ...p, [file.name]: percentage })),
        })
        setMedia((cur) => [...cur, blob.url])
      } catch (e) {
        setError(`${file.name}: ${e instanceof Error ? e.message : 'upload failed'}`)
      } finally {
        setProgress((p) => {
          const next = { ...p }
          delete next[file.name]
          return next
        })
      }
    }
    if (fileInput.current) fileInput.current.value = ''
  }

  return (
    <div className="space-y-2">
      {media.length > 0 && (
        <ul className="space-y-1.5">
          {media.map((src, i) => {
            const item = toMedia(src)
            const origin = originOf(src)
            return (
              <li
                key={src}
                className="flex items-center gap-2.5 p-1.5 bg-zinc-950 border border-zinc-800 rounded-md"
              >
                <div className="relative w-16 aspect-video shrink-0 overflow-hidden rounded bg-zinc-900">
                  {item.kind === 'video' ? (
                    <video
                      src={firstFrame(item.src)}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.kind === 'youtube' ? youtubePoster(item.id) : item.src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {i === 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-medium">
                        thumbnail
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
                      {item.kind === 'youtube' ? 'video' : item.kind} · {origin.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-zinc-500 font-mono truncate" title={src}>
                    {src}
                  </p>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move up"
                    className="p-1 text-zinc-500 hover:text-white disabled:opacity-25 disabled:hover:text-zinc-500 transition-colors"
                  >
                    <ChevronUp size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === media.length - 1}
                    aria-label="Move down"
                    className="p-1 text-zinc-500 hover:text-white disabled:opacity-25 disabled:hover:text-zinc-500 transition-colors"
                  >
                    <ChevronDown size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label="Remove"
                    className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {Object.entries(progress).map(([name, pct]) => (
        <div key={name} className="flex items-center gap-2 text-[11px] text-zinc-500">
          <div className="h-1 flex-1 rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="font-mono shrink-0">
            {name} {Math.round(pct)}%
          </span>
        </div>
      ))}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex items-center gap-2">
        <input
          ref={fileInput}
          type="file"
          multiple
          accept={UPLOAD_CONTENT_TYPES.join(',')}
          onChange={(e) => onFiles(e.target.files)}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={busy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white text-xs font-medium rounded-md transition-colors"
        >
          <Upload size={13} /> {busy ? 'Uploading…' : 'Upload files'}
        </button>
        <input
          value={urlText}
          onChange={(e) => setUrlText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addUrls()
            }
          }}
          placeholder="…or paste a YouTube URL / public path"
          className={`${FORM_INPUT} flex-1 py-1.5 text-xs`}
        />
        <button
          type="button"
          onClick={addUrls}
          disabled={!urlText.trim()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white text-xs font-medium rounded-md transition-colors"
        >
          <Plus size={13} /> Add
        </button>
      </div>

      <p className="text-xs text-zinc-600">
        Images and videos share one ordered list; the first entry is the card thumbnail. Uploads go
        to Vercel Blob (max {asMB(MAX_UPLOAD_BYTES)} each) and are live as soon as you hit Save —
        no redeploy. Nothing is written to the project until you Save.
      </p>
    </div>
  )
}

function ProjectForm({
  draft,
  setDraft,
  onSave,
  onCancel,
  title,
}: {
  draft: ProjectDraft
  setDraft: React.Dispatch<React.SetStateAction<ProjectDraft>>
  onSave: () => void
  onCancel: () => void
  title?: string
}) {
  return (
    <div className="space-y-3">
      {title && <p className="text-sm font-medium text-white">{title}</p>}
      <Field label="Title">
        <input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} className={FORM_INPUT} />
      </Field>
      <Field label="Description">
        <textarea rows={3} value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} className={`${FORM_INPUT} resize-none`} />
      </Field>
      <Field label="Bullets (one per line)">
        <textarea rows={5} value={draft.bulletsText} onChange={(e) => setDraft((d) => ({ ...d, bulletsText: e.target.value }))} className={`${FORM_INPUT} resize-none`} />
      </Field>
      <Field label="Tech (comma-separated)">
        <input value={draft.techText} onChange={(e) => setDraft((d) => ({ ...d, techText: e.target.value }))} className={FORM_INPUT} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start date">
          <input value={draft.startDate} onChange={(e) => setDraft((d) => ({ ...d, startDate: e.target.value }))} className={FORM_INPUT} placeholder="Jan 2026" />
        </Field>
        <Field label="End date (blank = Present)">
          <input value={draft.endDate} onChange={(e) => setDraft((d) => ({ ...d, endDate: e.target.value }))} className={FORM_INPUT} placeholder="Dec 2026" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="GitHub URL">
          <input value={draft.githubUrl} onChange={(e) => setDraft((d) => ({ ...d, githubUrl: e.target.value }))} className={FORM_INPUT} />
        </Field>
        <Field label="Live URL">
          <input value={draft.liveUrl} onChange={(e) => setDraft((d) => ({ ...d, liveUrl: e.target.value }))} className={FORM_INPUT} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-zinc-400">
        <input type="checkbox" checked={draft.visible} onChange={(e) => setDraft((d) => ({ ...d, visible: e.target.checked }))} className="accent-blue-500" />
        Visible on site
      </label>
      <Field label="Media (first entry is the card thumbnail)">
        <MediaManager
          media={draft.media}
          setMedia={(next) => setDraft((d) => ({ ...d, media: next(d.media) }))}
        />
      </Field>
      <div className="flex items-center gap-3">
        <button onClick={onSave} disabled={!draft.title.trim()} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors">
          <Save size={14} /> Save
        </button>
        <button onClick={onCancel} className="text-sm text-zinc-500 hover:text-white transition-colors">Cancel</button>
      </div>
    </div>
  )
}

function ExpForm({
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: ExpDraft
  setDraft: React.Dispatch<React.SetStateAction<ExpDraft>>
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Title">
          <input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} className={FORM_INPUT} />
        </Field>
        <Field label="Type">
          <select value={draft.type} onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))} className={FORM_INPUT}>
            <option value="work">work</option>
            <option value="education">education</option>
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Company / School">
          <input value={draft.company} onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))} className={FORM_INPUT} />
        </Field>
        <Field label="Location">
          <input value={draft.location} onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))} className={FORM_INPUT} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start date">
          <input value={draft.startDate} onChange={(e) => setDraft((d) => ({ ...d, startDate: e.target.value }))} className={FORM_INPUT} placeholder="Jan 2026" />
        </Field>
        <Field label="End date (blank = Present)">
          <input value={draft.endDate} onChange={(e) => setDraft((d) => ({ ...d, endDate: e.target.value }))} className={FORM_INPUT} />
        </Field>
      </div>
      {draft.type === 'education' && (
        <Field label="GPA (blank to hide)">
          <input value={draft.gpa} onChange={(e) => setDraft((d) => ({ ...d, gpa: e.target.value }))} className={FORM_INPUT} placeholder="3.85 or 3.85 / 4.0" />
        </Field>
      )}
      <Field label="Bullets (one per line)">
        <textarea rows={4} value={draft.bulletsText} onChange={(e) => setDraft((d) => ({ ...d, bulletsText: e.target.value }))} className={`${FORM_INPUT} resize-none`} />
      </Field>
      <label className="flex items-center gap-2 text-sm text-zinc-400">
        <input type="checkbox" checked={draft.visible} onChange={(e) => setDraft((d) => ({ ...d, visible: e.target.checked }))} className="accent-blue-500" />
        Visible on site
      </label>
      <div className="flex items-center gap-3">
        <button onClick={onSave} disabled={!draft.title.trim()} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors">
          <Save size={14} /> Save
        </button>
        <button onClick={onCancel} className="text-sm text-zinc-500 hover:text-white transition-colors">Cancel</button>
      </div>
    </div>
  )
}

function SectionForm({
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: SectionDraft
  setDraft: React.Dispatch<React.SetStateAction<SectionDraft>>
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="space-y-3">
      <Field label="Section label (small uppercase tag)">
        <input value={draft.label} onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))} className={FORM_INPUT} placeholder="e.g. Awards" />
      </Field>
      <Field label="Heading">
        <input value={draft.heading} onChange={(e) => setDraft((d) => ({ ...d, heading: e.target.value }))} className={FORM_INPUT} placeholder="e.g. Recognition and Awards" />
      </Field>
      <Field label="Body (a blank line separates paragraphs)">
        <textarea rows={5} value={draft.body} onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))} className={`${FORM_INPUT} resize-none`} />
      </Field>
      <label className="flex items-center gap-2 text-sm text-zinc-400">
        <input type="checkbox" checked={draft.visible} onChange={(e) => setDraft((d) => ({ ...d, visible: e.target.checked }))} className="accent-blue-500" />
        Visible on site
      </label>
      <div className="flex items-center gap-3">
        <button onClick={onSave} disabled={!draft.heading.trim() && !draft.label.trim()} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors">
          <Save size={14} /> Save
        </button>
        <button onClick={onCancel} className="text-sm text-zinc-500 hover:text-white transition-colors">Cancel</button>
      </div>
    </div>
  )
}
