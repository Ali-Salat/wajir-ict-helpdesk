
-- First, update any tickets that are assigned to users we want to delete
-- Set assigned_to to NULL for tickets assigned to users other than ellisalat@gmail.com
UPDATE public.tickets 
SET assigned_to = NULL 
WHERE assigned_to IS NOT NULL 
AND assigned_to NOT IN (
  SELECT id FROM public.users WHERE email = 'ellisalat@gmail.com'
);

-- Delete any tickets that were submitted by users other than ellisalat@gmail.com
DELETE FROM public.tickets 
WHERE submitted_by_email != 'ellisalat@gmail.com';

-- Delete any password reset requirements for users we want to delete
DELETE FROM public.password_reset_requirements 
WHERE user_id NOT IN (
  SELECT id FROM public.users WHERE email = 'ellisalat@gmail.com'
);

-- Finally, delete all users except ellisalat@gmail.com
DELETE FROM public.users 
WHERE email != 'ellisalat@gmail.com';
