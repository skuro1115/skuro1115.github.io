import { motion } from 'framer-motion'

const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
}

export default function Support() {
  return (
    <motion.main variants={page} initial="initial" animate="animate" exit="exit">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <p className="font-mono text-xs text-subtle mb-2">App Support</p>
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">麻雀AI — 配牌チェッカー</h1>
        <p className="text-muted mb-10">iOSアプリのサポートページです。</p>

        <section className="mb-10">
          <h2 className="font-semibold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-6">
            {[
              {
                q: 'シャンテン数とは何ですか？',
                a: 'あと何枚引けば聴牌（テンパイ）になるかを示す数です。-1 が和了（あがり）、0 が聴牌です。',
              },
              {
                q: '有効牌はどのように判定されますか？',
                a: '全34種の牌のうち、引いたときにシャンテン数が減る牌を有効牌として表示します。',
              },
              {
                q: 'データはどこに保存されますか？',
                a: '手牌データはすべてデバイス内にのみ保存されます。外部サーバーへの送信は行いません。',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-l-2 border-border pl-4">
                <p className="font-medium text-gray-900 mb-1">{q}</p>
                <p className="text-sm text-muted">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-semibold text-gray-900 mb-4">お問い合わせ</h2>
          <p className="text-muted text-sm mb-3">
            ご不明点・バグ報告は以下のメールアドレスまでお送りください。
          </p>
          <a
            href="mailto:yktsr1212@gmail.com"
            className="text-accent text-sm hover:underline"
          >
            yktsr1212@gmail.com
          </a>
        </section>

        <a
          href="https://apps.apple.com/jp/app/麻雀ai-配牌チェッカー/id1637036872"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          App Store で開く
        </a>
      </div>
    </motion.main>
  )
}
