import TeacherCertificationManager from "@/components/content-managers/TeacherCertificationManager";

export default function TeacherCertificationPage() {
  return (
    <TeacherCertificationManager 
      apiEndpoint="/api/teacher-certification" 
      title="Атестація педпрацівників" 
    />
  );
}

