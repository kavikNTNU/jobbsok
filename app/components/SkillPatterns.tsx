'use client'
import { useEffect, useState } from 'react'
import SkillGapBar from './SkillGapBar'

type Pattern = { skill_name: string; category: string; count: number }

export default function SkillPatterns() {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [totalPostings, setTotalPostings] = useState(0)
  const [userSkillNames, setUserSkillNames] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/skill-patterns')
      .then(res => res.json())
      .then(data => {
        setPatterns(data.patterns ?? [])
        setTotalPostings(data.totalPostings ?? 0)
        setLoading(false)
      })
    fetch('/api/user-skills')
      .then(res => res.json())
      .then(data => setUserSkillNames((data.skills ?? []).map((s: { skill_name: string }) => s.skill_name)))
  }, [])

  if (loading) return <p>Laster...</p>

  const categories = Array.from(new Set(patterns.map(p => p.category)))
  const maxCount = Math.max(...patterns.map(p => p.count), 1)

  return (
    <div style={{ background: '#fff', border: '0.5px solid var(--line)', borderRadius: '8px', padding: '1rem' }}>
      {categories.map(category => (
        <div key={category} style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>{category}</div>
          {patterns.filter(p => p.category === category).map(p => (
            <SkillGapBar
              key={p.skill_name}
              skillName={p.skill_name}
              count={p.count}
              maxCount={maxCount}
              total={totalPostings}
              isGap={!userSkillNames.includes(p.skill_name)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
