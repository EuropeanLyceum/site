import EvaluationCriteriaManager from "@/components/content-managers/EvaluationCriteriaManager";

export default function EvaluationCriteriaPage() {
  return (
    <EvaluationCriteriaManager 
      apiEndpoint="/admin/api/evaluation-criteria" 
      title="Критерії оцінювання" 
    />
  );
}

