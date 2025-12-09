-- Migration: Add translations support to trips table
-- Run this script to add multilingual support

-- Add translations column (JSONB) to store title and description in multiple languages
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{"th": {"title": "", "description": ""}, "en": {"title": "", "description": ""}}'::jsonb;

-- Migrate existing data: copy title and description to translations.th
UPDATE trips 
SET translations = jsonb_build_object(
  'th', jsonb_build_object(
    'title', COALESCE(title, ''),
    'description', COALESCE(description, '')
  ),
  'en', jsonb_build_object(
    'title', COALESCE(title, ''),
    'description', COALESCE(description, '')
  )
)
WHERE translations IS NULL OR translations = '{}'::jsonb;

-- Create index for JSONB queries
CREATE INDEX IF NOT EXISTS idx_trips_translations ON trips USING GIN (translations);

-- Add comment
COMMENT ON COLUMN trips.translations IS 'Multilingual content: {"th": {"title": "...", "description": "..."}, "en": {"title": "...", "description": "..."}}';

