
-- Enable RLS on users table if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to get current user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  -- Check if user exists and get their role
  SELECT role INTO user_role 
  FROM public.users 
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_role, 'requester');
END;
$$;

-- Create RLS policies for users table
-- Policy for selecting users - admins can see all, others only themselves
CREATE POLICY "Users can view based on role" ON public.users
FOR SELECT USING (
  public.get_current_user_role() IN ('admin') OR 
  id = auth.uid()
);

-- Policy for inserting users - only admins can create users
CREATE POLICY "Only admins can create users" ON public.users
FOR INSERT WITH CHECK (
  public.get_current_user_role() = 'admin'
);

-- Policy for updating users - admins can update all, users can update themselves
CREATE POLICY "Users can update based on role" ON public.users
FOR UPDATE USING (
  public.get_current_user_role() = 'admin' OR 
  id = auth.uid()
);

-- Policy for deleting users - only admins can delete users (except super users)
CREATE POLICY "Only admins can delete users" ON public.users
FOR DELETE USING (
  public.get_current_user_role() = 'admin' AND
  email NOT IN ('ellisalat@gmail.com', 'mshahid@wajir.go.ke')
);
