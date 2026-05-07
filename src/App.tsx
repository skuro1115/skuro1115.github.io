import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Apps from './pages/Apps'
import Works from './pages/Home'
import WorkDetail from './pages/WorkDetail'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Log from './pages/Log'
import LogPost from './pages/LogPost'
import Support from './pages/Support'
import NotFound from './pages/NotFound'

const MahjongLanding = lazy(() => import('./pages/MahjongLanding'))
const GuessRankLanding = lazy(() => import('./pages/GuessRankLanding'))

function RouteFallback() {
  return <div className="min-h-[40vh]" />
}

function Layout() {
  const { pathname } = useLocation()
  const isDark = pathname === '/'
  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#06080f]' : 'bg-white'}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-3 focus:py-2 focus:bg-white focus:text-gray-900 focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
      >
        コンテンツへスキップ
      </a>
      <Nav />
      <div id="main-content" className="flex-1">
        <AnimatePresence mode="wait">
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Apps /> },
      { path: 'works', element: <Works /> },
      { path: 'works/:id', element: <WorkDetail /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogPost /> },
      { path: 'log', element: <Log /> },
      { path: 'log/:slug', element: <LogPost /> },
      { path: 'support/mahjong-ai', element: <Support /> },
      { path: 'apps/mahjong-ai', element: <MahjongLanding /> },
      { path: 'apps/guess-rank', element: <GuessRankLanding /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
