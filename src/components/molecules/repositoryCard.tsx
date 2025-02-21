import { Star } from "lucide-react";
import styles from "./repositoryCard.module.css";
import { useEffect, useState } from "react";

interface RepositoryCardProps {
  name: string;
  isPublic?: boolean;
  language?: string;
  languageColor?: string;
  updatedAt: string;
  stars?: number;
  description?: string;
  url?: string;
  onClick?: () => void;
}

export default function RepositoryCard({
  name,
  isPublic = true,
  language,
  languageColor = "#3572A5", // TypeScript blue as default
  stars = 0,
  description: initialDescription = "",
  updatedAt,
  onClick,
}: RepositoryCardProps) {

  const [description, setDescription] = useState<string | null>(null);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDescription(initialDescription);
    }, 100); // Render cepat (100ms)

    return () => clearTimeout(timeout);
  }, [initialDescription]);


  return (
    <div className={styles.card} >
      <div className={styles.header}>
        <span className={styles.repoName} onClick={onClick}>
          {name}
        </span>
        {isPublic && <span className={styles.publicBadge}>Public</span>}
      </div>

      <p className={styles.description}>
        {description ? description.substring(0, 150) + (description.length > 150 ? "..." : "") : "Loading description..."}
      </p>

      
      <div className={styles.footer}>
        {language && (
          <span className={styles.language}>
            <span
              className={styles.languageDot}
              style={{ backgroundColor: languageColor }}
            />
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
  );
}
