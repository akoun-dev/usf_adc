export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          content: string
          created_by: string | null
          expires_at: string | null
          id: string
          published_at: string | null
          target_roles: Database["public"]["Enums"]["app_role"][] | null
          title: string
          training_id: string | null
          type: string
        }
        Insert: {
          content: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          published_at?: string | null
          target_roles?: Database["public"]["Enums"]["app_role"][] | null
          title: string
          training_id?: string | null
          type?: string
        }
        Update: {
          content?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          published_at?: string | null
          target_roles?: Database["public"]["Enums"]["app_role"][] | null
          title?: string
          training_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          key: string
          last_used_at: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          key: string
          last_used_at?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          key?: string
          last_used_at?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      article_translations: {
        Row: {
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          language: string
          news_id: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          language: string
          news_id: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          language?: string
          news_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_translations_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
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
        Row: {
          category: string | null
          collaborators: Json | null
          comments_count: number | null
          content: string | null
          country_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_pinned: boolean | null
          status: string
          submitted_at: string | null
          title: string
          updated_at: string | null
          validated_at: string | null
          version: string | null
          views: number | null
        }
        Insert: {
          category?: string | null
          collaborators?: Json | null
          comments_count?: number | null
          content?: string | null
          country_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_pinned?: boolean | null
          status?: string
          submitted_at?: string | null
          title: string
          updated_at?: string | null
          validated_at?: string | null
          version?: string | null
          views?: number | null
        }
        Update: {
          category?: string | null
          collaborators?: Json | null
          comments_count?: number | null
          content?: string | null
          country_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_pinned?: boolean | null
          status?: string
          submitted_at?: string | null
          title?: string
          updated_at?: string | null
          validated_at?: string | null
          version?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cmdt_contributions_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          capital: string | null
          code_iso: string
          created_at: string
          description: string | null
          flag_url: string | null
          fsu_budget: string | null
          fsu_coordinator_email: string | null
          fsu_coordinator_name: string | null
          fsu_coordinator_phone: string | null
          fsu_established: string | null
          id: string
          legal_texts: string | null
          logo_path: string | null
          name_en: string
          name_fr: string
          official_name: string | null
          population: string | null
          region: string
          updated_at: string
        }
        Insert: {
          capital?: string | null
          code_iso: string
          created_at?: string
          description?: string | null
          flag_url?: string | null
          fsu_budget?: string | null
          fsu_coordinator_email?: string | null
          fsu_coordinator_name?: string | null
          fsu_coordinator_phone?: string | null
          fsu_established?: string | null
          id?: string
          legal_texts?: string | null
          logo_path?: string | null
          name_en: string
          name_fr: string
          official_name?: string | null
          population?: string | null
          region: string
          updated_at?: string
        }
        Update: {
          capital?: string | null
          code_iso?: string
          created_at?: string
          description?: string | null
          flag_url?: string | null
          fsu_budget?: string | null
          fsu_coordinator_email?: string | null
          fsu_coordinator_name?: string | null
          fsu_coordinator_phone?: string | null
          fsu_established?: string | null
          id?: string
          legal_texts?: string | null
          logo_path?: string | null
          name_en?: string
          name_fr?: string
          official_name?: string | null
          population?: string | null
          region?: string
          updated_at?: string
        }
        Relationships: []
      }
      document_comments: {
        Row: {
          author_name: string
          content: string
          created_at: string | null
          document_id: string
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          author_name?: string
          content: string
          created_at?: string | null
          document_id: string
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string | null
          document_id?: string
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_comments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_permissions: {
        Row: {
          created_at: string | null
          document_id: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          document_id: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          document_id?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_permissions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_tags: {
        Row: {
          created_at: string | null
          document_id: string
          tag: string
        }
        Insert: {
          created_at?: string | null
          document_id: string
          tag: string
        }
        Update: {
          created_at?: string | null
          document_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_tags_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          change_summary: string | null
          changelog: string | null
          content: string | null
          created_at: string
          created_by: string | null
          document_id: string
          file_name: string | null
          file_path: string | null
          file_size: number | null
          id: string
          mime_type: string | null
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          changelog?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          document_id: string
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          version_number: number
        }
        Update: {
          change_summary?: string | null
          changelog?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          document_id?: string
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string
          closed_at: string | null
          closed_by: string | null
          content: string | null
          country_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          download_count: number | null
          featured: boolean | null
          file_name: string
          file_path: string
          file_size: number | null
          file_url: string | null
          id: string
          is_public: boolean | null
          language: string | null
          last_edited_by: string | null
          locked_at: string | null
          locked_by: string | null
          metadata: Json | null
          mime_type: string | null
          published_at: string | null
          status: string | null
          status_workflow: string | null
          thumbnail: string | null
          title: string
          type: string | null
          updated_at: string | null
          uploaded_by: string | null
          version: string | null
        }
        Insert: {
          category: string
          closed_at?: string | null
          closed_by?: string | null
          content?: string | null
          country_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          download_count?: number | null
          featured?: boolean | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          language?: string | null
          last_edited_by?: string | null
          locked_at?: string | null
          locked_by?: string | null
          metadata?: Json | null
          mime_type?: string | null
          published_at?: string | null
          status?: string | null
          status_workflow?: string | null
          thumbnail?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          version?: string | null
        }
        Update: {
          category?: string
          closed_at?: string | null
          closed_by?: string | null
          content?: string | null
          country_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          download_count?: number | null
          featured?: boolean | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          language?: string | null
          last_edited_by?: string | null
          locked_at?: string | null
          locked_by?: string | null
          metadata?: Json | null
          mime_type?: string | null
          published_at?: string | null
          status?: string | null
          status_workflow?: string | null
          thumbnail?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_closed_by_fkey"
            columns: ["closed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_last_edited_by_fkey"
            columns: ["last_edited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_locked_by_fkey"
            columns: ["locked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          notes: string | null
          registered_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          notes?: string | null
          registered_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          registered_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_tags: {
        Row: {
          event_id: string
          id: string
          tag: string
        }
        Insert: {
          event_id: string
          id?: string
          tag: string
        }
        Update: {
          event_id?: string
          id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_tags_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          country_id: string | null
          created_at: string
          created_by: string | null
          description: Json | null
          end_date: string
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          image_url: string | null
          is_public: boolean
          language: string | null
          location: Json | null
          max_participants: number | null
          organizer: string | null
          price: string | null
          registration_url: string | null
          start_date: string
          status: Database["public"]["Enums"]["event_status"]
          title: Json
          updated_at: string
        }
        Insert: {
          country_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: Json | null
          end_date: string
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          image_url?: string | null
          is_public?: boolean
          language?: string | null
          location?: Json | null
          max_participants?: number | null
          organizer?: string | null
          price?: string | null
          registration_url?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["event_status"]
          title: Json
          updated_at?: string
        }
        Update: {
          country_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: Json | null
          end_date?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          image_url?: string | null
          is_public?: boolean
          language?: string | null
          location?: Json | null
          max_participants?: number | null
          organizer?: string | null
          price?: string | null
          registration_url?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["event_status"]
          title?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
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
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_solution: boolean | null
          topic_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_solution?: boolean | null
          topic_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_solution?: boolean | null
          topic_id?: string
          updated_at?: string | null
        }
        Relationships: [
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
      forum_topic_tags: {
        Row: {
          id: string
          tag: string
          topic_id: string
        }
        Insert: {
          id?: string
          tag: string
          topic_id: string
        }
        Update: {
          id?: string
          tag?: string
          topic_id?: string
        }
        Relationships: []
      }
      forum_topics: {
        Row: {
          category_id: string
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          is_public: boolean | null
          status: string | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          category_id: string
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          is_public?: boolean | null
          status?: string | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          category_id?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          is_public?: boolean | null
          status?: string | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_topics_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      fsu_agencies: {
        Row: {
          agency_type: string | null
          contact_email: string | null
          contact_phone: string | null
          country_id: string
          created_at: string | null
          dg_message: Json | null
          dg_name: string | null
          dg_photo_url: string | null
          fsu_name: string | null
          headquarters: string | null
          id: string
          latitude: number | null
          longitude: number | null
          updated_at: string | null
        }
        Insert: {
          agency_type?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country_id: string
          created_at?: string | null
          dg_message?: Json | null
          dg_name?: string | null
          dg_photo_url?: string | null
          fsu_name?: string | null
          headquarters?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          updated_at?: string | null
        }
        Update: {
          agency_type?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          country_id?: string
          created_at?: string | null
          dg_message?: Json | null
          dg_name?: string | null
          dg_photo_url?: string | null
          fsu_name?: string | null
          headquarters?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fsu_agencies_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
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
      internal_messages: {
        Row: {
          content: Json | null
          created_at: string | null
          deleted_at_recipient: string | null
          deleted_at_sender: string | null
          id: string
          language: string | null
          parent_message_id: string | null
          read_at: string | null
          recipient_id: string | null
          sender_id: string
          status: string
          subject: Json | null
          thread_id: string | null
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          deleted_at_recipient?: string | null
          deleted_at_sender?: string | null
          id?: string
          language?: string | null
          parent_message_id?: string | null
          read_at?: string | null
          recipient_id?: string | null
          sender_id: string
          status?: string
          subject?: Json | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          deleted_at_recipient?: string | null
          deleted_at_sender?: string | null
          id?: string
          language?: string | null
          parent_message_id?: string | null
          read_at?: string | null
          recipient_id?: string | null
          sender_id?: string
          status?: string
          subject?: Json | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internal_messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "internal_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      ip_restrictions: {
        Row: {
          created_at: string
          id: string
          ip_range: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_range: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_range?: string
          name?: string
          type?: string
          updated_at?: string
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
      news: {
        Row: {
          allow_comments: boolean | null
          author: string | null
          category: Json | null
          category_id: string | null
          content: Json | null
          country_id: string | null
          created_at: string
          created_by: string | null
          excerpt: Json | null
          featured_image: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_public: boolean
          language: string
          meta_description: string | null
          meta_keywords: string | null
          published_at: string
          read_time: string | null
          slug: string | null
          sort_order: number | null
          source: string | null
          status: Database["public"]["Enums"]["news_status"]
          title: Json
          updated_at: string
        }
        Insert: {
          allow_comments?: boolean | null
          author?: string | null
          category?: Json | null
          category_id?: string | null
          content?: Json | null
          country_id?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: Json | null
          featured_image?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_public?: boolean
          language?: string
          meta_description?: string | null
          meta_keywords?: string | null
          published_at?: string
          read_time?: string | null
          slug?: string | null
          sort_order?: number | null
          source?: string | null
          status?: Database["public"]["Enums"]["news_status"]
          title: Json
          updated_at?: string
        }
        Update: {
          allow_comments?: boolean | null
          author?: string | null
          category?: Json | null
          category_id?: string | null
          content?: Json | null
          country_id?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: Json | null
          featured_image?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_public?: boolean
          language?: string
          meta_description?: string | null
          meta_keywords?: string | null
          published_at?: string
          read_time?: string | null
          slug?: string | null
          sort_order?: number | null
          source?: string | null
          status?: Database["public"]["Enums"]["news_status"]
          title?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "news_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      news_categories: {
        Row: {
          color: string | null
          created_at: string
          icon: string | null
          id: string
          is_active: boolean | null
          name_en: string
          name_fr: string
          name_pt: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_en: string
          name_fr: string
          name_pt: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_en?: string
          name_fr?: string
          name_pt?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      news_gallery_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          id: string
          image_url: string
          news_id: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          news_id: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          news_id?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_gallery_images_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      news_tags: {
        Row: {
          id: string
          news_id: string
          tag: string
        }
        Insert: {
          id?: string
          news_id: string
          tag: string
        }
        Update: {
          id?: string
          news_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_tags_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
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
        Row: {
          avatar_url: string | null
          country_id: string | null
          created_at: string
          full_name: string | null
          id: string
          is_active: boolean
          language: string
          mfa_method: string
          phone: string | null
          telegram_chat_id: string | null
          updated_at: string
        }
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
      project_actors: {
        Row: {
          contact: string | null
          created_at: string
          id: string
          name: string
          organization: string | null
          project_id: string
          role: string | null
          type: string
        }
        Insert: {
          contact?: string | null
          created_at?: string
          id?: string
          name: string
          organization?: string | null
          project_id: string
          role?: string | null
          type: string
        }
        Update: {
          contact?: string | null
          created_at?: string
          id?: string
          name?: string
          organization?: string | null
          project_id?: string
          role?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_actors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documents: {
        Row: {
          created_at: string
          document_type: string | null
          file_name: string
          file_size: number
          file_url: string
          id: string
          mime_type: string
          project_id: string
        }
        Insert: {
          created_at?: string
          document_type?: string | null
          file_name: string
          file_size: number
          file_url: string
          id?: string
          mime_type: string
          project_id: string
        }
        Update: {
          created_at?: string
          document_type?: string | null
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          mime_type?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          project_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          project_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          project_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_project_tags: {
        Row: {
          project_id: string
          tag_id: string
        }
        Insert: {
          project_id: string
          tag_id: string
        }
        Update: {
          project_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_project_tags_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_project_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "project_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          beneficiaries: string | null
          budget: number | null
          country_id: string
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          indicators: string | null
          latitude: number | null
          longitude: number | null
          objectives: string | null
          operator: string | null
          progress: number | null
          region: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          thematic: string | null
          title: string
          updated_at: string
        }
        Insert: {
          beneficiaries?: string | null
          budget?: number | null
          country_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          indicators?: string | null
          latitude?: number | null
          longitude?: number | null
          objectives?: string | null
          operator?: string | null
          progress?: number | null
          region?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          thematic?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          beneficiaries?: string | null
          budget?: number | null
          country_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          indicators?: string | null
          latitude?: number | null
          longitude?: number | null
          objectives?: string | null
          operator?: string | null
          progress?: number | null
          region?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          thematic?: string | null
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
      quarterly_reports: {
        Row: {
          created_at: string
          file_url: string | null
          id: string
          is_published: boolean
          quarter: string
          summary: string | null
          title: string
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          file_url?: string | null
          id?: string
          is_published?: boolean
          quarter: string
          summary?: string | null
          title: string
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          file_url?: string | null
          id?: string
          is_published?: boolean
          quarter?: string
          summary?: string | null
          title?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      role_promotions: {
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
            foreignKeyName: "support_ticket_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      training_documents: {
        Row: {
          access_roles: Database["public"]["Enums"]["app_role"][] | null
          document_id: string
          id: string
          training_id: string
        }
        Insert: {
          access_roles?: Database["public"]["Enums"]["app_role"][] | null
          document_id: string
          id?: string
          training_id: string
        }
        Update: {
          access_roles?: Database["public"]["Enums"]["app_role"][] | null
          document_id?: string
          id?: string
          training_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_documents_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      training_events: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          start_date: string
          title: string
          training_id: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          start_date: string
          title: string
          training_id?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          start_date?: string
          title?: string
          training_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_events_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      training_registrations: {
        Row: {
          id: string
          registered_at: string | null
          status: string
          training_id: string
          user_id: string
        }
        Insert: {
          id?: string
          registered_at?: string | null
          status?: string
          training_id: string
          user_id: string
        }
        Update: {
          id?: string
          registered_at?: string | null
          status?: string
          training_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_registrations_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      trainings: {
        Row: {
          capacity: number | null
          content: Json | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          location: string | null
          start_date: string | null
          status: string
          title: string
          trainer: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          content?: Json | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          start_date?: string | null
          status?: string
          title: string
          trainer?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          content?: Json | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          start_date?: string | null
          status?: string
          title?: string
          trainer?: string | null
          type?: string
          updated_at?: string | null
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
      bytea_to_text: { Args: { data: string }; Returns: string }
      cleanup_old_category_column: { Args: never; Returns: undefined }
      create_article_gallery_bucket: { Args: never; Returns: undefined }
      create_article_images_bucket: { Args: never; Returns: undefined }
      fn_auto_translate_jsonb: {
        Args: { p_field_value: Json; p_source_lang: string }
        Returns: Json
      }
      fn_libretranslate: {
        Args: { p_source_lang: string; p_target_lang: string; p_text: string }
        Returns: string
      }
      generate_mfa_code: { Args: { _user_id: string }; Returns: string }
      get_user_country: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "http_request"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_delete:
        | {
            Args: { uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_get:
        | {
            Args: { uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
        SetofOptions: {
          from: "*"
          to: "http_header"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_list_curlopt: {
        Args: never
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_post:
        | {
            Args: { content: string; content_type: string; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | {
            Args: { data: Json; uri: string }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
            SetofOptions: {
              from: "*"
              to: "http_response"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      http_put: {
        Args: { content: string; content_type: string; uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
        SetofOptions: {
          from: "*"
          to: "http_response"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      http_reset_curlopt: { Args: never; Returns: boolean }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      increment_forum_topic_views: {
        Args: { topic_id: string }
        Returns: undefined
      }
      migrate_existing_news_categories: { Args: never; Returns: undefined }
      migrate_news_category: { Args: never; Returns: undefined }
      text_to_bytea: { Args: { data: string }; Returns: string }
      unlock_expired_documents: { Args: never; Returns: undefined }
      urlencode:
        | { Args: { data: Json }; Returns: string }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { string: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.urlencode(string => bytea), public.urlencode(string => varchar). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
      verify_mfa_code: {
        Args: { _code: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "point_focal"
        | "country_admin"
        | "super_admin"
        | "contributor"
        | "editor"
        | "participant"
      event_status: "upcoming" | "ongoing" | "completed" | "cancelled"
      event_type:
        | "conference"
        | "webinar"
        | "workshop"
        | "training"
        | "meeting"
        | "other"
      invitation_status: "pending" | "accepted" | "expired" | "cancelled"
      news_status: "draft" | "in_review" | "published" | "archived"
      notification_type:
        | "info"
        | "warning"
        | "action_required"
        | "system"
        | "training_announcement"
      project_status:
        | "draft"
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
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: [
        "point_focal",
        "country_admin",
        "super_admin",
        "contributor",
        "editor",
        "participant",
      ],
      event_status: ["upcoming", "ongoing", "completed", "cancelled"],
      event_type: [
        "conference",
        "webinar",
        "workshop",
        "training",
        "meeting",
        "other",
      ],
      invitation_status: ["pending", "accepted", "expired", "cancelled"],
      news_status: ["draft", "in_review", "published", "archived"],
      notification_type: [
        "info",
        "warning",
        "action_required",
        "system",
        "training_announcement",
      ],
      project_status: [
        "draft",
        "planned",
        "in_progress",
        "completed",
        "suspended",
      ],
      submission_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "revision_requested",
      ],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
      validation_action_type: [
        "approve",
        "reject",
        "request_revision",
        "comment",
      ],
    },
  },
} as const

