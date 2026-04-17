-- Create table for associated members
CREATE TABLE IF NOT EXISTS public.membres_associes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL,
    nom_complet TEXT,
    pays_id UUID REFERENCES public.countries(id) ON DELETE SET NULL,
    logo_url TEXT,
    type TEXT NOT NULL CHECK (type IN ('agence', 'operateur', 'institution', 'association')),
    secteur TEXT,
    depuis TEXT,
    site_web TEXT,
    description TEXT,
    projets JSONB,
    email_contact TEXT,
    telephone_contact TEXT,
    adresse TEXT,
    est_actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    date_mise_a_jour TIMESTAMPTZ DEFAULT NOW()
);

-- Create table for partners
CREATE TABLE IF NOT EXISTS public.partenaires (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL,
    nom_complet TEXT,
    pays_id UUID REFERENCES public.countries(id) ON DELETE SET NULL,
    logo_url TEXT,
    type TEXT NOT NULL CHECK (type IN ('institutionnel', 'prive', 'ong', 'international')),
    domaine TEXT,
    depuis TEXT,
    site_web TEXT,
    description TEXT,
    projets JSONB,
    email_contact TEXT,
    telephone_contact TEXT,
    adresse TEXT,
    est_actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    date_mise_a_jour TIMESTAMPTZ DEFAULT NOW()
);

-- Create policies for membres_associes
CREATE POLICY "Enable read access for all users to membres_associes" ON public.membres_associes
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users on membres_associes" ON public.membres_associes
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users on membres_associes" ON public.membres_associes
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users on membres_associes" ON public.membres_associes
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create policies for partenaires
CREATE POLICY "Enable read access for all users to partenaires" ON public.partenaires
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users on partenaires" ON public.partenaires
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users on partenaires" ON public.partenaires
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users on partenaires" ON public.partenaires
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create admin-specific policies for better control
CREATE POLICY "Enable full access for service roles on membres_associes" ON public.membres_associes
    FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Enable full access for service roles on partenaires" ON public.partenaires
    FOR ALL
    USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_membres_associes_nom ON public.membres_associes(nom);
CREATE INDEX IF NOT EXISTS idx_membres_associes_pays ON public.membres_associes(pays_id);
CREATE INDEX IF NOT EXISTS idx_membres_associes_type ON public.membres_associes(type);

CREATE INDEX IF NOT EXISTS idx_partenaires_nom ON public.partenaires(nom);
CREATE INDEX IF NOT EXISTS idx_partenaires_pays ON public.partenaires(pays_id);
CREATE INDEX IF NOT EXISTS idx_partenaires_type ON public.partenaires(type);

-- Add comments for documentation
COMMENT ON TABLE public.membres_associes IS 'Table containing associated members of the organization';
COMMENT ON TABLE public.partenaires IS 'Table containing partners of the organization';
