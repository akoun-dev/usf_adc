-- =====================================================
-- migration: add 'draft' value to project_status enum
-- =====================================================
-- purpose: allow projects to have a 'draft' status
--          (required before policies reference it)
-- =====================================================

ALTER TYPE public.project_status ADD VALUE IF NOT EXISTS 'draft' BEFORE 'planned';
