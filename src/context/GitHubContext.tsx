import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
}

interface GitHubContextType {
  username: string;
  setUsername: (username: string) => void;
  repos: Repository[];
  setRepos: (repos: Repository[]) => void;
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

export const GitHubProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string>(() => {
    return typeof window !== "undefined" ? localStorage.getItem("githubUsername") || "" : "";
  });

  const [repos, setRepos] = useState<Repository[]>(() => {
    if (typeof window !== "undefined") {
      const storedRepos = localStorage.getItem("githubRepos");
      return storedRepos ? JSON.parse(storedRepos) : [];
    }
    return [];
  });

  const fetchRepos = async (user: string) => {
    try {
      const response = await fetch(`https://api.github.com/users/${user}/repos`);
      if (!response.ok) throw new Error("Failed to fetch repositories");
      const data: Repository[] = await response.json();
      setRepos(data);
      localStorage.setItem("githubRepos", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  };

  // Fetch repos when username changes
  useEffect(() => {
    if (username) {
      localStorage.setItem("githubUsername", username);
      if (repos.length === 0) fetchRepos(username);
    }
  }, [username]);

  return (
    <GitHubContext.Provider value={{ username, setUsername, repos, setRepos }}>
      {children}
    </GitHubContext.Provider>
  );
};

export const useGitHub = () => {
  const context = useContext(GitHubContext);
  if (!context) throw new Error("useGitHub must be used within a GitHubProvider");
  return context;
};
