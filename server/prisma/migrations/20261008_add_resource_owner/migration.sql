-- Safe upgrade for older ResourceBook databases.
ALTER TABLE "Resource" ADD COLUMN IF NOT EXISTS "ownerId" TEXT;

CREATE INDEX IF NOT EXISTS "Resource_ownerId_status_idx" ON "Resource"("ownerId", "status");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Resource_ownerId_fkey'
  ) THEN
    ALTER TABLE "Resource"
      ADD CONSTRAINT "Resource_ownerId_fkey"
      FOREIGN KEY ("ownerId") REFERENCES "User"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
