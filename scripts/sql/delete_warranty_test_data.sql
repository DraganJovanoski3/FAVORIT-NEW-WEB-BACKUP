-- =============================================================================
-- Delete all warranty registration (test) data – run in Supabase SQL Editor
-- Table: warranty_submissions
-- =============================================================================
-- WARNING: This permanently deletes ALL rows. Use only to clear test data
--          before production. Backup first if you need to keep any data.
-- =============================================================================

-- Option A: DELETE (row-by-row, can use WHERE to limit)
DELETE FROM warranty_submissions;

-- Option B (alternative): TRUNCATE – faster, resets any identity/serial columns
-- Uncomment the line below and comment out the DELETE above if you prefer:
-- TRUNCATE TABLE warranty_submissions RESTART IDENTITY;

-- Verify: should return 0
-- SELECT COUNT(*) FROM warranty_submissions;
