import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useGitHub } from "@/context/GitHubContext";
import { marked } from "marked";
import Sheet from "@/components/molecules/sheet";

export default function ProjectDetail() {
  const router = useRouter();
  const { repo } = router.query;
  const { username } = useGitHub();
  const [readme, setReadme] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false)


  useEffect(() => {
    if (!repo || !username) return;
  
    axios.get(`https://api.github.com/repos/${username}/${repo}/readme`)
      .then(({ data }) => {
        axios.get(data.download_url).then(async ({ data }) => {
          const parsedReadme = await marked.parse(data);
          setReadme(parsedReadme);
          setIsSheetOpen(true);
        });
      });
  }, [repo, username]);
  return (
    <div>
    <h1>{repo}</h1>
    <Sheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} title={`${repo} README`}>
      <div dangerouslySetInnerHTML={{ __html: readme }} />
    </Sheet>
  </div>
  );
}
