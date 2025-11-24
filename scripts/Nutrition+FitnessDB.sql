-- Enable extensions
create extension if not exists pgcrypto;

-- ENUMS
do $$ begin
  create type recommendation_scope as enum ('training','nutrition');
exception when duplicate_object then null; end $$;

-- CORE ENTITIES
-- User profile (one row per auth user)
create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  locale text default 'en-US',
  tz text default 'America/New_York',
  height_cm numeric(5,2),
  sex text check (sex in ('male','female','other')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Exercise catalog (shared)
create table if not exists public.exercise_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  muscle_group text,
  equipment text,
  is_active boolean not null default true,

  unique (name),
  created_at timestamptz not null default now()
);

-- Food catalog (shared minimal)
create table if not exists public.food_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  kcals_per_100g numeric(8,2) not null,
  protein_per_100g numeric(8,2) not null,
  carbs_per_100g numeric(8,2) not null,
  fat_per_100g numeric(8,2) not null,
  cost_per_100g numeric(8,4),      -- optional budgeting
  prep_minutes int,                 -- optional convenience
  is_active boolean not null default true,

  created_at timestamptz not null default now()
);

-- Recipes (shared; ingredients reference food_catalog)
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null, -- allow shared/community + private
  name text not null,
  instructions text,
  is_public boolean not null default false,

  created_at timestamptz not null default now()
);

create table if not exists public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  food_id uuid not null references public.food_catalog(id),
  grams numeric(10,2) not null check (grams > 0)
);

-- USER TIME SERIES
-- Body metrics (weight trend etc.)
create table if not exists public.body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  weight_kg numeric(6,2),
  body_fat_pct numeric(5,2),
  steps int,

  created_at timestamptz not null default now(),
  unique (user_id, date)
);
create index on public.body_metrics (user_id, date);

-- Weekly targets (calories/macros/volume/budget + explanation)
create table if not exists public.weekly_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,              -- Monday (or chosen convention)
  target_kcal int,
  target_protein_g int,
  target_carbs_g int,
  target_fat_g int,
  target_sets int,
  budget_usd numeric(10,2),
  explain jsonb default '[]'::jsonb,     -- list of friendly notes

  created_at timestamptz not null default now(),
  unique (user_id, week_start)
);
create index on public.weekly_targets (user_id, week_start);

-- Workouts (session header + per set detail)
create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_date date not null,
  notes text,

  created_at timestamptz not null default now()
);
create index on public.workout_sessions (user_id, session_date);

create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_id uuid not null references public.exercise_catalog(id),
  set_number int not null check (set_number > 0),
  reps int check (reps >= 0),
  load_kg numeric(7,2) check (load_kg >= 0),
  rpe numeric(3,1) check (rpe between 1 and 10)
);
create index on public.workout_sets (session_id);

-- Daily nutrition (day header + items)
create table if not exists public.nutrition_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,

  created_at timestamptz not null default now(),
  unique (user_id, date)
);
create index on public.nutrition_days (user_id, date);

create table if not exists public.nutrition_items (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references public.nutrition_days(id) on delete cascade,
  food_id uuid references public.food_catalog(id),
  recipe_id uuid references public.recipes(id),
  grams numeric(10,2) not null check (grams > 0),
  -- One of food_id or recipe_id should be present
  check ((food_id is not null) or (recipe_id is not null))
);
create index on public.nutrition_items (day_id);

-- OPTIMIZER OUTPUTS
-- Recommendations (training/nutrition) with explanation
create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scope recommendation_scope not null,
  input_snapshot jsonb not null,     -- what the optimizer saw
  plan jsonb not null,               -- chosen plan (next week targets or meal plan)
  alternatives jsonb default '[]'::jsonb,
  explanations jsonb default '[]'::jsonb,

  created_at timestamptz not null default now()
);
create index on public.recommendations (user_id, scope, created_at desc);

-- Grocery lists (weekly roll up)
create table if not exists public.grocery_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  store_hint text,
  created_at timestamptz not null default now(),

  unique (user_id, week_start)
);

create table if not exists public.grocery_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.grocery_lists(id) on delete cascade,
  food_id uuid not null references public.food_catalog(id),
  grams numeric(10,2) not null check (grams > 0)
);
create index on public.grocery_items (list_id);

-- LIGHTWEIGHT SYSTEM
-- Notifications (per user)
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  payload jsonb default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index on public.notifications (user_id, created_at desc);

-- Audit events (simple explainability trail)
create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  entity text not null,      -- 'weekly_targets','workout_sessions'
  entity_id uuid not null,
  action text not null,      -- 'create','update','delete','auto_adjust'
  details jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index on public.audit_events (user_id, created_at desc);

-- RLS (Row-Level Security)
alter table public.user_profiles    enable row level security;
alter table public.body_metrics     enable row level security;
alter table public.weekly_targets   enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.workout_sets     enable row level security;
alter table public.nutrition_days   enable row level security;
alter table public.nutrition_items  enable row level security;
alter table public.recommendations  enable row level security;
alter table public.grocery_lists    enable row level security;
alter table public.grocery_items    enable row level security;
alter table public.notifications    enable row level security;
alter table public.audit_events     enable row level security;
-- Shared catalogs readable by all, writable by admins; keep simple:
alter table public.exercise_catalog  enable row level security;
alter table public.food_catalog      enable row level security;
alter table public.recipes           enable row level security;
alter table public.recipe_ingredients enable row level security;

-- Owner only policies (per user)
create policy "own_rows_select" on public.user_profiles
  for select using (auth.uid() = user_id);
create policy "own_rows_modify" on public.user_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_rows_select" on public.body_metrics
  for select using (auth.uid() = user_id);
create policy "own_rows_modify" on public.body_metrics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_rows_select" on public.weekly_targets
  for select using (auth.uid() = user_id);
create policy "own_rows_modify" on public.weekly_targets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_rows_select" on public.workout_sessions
  for select using (auth.uid() = user_id);
create policy "own_rows_modify" on public.workout_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "via_session_select" on public.workout_sets
  for select using (exists (select 1 from public.workout_sessions s
                            where s.id = session_id and s.user_id = auth.uid()));
create policy "via_session_modify" on public.workout_sets
  for all using (exists (select 1 from public.workout_sessions s
                         where s.id = session_id and s.user_id = auth.uid()))
  with check (exists (select 1 from public.workout_sessions s
                      where s.id = session_id and s.user_id = auth.uid()));

create policy "own_rows_select" on public.nutrition_days
  for select using (auth.uid() = user_id);
create policy "own_rows_modify" on public.nutrition_days
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "via_day_select" on public.nutrition_items
  for select using (exists (select 1 from public.nutrition_days d
                            where d.id = day_id and d.user_id = auth.uid()));
create policy "via_day_modify" on public.nutrition_items
  for all using (exists (select 1 from public.nutrition_days d
                         where d.id = day_id and d.user_id = auth.uid()))
  with check (exists (select 1 from public.nutrition_days d
                      where d.id = day_id and d.user_id = auth.uid()));

create policy "own_rows_select" on public.recommendations
  for select using (auth.uid() = user_id);
create policy "own_rows_modify" on public.recommendations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_rows_select" on public.grocery_lists
  for select using (auth.uid() = user_id);
create policy "own_rows_modify" on public.grocery_lists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "via_list_select" on public.grocery_items
  for select using (exists (select 1 from public.grocery_lists g
                            where g.id = list_id and g.user_id = auth.uid()));
create policy "via_list_modify" on public.grocery_items
  for all using (exists (select 1 from public.grocery_lists g
                         where g.id = list_id and g.user_id = auth.uid()))
  with check (exists (select 1 from public.grocery_lists g
                      where g.id = list_id and g.user_id = auth.uid()));

create policy "own_rows_select" on public.notifications
  for select using (auth.uid() = user_id);
create policy "own_rows_modify" on public.notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_rows_select" on public.audit_events
  for select using (auth.uid() = user_id);
-- writes typically from server: replace with service role only if you want

-- Catalog policies (read for all authenticated; writes later via admin/service)
create policy "catalog_read" on public.exercise_catalog for select using (true);
create policy "catalog_read" on public.food_catalog     for select using (true);
create policy "recipes_read_public_or_owner" on public.recipes
  for select using (is_public or owner_user_id = auth.uid());
create policy "recipes_owner_modify" on public.recipes
  for all using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());
create policy "recipe_ingredients_read_guard" on public.recipe_ingredients
  for select using (exists (select 1 from public.recipes r
                            where r.id = recipe_id and (r.is_public or r.owner_user_id = auth.uid())));
create policy "recipe_ingredients_modify_guard" on public.recipe_ingredients
  for all using (exists (select 1 from public.recipes r
                         where r.id = recipe_id and r.owner_user_id = auth.uid()))
  with check (exists (select 1 from public.recipes r
                      where r.id = recipe_id and r.owner_user_id = auth.uid()));
