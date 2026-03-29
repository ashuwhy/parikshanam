import { createAdminClient } from '@/lib/supabase/admin'
import { PurchasesTable } from '@/components/PurchasesTable'
import { CreditCard } from 'lucide-react'

export default async function PurchasesPage() {
  const admin = createAdminClient()
  const { data: purchases } = await admin
    .from('purchases')
    .select('*, profile:profiles(full_name), course:courses(title)')
    .order('created_at', { ascending: false })

  // Amount is stored in paise, so we divide by 100 for rupees
  const totalRevenue = (purchases?.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0) ?? 0) / 100

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy animate-fade-in-up">
            Purchases
          </h1>
          <p className="text-text-muted text-sm mt-1 animate-fade-in-up delay-1">
            Manage course enrollments and payment verifications
          </p>
        </div>
        <div className="bg-white border border-[#E5E0D8] rounded-2xl px-5 py-3 shadow-sm flex items-center gap-3 self-start md:self-auto animate-fade-in-up delay-2">
          <div className="size-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <CreditCard size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Total Revenue</p>
            <p className="font-black text-xl text-brand-navy font-[family-name:var(--font-nunito-var)]">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>
      <div className="animate-fade-in-up delay-3">
        <PurchasesTable purchases={purchases ?? []} />
      </div>
    </div>
  )
}
