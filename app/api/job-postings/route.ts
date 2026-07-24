import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'
import { extractSkillsWithMeta, detectSeniority, detectWorkFormat, detectEmploymentType, generateSummary } from '../../lib/skillAnalysis'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { title, company, raw_text } = body

  if (!title || !raw_text) {
    return NextResponse.json(
      { error: 'title and raw_text are required' },
      { status: 400 }
    )
  }

  const skills = extractSkillsWithMeta(raw_text)
  const seniority = detectSeniority(raw_text)
  const work_format = detectWorkFormat(raw_text)
  const employment_type = detectEmploymentType(raw_text)
  const summary = generateSummary(skills, seniority, work_format, employment_type)

  const { data: posting, error: postingError } = await supabase
    .from('job_postings')
    .insert({ title, company, raw_text, seniority, work_format, employment_type, summary })
    .select()
    .single()

  if (postingError) {
    return NextResponse.json({ error: postingError.message }, { status: 500 })
  }

  if (skills.length > 0) {
    const { error: skillsError } = await supabase
      .from('extracted_skills')
      .insert(skills.map(s => ({
        job_posting_id: posting.id,
        skill_name: s.skill_name,
        category: s.category,
        priority: s.priority,
      })))

    if (skillsError) {
      return NextResponse.json({ error: skillsError.message }, { status: 500 })
    }
  }

  const { data: userSkills } = await supabase.from('user_skills').select('skill_name')
  const ownedNames = new Set((userSkills ?? []).map(s => s.skill_name))
  const skillsWithOwnership = skills.map(s => ({ ...s, isOwned: ownedNames.has(s.skill_name) }))

  return NextResponse.json({ posting, skills: skillsWithOwnership }, { status: 201 })
}

export async function GET() {
  const { data, error } = await supabase
    .from('job_postings')
    .select('id, title, company, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ postings: data })
}