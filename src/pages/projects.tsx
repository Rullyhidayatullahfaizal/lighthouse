import { useGitHub } from "@/context/GitHubContext";
import RepositoryCard from "@/components/molecules/repositoryCard";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { marked } from "marked";
import Sheet from "@/components/molecules/sheet";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import styles from "../styles/projects.module.css";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // Gaya warna
import Head from "next/head";
import Script from "next/script";



interface Repo {
  id: number;
  name: string;
  private?: boolean;
  language: string | null;
  updated_at?: string;
  stargazers_count: number;
  description: string | null;
}

const ITEMS_PER_PAGE = 6;

// Konfigurasi `marked` dengan highlight.js
marked.use({
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      const validLang = lang && hljs.getLanguage(lang) ? lang : "plaintext";
      const highlightedCode = hljs.highlight(text, {
        language: validLang,
      }).value;

      return `<pre><code class="hljs">${highlightedCode}</code></pre>`;
    },
  },
});

export default function Projects() {
  <Script src="https://example.com/script.js" strategy="lazyOnload" />

  const { repos, username } = useGitHub();
  const [displayedRepos, setDisplayedRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingReadme, setIsLoadingReadme] = useState(false);
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

  const loadMoreRepos = useCallback(() => {
    if (displayedRepos.length >= repos.length || isFetchingMore) return;

    setIsFetchingMore(true);

    setTimeout(() => {
      setDisplayedRepos((prev) => repos.slice(0, prev.length + ITEMS_PER_PAGE));
      setIsFetchingMore(false);
    }, 1000);
  }, [displayedRepos, repos, isFetchingMore]);

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
  }, [repos, displayedRepos, loadMoreRepos]);

  const fetchReadme = async (repoName: string) => {
    if (!username) return;

    setIsLoadingReadme(true);
    setIsSheetOpen(true);

    try {
      const repoInfo = await axios.get(
        `https://api.github.com/repos/${username}/${repoName}`
      );
      const defaultBranch = repoInfo.data.default_branch || "main";

      let readmeContent = "<p>This repository has no README file.</p>";

      try {
        // Coba fetch README
        const { data } = await axios.get(
          `https://api.github.com/repos/${username}/${repoName}/readme`
        );
        const readmeResponse = await axios.get(data.download_url);
        readmeContent = readmeResponse.data;
      } catch (readmeError: unknown) {
        // Jika README tidak ditemukan (404), gunakan konten default
        if (
          axios.isAxiosError(readmeError) &&
          readmeError.response?.status === 404
        ) {
          console.warn(`README not found for ${repoName}`);
        } else {
          console.error("Error fetching README:", readmeError);
        }
      }

      const repoRawBaseUrl = `https://raw.githubusercontent.com/${username}/${repoName}/${defaultBranch}/`;
      const renderer = new marked.Renderer();

      // Perbaiki gambar di README
      renderer.image = (image) => {
        let imageUrl = image.href || "";
        if (!/^https?:\/\//.test(imageUrl)) {
          imageUrl = repoRawBaseUrl + imageUrl.replace(/^\/+/, "");
        }
        return `<img src="${imageUrl}" alt="${image.text}" title="${
          image.title || ""
        }" width="600" height="400" style="max-width: 100%;" />`;
      };

      marked.use({ renderer });

      // Parsing Markdown
      const parsedReadme = await marked.parse(readmeContent);

      setReadme(parsedReadme);
      setSelectedRepo(repoName);
    } catch (error) {
      console.error("Error fetching repository info:", error);
      setReadme("<p>Failed to load repository information.</p>");
    } finally {
      setIsLoadingReadme(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Projects | Repository List</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Explore a list of repositories showcasing various projects and contributions."
        />
      </Head>
      <h1 className={styles.title}>Repository List</h1>

      {loading ? (
        <div className={styles.placeholder}>
          <p className={styles.loading}>Loading repositories...</p>
        </div>
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
              updatedAt={
                repo.updated_at
                  ? new Date(repo.updated_at).toLocaleDateString()
                  : "Unknown"
              }
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
        {isLoadingReadme ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <LoadingSpinner size={50} />
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: readme }} />
        )}
      </Sheet>
    </div>
  );
}
