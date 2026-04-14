-- Keep a dedicated all-users email view for internal admin server usage.
CREATE OR REPLACE VIEW public.user_emails
  WITH (security_barrier = true) AS
  SELECT id, email FROM auth.users;

REVOKE SELECT ON public.user_emails FROM anon, authenticated;

-- Restrict admin_user_emails to true admin accounts only.
CREATE OR REPLACE VIEW public.admin_user_emails
  WITH (security_barrier = true) AS
  SELECT u.id, u.email
  FROM auth.users u
  JOIN public.profiles p ON p.id = u.id
  WHERE p.role = 'admin';

REVOKE SELECT ON public.admin_user_emails FROM anon, authenticated;
