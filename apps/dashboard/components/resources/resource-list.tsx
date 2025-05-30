'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, FileText, Globe, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

type ResourceType = 'contract' | 'link' | 'document' | 'all';

// Mock resources data
const mockResources = [
  {
    id: 'res-1',
    type: 'contract',
    name: 'ERC20 Token',
    value: '0x1234567890abcdef1234567890abcdef12345678',
    metadata: {
      network: 'ethereum',
      createdAt: '2023-05-15T10:30:00Z',
      updatedAt: '2023-05-15T10:30:00Z',
    },
  },
  {
    id: 'res-2',
    type: 'contract',
    name: 'NFT Collection',
    value: '0xabcdef1234567890abcdef1234567890abcdef12',
    metadata: {
      network: 'polygon',
      createdAt: '2023-06-10T14:20:00Z',
      updatedAt: '2023-06-10T14:20:00Z',
    },
  },
  {
    id: 'res-3',
    type: 'link',
    name: 'API Documentation',
    value: 'https://api.example.com/docs',
    metadata: {
      crawled: true,
      lastCrawled: '2023-07-05T09:15:00Z',
      createdAt: '2023-07-05T09:15:00Z',
      updatedAt: '2023-07-05T09:15:00Z',
    },
  },
  {
    id: 'res-4',
    type: 'link',
    name: 'GitHub Repository',
    value: 'https://github.com/example/repo',
    metadata: {
      crawled: true,
      lastCrawled: '2023-07-10T11:30:00Z',
      createdAt: '2023-07-10T11:30:00Z',
      updatedAt: '2023-07-10T11:30:00Z',
    },
  },
  {
    id: 'res-5',
    type: 'document',
    name: 'Technical Whitepaper',
    value: 'whitepaper.pdf',
    metadata: {
      fileType: 'application/pdf',
      fileSize: '1.2 MB',
      createdAt: '2023-08-01T15:45:00Z',
      updatedAt: '2023-08-01T15:45:00Z',
    },
  },
  {
    id: 'res-6',
    type: 'document',
    name: 'User Guide',
    value: 'user-guide.docx',
    metadata: {
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      fileSize: '850 KB',
      createdAt: '2023-08-15T13:20:00Z',
      updatedAt: '2023-08-15T13:20:00Z',
    },
  },
];

export function ResourcesList() {
  const [activeTab, setActiveTab] = useState<ResourceType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter resources based on active tab and search query
  const filteredResources = mockResources.filter(resource => {
    const matchesType = activeTab === 'all' || resource.type === activeTab;
    const matchesSearch =
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.value.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'contract':
        return <Code className="h-4 w-4" />;
      case 'link':
        return <Globe className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={value => setActiveTab(value as ResourceType)}
          className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="contract">Contracts</TabsTrigger>
              <TabsTrigger value="link">Links</TabsTrigger>
              <TabsTrigger value="document">Documents</TabsTrigger>
            </TabsList>
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-[250px]"
            />
          </div>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4">
              {filteredResources.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No resources found</p>
                </div>
              ) : (
                filteredResources.map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="contract" className="mt-6">
            <div className="grid gap-4">
              {filteredResources.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No contracts found</p>
                </div>
              ) : (
                filteredResources.map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="link" className="mt-6">
            <div className="grid gap-4">
              {filteredResources.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No links found</p>
                </div>
              ) : (
                filteredResources.map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="document" className="mt-6">
            <div className="grid gap-4">
              {filteredResources.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No documents found</p>
                </div>
              ) : (
                filteredResources.map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface ResourceCardProps {
  resource: any;
}

function ResourceCard({ resource }: ResourceCardProps) {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'contract':
        return <Code className="h-4 w-4" />;
      case 'link':
        return <Globe className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{getResourceIcon(resource.type)}</div>
            <div className="space-y-1">
              <div className="font-medium">{resource.name}</div>
              <p className="text-sm text-muted-foreground break-all">{resource.value}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{resource.type}</Badge>
                {resource.type === 'contract' && (
                  <Badge variant="outline">{resource.metadata.network}</Badge>
                )}
                {resource.type === 'link' && resource.metadata.crawled && (
                  <Badge variant="outline">crawled</Badge>
                )}
                {resource.type === 'document' && (
                  <Badge variant="outline">{resource.metadata.fileType.split('/')[1]}</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">
              Updated {formatDate(resource.metadata.updatedAt)}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
