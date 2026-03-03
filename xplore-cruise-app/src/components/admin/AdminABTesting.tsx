'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from '@/i18n/context'
import { CTA_VARIANTS, type CTAVariant } from '@/lib/ab-testing'

// ============================================================
// Admin A/B Testing Dashboard — shows CTA variant performance
// ============================================================

interface VariantResult {
  variant: string
  impressions: number
  clicks: number
  conversionRate: number
  primaryClicks: number
  secondaryClicks: number
}

interface ABResults {
  results: VariantResult[]
  period: { from: string; to: string; days: number }
  totalImpressions: number
  totalClicks: number
  overallConversionRate: number
  isDemo: boolean
}

type Period = 7 | 30 | 90

export default function AdminABTesting() {
  const { locale } = useLocale()
  const [results, setResults] = useState<ABResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState<Period>(30)

  const fetchResults = useCallback(async (days: Period) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/ab-results?days=${days}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: ABResults = await res.json()
      setResults(data)
    } catch (err) {
      setError(
        locale === 'ro'
          ? 'Eroare la incarcarea rezultatelor'
          : 'Error loading results'
      )
      console.error('[AdminABTesting] Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [locale])

  useEffect(() => {
    fetchResults(period)
  }, [period, fetchResults])

  const handlePeriodChange = (days: Period) => {
    setPeriod(days)
  }

  // Find the winning variant (highest conversion rate with min 10 impressions)
  const getWinner = (): string | null => {
    if (!results) return null
    const eligible = results.results.filter((r) => r.impressions >= 10)
    if (eligible.length === 0) return null
    return eligible.reduce((best, curr) =>
      curr.conversionRate > best.conversionRate ? curr : best
    ).variant
  }

  // Export to CSV
  const exportCSV = () => {
    if (!results) return

    const headers = [
      'Variant',
      'Description',
      'Impressions',
      'Total Clicks',
      'Conversion Rate (%)',
      'Primary Clicks',
      'Secondary Clicks',
    ]

    const rows = results.results.map((r) => {
      const config = CTA_VARIANTS[r.variant as CTAVariant]
      return [
        r.variant,
        config?.description || '',
        r.impressions,
        r.clicks,
        r.conversionRate,
        r.primaryClicks,
        r.secondaryClicks,
      ]
    })

    // Add summary row
    rows.push([])
    rows.push([
      'TOTAL',
      '',
      results.totalImpressions,
      results.totalClicks,
      results.overallConversionRate,
      '',
      '',
    ])
    rows.push([])
    rows.push([
      'Period',
      `${new Date(results.period.from).toLocaleDateString()} - ${new Date(results.period.to).toLocaleDateString()}`,
      `${results.period.days} days`,
      '',
      '',
      '',
      '',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => {
          const str = String(cell ?? '')
          return str.includes(',') || str.includes('"')
            ? `"${str.replace(/"/g, '""')}"`
            : str
        }).join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ab-testing-results-${period}d-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const winner = getWinner()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-navy-900">
            {locale === 'ro' ? 'Rezultate A/B Testing CTA' : 'CTA A/B Testing Results'}
          </h3>
          <p className="text-sm text-navy-500 mt-0.5">
            {locale === 'ro'
              ? '3 variante CTA pe pagina de detalii croaziera'
              : '3 CTA variants on cruise detail page'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex rounded-lg border border-navy-200 overflow-hidden">
            {([7, 30, 90] as Period[]).map((days) => (
              <button
                key={days}
                onClick={() => handlePeriodChange(days)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  period === days
                    ? 'bg-navy-900 text-white'
                    : 'bg-white text-navy-600 hover:bg-navy-50'
                }`}
              >
                {days}{locale === 'ro' ? 'z' : 'd'}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={() => fetchResults(period)}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-navy-200 text-navy-600 hover:bg-navy-50 transition-colors disabled:opacity-50"
            title={locale === 'ro' ? 'Reincarca' : 'Refresh'}
          >
            ↻
          </button>

          {/* CSV Export */}
          <button
            onClick={exportCSV}
            disabled={!results || loading}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-gold-600 hover:to-gold-700 transition-all disabled:opacity-50"
          >
            {locale === 'ro' ? 'Export CSV' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Demo Badge */}
      {results?.isDemo && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-700">
          {locale === 'ro'
            ? '⚠ Date demonstrative — configureaza Supabase pentru date reale'
            : '⚠ Demo data — configure Supabase for real data'}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && !results && (
        <div className="text-center py-12 text-navy-400">
          <div className="w-8 h-8 border-2 border-navy-300 border-t-gold-500 rounded-full animate-spin mx-auto mb-3" />
          {locale === 'ro' ? 'Se incarca...' : 'Loading...'}
        </div>
      )}

      {/* Results Table */}
      {results && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              label={locale === 'ro' ? 'Total Impresii' : 'Total Impressions'}
              value={results.totalImpressions.toLocaleString()}
              color="navy"
            />
            <SummaryCard
              label={locale === 'ro' ? 'Total Click-uri' : 'Total Clicks'}
              value={results.totalClicks.toLocaleString()}
              color="gold"
            />
            <SummaryCard
              label={locale === 'ro' ? 'Rata Conversie' : 'Conversion Rate'}
              value={`${results.overallConversionRate}%`}
              color="green"
            />
            <SummaryCard
              label={locale === 'ro' ? 'Castigator' : 'Winner'}
              value={winner ? `Variant ${winner}` : '—'}
              color={winner ? 'green' : 'navy'}
            />
          </div>

          {/* Variant Details Table */}
          <div className="bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden">
            <div className="p-4 border-b border-navy-100 bg-navy-50">
              <h4 className="text-sm font-bold text-navy-900">
                {locale === 'ro' ? 'Detalii per Varianta' : 'Per-Variant Details'}
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">
                      {locale === 'ro' ? 'Varianta' : 'Variant'}
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">
                      {locale === 'ro' ? 'Descriere' : 'Description'}
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">
                      {locale === 'ro' ? 'Impresii' : 'Impressions'}
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">
                      {locale === 'ro' ? 'Click-uri' : 'Clicks'}
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">
                      {locale === 'ro' ? 'Rata' : 'Rate'}
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">
                      {locale === 'ro' ? 'Primar' : 'Primary'}
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">
                      {locale === 'ro' ? 'Secundar' : 'Secondary'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {results.results.map((r) => {
                    const config = CTA_VARIANTS[r.variant as CTAVariant]
                    const isWinner = r.variant === winner
                    return (
                      <tr
                        key={r.variant}
                        className={`transition-colors ${
                          isWinner ? 'bg-emerald-50' : 'hover:bg-navy-50/50'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                                isWinner
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-navy-100 text-navy-700'
                              }`}
                            >
                              {r.variant}
                            </span>
                            {isWinner && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                {locale === 'ro' ? 'CASTIGATOR' : 'WINNER'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-navy-600 max-w-[250px]">
                          <p className="text-xs">{config?.description || r.variant}</p>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-navy-700">
                          {r.impressions.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-navy-700">
                          {r.clicks.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`font-bold ${
                              isWinner ? 'text-emerald-600' : 'text-navy-700'
                            }`}
                          >
                            {r.conversionRate}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-navy-500">
                          {r.primaryClicks}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-navy-500">
                          {r.secondaryClicks}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                {/* Totals row */}
                <tfoot>
                  <tr className="bg-navy-50 font-semibold">
                    <td className="px-4 py-3 text-navy-700" colSpan={2}>
                      {locale === 'ro' ? 'Total' : 'Total'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-navy-700">
                      {results.totalImpressions.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-navy-700">
                      {results.totalClicks.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-navy-700">
                      {results.overallConversionRate}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-navy-500">
                      {results.results.reduce((s, r) => s + r.primaryClicks, 0)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-navy-500">
                      {results.results.reduce((s, r) => s + r.secondaryClicks, 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Conversion Rate Bar Chart (simple CSS) */}
          <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6">
            <h4 className="text-sm font-bold text-navy-900 mb-4">
              {locale === 'ro' ? 'Rata de Conversie per Varianta' : 'Conversion Rate by Variant'}
            </h4>
            <div className="space-y-4">
              {results.results.map((r) => {
                const config = CTA_VARIANTS[r.variant as CTAVariant]
                const isWinner = r.variant === winner
                const maxRate = Math.max(...results.results.map((v) => v.conversionRate), 1)
                const barWidth = (r.conversionRate / maxRate) * 100

                return (
                  <div key={r.variant}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-navy-700">
                        {locale === 'ro' ? 'Varianta' : 'Variant'} {r.variant}
                        {config && (
                          <span className="text-navy-400 ml-2">
                            ({config.primaryKey.replace('cta_', '').replace(/_/g, ' ')})
                          </span>
                        )}
                      </span>
                      <span
                        className={`font-bold ${isWinner ? 'text-emerald-600' : 'text-navy-600'}`}
                      >
                        {r.conversionRate}%
                      </span>
                    </div>
                    <div className="h-6 bg-navy-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWinner
                            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                            : 'bg-gradient-to-r from-navy-300 to-navy-400'
                        }`}
                        style={{ width: `${Math.max(barWidth, 2)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Variant CTA Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6">
            <h4 className="text-sm font-bold text-navy-900 mb-4">
              {locale === 'ro' ? 'Previzualizare Variante CTA' : 'CTA Variant Preview'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['A', 'B', 'C'] as CTAVariant[]).map((v) => {
                const config = CTA_VARIANTS[v]
                const isWin = v === winner
                return (
                  <div
                    key={v}
                    className={`rounded-lg border-2 p-4 ${
                      isWin ? 'border-emerald-300 bg-emerald-50' : 'border-navy-100 bg-navy-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${
                          isWin ? 'bg-emerald-500 text-white' : 'bg-navy-200 text-navy-600'
                        }`}
                      >
                        {v}
                      </span>
                      <span className="text-xs font-medium text-navy-600">
                        {config.description}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full py-2 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-white text-center text-xs font-semibold">
                        {config.primaryKey.replace('cta_', '').replace(/_/g, ' ')}
                      </div>
                      <div className="w-full py-2 rounded-lg border border-navy-200 text-navy-600 text-center text-xs font-medium">
                        {config.secondaryKey.replace('cta_', '').replace(/_/g, ' ')}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Period info */}
          <p className="text-xs text-navy-400 text-center">
            {locale === 'ro' ? 'Perioada' : 'Period'}:{' '}
            {new Date(results.period.from).toLocaleDateString(
              locale === 'ro' ? 'ro-RO' : 'en-GB',
              { day: 'numeric', month: 'short', year: 'numeric' }
            )}{' '}
            –{' '}
            {new Date(results.period.to).toLocaleDateString(
              locale === 'ro' ? 'ro-RO' : 'en-GB',
              { day: 'numeric', month: 'short', year: 'numeric' }
            )}{' '}
            ({results.period.days} {locale === 'ro' ? 'zile' : 'days'})
          </p>
        </>
      )}
    </div>
  )
}

// ============================================================
// Sub-components
// ============================================================

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: 'navy' | 'gold' | 'green' | 'red'
}) {
  const colorMap = {
    navy: 'bg-navy-900 text-white',
    gold: 'bg-gradient-to-br from-gold-400 to-gold-500 text-white',
    green: 'bg-emerald-500 text-white',
    red: 'bg-red-500 text-white',
  }

  return (
    <div className={`rounded-xl p-4 ${colorMap[color]} shadow-sm`}>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs opacity-80 mt-0.5">{label}</p>
    </div>
  )
}
