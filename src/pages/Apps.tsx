import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { works, type Work } from '../data/works'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { AppIcon } from '../components/AppIcon'

const appWorks = works.filter((w) => w.showInApps)

const gradients: Record<string, { bg: string; accent: string; glow: string }> = {
  blue: {
    bg: 'from-[#0a0f1e] via-[#0d1a3a] to-[#0a0f1e]',
    accent: 'from-blue-500 to-indigo-600',
    glow: 'shadow-blue-500/30',
  },
  green: {
    bg: 'from-[#021a0a] via-[#062b10] to-[#021a0a]',
    accent: 'from-emerald-500 to-green-600',
    glow: 'shadow-emerald-500/30',
  },
  violet: {
    bg: 'from-[#0f0a1e] via-[#1a0d38] to-[#0f0a1e]',
    accent: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/30',
  },
  amber: {
    bg: 'from-[#1a1000] via-[#2b1a00] to-[#1a1000]',
    accent: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/30',
  },
}

const defaultGradient = gradients.blue

const page = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
}

const gridContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const cardItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] as const },
  },
}

function AppCard({ work }: { work: Work }) {
  const g = gradients[work.color] ?? defaultGradient

  return (
    <motion.div
      variants={cardItem}
      whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
      className={`relative rounded-3xl bg-gradient-to-br ${g.bg} p-px shadow-2xl ${g.glow}`}
    >
      <div className="rounded-3xl bg-black/50 backdrop-blur-xl p-6 h-full flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <AppIcon
            src={work.iconUrl}
            title={work.title}
            alt={`${work.title} icon`}
            className="w-20 h-20 rounded-2xl shadow-lg flex-shrink-0"
            fallbackClassName={`bg-gradient-to-br ${g.accent}`}
            fallbackTextClassName="text-3xl font-black text-white"
          />
          <div className="flex-1 min-w-0">
            {work.badge && (
              <span
                className={`inline-block font-mono text-[10px] px-2 py-0.5 rounded-full mb-2 bg-gradient-to-r ${g.accent} text-white`}
              >
                {work.badgeLabel ?? work.badge}
              </span>
            )}
            <h2 className="text-lg font-bold text-white leading-tight">
              {work.title}
            </h2>
            <span className="font-mono text-[10px] text-gray-500">
              {work.year}
            </span>
          </div>
        </div>

        {work.catchphrase && (
          <p
            className={`text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r ${g.accent} mb-2`}
          >
            {work.catchphrase}
          </p>
        )}

        <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
          {work.shortDesc}
        </p>

        <div className="flex flex-wrap gap-2">
          {work.appStoreUrl && (
            <a
              href={work.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track="app-store"
              data-track-app={work.id}
              data-track-source="apps"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r ${g.accent} text-white text-xs font-semibold hover:opacity-90 transition-opacity`}
            >
              App Store
            </a>
          )}
          {work.externalUrl ? (
            <a
              href={work.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track="external-lp"
              data-track-app={work.id}
              data-track-source="apps"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 text-xs font-medium hover:text-white hover:border-white/30 transition-colors ml-auto"
            >
              View Product Page
              <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                <path
                  d="M5 3h6v6M11 3L4 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ) : (
            <Link
              to={`/apps/${work.id}`}
              data-track="view-product"
              data-track-app={work.id}
              data-track-source="apps"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 text-xs font-medium hover:text-white hover:border-white/30 transition-colors ml-auto"
            >
              View Product Page
              <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                <path
                  d="M3 7h8M7 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Apps() {
  useDocumentMeta({
    title: 'Apps',
    description: '友達と遊ぶパーティーゲームから日々を支えるツールまで。skuro が公開しているアプリの一覧。',
  })

  return (
    <motion.main variants={page} initial="initial" animate="animate" exit="exit">
      {/* Page hero */}
      <section className="bg-[#06080f] px-6 py-16 text-center">
        <motion.p
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-mono text-xs text-blue-400 uppercase tracking-widest mb-4"
        >
          Apps
        </motion.p>
        <motion.h1
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4"
        >
          Play Smarter.
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.18 }}
          className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed"
        >
          楽しみ方の可能性を広げる。
        </motion.p>
      </section>

      {/* Apps grid */}
      <section className="bg-[#06080f] px-6 pb-20">
        <motion.div
          className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {appWorks.map((work) => (
            <AppCard key={work.id} work={work} />
          ))}
        </motion.div>
      </section>

      {/* Footer CTA */}
      <section className="bg-[#06080f] px-6 py-16 text-center border-t border-white/5">
        <p className="text-gray-500 text-sm mb-2">その他の作品はこちら</p>
        <Link
          to="/works"
          className="inline-flex items-center gap-2 text-white font-medium hover:text-blue-400 transition-colors"
        >
          All Works を見る
          <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </section>
    </motion.main>
  )
}
