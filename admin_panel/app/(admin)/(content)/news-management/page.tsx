import NewsManager from "@/components/content-managers/NewsManager";

export default function NewsManagementPage() {
  return (
    <NewsManager 
      apiEndpoint="/admin/api/news" 
      title="Управління новинами" 
    />
  );
}

