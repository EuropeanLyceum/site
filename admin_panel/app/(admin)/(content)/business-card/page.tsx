import ContentWithPhotosManager from "@/components/content-managers/ContentWithPhotosManager";

export default function VisitingCardPage() {
  return (
    <ContentWithPhotosManager 
      apiEndpoint="/api/visiting-card" 
      title="Наша візитка" 
    />
  );
}

