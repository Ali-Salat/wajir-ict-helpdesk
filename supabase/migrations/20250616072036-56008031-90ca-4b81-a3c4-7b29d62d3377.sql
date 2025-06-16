
-- Step 1: Clean up any orphaned user profiles to prevent errors.
DELETE FROM public.profiles WHERE id NOT IN (SELECT id FROM auth.users);

-- Step 2: Create a direct link between user profiles and the main authentication table.
-- This ensures that when a user is deleted from the authentication system, their profile is also automatically and efficiently removed.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id)
REFERENCES auth.users (id) ON DELETE CASCADE;
