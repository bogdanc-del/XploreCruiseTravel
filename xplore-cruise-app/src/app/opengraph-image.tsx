import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'XploreCruiseTravel — Croaziere Premium'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #050b14 0%, #0a1628 40%, #1a2a42 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Gold accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #e7b743, #c9982a, #e7b743)',
          }}
        />

        {/* Ship icon */}
        <div style={{ display: 'flex', marginBottom: 20 }}>
          <svg width="80" height="80" viewBox="0 0 48 48" fill="none">
            <path d="M6 32l4-4h28l4 4-6 8H12L6 32z" fill="#e7b743" />
            <path d="M12 22h24v6H12z" fill="#e7b743" opacity="0.6" />
            <path d="M19 14h4v8h-4z" fill="#e7b743" opacity="0.5" />
            <path d="M18 12h6v3h-6z" fill="#e7b743" opacity="0.7" />
            <path d="M2 44c5-3 10-3 15 0s10 3 15 0 10-3 15 0" stroke="#e7b743" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          </svg>
        </div>

        {/* Brand name */}
        <div style={{ display: 'flex', fontSize: 52, fontWeight: 700, marginBottom: 8 }}>
          <span style={{ color: '#ffffff' }}>Xplore</span>
          <span style={{ color: '#c9982a' }}>Cruise</span>
          <span style={{ color: '#b3c3db' }}>Travel</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: '#8da5c9',
            marginBottom: 32,
          }}
        >
          Croaziere Premium — Consultant Autorizat Romania
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: 'flex',
            gap: 60,
            padding: '16px 40px',
            borderRadius: 12,
            background: 'rgba(201, 152, 42, 0.1)',
            border: '1px solid rgba(201, 152, 42, 0.2)',
          }}
        >
          {[
            { num: '150+', label: 'Croaziere' },
            { num: '25+', label: 'Destinatii' },
            { num: '8+', label: 'Ani Experienta' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ color: '#e7b743', fontSize: 28, fontWeight: 700 }}>{stat.num}</span>
              <span style={{ color: '#6787b7', fontSize: 14 }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            color: '#4169a5',
            fontSize: 16,
          }}
        >
          xplorecruisetravel.com
        </div>
      </div>
    ),
    { ...size }
  )
}
