import { Card } from '@/components/ui/card';
import { Rocket } from 'lucide-react';

export function Collaboration() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Study Groups</h2>
      </div>

      <div className="relative min-h-[600px] rounded-lg overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-md bg-background/80 z-10">
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-8 max-w-2xl mx-auto px-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
                <Rocket className="h-24 w-24 text-primary relative animate-bounce" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl font-bold">Coming Soon!</h2>
                <p className="text-xl text-muted-foreground">
                  We're working hard to bring collaborative study features to KillerStudy.
                  Stay tuned for group study sessions, shared notes, and more!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}