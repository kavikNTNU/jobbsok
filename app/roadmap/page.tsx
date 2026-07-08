'use client'
// import Roadmap from '../components/Roadmap'

import { useEffect, useState } from 'react'

type RoadmapItem = { priority: number; skill_name: string; reason: string }

export default function RoadmapPage() {
  // return <Roadmap />
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([])

  useEffect(() => {
    fetch('/api/roadmap').then(res => res.json()).then(data => setRoadmap(data.roadmap ?? []))
  }, [])

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ fontSize: '18px', marginBottom: '1rem' }}>Veikart</h1>

      <div style={{ background: '#fff', border: '0.5px solid var(--line)', borderRadius: '8px', padding: '0.5rem 0' }}>
        {roadmap.map((item) => (
          <div key={item.skill_name} style={{ display: 'flex', gap: '12px', padding: '0.85rem 1rem', borderBottom: '0.5px solid var(--line)' }}>
            <span className="mono" style={{ color: 'var(--ochre)', fontSize: '13px', width: '20px', flexShrink: 0 }}>
              {String(item.priority).padStart(2, '0')}
            </span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{item.skill_name}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.reason}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
