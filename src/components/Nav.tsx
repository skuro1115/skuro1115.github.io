import { Link, NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="font-mono text-sm font-medium text-gray-900 tracking-tight">
          skuro
        </Link>
        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-accent' : 'text-muted hover:text-gray-900'
              }`
            }
          >
            Apps
          </NavLink>
          <NavLink
            to="/works"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-accent' : 'text-muted hover:text-gray-900'
              }`
            }
          >
            Works
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-accent' : 'text-muted hover:text-gray-900'
              }`
            }
          >
            Blog
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
