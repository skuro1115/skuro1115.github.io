import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
}

export default function NotFound() {
  useDocumentMeta({
    title: '404 Not Found',
    description: 'お探しのページは見つかりませんでした。',
  })

  return (
    <motion.main variants={page} initial="initial" animate="animate" exit="exit">
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <p className="font-mono text-xs text-subtle uppercase tracking-widest mb-3">404</p>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-3">
          Page not found
        </h1>
        <p className="text-muted leading-relaxed mb-10">
          URL が変わったか、削除された可能性があります。
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/"
            className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Apps へ戻る
          </Link>
          <Link
            to="/works"
            className="px-4 py-2 rounded-md border border-border text-sm font-medium hover:border-gray-300 transition-colors"
          >
            Works を見る
          </Link>
        </div>
      </div>
    </motion.main>
  )
}
