import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogPosts } from '../data/blog'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)

  useDocumentMeta({
    title: post?.title ?? 'Blog',
    description: post?.excerpt,
    type: 'article',
  })

  if (!post) {
    return (
      <motion.main variants={page} initial="initial" animate="animate" exit="exit">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <p className="text-muted">記事が見つかりませんでした。</p>
          <Link to="/blog" className="text-accent text-sm mt-4 inline-block">← Blog</Link>
        </div>
      </motion.main>
    )
  }

  return (
    <motion.main variants={page} initial="initial" animate="animate" exit="exit">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link to="/blog" className="font-mono text-sm text-muted hover:text-gray-900 transition-colors">
          ← blog
        </Link>

        <div className="mt-8 mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs text-subtle">{post.date}</span>
            {post.tags.map((tag) => (
              <span key={tag} className="font-mono text-xs text-subtle bg-surface px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">{post.title}</h1>
        </div>

        <article className="text-gray-700 leading-relaxed space-y-4 whitespace-pre-line">
          {post.body}
        </article>
      </div>
    </motion.main>
  )
}
