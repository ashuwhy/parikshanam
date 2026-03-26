import { createAdminClient } from '@/lib/supabase/admin'
import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'

const col = createColumnHelper<any>()
const columns = [
  col.accessor('profile.full_name', { header: 'Student', cell: (i) => i.getValue() ?? '—' }),
  col.accessor('course.title', { header: 'Course', cell: (i) => i.getValue() ?? '—' }),
  col.accessor('amount', { header: 'Amount', cell: (i) => `₹${i.getValue()}` }),
  col.accessor('status', { header: 'Status', cell: (i) => (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
      i.getValue() === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
    }`}>{i.getValue()}</span>
  )}),
  col.accessor('razorpay_payment_id', { header: 'Razorpay ID', cell: (i) => i.getValue() ?? '—' }),
  col.accessor('created_at', { header: 'Date', cell: (i) => new Date(i.getValue()).toLocaleDateString('en-IN') }),
]

export default async function PurchasesPage() {
  const admin = createAdminClient()
  const { data: purchases } = await admin
    .from('purchases')
    .select('*, profile:profiles(full_name), course:courses(title)')
    .order('created_at', { ascending: false })

  const totalRevenue = purchases?.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0) ?? 0

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
      <DataTable columns={columns} data={purchases ?? []} />
    </div>
  )
}
