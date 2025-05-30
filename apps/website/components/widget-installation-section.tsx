'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { BookOpen, Check, Code, Copy, Package } from 'lucide-react';
import { useState } from 'react';

// Terminal command component for displaying installation commands
function TerminalCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative font-mono text-sm rounded-md bg-muted p-4 overflow-x-auto">
      <div className="flex items-center absolute right-4 top-3.5 h-5">
        <button
          onClick={copyToClipboard}
          className="p-1 rounded-md bg-transparent hover:bg-muted-foreground/20 transition-colors"
          aria-label="Copy code">
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
      </div>
      <pre className="text-sm">
        <code>
          <span className="text-muted-foreground">$</span> {command}
        </code>
      </pre>
    </div>
  );
}

// Simple code block component for displaying code snippets
function SimpleCodeBlock({
  code,
  filename,
  language,
  showLineNumbers = false,
}: {
  code: string;
  filename?: string;
  language: string;
  showLineNumbers?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-md bg-muted overflow-hidden">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/80">
          <span className="text-xs font-medium">{filename}</span>
          <span className="text-xs text-muted-foreground">{language}</span>
        </div>
      )}
      <div className="relative">
        <div className="absolute right-4 top-3.5 z-10">
          <button
            onClick={copyToClipboard}
            className="p-1 rounded-md bg-background/80 hover:bg-background transition-colors"
            aria-label="Copy code">
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm">
          <code className="language-{language}">
            {showLineNumbers
              ? code.split('\n').map((line, i) => (
                  <div key={i} className="table-row">
                    <span className="table-cell pr-4 text-right select-none text-muted-foreground text-xs">
                      {i + 1}
                    </span>
                    <span className="table-cell">{line}</span>
                  </div>
                ))
              : code}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default function DemoInstallationSection() {
  const installCommands = {
    npm: 'npm install @getgrowly/suite',
    yarn: 'yarn add @getgrowly/suite',
    pnpm: 'pnpm add @getgrowly/suite',
  };

  const codeSnippet = `import { GrowlyAssistant, GrowlyComponent } from '@getgrowly/suite';
import { SuiteProvider, ChatWidget } from '@getgrowly/suite';
import '@getgrowly/suite/dist/styles.css';

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SuiteProvider
      context={{
        agentId: AGENT_ID,
        organizationApiKey: ORGANIZATION_ID,
        config: {
          display: 'fullView',
        },
      }}>
      {children}
      <ChatWidget />
    </SuiteProvider>
  );
};
`;

  return (
    <section className="max-sm:hidden w-full py-6 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start">
          {/* Video Demo Section */}
          <div className="flex flex-col space-y-4">
            <motion.h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}>
              See it in action
            </motion.h2>
            <motion.p
              className="text-muted-foreground md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}>
              Watch how Suite seamlessly integrates with your DeFi application
            </motion.p>
            <motion.div
              className="overflow-hidden rounded-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}>
              <video
                src="/videos/widget-guide.mp4"
                style={{ marginTop: 20 }}
                height={'100%'}
                autoPlay
                loop
                muted
              />
            </motion.div>
          </div>
          {/* Installation Steps Section */}
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between space-y-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Quick Installation
                </h2>
                <p className="text-muted-foreground mt-3">
                  Get up and running in minutes with these simple steps
                </p>
              </div>
              <div>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button disabled>
                    <BookOpen className="mr-2 h-4 w-4" /> View Documentation
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Package className="h-4 w-4" />
                  </div>
                  <h3 className="text-xl font-bold">1. Install the package</h3>
                </div>
                <br />
                <Tabs defaultValue="npm" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="npm">npm</TabsTrigger>
                    <TabsTrigger value="yarn">yarn</TabsTrigger>
                    <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                  </TabsList>
                  {Object.entries(installCommands).map(([pkg, command]) => (
                    <TabsContent key={pkg} value={pkg} className="mt-2">
                      <TerminalCommand command={command} />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
              <br />
              {/* Step 2 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Code className="h-4 w-4" />
                  </div>
                  <h3 className="text-xl font-bold">2. Add to your project</h3>
                </div>
                <br />
                <SimpleCodeBlock
                  code={codeSnippet}
                  filename="app/page.tsx"
                  language="jsx"
                  showLineNumbers={true}
                />
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
