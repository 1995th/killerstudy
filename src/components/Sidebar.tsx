import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MiniTimer } from "@/components/MiniTimer";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from '@/lib/auth';
import {
  Target,
  LineChart,
  Upload,
  Bookmark,
  Users,
  Settings,
  Book,
  LogOut
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onTabChange: (tab: string) => void;
  activeTab: string;
}

export function Sidebar({ className, onTabChange, activeTab }: SidebarProps) {
  const { signOut } = useAuth();
  
  const navItems = [
    { value: "goals", label: "Goals", icon: Target },
    { value: "notes", label: "Notes", icon: Upload },
    { value: "flashcards", label: "Flashcards", icon: Bookmark },
    { value: "analytics", label: "Analytics", icon: LineChart },
    { value: "collaborate", label: "Collaborate", icon: Users },
    { value: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={cn("flex flex-col h-full border-r bg-background", className)}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-primary" />
            <span className="font-semibold">KillerStudy</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            variant="ghost"
            className={cn(
              "w-full justify-start",
              activeTab === value 
                ? "bg-primary/10 text-primary font-medium" 
                : "hover:bg-primary/5"
            )}
            onClick={() => onTabChange(value)}
          >
            <Icon className="h-5 w-5 mr-2" />
            {label}
          </Button>
        ))}
      </nav>
      {activeTab !== 'goals' && <MiniTimer />}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}