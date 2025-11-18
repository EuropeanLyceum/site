import NewsManager from "@/components/content-managers/NewsManager";

export default function ClubsStudiosPage() {
  return (
    <NewsManager 
      apiEndpoint="/api/clubs-studios" 
      title="Клуби та студії" 
    />
  );
}

