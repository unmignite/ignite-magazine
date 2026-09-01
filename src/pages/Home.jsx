import { useStore } from '../context/StoreContext'
import { useTheme } from '../context/ThemeContext'
import HomeBlock from '../components/HomeBlocks'

// The homepage is composed from blocks stored in site_settings.homepage and
// arranged in Studio → Layout. See src/lib/blocks.js for the block registry.
export default function Home() {
  const { articles, loading } = useStore()
  const { homepage } = useTheme()

  if (loading && !articles.length) {
    return <div className="empty-note">Loading the latest…</div>
  }

  return (
    <>
      {homepage.map((block) => (
        <HomeBlock key={block.id} block={block} articles={articles} />
      ))}
    </>
  )
}
