import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get('ids')
  if (!idsParam) {
    return NextResponse.json({ error: 'ids query parameter is required' }, { status: 400 })
  }
  const ids = idsParam.split(',')

  const { data: postings, error: postingsError } = await supabase
    .from('job_postings')
    .select('id, title, company')
    .in('id', ids)

  if (postingsError) {
    return NextResponse.json({ error: postingsError.message }, { status: 500 })
  }

  const { data: skills, error: skillsError } = await supabase
    .from('extracted_skills')
    .select('job_posting_id, skill_name')
    .in('job_posting_id', ids)

  if (skillsError) {
    return NextResponse.json({ error: skillsError.message }, { status: 500 })
  }

  const postingsWithSkills = postings.map(posting => ({
    ...posting,
    skills: skills.filter(s => s.job_posting_id === posting.id).map(s => s.skill_name),
  }))

  return NextResponse.json({ postings: postingsWithSkills })
}