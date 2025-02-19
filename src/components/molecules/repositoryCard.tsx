import { Star, Check } from "lucide-react"
import styles from "./repositoryCard.module.css"

interface RepositoryCardProps {
  name: string
  isPublic?: boolean
  language?: string
  languageColor?: string
  updatedAt: string
  stars?: number
  description?: string
  
  url?: string
  onClick?: () => void
}

export default function RepositoryCard({
  name,
  isPublic = true,
  language,
  languageColor = "#3572A5", // TypeScript blue as default
  stars = 0,
  description,
  updatedAt,
  url = "#",
}: RepositoryCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <a href={url} className={styles.repoName}>
          {name}
        </a>
        {isPublic && <span className={styles.publicBadge}>Public</span>}
      </div>

      {description && <p className={styles.description}>{description}</p>}

      <div className={styles.footer}>
        {language && (
          <span className={styles.language}>
            <span className={styles.languageDot} style={{ backgroundColor: languageColor }} />
            {language}
          </span>
        )}
        <span className={styles.stars}>
          <Star size={16} className={styles.starIcon} />
          {stars.toLocaleString()}
        </span>
        <span className={styles.updateInfo}>Updated on {updatedAt}</span>

      </div>
    </div>
  )
}

