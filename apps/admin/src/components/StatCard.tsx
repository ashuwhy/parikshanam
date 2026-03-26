interface StatCardProps {
  label: string
  value: string | number
  accent?: boolean
}

export function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-ui-border">
      <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">{label}</p>
      <p className={`text-3xl font-[family-name:var(--font-nunito-var)] font-black mt-1 ${accent ? 'text-brand-primary' : 'text-brand-navy'}`}>
        {value}
      </p>
    </div>
  )
}
