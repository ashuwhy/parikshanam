interface StatCardProps {
  label: string
  value: string | number
  accent?: boolean
}

export function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="bg-surface-elevated rounded-[var(--radius-card)] p-5 border border-ui-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85),0_8px_24px_-12px_rgba(27,58,110,0.12)]">
      <p className="text-xs uppercase tracking-wider text-text-muted font-medium">{label}</p>
      <p className={`text-3xl font-[family-name:var(--font-nunito-var)] font-black mt-1 ${accent ? 'text-brand-primary' : 'text-brand-navy'}`}>
        {value}
      </p>
    </div>
  )
}
