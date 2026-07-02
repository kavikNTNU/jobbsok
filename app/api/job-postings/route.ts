import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'

// Deliberately simple keyword list for now — real extraction comes later
const KNOWN_SKILLS = [
  'TypeScript', 'JavaScript', 'React', 'Next.js', 'SQL',
  'Python', 'communication', 'teamwork', 'leadership'
]

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { title, company, raw_text } = body

  // Basic validation — reject the request early if required fields are missing
  if (!title || !raw_text) {
    return NextResponse.json(
      { error: 'title and raw_text are required' },
      { status: 400 }
    )
  }

  // Step 1: insert the job posting
  const { data: posting, error: postingError } = await supabase
    .from('job_postings')
    .insert({ title, company, raw_text })
    .select()
    .single()

  if (postingError) {
    return NextResponse.json({ error: postingError.message }, { status: 500 })
  }

  // Step 2: naive skill extraction — case-insensitive substring match
  const foundSkills = KNOWN_SKILLS.filter(skill =>
    raw_text.toLowerCase().includes(skill.toLowerCase())
  )

  // Step 3: insert extracted skills, linked to the posting
  if (foundSkills.length > 0) {
    const { error: skillsError } = await supabase
      .from('extracted_skills')
      .insert(
        foundSkills.map(skill_name => ({
          job_posting_id: posting.id,
          skill_name
        }))
      )

    if (skillsError) {
      return NextResponse.json({ error: skillsError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ posting, skills: foundSkills }, { status: 201 })
}