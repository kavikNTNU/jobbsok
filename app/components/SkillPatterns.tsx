'use client'
import { useEffect, useState } from 'react'

type Pattern = { skill_name: string; count: number }

export default function SkillPatterns() {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/skill-patterns')
      .then(res => res.json())
      .then(data => {
        setPatterns(data.patterns ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading patterns...</p>

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Skill Patterns</h2>
      <ul>
        {patterns.map((p) => (
          <li key={p.skill_name}>{p.skill_name}: {p.count}</li>
        ))}
      </ul>
    </div>
  )
}