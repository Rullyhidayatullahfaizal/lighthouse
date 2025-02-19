import { createContext, useContext, useState, ReactNode } from "react";

interface GitHubContextType {
  username: string;
  setUsername: (username: string) => void;
  repos: any[];
  setRepos: (repos: any[]) => void;
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

export const GitHubProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState<any[]>([]);

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

