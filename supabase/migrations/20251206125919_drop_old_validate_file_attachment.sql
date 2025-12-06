/*
  # Remove Old validate_file_attachment Function

  This migration removes the old version of the validate_file_attachment function
  that has an insecure signature and is causing security warnings.

  ## Changes
  - Drop old `validate_file_attachment(jsonb)` function
  - Keep the secure `validate_file_attachment(text, bigint)` version
*/

-- Drop the old insecure version with jsonb parameter
DROP FUNCTION IF EXISTS public.validate_file_attachment(jsonb) CASCADE;
DROP FUNCTION IF EXISTS validate_file_attachment(jsonb) CASCADE;