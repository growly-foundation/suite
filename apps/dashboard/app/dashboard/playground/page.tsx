import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Code, Play, Sparkles } from 'lucide-react';

export default function PlaygroundPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Playground
        </h1>
        <p className="text-muted-foreground mt-1">Test and experiment with AI capabilities</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger
                value="chat"
                className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Bot className="mr-2 h-4 w-4" /> Chat
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Code className="mr-2 h-4 w-4" /> Code Generation
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-6 h-[400px] overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex-1 bg-white p-3 rounded-xl shadow-sm">
                      <p>Hello! I'm your AI assistant. How can I help you today?</p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="flex-1 bg-blue-50 p-3 rounded-xl">
                      <p>Can you help me create a workflow for customer onboarding?</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">You</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex-1 bg-white p-3 rounded-xl shadow-sm">
                      <p>
                        I'd be happy to help you create a customer onboarding workflow! Here's a
                        suggested structure:
                      </p>
                      <ol className="list-decimal pl-5 mt-2 space-y-1">
                        <li>Welcome email with account activation</li>
                        <li>Profile completion reminder</li>
                        <li>Product tour invitation</li>
                        <li>First task completion guidance</li>
                        <li>Follow-up check-in after 7 days</li>
                      </ol>
                      <p className="mt-2">Would you like me to elaborate on any of these steps?</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Textarea placeholder="Type your message..." className="resize-none" />
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="code" className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-6 h-[400px] overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex-1 bg-white p-3 rounded-xl shadow-sm">
                      <p>I can help you generate code. What would you like to create?</p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="flex-1 bg-blue-50 p-3 rounded-xl">
                      <p>Generate a React component for a workflow step card</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-medium">You</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex-1 bg-white p-3 rounded-xl shadow-sm">
                      <p>Here's a React component for a workflow step card:</p>
                      <pre className="bg-muted p-3 rounded-md mt-2 overflow-x-auto text-xs">
                        {`import React from 'react';

const WorkflowStepCard = ({ 
  title, 
  description, 
  status, 
  stepNumber, 
  isActive 
}) => {
  return (
    <div className={\`p-4 rounded-xl border \${
      isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
    }\`}>
      <div className="flex items-center gap-3">
        <div className={\`w-8 h-8 rounded-full flex items-center justify-center \${
          isActive ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }\`}>
          {stepNumber}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="ml-auto">
          <span className={\`px-2 py-1 text-xs rounded-full \${
            status === 'completed' 
              ? 'bg-green-100 text-green-800' 
              : status === 'in-progress'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }\`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorkflowStepCard;`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Textarea placeholder="Describe the code you need..." className="resize-none" />
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
