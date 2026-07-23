import { getProjects, getExperience, getSkills, getSettings, getCustomSections } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Beyond from '@/components/Beyond'
import CustomSections from '@/components/CustomSections'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import GeometricBackground from '@/components/GeometricBackground'
import ScrollProgress from '@/components/ScrollProgress'

// Render per request so content edited in the admin panel appears immediately
// (and the production build doesn't need a database connection).
export const dynamic = 'force-dynamic'

export default async function Home() {
  const [projects, experience, skills, settings, customSections] = await Promise.all([
    getProjects(),
    getExperience(),
    getSkills(),
    getSettings(),
    getCustomSections(),
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
        <Experience experience={experience} settings={settings} />
        <Skills skills={skills} settings={settings} />
        <Beyond settings={settings} />
        <CustomSections sections={customSections} />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  )
}
