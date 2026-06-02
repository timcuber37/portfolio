'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import { Eye, Download, Globe, MessageSquare } from 'lucide-react'

interface AnalyticsData {
  total: number
  downloads: number
  messageCount: number
  byDay: { date: string; count: number }[]
  byCountry: { country: string; count: number }[]
  recentMessages: { id: number; name: string; email: string; message: string; createdAt: string; read: boolean }[]
}

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a78bfa', '#60a5fa', '#818cf8']

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics/data')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-zinc-500 text-sm">Loading analytics...</p>
      </div>
    )
  }

  if (!data) {
    return <p className="text-red-400 text-sm">Failed to load analytics.</p>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-white mb-1">Analytics</h1>
        <p className="text-sm text-zinc-500">Portfolio performance overview</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Total Page Views" value={data.total} />
        <StatCard icon={Download} label="Resume Downloads" value={data.downloads} />
        <StatCard icon={Globe} label="Countries Reached" value={data.byCountry.length} />
        <StatCard icon={MessageSquare} label="Messages" value={data.messageCount} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-sm font-medium text-white mb-4">Page Views (Last 30 Days)</p>
          {data.byDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.byDay}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#71717a' }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis tick={{ fontSize: 11, fill: '#71717a' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 6 }}
                  labelStyle={{ color: '#f4f4f5', fontSize: 12 }}
                  itemStyle={{ color: '#3b82f6', fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-zinc-500 text-xs text-center py-16">No data yet</p>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-sm font-medium text-white mb-4">Top Countries</p>
          {data.byCountry.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.byCountry} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11, fill: '#71717a' }} allowDecimals={false} />
                <YAxis type="category" dataKey="country" tick={{ fontSize: 11, fill: '#71717a' }} width={90} />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 6 }}
                  labelStyle={{ color: '#f4f4f5', fontSize: 12 }}
                  itemStyle={{ color: '#3b82f6', fontSize: 12 }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.byCountry.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-zinc-500 text-xs text-center py-16">No country data yet</p>
          )}
        </div>
      </div>

      {data.recentMessages.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-sm font-medium text-white mb-4">Recent Messages</p>
          <div className="space-y-3">
            {data.recentMessages.map((msg) => (
              <div key={msg.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white">{msg.name}</span>
                  <span className="text-xs text-zinc-600">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-zinc-500">{msg.email}</p>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: number
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className="text-blue-400" />
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
    </div>
  )
}
