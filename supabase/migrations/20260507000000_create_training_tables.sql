-- =====================================================
-- Migration: Create E-learning tables and update enums
-- =====================================================

-- 1. Update Enums
-- Note: ALTER TYPE ADD VALUE cannot be executed in a transaction block in some PG versions
-- but Supabase handles this if each command is separate or if we use a specific approach.
-- We'll add the new roles and notification type.

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'contributor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'participant';

ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'training_announcement';

-- 2. Create trainings table
CREATE TABLE IF NOT EXISTS public.trainings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    type text NOT NULL CHECK (type IN ('online', 'onsite')),
    start_date timestamptz,
    end_date timestamptz,
    trainer text,
    capacity integer,
    location text, -- for onsite
    content jsonb DEFAULT '{}', -- for online modules
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    image_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. Create training_registrations table
CREATE TABLE IF NOT EXISTS public.training_registrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    training_id uuid NOT NULL REFERENCES public.trainings(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended')),
    registered_at timestamptz DEFAULT now(),
    UNIQUE(training_id, user_id)
);

-- 4. Create training_documents junction table
CREATE TABLE IF NOT EXISTS public.training_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    training_id uuid NOT NULL REFERENCES public.trainings(id) ON DELETE CASCADE,
    document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    access_roles public.app_role[] DEFAULT '{}',
    UNIQUE(training_id, document_id)
);

-- 5. Create training_events table (for calendar)
CREATE TABLE IF NOT EXISTS public.training_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    training_id uuid REFERENCES public.trainings(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    start_date timestamptz NOT NULL,
    end_date timestamptz NOT NULL,
    type text NOT NULL CHECK (type IN ('online', 'onsite')),
    created_at timestamptz DEFAULT now()
);

-- 6. Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text NOT NULL,
    training_id uuid REFERENCES public.trainings(id) ON DELETE SET NULL,
    type text NOT NULL DEFAULT 'info',
    published_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    target_roles public.app_role[] DEFAULT '{}',
    created_by uuid REFERENCES auth.users(id)
);

-- 7. RLS Policies

-- Trainings
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trainings_select_all" ON public.trainings FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin'));
CREATE POLICY "trainings_insert_admin" ON public.trainings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin'));
CREATE POLICY "trainings_update_admin" ON public.trainings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin'));
CREATE POLICY "trainings_delete_admin" ON public.trainings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- Registrations
ALTER TABLE public.training_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "registrations_select_own" ON public.training_registrations FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin'));
CREATE POLICY "registrations_insert_own" ON public.training_registrations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "registrations_update_admin" ON public.training_registrations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin'));

-- Documents Junction
ALTER TABLE public.training_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "training_docs_select" ON public.training_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "training_docs_manage" ON public.training_documents FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin'));

-- Events
ALTER TABLE public.training_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_select_all" ON public.training_events FOR SELECT USING (true);
CREATE POLICY "events_manage" ON public.training_events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin'));

-- Announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "announcements_select_all" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "announcements_manage" ON public.announcements FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'country_admin'));

-- 8. Triggers for updated_at
CREATE TRIGGER update_trainings_updated_at BEFORE UPDATE ON public.trainings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
