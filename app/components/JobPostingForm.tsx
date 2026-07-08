'use client'
import { useState } from 'react'

export default function JobPostingForm({ onSuccess }: { onSuccess?: () => void }) {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [rawText, setRawText] = useState('')
  const [result, setResult] = useState<{ skills: string[] } | null>(null)
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
      body: JSON.stringify({ title, company, raw_text: rawText })
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Something went wrong')
      return
    }

    setResult(data)
    setTitle('')
    setCompany('')
    setRawText('')
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '500px' }}>
      <input
        placeholder="Job title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        placeholder="Company (optional)"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <textarea
        placeholder="Paste the job ad text here"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        rows={8}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Scanning...' : 'Scan Job Posting'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div>
          <p>Skills found:</p>
          <ul>
            {result.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  )
}