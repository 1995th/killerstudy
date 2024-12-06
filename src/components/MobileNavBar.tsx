import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Target,
  LineChart,
  Upload,
  Bookmark,
  Users,
  Settings,
} from "lucide-react";

interface MobileNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MobileNavBar({ activeTab, onTabChange }: MobileNavBarProps) {
  const navItems = [
    { value: "goals", label: "Goals", icon: Target },
    { value: "notes", label: "Notes", icon: Upload },
    { value: "flashcards", label: "Cards", icon: Bookmark },
    { value: "analytics", label: "Stats", icon: LineChart },
    { value: "collaborate", label: "Groups", icon: Users },
    { value: "settings", label: "More", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t z-50">
      <div className="grid grid-cols-6 gap-1 p-2">
        {navItems.map((item) => (
          <Button
            key={item.value}
            variant="ghost"
            size="sm"
            className={cn(
              "flex flex-col items-center justify-center h-16 space-y-1 rounded-lg",
              activeTab === item.value 
                ? "bg-primary/10 text-primary"
                : "hover:bg-primary/5"
            )}
            onClick={() => onTabChange(item.value)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}