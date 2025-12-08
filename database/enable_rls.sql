-- Enable Row Level Security (RLS) for Supabase
-- Run this script in Supabase SQL Editor to fix security warnings

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on trips table
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
-- Allow service role (backend) to access all users
-- This is needed because Spring Boot backend connects directly to database
CREATE POLICY "Service role can access all users"
ON public.users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow postgres role (used by Spring Boot) to access all users
CREATE POLICY "Postgres role can access all users"
ON public.users
FOR ALL
TO postgres
USING (true)
WITH CHECK (true);

-- Create policies for trips table
-- Allow service role (backend) to access all trips
CREATE POLICY "Service role can access all trips"
ON public.trips
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow postgres role (used by Spring Boot) to access all trips
CREATE POLICY "Postgres role can access all trips"
ON public.trips
FOR ALL
TO postgres
USING (true)
WITH CHECK (true);

