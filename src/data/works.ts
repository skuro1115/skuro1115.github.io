export type Work = {
  id: string
  title: string
  shortDesc: string
  longDesc: string
  tags: string[]
  year: string
  badge?: 'live' | 'research' | 'wip'
  badgeLabel?: string
  appStoreUrl?: string
  /** App Store のアイコン画像URL。直書き（iTunes APIはCORSの都合でブラウザから叩けないため） */
  iconUrl?: string
  githubUrl?: string
  color: string
  category?: 'game' | 'research' | 'tool' | 'other'
  catchphrase?: string
  features?: string[]
  /** Apps ページに表示するかどうか。false または未設定で非表示 */
  showInApps?: boolean
  /** /apps/{id} に専用ランディングページがあるかどうか */
  hasLanding?: boolean
  /** 外部サイトのLP URL（共同開発で本家LPが別リポジトリにあるケース）。指定時は新しいタブで開く */
  externalUrl?: string
  mediaUrls?: string[]
  relatedPostSlugs?: string[]
  showInBlog?: boolean
  techDetails?: string
}

export const works: Work[] = [
  {
    id: 'mahjong-ai',
    title: '麻雀AI iOSアプリ',
    shortDesc: '配牌から最適打牌をAIが解析するiOSアプリ。App Storeで公開中。',
    longDesc: `麻雀の配牌・手牌を入力すると、AIが最適打牌・有効牌・シャンテン数をリアルタイムで解析するiOSアプリです。

Swift / SwiftUIで実装し、探索アルゴリズムを自作。App Storeで公開中。

主な機能:
- 配牌チェック（シャンテン数・有効牌の表示）
- 打牌候補のスコアリング
- 手牌履歴の保存`,
    tags: ['Swift', 'SwiftUI', 'Algorithm', 'iOS'],
    year: '2022',
    badge: 'live',
    badgeLabel: 'App Store',
    appStoreUrl: 'https://apps.apple.com/jp/app/麻雀ai-配牌チェッカー/id1637036872',
    iconUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple122/v4/c1/c7/77/c1c77758-8214-d1f5-5284-8d54b1ea1593/AppIcon-1x_U007emarketing-0-10-0-85-220.png/512x512bb.jpg',
    color: 'blue',
    category: 'game',
    catchphrase: '打牌の迷いを、AIが解消する。',
    features: [
      'シャンテン数・有効牌をリアルタイム表示',
      '打牌候補をスコアリングして最適解を提示',
      '手牌履歴の保存で振り返りが可能',
      '自作探索アルゴリズムによる高速解析',
    ],
    showInApps: true,
    hasLanding: true,
    relatedPostSlugs: ['mahjong-ai-algorithm'],
  },
  {
    id: 'guess-rank',
    title: 'GuessRank',
    shortDesc: '友達のTop3を当てる、1台で遊べるパーティーゲーム。',
    longDesc: `お題に対するターゲットの「好みの1位・2位・3位」を、他のプレイヤーが予想するパーティーゲーム。

3つの順番をすべて当てたら100点。「え、そっちが1位なの！？」という驚きと会話が自然に生まれる、友達の意外な一面が見えるゲームです。`,
    tags: ['Swift', 'SwiftUI', 'iOS', 'Party Game'],
    year: '2026',
    badge: 'wip',
    badgeLabel: 'iOS申請中',
    iconUrl: '/guess-rank/icon.png',
    githubUrl: 'https://github.com/skuro1115/GuessRank-GameCore-iOS',
    color: 'amber',
    category: 'game',
    catchphrase: '友達の本音、当てられる？',
    features: [
      '友達の好みのTop3を予想するパーティーゲーム',
      '1台のスマホを回すだけ、アカウント登録不要',
      '内蔵お題プールから自動出題、ルール説明30秒',
      'スコアで「友達理解度」が可視化される',
      'お題は何度でもスキップ可能、場の雰囲気に合わせて',
    ],
    showInApps: true,
    hasLanding: true,
  },
  {
    id: 'honnemawolf',
    title: 'ホンネ人狼',
    shortDesc: 'テーマに沿ったホンネを語り合うオフライン人狼ゲームアプリ。iOS公開中。',
    longDesc: `「ホンネ人狼」は、お題に対する本音を話しながら人狼を探し出すオフライン人狼ゲームです。

Dartで実装。友人・グループで集まってすぐ遊べるシンプルな設計で、App Storeで公開中。`,
    tags: ['Dart', 'Flutter', 'iOS', 'Game'],
    year: '2024',
    badge: 'live',
    badgeLabel: 'App Store',
    appStoreUrl: 'https://apps.apple.com/jp/app/ホンネ人狼/id6747802748',
    iconUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/37/bd/50/37bd509b-17f8-fef8-518b-1da5d3f4ed3b/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/512x512bb.jpg',
    githubUrl: 'https://github.com/kukurio218/theme_jinro_offline',
    color: 'amber',
    category: 'game',
    catchphrase: 'ホンネで語れ、人狼を暴け。',
    features: [
      'テーマに沿ったホンネトークで人狼を推理',
      'オフライン完結・追加機器不要',
      'シンプル操作で誰でもすぐ遊べる',
    ],
    showInApps: true,
    externalUrl: 'https://kukurio218.github.io/apps/themejinro',
  },
  {
    id: 'vr-sim',
    title: 'VR シミュレーション',
    shortDesc: '工場・施設の動線をVR空間で可視化・シミュレーションするシステム。',
    longDesc: `Unity + XR Interaction Toolkitを用いて、製造ライン・施設内の動線をVR上でシミュレーションするシステムを構築しました。

研究プロジェクトとして開発。人の動きをモーションキャプチャで取り込みVR空間に再生し、混雑・動線を可視化します。

関連特許: JP-2021-115207`,
    tags: ['Unity', 'C#', 'XR', 'Simulation'],
    year: '2024',
    badge: 'research',
    githubUrl: 'https://github.com/skuro1115',
    color: 'violet',
  },
  {
    id: 'arduino',
    title: 'Arduino ゲーム自動化',
    shortDesc: 'Arduinoとコンピュータビジョンを組み合わせたゲーム自動プレイシステム。',
    longDesc: `OpenCVで画面を解析し、Arduinoでコントローラー入力を自動化するシステムです。

ゲームの状態をリアルタイムに認識し、最適なアクションを計算して入力します。Pythonとの連携によりロジックを柔軟に組み替えられる設計にしました。`,
    tags: ['Arduino', 'Python', 'OpenCV', 'Automation'],
    year: '2020',
    color: 'green',
    category: 'game',
    catchphrase: 'ゲームを見る目を、マシンに与える。',
    features: [
      'OpenCVによるリアルタイム画面解析',
      'Arduinoでコントローラー入力を完全再現',
      'Pythonロジックで戦略を柔軟にカスタマイズ',
      'ハードウェア × ソフトウェアのハイブリッド設計',
    ],
    showInApps: false, // 非表示
  },
  {
    id: 'linebot',
    title: '自動化 / LINE Bot',
    shortDesc: '日常タスクを自動化するLINE Bot群。スケジュール通知・データ収集など。',
    longDesc: `LINE Messaging APIを利用したBot群です。

- スケジュールリマインダー
- Webスクレイピングによる情報収集・通知
- グループでの予定調整アシスタント

GAS（Google Apps Script）とCloud Functionsを組み合わせサーバーレスで運用中。`,
    tags: ['LINE API', 'GAS', 'Node.js', 'Serverless'],
    year: '2023',
    badge: 'wip',
    color: 'emerald',
  },
  {
    id: 'orienteering',
    title: '地図測量・大会運営',
    shortDesc: 'オリエンテーリング競技の地図製作から大会運営システムまでを担当。',
    longDesc: `オリエンテーリング競技における地図製作（OCAD使用）・コース設定・大会運営全般を担当しています。

GPS測量データとOCADを組み合わせた精密な競技地図の製作、電子採点システムの導入・運用、レースシミュレーションツールの自作なども行いました。`,
    tags: ['OCAD', 'GPS', 'Event Management'],
    year: '2022',
    color: 'amber',
  },
  {
    id: 'greentea',
    title: '緑茶販促プロジェクト',
    shortDesc: '緑茶の魅力を若い世代に伝えるための販促・コンテンツ企画プロジェクト。',
    longDesc: `伝統的な緑茶文化を現代的なコンテキストで再発信するプロジェクトです。

SNSコンテンツ設計・撮影・コピーライティングを担当。ターゲット層への訴求方法を研究し、エンゲージメント率の改善を実現しました。`,
    tags: ['Marketing', 'Content', 'SNS'],
    year: '2019',
    color: 'lime',
  },
]
