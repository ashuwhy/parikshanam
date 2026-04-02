import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('schools')
    .select('id, name, created_at')
    .order('name', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { name } = (await req.json()) as { name?: string }
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('schools')
    .insert({ name: name.trim() })
    .select('id, name')
    .single()
  if (error) {
    const msg = error.code === '23505' ? 'School already exists' : error.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: Request) {
  const { id } = (await req.json()) as { id?: string }
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }
  const admin = createAdminClient()
  const { error } = await admin.from('schools').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return new NextResponse(null, { status: 204 })
}
