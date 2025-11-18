import NewsManager from "@/components/content-managers/NewsManager";

export default function NewsManagementPage() {
  return (
    <NewsManager 
      apiEndpoint="/api/news" 
      title="Управління новинами" 
    />
  );
}

