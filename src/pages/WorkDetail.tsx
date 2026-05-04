import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { works } from '../data/works'

const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
}

const badgeStyle: Record<string, string> = {
  live: 'bg-blue-50 text-accent border border-blue-200',
  research: 'bg-violet-50 text-violet-700 border border-violet-200',
  wip: 'bg-amber-50 text-amber-700 border border-amber-200',
}

export default function WorkDetail() {
  const { id } = useParams<{ id: string }>()
  const work = works.find((w) => w.id === id)

  if (!work) {
    return (
      <motion.main variants={page} initial="initial" animate="animate" exit="exit">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <p className="text-muted">作品が見つかりませんでした。</p>
          <Link to="/works" className="text-accent text-sm mt-4 inline-block">← Works へ</Link>
        </div>
      </motion.main>
    )
  }

  return (
    <motion.main variants={page} initial="initial" animate="animate" exit="exit">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link to="/works" className="font-mono text-sm text-muted hover:text-gray-900 transition-colors">
          ← back
        </Link>

        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-subtle">{work.year}</span>
            {work.badge && (
              <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${badgeStyle[work.badge]}`}>
                {work.badgeLabel ?? work.badge}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">{work.title}</h1>
          <div className="flex flex-wrap gap-1 mb-8">
            {work.tags.map((tag) => (
              <span key={tag} className="font-mono text-xs text-subtle bg-surface px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          {work.longDesc.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-10 flex gap-4">
          {work.appStoreUrl && (
            <a
              href={work.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              App Store で見る
            </a>
          )}
          {work.githubUrl && (
            <a
              href={work.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium rounded-lg hover:border-gray-300 hover:bg-surface transition-colors"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.main>
  )
}
