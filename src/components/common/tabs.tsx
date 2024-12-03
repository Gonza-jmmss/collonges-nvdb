import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  title: string;
  body: React.ReactNode;
}

interface TabsComponentProps {
  tabs: Tab[];
  className?: string;
  tabListClassName?: string;
}

export function TabsComponent({
  tabs,
  className,
  tabListClassName,
}: TabsComponentProps) {
  return (
    <Tabs
      defaultValue={tabs[0]?.id || ""}
      className={cn("w-[400px]", className)}
    >
      <TabsList
        className={cn("grid w-full", tabListClassName)}
        style={{
          gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
        }}
      >
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.body}
        </TabsContent>
      ))}
    </Tabs>
  );
}
