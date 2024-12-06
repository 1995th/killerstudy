import { Book } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  return (
    <div className={cn("sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Book className="h-6 w-6 text-primary" />
          <span className="font-semibold">KillerStudy</span>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}