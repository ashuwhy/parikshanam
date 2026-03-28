import { createAdminClient } from '@/lib/supabase/admin'
import { PurchasesTable } from '@/components/PurchasesTable'

export default async function PurchasesPage() {
  const admin = createAdminClient()
  const { data: purchases } = await admin
    .from('purchases')
    .select('*, profile:profiles(full_name), course:courses(title)')
    .order('created_at', { ascending: false })

  // Amount is stored in paise, so we divide by 100 for rupees
  const totalRevenue = (purchases?.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0) ?? 0) / 100

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy">Purchases</h1>
        <div className="bg-white border border-ui-border rounded-xl px-4 py-2">
          <span className="text-xs text-gray-400">Total Revenue </span>
          <span className="font-black text-brand-primary font-[family-name:var(--font-nunito-var)]">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
      <PurchasesTable purchases={purchases ?? []} />
    </div>
  )
}
