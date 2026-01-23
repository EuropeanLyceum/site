import QualificationImprovementManager from '@/components/content-managers/QualificationImprovementManager';

export default function QualificationImprovementAdminPage() {
  return (
    <QualificationImprovementManager
      apiEndpoint="/admin/api/qualification-improvement"
      title="Підвищення кваліфікації"
    />
  );
}



