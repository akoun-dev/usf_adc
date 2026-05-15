-- Migration: Enable remote SQL execution via RPC
-- This should only be used temporarily for migration/sync purposes

CREATE OR REPLACE FUNCTION admin_run_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;
