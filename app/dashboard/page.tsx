'use client'
import { useEffect, useState } from 'react'
import MetricCard from '../components/MetricCard'
import SkillGapBar from '../components/SkillGapBar'

type Pattern = { skill_name: string; count: number }

export default function DashboardPage() {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [userSkillNames, setUserSkillNames] = useState<string[]>([])
  const [postingCount, setPostingCount] = useState(0)

  useEffect(() => {
    fetch('/api/skill-patterns').then(res => res.json()).then(data => setPatterns(data.patterns ?? []))
    fetch('/api/user-skills').then(res => res.json()).then(data =>
      setUserSkillNames((data.skills ?? []).map((s: { skill_name: string }) => s.skill_name))
    )
  }, [])

  const maxCount = Math.max(...patterns.map(p => p.count), 1)
  const topGaps = patterns.filter(p => !userSkillNames.includes(p.skill_name)).slice(0, 3)
  const biggestGap = topGaps[0]?.skill_name ?? '–'

  return (
    <div>
      <h1 style={{ fontSize: '18px', marginBottom: '1rem' }}>Oversikt</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '1.5rem' }}>
        <MetricCard label="Unike ferdigheter" value={patterns.length} />
        <MetricCard label="Dine ferdigheter" value={userSkillNames.length} />
        <MetricCard label="Størst gap" value={biggestGap} highlight />
      </div>

      <h2 style={{ fontSize: '14px', marginBottom: '0.5rem' }}>Mest etterspurte ferdigheter</h2>
      <div style={{ background: '#fff', border: '0.5px solid var(--line)', borderRadius: '8px', padding: '1rem' }}>
        {patterns.slice(0, 5).map((p) => (
          <SkillGapBar
            key={p.skill_name}
            skillName={p.skill_name}
            count={p.count}
            maxCount={maxCount}
            isGap={!userSkillNames.includes(p.skill_name)}
          />
        ))}
      </div>
    </div>
  )
}