import { useGitHub } from "@/context/GitHubContext";
import { useRouter } from "next/router";
import RepositoryCard from "@/components/molecules/repositoryCard";
import styles from "../styles/projects.module.css";

export default function Projects() {
  const { repos } = useGitHub();
  const router = useRouter();
  


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Repository List</h1>
      <div className={styles.grid}>
        {repos.map((repo) => (
          <RepositoryCard
            key={repo.id}
            name={repo.name}
            isPublic={!repo.private}
            language={repo.language || "Unknown"}
            updatedAt={new Date(repo.updated_at).toLocaleDateString()}
            stars={repo.stargazers_count}
            description={repo.description || "No description"}
            url={repo.html_url}
            onClick={() => router.push(`/projects/${repo.name}`)}
          />
        ))}
      </div>
    </div>
  );
}