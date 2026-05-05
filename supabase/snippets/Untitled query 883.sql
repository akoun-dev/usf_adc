-- Create internal_messages table
CREATE TABLE IF NOT EXISTS public.internal_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject jsonb DEFAULT '{}'::jsonb,
    content jsonb DEFAULT '{}'::jsonb,
    language text DEFAULT 'fr',
    status text NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'sent')),
    read_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at_sender timestamptz,
    deleted_at_recipient timestamptz,
    parent_message_id uuid REFERENCES public.internal_messages(id) ON DELETE CASCADE,
    thread_id uuid DEFAULT gen_random_uuid()
);

-- Enable RLS
ALTER TABLE public.internal_messages ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view messages they sent or received' AND tablename = 'internal_messages') THEN
        CREATE POLICY "Users can view messages they sent or received" 
        ON public.internal_messages FOR SELECT 
        USING (
            (auth.uid() = sender_id AND deleted_at_sender IS NULL) OR 
            (auth.uid() = recipient_id AND deleted_at_recipient IS NULL)
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert messages' AND tablename = 'internal_messages') THEN
        CREATE POLICY "Users can insert messages" 
        ON public.internal_messages FOR INSERT 
        WITH CHECK (auth.uid() = sender_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own messages or mark as read' AND tablename = 'internal_messages') THEN
        CREATE POLICY "Users can update their own messages or mark as read" 
        ON public.internal_messages FOR UPDATE 
        USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
    END IF;
END $$;

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_internal_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_internal_messages_updated_at ON public.internal_messages;
CREATE TRIGGER set_internal_messages_updated_at
BEFORE UPDATE ON public.internal_messages
FOR EACH ROW
EXECUTE FUNCTION public.handle_internal_messages_updated_at();

-- Trigger for auto-translation (if function exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'fn_auto_translate_jsonb') THEN
        -- Create a wrapper function for internal_messages
        CREATE OR REPLACE FUNCTION public.handle_internal_messages_translation()
        RETURNS TRIGGER AS $inner$
        BEGIN
            IF (TG_OP = 'UPDATE') THEN
                IF (OLD.subject = NEW.subject AND OLD.content = NEW.content AND OLD.language = NEW.language) THEN
                    RETURN NEW;
                END IF;
            END IF;

            NEW.subject := public.fn_auto_translate_jsonb(NEW.subject, NEW.language);
            NEW.content := public.fn_auto_translate_jsonb(NEW.content, NEW.language);
            
            RETURN NEW;
        END;
        $inner$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS on_internal_messages_translation ON public.internal_messages;
        CREATE TRIGGER on_internal_messages_translation
        BEFORE INSERT OR UPDATE ON public.internal_messages
        FOR EACH ROW EXECUTE FUNCTION public.handle_internal_messages_translation();
    END IF;
END $$;

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_internal_messages_sender_id ON public.internal_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_internal_messages_recipient_id ON public.internal_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_internal_messages_status ON public.internal_messages(status);
CREATE INDEX IF NOT EXISTS idx_internal_messages_created_at ON public.internal_messages(created_at);
