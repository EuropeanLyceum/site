import NewsManager from "@/components/content-managers/NewsManager";

export default function PatrioticEducationPage() {
  return (
    <NewsManager 
      apiEndpoint="/api/patriotic-education" 
      title="Національно-патріотичне виховання" 
    />
  );
}

