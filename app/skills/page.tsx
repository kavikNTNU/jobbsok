'use client'
// import UserSkillsManager from '../components/UserSkillsManager'

import { useEffect, useState } from "react"
type UserSkill = { id: string; skill_name: string; proficiency: string | null }

export default function SkillsPage() {
  // return <UserSkillsManager />
   const [skills, setSkills] = useState<UserSkill[]>([])
  const [newSkill, setNewSkill] = useState('')

  function loadSkills() {
    fetch('/api/user-skills').then(res => res.json()).then(data => setSkills(data.skills ?? []))
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
      body: JSON.stringify({ skill_name: newSkill }),
    })
    setNewSkill('')
    loadSkills()
  }

  return (
    <div style={{ maxWidth: '500px' }}>
      <h1 style={{ fontSize: '18px', marginBottom: '1rem' }}>Mine ferdigheter</h1>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <input
          value={newSkill}
          onChange={e => setNewSkill(e.target.value)}
          placeholder="f.eks. TypeScript"
          style={{ flex: 1, padding: '8px', border: '0.5px solid var(--line)', borderRadius: '6px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', background: 'var(--spruce)', color: 'var(--paper)', border: 'none', borderRadius: '6px' }}>
          Legg til
        </button>
      </form>

      <div style={{ background: '#fff', border: '0.5px solid var(--line)', borderRadius: '8px' }}>
        {skills.map((s, i) => (
          <div key={s.id} style={{
            padding: '0.6rem 1rem',
            borderBottom: i < skills.length - 1 ? '0.5px solid var(--line)' : 'none',
            fontSize: '13px',
          }}>
            {s.skill_name}
          </div>
        ))}
      </div>
    </div>
  )
}
