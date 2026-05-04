import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { logEntries } from '../data/blog'

const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
}

export default function LogPost() {
  const { slug } = useParams<{ slug: string }>()
  const entry = logEntries.find((e) => e.slug === slug)

  if (!entry) {
    return (
      <motion.main variants={page} initial="initial" animate="animate" exit="exit">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <p className="text-muted">記録が見つかりませんでした。</p>
          <Link to="/log" className="text-accent text-sm mt-4 inline-block">← log</Link>
        </div>
      </motion.main>
    )
  }

  return (
    <motion.main variants={page} initial="initial" animate="animate" exit="exit">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link to="/log" className="font-mono text-sm text-muted hover:text-gray-900 transition-colors">
          ← log
        </Link>
        <div className="mt-8 mb-10">
          <span className="font-mono text-xs text-subtle">{entry.date}</span>
          <h1 className="text-2xl font-semibold text-gray-900 mt-2">{entry.title}</h1>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{entry.body}</p>
      </div>
    </motion.main>
  )
}
