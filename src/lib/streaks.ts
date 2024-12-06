import { supabase } from './supabase';

export async function updateStreak(userId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get the current streak
    const { data: currentStreak, error: streakError } = await supabase
      .from('study_streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (streakError) throw streakError;

    if (!currentStreak) {
      // Create new streak
      const { error: insertError } = await supabase
        .from('study_streaks')
        .insert([{
          user_id: userId,
          streak_count: 1,
          last_study_date: today,
        }]);
      
      if (insertError) throw insertError;
      return 1;
    }

    const lastStudyDate = new Date(currentStreak.last_study_date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreakCount = currentStreak.streak_count;

    if (lastStudyDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
      // Studied yesterday, increment streak
      newStreakCount++;
    } else if (lastStudyDate.toISOString().split('T')[0] !== today) {
      // Didn't study yesterday, reset streak
      newStreakCount = 1;
    }

    // Update streak
    const { error: updateError } = await supabase
      .from('study_streaks')
      .update({
        streak_count: newStreakCount,
        last_study_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;
    return newStreakCount;
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
}

export async function getStreak(userId: string) {
  try {
    const { data, error } = await supabase
      .from('study_streaks')
      .select('streak_count')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data?.streak_count || 0;
  } catch (error) {
    console.error('Error getting streak:', error);
    throw error;
  }
}