'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from '@/i18n/context'
import type { TestimonialData } from '@/components/testimonials/TestimonialCard'

// ============================================================
// Admin Testimonials — CRUD management, CSV export
// ============================================================

type Filter = 'all' | 'active' | 'inactive'

const COMMON_TAGS = [
  'ocean', 'river', 'luxury', 'expedition',
  'mediterranean', 'caribbean', 'alaska', 'danube', 'norwegian-fjords', 'baltic',
  'family', 'couples', 'romantic', 'adventure', 'relaxation', 'budget',
  'msc-cruises', 'royal-caribbean', 'costa-cruises', 'norwegian', 'celebrity',
]

export default function AdminTestimonials() {
  const { locale } = useLocale()
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('active')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Form state
  const [formName, setFormName] = useState('')
  const [formCity, setFormCity] = useState('')
  const [formRating, setFormRating] = useState(5)
  const [formQuote, setFormQuote] = useState('')
  const [formTags, setFormTags] = useState<string[]>([])
  const [formSortOrder, setFormSortOrder] = useState(0)

  const fetchTestimonials = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/testimonials?all=1&limit=50')
      const data = await res.json()
      setTestimonials(data.testimonials || [])
    } catch {
      setTestimonials([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTestimonials()
  }, [fetchTestimonials])

  const resetForm = () => {
    setFormName('')
    setFormCity('')
    setFormRating(5)
    setFormQuote('')
    setFormTags([])
    setFormSortOrder(0)
    setEditingId(null)
    setShowCreateForm(false)
  }

  const loadIntoForm = (t: TestimonialData) => {
    setFormName(t.name)
    setFormCity(t.city || '')
    setFormRating(t.rating)
    setFormQuote(t.quote)
    setFormTags(t.tags)
    setFormSortOrder(t.sort_order)
    setEditingId(t.id)
    setShowCreateForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formQuote.trim()) return

    const payload = {
      id: editingId || undefined,
      name: formName.trim(),
      city: formCity.trim() || null,
      rating: formRating,
      quote: formQuote.trim(),
      tags: formTags,
      sort_order: formSortOrder,
      active: true,
    }

    try {
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch('/api/testimonials', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        await fetchTestimonials()
        resetForm()
      }
    } catch (err) {
      console.error('Failed to save testimonial:', err)
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    // Optimistic update
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active } : t)),
    )

    try {
      await fetch('/api/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active }),
      })
    } catch (err) {
      console.error('Failed to update testimonial:', err)
    }
  }

  const deleteTestimonial = async (id: string) => {
    if (!confirm(locale === 'ro' ? 'Sigur doresti sa stergi?' : 'Are you sure you want to delete?')) return

    setTestimonials((prev) => prev.filter((t) => t.id !== id))

    try {
      await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' })
    } catch (err) {
      console.error('Failed to delete testimonial:', err)
    }
  }

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'City', 'Rating', 'Quote', 'Tags', 'Active', 'Sort Order', 'Created At']
    const rows = filteredTestimonials.map((t) => [
      t.id,
      t.name,
      t.city || '',
      t.rating,
      `"${t.quote.replace(/"/g, '""')}"`,
      t.tags.join(';'),
      t.active ? 'Yes' : 'No',
      t.sort_order,
      t.created_at,
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `testimonials-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleTag = (tag: string) => {
    setFormTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  const filteredTestimonials = testimonials.filter((t) => {
    if (filter === 'active') return t.active
    if (filter === 'inactive') return !t.active
    return true
  })

  const activeCount = testimonials.filter((t) => t.active).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy-900">
          {locale === 'ro' ? 'Testimoniale' : 'Testimonials'}
          <span className="ml-2 text-sm font-normal text-navy-500">
            ({activeCount} {locale === 'ro' ? 'active' : 'active'})
          </span>
        </h3>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-navy-200 text-navy-600 hover:bg-navy-50 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => {
              resetForm()
              setShowCreateForm(true)
            }}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gold-500 text-white hover:bg-gold-600 transition-colors"
          >
            + {locale === 'ro' ? 'Adauga' : 'Add New'}
          </button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gold-200 p-6 space-y-4"
        >
          <h4 className="text-sm font-bold text-navy-900">
            {editingId
              ? locale === 'ro' ? 'Editeaza Testimonial' : 'Edit Testimonial'
              : locale === 'ro' ? 'Testimonial Nou' : 'New Testimonial'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1">
                {locale === 'ro' ? 'Nume *' : 'Name *'}
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                placeholder="Maria Ionescu"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1">
                {locale === 'ro' ? 'Oras' : 'City'}
              </label>
              <input
                type="text"
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                placeholder="București"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-navy-600 mb-1">
                  Rating *
                </label>
                <select
                  value={formRating}
                  onChange={(e) => setFormRating(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} {'★'.repeat(r)}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-navy-600 mb-1">
                  {locale === 'ro' ? 'Ordine' : 'Sort Order'}
                </label>
                <input
                  type="number"
                  value={formSortOrder}
                  onChange={(e) => setFormSortOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-navy-600 mb-1">
              {locale === 'ro' ? 'Citat *' : 'Quote *'}
            </label>
            <textarea
              value={formQuote}
              onChange={(e) => setFormQuote(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-400 resize-y"
              placeholder={locale === 'ro' ? 'O experienta extraordinara...' : 'An amazing experience...'}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-navy-600 mb-2">
              Tags ({locale === 'ro' ? 'pentru relevanta' : 'for relevance matching'})
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all ${
                    formTags.includes(tag)
                      ? 'bg-gold-500 text-white'
                      : 'bg-navy-100 text-navy-500 hover:bg-navy-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gold-500 text-white hover:bg-gold-600 transition-colors"
            >
              {editingId
                ? locale === 'ro' ? 'Salveaza' : 'Save Changes'
                : locale === 'ro' ? 'Creeaza' : 'Create'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-navy-200 text-navy-600 hover:bg-navy-50 transition-colors"
            >
              {locale === 'ro' ? 'Anuleaza' : 'Cancel'}
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex gap-1 bg-navy-100 rounded-lg p-1">
        {(
          [
            { key: 'active', label: locale === 'ro' ? 'Active' : 'Active' },
            { key: 'inactive', label: locale === 'ro' ? 'Inactive' : 'Inactive' },
            { key: 'all', label: locale === 'ro' ? 'Toate' : 'All' },
          ] as { key: Filter; label: string }[]
        ).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              filter === f.key
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-navy-500 hover:text-navy-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-navy-100 p-5 animate-pulse h-32" />
          ))}
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="text-center py-12 text-navy-400">
          <p>{locale === 'ro' ? 'Niciun testimonial gasit' : 'No testimonials found'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-xl border p-5 transition-all ${
                testimonial.active
                  ? 'border-emerald-200'
                  : 'border-navy-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        className={`w-4 h-4 ${s <= testimonial.rating ? 'text-gold-500' : 'text-navy-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      testimonial.active
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-navy-100 text-navy-500'
                    }`}
                  >
                    {testimonial.active
                      ? locale === 'ro' ? 'ACTIV' : 'ACTIVE'
                      : locale === 'ro' ? 'INACTIV' : 'INACTIVE'}
                  </span>
                  <span className="text-[10px] text-navy-400">
                    #{testimonial.sort_order}
                  </span>
                </div>
                <span className="text-xs text-navy-400">
                  {new Date(testimonial.created_at).toLocaleDateString(
                    locale === 'ro' ? 'ro-RO' : 'en-GB',
                    { day: 'numeric', month: 'short', year: 'numeric' },
                  )}
                </span>
              </div>

              <p className="text-sm text-navy-700 leading-relaxed mb-2">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Tags */}
              {testimonial.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {testimonial.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-navy-500 bg-navy-50 px-1.5 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-navy-500">
                  <span className="font-medium text-navy-700">{testimonial.name}</span>
                  {testimonial.city && ` — ${testimonial.city}`}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => loadIntoForm(testimonial)}
                    className="text-xs font-medium text-navy-500 hover:text-navy-700 transition-colors"
                  >
                    {locale === 'ro' ? 'Editeaza' : 'Edit'}
                  </button>
                  {testimonial.active ? (
                    <button
                      onClick={() => toggleActive(testimonial.id, false)}
                      className="text-xs font-medium text-yellow-600 hover:text-yellow-700 transition-colors"
                    >
                      {locale === 'ro' ? 'Dezactiveaza' : 'Deactivate'}
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleActive(testimonial.id, true)}
                      className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      {locale === 'ro' ? 'Activeaza' : 'Activate'}
                    </button>
                  )}
                  <button
                    onClick={() => deleteTestimonial(testimonial.id)}
                    className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                  >
                    {locale === 'ro' ? 'Sterge' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
