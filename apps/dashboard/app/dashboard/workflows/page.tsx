import WorkflowManager from '@/components/workflows/workflow-manager';

import { PaddingLayout } from '../layout';

export const metadata = {
  title: 'Workflows | Growly Suite',
  description: 'Manage your automated workflows of your agents.',
};

export default function WorkflowPage() {
  return (
    <PaddingLayout>
      <WorkflowManager />
    </PaddingLayout>
  );
}
