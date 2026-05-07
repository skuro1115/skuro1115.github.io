import { useState } from 'react'
import { Link } from 'react-router-dom'
import { works } from '../data/works'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const BRAND = {
  primary: '#0F4C3A',
  primaryDark: '#0A3528',
  primaryLight: '#1A6347',
  gold: '#D4A437',
  goldLight: '#F4C430',
  ink: '#0F1419',
  inkSoft: '#4B5563',
  cream: '#F8F6EE',
  surface: '#0E1A15',
}

const APP_STORE_URL =
  'https://apps.apple.com/jp/app/麻雀ai-配牌チェッカー/id1637036872'

function Tile({
  label,
  className = '',
  rotate = 0,
  variant = 'man',
}: {
  label: string
  className?: string
  rotate?: number
  variant?: 'man' | 'pin' | 'sou' | 'honor'
}) {
  const variantColor: Record<string, string> = {
    man: '#B91C1C',
    pin: '#1E40AF',
    sou: '#15803D',
    honor: '#1F2937',
  }
  return (
    <div
      className={`relative inline-flex items-center justify-center font-serif font-black select-none ${className}`}
      style={{
        background: 'linear-gradient(180deg, #FFFCF2 0%, #F0E8D0 100%)',
        color: variantColor[variant],
        borderRadius: '14%',
        boxShadow:
          '0 1px 0 rgba(0,0,0,0.05) inset, 0 -2px 0 rgba(0,0,0,0.18) inset, 0 8px 18px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.3)',
        transform: `rotate(${rotate}deg)`,
        border: '1px solid #E0D6B8',
      }}
    >
      <span className="leading-none" style={{ fontSize: '0.55em' }}>
        {label}
      </span>
    </div>
  )
}

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [
    { href: '#problem', label: '課題' },
    { href: '#how', label: '使い方' },
    { href: '#tech', label: '技術' },
    { href: '#features', label: '特徴' },
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
      style={{ background: `${BRAND.primary}f0` }}
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
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: BRAND.goldLight }}
              aria-hidden="true"
            />
            麻雀AI
          </a>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-white/85 hover:text-white text-sm transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-track="app-store"
            data-track-app="mahjong-ai"
            className="px-5 py-2 rounded-full text-sm font-bold transition-colors"
            style={{ background: BRAND.goldLight, color: BRAND.primaryDark }}
          >
            App Store
          </a>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2"
          aria-label="メニュー"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div
          className="md:hidden border-t border-white/10 px-4 py-4 space-y-3"
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
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            data-track="app-store"
            data-track-app="mahjong-ai"
            className="block text-center px-5 py-2 rounded-full text-sm font-bold"
            style={{ background: BRAND.goldLight, color: BRAND.primaryDark }}
          >
            App Store
          </a>
        </div>
      )}
    </nav>
  )
}

function HeroSection({
  iconUrl,
  catchphrase,
}: {
  iconUrl?: string
  catchphrase: string
}) {
  return (
    <section
      id="hero"
      className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 60%, ${BRAND.primaryLight} 100%)`,
      }}
    >
      <div
        className="absolute -top-20 -right-20 w-[60%] h-[80%] blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(244,196,48,0.18), transparent 70%)',
        }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left z-10">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-6">
              {iconUrl && (
                <img
                  src={iconUrl}
                  alt="麻雀AI アイコン"
                  className="w-14 h-14 rounded-2xl shadow-lg ring-1 ring-black/10"
                />
              )}
              <span className="text-white/85 font-mono text-sm tracking-wide">
                麻雀AI 配牌チェッカー
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
              {catchphrase}
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-10 max-w-lg mx-auto md:mx-0">
              配牌・手牌を入力するだけで、シャンテン数・有効牌・最適打牌候補をリアルタイムで解析。
              自作探索アルゴリズムで数ミリ秒以内に応答します。
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-10">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-track="app-store"
                data-track-app="mahjong-ai"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm hover:-translate-y-0.5 transition-transform shadow-lg"
                style={{ background: BRAND.goldLight, color: BRAND.primaryDark }}
              >
                <AppleIcon />
                App Store で見る
              </a>
              <a
                href="#tech"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-colors text-white border border-white/40 hover:bg-white/10 backdrop-blur-sm"
              >
                技術メモを読む
              </a>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {[
                { icon: '⚡', text: 'ms単位の応答' },
                { icon: '🧮', text: '自作探索アルゴ' },
                { icon: '📱', text: 'iOS / SwiftUI' },
                { icon: '🟢', text: 'App Store 公開中' },
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
          <div className="flex-shrink-0 w-72 sm:w-80 md:w-96">
            <TileShowcase />
          </div>
        </div>
      </div>
    </section>
  )
}

function TileShowcase() {
  return (
    <div
      className="relative aspect-square rounded-3xl overflow-hidden p-8"
      style={{
        background:
          'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.35)',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute w-3/4 h-3/4 blur-2xl rounded-full"
          style={{ background: `${BRAND.goldLight}33` }}
          aria-hidden="true"
        />
      </div>
      <div className="relative h-full flex flex-col justify-between">
        <div className="flex justify-center gap-2">
          <Tile label="一" variant="man" className="w-12 h-16" rotate={-6} />
          <Tile label="二" variant="man" className="w-12 h-16" rotate={-2} />
          <Tile label="三" variant="man" className="w-12 h-16" rotate={2} />
          <Tile label="四" variant="man" className="w-12 h-16" rotate={6} />
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="font-mono text-[10px] tracking-widest text-white/50">
            ANALYSIS
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(244,196,48,0.12)' }}>
              <div className="font-mono text-[9px] text-white/50">SHANTEN</div>
              <div className="font-black text-2xl" style={{ color: BRAND.goldLight }}>
                2
              </div>
            </div>
            <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="font-mono text-[9px] text-white/50">EFFECTIVE</div>
              <div className="font-black text-2xl text-white">8</div>
            </div>
            <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="font-mono text-[9px] text-white/50">SCORE</div>
              <div className="font-black text-2xl text-white">94</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <Tile label="五" variant="pin" className="w-10 h-14" rotate={4} />
          <Tile label="六" variant="pin" className="w-10 h-14" rotate={-2} />
          <Tile label="七" variant="sou" className="w-10 h-14" rotate={-6} />
          <Tile label="發" variant="sou" className="w-10 h-14" rotate={2} />
          <Tile label="中" variant="man" className="w-10 h-14" rotate={6} />
        </div>
      </div>
    </div>
  )
}

function ProblemSection() {
  const problems = [
    { emoji: '🤔', text: 'シャンテン数の暗算が面倒' },
    { emoji: '🎯', text: '最善の打牌に自信がない' },
    { emoji: '📚', text: '対局後に振り返れない' },
    { emoji: '💻', text: 'PCでの解析は卓上で見られない' },
  ]

  return (
    <section
      id="problem"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{ background: BRAND.surface }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] blur-3xl rounded-full pointer-events-none"
        style={{ background: `${BRAND.gold}1a` }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <p className="text-center text-xs font-mono tracking-widest uppercase mb-3" style={{ color: BRAND.goldLight }}>
          The problem
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center mb-14 tracking-tight">
          牌を見て、迷う瞬間がある。
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {problems.map((p) => (
            <div
              key={p.text}
              className="bg-white/[0.05] backdrop-blur-sm rounded-2xl p-6 md:p-8 text-center border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all"
            >
              <div className="text-4xl mb-4">{p.emoji}</div>
              <p className="text-white/85 text-sm leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <p className="inline-block text-xl sm:text-2xl font-bold text-white relative">
            手のひらに、
            <span style={{ color: BRAND.goldLight }}>解析エンジン</span>
            。
            <span
              className="absolute left-0 right-0 -bottom-2 h-[3px]"
              style={{
                background: `linear-gradient(to right, transparent, ${BRAND.gold}, transparent)`,
              }}
            />
          </p>
        </div>
      </div>
    </section>
  )
}

function HowSection() {
  const steps = [
    {
      num: 1,
      title: '配牌・手牌を入力',
      desc: '14枚をタップで入力。よく使う形はテンプレ呼び出しも可能。',
    },
    {
      num: 2,
      title: 'AI が探索',
      desc: '通常手・七対子・国士の3パターンを並列計算し、最小シャンテン数を返す。',
    },
    {
      num: 3,
      title: '打牌候補をスコアリング',
      desc: '各候補打牌について、有効牌の枚数とシャンテン進行度から総合スコアを提示。',
    },
    {
      num: 4,
      title: '履歴で振り返り',
      desc: '保存した手牌は後から再ロード可能。学習用ストックとして使える。',
    },
  ]

  return (
    <section
      id="how"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${BRAND.surface} 0%, #14241D 50%, ${BRAND.surface} 100%)`,
      }}
    >
      <div
        className="absolute top-1/2 right-[10%] w-[400px] h-[400px] blur-3xl rounded-full pointer-events-none"
        style={{ background: `${BRAND.gold}14` }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <p className="text-center text-xs font-mono tracking-widest uppercase mb-3" style={{ color: BRAND.goldLight }}>
          How it works
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center mb-16 tracking-tight">
          入力から提案まで、
          <span style={{ color: BRAND.goldLight }}>数ms</span>
          。
        </h2>
        <div className="max-w-2xl mx-auto space-y-6">
          {steps.map((step) => (
            <div key={step.num} className="flex items-start gap-5 group">
              <div
                className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                style={{
                  background: BRAND.gold,
                  boxShadow: `0 10px 25px ${BRAND.gold}4d`,
                }}
              >
                <span className="text-white font-black">{step.num}</span>
              </div>
              <div className="pt-1 flex-1">
                <h3 className="text-white font-bold text-lg mb-1">{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TechSection() {
  const codeSample = `func calculateShanten(tiles: [Tile]) -> Int {
    let normal = calcNormalShanten(tiles)
    let chiitoi = calcChiitoiShanten(tiles)
    let kokushi = calcKokushiShanten(tiles)
    return min(normal, chiitoi, kokushi)
}`

  const points = [
    {
      title: 'Swift value type を活かした牌セット表現',
      desc: '34種の牌をビット/整数配列で持たせ、コピーコストを最小化。再帰探索のスタックが軽い。',
    },
    {
      title: '3パターン並列のシャンテン計算',
      desc: '通常手・七対子・国士無双を独立に解いて min を取る。各パターンは枝刈り済みの自作探索。',
    },
    {
      title: '14枚全探索でも数ms以内',
      desc: '手牌全列挙でも端末上で気にならない応答。SwiftUI のリアクティブ更新と相性が良い。',
    },
  ]

  return (
    <section
      id="tech"
      className="py-20 md:py-28"
      style={{
        background: `linear-gradient(180deg, ${BRAND.cream} 0%, #ffffff 50%, ${BRAND.cream} 100%)`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-mono tracking-widest uppercase mb-3 text-gray-500">
          Engineering
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 text-center mb-14 tracking-tight">
          自作アルゴリズムで、軽く、速く。
        </h2>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            {points.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm"
              >
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
            <Link
              to="/blog/mahjong-ai-algorithm"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: BRAND.primaryDark }}
            >
              アルゴリズム解説記事を読む
              <svg className="w-4 h-4" fill="none" viewBox="0 0 14 14">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div
            className="rounded-2xl overflow-hidden shadow-lg sticky top-24"
            style={{ background: BRAND.ink }}
          >
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
              <span className="ml-3 font-mono text-xs text-white/40">
                ShantenCalculator.swift
              </span>
            </div>
            <pre className="p-5 text-xs sm:text-sm font-mono text-white/90 leading-relaxed overflow-x-auto">
              <code>{codeSample}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection({ features }: { features: string[] }) {
  const icons = ['🎯', '⚡', '📋', '🧠', '🎴']
  return (
    <section
      id="features"
      className="py-20 md:py-28"
      style={{
        background: `linear-gradient(180deg, #ffffff 0%, ${BRAND.cream} 100%)`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-mono tracking-widest uppercase mb-3 text-gray-500">
          Features
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 text-center mb-14 tracking-tight">
          こだわりの解析体験。
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <div
              key={f}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="text-3xl mb-3">{icons[i] ?? '✨'}</div>
              <p className="text-gray-700 leading-relaxed text-sm">{f}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 50%, ${BRAND.primaryLight} 100%)`,
      }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(244,196,48,0.18), transparent 70%)' }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 tracking-tight leading-tight">
          次の一打を、
          <br className="sm:hidden" />
          AI に聞いてみる。
        </h2>
        <p className="text-white/80 mb-10">App Store で公開中・iOS 専用</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-track="app-store"
            data-track-app="mahjong-ai"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm hover:-translate-y-0.5 hover:shadow-xl transition-all shadow-lg"
            style={{ background: BRAND.goldLight, color: BRAND.primaryDark }}
          >
            <AppleIcon />
            App Store で見る
          </a>
          <Link
            to="/support/mahjong-ai"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-full font-bold text-sm hover:bg-white/20 transition-all border border-white/40 backdrop-blur-sm"
          >
            サポート / お問い合わせ
          </Link>
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
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {others.map((w) => {
            const isExternal = !!w.externalUrl
            const target = w.externalUrl ?? `/apps/${w.id}`
            const cardBody = (
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
                className={baseClass}
              >
                {cardBody}
              </a>
            ) : (
              <Link key={w.id} to={target} className={baseClass}>
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
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

function LandingFooter() {
  return (
    <footer style={{ background: BRAND.ink }} className="py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <span className="text-gray-300 font-bold">麻雀AI</span>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link
              to="/support/mahjong-ai"
              className="text-gray-400 hover:text-white transition-colors"
            >
              サポート
            </Link>
            <Link
              to="/blog/mahjong-ai-algorithm"
              className="text-gray-400 hover:text-white transition-colors"
            >
              技術メモ
            </Link>
          </div>
          <span className="text-gray-500 text-sm">&copy; 2022 skuro</span>
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

export default function MahjongLanding() {
  const work = works.find((w) => w.id === 'mahjong-ai')

  useDocumentMeta({
    title: '麻雀AI — 配牌から最適打牌をAIが解析するiOSアプリ',
    description:
      '配牌・手牌を入力するだけで、シャンテン数・有効牌・最適打牌をリアルタイムで解析。自作アルゴリズムで数ms以内に応答するiOSアプリ。App Store公開中。',
    image: work?.iconUrl,
  })

  if (!work) return null

  return (
    <div className="min-h-screen" style={{ background: BRAND.surface }}>
      <NavBar />
      <HeroSection
        iconUrl={work.iconUrl}
        catchphrase={work.catchphrase ?? '打牌の迷いを、AIが解消する。'}
      />
      <ProblemSection />
      <HowSection />
      <TechSection />
      <FeaturesSection features={work.features ?? []} />
      <CTASection />
      <OtherAppsSection currentId={work.id} />
      <LandingFooter />
      <div className="border-t border-gray-800/60 py-4" style={{ background: BRAND.ink }}>
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
