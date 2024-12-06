import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from './supabase';
import { toast } from 'sonner';

interface StudyState {
  isStudying: boolean;
  startTime: number | null;
  totalTime: number;
  userId: string | null;
  setUserId: (id: string | null) => void;
  setIsStudying: (value: boolean) => void;
  startStudySession: () => void;
  stopStudySession: () => Promise<void>;
  resetTimer: () => void;
  loadTotalTime: (userId: string) => Promise<void>;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      isStudying: false,
      startTime: null,
      totalTime: 0,
      userId: null,
      setUserId: (id) => set({ userId: id }),
      setIsStudying: (value) => set({ isStudying: value }),
      loadTotalTime: async (userId: string) => {
        try {
          const { data, error } = await supabase
            .from('study_sessions')
            .select('duration')
            .eq('user_id', userId)
            .eq('status', 'completed');

          if (error) throw error;

          const totalTime = data.reduce((sum, session) => sum + (session.duration || 0), 0);
          set({ totalTime });
        } catch (error) {
          console.error('Error loading total time:', error);
        }
      },
      startStudySession: () => {
        set({ 
          isStudying: true, 
          startTime: Date.now()
        });
      },
      stopStudySession: async () => {
        const { startTime, userId } = get();
        if (!startTime || !userId) return;

        try {
          const endTime = Date.now();
          const sessionTime = Math.floor((endTime - startTime) / 1000);

          const { error } = await supabase
            .from('study_sessions')
            .insert([{
              user_id: userId,
              start_time: new Date(startTime).toISOString(),
              end_time: new Date(endTime).toISOString(),
              duration: sessionTime,
              status: 'completed'
            }]);

          if (error) throw error;

          set((state) => ({
            isStudying: false,
            startTime: null,
            totalTime: state.totalTime + sessionTime,
          }));

          toast.success('Study session logged successfully');
        } catch (error) {
          console.error('Error stopping study session:', error);
          throw error;
        }
      },
      resetTimer: () => {
        set({
          isStudying: false,
          startTime: null,
          totalTime: 0,
        });
        toast.success('Timer reset successfully');
      },
    }),
    {
      name: 'study-timer-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        totalTime: state.totalTime,
        userId: state.userId,
      }),
    }
  )
);