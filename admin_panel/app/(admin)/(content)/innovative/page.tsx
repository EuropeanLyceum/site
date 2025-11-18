import ContentWithPhotosManager from "@/components/content-managers/ContentWithPhotosManager";

export default function InnovativePage() {
  return (
    <ContentWithPhotosManager 
      apiEndpoint="/api/innovative" 
      title="Інноваційна діяльність" 
    />
  );
}

