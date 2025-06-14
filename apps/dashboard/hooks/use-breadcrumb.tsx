import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useDashboardState } from './use-dashboard';

export interface BreadcrumbItem {
  title: string;
  href: string;
  active: boolean;
}

export const useBreadcrumbLoad = () => {
  const { selectedAgent, organizationWorkflows } = useDashboardState();
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    const currentBreadcrumbs: BreadcrumbItem[] = [];
    const paths = pathname.split('/');
    for (let i = 0; i < paths.length; i++) {
      const latestBreadcrumb = currentBreadcrumbs[currentBreadcrumbs.length - 1];
      const href = paths.slice(0, i + 1).join('/');
      const active = i === paths.length - 1;

      let title = paths[i].charAt(0).toUpperCase() + paths[i].slice(1);
      if (latestBreadcrumb) {
        if (latestBreadcrumb.title === 'Agents') {
          title = selectedAgent?.name || 'Unknown Agent';
        } else if (latestBreadcrumb.title === 'Workflows') {
          const workflowId = paths[i];
          const workflow = organizationWorkflows.find(w => w.id === workflowId);
          title = workflow?.name || 'Unknown Workflow';
        }
      }
      currentBreadcrumbs.push({
        title,
        href,
        active,
      });
    }
    setBreadcrumbs(currentBreadcrumbs);
  }, [pathname, selectedAgent, organizationWorkflows]);

  return {
    breadcrumbs,
  };
};
