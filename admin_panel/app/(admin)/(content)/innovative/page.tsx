import ContentWithPhotosManager from "@/components/content-managers/ContentWithPhotosManager";

export default function InnovativePage() {
  return (
    <ContentWithPhotosManager 
      apiEndpoint="/admin/api/innovative" 
      title="Інноваційна діяльність" 
    />
  );
}

