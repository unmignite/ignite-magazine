import ArticleCard from './ArticleCard'

// The top of a section: three stories across, the lead one big in the middle.
//
// The middle slot takes the first article rather than the left one. The eye
// goes to the largest thing on the row before it goes to the left of it, so
// putting the newest story anywhere else would make the section's lead the
// second thing you read.
export const LEAD_COUNT = 3

export default function LeadRow({ articles }) {
  if (articles.length < LEAD_COUNT) return null
  const [main, left, right] = articles

  return (
    <div className="lead-row">
      <div className="lead-side">
        <ArticleCard article={left} variant="stack" />
      </div>
      <div className="lead-main">
        <ArticleCard article={main} variant="lead" />
      </div>
      <div className="lead-side">
        <ArticleCard article={right} variant="stack" />
      </div>
    </div>
  )
}
