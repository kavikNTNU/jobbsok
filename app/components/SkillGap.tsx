'use client'
import { useEffect, useState } from 'react'

type GapItem = { skill_name: string; market_count: number }

export default function SkillGap() {
  const [gap, setGap] = useState<GapItem[]>([])

  useEffect(() => {
    fetch('/api/skill-gap')
      .then(res => res.json())
      .then(data => setGap(data.gap ?? []))
  }, [])

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Skills You're Missing</h2>
      <ul>
        {gap.map((g) => (
          <li key={g.skill_name}>{g.skill_name} (appears in {g.market_count} postings)</li>
        ))}
      </ul>
    </div>
  )
}