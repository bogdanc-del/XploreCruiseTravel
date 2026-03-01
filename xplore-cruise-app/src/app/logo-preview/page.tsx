'use client'

// Temporary page to preview logo variants — delete after choosing

export default function LogoPreviewPage() {
  return (
    <div className="min-h-screen bg-navy-900 p-8">
      <h1 className="text-white text-3xl font-heading mb-8 text-center">Logo Variants — Alege Varianta Preferata</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

        {/* Variant 1 — Modern Cruise Ship */}
        <div className="bg-navy-800 rounded-2xl p-8 flex flex-col items-center gap-6 border border-navy-700">
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-wider">Varianta 1 — Vas de Croaziera Modern</span>
          <div className="flex items-center gap-3">
            <svg className="h-12 w-12 text-gold-400" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 30h32l-4 10H12L8 30z" fill="currentColor" />
              <path d="M14 24h20v6H14z" fill="currentColor" opacity="0.7" />
              <path d="M22 16h4v8h-4z" fill="currentColor" opacity="0.5" />
              <rect x="21" y="14" width="6" height="3" rx="1" fill="currentColor" opacity="0.8" />
              <path d="M4 42c4-3 8-3 12 0s8 3 12 0 8-3 12 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            </svg>
            <span className="flex items-baseline gap-0.5 text-2xl">
              <span className="font-heading text-white">Xplore</span>
              <span className="font-heading text-gold-500">Cruise</span>
              <span className="font-heading text-white/80">Travel</span>
            </span>
          </div>
          {/* Also show on white background */}
          <div className="bg-white rounded-xl p-4 w-full flex items-center justify-center gap-3">
            <svg className="h-12 w-12 text-gold-500" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 30h32l-4 10H12L8 30z" fill="currentColor" />
              <path d="M14 24h20v6H14z" fill="currentColor" opacity="0.7" />
              <path d="M22 16h4v8h-4z" fill="currentColor" opacity="0.5" />
              <rect x="21" y="14" width="6" height="3" rx="1" fill="currentColor" opacity="0.8" />
              <path d="M4 42c4-3 8-3 12 0s8 3 12 0 8-3 12 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            </svg>
            <span className="flex items-baseline gap-0.5 text-2xl">
              <span className="font-heading text-navy-900">Xplore</span>
              <span className="font-heading text-gold-500">Cruise</span>
              <span className="font-heading text-navy-700">Travel</span>
            </span>
          </div>
        </div>

        {/* Variant 2 — Sailing Ship / Yacht */}
        <div className="bg-navy-800 rounded-2xl p-8 flex flex-col items-center gap-6 border border-navy-700">
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-wider">Varianta 2 — Yacht cu Vele</span>
          <div className="flex items-center gap-3">
            <svg className="h-12 w-12 text-gold-400" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 6L36 30H24V6z" fill="currentColor" opacity="0.7" />
              <path d="M24 12L14 30h10V12z" fill="currentColor" opacity="0.5" />
              <rect x="23" y="6" width="2" height="28" fill="currentColor" opacity="0.8" />
              <path d="M10 32h28l-3 8H13l-3-8z" fill="currentColor" />
              <path d="M6 44c4-2 8-2 12 0s8 2 12 0 8-2 12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
            </svg>
            <span className="flex items-baseline gap-0.5 text-2xl">
              <span className="font-heading text-white">Xplore</span>
              <span className="font-heading text-gold-500">Cruise</span>
              <span className="font-heading text-white/80">Travel</span>
            </span>
          </div>
          <div className="bg-white rounded-xl p-4 w-full flex items-center justify-center gap-3">
            <svg className="h-12 w-12 text-gold-500" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 6L36 30H24V6z" fill="currentColor" opacity="0.7" />
              <path d="M24 12L14 30h10V12z" fill="currentColor" opacity="0.5" />
              <rect x="23" y="6" width="2" height="28" fill="currentColor" opacity="0.8" />
              <path d="M10 32h28l-3 8H13l-3-8z" fill="currentColor" />
              <path d="M6 44c4-2 8-2 12 0s8 2 12 0 8-2 12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
            </svg>
            <span className="flex items-baseline gap-0.5 text-2xl">
              <span className="font-heading text-navy-900">Xplore</span>
              <span className="font-heading text-gold-500">Cruise</span>
              <span className="font-heading text-navy-700">Travel</span>
            </span>
          </div>
        </div>

        {/* Variant 3 — Anchor Nautical */}
        <div className="bg-navy-800 rounded-2xl p-8 flex flex-col items-center gap-6 border border-navy-700">
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-wider">Varianta 3 — Ancora Nautica</span>
          <div className="flex items-center gap-3">
            <svg className="h-12 w-12 text-gold-400" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <rect x="22.5" y="10" width="3" height="24" rx="1.5" fill="currentColor" opacity="0.7" />
              <rect x="16" y="16" width="16" height="3" rx="1.5" fill="currentColor" opacity="0.6" />
              <circle cx="24" cy="9" r="3" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8" />
              <path d="M15 34c0-5 4-8 9-8s9 3 9 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M15 34l-3-3M33 34l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="flex items-baseline gap-0.5 text-2xl">
              <span className="font-heading text-white">Xplore</span>
              <span className="font-heading text-gold-500">Cruise</span>
              <span className="font-heading text-white/80">Travel</span>
            </span>
          </div>
          <div className="bg-white rounded-xl p-4 w-full flex items-center justify-center gap-3">
            <svg className="h-12 w-12 text-gold-500" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <rect x="22.5" y="10" width="3" height="24" rx="1.5" fill="currentColor" opacity="0.7" />
              <rect x="16" y="16" width="16" height="3" rx="1.5" fill="currentColor" opacity="0.6" />
              <circle cx="24" cy="9" r="3" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8" />
              <path d="M15 34c0-5 4-8 9-8s9 3 9 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M15 34l-3-3M33 34l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="flex items-baseline gap-0.5 text-2xl">
              <span className="font-heading text-navy-900">Xplore</span>
              <span className="font-heading text-gold-500">Cruise</span>
              <span className="font-heading text-navy-700">Travel</span>
            </span>
          </div>
        </div>

        {/* Variant 4 — Premium Cruise Ship (current) */}
        <div className="bg-navy-800 rounded-2xl p-8 flex flex-col items-center gap-6 border-2 border-gold-500">
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-wider">Varianta 4 — Vas Premium (Actuala)</span>
          <div className="flex items-center gap-3">
            <svg className="h-12 w-12 text-gold-400" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 32l4-4h28l4 4-6 8H12L6 32z" fill="currentColor" />
              <path d="M12 22h24v6H12z" fill="currentColor" opacity="0.6" />
              <rect x="15" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
              <rect x="19" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
              <rect x="23" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
              <rect x="27" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
              <rect x="31" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
              <path d="M19 14h4v8h-4z" fill="currentColor" opacity="0.5" />
              <path d="M18 12h6v3h-6z" fill="currentColor" opacity="0.7" />
              <path d="M27 16h3v6h-3z" fill="currentColor" opacity="0.4" />
              <path d="M26.5 14.5h4v2h-4z" fill="currentColor" opacity="0.6" />
              <path d="M2 44c5-3 10-3 15 0s10 3 15 0 10-3 15 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
            </svg>
            <span className="flex items-baseline gap-0.5 text-2xl">
              <span className="font-heading text-white">Xplore</span>
              <span className="font-heading text-gold-500">Cruise</span>
              <span className="font-heading text-white/80">Travel</span>
            </span>
          </div>
          <div className="bg-white rounded-xl p-4 w-full flex items-center justify-center gap-3">
            <svg className="h-12 w-12 text-gold-500" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 32l4-4h28l4 4-6 8H12L6 32z" fill="currentColor" />
              <path d="M12 22h24v6H12z" fill="currentColor" opacity="0.6" />
              <rect x="15" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
              <rect x="19" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
              <rect x="23" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
              <rect x="27" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
              <rect x="31" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
              <path d="M19 14h4v8h-4z" fill="currentColor" opacity="0.5" />
              <path d="M18 12h6v3h-6z" fill="currentColor" opacity="0.7" />
              <path d="M27 16h3v6h-3z" fill="currentColor" opacity="0.4" />
              <path d="M26.5 14.5h4v2h-4z" fill="currentColor" opacity="0.6" />
              <path d="M2 44c5-3 10-3 15 0s10 3 15 0 10-3 15 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
            </svg>
            <span className="flex items-baseline gap-0.5 text-2xl">
              <span className="font-heading text-navy-900">Xplore</span>
              <span className="font-heading text-gold-500">Cruise</span>
              <span className="font-heading text-navy-700">Travel</span>
            </span>
          </div>
        </div>

        {/* Variant 5 — Compass Rose */}
        <div className="bg-navy-800 rounded-2xl p-8 flex flex-col items-center gap-6 border border-navy-700">
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-wider">Varianta 5 — Busola / Compass Rose</span>
          <div className="flex items-center gap-3">
            <svg className="h-12 w-12 text-gold-400" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
              <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1" opacity="0.2" />
              {/* North point */}
              <path d="M24 4l4 12h-8l4-12z" fill="currentColor" opacity="0.9" />
              {/* South point */}
              <path d="M24 44l-4-12h8l-4 12z" fill="currentColor" opacity="0.4" />
              {/* East point */}
              <path d="M44 24l-12 4v-8l12 4z" fill="currentColor" opacity="0.4" />
              {/* West point */}
              <path d="M4 24l12-4v8l-12-4z" fill="currentColor" opacity="0.4" />
              {/* Center */}
              <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.7" />
              {/* Wave at bottom */}
              <path d="M8 42c3-2 6-2 9 0s6 2 9 0 6-2 9 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
            </svg>
            <span className="flex items-baseline gap-0.5 text-2xl">
              <span className="font-heading text-white">Xplore</span>
              <span className="font-heading text-gold-500">Cruise</span>
              <span className="font-heading text-white/80">Travel</span>
            </span>
          </div>
          <div className="bg-white rounded-xl p-4 w-full flex items-center justify-center gap-3">
            <svg className="h-12 w-12 text-gold-500" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
              <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1" opacity="0.2" />
              <path d="M24 4l4 12h-8l4-12z" fill="currentColor" opacity="0.9" />
              <path d="M24 44l-4-12h8l-4 12z" fill="currentColor" opacity="0.4" />
              <path d="M44 24l-12 4v-8l12 4z" fill="currentColor" opacity="0.4" />
              <path d="M4 24l12-4v8l-12-4z" fill="currentColor" opacity="0.4" />
              <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.7" />
              <path d="M8 42c3-2 6-2 9 0s6 2 9 0 6-2 9 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
            </svg>
            <span className="flex items-baseline gap-0.5 text-2xl">
              <span className="font-heading text-navy-900">Xplore</span>
              <span className="font-heading text-gold-500">Cruise</span>
              <span className="font-heading text-navy-700">Travel</span>
            </span>
          </div>
        </div>

        {/* Variant 6 — Ship Wheel / Helm */}
        <div className="bg-navy-800 rounded-2xl p-8 flex flex-col items-center gap-6 border border-navy-700">
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-wider">Varianta 6 — Timona / Ship Wheel</span>
          <div className="flex items-center gap-3">
            <svg className="h-12 w-12 text-gold-400" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer ring */}
              <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.5" opacity="0.6" />
              {/* Inner hub */}
              <circle cx="24" cy="24" r="5" fill="currentColor" opacity="0.5" />
              {/* Spokes — 8 directions */}
              <line x1="24" y1="6" x2="24" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <line x1="24" y1="29" x2="24" y2="42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <line x1="6" y1="24" x2="19" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <line x1="29" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              {/* Diagonal spokes */}
              <line x1="11.3" y1="11.3" x2="20.5" y2="20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              <line x1="27.5" y1="27.5" x2="36.7" y2="36.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              <line x1="36.7" y1="11.3" x2="27.5" y2="20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              <line x1="20.5" y1="27.5" x2="11.3" y2="36.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              {/* Spoke handles (knobs at outer ring) */}
              <circle cx="24" cy="6" r="2.5" fill="currentColor" opacity="0.8" />
              <circle cx="24" cy="42" r="2.5" fill="currentColor" opacity="0.8" />
              <circle cx="6" cy="24" r="2.5" fill="currentColor" opacity="0.8" />
              <circle cx="42" cy="24" r="2.5" fill="currentColor" opacity="0.8" />
            </svg>
            <span className="flex items-baseline gap-0.5 text-2xl">
              <span className="font-heading text-white">Xplore</span>
              <span className="font-heading text-gold-500">Cruise</span>
              <span className="font-heading text-white/80">Travel</span>
            </span>
          </div>
          <div className="bg-white rounded-xl p-4 w-full flex items-center justify-center gap-3">
            <svg className="h-12 w-12 text-gold-500" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.5" opacity="0.6" />
              <circle cx="24" cy="24" r="5" fill="currentColor" opacity="0.5" />
              <line x1="24" y1="6" x2="24" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <line x1="24" y1="29" x2="24" y2="42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <line x1="6" y1="24" x2="19" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <line x1="29" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <line x1="11.3" y1="11.3" x2="20.5" y2="20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              <line x1="27.5" y1="27.5" x2="36.7" y2="36.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              <line x1="36.7" y1="11.3" x2="27.5" y2="20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              <line x1="20.5" y1="27.5" x2="11.3" y2="36.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              <circle cx="24" cy="6" r="2.5" fill="currentColor" opacity="0.8" />
              <circle cx="24" cy="42" r="2.5" fill="currentColor" opacity="0.8" />
              <circle cx="6" cy="24" r="2.5" fill="currentColor" opacity="0.8" />
              <circle cx="42" cy="24" r="2.5" fill="currentColor" opacity="0.8" />
            </svg>
            <span className="flex items-baseline gap-0.5 text-2xl">
              <span className="font-heading text-navy-900">Xplore</span>
              <span className="font-heading text-gold-500">Cruise</span>
              <span className="font-heading text-navy-700">Travel</span>
            </span>
          </div>
        </div>

      </div>

      <p className="text-navy-400 text-center mt-8 text-sm">Fiecare varianta este prezentata pe fundal inchis (header pe hero) si pe fundal deschis (header dupa scroll)</p>
    </div>
  )
}
