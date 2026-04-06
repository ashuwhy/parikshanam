CREATE TYPE notification_audience AS ENUM ('all', 'class', 'course', 'user');
CREATE TYPE notification_status AS ENUM ('pending', 'processing', 'sent', 'failed');

CREATE TABLE public.push_tokens (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    token text UNIQUE NOT NULL,
    platform text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    body text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    audience notification_audience NOT NULL,
    audience_target_id text,
    status notification_status DEFAULT 'pending' NOT NULL,
    scheduled_at timestamptz DEFAULT now() NOT NULL,
    sent_count integer DEFAULT 0 NOT NULL,
    sent_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert push tokens
CREATE POLICY "Anyone can insert push tokens"
    ON public.push_tokens FOR INSERT
    WITH CHECK (true);

-- Allow anyone to update their tokens
CREATE POLICY "Anyone can update push tokens"
    ON public.push_tokens FOR UPDATE
    USING (true);

-- Allow users to view their own tokens
CREATE POLICY "Users can view their own tokens"
    ON public.push_tokens FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Notifications are admin-only via service_role key, so no public policies needed.

-- Trigger to update push_tokens.updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_push_tokens_updated_at
    BEFORE UPDATE ON public.push_tokens
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
