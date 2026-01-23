import ForStudentsManager from "@/components/content-managers/ForStudentsManager";

export default function ForStudentsPage() {
  return (
    <ForStudentsManager 
      apiEndpoint="/admin/api/for-students" 
      title="Учням" 
    />
  );
}



