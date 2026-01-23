import NewsManager from "@/components/content-managers/NewsManager";

export default function PatrioticEducationPage() {
  return (
    <NewsManager 
      apiEndpoint="/admin/api/patriotic-education" 
      title="Національно-патріотичне виховання" 
    />
  );
}

