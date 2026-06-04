import { getProjects, getExperience, getSkills, getSettings } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Beyond from '@/components/Beyond'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import GeometricBackground from '@/components/GeometricBackground'
import ScrollProgress from '@/components/ScrollProgress'

export default async function Home() {
  const [projects, experience, skills, settings] = await Promise.all([
    getProjects(),
    getExperience(),
    getSkills(),
    getSettings(),
  ])

  return (
    <>
      <ScrollProgress />
      <GeometricBackground />
      <AnalyticsTracker />
      <Navbar />
      <main>
        <Hero settings={settings} />
        <About settings={settings} />
        <Projects projects={projects} settings={settings} />
        <Skills skills={skills} settings={settings} />
        <Experience experience={experience} settings={settings} />
        <Beyond settings={settings} />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  )
}
