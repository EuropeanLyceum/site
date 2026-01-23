import ContentWithPhotosManager from "@/components/content-managers/ContentWithPhotosManager";

export default function SchoolHistoryPage() {
  return (
    <ContentWithPhotosManager 
      apiEndpoint="/admin/api/school-history" 
      title="Історія закладу" 
    />
  );
}


