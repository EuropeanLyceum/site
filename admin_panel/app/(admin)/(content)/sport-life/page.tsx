import NewsManager from "@/components/content-managers/NewsManager";

export default function SportLifePage() {
  return (
    <NewsManager 
      apiEndpoint="/admin/api/sport-life" 
      title="СпортLife" 
    />
  );
}

