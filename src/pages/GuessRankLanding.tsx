import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { works } from '../data/works'

const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
}

export default function GuessRankLanding() {
  const work = works.find((w) => w.id === 'guess-rank')
  if (!work) return null

  return (
    <motion.main variants={page} initial="initial" animate="animate" exit="exit">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="font-mono text-xs text-subtle hover:text-accent">
          ← Back to Apps
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mt-6 mb-3">
          {work.title}
        </h1>

        {work.catchphrase && (
          <p className="text-lg text-accent mb-6">{work.catchphrase}</p>
        )}

        <p className="text-base text-muted leading-relaxed mb-8 whitespace-pre-line">
          {work.longDesc}
        </p>

        {work.features && work.features.length > 0 && (
          <ul className="list-disc list-inside text-sm text-muted space-y-1 mb-8">
            {work.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}

        <div className="flex gap-3">
          {work.appStoreUrl && (
            <a
              href={work.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              App Store で見る
            </a>
          )}
          {work.githubUrl && (
            <a
              href={work.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-md border border-border text-sm font-medium hover:border-gray-300 transition-colors"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.main>
  )
}
