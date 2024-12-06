-- Reset the database
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant necessary permissions first
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create study_sessions table
CREATE TABLE public.study_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration INTEGER,
    status TEXT CHECK (status IN ('active', 'completed')) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create study_goals table
CREATE TABLE public.study_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create study_streaks table
CREATE TABLE public.study_streaks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    streak_count INTEGER DEFAULT 1,
    last_study_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create notes table
CREATE TABLE public.notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create flashcards table
CREATE TABLE public.flashcards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    note_id UUID REFERENCES public.notes ON DELETE CASCADE,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
    last_reviewed TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Function to get user study stats
CREATE OR REPLACE FUNCTION get_user_study_stats(user_uuid UUID)
RETURNS TABLE (
    total_time_studied BIGINT,
    flashcards_reviewed BIGINT,
    notes_created BIGINT,
    current_streak INTEGER,
    weekly_study_hours NUMERIC[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH study_stats AS (
        SELECT 
            COALESCE(SUM(duration), 0) as total_time,
            (
                SELECT COUNT(*)
                FROM public.flashcards f
                WHERE f.user_id = user_uuid AND f.last_reviewed IS NOT NULL
            ) as cards_reviewed,
            (
                SELECT COUNT(*)
                FROM public.notes n
                WHERE n.user_id = user_uuid
            ) as total_notes,
            (
                SELECT streak_count
                FROM public.study_streaks
                WHERE user_id = user_uuid
                ORDER BY updated_at DESC
                LIMIT 1
            ) as streak,
            ARRAY(
                SELECT COALESCE(daily_hours, 0)
                FROM (
                    SELECT generate_series(
                        date_trunc('day', now()) - interval '6 days',
                        date_trunc('day', now()),
                        interval '1 day'
                    ) as day
                ) d
                LEFT JOIN (
                    SELECT 
                        date_trunc('day', start_time) as study_day,
                        ROUND(CAST(SUM(duration) AS NUMERIC) / 3600, 2) as daily_hours
                    FROM public.study_sessions
                    WHERE user_id = user_uuid
                    AND status = 'completed'
                    AND start_time >= now() - interval '7 days'
                    GROUP BY date_trunc('day', start_time)
                ) s ON d.day = s.study_day
                ORDER BY d.day DESC
            ) as weekly_hours
        FROM public.study_sessions
        WHERE user_id = user_uuid
        AND status = 'completed'
    )
    SELECT 
        total_time,
        cards_reviewed,
        total_notes,
        COALESCE(streak, 0),
        COALESCE(weekly_hours, ARRAY[0, 0, 0, 0, 0, 0, 0])
    FROM study_stats;
END;
$$;

-- Function to delete user account and all associated data
CREATE OR REPLACE FUNCTION delete_user_account(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.study_sessions WHERE user_id = target_user_id;
    DELETE FROM public.study_streaks WHERE user_id = target_user_id;
    DELETE FROM public.flashcards WHERE user_id = target_user_id;
    DELETE FROM public.notes WHERE user_id = target_user_id;
    DELETE FROM public.study_goals WHERE user_id = target_user_id;
    DELETE FROM public.profiles WHERE id = target_user_id;
END;
$$;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage their study sessions"
    ON public.study_sessions FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their goals"
    ON public.study_goals FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their streaks"
    ON public.study_streaks FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their notes"
    ON public.notes FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their flashcards"
    ON public.flashcards FOR ALL
    USING (auth.uid() = user_id);

-- Reset RLS
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.study_goals FORCE ROW LEVEL SECURITY;
ALTER TABLE public.study_streaks FORCE ROW LEVEL SECURITY;
ALTER TABLE public.notes FORCE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards FORCE ROW LEVEL SECURITY;