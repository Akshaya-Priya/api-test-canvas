
import React, { useEffect, useRef } from 'react';
import { useApi } from '@/contexts/ApiContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Helper function to syntax highlight JSON
const JsonViewer: React.FC<{ json: any }> = ({ json }) => {
  const formatValue = (value: any, indent: number): JSX.Element => {
    const indentString = '  '.repeat(indent);
    
    if (value === null) {
      return <span className="json-viewer-null">null</span>;
    } else if (typeof value === 'string') {
      return <span className="json-viewer-string">"{value}"</span>;
    } else if (typeof value === 'number') {
      return <span className="json-viewer-number">{value}</span>;
    } else if (typeof value === 'boolean') {
      return <span className="json-viewer-boolean">{value.toString()}</span>;
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span>[]</span>;
      }
      
      return (
        <span>
          [
          {value.map((item, index) => (
            <React.Fragment key={index}>
              <br />
              {indentString}  {formatValue(item, indent + 1)}
              {index < value.length - 1 && ','}
            </React.Fragment>
          ))}
          <br />
          {indentString}]
        </span>
      );
    } else if (typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) {
        return <span>{'{}'}</span>;
      }
      
      return (
        <span>
          {'{'}
          {entries.map(([key, val], index) => (
            <React.Fragment key={key}>
              <br />
              {indentString}  <span className="json-viewer-key">"{key}"</span>: {formatValue(val, indent + 1)}
              {index < entries.length - 1 && ','}
            </React.Fragment>
          ))}
          <br />
          {indentString}{'}'}
        </span>
      );
    }
    
    return <span>{String(value)}</span>;
  };

  try {
    const parsedJson = typeof json === 'string' ? JSON.parse(json) : json;
    return <div className="json-viewer">{formatValue(parsedJson, 0)}</div>;
  } catch (error) {
    return <div className="text-destructive">Invalid JSON</div>;
  }
};

export const ResponsePanel: React.FC = () => {
  const { apiResponse, loading } = useApi();
  const responseRef = useRef<HTMLDivElement>(null);
  
  // Scroll to top when response changes
  useEffect(() => {
    if (apiResponse && responseRef.current) {
      responseRef.current.scrollTop = 0;
    }
  }, [apiResponse]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Sending request...</p>
      </div>
    );
  }

  if (!apiResponse) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <p className="text-muted-foreground">
          Send a request to see the response here
        </p>
      </div>
    );
  }

  const getStatusColor = (status: number) => {
    if (status < 300) return 'bg-api-method-post text-white';
    if (status < 400) return 'bg-api-method-put text-white';
    return 'bg-api-method-delete text-white';
  };

  return (
    <div ref={responseRef} className="h-full flex flex-col overflow-auto">
      <div className="border-b border-border p-4 flex flex-wrap gap-4 items-center">
        <Badge className={cn("text-sm py-1 px-3", getStatusColor(apiResponse.status))}>
          {apiResponse.status} {apiResponse.statusText}
        </Badge>
        
        <div className="text-sm text-muted-foreground">
          Time: <span className="text-foreground font-medium">{apiResponse.responseTime} ms</span>
        </div>
        
        <div className="text-sm text-muted-foreground ml-auto">
          Size: <span className="text-foreground font-medium">
            {JSON.stringify(apiResponse.body).length} bytes
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-sm text-muted-foreground mb-2">Response Headers:</h3>
            <div className="bg-card rounded-md p-3">
              {Object.entries(apiResponse.headers).length > 0 ? (
                <div className="space-y-1">
                  {Object.entries(apiResponse.headers).map(([key, value]) => (
                    <div key={key} className="font-mono text-sm">
                      <span className="text-api-purple-light">{key}</span>
                      <span className="mx-2">:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No headers</div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm text-muted-foreground mb-2">Response Body:</h3>
            <div className="bg-card rounded-md p-3 overflow-auto">
              <JsonViewer json={apiResponse.body} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
