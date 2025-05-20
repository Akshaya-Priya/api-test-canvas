
import React from 'react';
import { ApiProvider } from '@/contexts/ApiContext';
import { ApiSidebar } from '@/components/ApiSidebar';
import { TestCasesBar } from '@/components/TestCasesBar';
import { RequestPanel } from '@/components/RequestPanel';
import { ResponsePanel } from '@/components/ResponsePanel';
import { SidebarProvider } from '@/components/ui/sidebar';

export const ApiDashboard: React.FC = () => {
  return (
    <ApiProvider>
      <SidebarProvider>
        <div className="h-screen flex bg-api-dark text-foreground overflow-hidden">
          <ApiSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TestCasesBar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="h-1/2 overflow-hidden border-b border-border">
                <RequestPanel />
              </div>
              <div className="h-1/2 overflow-hidden">
                <ResponsePanel />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ApiProvider>
  );
};
