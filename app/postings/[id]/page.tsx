'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type Posting = {
  id: string
  title: string
  company: string | null
  raw_text: string
  summary: string
  seniority: string
  work_format: string
  employment_type: string
}
type SkillResult = { skill_name: string; category: string; priority: string; isOwned: boolean }

export default function PostingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [posting, setPosting] = useState<Posting | null>(null)
  const [skills, setSkills] = useState<SkillResult[]>([])
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [rawText, setRawText] = useState('')

  useEffect(() => {
    fetch(`/api/job-postings/${id}`)
      .then(res => res.json())
      .then(data => {
        setPosting(data.posting)
        setSkills(data.skills ?? [])
        setTitle(data.posting.title)
        setCompany(data.posting.company ?? '')
        setRawText(data.posting.raw_text)
      })
  }, [id])

  const categories = Array.from(new Set(skills.map(s => s.category)))

  async function handleSave() {
    const res = await fetch(`/api/job-postings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, company, raw_text: rawText }),
    })
    const data = await res.json()
    setPosting(data.posting)
    setEditing(false)
  }

  async function handleDelete() {
    const confirmed = confirm('Er du sikker på at du vil slette denne stillingsannonsen?')
    if (!confirmed) return

    await fetch(`/api/job-postings/${id}`, { method: 'DELETE' })
    router.push('/postings')
  }

  if (!posting) return <p>Laster...</p>

  return (
    <div style={{ maxWidth: '600px' }}>
      {editing ? (
        <>
          <input value={title} onChange={e => setTitle(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
          <input value={company} onChange={e => setCompany(e.target.value)} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
          <textarea value={rawText} onChange={e => setRawText(e.target.value)} rows={10} style={{ display: 'block', width: '100%', marginBottom: '0.5rem' }} />
          <button onClick={handleSave}>Lagre</button>
          <button onClick={() => setEditing(false)}>Avbryt</button>
        </>
      ) : (
        <>
          <h1 style={{ fontSize: '18px' }}>{posting.title}</h1>
          <p style={{ color: 'var(--muted)' }}>{posting.company}</p>
          <p style={{ whiteSpace: 'pre-wrap', fontSize: '13px', margin: '1rem 0' }}>{posting.raw_text}</p>

          <div style={{ background: '#fff', border: '0.5px solid var(--line)', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
            <p style={{ fontSize: '13px', marginBottom: '0.75rem' }}>{posting.summary}</p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {[posting.seniority, posting.work_format, posting.employment_type]
                .filter(v => v !== 'uspesifisert')
                .map(v => (
                  <span key={v} style={{ fontSize: '11px', padding: '2px 8px', background: 'var(--spruce-light)', borderRadius: '4px' }}>{v}</span>
                ))}
            </div>

            {categories.map(category => (
              <div key={category} style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>{category}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {skills.filter(s => s.category === category).map(s => (
                    <span key={s.skill_name} style={{
                      fontSize: '12px', padding: '3px 8px', borderRadius: '4px',
                      border: `0.5px solid ${s.priority === 'critical' ? 'var(--ochre)' : 'var(--line)'}`,
                      background: s.isOwned ? 'var(--spruce-light)' : '#fff',
                    }}>
                      {s.isOwned ? '✓ ' : ''}{s.skill_name}{s.priority === 'critical' ? ' •' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setEditing(true)}>Rediger</button>
          <button onClick={handleDelete}>Slett</button>
        </>
      )}
    </div>
  )
}