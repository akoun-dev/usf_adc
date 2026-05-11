-- Migration: Add validity_end_date to documents for archiving
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS validity_end_date timestamp with time zone;
