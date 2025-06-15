
-- Add missing 'title' column to profiles table for Job Title
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS title TEXT;

-- Re-define is_admin function to be safer against recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_email TEXT;
  user_role TEXT;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  -- Check for super admin emails first, avoids touching profiles table if it's a superadmin
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  IF user_email IN ('ellisalat@gmail.com', 'mshahid@wajir.go.ke') THEN
    RETURN true;
  END IF;

  -- If not a super admin, check the role in profiles table
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role = 'admin';

EXCEPTION WHEN NO_DATA_FOUND THEN
  -- This can happen during signup before a profile is created.
  RETURN false;
END;
$function$;

-- Drop all existing policies on profiles to start fresh
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.profiles;';
    END LOOP;
END
$$;

-- Enable Row Level Security on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can perform any action on any profile.
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Policy: Authenticated users can view all profiles.
CREATE POLICY "Authenticated users can view profiles" ON public.profiles
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Users can update their own profile.
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
