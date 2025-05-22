'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Plus, Save, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkflowCanvas } from '@/components/workflows/workflow-canvas';
import { WorkflowSettings } from '@/components/workflows/workflow-settings';
import { ParsedStepInsert, Status, WithId } from '@getgrowly/core';
import { AddStepDialog } from '@/components/steps/add-step-dialog';
import { useDashboardState } from '@/hooks/use-dashboard';
import { suiteCore } from '@/core/suite';
import { toast } from 'react-toastify';
import { generateId } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useWorkflowDetailStore } from '@/hooks/use-workflow-details';
import { StepListView } from '@/components/steps/step-list-view';
import { generateBasicDeFiWorkflowSteps } from '@/lib/data/step-templates/basic-defi-workflow';
import { ExploreTemplateDialog } from '@/components/steps/explore-template-dialog';

const AnimatedLoadingSmall = dynamic(
  () =>
    import('@/components/animated-components/animated-loading-small').then(
      module => module.AnimatedLoadingSmall
    ),
  { ssr: false }
);

export default function WorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { fetchOrganizationWorkflowById, selectedOrganization } = useDashboardState();
  const [isExploreTemplateOpen, setIsExploreTemplateOpen] = useState(false);
  const { workflow, setWorkflow, addStep } = useWorkflowDetailStore();
  const [isAddStepOpen, setIsAddStepOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const paramsValue = React.use(params);

  const isNewWorkflow = paramsValue.id === 'new';

  const fetchWorkflow = async () => {
    if (!selectedOrganization) return;
    if (isNewWorkflow) {
      // Create a new workflow template
      setWorkflow({
        id: '',
        name: `Workflow ${generateId().toUpperCase()}`,
        description: '',
        organization_id: selectedOrganization.id,
        status: Status.Active,
        created_at: new Date().toISOString(),
        steps: [],
      });
    } else {
      const fetchedWorkflow = await fetchOrganizationWorkflowById(paramsValue.id);
      if (fetchedWorkflow) {
        setWorkflow(fetchedWorkflow);
      } else {
        // Handle workflow not found
        router.push('/dashboard/workflows');
      }
    }
  };

  const handleSave = async () => {
    if (!workflow || !selectedOrganization) {
      toast.error('Please select an organization');
      router.push('/organizations');
      return;
    }
    try {
      setSaving(true);
      const workflowPayload = {
        description: workflow.description,
        name: workflow.name,
        organization_id: selectedOrganization.id,
        status: workflow.status,
      };
      if (isNewWorkflow) {
        await suiteCore.db.workflows.create(workflowPayload);
      } else {
        await suiteCore.db.workflows.update(workflow.id, workflowPayload);
      }
      await suiteCore.steps.createStep(workflow.steps, workflow.id);
      toast.success(
        isNewWorkflow ? 'Workflow created successfully' : 'Workflow updated successfully'
      );
      // Redirect to the workflows page after saving
      if (isNewWorkflow) {
        router.push('/dashboard/workflows');
      }
    } catch (error) {
      toast.error('Failed to save workflow');
    } finally {
      setSaving(false);
    }
  };

  const handleAddStep = (step: WithId<ParsedStepInsert>) => {
    if (!workflow) return;
    addStep(step);
    setIsAddStepOpen(false);
  };

  const handleReset = async () => {
    try {
      setIsResetting(true);
      await fetchWorkflow();
    } catch (error) {
      toast.error('Failed to reset workflow');
    } finally {
      setIsResetting(false);
    }
  };

  useEffect(() => {
    async function init() {
      if (!selectedOrganization) {
        router.push('/organizations');
        toast.error('Please select an organization');
        return;
      }

      await fetchWorkflow();
      setLoading(false);
    }
    init();
  }, [paramsValue.id, selectedOrganization]);

  if (loading) {
    return <AnimatedLoadingSmall />;
  }

  if (!workflow) {
    return <div className="container mx-auto py-6">Workflow not found</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/workflows')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            {isNewWorkflow ? 'New Workflow' : `Edit: ${workflow.name}`}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsAddStepOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Step
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="canvas" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="canvas">Canvas</TabsTrigger>
            <TabsTrigger value="list">Step List</TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button disabled={isResetting} variant="outline" size={'sm'} onClick={handleReset}>
              {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Reset'}
            </Button>
            <ExploreTemplateDialog
              open={isExploreTemplateOpen}
              onOpenChange={setIsExploreTemplateOpen}
              onSelectTemplate={template => {
                setWorkflow({
                  ...workflow,
                  steps: template.steps,
                });
                setIsExploreTemplateOpen(false);
              }}
            />
          </div>
        </div>
        <TabsContent value="canvas" className="p-0">
          <WorkflowCanvas />
        </TabsContent>
        <TabsContent value="list">
          <StepListView steps={workflow.steps} />
        </TabsContent>
        <TabsContent value="settings">
          <WorkflowSettings />
        </TabsContent>
      </Tabs>
      <AddStepDialog
        workflowId={workflow.id}
        open={isAddStepOpen}
        onOpenChange={setIsAddStepOpen}
        onAdd={handleAddStep}
      />
    </div>
  );
}
