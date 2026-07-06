import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'

export async function GET() {
  const { data, error } = await supabase.from('user_skills').select('*').order('created_at')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ skills: data })
}

export async function POST(request: NextRequest) {
  const { skill_name, proficiency } = await request.json()

  if (!skill_name) {
    return NextResponse.json({ error: 'skill_name is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('user_skills')
    .insert({ skill_name, proficiency })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ skill: data }, { status: 201 })
}