import Image from "next/image";
import JobPostingForm from './components/JobPostingForm'

export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Job Market Analyzer</h1>
      <JobPostingForm />
    </div>
  )
}
