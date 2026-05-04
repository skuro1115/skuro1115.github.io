import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { logEntries } from '../data/blog'

const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
}

export default function Log() {
  return (
    <motion.main variants={page} initial="initial" animate="animate" exit="exit">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Log</h1>
        <p className="text-sm text-muted mb-12">日記のようなもの。</p>

        <ul className="divide-y divide-border">
          {logEntries.map((entry) => (
            <li key={entry.slug}>
              <Link to={`/log/${entry.slug}`} className="group block py-5">
                <span className="font-mono text-xs text-subtle">{entry.date}</span>
                <h2 className="font-medium text-gray-900 group-hover:text-accent transition-colors mt-1">
                  {entry.title}
                </h2>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.main>
  )
}
