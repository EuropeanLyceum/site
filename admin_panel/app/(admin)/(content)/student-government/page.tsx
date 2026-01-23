import NewsManager from "@/components/content-managers/NewsManager";

export default function StudentGovernmentPage() {
  return (
    <NewsManager 
      apiEndpoint="/admin/api/student-government" 
      title="Учнівське самоврядування" 
    />
  );
}

