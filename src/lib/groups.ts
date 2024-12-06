import { supabase } from './supabase';
import type { StudyGroup, GroupMember } from './types';

export async function fetchStudyGroups(userId: string) {
  try {
    const { data, error } = await supabase
      .from('study_groups')
      .select(`
        *,
        members:study_group_members(count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      createdBy: group.created_by,
      createdAt: new Date(group.created_at),
      memberCount: group.members[0].count,
    })) as StudyGroup[];
  } catch (error) {
    console.error('Error fetching study groups:', error);
    throw error;
  }
}

export async function createStudyGroup(
  userId: string,
  name: string,
  description: string
) {
  try {
    // Create the group
    const { data: group, error: groupError } = await supabase
      .from('study_groups')
      .insert([
        {
          name,
          description,
          created_by: userId,
        },
      ])
      .select()
      .single();

    if (groupError) throw groupError;

    // Auto-join the creator to the group
    const { error: memberError } = await supabase
      .from('study_group_members')
      .insert([
        {
          group_id: group.id,
          user_id: userId,
        },
      ]);

    if (memberError) throw memberError;

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      createdBy: group.created_by,
      createdAt: new Date(group.created_at),
      memberCount: 1,
    } as StudyGroup;
  } catch (error) {
    console.error('Error creating study group:', error);
    throw error;
  }
}

export async function deleteStudyGroup(userId: string, groupId: string) {
  try {
    const { error } = await supabase
      .from('study_groups')
      .delete()
      .eq('id', groupId)
      .eq('created_by', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting study group:', error);
    throw error;
  }
}

export async function fetchGroupMembers(groupId: string): Promise<GroupMember[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_group_members', {
        p_group_id: groupId
      });

    if (error) throw error;

    return data.map(member => ({
      id: member.user_id,
      username: member.username,
      joinedAt: new Date(member.joined_at)
    }));
  } catch (error) {
    console.error('Error fetching group members:', error);
    throw error;
  }
}

export async function joinGroup(userId: string, groupId: string) {
  try {
    const { error } = await supabase
      .from('study_group_members')
      .insert([
        {
          group_id: groupId,
          user_id: userId,
        },
      ]);

    if (error) throw error;
  } catch (error) {
    console.error('Error joining group:', error);
    throw error;
  }
}

export async function leaveGroup(userId: string, groupId: string) {
  try {
    const { error } = await supabase
      .from('study_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error leaving group:', error);
    throw error;
  }
}