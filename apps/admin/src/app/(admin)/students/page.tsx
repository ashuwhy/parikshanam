import { createAdminClient } from '@/lib/supabase/admin'
import { DataTable } from '@/components/DataTable'
import { createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'

const col = createColumnHelper<any>()
const columns = [
  col.accessor('full_name', { header: 'Name', cell: (i) => (
    <Link href={`/students/${i.row.original.id}`} className="text-brand-primary hover:underline">{i.getValue() ?? '—'}</Link>
  )}),
  col.accessor('phone', { header: 'Phone', cell: (i) => i.getValue() ?? '—' }),
  col.accessor('is_active', { header: 'Status', cell: (i) => (
    <span className={`text-xs px-2 py-0.5 rounded-full ${i.getValue() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
      {i.getValue() ? 'Active' : 'Inactive'}
    </span>
  )}),
  col.accessor('created_at', { header: 'Joined', cell: (i) => new Date(i.getValue()).toLocaleDateString('en-IN') }),
]

export default async function StudentsPage() {
  const admin = createAdminClient()
  const { data: students } = await admin
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-[family-name:var(--font-nunito-var)] font-black text-brand-navy mb-6">
        Students ({students?.length ?? 0})
      </h1>
      <DataTable columns={columns} data={students ?? []} />
    </div>
  )
}
