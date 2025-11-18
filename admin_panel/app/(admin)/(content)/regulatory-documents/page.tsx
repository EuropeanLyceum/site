import RegulatoryDocumentsManager from "@/components/content-managers/RegulatoryDocumentsManager";

export default function RegulatoryDocumentsPage() {
  return (
    <RegulatoryDocumentsManager 
      apiEndpoint="/api/regulatory-documents" 
      title="Нормативні документи" 
    />
  );
}



