import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useGitHub } from "@/context/GitHubContext";
import { marked } from "marked";

export default function ProjectDetail() {
  const router = useRouter();
  const { repo } = router.query;
  const { username } = useGitHub();
  const [readme, setReadme] = useState("");

  useEffect(() => {
    if (!repo || !username) return;
  
    axios.get(`https://api.github.com/repos/${username}/${repo}/readme`)
      .then(({ data }) => {
        axios.get(data.download_url).then(async ({ data }) => {
          const parsedReadme = await marked.parse(data);
          setReadme(parsedReadme);
        });
      });
  }, [repo, username]);
  return (
    <div>
      <h1>{repo}</h1>
      <div dangerouslySetInnerHTML={{ __html: readme }} />
    </div>
  );
}
