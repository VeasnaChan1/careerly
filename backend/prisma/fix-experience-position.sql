BEGIN;

ALTER TABLE public.experience
  ALTER COLUMN position DROP DEFAULT;

ALTER TABLE public.experience
  ALTER COLUMN position TYPE integer USING position::integer,
  ALTER COLUMN position SET DEFAULT 0;

COMMIT;
