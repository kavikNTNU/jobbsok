'use client'
import { useEffect, useState } from 'react'
import SkillGapBar from './SkillGapBar'

type GapItem = { skill_name: string; market_count: number }

export default function SkillGap() {
  const [gap, setGap] = useState<GapItem[]>([])

  useEffect(() => {
    fetch('/api/skill-gap').then(res => res.json()).then(data => setGap(data.gap ?? []))
  }, [])

  const maxCount = Math.max(...gap.map(g => g.market_count), 1)

  return (
    <div style={{ background: '#fff', border: '0.5px solid var(--line)', borderRadius: '8px', padding: '1rem' }}>
      {gap.map((g) => (
        <SkillGapBar
          key={g.skill_name}
          skillName={g.skill_name}
          count={g.market_count}
          maxCount={maxCount}
          isGap={true}
        />
      ))}
    </div>
  )
}