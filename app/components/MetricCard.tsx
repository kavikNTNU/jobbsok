export default function MetricCard({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div style={{
      background: '#fff',
      border: `0.5px solid ${highlight ? 'var(--ochre)' : 'var(--line)'}`,
      borderRadius: '8px',
      padding: '0.75rem',
    }}>
      <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>{label}</div>
      <div className="mono" style={{ fontSize: '22px', color: highlight ? 'var(--ochre)' : 'var(--ink)' }}>{value}</div>
    </div>
  )
}