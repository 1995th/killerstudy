import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'studykiller-auth',
    flowType: 'pkce'
  }
});

// Set up auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    // Clear auth data
    localStorage.removeItem('studykiller-auth');
    localStorage.removeItem('study-timer-storage');
  } else if (event === 'SIGNED_IN' && session?.user) {
    // Create or update profile
    supabase
      .from('profiles')
      .upsert(
        {
          id: session.user.id,
          username: session.user.user_metadata.username,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .then(({ error }) => {
        if (error) console.error('Error updating profile:', error);
      });
  }
});