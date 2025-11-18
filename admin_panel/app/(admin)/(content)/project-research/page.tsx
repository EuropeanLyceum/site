import NewsManager from "@/components/content-managers/NewsManager";

export default function ProjectResearchPage() {
  return (
    <NewsManager 
      apiEndpoint="/api/project-research" 
      title="Проєктно-дослідницька робота" 
    />
  );
}

