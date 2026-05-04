import { Link, NavLink, useLocation } from 'react-router-dom'

export default function Nav() {
  const { pathname } = useLocation()
  const isDark = pathname === '/'

  return (
    <header
      className={`sticky top-0 z-50 border-b ${
        isDark
          ? 'bg-[#06080f]/80 backdrop-blur-md border-white/5'
          : 'bg-white border-border'
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className={`font-mono text-sm font-medium tracking-tight ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          skuro
        </Link>
        <nav className="flex items-center gap-6">
          {[
            { to: '/', label: 'Apps', end: true },
            { to: '/works', label: 'Works', end: false },
            { to: '/blog', label: 'Blog', end: false },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? isDark
                      ? 'text-blue-400'
                      : 'text-accent'
                    : isDark
                      ? 'text-gray-400 hover:text-white'
                      : 'text-muted hover:text-gray-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
