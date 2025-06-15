
-- First, drop all policies that depend on the get_current_user_role function
DROP POLICY IF EXISTS "Enable delete for admin users" ON public.users;
DROP POLICY IF EXISTS "Users can view profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.users;
DROP POLICY IF EXISTS "Ticket viewing policy" ON public.tickets;
DROP POLICY IF EXISTS "Ticket update policy" ON public.tickets;

-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Users can view based on role" ON public.users;
DROP POLICY IF EXISTS "Only admins can create users" ON public.users;
DROP POLICY IF EXISTS "Users can update based on role" ON public.users;
DROP POLICY IF EXISTS "Only admins can delete users" ON public.users;

-- Now we can safely drop the function
DROP FUNCTION IF EXISTS public.get_current_user_role();

-- Create a new security definer function that doesn't cause recursion
CREATE OR REPLACE FUNCTION public.get_user_role_safe()
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
  user_role text;
  current_user_id uuid;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid();
  
  -- If no authenticated user, return requester
  IF current_user_id IS NULL THEN
    RETURN 'requester';
  END IF;
  
  -- Check for super admin emails first
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = current_user_id 
    AND email IN ('ellisalat@gmail.com', 'mshahid@wajir.go.ke')
  ) THEN
    RETURN 'admin';
  END IF;
  
  -- Get role from users table
  SELECT role INTO user_role 
  FROM public.users 
  WHERE id = current_user_id;
  
  RETURN COALESCE(user_role, 'requester');
END;
$$;

-- Create new RLS policies for users table using the safe function
CREATE POLICY "Users can view based on role" ON public.users
FOR SELECT USING (
  public.get_user_role_safe() = 'admin' OR 
  id = auth.uid()
);

CREATE POLICY "Only admins can create users" ON public.users
FOR INSERT WITH CHECK (
  public.get_user_role_safe() = 'admin'
);

CREATE POLICY "Users can update based on role" ON public.users
FOR UPDATE USING (
  public.get_user_role_safe() = 'admin' OR 
  id = auth.uid()
);

CREATE POLICY "Only admins can delete users" ON public.users
FOR DELETE USING (
  public.get_user_role_safe() = 'admin' AND
  email NOT IN ('ellisalat@gmail.com', 'mshahid@wajir.go.ke')
);

-- Recreate policies for tickets table using the new safe function
CREATE POLICY "Ticket viewing policy" ON public.tickets
FOR SELECT USING (
  public.get_user_role_safe() IN ('admin', 'technician', 'approver') OR 
  submitted_by_id = auth.uid()
);

CREATE POLICY "Ticket update policy" ON public.tickets
FOR UPDATE USING (
  public.get_user_role_safe() IN ('admin', 'technician', 'approver')
);
