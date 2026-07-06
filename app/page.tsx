import Image from "next/image";
import JobPostingForm from './components/JobPostingForm'
import SkillPatterns from './components/SkillPatterns'
import UserSkillsManager from "./components/UserSkillsManager";
import SkillGap from './components/SkillGap'

export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Job Market Analyzer</h1>
      <JobPostingForm />
      <SkillPatterns />
      <UserSkillsManager />
      <SkillGap />
    </div>
  )
}
