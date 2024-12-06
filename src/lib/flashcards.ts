import { supabase } from './supabase';
import type { Flashcard } from './types';

export async function fetchFlashcards(userId: string) {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(card => ({
      ...card,
      lastReviewed: card.last_reviewed ? new Date(card.last_reviewed) : undefined
    })) as Flashcard[];
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    throw error;
  }
}

export async function createFlashcard(userId: string, flashcard: Omit<Flashcard, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .insert([{
        user_id: userId,
        front: flashcard.front,
        back: flashcard.back,
        difficulty: flashcard.difficulty,
        last_reviewed: flashcard.lastReviewed?.toISOString(),
        note_id: flashcard.noteId,
      }])
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      lastReviewed: data.last_reviewed ? new Date(data.last_reviewed) : undefined
    } as Flashcard;
  } catch (error) {
    console.error('Error creating flashcard:', error);
    throw error;
  }
}

export async function updateFlashcard(userId: string, flashcardId: string, updates: Partial<Flashcard>) {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .update({
        front: updates.front,
        back: updates.back,
        difficulty: updates.difficulty,
        last_reviewed: updates.lastReviewed?.toISOString(),
      })
      .eq('id', flashcardId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      lastReviewed: data.last_reviewed ? new Date(data.last_reviewed) : undefined
    } as Flashcard;
  } catch (error) {
    console.error('Error updating flashcard:', error);
    throw error;
  }
}

export async function deleteFlashcard(userId: string, flashcardId: string) {
  try {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    throw error;
  }
}