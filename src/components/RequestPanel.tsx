
import React, { useState } from 'react';
import { useApi, HttpMethod } from '@/contexts/ApiContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export const RequestPanel: React.FC = () => {
  const {
    selectedEndpoint,
    currentMethod,
    currentHeaders,
    currentBody,
    currentQueryParams,
    setCurrentMethod,
    setCurrentHeaders,
    setCurrentBody,
    setCurrentQueryParams,
    sendRequest,
    loading
  } = useApi();
  
  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');
  const [newParamKey, setNewParamKey] = useState('');
  const [newParamValue, setNewParamValue] = useState('');
  const [activeTab, setActiveTab] = useState('params');

  // If no endpoint is selected, show a placeholder
  if (!selectedEndpoint) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <p className="text-muted-foreground">Select an endpoint from the sidebar to begin</p>
      </div>
    );
  }

  // Handle method change
  const handleMethodChange = (method: HttpMethod) => {
    setCurrentMethod(method);
    // Switch to body tab for methods that typically have a request body
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      setActiveTab('body');
    } else {
      setActiveTab('params');
    }
  };

  // Headers management
  const addHeader = () => {
    if (newHeaderKey.trim() && newHeaderValue.trim()) {
      setCurrentHeaders({
        ...currentHeaders,
        [newHeaderKey]: newHeaderValue
      });
      setNewHeaderKey('');
      setNewHeaderValue('');
    }
  };

  const removeHeader = (key: string) => {
    const updatedHeaders = { ...currentHeaders };
    delete updatedHeaders[key];
    setCurrentHeaders(updatedHeaders);
  };

  // Query params management
  const addQueryParam = () => {
    if (newParamKey.trim()) {
      setCurrentQueryParams({
        ...currentQueryParams,
        [newParamKey]: newParamValue
      });
      setNewParamKey('');
      setNewParamValue('');
    }
  };

  const removeQueryParam = (key: string) => {
    const updatedParams = { ...currentQueryParams };
    delete updatedParams[key];
    setCurrentQueryParams(updatedParams);
  };

  // Format JSON in the body textarea
  const formatJsonBody = () => {
    try {
      const parsed = JSON.parse(currentBody);
      setCurrentBody(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // If it's not valid JSON, don't change anything
      console.error('Invalid JSON format');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b border-border">
        <div className="flex space-x-2">
          {(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as HttpMethod[]).map(method => (
            <Badge
              key={method}
              variant="outline"
              className={cn(
                "cursor-pointer px-3 py-1.5 text-sm font-medium",
                currentMethod === method ? 'bg-card' : 'bg-transparent',
                method === 'GET' && "hover:border-api-method-get hover:text-api-method-get",
                method === 'POST' && "hover:border-api-method-post hover:text-api-method-post",
                method === 'PUT' && "hover:border-api-method-put hover:text-api-method-put",
                method === 'DELETE' && "hover:border-api-method-delete hover:text-api-method-delete",
                method === 'PATCH' && "hover:border-api-method-patch hover:text-api-method-patch",
                currentMethod === method && method === 'GET' && "border-api-method-get text-api-method-get",
                currentMethod === method && method === 'POST' && "border-api-method-post text-api-method-post",
                currentMethod === method && method === 'PUT' && "border-api-method-put text-api-method-put",
                currentMethod === method && method === 'DELETE' && "border-api-method-delete text-api-method-delete",
                currentMethod === method && method === 'PATCH' && "border-api-method-patch text-api-method-patch"
              )}
              onClick={() => handleMethodChange(method)}
            >
              {method}
            </Badge>
          ))}
        </div>
        
        <div className="flex-1 ml-4">
          <div className="flex items-center px-3 py-1.5 bg-card rounded-md text-sm">
            <div className="flex-shrink-0 text-muted-foreground mr-2">Path:</div>
            <div className="font-mono">{selectedEndpoint.path}</div>
          </div>
        </div>
        
        <Button 
          className="ml-4 text-sm flex items-center space-x-2 bg-primary hover:bg-primary/90"
          onClick={sendRequest}
          disabled={loading}
        >
          <Play className="h-4 w-4" />
          <span>{loading ? 'Sending...' : 'Send'}</span>
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="bg-transparent border-b border-border px-4">
          <TabsTrigger value="params">Query Params</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
        </TabsList>
        
        <TabsContent value="params" className="flex-1 flex flex-col p-4">
          <div className="mb-4 flex">
            <Input
              placeholder="Parameter name"
              value={newParamKey}
              onChange={(e) => setNewParamKey(e.target.value)}
              className="mr-2 flex-1"
            />
            <Input
              placeholder="Value"
              value={newParamValue}
              onChange={(e) => setNewParamValue(e.target.value)}
              className="mr-2 flex-1"
            />
            <Button 
              onClick={addQueryParam}
              variant="outline"
              className="flex items-center"
            >
              <Plus className="h-4 w-4" />
              <span className="ml-1">Add</span>
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto">
            {Object.entries(currentQueryParams).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(currentQueryParams).map(([key, value]) => (
                  <div key={key} className="flex items-center bg-card p-3 rounded-md">
                    <div className="flex-1 font-mono text-sm">
                      <span className="text-api-purple-light">{key}</span>
                      <span className="mx-2">=</span>
                      <span>{value}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeQueryParam(key)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                No query parameters added yet
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="headers" className="flex-1 flex flex-col p-4">
          <div className="mb-4 flex">
            <Input
              placeholder="Header name"
              value={newHeaderKey}
              onChange={(e) => setNewHeaderKey(e.target.value)}
              className="mr-2 flex-1"
            />
            <Input
              placeholder="Value"
              value={newHeaderValue}
              onChange={(e) => setNewHeaderValue(e.target.value)}
              className="mr-2 flex-1"
            />
            <Button 
              onClick={addHeader}
              variant="outline"
              className="flex items-center"
            >
              <Plus className="h-4 w-4" />
              <span className="ml-1">Add</span>
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto">
            {Object.entries(currentHeaders).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(currentHeaders).map(([key, value]) => (
                  <div key={key} className="flex items-center bg-card p-3 rounded-md">
                    <div className="flex-1 font-mono text-sm">
                      <span className="text-api-purple-light">{key}</span>
                      <span className="mx-2">:</span>
                      <span>{value}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeHeader(key)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                No headers added yet
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="body" className="flex-1 flex flex-col p-4">
          <div className="flex justify-end mb-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={formatJsonBody}
            >
              Format JSON
            </Button>
          </div>
          <Textarea
            placeholder="Enter request body (JSON)"
            value={currentBody}
            onChange={(e) => setCurrentBody(e.target.value)}
            className="flex-1 font-mono resize-none bg-card p-4"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
