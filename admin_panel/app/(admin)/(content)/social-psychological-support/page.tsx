import PsychologicalSupportManager from "@/components/content-managers/PsychologicalSupportManager";

export default function SocialPsychologicalSupportPage() {
  return (
    <PsychologicalSupportManager
      apiEndpoint="/admin/api/psychological-support"
      title="Соціально-психологічна підтримка"
    />
  );
}



