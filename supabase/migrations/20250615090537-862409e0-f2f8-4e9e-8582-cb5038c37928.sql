
-- 1. Remove any existing policies on the users table (if there are any).
DROP POLICY IF EXISTS "Allow select for allowed roles" ON public.users;
DROP POLICY IF EXISTS "Allow select for admins" ON public.users;
-- 2. Create a Security Definer function for safe role lookup
CREATE OR REPLACE FUNCTION public.get_user_role_safe()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $function$
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
$function$;

-- 3. Enable RLS on users and add policy using the new safe function
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and self can view users"
ON public.users
FOR SELECT
USING (
  public.get_user_role_safe() = 'admin'
  OR id = auth.uid()
);

-- Provide same policy for UPDATE/DELETE as needed:
CREATE POLICY "Admins and self can update users"
ON public.users
FOR UPDATE
USING (
  public.get_user_role_safe() = 'admin'
  OR id = auth.uid()
);

CREATE POLICY "Admins can insert users"
ON public.users
FOR INSERT
WITH CHECK (
  public.get_user_role_safe() = 'admin'
);

CREATE POLICY "Admins can delete users"
ON public.users
FOR DELETE
USING (
  public.get_user_role_safe() = 'admin'
);

