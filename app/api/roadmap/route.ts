import { NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'
import { getSkillCategory } from '../../lib/skillAnalysis'

function buildReason(count: number, criticalCount: number, totalPostings: number, category: string) {
  if (criticalCount / count >= 0.5) {
    return `Nevnt som et must-have-krav i ${count} av ${totalPostings} lagrede annonser — trolig den viktigste ferdigheten å prioritere innen ${category}.`
  }
  if (criticalCount > 0) {
    return `Etterspurt i ${count} av ${totalPostings} lagrede annonser innen ${category}, og fremhevet som et krav i ${criticalCount} av dem.`
  }
  return `Dukker opp i ${count} av ${totalPostings} lagrede annonser innen ${category} — verdt å vurdere, selv om den sjelden trekkes frem som et hardt krav.`
}

export async function GET() {
  const { data: skills, error } = await supabase.from('extracted_skills').select('skill_name, category, priority')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: userSkills } = await supabase.from('user_skills').select('skill_name')
  const ownedNames = new Set((userSkills ?? []).map(s => s.skill_name))

  const { count: totalPostings } = await supabase.from('job_postings').select('id', { count: 'exact', head: true })

  const counts = new Map<string, { category: string; count: number; criticalCount: number }>()
  for (const s of skills ?? []) {
    if (ownedNames.has(s.skill_name)) continue
    const category = s.category ?? getSkillCategory(s.skill_name) ?? 'Annet'
    const existing = counts.get(s.skill_name)
    if (existing) {
      existing.count += 1
      if (s.priority === 'critical') existing.criticalCount += 1
    } else {
      counts.set(s.skill_name, { category, count: 1, criticalCount: s.priority === 'critical' ? 1 : 0 })
    }
  }

  const roadmap = Array.from(counts, ([skill_name, v]) => ({ skill_name, ...v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((item, index) => ({
      priority: index + 1,
      skill_name: item.skill_name,
      category: item.category,
      reason: buildReason(item.count, item.criticalCount, totalPostings ?? 0, item.category),
    }))

  return NextResponse.json({ roadmap })
}