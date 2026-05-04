import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import WorkDetail from './pages/WorkDetail'
import Games from './pages/Games'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Log from './pages/Log'
import LogPost from './pages/LogPost'
import Support from './pages/Support'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
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
      { index: true, element: <Home /> },
      { path: 'works/:id', element: <WorkDetail /> },
      { path: 'games', element: <Games /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogPost /> },
      { path: 'log', element: <Log /> },
      { path: 'log/:slug', element: <LogPost /> },
      { path: 'support/mahjong-ai', element: <Support /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
