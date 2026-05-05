import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { works, type Work } from '../data/works'
import { useGitHubStats } from '../hooks/useGitHubStats'

const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
}

const gridContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const cardItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.2, 0.65, 0.3, 0.9] as const },
  },
}

const badgeStyle: Record<string, string> = {
  live: 'bg-blue-50 text-accent border border-blue-200',
  research: 'bg-violet-50 text-violet-700 border border-violet-200',
  wip: 'bg-amber-50 text-amber-700 border border-amber-200',
}

function WorkCard({ work }: { work: Work }) {
  const { stars } = useGitHubStats(work.githubUrl)

  return (
    <motion.div
      variants={cardItem}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
    >
      <Link
        to={`/works/${work.id}`}
        className="group block p-5 rounded-xl border border-border bg-white hover:border-gray-300 hover:shadow-md transition-[border-color,box-shadow]"
      >
        <div className="flex items-start justify-between mb-3">
          <span className="font-mono text-xs text-subtle">{work.year}</span>
          {work.badge && (
            <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${badgeStyle[work.badge]}`}>
              {work.badgeLabel ?? work.badge}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-accent transition-colors">
          {work.title}
        </h3>
        <p className="text-sm text-muted leading-relaxed">{work.shortDesc}</p>
        <div className="mt-3 flex flex-wrap gap-1 items-center">
          {work.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="font-mono text-xs text-subtle bg-surface px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
          {stars > 0 && (
            <span className="font-mono text-xs text-subtle ml-auto">
              ★ {stars}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default function Home() {
  return (
    <motion.main variants={page} initial="initial" animate="animate" exit="exit">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16">
        <p className="font-mono text-sm text-muted mb-3">skuro1115</p>
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-4">
          Software & Ideas
        </h1>
        <p className="text-lg text-muted max-w-xl leading-relaxed">
          iOSアプリ開発・アルゴリズム研究・VRシミュレーションを中心に活動するエンジニア。
          作ったものとその技術的な背景をここにまとめています。
        </p>
      </section>

      {/* Works */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <h2 className="text-xs font-mono text-subtle uppercase tracking-widest mb-6">Works</h2>
        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </motion.div>
      </section>
    </motion.main>
  )
}
