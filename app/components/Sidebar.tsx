'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/postings', label: 'Postings' },
  { href: '/patterns', label: 'Patterns' },
  { href: '/skills', label: 'Skills' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/compare', label: 'Compare' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <nav>
      <ul>
        {links.map(({ href, label }) => {
          const isActive = pathname === href
          return (
            <li key={href}>
              <Link href={href} aria-current={isActive ? 'page' : undefined} style={isActive ? { fontWeight: 'bold' } : undefined}>
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
