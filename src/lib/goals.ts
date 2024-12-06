import { supabase } from './supabase';
import type { Goal } from './types';

export async function fetchGoals(userId: string): Promise<Goal[]> {
  try {
    const { data, error } = await supabase
      .from('study_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(goal => ({
      id: goal.id,
      content: goal.content,
      completed: goal.completed,
      createdAt: new Date(goal.created_at)
    }));
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
}

export async function createGoal(userId: string, content: string): Promise<Goal> {
  try {
    const { data, error } = await supabase
      .from('study_goals')
      .insert([{
        user_id: userId,
        content,
        completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      content: data.content,
      completed: data.completed,
      createdAt: new Date(data.created_at)
    };
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
}

export async function completeGoal(userId: string, goalId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('study_goals')
      .update({
        completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error completing goal:', error);
    throw error;
  }
}

export async function deleteGoal(userId: string, goalId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('study_goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
}