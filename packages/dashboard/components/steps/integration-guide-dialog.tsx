'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { AggregatedAgent, AggregatedWorkflow } from '@getgrowly/core';

interface IntegrationGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: AggregatedAgent;
}

export function IntegrationGuideDialog({ open, onOpenChange, agent }: IntegrationGuideDialogProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const providerCode = `
import { SuiteProvider } from '@getgrowly/suite';

export default function App({ Component, pageProps }) {
  return (
    <SuiteProvider context={{
        agentId: ${agent.id},
        organizationApiKey: ${agent.organization_id},
        config: {
          display: 'fullView',
        },
      }}>
      <IntegrationWidget />
    </SuiteProvider>
  );
}
  `.trim();

  const widgetCode = `
import { ChatWidget } from '@getgrowly/suite';

export default function IntegrationWidget() {
  return (
    <div>
      <ChatWidget />
    </div>
  );
}
  `.trim();

  const stepCode = `
// Example for a button that triggers a step
<div 
  data-growly="${agent.workflows && agent.workflows.length > 0 ? agent.workflows[0].id : 'workflow-id'}"
>
  Click me to trigger the step
</div>
  `.trim();

  const npmInstallCode = `npm install @getgrowly/suite`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Integration Guide</DialogTitle>
          <DialogDescription>
            Follow these steps to integrate this workflow into your application using the
            @getgrowly/suite package.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Tabs defaultValue="install" className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="install">Installation</TabsTrigger>
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="install" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Install the package</h3>
                <div className="relative">
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                    <code>{npmInstallCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(npmInstallCode)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="setup" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Add SuiteProvider to your app</h3>
                <p className="text-sm text-muted-foreground">
                  Add the SuiteProvider to your _app.js or _app.tsx file (Next.js) or main layout
                  component.
                </p>
                <div className="relative">
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                    <code>{providerCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(providerCode)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Add ChatWidget to your layout</h3>
                <p className="text-sm text-muted-foreground">
                  Add the ChatWidget component to your layout to enable chat interactions.
                </p>
                <div className="relative">
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                    <code>{widgetCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(widgetCode)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="usage" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Trigger steps with data-growly attribute</h3>
                <p className="text-sm text-muted-foreground">
                  Add the data-growly attribute to HTML elements to trigger steps based on user
                  interactions.
                </p>
                <div className="relative">
                  <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                    <code>{stepCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(stepCode)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Agent Details</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                  <p>
                    <strong>Agent ID:</strong> {agent.id}
                  </p>
                  <p>
                    <strong>Name:</strong> {agent.name}
                  </p>
                  <p>
                    <strong>Workflows:</strong> {agent.workflows?.length || 0}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
