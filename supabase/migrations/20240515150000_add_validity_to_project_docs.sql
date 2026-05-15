-- Migration: Add validity_end_date to project_documents for archiving
ALTER TABLE public.project_documents ADD COLUMN IF NOT EXISTS validity_end_date timestamp with time zone;
