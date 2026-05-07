import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { works } from '../data/works'
import { blogPosts } from '../data/blog'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { AppIcon } from '../components/AppIcon'

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

type Theme = {
  hero: string
  iconFallback: string
  accent: string
  chip: string
}

const themes: Record<string, Theme> = {
  blue: {
    hero: 'from-blue-50 via-indigo-50 to-white',
    iconFallback: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    accent: 'text-blue-700',
    chip: 'bg-blue-50 text-blue-700 border-blue-100',
  },
  green: {
    hero: 'from-emerald-50 via-green-50 to-white',
    iconFallback: 'bg-gradient-to-br from-emerald-500 to-green-600',
    accent: 'text-emerald-700',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  emerald: {
    hero: 'from-emerald-50 via-teal-50 to-white',
    iconFallback: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    accent: 'text-emerald-700',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  violet: {
    hero: 'from-violet-50 via-purple-50 to-white',
    iconFallback: 'bg-gradient-to-br from-violet-500 to-purple-600',
    accent: 'text-violet-700',
    chip: 'bg-violet-50 text-violet-700 border-violet-100',
  },
  amber: {
    hero: 'from-amber-50 via-orange-50 to-white',
    iconFallback: 'bg-gradient-to-br from-amber-500 to-orange-600',
    accent: 'text-amber-700',
    chip: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  lime: {
    hero: 'from-lime-50 via-green-50 to-white',
    iconFallback: 'bg-gradient-to-br from-lime-500 to-green-600',
    accent: 'text-lime-700',
    chip: 'bg-lime-50 text-lime-700 border-lime-100',
  },
}

const defaultTheme = themes.blue

export default function WorkDetail() {
  const { id } = useParams<{ id: string }>()
  const work = works.find((w) => w.id === id)
  const relatedPosts = work?.relatedPostSlugs
    ? blogPosts.filter((p) => work.relatedPostSlugs!.includes(p.slug))
    : []

  useDocumentMeta({
    title: work?.title ?? 'Works',
    description: work?.shortDesc,
    image: work?.iconUrl,
    type: 'article',
  })

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

  const theme = themes[work.color] ?? defaultTheme
  const paragraphs = work.longDesc.split('\n\n')

  return (
    <motion.main variants={page} initial="initial" animate="animate" exit="exit">
      <section className={`bg-gradient-to-br ${theme.hero} border-b border-border`}>
        <div className="max-w-3xl mx-auto px-6 pt-10 pb-14">
          <Link
            to="/works"
            className="font-mono text-sm text-muted hover:text-gray-900 transition-colors"
          >
            ← back
          </Link>

          <div className="mt-8 flex items-start gap-5">
            <AppIcon
              src={work.iconUrl}
              title={work.title}
              alt={`${work.title} アイコン`}
              className="w-20 h-20 rounded-2xl shadow-md ring-1 ring-black/5 flex-shrink-0"
              fallbackClassName={theme.iconFallback}
              fallbackTextClassName="text-3xl font-black text-white"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-xs text-subtle">{work.year}</span>
                {work.badge && (
                  <span
                    className={`font-mono text-xs px-2 py-0.5 rounded-full ${badgeStyle[work.badge]}`}
                  >
                    {work.badgeLabel ?? work.badge}
                  </span>
                )}
                {work.category && (
                  <span className="font-mono text-xs text-subtle">·  {work.category}</span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                {work.title}
              </h1>
              {work.catchphrase && (
                <p className={`text-base sm:text-lg font-medium ${theme.accent}`}>
                  {work.catchphrase}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-6">
            {work.tags.map((tag) => (
              <span
                key={tag}
                className={`font-mono text-xs px-2.5 py-1 rounded-md border ${theme.chip}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-14">
        <section>
          <h2 className="font-mono text-xs text-subtle uppercase tracking-widest mb-4">
            About
          </h2>
          <div className="space-y-4">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="text-gray-700 leading-relaxed whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {work.features && work.features.length > 0 && (
          <section className="mt-12">
            <h2 className="font-mono text-xs text-subtle uppercase tracking-widest mb-4">
              Features
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {work.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border"
                >
                  <span
                    className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${theme.iconFallback}`}
                    aria-hidden="true"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                      <path
                        d="M2.5 6.5l2.5 2.5 4.5-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {work.techDetails && (
          <section className="mt-12">
            <h2 className="font-mono text-xs text-subtle uppercase tracking-widest mb-4">
              Tech Notes
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {work.techDetails}
            </p>
          </section>
        )}

        <section className="mt-12 flex flex-wrap gap-3">
          {work.appStoreUrl && (
            <a
              href={work.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track="app-store"
              data-track-app={work.id}
              data-track-source="work-detail"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              App Store で見る
            </a>
          )}
          {work.externalUrl && (
            <a
              href={work.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-track="external-lp"
              data-track-app={work.id}
              data-track-source="work-detail"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-sm font-medium rounded-lg hover:border-gray-300 hover:bg-surface transition-colors"
            >
              プロダクトページ
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" aria-hidden="true">
                <path
                  d="M5 3h6v6M11 3L4 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
          {work.hasLanding && !work.externalUrl && (
            <Link
              to={`/apps/${work.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-sm font-medium rounded-lg hover:border-gray-300 hover:bg-surface transition-colors"
            >
              プロダクトページ
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" aria-hidden="true">
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
          {work.githubUrl && (
            <a
              href={work.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-sm font-medium rounded-lg hover:border-gray-300 hover:bg-surface transition-colors"
            >
              GitHub
            </a>
          )}
        </section>

        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-border">
            <h2 className="font-mono text-xs text-subtle uppercase tracking-widest mb-4">
              Related Posts
            </h2>
            <ul className="divide-y divide-border">
              {relatedPosts.map((post) => (
                <li key={post.slug}>
                  <Link to={`/blog/${post.slug}`} className="group block py-4">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-xs text-subtle">{post.date}</span>
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-accent transition-colors mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted">{post.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </motion.main>
  )
}
