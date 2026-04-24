import type { UserProfile } from '@/core/types/profile'

export type { UserProfile }

export interface Database {
    public: {
        Tables: {
            audit_logs: {
                Row: {
                    action: string
                    created_at: string
                    id: string
                    ip_address: unknown
                    metadata: Json | null
                    target_id: string | null
                    target_table: string | null
                    user_id: string | null
                }
                Insert: {
                    action: string
                    created_at?: string
                    id?: string
                    ip_address?: unknown
                    metadata?: Json | null
                    target_id?: string | null
                    target_table?: string | null
                    user_id?: string | null
                }
                Update: {
                    action?: string
                    created_at?: string
                    id?: string
                    ip_address?: unknown
                    metadata?: Json | null
                    target_id?: string | null
                    target_table?: string | null
                    user_id?: string | null
                }
                Relationships: []
            }
            cmdt_contributions: {
                Row: CmdtContribution
                Insert: Partial<CmdtContribution>
                Update: Partial<CmdtContribution>
                Relationships: []
            }
            countries: {
                Row: {
                    code_iso: string
                    created_at: string
                    id: string
                    name_en: string
                    name_fr: string
                    region: string
                    updated_at: string
                }
                Insert: {
                    code_iso: string
                    created_at?: string
                    id?: string
                    name_en: string
                    name_fr: string
                    region: string
                    updated_at?: string
                }
                Update: {
                    code_iso?: string
                    created_at?: string
                    id?: string
                    name_en?: string
                    name_fr?: string
                    region?: string
                    updated_at?: string
                }
                Relationships: []
            }
            documents: {
                Row: {
                    category: string
                    created_at: string
                    description: string | null
                    download_count: number
                    featured: boolean
                    file_name: string
                    file_path: string
                    file_size: number
                    id: string
                    is_public: boolean
                    language: string
                    metadata: string | null
                    mime_type: string
                    published_at: string | null
                    status: string | null
                    thumbnail: string | null
                    title: string
                    type: string | null
                    updated_at: string
                    uploaded_by: string | null
                    version: string | null
                }
                Insert: {
                    category?: string
                    created_at?: string
                    description?: string | null
                    download_count?: number
                    featured?: boolean
                    file_name: string
                    file_path: string
                    file_size?: number
                    id?: string
                    is_public?: boolean
                    language?: string
                    metadata?: string | null
                    mime_type: string
                    published_at?: string | null
                    status?: string | null
                    thumbnail?: string | null
                    title: string
                    type?: string | null
                    updated_at?: string
                    uploaded_by?: string | null
                    version?: string | null
                }
                Update: {
                    category?: string
                    created_at?: string
                    description?: string | null
                    download_count?: number
                    featured?: boolean
                    file_name?: string
                    file_path?: string
                    file_size?: number
                    id?: string
                    is_public?: boolean
                    language?: string
                    metadata?: string | null
                    mime_type?: string
                    published_at?: string | null
                    status?: string | null
                    thumbnail?: string | null
                    title?: string
                    type?: string | null
                    updated_at?: string
                    uploaded_by?: string | null
                    version?: string | null
                }
                Relationships: []
            }
            faq_articles: {
                Row: {
                    category: string
                    content: string
                    created_at: string
                    id: string
                    is_published: boolean
                    sort_order: number
                    title: string
                    updated_at: string
                }
                Insert: {
                    category?: string
                    content: string
                    created_at?: string
                    id?: string
                    is_published?: boolean
                    sort_order?: number
                    title: string
                    updated_at?: string
                }
                Update: {
                    category?: string
                    content?: string
                    created_at?: string
                    id?: string
                    is_published?: boolean
                    sort_order?: number
                    title?: string
                    updated_at?: string
                }
                Relationships: []
            }
            forum_categories: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: string
                    name: string
                    slug: string
                    sort_order: number | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    name: string
                    slug: string
                    sort_order?: number | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    name?: string
                    slug?: string
                    sort_order?: number | null
                }
                Relationships: []
            }
            forum_posts: {
                Row: {
                    author_id: string
                    content: string
                    created_at: string | null
                    id: string
                    topic_id: string
                    updated_at: string | null
                }
                Insert: {
                    author_id: string
                    content: string
                    created_at?: string | null
                    id?: string
                    topic_id: string
                    updated_at?: string | null
                }
                Update: {
                    author_id?: string
                    content?: string
                    created_at?: string | null
                    id?: string
                    topic_id?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "forum_posts_author_id_fkey"
                        columns: ["author_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "forum_posts_topic_id_fkey"
                        columns: ["topic_id"]
                        isOneToOne: false
                        referencedRelation: "forum_topics"
                        referencedColumns: ["id"]
                    },
                ]
            }
            forum_reports: {
                Row: {
                    created_at: string
                    id: string
                    reason: string
                    reporter_id: string
                    reviewed_at: string | null
                    reviewed_by: string | null
                    status: string
                    target_id: string
                    target_type: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    reason: string
                    reporter_id: string
                    reviewed_at?: string | null
                    reviewed_by?: string | null
                    status?: string
                    target_id: string
                    target_type: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    reason?: string
                    reporter_id?: string
                    reviewed_at?: string | null
                    reviewed_by?: string | null
                    status?: string
                    target_id?: string
                    target_type?: string
                }
                Relationships: []
            }
            forum_topics: {
                Row: {
                    category_id: string | null
                    content: string
                    created_at: string | null
                    created_by: string
                    id: string
                    is_locked: boolean | null
                    is_pinned: boolean | null
                    is_public: boolean | null
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    category_id?: string | null
                    content: string
                    created_at?: string | null
                    created_by: string
                    id?: string
                    is_locked?: boolean | null
                    is_pinned?: boolean | null
                    is_public?: boolean | null
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    category_id?: string | null
                    content?: string
                    created_at?: string | null
                    created_by?: string
                    id?: string
                    is_locked?: boolean | null
                    is_pinned?: boolean | null
                    is_public?: boolean | null
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "forum_topics_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "forum_categories"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "forum_topics_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            fsu_submission_attachments: {
                Row: {
                    created_at: string
                    file_name: string
                    file_path: string
                    file_size: number
                    id: string
                    mime_type: string
                    submission_id: string
                    uploaded_by: string | null
                }
                Insert: {
                    created_at?: string
                    file_name: string
                    file_path: string
                    file_size?: number
                    id?: string
                    mime_type: string
                    submission_id: string
                    uploaded_by?: string | null
                }
                Update: {
                    created_at?: string
                    file_name?: string
                    file_path?: string
                    file_size?: number
                    id?: string
                    mime_type?: string
                    submission_id?: string
                    uploaded_by?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "fsu_submission_attachments_submission_id_fkey"
                        columns: ["submission_id"]
                        isOneToOne: false
                        referencedRelation: "fsu_submissions"
                        referencedColumns: ["id"]
                    },
                ]
            }
            fsu_submission_versions: {
                Row: {
                    changed_by: string | null
                    created_at: string
                    data: Json
                    id: string
                    submission_id: string
                    version_number: number
                }
                Insert: {
                    changed_by?: string | null
                    created_at?: string
                    data?: Json
                    id?: string
                    submission_id: string
                    version_number?: number
                }
                Update: {
                    changed_by?: string | null
                    created_at?: string
                    data?: Json
                    id?: string
                    submission_id?: string
                    version_number?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "fsu_submission_versions_submission_id_fkey"
                        columns: ["submission_id"]
                        isOneToOne: false
                        referencedRelation: "fsu_submissions"
                        referencedColumns: ["id"]
                    },
                ]
            }
            fsu_submissions: {
                Row: {
                    country_id: string
                    created_at: string
                    created_by: string | null
                    data: Json
                    id: string
                    period_end: string
                    period_start: string
                    status: Database["public"]["Enums"]["submission_status"]
                    submitted_at: string | null
                    submitted_by: string
                    updated_at: string
                    updated_by: string | null
                }
                Insert: {
                    country_id: string
                    created_at?: string
                    created_by?: string | null
                    data?: Json
                    id?: string
                    period_end: string
                    period_start: string
                    status?: Database["public"]["Enums"]["submission_status"]
                    submitted_at?: string | null
                    submitted_by: string
                    updated_at?: string
                    updated_by?: string | null
                }
                Update: {
                    country_id?: string
                    created_at?: string
                    created_by?: string | null
                    data?: Json
                    id?: string
                    period_end?: string
                    period_start?: string
                    status?: Database["public"]["Enums"]["submission_status"]
                    submitted_at?: string | null
                    submitted_by?: string
                    updated_at?: string
                    updated_by?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "fsu_submissions_country_id_fkey"
                        columns: ["country_id"]
                        isOneToOne: false
                        referencedRelation: "countries"
                        referencedColumns: ["id"]
                    },
                ]
            }
            fsu_validation_actions: {
                Row: {
                    action: Database["public"]["Enums"]["validation_action_type"]
                    comment: string | null
                    created_at: string
                    id: string
                    performed_by: string
                    submission_id: string
                }
                Insert: {
                    action: Database["public"]["Enums"]["validation_action_type"]
                    comment?: string | null
                    created_at?: string
                    id?: string
                    performed_by: string
                    submission_id: string
                }
                Update: {
                    action?: Database["public"]["Enums"]["validation_action_type"]
                    comment?: string | null
                    created_at?: string
                    id?: string
                    performed_by?: string
                    submission_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "fsu_validation_actions_submission_id_fkey"
                        columns: ["submission_id"]
                        isOneToOne: false
                        referencedRelation: "fsu_submissions"
                        referencedColumns: ["id"]
                    },
                ]
            }
            invitations: {
                Row: {
                    accepted_at: string | null
                    country_id: string | null
                    created_at: string
                    email: string
                    expires_at: string
                    id: string
                    invited_by: string
                    role: Database["public"]["Enums"]["app_role"]
                    status: Database["public"]["Enums"]["invitation_status"]
                    token: string
                    updated_at: string
                }
                Insert: {
                    accepted_at?: string | null
                    country_id?: string | null
                    created_at?: string
                    email: string
                    expires_at?: string
                    id?: string
                    invited_by: string
                    role: Database["public"]["Enums"]["app_role"]
                    status?: Database["public"]["Enums"]["invitation_status"]
                    token?: string
                    updated_at?: string
                }
                Update: {
                    accepted_at?: string | null
                    country_id?: string | null
                    created_at?: string
                    email?: string
                    expires_at?: string
                    id?: string
                    invited_by?: string
                    role?: Database["public"]["Enums"]["app_role"]
                    status?: Database["public"]["Enums"]["invitation_status"]
                    token?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "invitations_country_id_fkey"
                        columns: ["country_id"]
                        isOneToOne: false
                        referencedRelation: "countries"
                        referencedColumns: ["id"]
                    },
                ]
            }
            mfa_challenges: {
                Row: {
                    code: string
                    created_at: string
                    expires_at: string
                    id: string
                    method: string
                    user_id: string
                    verified_at: string | null
                }
                Insert: {
                    code: string
                    created_at?: string
                    expires_at?: string
                    id?: string
                    method?: string
                    user_id: string
                    verified_at?: string | null
                }
                Update: {
                    code?: string
                    created_at?: string
                    expires_at?: string
                    id?: string
                    method?: string
                    user_id?: string
                    verified_at?: string | null
                }
                Relationships: []
            }
            membres_associes: {
                Row: {
                    adresse: string | null
                    date_creation: string | null
                    date_mise_a_jour: string | null
                    depuis: string | null
                    description: string | null
                    email_contact: string | null
                    est_actif: boolean | null
                    id: string
                    logo_url: string | null
                    nom: string
                    nom_complet: string | null
                    pays_id: string | null
                    projets: Json | null
                    secteur: string | null
                    site_web: string | null
                    telephone_contact: string | null
                    type: string
                }
                Insert: {
                    adresse?: string | null
                    date_creation?: string | null
                    date_mise_a_jour?: string | null
                    depuis?: string | null
                    description?: string | null
                    email_contact?: string | null
                    est_actif?: boolean | null
                    id?: string
                    logo_url?: string | null
                    nom: string
                    nom_complet?: string | null
                    pays_id?: string | null
                    projets?: Json | null
                    secteur?: string | null
                    site_web?: string | null
                    telephone_contact?: string | null
                    type: string
                }
                Update: {
                    adresse?: string | null
                    date_creation?: string | null
                    date_mise_a_jour?: string | null
                    depuis?: string | null
                    description?: string | null
                    email_contact?: string | null
                    est_actif?: boolean | null
                    id?: string
                    logo_url?: string | null
                    nom?: string
                    nom_complet?: string | null
                    pays_id?: string | null
                    projets?: Json | null
                    secteur?: string | null
                    site_web?: string | null
                    telephone_contact?: string | null
                    type?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "membres_associes_pays_id_fkey"
                        columns: ["pays_id"]
                        isOneToOne: false
                        referencedRelation: "countries"
                        referencedColumns: ["id"]
                    },
                ]
            }
            newsletters: {
                Row: {
                    content: string
                    created_at: string
                    created_by: string
                    email_sent: boolean
                    id: string
                    is_published: boolean
                    published_at: string | null
                    summary: string | null
                    target_roles: Database["public"]["Enums"]["app_role"][]
                    title: string
                    updated_at: string
                }
                Insert: {
                    content: string
                    created_at?: string
                    created_by: string
                    email_sent?: boolean
                    id?: string
                    is_published?: boolean
                    published_at?: string | null
                    summary?: string | null
                    target_roles?: Database["public"]["Enums"]["app_role"][]
                    title: string
                    updated_at?: string
                }
                Update: {
                    content?: string
                    created_at?: string
                    created_by?: string
                    email_sent?: boolean
                    id?: string
                    is_published?: boolean
                    published_at?: string | null
                    summary?: string | null
                    target_roles?: Database["public"]["Enums"]["app_role"][]
                    title?: string
                    updated_at?: string
                }
                Relationships: []
            }
            notifications: {
                Row: {
                    created_at: string
                    id: string
                    link: string | null
                    message: string
                    read_at: string | null
                    title: string
                    type: Database["public"]["Enums"]["notification_type"]
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    link?: string | null
                    message: string
                    read_at?: string | null
                    title: string
                    type?: Database["public"]["Enums"]["notification_type"]
                    user_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    link?: string | null
                    message?: string
                    read_at?: string | null
                    title?: string
                    type?: Database["public"]["Enums"]["notification_type"]
                    user_id?: string
                }
                Relationships: []
            }
            platform_settings: {
                Row: {
                    category: string
                    created_at: string
                    id: string
                    key: string
                    label: string
                    updated_at: string
                    value: Json
                }
                Insert: {
                    category?: string
                    created_at?: string
                    id?: string
                    key: string
                    label: string
                    updated_at?: string
                    value?: Json
                }
                Update: {
                    category?: string
                    created_at?: string
                    id?: string
                    key?: string
                    label?: string
                    updated_at?: string
                    value?: Json
                }
                Relationships: []
            }
            profiles: {
                Row: UserProfile
                Insert: {
                    avatar_url?: string | null
                    country_id?: string | null
                    created_at?: string
                    full_name?: string | null
                    id: string
                    is_active?: boolean
                    language?: string
                    mfa_method?: string
                    phone?: string | null
                    telegram_chat_id?: string | null
                    updated_at?: string
                }
                Update: {
                    avatar_url?: string | null
                    country_id?: string | null
                    created_at?: string
                    full_name?: string | null
                    id?: string
                    is_active?: boolean
                    language?: string
                    mfa_method?: string
                    phone?: string | null
                    telegram_chat_id?: string | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_country_id_fkey"
                        columns: ["country_id"]
                        isOneToOne: false
                        referencedRelation: "countries"
                        referencedColumns: ["id"]
                    },
                ]
            }
            partenaires: {
                Row: {
                    adresse: string | null
                    date_creation: string | null
                    date_mise_a_jour: string | null
                    depuis: string | null
                    description: string | null
                    domaine: string | null
                    email_contact: string | null
                    est_actif: boolean | null
                    id: string
                    logo_url: string | null
                    nom: string
                    nom_complet: string | null
                    pays_id: string | null
                    projets: Json | null
                    site_web: string | null
                    telephone_contact: string | null
                    type: string
                }
                Insert: {
                    adresse?: string | null
                    date_creation?: string | null
                    date_mise_a_jour?: string | null
                    depuis?: string | null
                    description?: string | null
                    domaine?: string | null
                    email_contact?: string | null
                    est_actif?: boolean | null
                    id?: string
                    logo_url?: string | null
                    nom: string
                    nom_complet?: string | null
                    pays_id?: string | null
                    projets?: Json | null
                    site_web?: string | null
                    telephone_contact?: string | null
                    type: string
                }
                Update: {
                    adresse?: string | null
                    date_creation?: string | null
                    date_mise_a_jour?: string | null
                    depuis?: string | null
                    description?: string | null
                    domaine?: string | null
                    email_contact?: string | null
                    est_actif?: boolean | null
                    id?: string
                    logo_url?: string | null
                    nom?: string
                    nom_complet?: string | null
                    pays_id?: string | null
                    projets?: Json | null
                    site_web?: string | null
                    telephone_contact?: string | null
                    type?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "partenaires_pays_id_fkey"
                        columns: ["pays_id"]
                        isOneToOne: false
                        referencedRelation: "countries"
                        referencedColumns: ["id"]
                    },
                ]
            }
            projects: {
                Row: {
                    budget: number | null
                    country_id: string
                    created_at: string
                    created_by: string | null
                    description: string | null
                    id: string
                    latitude: number | null
                    longitude: number | null
                    region: string | null
                    status: Database["public"]["Enums"]["project_status"]
                    title: string
                    updated_at: string
                }
                Insert: {
                    budget?: number | null
                    country_id: string
                    created_at?: string
                    created_by?: string | null
                    description?: string | null
                    id?: string
                    latitude?: number | null
                    longitude?: number | null
                    region?: string | null
                    status?: Database["public"]["Enums"]["project_status"]
                    title: string
                    updated_at?: string
                }
                Update: {
                    budget?: number | null
                    country_id?: string
                    created_at?: string
                    created_by?: string | null
                    description?: string | null
                    id?: string
                    latitude?: number | null
                    longitude?: number | null
                    region?: string | null
                    status?: Database["public"]["Enums"]["project_status"]
                    title?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "projects_country_id_fkey"
                        columns: ["country_id"]
                        isOneToOne: false
                        referencedRelation: "countries"
                        referencedColumns: ["id"]
                    },
                ]
            }
            role_promotions: {
                Row: {
                    created_at: string
                    id: string
                    promoted_by: string | null
                    role: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    promoted_by?: string | null
                    role: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    promoted_by?: string | null
                    role?: string
                    user_id?: string
                }
                Relationships: []
            }
            submission_periods: {
                Row: {
                    created_at: string
                    end_date: string
                    id: string
                    is_active: boolean
                    label: string
                    reminder_days_before: number
                    start_date: string
                    updated_at: string
                }
                Insert: {
                    created_at?: string
                    end_date: string
                    id?: string
                    is_active?: boolean
                    label: string
                    reminder_days_before?: number
                    start_date: string
                    updated_at?: string
                }
                Update: {
                    created_at?: string
                    end_date?: string
                    id?: string
                    is_active?: boolean
                    label?: string
                    reminder_days_before?: number
                    start_date?: string
                    updated_at?: string
                }
                Relationships: []
            }
            support_ticket_comments: {
                Row: {
                    author_id: string
                    content: string
                    created_at: string
                    id: string
                    ticket_id: string
                }
                Insert: {
                    author_id: string
                    content: string
                    created_at?: string
                    id?: string
                    ticket_id: string
                }
                Update: {
                    author_id?: string
                    content?: string
                    created_at?: string
                    id?: string
                    ticket_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "support_ticket_comments_ticket_id_fkey"
                        columns: ["ticket_id"]
                        isOneToOne: false
                        referencedRelation: "support_tickets"
                        referencedColumns: ["id"]
                    },
                ]
            }
            support_tickets: {
                Row: {
                    assigned_to: string | null
                    created_at: string
                    created_by: string
                    description: string
                    id: string
                    priority: string
                    status: Database["public"]["Enums"]["ticket_status"]
                    title: string
                    updated_at: string
                }
                Insert: {
                    assigned_to?: string | null
                    created_at?: string
                    created_by: string
                    description: string
                    id?: string
                    priority?: string
                    status?: Database["public"]["Enums"]["ticket_status"]
                    title: string
                    updated_at?: string
                }
                Update: {
                    assigned_to?: string | null
                    created_at?: string
                    created_by?: string
                    description?: string
                    id?: string
                    priority?: string
                    status?: Database["public"]["Enums"]["ticket_status"]
                    title?: string
                    updated_at?: string
                }
                Relationships: []
            }
            user_roles: {
                Row: {
                    created_at: string
                    id: string
                    role: Database["public"]["Enums"]["app_role"]
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    role: Database["public"]["Enums"]["app_role"]
                    user_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    role?: Database["public"]["Enums"]["app_role"]
                    user_id?: string
                }
                Relationships: []
            }
            validation_workflow_settings: {
                Row: {
                    approval_levels: number
                    country_id: string
                    created_at: string
                    default_deadline_days: number
                    id: string
                    updated_at: string
                }
                Insert: {
                    approval_levels?: number
                    country_id: string
                    created_at?: string
                    default_deadline_days?: number
                    id?: string
                    updated_at?: string
                }
                Update: {
                    approval_levels?: number
                    country_id?: string
                    created_at?: string
                    default_deadline_days?: number
                    id?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "validation_workflow_settings_country_id_fkey"
                        columns: ["country_id"]
                        isOneToOne: true
                        referencedRelation: "countries"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            accept_invitation: { Args: { _token: string }; Returns: Json }
            generate_mfa_code: { Args: { _user_id: string }; Returns: string }
            get_user_country: { Args: { _user_id: string }; Returns: string }
            has_role: {
                Args: {
                    _role: Database["public"]["Enums"]["app_role"]
                    _user_id: string
                }
                Returns: boolean
            }
            verify_mfa_code: {
                Args: { _code: string; _user_id: string }
                Returns: boolean
            }
        }
        Enums: {
            app_role:
                | "public_external"
                | "point_focal"
                | "country_admin"
                | "super_admin"
            invitation_status: "pending" | "accepted" | "expired" | "cancelled"
            notification_type: "info" | "warning" | "action_required" | "system"
            project_status:
                | "planned"
                | "in_progress"
                | "completed"
                | "suspended"
            submission_status:
                | "draft"
                | "submitted"
                | "under_review"
                | "approved"
                | "rejected"
                | "revision_requested"
            ticket_status: "open" | "in_progress" | "resolved" | "closed"
            validation_action_type:
                | "approve"
                | "reject"
                | "request_revision"
                | "comment"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export interface CmdtContribution {
    id: string
    title: string
    description: string | null
    content: string | null
    status: 'draft' | 'review' | 'pending' | 'validated' | 'rejected'
    version: string
    category: string | null
    country_id: string | null
    created_by: string | null
    collaborators: string[]
    is_pinned: boolean
    views: number
    comments_count: number
    submitted_at: string | null
    validated_at: string | null
    created_at: string
    updated_at: string
}