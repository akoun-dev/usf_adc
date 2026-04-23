-- =====================================================
-- migration: setup country flags storage
-- =====================================================
-- purpose: create storage bucket for country flags and set policies
-- =====================================================

-- 1. Create the bucket
insert into storage.buckets (id, name, public)
values ('country-flags', 'country-flags', true)
on conflict (id) do nothing;

-- 2. RLS Policies for the bucket
-- Public can view flags
create policy "Public can view country flags"
  on storage.objects for select
  to public
  using (bucket_id = 'country-flags');

-- Only super_admins can upload/update/delete flags
create policy "Super admins can manage country flags"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'country-flags' 
    and public.has_role(auth.uid(), 'super_admin')
  )
  with check (
    bucket_id = 'country-flags' 
    and public.has_role(auth.uid(), 'super_admin')
  );
