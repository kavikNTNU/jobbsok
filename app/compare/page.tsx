'use client'

// import SkillGap from '../components/SkillGap'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

type PostingSummary = { id: string; title: string; company: string | null }
type PostingWithSkills = { id: string; title: string; company: string | null; skills: string[] }


export default function ComparePage() {
  // return (
    // <div>
    //   <h1>Compare</h1>
      {/* <SkillGap />  */}
    // </div>
  // )
  const searchParams = useSearchParams()
  const router = useRouter()
  const idsParam = searchParams.get('ids')

  if (idsParam) {
    return <ComparisonView ids={idsParam.split(',')} />
  }
  return <PostingSelector onCompare={(ids) => router.push(`/compare?ids=${ids.join(',')}`)} />
}

function PostingSelector({ onCompare }: { onCompare: (ids: string[]) => void }) {
  const [postings, setPostings] = useState<PostingSummary[]>([])
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/job-postings').then(res => res.json()).then(data => setPostings(data.postings ?? []))
  }, [])

  function toggle(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div style={{ maxWidth: '500px' }}>
      <h1 style={{ fontSize: '18px', marginBottom: '1rem' }}>Sammenlign</h1>
      <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '1rem' }}>Velg to eller flere stillinger å sammenligne.</p>

      <div style={{ background: '#fff', border: '0.5px solid var(--line)', borderRadius: '8px', marginBottom: '1rem' }}>
        {postings.map((p, i) => (
          <label key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '0.7rem 1rem',
            borderBottom: i < postings.length - 1 ? '0.5px solid var(--line)' : 'none',
            fontSize: '13px', cursor: 'pointer',
          }}>
            <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} />
            {p.title}{p.company ? ` — ${p.company}` : ''}
          </label>
        ))}
      </div>

      <button
        disabled={selected.length < 2}
        onClick={() => onCompare(selected)}
        style={{
          padding: '8px 16px',
          background: selected.length < 2 ? 'var(--line)' : 'var(--spruce)',
          color: selected.length < 2 ? 'var(--muted)' : 'var(--paper)',
          border: 'none', borderRadius: '6px',
        }}
      >
        Sammenlign ({selected.length})
      </button>
    </div>
  )
}

function ComparisonView({ ids }: { ids: string[] }) {
  const [postings, setPostings] = useState<PostingWithSkills[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/job-postings/compare?ids=${ids.join(',')}`)
      .then(res => res.json())
      .then(data => setPostings(data.postings ?? []))
  }, [ids.join(',')])

  const allSkills = Array.from(new Set(postings.flatMap(p => p.skills))).sort()
  const commonSkills = allSkills.filter(skill => postings.every(p => p.skills.includes(skill)))

  return (
    <div>
      <button onClick={() => router.push('/compare')} style={{ marginBottom: '1rem', fontSize: '13px' }}>
        ← Velg andre stillinger
      </button>
      <h1 style={{ fontSize: '18px', marginBottom: '1rem' }}>Sammenligning</h1>

      {commonSkills.length > 0 && (
        <p style={{ fontSize: '13px', marginBottom: '1rem' }}>
          Felles ferdigheter: <strong>{commonSkills.join(', ')}</strong>
        </p>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', background: '#fff', border: '0.5px solid var(--line)', borderRadius: '8px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.6rem 1rem', borderBottom: '0.5px solid var(--line)' }}></th>
              {postings.map(p => (
                <th key={p.id} style={{ textAlign: 'left', padding: '0.6rem 1rem', borderBottom: '0.5px solid var(--line)' }}>{p.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allSkills.map(skill => (
              <tr key={skill}>
                <td style={{ padding: '0.5rem 1rem', color: 'var(--muted)' }}>{skill}</td>
                {postings.map(p => (
                  <td key={p.id} style={{ padding: '0.5rem 1rem', textAlign: 'center' }}>
                    {p.skills.includes(skill)
                      ? <span style={{ color: 'var(--spruce)' }}>✓</span>
                      : <span style={{ color: 'var(--line)' }}>–</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}