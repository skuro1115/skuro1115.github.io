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
import MahjongLanding from './pages/MahjongLanding'
import HonnemawolfLanding from './pages/HonnemawolfLanding'
import GuessRankLanding from './pages/GuessRankLanding'

function Layout() {
  const { pathname } = useLocation()
  const isDark = pathname === '/'
  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#06080f]' : 'bg-white'}`}>
      <Nav />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Outlet />
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
      { path: 'apps/honnemawolf', element: <HonnemawolfLanding /> },
      { path: 'apps/guess-rank', element: <GuessRankLanding /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
