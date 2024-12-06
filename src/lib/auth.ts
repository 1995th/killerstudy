import { create } from 'zustand';
import { supabase } from './supabase';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signUp: (username: string, password: string) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signUp: async (username: string, password: string) => {
    try {
      // First check if username exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        throw new Error('Username already exists');
      }

      // Create auth user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: `${username}@studykiller.temp`,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error('Failed to create user');

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          username,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);

      if (profileError) throw profileError;

      toast.success('Account created successfully! Please sign in.', { duration: 1500 });
    } catch (error: any) {
      console.error('SignUp error:', error);
      toast.error(error.message || 'Failed to create account', { duration: 1500 });
      throw error;
    }
  },

  signIn: async (username: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${username}@studykiller.temp`,
        password,
      });

      if (error) throw error;

      if (data.user) {
        set({ user: data.user });
        toast.success('Successfully signed in!', { duration: 1500 });
      }
    } catch (error: any) {
      console.error('SignIn error:', error);
      toast.error('Invalid username or password', { duration: 1500 });
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
      toast.success('Successfully signed out!', { duration: 1500 });
    } catch (error: any) {
      console.error('SignOut error:', error);
      toast.error('Failed to sign out', { duration: 1500 });
      throw error;
    }
  },

  checkUser: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session?.user) {
        set({ user: session.user, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error('Check user error:', error);
      set({ user: null, loading: false });
    }
  },

  deleteAccount: async (password: string) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('No user found');

      // Sign in again to verify password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${user.user_metadata.username}@studykiller.temp`,
        password,
      });

      if (signInError) throw new Error('Invalid password');

      // Delete user data and account
      const { error: deleteError } = await supabase
        .rpc('delete_user_account', {
          target_user_id: user.id
        });

      if (deleteError) throw deleteError;

      await supabase.auth.signOut();
      set({ user: null });
      toast.success('Account deleted successfully', { duration: 1500 });
    } catch (error: any) {
      console.error('Delete account error:', error);
      toast.error(error.message || 'Failed to delete account', { duration: 1500 });
      throw error;
    }
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      toast.success('Password updated successfully', { duration: 1500 });
    } catch (error: any) {
      console.error('Update password error:', error);
      toast.error('Failed to update password', { duration: 1500 });
      throw error;
    }
  },
}));