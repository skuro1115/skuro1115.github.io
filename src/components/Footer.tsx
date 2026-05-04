import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4 text-subtle text-sm">
          <a
            href="https://github.com/skuro1115"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition-colors"
          >
            GitHub
          </a>
          <a
            href="mailto:yktsr1212@gmail.com"
            className="hover:text-gray-900 transition-colors"
          >
            Email
          </a>
        </div>
        <Link to="/log" className="text-border hover:text-subtle transition-colors text-xs">
          ·
        </Link>
      </div>
    </footer>
  )
}
