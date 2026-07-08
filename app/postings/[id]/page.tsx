'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type Posting = { id: string; title: string; company: string | null; raw_text: string }

export default function PostingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [posting, setPosting] = useState<Posting | null>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [rawText, setRawText] = useState('')

  useEffect(() => {
    fetch(`/api/job-postings/${id}`)
      .then(res => res.json())
      .then(data => {
        setPosting(data.posting)
        setSkills((data.skills ?? []).map((s: { skill_name: string }) => s.skill_name))
        setTitle(data.posting.title)
        setCompany(data.posting.company ?? '')
        setRawText(data.posting.raw_text)
      })
  }, [id])

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
          <p style={{ fontSize: '12px', color: 'var(--muted)' }}>Ferdigheter: {skills.join(', ') || 'ingen funnet'}</p>
          <button onClick={() => setEditing(true)}>Rediger</button>
          <button onClick={handleDelete}>Slett</button>
        </>
      )}
    </div>
  )
}