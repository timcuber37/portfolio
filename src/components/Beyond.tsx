'use client'

import { motion } from 'framer-motion'
import { Trophy, Users, ExternalLink } from 'lucide-react'
import { SectionLabel } from './About'
import { YoutubeIcon } from './SocialIcons'
import { ink } from '@/lib/theme'

type Link = { label: string; href: string; icon: React.ReactNode }

const CUBING_DESC =
  "I've competed in official World Cube Association events since 2019 and currently rank in the top 100 in the U.S. for both 3×3 and Megaminx. I also share solves and tutorials on YouTube."
const KOREAN_TITLE = 'Korean Club Co-Founder'
const KOREAN_DESC =
  "I co-founded SCSU's Korean Club and serve as Vice President, helping organize cultural events and create a welcoming community on campus."
const YOUTUBE_URL = 'https://www.youtube.com/@timcuber37'
const WCA_URL = 'https://www.worldcubeassociation.org/persons/2019YANT03'

export default function Beyond({ settings }: { settings: Record<string, string> }) {
  const cards: {
    icon: React.ElementType
    title: string
    desc: string
    color: string
    links: Link[]
  }[] = [
    {
      icon: Trophy,
      title: 'Speedcubing',
      desc: settings.beyondCubingDesc ?? CUBING_DESC,
      color: ink.red,
      links: [
        { label: 'YouTube', href: settings.youtubeUrl ?? YOUTUBE_URL, icon: <YoutubeIcon size={14} /> },
        { label: 'WCA Profile', href: settings.wcaUrl ?? WCA_URL, icon: <ExternalLink size={14} /> },
      ],
    },
    {
      icon: Users,
      title: settings.beyondKoreanTitle ?? KOREAN_TITLE,
      desc: settings.beyondKoreanDesc ?? KOREAN_DESC,
      color: ink.green,
      links: [],
    },
  ]

  return (
    <section id="beyond" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel color={ink.amber}>Beyond Code</SectionLabel>
          <h2 className="text-3xl font-bold text-zinc-900 mt-2 mb-3">
            {settings.beyondHeading ?? 'Life outside the editor'}
          </h2>
          <p className="text-zinc-600 text-sm mb-10 max-w-md">
            {settings.beyondIntro ?? 'A few things that matter to me away from software.'}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="flex flex-col bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              style={{ borderTop: `3px solid ${card.color}` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-md" style={{ backgroundColor: `${card.color}1f` }}>
                  <card.icon size={18} style={{ color: card.color }} />
                </div>
                <h3 className="text-base font-semibold text-zinc-900">{card.title}</h3>
              </div>

              <p className="text-sm text-zinc-600 leading-relaxed flex-1">{card.desc}</p>

              {card.links.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {card.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors hover:text-white"
                      style={{ color: card.color, border: `1px solid ${card.color}40` }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = card.color)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
