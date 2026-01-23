import TeacherCertificationManager from "@/components/content-managers/TeacherCertificationManager";

export default function TeacherCertificationPage() {
  return (
    <TeacherCertificationManager 
      apiEndpoint="/admin/api/teacher-certification" 
      title="Атестація педпрацівників" 
    />
  );
}

