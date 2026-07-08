'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Oversikt' },
  { href: '/postings', label: 'Stillinger' },
  { href: '/compare', label: 'Sammenlign' },
  { href: '/patterns', label: 'Mønstre' },
  { href: '/skills', label: 'Mine ferdigheter' },
  { href: '/roadmap', label: 'Veikart' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <nav style={{ width: '180px', background: 'var(--ink)', padding: '1rem 0.75rem', flexShrink: 0 }}>
      <div style={{ color: 'var(--paper)', fontFamily: 'var(--font-display)', fontWeight: 500, padding: '0 0.5rem 1.5rem' }}>
        jobbsøk
      </div>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'block',
              padding: '8px 10px',
              borderRadius: '6px',
              marginBottom: '2px',
              fontSize: '13px',
              textDecoration: 'none',
              color: isActive ? 'var(--paper)' : '#B4B8B0',
              background: isActive ? 'var(--spruce)' : 'transparent',
            }}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}