import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDashboardState } from '@/hooks/use-dashboard';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export const CreateOrganizationDialog = () => {
  const router = useRouter();
  const { createOrganization, setSelectedOrganization } = useDashboardState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDescription, setNewOrgDescription] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleCreateOrg = async () => {
    try {
      setLoading(true);
      const organization = await createOrganization(newOrgName, newOrgDescription);
      setSelectedOrganization(organization);
      setLoading(false);
      setIsDialogOpen(false);
      toast.success('Organization created successfully');
      router.push(`/dashboard/${organization.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create organization');
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-dashed">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-full space-y-2">
              <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center">
                <Plus className="h-5 w-5" />
              </div>
              <div className="text-center">
                <h3 className="font-medium">Create Organization</h3>
                <p className="text-sm text-muted-foreground">Start a new workspace</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new organization</DialogTitle>
          <DialogDescription>
            Add a new organization to manage projects and team members.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization name</Label>
            <Input
              id="org-name"
              placeholder="Example: DeFi Lover"
              value={newOrgName}
              onChange={e => setNewOrgName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-description">Organization description</Label>
            <Input
              id="org-description"
              placeholder="Example: Group of people who are interested in DeFi"
              value={newOrgDescription}
              onChange={e => setNewOrgDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateOrg} disabled={!newOrgName.trim() || isLoading}>
            {isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
