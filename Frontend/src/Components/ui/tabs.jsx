import React, { createContext, useContext, useState } from "react";
import { cn } from "@/libs/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";

const TabsContext = createContext();

const Tabs = React.forwardRef(({ defaultValue, className, children, ...props }, ref) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <TabsPrimitive.Root 
        value={activeTab} 
        onValueChange={setActiveTab}
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </TabsPrimitive.Root>
    </TabsContext.Provider>
  );
});
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex w-full h-12 items-center justify-center rounded-md bg-gray-800 p-1 mb-8",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(({ className, value, ...props }, ref) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  
  return (
    <button
      ref={ref}
      onClick={() => setActiveTab(value)}
      className={cn(
        "relative px-6 py-2 mx-1 text-sm font-medium transition-colors",
        "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        activeTab === value 
          ? "text-white before:absolute before:bottom-0 before:left-0 before:w-full before:h-1 before:bg-semored" 
          : "text-gray-300 hover:text-white",
        className
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(({ className, value, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    value={value}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };