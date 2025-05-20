
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
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              <div className="md:w-1/2 h-1/2 md:h-full overflow-hidden border-r border-border">
                <RequestPanel />
              </div>
              <div className="md:w-1/2 h-1/2 md:h-full overflow-hidden">
                <ResponsePanel />
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ApiProvider>
  );
};
