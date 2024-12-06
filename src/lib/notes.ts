import { supabase } from './supabase';
import type { Note } from './types';

export async function fetchNotes(userId: string) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(note => ({
      ...note,
      createdAt: new Date(note.created_at)
    })) as Note[];
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
}

export async function createNote(userId: string, note: Omit<Note, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .insert([{
        user_id: userId,
        title: note.title,
        content: note.content,
        tags: note.tags,
        created_at: note.createdAt.toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      createdAt: new Date(data.created_at)
    } as Note;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
}

export async function updateNote(userId: string, noteId: string, updates: Partial<Note>) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .update({
        title: updates.title,
        content: updates.content,
        tags: updates.tags,
        updated_at: new Date().toISOString(),
      })
      .eq('id', noteId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      createdAt: new Date(data.created_at)
    } as Note;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
}

export async function deleteNote(userId: string, noteId: string) {
  try {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}