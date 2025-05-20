
import React from 'react';
import { useApi } from '@/contexts/ApiContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const TestCasesBar: React.FC = () => {
  const { 
    selectedEndpoint, 
    testCases, 
    selectedTestCase, 
    setSelectedTestCase 
  } = useApi();

  // Filter test cases for the selected endpoint
  const relevantTestCases = selectedEndpoint 
    ? testCases.filter(testCase => testCase.endpointId === selectedEndpoint.id)
    : [];

  if (!selectedEndpoint || relevantTestCases.length === 0) {
    return (
      <div className="h-14 flex items-center px-6 border-b border-border">
        <p className="text-muted-foreground text-sm">
          {!selectedEndpoint 
            ? 'Select an endpoint from the sidebar to view test cases'
            : 'No test cases available for this endpoint'}
        </p>
      </div>
    );
  }

  return (
    <div className="h-14 flex items-center px-4 border-b border-border overflow-x-auto">
      <h2 className="text-sm font-medium mr-4 text-muted-foreground whitespace-nowrap">
        Test Cases:
      </h2>
      
      <Tabs value={selectedTestCase?.id || ''} className="w-full">
        <TabsList className="bg-transparent h-10">
          {relevantTestCases.map(testCase => (
            <TabsTrigger
              key={testCase.id}
              value={testCase.id}
              onClick={() => setSelectedTestCase(testCase)}
              className={cn(
                "data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 rounded-none", 
                "data-[state=active]:border-primary data-[state=inactive]:border-transparent",
                "px-4 h-10"
              )}
            >
              <span className="mr-2">{testCase.name}</span>
              <Badge variant="outline" className={cn(
                "text-xs font-normal py-0 h-5",
                testCase.method === 'GET' && "bg-api-method-get/10 border-api-method-get text-api-method-get",
                testCase.method === 'POST' && "bg-api-method-post/10 border-api-method-post text-api-method-post",
                testCase.method === 'PUT' && "bg-api-method-put/10 border-api-method-put text-api-method-put",
                testCase.method === 'DELETE' && "bg-api-method-delete/10 border-api-method-delete text-api-method-delete",
                testCase.method === 'PATCH' && "bg-api-method-patch/10 border-api-method-patch text-api-method-patch"
              )}>
                {testCase.method}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
