'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DataTable } from '@/components/data-table'
import { ColumnDef } from '@tanstack/react-table'

interface StudentRow {
  id: string
  name: string
  courseTitle: string
  paymentStatus: string
  enrollmentDate: string
}

const columns: ColumnDef<StudentRow>[] = [
  {
    accessorKey: 'name',
    header: 'Student Name',
  },
  {
    accessorKey: 'courseTitle',
    header: 'Course',
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
  },
  {
    accessorKey: 'enrollmentDate',
    header: 'Enrollment Date',
  },
]

export default async function StudentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get teacher's courses
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id')
    .eq('teacher_id', user.id)

  if (coursesError) {
    console.error('Error fetching courses:', coursesError)
    return (
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">My Students</h1>
        <p className="text-red-600">Error loading students</p>
      </div>
    )
  }

  const courseIds = courses?.map((c) => c.id) || []

  // Guard: if no courses, return empty state
  if (courseIds.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">My Students</h1>
        <p className="text-gray-600">No students yet</p>
      </div>
    )
  }

  // Get student purchases with related data
  const { data: purchases, error: purchasesError } = await supabase
    .from('purchases')
    .select(
      `
      id,
      course_id,
      user_id,
      payment_status,
      created_at,
      courses(title),
      profiles(full_name)
    `
    )
    .in('course_id', courseIds)

  if (purchasesError) {
    console.error('Error fetching purchases:', purchasesError)
    return (
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">My Students</h1>
        <p className="text-red-600">Error loading students</p>
      </div>
    )
  }

  // Transform data for table
  const students: StudentRow[] = (purchases || []).map((purchase: any) => ({
    id: purchase.user_id,
    name: purchase.profiles?.full_name || 'Unknown',
    courseTitle: purchase.courses?.title || 'Unknown',
    paymentStatus: purchase.payment_status || 'pending',
    enrollmentDate: new Date(purchase.created_at).toLocaleDateString(),
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy mb-6">My Students</h1>
      <DataTable columns={columns} data={students} />
    </div>
  )
}
