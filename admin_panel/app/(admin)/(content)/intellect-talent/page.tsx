import NewsManager from "@/components/content-managers/NewsManager";

export default function IntellectTalentPage() {
  return (
    <NewsManager 
      apiEndpoint="/admin/api/intellect-talent" 
      title="Інтелект та обдарованість" 
    />
  );
}



