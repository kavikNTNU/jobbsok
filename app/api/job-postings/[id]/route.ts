import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: posting, error: postingError } = await supabase
    .from('job_postings')
    .select('*')
    .eq('id', id)
    .single()

  if (postingError) {
    return NextResponse.json({ error: postingError.message }, { status: 404 })
  }

  const { data: skills } = await supabase
    .from('extracted_skills')
    .select('skill_name')
    .eq('job_posting_id', id)

  return NextResponse.json({ posting, skills: skills ?? [] })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { title, company, raw_text } = await request.json()

  if (!title || !raw_text) {
    return NextResponse.json({ error: 'title and raw_text are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('job_postings')
    .update({ title, company, raw_text })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ posting: data })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { error } = await supabase.from('job_postings').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}