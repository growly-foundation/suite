'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useDashboardState } from '@/hooks/use-dashboard';
import { CreateOrganizationDialog } from './create-organization-dialog';
import { AggregatedOrganization } from '@getgrowly/core';

export function OrganizationSelector() {
  const { organizations, setSelectedOrganization } = useDashboardState();
  const router = useRouter();

  const handleSelectOrg = (org: AggregatedOrganization) => {
    setSelectedOrganization(org);
    router.push('/dashboard');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Select Organization</h1>
        <p className="text-muted-foreground">Choose an organization to continue</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {organizations.map(org => (
          <Card
            key={org.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleSelectOrg(org)}>
            {/* Replace the card content with description instead of statistics */}
            <CardContent className="p-6">
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-lg">{org.name}</h3>
                  <p className="text-sm text-muted-foreground">Admin</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground line-clamp-2">{org.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <CreateOrganizationDialog />
      </div>
    </div>
  );
}
