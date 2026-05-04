import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { works } from '../data/works'

const appWorks = works.filter((w) => w.category === 'game')

const gradients: Record<string, { bg: string; accent: string; glow: string }> = {
  blue: {
    bg: 'from-[#0a0f1e] via-[#0d1a3a] to-[#0a0f1e]',
    accent: 'from-blue-500 to-indigo-600',
    glow: 'shadow-blue-500/30',
  },
  green: {
    bg: 'from-[#021a0a] via-[#062b10] to-[#021a0a]',
    accent: 'from-emerald-500 to-green-600',
    glow: 'shadow-emerald-500/30',
  },
  violet: {
    bg: 'from-[#0f0a1e] via-[#1a0d38] to-[#0f0a1e]',
    accent: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/30',
  },
  amber: {
    bg: 'from-[#1a1000] via-[#2b1a00] to-[#1a1000]',
    accent: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/30',
  },
}

const defaultGradient = gradients.blue

const page = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
}

export default function Apps() {
  return (
    <motion.main variants={page} initial="initial" animate="animate" exit="exit">
      {/* Page hero */}
      <section className="bg-[#06080f] px-6 py-20 text-center">
        <motion.p
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-mono text-xs text-blue-400 uppercase tracking-widest mb-4"
        >
          Apps
        </motion.p>
        <motion.h1
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4"
        >
          Play Smarter.
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.18 }}
          className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed"
        >
          アルゴリズムとハードウェアで、ゲームの可能性を広げるプロジェクト群。
        </motion.p>
      </section>

      {/* Works */}
      {appWorks.map((work, i) => {
        const g = gradients[work.color] ?? defaultGradient
        const isEven = i % 2 === 0

        return (
          <section
            key={work.id}
            className={`bg-gradient-to-b ${g.bg} py-24 px-6`}
          >
            <div className="max-w-5xl mx-auto">
              <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
                {/* Visual block */}
                <motion.div
                  variants={fadeUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6 }}
                  className="flex-shrink-0 w-full max-w-xs lg:max-w-sm"
                >
                  <div className={`relative rounded-3xl bg-gradient-to-br ${g.accent} p-px shadow-2xl ${g.glow}`}>
                    <div className="rounded-3xl bg-black/60 backdrop-blur-xl px-10 py-16 flex flex-col items-center justify-center gap-4 min-h-[280px]">
                      <div className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br ${g.accent} leading-none`}>
                        {work.title.slice(0, 1)}
                      </div>
                      <p className={`font-mono text-xs text-transparent bg-clip-text bg-gradient-to-r ${g.accent} text-center`}>
                        {work.tags.join(' · ')}
                      </p>
                      <span className="font-mono text-[10px] text-gray-500">{work.year}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Text */}
                <motion.div
                  variants={fadeUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex-1"
                >
                  {work.badge && (
                    <span className={`inline-block font-mono text-xs px-3 py-1 rounded-full mb-4 bg-gradient-to-r ${g.accent} text-white`}>
                      {work.badgeLabel ?? work.badge}
                    </span>
                  )}
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
                    {work.title}
                  </h2>
                  {work.catchphrase && (
                    <p className={`text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r ${g.accent} mb-6`}>
                      {work.catchphrase}
                    </p>
                  )}
                  <p className="text-gray-400 leading-relaxed mb-8">
                    {work.shortDesc}
                  </p>

                  {work.features && (
                    <ul className="space-y-3 mb-10">
                      {work.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-gray-300 text-sm">
                          <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br ${g.accent} flex items-center justify-center`}>
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                              <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {work.appStoreUrl && (
                      <a
                        href={work.appStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${g.accent} text-white text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity`}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        App Store
                      </a>
                    )}
                    {work.githubUrl && (
                      <a
                        href={work.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                        GitHub
                      </a>
                    )}
                    <Link
                      to={`/works/${work.id}`}
                      className="inline-flex items-center gap-1 px-6 py-3 rounded-xl border border-white/10 text-gray-400 text-sm font-medium hover:text-white hover:border-white/30 transition-colors"
                    >
                      詳細を見る
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                        <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )
      })}

      {/* Footer CTA */}
      <section className="bg-[#06080f] px-6 py-20 text-center border-t border-white/5">
        <p className="text-gray-500 text-sm mb-2">その他の作品はこちら</p>
        <Link
          to="/works"
          className="inline-flex items-center gap-2 text-white font-medium hover:text-blue-400 transition-colors"
        >
          All Works を見る
          <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>
    </motion.main>
  )
}
