'use client';

import type React from 'react';

import { useState } from 'react';
import { Code, FileText, Globe, Plus, Trash, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AggregatedAgent } from '@getgrowly/core';

interface AgentResourcesProps {
  agent: AggregatedAgent;
  onUpdate: (agent: AggregatedAgent) => void;
}

type ResourceType = 'contract' | 'link' | 'document';

interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  value: string;
  metadata?: any;
}

export function AgentResources({ agent, onUpdate }: AgentResourcesProps) {
  // Parse resources into a more structured format
  const [resources, setResources] = useState<Resource[]>(
    agent.resources.map(resource => {
      // Try to parse the resource string into a structured format
      try {
        return JSON.parse(resource);
      } catch {
        // If it's not JSON, assume it's a simple string resource
        return {
          id: '123',
          type: 'document',
          name: resource,
          value: resource,
        };
      }
    })
  );

  // Form states
  const [contractAddress, setContractAddress] = useState('');
  const [contractName, setContractName] = useState('');
  const [contractNetwork, setContractNetwork] = useState('ethereum');

  const [linkUrl, setLinkUrl] = useState('');
  const [linkName, setLinkName] = useState('');

  const [documentName, setDocumentName] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const handleAddContract = () => {
    if (!contractAddress || !contractName) return;

    const newResource: Resource = {
      id: '123',
      type: 'contract',
      name: contractName,
      value: contractAddress,
      metadata: {
        network: contractNetwork,
        abi: null, // This would be fetched from the blockchain in a real app
      },
    };

    const updatedResources = [...resources, newResource];
    setResources(updatedResources);

    // Update the agent with the new resources
    const updatedAgent = {
      ...agent,
      resources: updatedResources.map(r => JSON.stringify(r)),
    };
    onUpdate(updatedAgent);

    // Reset form
    setContractAddress('');
    setContractName('');
  };

  const handleAddLink = () => {
    if (!linkUrl) return;

    const newResource: Resource = {
      id: '123',
      type: 'link',
      name: linkName || linkUrl,
      value: linkUrl,
      metadata: {
        crawled: false,
      },
    };

    const updatedResources = [...resources, newResource];
    setResources(updatedResources);

    // Update the agent with the new resources
    const updatedAgent = {
      ...agent,
      resources: updatedResources.map(r => JSON.stringify(r)),
    };
    onUpdate(updatedAgent);

    // Reset form
    setLinkUrl('');
    setLinkName('');
  };

  const handleAddDocument = () => {
    if ((!documentContent && !documentFile) || !documentName) return;

    const newResource: Resource = {
      id: '123',
      type: 'document',
      name: documentName,
      value: documentContent || (documentFile ? documentFile.name : ''),
      metadata: {
        fileType: documentFile?.type,
        fileName: documentFile?.name,
      },
    };

    const updatedResources = [...resources, newResource];
    setResources(updatedResources);

    // Update the agent with the new resources
    const updatedAgent = {
      ...agent,
      resources: updatedResources.map(r => JSON.stringify(r)),
    };
    onUpdate(updatedAgent);

    // Reset form
    setDocumentName('');
    setDocumentContent('');
    setDocumentFile(null);
  };

  const handleRemoveResource = (resourceId: string) => {
    const updatedResources = resources.filter(r => r.id !== resourceId);
    setResources(updatedResources);

    // Update the agent with the new resources
    const updatedAgent = {
      ...agent,
      resources: updatedResources.map(r => JSON.stringify(r)),
    };
    onUpdate(updatedAgent);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocumentFile(file);

      // If no name is provided, use the file name
      if (!documentName) {
        setDocumentName(file.name);
      }
    }
  };

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'contract':
        return <Code className="h-4 w-4" />;
      case 'link':
        return <Globe className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent Resources</CardTitle>
          <CardDescription>
            Manage the resources this agent can access, including smart contracts, links, and
            documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No resources added to this agent</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resources.map(resource => (
                <div
                  key={resource.id}
                  className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getResourceIcon(resource.type)}</div>
                    <div className="space-y-1">
                      <div className="font-medium">{resource.name}</div>
                      <p className="text-sm text-muted-foreground break-all">{resource.value}</p>
                      <Badge variant="outline" className="mt-1">
                        {resource.type}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveResource(resource.id)}
                    className="text-muted-foreground hover:text-destructive">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Resources</CardTitle>
          <CardDescription>
            Add new resources for the agent to access and learn from.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="contract" className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="contract" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Smart Contract
              </TabsTrigger>
              <TabsTrigger value="link" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Link
              </TabsTrigger>
              <TabsTrigger value="document" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Document
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contract" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contract-name">Contract Name</Label>
                    <Input
                      id="contract-name"
                      value={contractName}
                      onChange={e => setContractName(e.target.value)}
                      placeholder="My ERC20 Token"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract-network">Network</Label>
                    <select
                      id="contract-network"
                      value={contractNetwork}
                      onChange={e => setContractNetwork(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="ethereum">Ethereum</option>
                      <option value="polygon">Polygon</option>
                      <option value="arbitrum">Arbitrum</option>
                      <option value="optimism">Optimism</option>
                      <option value="base">Base</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract-address">Contract Address</Label>
                  <Input
                    id="contract-address"
                    value={contractAddress}
                    onChange={e => setContractAddress(e.target.value)}
                    placeholder="0x..."
                  />
                </div>
                <Button
                  onClick={handleAddContract}
                  disabled={!contractAddress || !contractName}
                  className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contract
                </Button>
                <div className="text-xs text-muted-foreground mt-2">
                  <p>
                    The contract ABI will be automatically fetched and parsed for the agent to learn
                    from.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="link" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="link-name">Link Name (Optional)</Label>
                  <Input
                    id="link-name"
                    value={linkName}
                    onChange={e => setLinkName(e.target.value)}
                    placeholder="Documentation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    value={linkUrl}
                    onChange={e => setLinkUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <Button onClick={handleAddLink} disabled={!linkUrl} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Link
                </Button>
                <div className="text-xs text-muted-foreground mt-2">
                  <p>
                    Links will be crawled using Firecrawl MCP to extract relevant context for the
                    agent.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="document" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document-name">Document Name</Label>
                  <Input
                    id="document-name"
                    value={documentName}
                    onChange={e => setDocumentName(e.target.value)}
                    placeholder="API Documentation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document-file">Upload File</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="document-file"
                      type="file"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document-content">Or Enter Content</Label>
                  <Textarea
                    id="document-content"
                    value={documentContent}
                    onChange={e => setDocumentContent(e.target.value)}
                    placeholder="Enter document content..."
                    rows={5}
                  />
                </div>
                <Button
                  onClick={handleAddDocument}
                  disabled={(!documentContent && !documentFile) || !documentName}
                  className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Document
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
