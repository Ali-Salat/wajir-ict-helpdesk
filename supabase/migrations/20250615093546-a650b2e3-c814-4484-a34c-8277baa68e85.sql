
-- First drop the dependent policies on tickets table
DROP POLICY IF EXISTS "Ticket viewing policy" ON public.tickets;
DROP POLICY IF EXISTS "Ticket update policy" ON public.tickets;

-- Now we can safely drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view based on role" ON public.users;
DROP POLICY IF EXISTS "Only admins can create users" ON public.users;
DROP POLICY IF EXISTS "Users can update based on role" ON public.users;
DROP POLICY IF EXISTS "Only admins can delete users" ON public.users;
DROP POLICY IF EXISTS "Admins and self can view users" ON public.users;
DROP POLICY IF EXISTS "Admins and self can update users" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;

-- Drop the problematic function
DROP FUNCTION IF EXISTS public.get_user_role_safe();

-- Create a new security definer function that doesn't cause recursion
-- by only checking auth.users table (not public.users)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  current_user_email text;
BEGIN
  -- Get the current user's email from auth.users
  SELECT email INTO current_user_email
  FROM auth.users
  WHERE id = auth.uid();
  
  -- Check if user is a super admin
  RETURN current_user_email IN ('ellisalat@gmail.com', 'mshahid@wajir.go.ke');
END;
$$;

-- Create a new function to get user role safely for tickets
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
  current_user_email text;
BEGIN
  -- Get the current user's email from auth.users
  SELECT email INTO current_user_email
  FROM auth.users
  WHERE id = auth.uid();
  
  -- Check if user is a super admin first
  IF current_user_email IN ('ellisalat@gmail.com', 'mshahid@wajir.go.ke') THEN
    RETURN 'admin';
  END IF;
  
  -- Get role from users table
  SELECT role INTO user_role
  FROM public.users
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_role, 'requester');
END;
$$;

-- Create simplified RLS policies for users that don't cause recursion
CREATE POLICY "Admins can view all users, others can view themselves"
ON public.users
FOR SELECT
USING (
  public.is_admin_user() OR id = auth.uid()
);

CREATE POLICY "Only admins can create users"
ON public.users
FOR INSERT
WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can update all users, others can update themselves"
ON public.users
FOR UPDATE
USING (
  public.is_admin_user() OR id = auth.uid()
);

CREATE POLICY "Only admins can delete users (except protected ones)"
ON public.users
FOR DELETE
USING (
  public.is_admin_user() AND
  email NOT IN ('ellisalat@gmail.com', 'mshahid@wajir.go.ke')
);

-- Recreate ticket policies using the correct column names
CREATE POLICY "Ticket viewing policy"
ON public.tickets
FOR SELECT
USING (
  public.get_current_user_role() IN ('admin', 'approver', 'technician') OR
  submitted_by_id = auth.uid() OR
  assigned_to = auth.uid()
);

CREATE POLICY "Ticket update policy"
ON public.tickets
FOR UPDATE
USING (
  public.get_current_user_role() IN ('admin', 'technician') OR
  (public.get_current_user_role() = 'approver' AND status IN ('open', 'in_progress'))
);

-- Ensure RLS is enabled on both tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
