import { supabase } from './supabase';

export async function logStudySession(userId: string, duration: number) {
  try {
    if (!userId || duration <= 0) {
      throw new Error('Invalid study session data');
    }

    const { error } = await supabase
      .from('study_sessions')
      .insert([{
        user_id: userId,
        start_time: new Date(Date.now() - duration * 1000).toISOString(),
        end_time: new Date().toISOString(),
        duration: Math.floor(duration),
        status: 'completed'
      }]);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error logging study session:', error);
    throw new Error(error.message || 'Failed to log study session');
  }
}

export async function logNoteCreation(userId: string, noteId: string) {
  try {
    const { error } = await supabase
      .from('notes')
      .update({ 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', noteId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error logging note creation:', error);
    throw error;
  }
}

export async function logFlashcardReview(userId: string, flashcardId: string, difficulty: string) {
  try {
    const { error } = await supabase
      .from('flashcards')
      .update({ 
        last_reviewed: new Date().toISOString(),
        difficulty 
      })
      .eq('id', flashcardId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error logging flashcard review:', error);
    throw error;
  }
}

export async function fetchStudyStats(userId: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_user_study_stats', {
        user_uuid: userId
      });

    if (error) throw error;
    
    return {
      totalTimeStudied: data[0].total_time_studied || 0,
      flashcardsReviewed: parseInt(data[0].flashcards_reviewed) || 0,
      notesCreated: parseInt(data[0].notes_created) || 0,
      currentStreak: data[0].current_streak || 0,
      weeklyStudyHours: data[0].weekly_study_hours || Array(7).fill(0),
    };
  } catch (error) {
    console.error('Error fetching study stats:', error);
    throw error;
  }
}