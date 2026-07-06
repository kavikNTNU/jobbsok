'use client'
import { useEffect, useState } from 'react'

type UserSkill = { id: string; skill_name: string; proficiency: string | null }

export default function UserSkillsManager() {
  const [skills, setSkills] = useState<UserSkill[]>([])
  const [newSkill, setNewSkill] = useState('')

  async function loadSkills() {
    const res = await fetch('/api/user-skills')
    const data = await res.json()
    setSkills(data.skills ?? [])
  }

  useEffect(() => {
    loadSkills()
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newSkill.trim()) return

    await fetch('/api/user-skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skill_name: newSkill })
    })

    setNewSkill('')
    loadSkills() // refetch to show the updated list
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>My Skills</h2>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="e.g. TypeScript"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {skills.map((s) => (
          <li key={s.id}>{s.skill_name}</li>
        ))}
      </ul>
    </div>
  )
}