import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Shield,
  KeyRound,
  LogOut,
  Moon,
  Sun,
  UserX,
} from 'lucide-react';

interface MobileMoreMenuProps {
  onPasswordChange: () => void;
  onDeleteAccount: () => void;
}

export function MobileMoreMenu({ onPasswordChange, onDeleteAccount }: MobileMoreMenuProps) {
  const { signOut } = useAuth();

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">More Options</h2>
        <ThemeToggle />
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onPasswordChange}
        >
          <KeyRound className="mr-2 h-4 w-4" />
          Change Password
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={onDeleteAccount}
        >
          <UserX className="mr-2 h-4 w-4" />
          Delete Account
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}