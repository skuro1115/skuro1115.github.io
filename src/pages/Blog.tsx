import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogPosts } from '../data/blog'

const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
}

export default function Blog() {
  return (
    <motion.main variants={page} initial="initial" animate="animate" exit="exit">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Blog</h1>
        <p className="text-sm text-muted mb-12">技術的なメモや調査ログ。</p>

        <ul className="divide-y divide-border">
          {blogPosts.map((post) => (
            <li key={post.slug}>
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
            </li>
          ))}
        </ul>
      </div>
    </motion.main>
  )
}
