
-- Fix for database recursion and user deletion errors

-- Step 1: Add email column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'email') THEN
    ALTER TABLE public.profiles ADD COLUMN email TEXT;
  END IF;
END;
$$;

-- Step 2: Backfill email addresses for existing users and add constraints
UPDATE public.profiles p SET email = (SELECT u.email FROM auth.users u WHERE u.id = p.id) WHERE p.email IS NULL;

DO $$
BEGIN
  IF (SELECT count(*) FROM public.profiles WHERE email IS NULL) = 0 THEN
    ALTER TABLE public.profiles ALTER COLUMN email SET NOT NULL;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_key' AND conrelid = 'public.profiles'::regclass) THEN
      ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
    END IF;
  END IF;
END;
$$;

-- Step 3: Update the user creation trigger to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, 'requester');
  RETURN new;
END;
$function$;

-- Step 4: Fix Foreign Keys on tickets table to allow user deletion
ALTER TABLE public.tickets DROP CONSTRAINT IF EXISTS tickets_requester_id_fkey;
ALTER TABLE public.tickets DROP CONSTRAINT IF EXISTS tickets_assigned_technician_id_fkey;
ALTER TABLE public.tickets ADD CONSTRAINT tickets_requester_id_fkey
  FOREIGN KEY (requester_id) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.tickets ADD CONSTRAINT tickets_assigned_technician_id_fkey
  FOREIGN KEY (assigned_technician_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Step 5: Clean up old RLS policies and functions to fix recursion
DROP POLICY IF EXISTS "Admins can view all profiles, others view themselves" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all, others can view their own" ON public.profiles;
DROP POLICY IF EXISTS "Only admins can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles, others update themselves" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all, users can update their own" ON public.profiles;
DROP POLICY IF EXISTS "Only admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete non-protected profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins and self can view users" ON public.profiles;
DROP POLICY IF EXISTS "Admins and self can update users" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert users" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete users" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

DROP FUNCTION IF EXISTS public.is_admin_user();
DROP FUNCTION IF EXISTS public.get_current_user_role();
DROP FUNCTION IF EXISTS public.get_user_role_safe();
DROP FUNCTION IF EXISTS public.is_admin();

-- Step 6: Create new, correct RLS policies on 'profiles' table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() AND email IN ('ellisalat@gmail.com', 'mshahid@wajir.go.ke')
  ) OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all, others can view their own" ON public.profiles
FOR SELECT USING (public.is_admin() OR id = auth.uid());

CREATE POLICY "Admins can create profiles" ON public.profiles
FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update all, users can update their own" ON public.profiles
FOR UPDATE USING (public.is_admin() OR id = auth.uid());

CREATE POLICY "Admins can delete non-protected profiles" ON public.profiles
FOR DELETE USING (
  public.is_admin() AND
  email NOT IN ('ellisalat@gmail.com', 'mshahid@wajir.go.ke')
);

