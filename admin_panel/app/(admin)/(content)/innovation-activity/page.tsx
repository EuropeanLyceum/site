import ContentWithPhotosManager from "@/components/content-managers/ContentWithPhotosManager";

export default function InnovationActivityPage() {
  return (
    <ContentWithPhotosManager 
      apiEndpoint="/api/innovation-activity" 
      title="Інноваційна діяльність" 
    />
  );
}


