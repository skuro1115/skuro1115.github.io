import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogPosts } from '../data/blog'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
}

const listContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const listItem = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35 },
  },
}

export default function Blog() {
  useDocumentMeta({
    title: 'Blog',
    description: '技術メモと調査ログ。アルゴリズム・iOS開発・Web 周りの実装記録。',
  })

  return (
    <motion.main variants={page} initial="initial" animate="animate" exit="exit">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Blog</h1>
        <p className="text-sm text-muted mb-12">技術的なメモや調査ログ。</p>

        <motion.ul
          className="divide-y divide-border"
          variants={listContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {blogPosts.map((post) => (
            <motion.li key={post.slug} variants={listItem}>
              <Link
                to={`/blog/${post.slug}`}
                className="group block py-6 hover:no-underline"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs text-subtle">{post.date}</span>
                  <div className="flex gap-1">
                    {post.tags.map((tag) => (
                      <span key={tag} className="font-mono text-xs text-subtle bg-surface px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h2 className="font-semibold text-gray-900 group-hover:text-accent transition-colors mb-1">
                  {post.title}
                </h2>
                <p className="text-sm text-muted">{post.excerpt}</p>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.main>
  )
}
