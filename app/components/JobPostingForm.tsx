'use client'
import { useState } from 'react'
import PostingAnalysis from './PostingAnalysis'

type SkillResult = { skill_name: string; category: string; priority: string; isOwned: boolean }
type Posting = { seniority: string; work_format: string; employment_type: string; summary: string }

export default function JobPostingForm({ onSuccess }: { onSuccess?: () => void }) {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [rawText, setRawText] = useState('')
  const [result, setResult] = useState<{ posting: Posting; skills: SkillResult[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    const res = await fetch('/api/job-postings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, company, raw_text: rawText }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Noe gikk galt')
      return
    }

    setResult(data)
    setTitle('')
    setCompany('')
    setRawText('')
    onSuccess?.()
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxWidth: '500px' }}>
        <input placeholder="Stillingstittel" value={title} onChange={e => setTitle(e.target.value)} required
          style={{ padding: '8px', border: '0.5px solid var(--line)', borderRadius: '6px' }} />
        <input placeholder="Bedrift (valgfritt)" value={company} onChange={e => setCompany(e.target.value)}
          style={{ padding: '8px', border: '0.5px solid var(--line)', borderRadius: '6px' }} />
        <textarea placeholder="Lim inn stillingsannonsen her" value={rawText} onChange={e => setRawText(e.target.value)} rows={8} required
          style={{ padding: '8px', border: '0.5px solid var(--line)', borderRadius: '6px' }} />
        <button type="submit" disabled={loading}
          style={{ padding: '8px 16px', background: 'var(--spruce)', color: 'var(--paper)', border: 'none', borderRadius: '6px', alignSelf: 'flex-start' }}>
          {loading ? 'Skanner...' : 'Skann stillingsannonse'}
        </button>
        {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
      </form>

      {result && (
        <div style={{ marginTop: '1.5rem', maxWidth: '600px' }}>
          <PostingAnalysis posting={result.posting} skills={result.skills} />
        </div>
      )}
    </div>
  )
}