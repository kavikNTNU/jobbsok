'use client'
import { useEffect, useState } from 'react'

type RoadmapItem = { priority: number; skill_name: string; reason: string }

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([])

  useEffect(() => {
    fetch('/api/roadmap')
      .then(res => res.json())
      .then(data => setRoadmap(data.roadmap ?? []))
  }, [])

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Your Learning Roadmap</h2>
      <ol>
        {roadmap.map((item) => (
          <li key={item.skill_name}>
            <strong>{item.skill_name}</strong> — {item.reason}
          </li>
        ))}
      </ol>
    </div>
  )
}