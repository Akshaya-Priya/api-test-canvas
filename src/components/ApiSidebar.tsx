
import React from 'react';
import { useApi, ApiEndpoint } from '@/contexts/ApiContext';
import { 
  Sidebar, 
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// Group endpoints by category
const groupEndpointsByCategory = (endpoints: ApiEndpoint[]): Record<string, ApiEndpoint[]> => {
  return endpoints.reduce<Record<string, ApiEndpoint[]>>((acc, endpoint) => {
    if (!acc[endpoint.category]) {
      acc[endpoint.category] = [];
    }
    acc[endpoint.category].push(endpoint);
    return acc;
  }, {});
};

export const ApiSidebar: React.FC = () => {
  const { endpoints, selectedEndpoint, setSelectedEndpoint } = useApi();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
  const groupedEndpoints = groupEndpointsByCategory(endpoints);

  return (
    <Sidebar 
      className={cn("transition-all duration-300 border-r border-border", 
        collapsed ? "w-16" : "w-72")} 
      collapsible="icon"
    >
      <div className="p-4 flex items-center justify-between border-b border-border">
        <h2 className={cn("font-bold text-lg text-primary", collapsed ? "hidden" : "block")}>
          API Explorer
        </h2>
        <SidebarTrigger className="text-muted-foreground hover:text-primary" />
      </div>
      
      <SidebarContent className="py-2">
        {Object.entries(groupedEndpoints).map(([category, categoryEndpoints]) => (
          <SidebarGroup key={category}>
            <SidebarGroupLabel 
              className={cn("text-sm font-semibold", collapsed ? "justify-center" : "")}
            >
              {!collapsed && category}
              {collapsed && category.charAt(0)}
            </SidebarGroupLabel>
            
            <SidebarGroupContent>
              <SidebarMenu>
                {categoryEndpoints.map((endpoint) => (
                  <SidebarMenuItem key={endpoint.id}>
                    <SidebarMenuButton
                      onClick={() => setSelectedEndpoint(endpoint)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md transition-colors",
                        selectedEndpoint?.id === endpoint.id 
                          ? "bg-primary/20 text-primary hover:bg-primary/20" 
                          : "hover:bg-muted text-foreground/80 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center">
                        <div className={cn(
                          "w-2 h-2 rounded-full mr-2",
                          endpoint.path.includes('{id}') ? "bg-api-method-put" : "bg-api-method-get"
                        )} />
                        {!collapsed && (
                          <span className="truncate">{endpoint.name}</span>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};
