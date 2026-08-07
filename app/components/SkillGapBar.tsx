export default function SkillGapBar({ skillName, count, maxCount, isGap, total }: { skillName: string; count: number; maxCount: number; isGap: boolean; total?: number }) {
  const widthPercent = Math.round((count / maxCount) * 100)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
      <div style={{ width: '110px', fontSize: '12px', color: 'var(--ink)', flexShrink: 0 }}>{skillName}</div>
      <div style={{ flex: 1, height: '8px', background: 'var(--spruce-light)', borderRadius: '4px', position: 'relative' }}>
        <div style={{ width: `${widthPercent}%`, height: '100%', background: 'var(--spruce)', borderRadius: '4px' }} />
        {isGap && (
          <div style={{
            position: 'absolute',
            left: `${widthPercent}%`,
            top: '-3px',
            width: '3px',
            height: '14px',
            background: 'var(--ochre)',
            borderRadius: '1px',
          }} />
        )}
      </div>
      <div className="mono" style={{ fontSize: '12px', color: 'var(--muted)', width: total ? '40px' : '20px', textAlign: 'right' }}>
        {total ? `${count}/${total}` : count}
      </div>
    </div>
  )
}