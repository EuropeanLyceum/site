import QualificationImprovementManager from '@/components/content-managers/QualificationImprovementManager';

export default function QualificationImprovementAdminPage() {
  return (
    <QualificationImprovementManager
      apiEndpoint="/api/qualification-improvement"
      title="Підвищення кваліфікації"
    />
  );
}



