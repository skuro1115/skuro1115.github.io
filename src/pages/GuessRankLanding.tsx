import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { works } from '../data/works'

const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
}

const sectionContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const sectionItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

const SCREENSHOTS = [
  { src: '/sanrentann/screenshots/setup.png', caption: 'プレイヤー設定' },
  { src: '/sanrentann/screenshots/topic.png', caption: 'お題表示' },
  { src: '/sanrentann/screenshots/guess.png', caption: '順位を予想' },
  { src: '/sanrentann/screenshots/results.png', caption: '結果発表' },
  { src: '/sanrentann/screenshots/analysis.png', caption: '理解度ランキング' },
]

const FLOW = [
  { step: '01', title: 'お題が表示', body: 'ターゲット・質問・3つの選択肢を全員で確認。' },
  { step: '02', title: 'ターゲットが順位を決定', body: '自分の好みの1位・2位・3位を入力。' },
  { step: '03', title: '他プレイヤーが予想', body: '端末を回しながら、ターゲットの順位を当てに行く。' },
  { step: '04', title: '結果発表', body: '完全一致は100点。スコアを積み重ねて最終順位を決定。' },
]

const SCORING = [
  { label: '完全一致（三連単）', score: '100', note: '1位・2位・3位すべて的中' },
  { label: '2つ一致', score: '50', note: '3つ中2つの順位が合っている' },
  { label: '1つ一致', score: '20', note: '3つ中1つの順位が合っている' },
  { label: '不一致', score: '0', note: 'すべて外れ' },
]

const SCENES = [
  {
    emoji: '🍻',
    title: '飲み会・ホームパーティーで',
    body: 'ルール説明30秒、すぐ盛り上がる。会話のきっかけにも。',
  },
  {
    emoji: '🎓',
    title: '学生の集まりで',
    body: '友達の意外な一面が見える。「え、そっちが1位なの！？」',
  },
  {
    emoji: '👨‍👩‍👧',
    title: '家族・カップルで',
    body: '相手の好みをどれだけ知っているか、スコアで可視化。',
  },
]

export default function GuessRankLanding() {
  const work = works.find((w) => w.id === 'guess-rank')
  if (!work) return null

  return (
    <motion.main variants={page} initial="initial" animate="animate" exit="exit">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF8F0] via-[#FFEFD5] to-[#FFE4E1]">
        <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FF8C00] blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#FF6B8A] blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 pt-12 pb-20">
          <Link to="/" className="font-mono text-xs text-subtle hover:text-accent">
            ← Back to Apps
          </Link>

          <div className="flex flex-col items-center text-center mt-12">
            <img
              src="/sanrentann/icon.png"
              alt="GuessRank app icon"
              width={96}
              height={96}
              className="w-24 h-24 rounded-[22%] shadow-lg ring-1 ring-black/5 mb-6"
            />

            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-[#FF8C00] via-[#FFD700] to-[#FF6B8A] bg-clip-text text-transparent">
              {work.title}
            </h1>
            <p className="font-mono text-sm text-[#6B7280] mt-3">
              三連単（さんれんたん）
            </p>

            {work.catchphrase && (
              <p className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mt-8">
                {work.catchphrase}
              </p>
            )}
            <p className="text-base text-[#6B7280] mt-3 max-w-xl">
              お題に対する友達のTop3を予想するパーティーゲーム。<br />
              競馬の三連単のように、順番まで完全に当てると100点。
            </p>

            <div className="flex flex-wrap gap-3 justify-center mt-8">
              {work.appStoreUrl ? (
                <a
                  href={work.appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#FF8C00] to-[#FFB347] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  App Store で見る
                </a>
              ) : (
                <span className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#FF8C00] to-[#FFB347] text-white text-sm font-semibold opacity-80 cursor-default">
                  App Store（準備中）
                </span>
              )}
              {work.githubUrl && (
                <a
                  href={work.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg border border-[#1A1A1A]/15 bg-white/60 backdrop-blur text-sm font-semibold text-[#1A1A1A] hover:bg-white transition-colors"
                >
                  GitHub
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-white/70 border border-[#1A1A1A]/10 text-xs font-mono text-[#6B7280]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#FFF8F0]">
        <div className="max-w-5xl mx-auto px-6 py-20 space-y-24">
          {/* ゲームの流れ */}
          <motion.section
            variants={sectionContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.h2
              variants={sectionItem}
              className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] text-center mb-12"
            >
              ゲームの流れ
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FLOW.map((f) => (
                <motion.div
                  key={f.step}
                  variants={sectionItem}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-[#1A1A1A]/5"
                >
                  <div className="font-mono text-xs text-[#FF8C00] font-bold mb-2">
                    STEP {f.step}
                  </div>
                  <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{f.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* スクリーンショット */}
          <motion.section
            variants={sectionContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.h2
              variants={sectionItem}
              className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] text-center mb-12"
            >
              スクリーンショット
            </motion.h2>
            <motion.div
              variants={sectionItem}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-thin"
            >
              {SCREENSHOTS.map((s) => (
                <figure
                  key={s.src}
                  className="snap-center shrink-0 w-[220px] sm:w-[260px]"
                >
                  <img
                    src={s.src}
                    alt={s.caption}
                    loading="lazy"
                    className="w-full aspect-[1206/2622] object-cover rounded-2xl shadow-lg border border-[#1A1A1A]/10 bg-white"
                  />
                  <figcaption className="text-xs text-[#6B7280] text-center mt-3 font-medium">
                    {s.caption}
                  </figcaption>
                </figure>
              ))}
            </motion.div>
          </motion.section>

          {/* 主な特徴 */}
          {work.features && work.features.length > 0 && (
            <motion.section
              variants={sectionContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
            >
              <motion.h2
                variants={sectionItem}
                className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] text-center mb-12"
              >
                主な特徴
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {work.features.map((f, i) => (
                  <motion.div
                    key={f}
                    variants={sectionItem}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-[#1A1A1A]/5 flex gap-4"
                  >
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF8C00] to-[#FFB347] text-white text-sm font-bold flex items-center justify-center">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <p className="text-sm text-[#1A1A1A] leading-relaxed pt-1">
                      {f}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* スコアリング */}
          <motion.section
            variants={sectionContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.h2
              variants={sectionItem}
              className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] text-center mb-3"
            >
              スコアリング
            </motion.h2>
            <motion.p
              variants={sectionItem}
              className="text-sm text-[#6B7280] text-center mb-10"
            >
              各ターンで予想者全員がスコアを獲得。合計で最終順位を決定する。
            </motion.p>
            <motion.div
              variants={sectionItem}
              className="bg-white rounded-2xl border border-[#1A1A1A]/5 overflow-hidden"
            >
              {SCORING.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex items-center justify-between px-6 py-4 ${
                    i !== SCORING.length - 1 ? 'border-b border-[#1A1A1A]/5' : ''
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold text-[#1A1A1A]">
                      {s.label}
                    </div>
                    <div className="text-xs text-[#6B7280] mt-0.5">{s.note}</div>
                  </div>
                  <div className="font-mono text-2xl font-bold text-[#F59E0B] tabular-nums">
                    {s.score}
                    <span className="text-xs text-[#6B7280] ml-1 font-medium">
                      点
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.section>

          {/* こんな場面で */}
          <motion.section
            variants={sectionContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.h2
              variants={sectionItem}
              className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] text-center mb-12"
            >
              こんな場面で
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SCENES.map((s) => (
                <motion.div
                  key={s.title}
                  variants={sectionItem}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-[#1A1A1A]/5"
                >
                  <div className="text-3xl mb-3">{s.emoji}</div>
                  <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{s.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Footer CTA */}
          <motion.section
            variants={sectionContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center pt-8 border-t border-[#1A1A1A]/5"
          >
            <motion.h2
              variants={sectionItem}
              className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3"
            >
              友達の本音、当てに行こう。
            </motion.h2>
            <motion.p
              variants={sectionItem}
              className="text-sm text-[#6B7280] mb-8"
            >
              2〜6人 / 1台のスマホ / アカウント不要 / 1ゲーム約10〜15分
            </motion.p>
            <motion.div
              variants={sectionItem}
              className="flex flex-wrap gap-3 justify-center"
            >
              {work.appStoreUrl ? (
                <a
                  href={work.appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#FF8C00] to-[#FFB347] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  App Store で見る
                </a>
              ) : (
                <span className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#FF8C00] to-[#FFB347] text-white text-sm font-semibold opacity-80 cursor-default">
                  App Store（準備中）
                </span>
              )}
              {work.githubUrl && (
                <a
                  href={work.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg border border-[#1A1A1A]/15 bg-white text-sm font-semibold text-[#1A1A1A] hover:border-[#1A1A1A]/30 transition-colors"
                >
                  GitHub
                </a>
              )}
            </motion.div>
          </motion.section>
        </div>
      </div>
    </motion.main>
  )
}
