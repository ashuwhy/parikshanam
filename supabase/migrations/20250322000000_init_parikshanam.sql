-- Parikshanam MVP schema (§5)

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  phone text,
  full_name text,
  avatar_url text,
  class_level text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, phone)
  values (new.id, new.phone);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subtitle text,
  description text,
  price integer not null,
  mrp integer,
  class_levels text[],
  olympiad_type text,
  thumbnail_url text,
  total_lessons integer default 0,
  duration_hours integer default 0,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.courses enable row level security;

create policy "Anyone can view active courses"
  on public.courses for select using (is_active = true);

create table public.purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  course_id uuid references public.courses on delete cascade not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  amount integer not null,
  status text default 'pending',
  created_at timestamptz default now(),
  unique (user_id, course_id)
);

alter table public.purchases enable row level security;

create policy "Users can view own purchases"
  on public.purchases for select using (auth.uid() = user_id);
create policy "Users can insert own purchases"
  on public.purchases for insert with check (auth.uid() = user_id);
create policy "Users can update own purchases"
  on public.purchases for update using (auth.uid() = user_id);
