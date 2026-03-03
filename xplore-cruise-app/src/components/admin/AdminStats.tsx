'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from '@/i18n/context'

// ============================================================
// Admin Stats Management — CRUD for homepage trust metrics
// ============================================================

interface SiteStat {
  id: string
  stat_key: string
  stat_value: number
  label_en: string
  label_ro: string
  suffix: string
  sort_order: number
  active: boolean
  updated_at: string
}

export default function AdminStats() {
  const { locale } = useLocale()
  const [stats, setStats] = useState<SiteStat[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<SiteStat>>({})
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({
    stat_key: '',
    stat_value: 0,
    label_en: '',
    label_ro: '',
    suffix: '+',
    sort_order: 99,
  })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats?all=1')
      const data = await res.json()
      setStats(data.stats || [])
    } catch {
      setStats([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg })
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleUpdate = async (id: string, updates: Partial<SiteStat>) => {
    setSaving(true)
    try {
      const res = await fetch('/api/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })
      if (!res.ok) throw new Error('Update failed')

      const data = await res.json()
      setStats((prev) => prev.map((s) => (s.id === id ? { ...s, ...data.stat } : s)))
      setEditingId(null)
      setEditForm({})
      showFeedback('success', locale === 'ro' ? 'Statistica actualizata!' : 'Stat updated!')
    } catch {
      showFeedback('error', locale === 'ro' ? 'Eroare la actualizare' : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleCreate = async () => {
    if (!createForm.stat_key || !createForm.label_en || !createForm.label_ro) {
      showFeedback('error', locale === 'ro' ? 'Completati toate campurile' : 'Fill in all fields')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      if (!res.ok) throw new Error('Create failed')

      const data = await res.json()
      setStats((prev) => [...prev, data.stat])
      setShowCreate(false)
      setCreateForm({ stat_key: '', stat_value: 0, label_en: '', label_ro: '', suffix: '+', sort_order: 99 })
      showFeedback('success', locale === 'ro' ? 'Statistica creata!' : 'Stat created!')
    } catch {
      showFeedback('error', locale === 'ro' ? 'Eroare la creare' : 'Create failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(locale === 'ro' ? 'Sigur doriti sa stergeti?' : 'Are you sure you want to delete?')) return
    try {
      const res = await fetch(`/api/stats?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')

      setStats((prev) => prev.filter((s) => s.id !== id))
      showFeedback('success', locale === 'ro' ? 'Statistica stearsa!' : 'Stat deleted!')
    } catch {
      showFeedback('error', locale === 'ro' ? 'Eroare la stergere' : 'Delete failed')
    }
  }

  const handleToggleActive = async (stat: SiteStat) => {
    await handleUpdate(stat.id, { active: !stat.active })
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-navy-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-navy-900">
            {locale === 'ro' ? 'Statistici Homepage' : 'Homepage Stats'}
          </h3>
          <p className="text-sm text-navy-500">
            {locale === 'ro'
              ? 'Gestioneaza metricile de incredere afisate pe pagina principala'
              : 'Manage trust metrics displayed on the homepage'}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-gold-500 text-white rounded-lg text-sm font-medium hover:bg-gold-600 transition-colors"
        >
          {showCreate
            ? (locale === 'ro' ? 'Anuleaza' : 'Cancel')
            : (locale === 'ro' ? '+ Adauga statistica' : '+ Add Stat')}
        </button>
      </div>

      {/* Feedback message */}
      {feedback && (
        <div className={`p-3 rounded-lg text-sm font-medium ${
          feedback.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {feedback.msg}
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="bg-navy-50 rounded-xl p-5 border border-navy-200">
          <h4 className="text-sm font-bold text-navy-900 mb-4">
            {locale === 'ro' ? 'Statistica noua' : 'New Stat'}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1">
                {locale === 'ro' ? 'Cheie' : 'Key'}
              </label>
              <input
                type="text"
                value={createForm.stat_key}
                onChange={(e) => setCreateForm({ ...createForm, stat_key: e.target.value })}
                placeholder="e.g. cruises"
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1">
                {locale === 'ro' ? 'Valoare' : 'Value'}
              </label>
              <input
                type="number"
                value={createForm.stat_value}
                onChange={(e) => setCreateForm({ ...createForm, stat_value: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1">
                {locale === 'ro' ? 'Sufix' : 'Suffix'}
              </label>
              <input
                type="text"
                value={createForm.suffix}
                onChange={(e) => setCreateForm({ ...createForm, suffix: e.target.value })}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1">Label EN</label>
              <input
                type="text"
                value={createForm.label_en}
                onChange={(e) => setCreateForm({ ...createForm, label_en: e.target.value })}
                placeholder="e.g. Cruise Offers"
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1">Label RO</label>
              <input
                type="text"
                value={createForm.label_ro}
                onChange={(e) => setCreateForm({ ...createForm, label_ro: e.target.value })}
                placeholder="e.g. Oferte Croaziere"
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1">
                {locale === 'ro' ? 'Ordine' : 'Sort Order'}
              </label>
              <input
                type="number"
                value={createForm.sort_order}
                onChange={(e) => setCreateForm({ ...createForm, sort_order: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleCreate}
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {saving
                ? (locale === 'ro' ? 'Se salveaza...' : 'Saving...')
                : (locale === 'ro' ? 'Creeaza' : 'Create')}
            </button>
          </div>
        </div>
      )}

      {/* Stats table */}
      <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 border-b border-navy-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-navy-600">
                {locale === 'ro' ? 'Cheie' : 'Key'}
              </th>
              <th className="text-left px-4 py-3 font-medium text-navy-600">
                {locale === 'ro' ? 'Valoare' : 'Value'}
              </th>
              <th className="text-left px-4 py-3 font-medium text-navy-600">Label EN</th>
              <th className="text-left px-4 py-3 font-medium text-navy-600">Label RO</th>
              <th className="text-left px-4 py-3 font-medium text-navy-600">
                {locale === 'ro' ? 'Sufix' : 'Suffix'}
              </th>
              <th className="text-center px-4 py-3 font-medium text-navy-600">
                {locale === 'ro' ? 'Activ' : 'Active'}
              </th>
              <th className="text-right px-4 py-3 font-medium text-navy-600">
                {locale === 'ro' ? 'Actiuni' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {stats.map((stat) => (
              <tr key={stat.id} className={`hover:bg-navy-50/50 ${!stat.active ? 'opacity-50' : ''}`}>
                {editingId === stat.id ? (
                  // Editing row
                  <>
                    <td className="px-4 py-3 font-mono text-xs text-navy-500">{stat.stat_key}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={editForm.stat_value ?? stat.stat_value}
                        onChange={(e) => setEditForm({ ...editForm, stat_value: Number(e.target.value) })}
                        className="w-24 px-2 py-1 border border-navy-200 rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={editForm.label_en ?? stat.label_en}
                        onChange={(e) => setEditForm({ ...editForm, label_en: e.target.value })}
                        className="w-full px-2 py-1 border border-navy-200 rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={editForm.label_ro ?? stat.label_ro}
                        onChange={(e) => setEditForm({ ...editForm, label_ro: e.target.value })}
                        className="w-full px-2 py-1 border border-navy-200 rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={editForm.suffix ?? stat.suffix}
                        onChange={(e) => setEditForm({ ...editForm, suffix: e.target.value })}
                        className="w-16 px-2 py-1 border border-navy-200 rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">—</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleUpdate(stat.id, editForm)}
                        disabled={saving}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                      >
                        {locale === 'ro' ? 'Salveaza' : 'Save'}
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditForm({}) }}
                        className="px-3 py-1 bg-navy-200 text-navy-700 rounded text-xs hover:bg-navy-300"
                      >
                        {locale === 'ro' ? 'Anuleaza' : 'Cancel'}
                      </button>
                    </td>
                  </>
                ) : (
                  // Display row
                  <>
                    <td className="px-4 py-3 font-mono text-xs text-navy-500">{stat.stat_key}</td>
                    <td className="px-4 py-3">
                      <span className="text-lg font-bold text-navy-900">{stat.stat_value}</span>
                      <span className="text-gold-500 ml-0.5">{stat.suffix}</span>
                    </td>
                    <td className="px-4 py-3 text-navy-700">{stat.label_en}</td>
                    <td className="px-4 py-3 text-navy-700">{stat.label_ro}</td>
                    <td className="px-4 py-3 text-navy-500">{stat.suffix}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleActive(stat)}
                        className={`w-8 h-5 rounded-full relative transition-colors ${
                          stat.active ? 'bg-green-500' : 'bg-navy-300'
                        }`}
                        title={stat.active ? 'Deactivate' : 'Activate'}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          stat.active ? 'left-3.5' : 'left-0.5'
                        }`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => { setEditingId(stat.id); setEditForm({}) }}
                        className="px-3 py-1 bg-navy-100 text-navy-700 rounded text-xs hover:bg-navy-200"
                      >
                        {locale === 'ro' ? 'Editeaza' : 'Edit'}
                      </button>
                      <button
                        onClick={() => handleDelete(stat.id)}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100"
                      >
                        {locale === 'ro' ? 'Sterge' : 'Delete'}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {stats.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-navy-400">
                  {locale === 'ro' ? 'Nicio statistica gasita' : 'No stats found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Info note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
        <strong>{locale === 'ro' ? 'Nota:' : 'Note:'}</strong>{' '}
        {locale === 'ro'
          ? 'Aceste statistici sunt afisate in sectiunea de trust metrics de pe pagina principala. Modificarile vor fi vizibile dupa reincarcarea paginii (cache 10 minute).'
          : 'These stats are shown in the trust metrics section on the homepage. Changes will be visible after page reload (10-minute cache).'}
      </div>
    </div>
  )
}
