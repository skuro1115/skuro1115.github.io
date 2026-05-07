import { useState } from 'react'
import { Link } from 'react-router-dom'
import { works } from '../data/works'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const APP_STORE_URL = 'https://apps.apple.com/jp/app/guessrank/id6763001964'
const GITHUB_URL = 'https://github.com/skuro1115/GuessRank-GameCore-iOS'

const BRAND = {
  primary: '#FF8C00',
  primaryDark: '#E07900',
  primaryLight: '#FFB347',
  highlight: '#FF6B8A',
  gold: '#F59E0B',
  cream: '#FFF8F0',
  ink: '#1A1A1A',
  inkSoft: '#6B7280',
  dark: '#13131f',
}

function PhoneMockup({
  src,
  alt,
  className = '',
  rotate = 0,
  tilt = 0,
  shadowColor = 'rgba(0,0,0,0.35)',
}: {
  src: string
  alt: string
  className?: string
  rotate?: number
  tilt?: number
  shadowColor?: string
}) {
  const transform = `perspective(1400px) rotateY(${tilt}deg) rotate(${rotate}deg)`
  return (
    <div
      className={`relative ${className}`}
      style={{
        transform,
        filter: `drop-shadow(0 30px 60px ${shadowColor})`,
      }}
    >
      <div className="relative rounded-[2.8rem] bg-[#0a0a0a] p-[5px] ring-1 ring-black/60">
        <div className="rounded-[2.4rem] overflow-hidden bg-black">
          <img src={src} alt={alt} className="block w-full" loading="lazy" />
        </div>
      </div>
    </div>
  )
}

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [
    { href: '#experience', label: '体験' },
    { href: '#how-to-play', label: '遊び方' },
    { href: '#features', label: '特徴' },
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
      style={{ background: `${BRAND.primary}f2` }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            to="/"
            className="flex items-center gap-1 text-white/80 hover:text-white text-xs font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M11 7H3M7 3L3 7l4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden sm:inline">Apps</span>
          </Link>
          <a href="#hero" className="flex items-center gap-2 text-white font-bold text-lg">
            <img
              src="/guess-rank/icon.png"
              alt=""
              className="w-7 h-7 rounded-md"
              aria-hidden="true"
            />
            GuessRank
          </a>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/90 hover:text-white text-sm transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#download"
            className="px-5 py-2 bg-white rounded-full text-sm font-bold hover:bg-white/90 transition-colors"
            style={{ color: BRAND.primaryDark }}
          >
            ダウンロード
          </a>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2"
          aria-label="メニュー"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div
          className="md:hidden border-t border-white/20 px-4 py-4 space-y-3"
          style={{ background: BRAND.primary }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block text-white/90 hover:text-white text-sm"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block text-white/90 hover:text-white text-sm"
          >
            ← 他のアプリを見る
          </Link>
          <a
            href="#download"
            onClick={() => setMenuOpen(false)}
            className="block text-center px-5 py-2 bg-white rounded-full text-sm font-bold"
            style={{ color: BRAND.primaryDark }}
          >
            ダウンロード
          </a>
        </div>
      )}
    </nav>
  )
}

function HeroSection({ work }: { work: { title: string; tags: string[]; catchphrase?: string } }) {
  return (
    <section
      id="hero"
      className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${BRAND.primaryLight} 0%, ${BRAND.primary} 50%, ${BRAND.highlight} 100%)`,
      }}
    >
      <div
        className="absolute top-0 right-0 w-[60%] h-[60%] blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)',
        }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-8">
          <div className="flex-1 text-center md:text-left z-10">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-6">
              <img
                src="/guess-rank/icon.png"
                alt={`${work.title} アイコン`}
                className="w-14 h-14 rounded-2xl shadow-md ring-1 ring-black/10"
              />
              <span className="text-white/90 font-mono text-sm tracking-wide">
                {work.title}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
              {work.catchphrase ?? '友達の本音、当てられる？'}
            </h1>
            <p className="text-white/85 text-base sm:text-lg mb-10">
              お題に対する友達のTop3を予想する、1台で遊べるパーティーゲーム。
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-10">
              {APP_STORE_URL ? (
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="app-store"
                  data-track-app="guess-rank"
                  data-track-source="hero"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white rounded-full font-bold text-sm hover:bg-white/95 hover:-translate-y-0.5 transition-all shadow-lg"
                  style={{ color: BRAND.primaryDark }}
                >
                  <AppleIcon />
                  App Store
                </a>
              ) : (
                <span
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/95 rounded-full font-bold text-sm shadow-lg cursor-default"
                  style={{ color: BRAND.primaryDark }}
                >
                  <AppleIcon />
                  App Store（準備中）
                </span>
              )}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-track="github"
                data-track-app="guess-rank"
                data-track-source="hero"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/15 text-white rounded-full font-bold text-sm hover:bg-white/25 transition-all border border-white/40 backdrop-blur-sm"
              >
                <GithubIcon />
                GitHub
              </a>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {[
                { icon: '📵', text: '通信不要' },
                { icon: '🔒', text: '覗き見防止' },
                { icon: '👥', text: '2〜6人' },
                { icon: '⚡', text: 'DLしてすぐ' },
              ].map((badge) => (
                <span
                  key={badge.text}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs border border-white/20"
                >
                  <span>{badge.icon}</span>
                  <span className="font-medium">{badge.text}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 w-64 sm:w-72 md:w-80 lg:w-96">
            <PhoneMockup
              src="/guess-rank/screenshots/topic.png"
              alt="GuessRank お題画面"
              rotate={8}
              tilt={-14}
              shadowColor="rgba(120,40,0,0.45)"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function ProblemSection() {
  const problems = [
    { emoji: '😶', text: '飲み会で話のネタが切れる' },
    { emoji: '🤔', text: '友達の意外な一面が知りたい' },
    { emoji: '😅', text: '準備が大変なゲームは敬遠する' },
    { emoji: '📱', text: 'アカウント登録のあるアプリは面倒' },
  ]

  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: BRAND.dark }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] blur-3xl rounded-full pointer-events-none"
        style={{ background: `${BRAND.primary}1a` }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center mb-14 tracking-tight">
          みんなの夜、こんなことない？
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {problems.map((p) => (
            <div
              key={p.text}
              className="bg-white/[0.06] backdrop-blur-sm rounded-2xl p-6 md:p-8 text-center border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all"
            >
              <div className="text-4xl mb-4">{p.emoji}</div>
              <p className="text-white/85 text-sm leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <p className="inline-block text-xl sm:text-2xl font-bold text-white relative">
            全部、これ
            <span style={{ color: BRAND.primaryLight }}>1つ</span>
            で解決する。
            <span
              className="absolute left-0 right-0 -bottom-2 h-[3px]"
              style={{
                background: `linear-gradient(to right, transparent, ${BRAND.primary}, transparent)`,
              }}
            />
          </p>
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({
  badge,
  badgeColor,
  title,
  description,
  imageSrc,
  imageAlt,
  reverse,
  bgColor,
  rotate,
  tilt,
}: {
  badge: string
  badgeColor: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  reverse?: boolean
  bgColor: string
  rotate: number
  tilt: number
}) {
  return (
    <div className="py-16 md:py-24 relative overflow-hidden" style={{ background: bgColor }}>
      <div
        className={`max-w-6xl mx-auto px-4 sm:px-6 flex flex-col ${
          reverse ? 'md:flex-row-reverse' : 'md:flex-row'
        } items-center gap-12 md:gap-20`}
      >
        <div className="flex-shrink-0 w-56 sm:w-64 md:w-72">
          <PhoneMockup
            src={imageSrc}
            alt={imageAlt}
            rotate={rotate}
            tilt={tilt}
            shadowColor="rgba(0,0,0,0.25)"
          />
        </div>
        <div className="flex-1 text-center md:text-left max-w-xl">
          <span
            className="inline-block px-4 py-1.5 text-white text-xs font-bold rounded-full mb-5"
            style={{ background: badgeColor }}
          >
            {badge}
          </span>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5 tracking-tight leading-tight whitespace-pre-line text-gray-900">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed text-base">{description}</p>
        </div>
      </div>
    </div>
  )
}

function ExperienceSection() {
  return (
    <section id="experience">
      <ExperienceCard
        badge="STEP 1 ― 順位を予想する"
        badgeColor={BRAND.primary}
        title="友達の好みを、読み解け"
        description="ターゲットが決めた1位・2位・3位を、他のプレイヤーが順番ごと予想する。覗き見防止つきで、端末を回しても他の人の回答は見えない。"
        imageSrc="/guess-rank/screenshots/guess.png"
        imageAlt="順位予想画面"
        bgColor="linear-gradient(180deg, #fff8f0 0%, #ffffff 100%)"
        rotate={-6}
        tilt={12}
      />
      <ExperienceCard
        badge="STEP 2 ― 結果発表"
        badgeColor={BRAND.gold}
        title={'完全一致なら、\n100点。'}
        description="3つすべて的中で100点、2つ一致で50点、1つ一致で20点。「え、そっちが1位なの！？」という驚きと会話が、自然に生まれる。"
        imageSrc="/guess-rank/screenshots/results.png"
        imageAlt="ゲーム結果画面"
        reverse
        bgColor="linear-gradient(180deg, #fffaf0 0%, #fff4e1 100%)"
        rotate={6}
        tilt={-12}
      />
      <ExperienceCard
        badge="STEP 3 ― 分析"
        badgeColor={BRAND.highlight}
        title="誰が一番、友達を知ってる？"
        description="相互理解度マトリクスで、誰がどれだけ友達を理解しているかが一目でわかる。気が合うコンビ、読まれやすい人もデータで可視化。"
        imageSrc="/guess-rank/screenshots/analysis.png"
        imageAlt="分析画面"
        bgColor="linear-gradient(180deg, #fff1f5 0%, #fde4ec 100%)"
        rotate={-6}
        tilt={12}
      />
    </section>
  )
}

function HowToPlaySection() {
  const steps = [
    { num: 1, title: '人数とお題を決める', desc: '2〜6人。食べ物・趣味・ランダムから自動出題' },
    { num: 2, title: 'ターゲットが順位を決定', desc: '自分の好みの1位・2位・3位を入力' },
    { num: 3, title: '端末を回して予想', desc: '覗き見防止つきで、他の人の回答は見えない' },
    { num: 4, title: '結果発表 & 得点', desc: '完全一致なら100点。スコアで友達理解度が見える' },
  ]

  return (
    <section
      id="how-to-play"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${BRAND.dark} 0%, #1a1a28 50%, ${BRAND.dark} 100%)`,
      }}
    >
      <div
        className="absolute top-1/2 left-[10%] w-[400px] h-[400px] blur-3xl rounded-full pointer-events-none"
        style={{ background: `${BRAND.primary}14` }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center mb-16 tracking-tight">
          準備ゼロ。
          <span style={{ color: BRAND.primaryLight }}>30</span>
          秒で始まる。
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="flex-shrink-0 w-56 sm:w-64 md:w-72">
            <PhoneMockup
              src="/guess-rank/screenshots/setup.png"
              alt="ゲーム設定画面"
              rotate={-5}
              tilt={10}
              shadowColor="rgba(255,140,0,0.3)"
            />
          </div>
          <div className="flex-1 space-y-6 max-w-lg">
            {steps.map((step) => (
              <div key={step.num} className="flex items-start gap-5 group">
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                  style={{
                    background: BRAND.primary,
                    boxShadow: `0 10px 25px ${BRAND.primary}4d`,
                  }}
                >
                  <span className="text-white font-black">{step.num}</span>
                </div>
                <div className="pt-1">
                  <h3 className="text-white font-bold text-lg mb-1">{step.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    { icon: '📵', title: '完全オフライン', desc: '通信不要、圏外でもOK' },
    { icon: '🔒', title: '覗き見防止', desc: 'カバーオーバーレイで安心' },
    { icon: '⚡', title: '即プレイ', desc: 'アカウント不要、DLしてすぐ' },
    { icon: '🎲', title: '自動出題', desc: '内蔵プールから自動選出' },
    { icon: '🔄', title: 'お題スキップ', desc: '何度でも変更可能、回数制限なし' },
    { icon: '🏆', title: '理解度ランキング', desc: '誰が友達を一番知ってるかが見える' },
  ]

  return (
    <section
      id="features"
      className="py-20 md:py-28"
      style={{
        background: `linear-gradient(180deg, #ffffff 0%, ${BRAND.cream} 50%, #ffffff 100%)`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start gap-12 md:gap-16">
          <div className="flex-1 w-full">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-12 tracking-tight">
              こだわり、
              <br className="sm:hidden" />
              つまってる。
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-1.5">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 w-52 sm:w-60 md:w-64 hidden md:block md:sticky md:top-24">
            <PhoneMockup
              src="/guess-rank/screenshots/analysis.png"
              alt="分析画面"
              rotate={4}
              tilt={-8}
              shadowColor="rgba(255,140,0,0.25)"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section
      id="download"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${BRAND.primaryLight} 0%, ${BRAND.primary} 50%, ${BRAND.highlight} 100%)`,
      }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.18), transparent 70%)' }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 tracking-tight leading-tight">
          今夜、友達の本音を
          <br className="sm:hidden" />
          当てに行こう。
        </h2>
        <p className="text-white/85 mb-10">無料・通信不要・アカウント登録なし</p>
        <div className="flex flex-wrap justify-center gap-4">
          {APP_STORE_URL ? (
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-track="app-store"
              data-track-app="guess-rank"
              data-track-source="cta"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-sm hover:-translate-y-0.5 hover:shadow-xl transition-all shadow-lg"
            >
              <AppleIcon />
              App Store
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 px-8 py-4 bg-white/95 text-gray-900 rounded-full font-bold text-sm shadow-lg cursor-default">
              <AppleIcon />
              App Store（準備中）
            </span>
          )}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-track="github"
            data-track-app="guess-rank"
            data-track-source="cta"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 text-white rounded-full font-bold text-sm hover:bg-white/25 transition-all border border-white/40 backdrop-blur-sm"
          >
            <GithubIcon />
            GitHub
          </a>
        </div>
      </div>
    </section>
  )
}

function OtherAppsSection({ currentId }: { currentId: string }) {
  const others = works.filter((w) => w.showInApps && w.id !== currentId)
  if (others.length === 0) return null

  return (
    <section
      className="py-16 md:py-20"
      style={{
        background: `linear-gradient(180deg, #ffffff 0%, ${BRAND.cream} 100%)`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-mono text-gray-500 mb-1.5">MORE FROM SKURO</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              他のアプリも見てみる
            </h2>
          </div>
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
            style={{ color: BRAND.primaryDark }}
          >
            Apps 一覧へ
            <svg className="w-4 h-4" fill="none" viewBox="0 0 14 14">
              <path
                d="M3 7h8M7 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {others.map((w) => {
            const isExternal = !!w.externalUrl
            const target = w.externalUrl ?? `/apps/${w.id}`
            const cardBody = (
              <>
                <div className="flex items-start gap-4">
                  {w.iconUrl ? (
                    <img
                      src={w.iconUrl}
                      alt=""
                      className="w-14 h-14 rounded-xl shadow-sm ring-1 ring-black/5 flex-shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                      style={{ background: BRAND.primary }}
                    >
                      {w.title.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 truncate">{w.title}</h3>
                      {isExternal && (
                        <svg
                          className="w-3 h-3 text-gray-400 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 14 14"
                          aria-hidden="true"
                        >
                          <path
                            d="M5 3h6v6M11 3L4 10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {w.shortDesc}
                    </p>
                  </div>
                </div>
              </>
            )
            const baseClass =
              'block bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all'
            return isExternal ? (
              <a
                key={w.id}
                href={target}
                target="_blank"
                rel="noopener noreferrer"
                data-track="external-lp"
                data-track-app={w.id}
                data-track-source="other-apps"
                className={baseClass}
              >
                {cardBody}
              </a>
            ) : (
              <Link
                key={w.id}
                to={target}
                data-track="view-product"
                data-track-app={w.id}
                data-track-source="other-apps"
                className={baseClass}
              >
                {cardBody}
              </Link>
            )
          })}
        </div>

        <div className="mt-8 sm:hidden text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-colors"
            style={{ color: BRAND.primaryDark, borderColor: BRAND.primary }}
          >
            Apps 一覧へ
            <svg className="w-4 h-4" fill="none" viewBox="0 0 14 14">
              <path
                d="M3 7h8M7 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

function LandingFooter() {
  return (
    <footer className="bg-[#0f0f17] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <span className="text-gray-300 font-bold">GuessRank</span>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
          <span className="text-gray-500 text-sm">&copy; 2026 GuessRank</span>
        </div>
      </div>
    </footer>
  )
}

function AppleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.35.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.17a10.96 10.96 0 0 1 5.76 0c2.2-1.48 3.16-1.17 3.16-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.37-5.25 5.65.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  )
}

export default function GuessRankLanding() {
  const work = works.find((w) => w.id === 'guess-rank')

  useDocumentMeta({
    title: 'GuessRank — 友達のTop3を当てるパーティーゲーム',
    description: '友達の「好み」のTop3を予想するパーティーゲーム。1台のスマホで遊べる、ルール30秒、登録不要。',
    image: work?.iconUrl,
  })

  if (!work) return null

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <HeroSection work={work} />
      <ProblemSection />
      <ExperienceSection />
      <HowToPlaySection />
      <FeaturesSection />
      <CTASection />
      <OtherAppsSection currentId={work.id} />
      <LandingFooter />
      <div className="bg-[#0f0f17] border-t border-gray-800/60 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
          >
            ← skuro Apps トップへ戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
