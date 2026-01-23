import NewsManager from "@/components/content-managers/NewsManager";

export default function MethodologicalEventsManagementPage() {
  return (
    <NewsManager 
      apiEndpoint="/admin/api/methodological-events" 
      title="Управління методичними заходами" 
    />
  );
}

