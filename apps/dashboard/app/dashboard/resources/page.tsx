'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, FileText, Upload, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

import { PaddingLayout } from '../layout';

export default function ResourcesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    'company-handbook.pdf',
    'product-documentation.pdf',
    'customer-support-guide.pdf',
    'sales-playbook.pdf',
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (files.length === 0) return;

    setIsUploading(true);

    // Simulate upload
    setTimeout(() => {
      setUploadedFiles(prev => [...prev, ...files.map(file => file.name)]);
      setFiles([]);
      setIsUploading(false);
    }, 1500);
  };

  const deleteDocument = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <PaddingLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Resources
          </h1>
          <p className="text-muted-foreground mt-1">Upload documents to train your agent</p>
        </div>

        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger
                  value="upload"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Upload className="mr-2 h-4 w-4" /> Upload Documents
                </TabsTrigger>
                <TabsTrigger
                  value="manage"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <FileText className="mr-2 h-4 w-4" /> Manage Documents
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <Card className="border-dashed border-2 border-muted">
                  <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="p-4 rounded-full bg-blue-50">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Drag and drop files here</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          or click to browse files from your computer
                        </p>
                      </div>
                      <Input
                        type="file"
                        multiple
                        className="hidden"
                        id="file-upload"
                        onChange={handleFileChange}
                      />
                      <Label
                        htmlFor="file-upload"
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md cursor-pointer">
                        Browse Files
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Supported formats: PDF, DOCX, TXT, CSV (max 10MB per file)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {files.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Selected Files</h3>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => removeFile(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        className="bg-primary hover:bg-primary/90 text-white"
                        onClick={handleUpload}
                        disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Upload Files'}
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="manage" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Uploaded Documents</h3>
                    <p className="text-sm text-muted-foreground">
                      {uploadedFiles.length} document{uploadedFiles.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {uploadedFiles.length > 0 ? (
                    <div className="space-y-2">
                      {uploadedFiles.map((fileName, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{fileName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Uploaded on {new Date().toLocaleDateString()}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive"
                              onClick={() => deleteDocument(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">No documents uploaded yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PaddingLayout>
  );
}
