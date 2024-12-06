import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { fetchGroupMembers } from '@/lib/groups';
import { toast } from 'sonner';
import type { GroupMember } from '@/lib/types';

interface GroupMembersProps {
  groupId: string;
}

export function GroupMembers({ groupId }: GroupMembersProps) {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, [groupId]);

  const loadMembers = async () => {
    try {
      const groupMembers = await fetchGroupMembers(groupId);
      setMembers(groupMembers);
    } catch (error) {
      toast.error('Failed to load group members');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">Group Members ({members.length})</h3>
      <ScrollArea className="h-[200px]">
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {member.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{member.username}</p>
                <p className="text-xs text-muted-foreground">
                  Joined {member.joinedAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}