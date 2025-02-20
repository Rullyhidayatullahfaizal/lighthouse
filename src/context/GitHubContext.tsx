import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface GitHubContextType {
  username: string;
  setUsername: (username: string) => void;
  repos: any[];
  setRepos: (repos: any[]) => void;
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

export const GitHubProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string>("");
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("githubUsername");
      if (storedUsername) {
        setUsername(storedUsername);
        fetchRepos(storedUsername); // Fetch repos saat username tersedia
      }
    }
  }, []);

  const fetchRepos = async (user: string) => {
    try {
      const response = await fetch(`https://api.github.com/users/${user}/repos`);
      if (!response.ok) throw new Error("Failed to fetch repositories");
      const data = await response.json();
      setRepos(data);
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  };

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
