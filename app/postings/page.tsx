'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import JobPostingForm from '../components/JobPostingForm'

type Posting = { id: string; title: string; company: string | null; created_at: string }

export default function PostingsPage() {
  // return <JobPostingForm />
  const [postings, setPostings] = useState<Posting[]>([])

  function loadPostings() {
    fetch('/api/job-postings').then(res => res.json()).then(data => setPostings(data.postings ?? []))
  }

  useEffect(() => {
    loadPostings()
  }, [])

  return (
    <div>
      <h1 style={{ fontSize: '18px', marginBottom: '1rem' }}>Stillinger</h1>

      <JobPostingForm onSuccess={loadPostings} />

      <h2 style={{ fontSize: '14px', margin: '1.5rem 0 0.5rem' }}>Lagrede stillinger</h2>
      <div style={{ background: '#fff', border: '0.5px solid var(--line)', borderRadius: '8px' }}>
        {postings.map((p, i) => (
          <Link
            key={p.id}
            href={`/postings/${p.id}`}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderBottom: i < postings.length - 1 ? '0.5px solid var(--line)' : 'none',
              textDecoration: 'none',
              color: 'var(--ink)',
              fontSize: '13px',
            }}
          >
            <span>{p.title}{p.company ? ` — ${p.company}` : ''}</span>
            <span style={{ color: 'var(--muted)' }}>{new Date(p.created_at).toLocaleDateString('nb-NO')}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
