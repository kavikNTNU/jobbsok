type AnalysisPosting = { summary: string; seniority: string; work_format: string; employment_type: string }
type SkillResult = { skill_name: string; category: string; priority: string; isOwned: boolean }

export default function PostingAnalysis({ posting, skills }: { posting: AnalysisPosting; skills: SkillResult[] }) {
  const categories = Array.from(new Set(skills.map(s => s.category)))
  const matched = skills.filter(s => s.isOwned).length

  return (
    <div style={{ background: '#fff', border: '0.5px solid var(--line)', borderRadius: '8px', padding: '1rem' }}>
      <p style={{ fontSize: '13px', marginBottom: '0.5rem' }}>{posting.summary}</p>
      <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '0.75rem' }}>
        {matched} av {skills.length} ferdigheter matchet
      </p>

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
  )
}
