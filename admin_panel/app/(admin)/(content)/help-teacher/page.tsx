import HelpTeacherManager from "@/components/content-managers/HelpTeacherManager";

export default function HelpTeacherPage() {
  return (
    <HelpTeacherManager 
      apiEndpoint="/admin/api/help-teacher" 
      title="На допомогу вчителю" 
    />
  );
}



