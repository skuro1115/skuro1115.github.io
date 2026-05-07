import { Link, useLocation } from 'react-router-dom'

export default function Footer() {
  const { pathname } = useLocation()
  const isDark = pathname === '/'

  return (
    <footer
      className={`border-t ${
        isDark
          ? 'bg-[#06080f] border-white/5'
          : 'bg-white border-border mt-24'
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
        <div
          className={`flex items-center gap-4 text-sm ${
            isDark ? 'text-gray-500' : 'text-subtle'
          }`}
        >
          <a
            href="https://github.com/skuro1115"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors ${
              isDark ? 'hover:text-white' : 'hover:text-gray-900'
            }`}
          >
            GitHub
          </a>
          <a
            href="mailto:yktsr1212@gmail.com"
            className={`transition-colors ${
              isDark ? 'hover:text-white' : 'hover:text-gray-900'
            }`}
          >
            Email
          </a>
        </div>
        <Link
          to="/log"
          aria-label="開発ログ"
          className={`transition-colors text-xs ${
            isDark
              ? 'text-white/10 hover:text-white/30'
              : 'text-border hover:text-subtle'
          }`}
        >
          <span aria-hidden="true">·</span>
        </Link>
      </div>
    </footer>
  )
}
