import ContentWithPhotosManager from "@/components/content-managers/ContentWithPhotosManager";

export default function VisitingCardPage() {
  return (
    <ContentWithPhotosManager 
      apiEndpoint="/admin/api/visiting-card" 
      title="Наша візитка" 
    />
  );
}

