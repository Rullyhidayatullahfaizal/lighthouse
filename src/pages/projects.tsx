import { useGitHub } from "@/context/GitHubContext";
import RepositoryCard from "@/components/molecules/repositoryCard";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { marked } from "marked";
import Sheet from "@/components/molecules/sheet";
import styles from "../styles/projects.module.css";

const ITEMS_PER_PAGE = 6;

export default function Projects() {
  const { repos, username } = useGitHub();
  const [displayedRepos, setDisplayedRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [readme, setReadme] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (repos.length > 0) {
      setDisplayedRepos(repos.slice(0, ITEMS_PER_PAGE));
      setLoading(false);
    }
  }, [repos]);

  useEffect(() => {
    if (!repos.length || !loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMoreRepos();
        }
      },
      { rootMargin: "100px" }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [repos, displayedRepos]);

  const loadMoreRepos = () => {
    if (displayedRepos.length >= repos.length || isFetchingMore) return;

    setIsFetchingMore(true);

    setTimeout(() => {
      setDisplayedRepos((prev) => repos.slice(0, prev.length + ITEMS_PER_PAGE));
      setIsFetchingMore(false);
    }, 1000);
  };


  const fetchReadme = async (repoName: string) => {
    if (!username) return;
  
    try {
      // Ambil informasi repo untuk mendapatkan default_branch
      const repoInfo = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);
      const defaultBranch = repoInfo.data.default_branch || "main"; // Jika tidak ditemukan, fallback ke "main"
  
      // Ambil README dari repo
      const { data } = await axios.get(
        `https://api.github.com/repos/${username}/${repoName}/readme`
      );
      const readmeResponse = await axios.get(data.download_url);
      let readmeContent = readmeResponse.data;
  
      // URL dasar untuk gambar di repo (gunakan default_branch yang didapat dari API)
      const repoRawBaseUrl = `https://raw.githubusercontent.com/${username}/${repoName}/${defaultBranch}/`;
  
      // Modifikasi renderer untuk menangani gambar
      const renderer = new marked.Renderer();
      renderer.image = (image) => {
        let imageUrl = image.href || "";
  
        // Jika URL gambar relatif, tambahkan URL absolut dengan menghindari double slash
        if (!/^https?:\/\//.test(imageUrl)) {
          imageUrl = repoRawBaseUrl + imageUrl.replace(/^\/+/, ""); // Hapus "/" di awal agar tidak double slash
        }
  
        return `<img src="${imageUrl}" alt="${image.text}" title="${image.title || ""}" style="max-width: 100%;" />`;
      };
  
      // Parsing markdown dengan renderer custom
      marked.setOptions({ renderer });
      const parsedReadme = await marked.parse(readmeContent);
  
      setReadme(parsedReadme);
      setSelectedRepo(repoName);
      setIsSheetOpen(true);
    } catch (error) {
      console.error("Error fetching README:", error);
      setReadme("<p>Failed to load README</p>");
      setIsSheetOpen(true);
    }
  };
  

  
  

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Repository List</h1>

      {loading ? (
        <p className={styles.loading}>Loading repositories...</p>
      ) : repos.length === 0 ? (
        <p className={styles.empty}>No repositories found.</p>
      ) : (
        <div className={styles.grid}>
          {displayedRepos.map((repo) => (
            <RepositoryCard
              key={repo.id}
              name={repo.name}
              isPublic={!repo.private}
              language={repo.language || "Unknown"}
              updatedAt={new Date(repo.updated_at).toLocaleDateString()}
              stars={repo.stargazers_count}
              description={repo.description || "No description"}
              onClick={() => fetchReadme(repo.name)}
            />
          ))}
        </div>
      )}

      {/* Loading lebih banyak repositories */}
      {isFetchingMore && (
        <p className={styles.loading}>Loading more repositories...</p>
      )}

      <div ref={loadMoreRef}></div>

      {/* Sheet untuk menampilkan README */}
      <Sheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title={selectedRepo ? `${selectedRepo} README` : "README"}
      >
        <div dangerouslySetInnerHTML={{ __html: readme }} />
      </Sheet>
    </div>
  );
}
