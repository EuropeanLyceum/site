import HelpTeacherManager from "@/components/content-managers/HelpTeacherManager";

export default function HelpTeacherPage() {
  return (
    <HelpTeacherManager 
      apiEndpoint="/api/help-teacher" 
      title="На допомогу вчителю" 
    />
  );
}



