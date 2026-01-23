import SimpleContentManager from "@/components/content-managers/SimpleContentManager";

export default function ForParentsPage() {
  return (
    <SimpleContentManager 
      apiEndpoint="/admin/api/for-parents" 
      title="Батькам" 
    />
  );
}




