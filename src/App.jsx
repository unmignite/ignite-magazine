import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { StoreProvider, useStore } from './context/StoreContext'
import { ThemeProvider } from './context/ThemeContext'
import Nav from './components/Nav'
import Footer from './components/Footer'
import AdminBar from './components/AdminBar'
import Home from './pages/Home'
import Section from './pages/Section'
import AllArticles from './pages/AllArticles'
import Article from './pages/Article'
import Login from './pages/Login'
import Studio from './pages/Studio'
import Editor from './pages/Editor'
import Design from './pages/Design'
import LayoutEditor from './pages/Layout'
import Analytics from './pages/Analytics'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Protected({ children }) {
  const { user } = useStore()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function Shell() {
  const { user } = useStore()
  return (
    <div className={`shell ${user ? 'with-admin' : ''}`}>
      {user && <AdminBar />}
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<AllArticles />} />
          <Route path="/section/:slug" element={<Section />} />
          <Route path="/article/:slug" element={<Article />} />
          <Route path="/login" element={<Login />} />
          <Route path="/studio" element={<Protected><Studio /></Protected>} />
          <Route path="/studio/new" element={<Protected><Editor /></Protected>} />
          <Route path="/studio/design" element={<Protected><Design /></Protected>} />
          <Route path="/studio/layout" element={<Protected><LayoutEditor /></Protected>} />
          <Route path="/studio/analytics" element={<Protected><Analytics /></Protected>} />
          <Route path="/studio/edit/:id" element={<Protected><Editor /></Protected>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <ThemeProvider>
        <ScrollToTop />
        <Shell />
      </ThemeProvider>
    </StoreProvider>
  )
}
