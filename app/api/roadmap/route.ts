import { NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'

export async function GET() {
  const { data, error } = await supabase.rpc('get_skill_gap')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Take the top 3 missing skills by market frequency as the roadmap
  const roadmap = data.slice(0, 3).map((item: { skill_name: string; market_count: number }, index: number) => ({
    priority: index + 1,
    skill_name: item.skill_name,
    reason: `Appears in ${item.market_count} of your saved postings — one of the most in-demand skills you don't have yet.`
  }))

  return NextResponse.json({ roadmap })
}