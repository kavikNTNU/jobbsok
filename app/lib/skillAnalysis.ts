type SkillCategory = 'Frontend' | 'Backend' | 'Verktøy' | 'Myke ferdigheter'
type Priority = 'critical' | 'desirable' | 'neutral'

type SkillDefinition = { name: string; category: SkillCategory; synonyms: string[] }

const SKILLS: SkillDefinition[] = [
  { name: 'JavaScript', category: 'Frontend', synonyms: ['javascript', 'js', 'ecmascript'] },
  { name: 'TypeScript', category: 'Frontend', synonyms: ['typescript', 'ts'] },
  { name: 'React', category: 'Frontend', synonyms: ['react'] },
  { name: 'Next.js', category: 'Frontend', synonyms: ['next\\.js', 'nextjs'] },
  { name: 'Vue', category: 'Frontend', synonyms: ['vue\\.js', 'vuejs', 'vue'] },
  { name: 'CSS', category: 'Frontend', synonyms: ['css', 'sass', 'scss', 'tailwind'] },
  { name: 'HTML', category: 'Frontend', synonyms: ['html5', 'html'] },

  { name: 'Node.js', category: 'Backend', synonyms: ['node\\.js', 'nodejs', 'node'] },
  { name: 'Python', category: 'Backend', synonyms: ['python'] },
  { name: 'Java', category: 'Backend', synonyms: ['java\\b'] },
  { name: 'SQL', category: 'Backend', synonyms: ['sql', 'postgresql', 'postgres', 'mysql', 'database design'] },
  { name: 'REST APIs', category: 'Backend', synonyms: ['rest api', 'restful', 'api design'] },
  { name: 'GraphQL', category: 'Backend', synonyms: ['graphql'] },

  { name: 'Git', category: 'Verktøy', synonyms: ['git', 'versjonskontroll', 'version control'] },
  { name: 'Docker', category: 'Verktøy', synonyms: ['docker', 'containeriz', 'konteineriser'] },
  { name: 'CI/CD', category: 'Verktøy', synonyms: ['ci/cd', 'continuous integration', 'continuous deployment', 'kontinuerlig integrasjon'] },
  { name: 'Testing', category: 'Verktøy', synonyms: ['unit test', 'test-driven', 'tdd', 'jest', 'cypress', 'enhetstesting'] },
  { name: 'Agile', category: 'Verktøy', synonyms: ['agile', 'scrum', 'kanban', 'smidig metodikk', 'smidig'] },

  { name: 'Kommunikasjon', category: 'Myke ferdigheter', synonyms: ['communication', 'communicate', 'kommunikasjon', 'kommunisere'] },
  { name: 'Samarbeid', category: 'Myke ferdigheter', synonyms: ['teamwork', 'team player', 'collaborat', 'samarbeid', 'lagspiller'] },
  { name: 'Ledelse', category: 'Myke ferdigheter', synonyms: ['leadership', 'mentoring', 'mentor', 'ledelse', 'lede'] },
  { name: 'Problemløsning', category: 'Myke ferdigheter', synonyms: ['problem-solving', 'problem solving', 'analytical', 'problemløsning', 'analytisk'] },
  { name: 'Selvstendighet', category: 'Myke ferdigheter', synonyms: ['self-motivated', 'independently', 'selvstendig', 'selvgående'] },
  { name: 'Fleksibilitet', category: 'Myke ferdigheter', synonyms: ['flexible', 'adaptable', 'fleksibel', 'omstillingsdyktig'] },
]

const PRIORITY_PHRASES: Record<'critical' | 'desirable', string[]> = {
  critical: ['må ha', 'må beherske', 'påkrevd', 'krav om', 'krav til', 'essensielt', 'nødvendig', 'required', 'must have', 'mandatory', 'essential'],
  desirable: ['ønskelig', 'meritterende', 'et pre', 'fordel', 'nice to have', 'preferred', 'bonus'],
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function findMatchIndex(lowerText: string, synonym: string): number {
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegex(synonym)}`, 'iu')
  const match = pattern.exec(lowerText)
  return match ? match.index : -1
}

function detectPriority(lowerText: string, matchIndex: number): Priority {
  // Se på teksten rett før og etter treffet — krav-fraser står oftest like i forkant
  const window = lowerText.slice(Math.max(0, matchIndex - 80), matchIndex + 40)
  if (PRIORITY_PHRASES.critical.some(p => window.includes(p))) return 'critical'
  if (PRIORITY_PHRASES.desirable.some(p => window.includes(p))) return 'desirable'
  return 'neutral'
}

export type ExtractedSkill = { skill_name: string; category: SkillCategory; priority: Priority }

export function getSkillCategory(skillName: string): SkillCategory | undefined {
  return SKILLS.find(s => s.name === skillName)?.category
}

export function extractSkillsWithMeta(rawText: string): ExtractedSkill[] {
  const lowerText = rawText.toLowerCase()
  const found: ExtractedSkill[] = []

  for (const skill of SKILLS) {
    for (const synonym of skill.synonyms) {
      const index = findMatchIndex(lowerText, synonym)
      if (index !== -1) {
        found.push({ skill_name: skill.name, category: skill.category, priority: detectPriority(lowerText, index) })
        break
      }
    }
  }
  return found
}

const SENIORITY_PHRASES: Record<string, string[]> = {
  senior: ['senior', 'erfaren utvikler', '5+ år', '5 års erfaring', 'ledende utvikler'],
  medior: ['medior', 'mid-level', 'mid level', '2-4 år', '2-5 år'],
  junior: ['junior', 'nyutdannet', 'entry level', 'entry-level', 'graduate'],
}
export function detectSeniority(rawText: string): string {
  const lowerText = rawText.toLowerCase()
  for (const level of ['senior', 'medior', 'junior']) {
    if (SENIORITY_PHRASES[level].some(p => lowerText.includes(p))) return level
  }
  return 'uspesifisert'
}

const WORK_FORMAT_PHRASES: Record<string, string[]> = {
  hjemmekontor: ['hjemmekontor', 'remote', 'fjernarbeid', 'jobbe hjemmefra'],
  hybrid: ['hybrid'],
  kontor: ['på kontoret', 'kontorbasert', 'on-site', 'onsite', 'fysisk til stede'],
}
export function detectWorkFormat(rawText: string): string {
  const lowerText = rawText.toLowerCase()
  for (const format of ['hybrid', 'hjemmekontor', 'kontor']) {
    if (WORK_FORMAT_PHRASES[format].some(p => lowerText.includes(p))) return format
  }
  return 'uspesifisert'
}

const EMPLOYMENT_TYPE_PHRASES: Record<string, string[]> = {
  heltid: ['heltid', 'full-time', 'full time', '100%'],
  deltid: ['deltid', 'part-time', 'part time'],
  kontrakt: ['kontrakt', 'freelance', 'konsulent', 'consultant'],
}
export function detectEmploymentType(rawText: string): string {
  const lowerText = rawText.toLowerCase()
  for (const type of ['heltid', 'deltid', 'kontrakt']) {
    if (EMPLOYMENT_TYPE_PHRASES[type].some(p => lowerText.includes(p))) return type
  }
  return 'uspesifisert'
}

export function generateSummary(skills: ExtractedSkill[], seniority: string, workFormat: string, employmentType: string): string {
  const critical = skills.filter(s => s.priority === 'critical').map(s => s.skill_name)
  const topSkills = (critical.length > 0 ? critical : skills.map(s => s.skill_name)).slice(0, 3)

  let summary = topSkills.length > 0
    ? `Denne stillingen krever hovedsakelig ${topSkills.join(', ')}`
    : 'Ingen spesifikke tekniske ferdigheter ble funnet i annonsen'

  const extras = [seniority, workFormat, employmentType].filter(x => x !== 'uspesifisert')
  if (extras.length > 0) summary += `, retter seg mot ${extras.join(', ')}`
  summary += '.'
  return summary
}