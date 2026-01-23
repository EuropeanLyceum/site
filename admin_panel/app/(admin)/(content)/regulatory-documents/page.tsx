import RegulatoryDocumentsManager from "@/components/content-managers/RegulatoryDocumentsManager";

export default function RegulatoryDocumentsPage() {
  return (
    <RegulatoryDocumentsManager 
      apiEndpoint="/admin/api/regulatory-documents" 
      title="Нормативні документи" 
    />
  );
}



