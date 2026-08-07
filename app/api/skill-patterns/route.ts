import { NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'
import { getSkillCategory } from '../../lib/skillAnalysis'

export async function GET() {
  const { data: skills, error } = await supabase.from('extracted_skills').select('skill_name, category')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { count: totalPostings } = await supabase.from('job_postings').select('id', { count: 'exact', head: true })

  const counts = new Map<string, { category: string; count: number }>()
  for (const s of skills ?? []) {
    const category = s.category ?? getSkillCategory(s.skill_name) ?? 'Annet'
    const existing = counts.get(s.skill_name)
    if (existing) existing.count += 1
    else counts.set(s.skill_name, { category, count: 1 })
  }

  const patterns = Array.from(counts, ([skill_name, v]) => ({ skill_name, ...v }))
    .sort((a, b) => b.count - a.count)

  return NextResponse.json({ patterns, totalPostings: totalPostings ?? 0 })
}