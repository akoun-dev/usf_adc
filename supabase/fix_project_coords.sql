-- Combined Refined Project Coordinates Fix (Version 4)
-- Combined into a single statement to avoid Supabase CLI multi-command error.

UPDATE public.projects p
SET 
  latitude = sub.new_lat + (random() - 0.5) * sub.new_spread,
  longitude = sub.new_lng + (random() - 0.5) * sub.new_spread
FROM (
  SELECT c.id,
    CASE LOWER(c.code_iso)
      WHEN 'dz' THEN 28.03 WHEN 'ao' THEN -11.20 WHEN 'bj' THEN 9.30 WHEN 'bw' THEN -22.32
      WHEN 'bf' THEN 12.23 WHEN 'bi' THEN -3.37 WHEN 'cv' THEN 16.00 WHEN 'cm' THEN 7.36
      WHEN 'cf' THEN 6.61 WHEN 'td' THEN 15.45 WHEN 'km' THEN -11.64 WHEN 'cd' THEN -4.03
      WHEN 'cg' THEN -0.22 WHEN 'ci' THEN 7.53 WHEN 'dj' THEN 11.82 WHEN 'eg' THEN 26.82
      WHEN 'gq' THEN 1.65 WHEN 'er' THEN 15.17 WHEN 'sz' THEN -26.52 WHEN 'et' THEN 9.14
      WHEN 'ga' THEN -0.80 WHEN 'gm' THEN 13.44 WHEN 'gh' THEN 7.94 WHEN 'gn' THEN 9.94
      WHEN 'gw' THEN 11.80 WHEN 'ke' THEN -0.02 WHEN 'ls' THEN -29.61 WHEN 'lr' THEN 6.42
      WHEN 'ly' THEN 26.33 WHEN 'mg' THEN -18.76 WHEN 'mw' THEN -13.25 WHEN 'ml' THEN 17.57
      WHEN 'mr' THEN 21.00 WHEN 'mu' THEN -20.34 WHEN 'ma' THEN 31.79 WHEN 'mz' THEN -18.66
      WHEN 'na' THEN -22.95 WHEN 'ne' THEN 17.60 WHEN 'ng' THEN 9.08 WHEN 'rw' THEN -1.94
      WHEN 'st' THEN 0.18 WHEN 'sn' THEN 14.49 WHEN 'sc' THEN -4.67 WHEN 'sl' THEN 8.46
      WHEN 'so' THEN 5.15 WHEN 'za' THEN -30.55 WHEN 'ss' THEN 6.87 WHEN 'sd' THEN 12.86
      WHEN 'tz' THEN -6.36 WHEN 'tg' THEN 8.61 WHEN 'tn' THEN 33.88 WHEN 'ug' THEN 1.37
      WHEN 'eh' THEN 24.21 WHEN 'zm' THEN -13.13 WHEN 'zw' THEN -19.01
      ELSE 7.53 -- Default CI Lat
    END as new_lat,
    CASE LOWER(c.code_iso)
      WHEN 'dz' THEN 1.65 WHEN 'ao' THEN 17.87 WHEN 'bj' THEN 2.31 WHEN 'bw' THEN 24.68
      WHEN 'bf' THEN -1.56 WHEN 'bi' THEN 29.91 WHEN 'cv' THEN -24.01 WHEN 'cm' THEN 12.35
      WHEN 'cf' THEN 20.93 WHEN 'td' THEN 18.73 WHEN 'km' THEN 43.33 WHEN 'cd' THEN 21.75
      WHEN 'cg' THEN 15.82 WHEN 'ci' THEN -5.54 WHEN 'dj' THEN 42.59 WHEN 'eg' THEN 30.80
      WHEN 'gq' THEN 10.26 WHEN 'er' THEN 39.78 WHEN 'sz' THEN 31.46 WHEN 'et' THEN 40.48
      WHEN 'ga' THEN 11.60 WHEN 'gm' THEN -15.31 WHEN 'gh' THEN -1.02 WHEN 'gn' THEN -9.69
      WHEN 'gw' THEN -15.10 WHEN 'ke' THEN 37.90 WHEN 'ls' THEN 28.23 WHEN 'lr' THEN -9.42
      WHEN 'ly' THEN 17.22 WHEN 'mg' THEN 46.86 WHEN 'mw' THEN 34.30 WHEN 'ml' THEN -3.99
      WHEN 'mr' THEN -10.94 WHEN 'mu' THEN 57.55 WHEN 'ma' THEN -7.09 WHEN 'mz' THEN 35.52
      WHEN 'na' THEN 18.49 WHEN 'ne' THEN 8.08 WHEN 'ng' THEN 8.67 WHEN 'rw' THEN 29.87
      WHEN 'st' THEN 6.61 WHEN 'sn' THEN -14.45 WHEN 'sc' THEN 55.49 WHEN 'sl' THEN -11.77
      WHEN 'so' THEN 46.19 WHEN 'za' THEN 22.93 WHEN 'ss' THEN 31.30 WHEN 'sd' THEN 30.21
      WHEN 'tz' THEN 34.88 WHEN 'tg' THEN 0.82 WHEN 'tn' THEN 9.53 WHEN 'ug' THEN 32.29
      WHEN 'eh' THEN -12.88 WHEN 'zm' THEN 27.84 WHEN 'zw' THEN 29.15
      ELSE -5.54 -- Default CI Lng
    END as new_lng,
    CASE
      WHEN LOWER(c.code_iso) = 'cv' THEN 0.05 -- Very tight for Cape Verde
      WHEN LOWER(c.code_iso) IN ('sc', 'mu', 'st', 'km', 'gm', 'tg', 'bj', 'rw', 'bi', 'ls', 'sz') THEN 0.1 -- Small/Narrow
      WHEN LOWER(c.code_iso) IN ('ci', 'sn', 'gn', 'lr', 'sl', 'gh', 'cm', 'ga', 'cg', 'ao', 'na', 'za', 'mz', 'tz', 'ke', 'so', 'er', 'dj', 'eg', 'ly', 'tn', 'dz', 'ma', 'eh', 'mr') THEN 0.2 -- Coastal
      ELSE 0.4 -- Inland
    END as new_spread
  FROM public.countries c
) as sub
WHERE p.country_id = sub.id;
