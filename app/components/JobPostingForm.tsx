'use client'
import { useState } from 'react'

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

  const categories = result ? Array.from(new Set(result.skills.map(s => s.category))) : []

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
        <div style={{ marginTop: '1.5rem', background: '#fff', border: '0.5px solid var(--line)', borderRadius: '8px', padding: '1rem', maxWidth: '600px' }}>
          <p style={{ fontSize: '13px', marginBottom: '0.75rem' }}>{result.posting.summary}</p>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {[result.posting.seniority, result.posting.work_format, result.posting.employment_type]
              .filter(v => v !== 'uspesifisert')
              .map(v => (
                <span key={v} style={{ fontSize: '11px', padding: '2px 8px', background: 'var(--spruce-light)', borderRadius: '4px' }}>{v}</span>
              ))}
          </div>

          {categories.map(category => (
            <div key={category} style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>{category}</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {result.skills.filter(s => s.category === category).map(s => (
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
      )}
    </div>
  )
}