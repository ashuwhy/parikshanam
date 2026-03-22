-- Reference data: class levels + Olympiad types; courses link via FKs; profiles use class_level_id

create table public.class_levels (
  id text primary key,
  label text not null,
  min_age integer,
  max_age integer
);

insert into public.class_levels (id, label, min_age, max_age) values
  ('6', 'Class 6', 11, 12),
  ('7', 'Class 7', 12, 13),
  ('8', 'Class 8', 13, 14),
  ('9', 'Class 9', 14, 15),
  ('10', 'Class 10', 15, 16),
  ('11', 'Class 11', 16, 17),
  ('12', 'Class 12', 17, 18);

alter table public.class_levels enable row level security;

create policy "Anyone can read class levels"
  on public.class_levels for select using (true);

grant select on public.class_levels to anon, authenticated;

create table public.olympiad_types (
  id text primary key,
  label text not null,
  color_hex text not null
);

insert into public.olympiad_types (id, label, color_hex) values
  ('imo', 'IMO', '#4F46E5'),
  ('nso', 'NSO', '#F59E0B'),
  ('ieo', 'IEO', '#10B981'),
  ('nco', 'NCO', '#EF4444'),
  ('sso', 'Science Olympiad', '#8B5CF6');

alter table public.olympiad_types enable row level security;

create policy "Anyone can read olympiad types"
  on public.olympiad_types for select using (true);

grant select on public.olympiad_types to anon, authenticated;

-- Profiles: add FK to class_levels; migrate from class_level text
alter table public.profiles
  add column if not exists class_level_id text references public.class_levels(id);

update public.profiles p
set class_level_id = p.class_level
where p.class_level is not null
  and exists (select 1 from public.class_levels c where c.id = p.class_level);

alter table public.profiles drop column if exists class_level;

-- Courses: new FK columns + backfill from legacy olympiad_type + class_levels[]
alter table public.courses
  add column if not exists olympiad_type_id text references public.olympiad_types(id),
  add column if not exists min_class_id text references public.class_levels(id),
  add column if not exists max_class_id text references public.class_levels(id);

update public.courses c
set olympiad_type_id = case trim(c.olympiad_type)
  when 'IMO' then 'imo'
  when 'NSO' then 'nso'
  when 'IEO' then 'ieo'
  when 'NCO' then 'nco'
  else null
end
where c.olympiad_type is not null;

update public.courses c
set
  min_class_id = sub.min_id,
  max_class_id = sub.max_id
from (
  select
    id,
    (select (min(x::int))::text from unnest(class_levels) as x) as min_id,
    (select (max(x::int))::text from unnest(class_levels) as x) as max_id
  from public.courses
  where class_levels is not null and cardinality(class_levels) > 0
) sub
where c.id = sub.id;

alter table public.courses drop column if exists olympiad_type;
alter table public.courses drop column if exists class_levels;
