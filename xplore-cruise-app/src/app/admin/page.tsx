'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from '@/i18n/context'
import AdminReviews from '@/components/admin/AdminReviews'
import AdminTestimonials from '@/components/admin/AdminTestimonials'
import AdminStats from '@/components/admin/AdminStats'
import AdminABTesting from '@/components/admin/AdminABTesting'

// ============================================================
// Admin Dashboard
// ============================================================

const ADMIN_PASSWORD = 'xplore2026'

type Tab = 'dashboard' | 'cruises' | 'bookings' | 'messages' | 'reviews' | 'testimonials' | 'stats' | 'ab-testing' | 'settings'

interface Booking {
  id: string
  booking_ref: string
  cruise_title: string
  first_name: string
  last_name: string
  email: string
  phone: string
  cabin_preference: string
  passengers: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  special_requests?: string
}

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  message: string
  cruise_interest: string
  read: boolean
  created_at: string
}

// ============================================================
// Demo Data
// ============================================================

const demoBookings: Booking[] = [
  {
    id: '1', booking_ref: 'BK-20260301-A1B2', cruise_title: 'Western Mediterranean Discovery',
    first_name: 'Maria', last_name: 'Ionescu', email: 'maria@test.ro', phone: '+40722111222',
    cabin_preference: 'balcony', passengers: 2, status: 'pending', created_at: '2026-02-28T14:30:00Z',
  },
  {
    id: '2', booking_ref: 'BK-20260228-C3D4', cruise_title: 'Greek Islands & Turkey Voyage',
    first_name: 'Alexandru', last_name: 'Popa', email: 'alex@test.ro', phone: '+40733222333',
    cabin_preference: 'suite', passengers: 1, status: 'confirmed', created_at: '2026-02-27T10:15:00Z',
  },
  {
    id: '3', booking_ref: 'BK-20260225-E5F6', cruise_title: 'Norwegian Fjords Explorer',
    first_name: 'Elena', last_name: 'Dragomir', email: 'elena@test.ro', phone: '+40744333444',
    cabin_preference: 'oceanview', passengers: 4, status: 'completed', created_at: '2026-02-25T09:00:00Z',
  },
]

const demoMessages: ContactMessage[] = [
  {
    id: '1', name: 'Cristina Manole', email: 'cristina@test.ro', phone: '+40755444555',
    message: 'Buna ziua, as dori informatii despre croaziera pe Dunare. Sunt interesata de luna august.',
    cruise_interest: 'River Cruises', read: false, created_at: '2026-03-01T08:00:00Z',
  },
  {
    id: '2', name: 'Andrei Voicu', email: 'andrei@test.ro', phone: '+40766555666',
    message: 'Hello, can you recommend a family cruise for July? We have 2 children.',
    cruise_interest: 'Caribbean', read: true, created_at: '2026-02-28T16:45:00Z',
  },
]

// ============================================================
// Admin Page
// ============================================================

export default function AdminPage() {
  const { locale } = useLocale()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [bookings, setBookings] = useState<Booking[]>(demoBookings)
  const [messages, setMessages] = useState<ContactMessage[]>(demoMessages)

  // Check localStorage for session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('xct_admin_session')
      if (session === 'authenticated') {
        setIsAuthenticated(true)
      }
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('xct_admin_session', 'authenticated')
      setLoginError('')
    } else {
      setLoginError(locale === 'ro' ? 'Parola incorecta' : 'Incorrect password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('xct_admin_session')
  }

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    )
  }

  const markMessageRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    )
  }

  // ---- Login Screen ----
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-heading)]">
              Xplore<span className="text-gold-400">CruiseTravel</span>
            </h1>
            <p className="text-navy-400 text-sm mt-2">Admin Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1.5">
                {locale === 'ro' ? 'Parola Admin' : 'Admin Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-navy-200 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                autoFocus
              />
            </div>
            {loginError && (
              <p className="text-red-500 text-xs">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold text-sm hover:from-gold-600 hover:to-gold-700 transition-all"
            >
              {locale === 'ro' ? 'Autentificare' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ---- Stats ----
  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length
  const unreadMessages = messages.filter((m) => !m.read).length
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length

  const tabs: { key: Tab; label: string; badge?: number }[] = [
    { key: 'dashboard', label: locale === 'ro' ? 'Panou Principal' : 'Dashboard' },
    { key: 'bookings', label: locale === 'ro' ? 'Rezervari' : 'Bookings', badge: pendingBookings },
    { key: 'messages', label: locale === 'ro' ? 'Mesaje' : 'Messages', badge: unreadMessages },
    { key: 'reviews', label: locale === 'ro' ? 'Recenzii' : 'Reviews' },
    { key: 'testimonials', label: locale === 'ro' ? 'Testimoniale' : 'Testimonials' },
    { key: 'stats', label: locale === 'ro' ? 'Statistici' : 'Stats' },
    { key: 'ab-testing', label: 'A/B Testing' },
    { key: 'cruises', label: locale === 'ro' ? 'Croaziere' : 'Cruises' },
    { key: 'settings', label: locale === 'ro' ? 'Setari' : 'Settings' },
  ]

  // ---- Main Dashboard ----
  return (
    <div className="min-h-screen bg-navy-50">
      {/* Top Bar */}
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold font-[family-name:var(--font-heading)]">
              Xplore<span className="text-gold-400">CruiseTravel</span>
            </h1>
            <span className="hidden sm:inline-block text-xs bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-navy-300 hover:text-white transition-colors">
              {locale === 'ro' ? 'Viziteaza site' : 'View Site'} &rarr;
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-navy-400 hover:text-red-400 transition-colors"
            >
              {locale === 'ro' ? 'Deconectare' : 'Logout'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-navy-900 shadow-sm'
                  : 'text-navy-500 hover:text-navy-700 hover:bg-white/50'
              }`}
            >
              {tab.label}
              {tab.badge && tab.badge > 0 ? (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label={locale === 'ro' ? 'Total Rezervari' : 'Total Bookings'}
                value={totalBookings}
                color="navy"
              />
              <StatCard
                label={locale === 'ro' ? 'In Asteptare' : 'Pending'}
                value={pendingBookings}
                color="gold"
              />
              <StatCard
                label={locale === 'ro' ? 'Confirmate' : 'Confirmed'}
                value={confirmedBookings}
                color="green"
              />
              <StatCard
                label={locale === 'ro' ? 'Mesaje Necitite' : 'Unread Messages'}
                value={unreadMessages}
                color="red"
              />
            </div>

            {/* Recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6">
                <h3 className="text-base font-bold text-navy-900 mb-4">
                  {locale === 'ro' ? 'Rezervari Recente' : 'Recent Bookings'}
                </h3>
                <div className="space-y-3">
                  {bookings.slice(0, 3).map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-navy-50 text-sm"
                    >
                      <div>
                        <p className="font-medium text-navy-900">
                          {b.first_name} {b.last_name}
                        </p>
                        <p className="text-xs text-navy-500">{b.cruise_title}</p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Messages */}
              <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6">
                <h3 className="text-base font-bold text-navy-900 mb-4">
                  {locale === 'ro' ? 'Mesaje Recente' : 'Recent Messages'}
                </h3>
                <div className="space-y-3">
                  {messages.slice(0, 3).map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-lg text-sm ${m.read ? 'bg-navy-50' : 'bg-gold-50 border border-gold-200'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-navy-900">{m.name}</p>
                        {!m.read && (
                          <span className="text-[10px] font-bold text-gold-600 bg-gold-100 px-2 py-0.5 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-navy-600 line-clamp-2">{m.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden">
            <div className="p-6 border-b border-navy-100">
              <h3 className="text-lg font-bold text-navy-900">
                {locale === 'ro' ? 'Toate Rezervarile' : 'All Bookings'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-navy-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Ref</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">{locale === 'ro' ? 'Client' : 'Client'}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">{locale === 'ro' ? 'Croaziera' : 'Cruise'}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">{locale === 'ro' ? 'Cabina' : 'Cabin'}</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">{locale === 'ro' ? 'Pasageri' : 'Pax'}</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">{locale === 'ro' ? 'Actiuni' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-navy-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-navy-600">{b.booking_ref}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-navy-900">{b.first_name} {b.last_name}</p>
                        <p className="text-xs text-navy-500">{b.email}</p>
                      </td>
                      <td className="px-4 py-3 text-navy-700 max-w-[200px] truncate">{b.cruise_title}</td>
                      <td className="px-4 py-3 text-navy-600 capitalize">{b.cabin_preference}</td>
                      <td className="px-4 py-3 text-center text-navy-700">{b.passengers}</td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value as Booking['status'])}
                          className="text-xs px-2 py-1 rounded border border-navy-200 bg-white focus:ring-1 focus:ring-gold-400"
                        >
                          <option value="pending">{locale === 'ro' ? 'In asteptare' : 'Pending'}</option>
                          <option value="confirmed">{locale === 'ro' ? 'Confirmata' : 'Confirmed'}</option>
                          <option value="cancelled">{locale === 'ro' ? 'Anulata' : 'Cancelled'}</option>
                          <option value="completed">{locale === 'ro' ? 'Finalizata' : 'Completed'}</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-navy-900">
              {locale === 'ro' ? 'Mesaje Contact' : 'Contact Messages'}
            </h3>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${
                  m.read ? 'border-navy-100' : 'border-gold-300 ring-1 ring-gold-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-navy-900">{m.name}</h4>
                      {!m.read && (
                        <span className="text-[10px] font-bold text-gold-600 bg-gold-100 px-2 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-navy-500 mt-0.5">
                      {m.email} &middot; {m.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-navy-400">
                      {new Date(m.created_at).toLocaleDateString(locale === 'ro' ? 'ro-RO' : 'en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    {m.cruise_interest && (
                      <span className="inline-block mt-1 text-[10px] text-navy-500 bg-navy-100 px-2 py-0.5 rounded-full">
                        {m.cruise_interest}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-navy-700 leading-relaxed">{m.message}</p>
                <div className="flex gap-3 mt-4">
                  {!m.read && (
                    <button
                      onClick={() => markMessageRead(m.id)}
                      className="text-xs text-gold-600 hover:text-gold-700 font-medium transition-colors"
                    >
                      {locale === 'ro' ? 'Marcheaza ca citit' : 'Mark as read'}
                    </button>
                  )}
                  <a
                    href={`mailto:${m.email}?subject=Re: XploreCruiseTravel - ${m.cruise_interest}`}
                    className="text-xs text-navy-500 hover:text-navy-700 font-medium transition-colors"
                  >
                    {locale === 'ro' ? 'Raspunde' : 'Reply'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && <AdminReviews />}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && <AdminTestimonials />}

        {/* Stats Tab */}
        {activeTab === 'stats' && <AdminStats />}

        {/* A/B Testing Tab */}
        {activeTab === 'ab-testing' && <AdminABTesting />}

        {/* Cruises Tab */}
        {activeTab === 'cruises' && (
          <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-navy-900">
                {locale === 'ro' ? 'Gestionare Croaziere' : 'Manage Cruises'}
              </h3>
              <button className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-gold-600 hover:to-gold-700 transition-all">
                + {locale === 'ro' ? 'Adauga Croaziera' : 'Add Cruise'}
              </button>
            </div>
            <div className="text-center py-12 text-navy-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-navy-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
              <p className="font-medium text-navy-600">
                {locale === 'ro'
                  ? 'Croazierele vor fi gestionate prin Supabase'
                  : 'Cruises will be managed through Supabase'}
              </p>
              <p className="text-sm mt-1">
                {locale === 'ro'
                  ? 'Configureaza baza de date pentru a activa CRUD-ul complet.'
                  : 'Configure the database to enable full CRUD operations.'}
              </p>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 max-w-2xl">
            <h3 className="text-lg font-bold text-navy-900 mb-6">
              {locale === 'ro' ? 'Setari' : 'Settings'}
            </h3>
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-navy-50 border border-navy-100">
                <h4 className="font-semibold text-navy-900 text-sm mb-2">
                  {locale === 'ro' ? 'Date Firma' : 'Company Info'}
                </h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-navy-500">{locale === 'ro' ? 'Denumire' : 'Name'}:</span>
                  <span className="text-navy-800 font-medium">XPLORE CRUISE TRAVEL SRL</span>
                  <span className="text-navy-500">CUI:</span>
                  <span className="text-navy-800 font-medium">36785800</span>
                  <span className="text-navy-500">{locale === 'ro' ? 'Nr. Reg.' : 'Trade Reg.'}:</span>
                  <span className="text-navy-800 font-medium">J03/1962/2016</span>
                  <span className="text-navy-500">CAEN:</span>
                  <span className="text-navy-800 font-medium">7912 — Organizare Croaziere</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-navy-50 border border-navy-100">
                <h4 className="font-semibold text-navy-900 text-sm mb-2">
                  {locale === 'ro' ? 'Integrari' : 'Integrations'}
                </h4>
                <div className="space-y-3">
                  <IntegrationRow
                    label="Supabase"
                    status={false}
                    description={locale === 'ro' ? 'Baza de date PostgreSQL' : 'PostgreSQL database'}
                  />
                  <IntegrationRow
                    label="Claude AI"
                    status={false}
                    description={locale === 'ro' ? 'Chatbot consilier croaziere' : 'Cruise advisor chatbot'}
                  />
                  <IntegrationRow
                    label="Email (SMTP)"
                    status={false}
                    description={locale === 'ro' ? 'Notificari email' : 'Email notifications'}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// Sub-components
// ============================================================

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: 'navy' | 'gold' | 'green' | 'red'
}) {
  const colorMap = {
    navy: 'bg-navy-900 text-white',
    gold: 'bg-gradient-to-br from-gold-400 to-gold-500 text-white',
    green: 'bg-emerald-500 text-white',
    red: 'bg-red-500 text-white',
  }

  return (
    <div className={`rounded-xl p-5 ${colorMap[color]} shadow-sm`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm opacity-80 mt-1">{label}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    completed: 'bg-blue-100 text-blue-700 border-blue-200',
  }

  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
        styles[status] || styles.pending
      }`}
    >
      {status}
    </span>
  )
}

function IntegrationRow({
  label,
  status,
  description,
}: {
  label: string
  status: boolean
  description: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-navy-900">{label}</p>
        <p className="text-xs text-navy-500">{description}</p>
      </div>
      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          status
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-navy-100 text-navy-500'
        }`}
      >
        {status ? 'Connected' : 'Not configured'}
      </span>
    </div>
  )
}
