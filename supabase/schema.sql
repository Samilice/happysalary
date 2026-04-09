-- HappySalary Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'client' check (role in ('client', 'admin')),
  onboarding_completed boolean not null default false,
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- EMPLOYERS (client company/personal details)
-- ============================================
create table public.employers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  company_name text,
  first_name text not null,
  last_name text not null,
  address_street text not null,
  address_city text not null,
  address_postal_code text not null,
  address_canton text not null,
  phone text,
  avs_number text,
  date_of_birth date,
  nationality text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.employers enable row level security;

create policy "Users can manage own employer record"
  on public.employers for all
  using (user_id = auth.uid());

create policy "Admins can view all employers"
  on public.employers for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all employers"
  on public.employers for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- EMPLOYEES (household staff)
-- ============================================
create table public.employees (
  id uuid default uuid_generate_v4() primary key,
  employer_id uuid references public.employers(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  address_street text not null,
  address_city text not null,
  address_postal_code text not null,
  date_of_birth date not null,
  nationality text not null,
  avs_number text not null,
  permit_type text,
  job_title text not null,
  employment_type text not null check (employment_type in (
    'cleaning', 'nanny', 'au_pair', 'elderly_care', 'gardener', 'other'
  )),
  start_date date not null,
  end_date date,
  monthly_hours numeric(6,2) not null,
  hourly_rate numeric(8,2) not null,
  monthly_salary numeric(10,2) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.employees enable row level security;

create policy "Users can manage own employees"
  on public.employees for all
  using (
    employer_id in (
      select id from public.employers where user_id = auth.uid()
    )
  );

create policy "Admins can view all employees"
  on public.employees for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all employees"
  on public.employees for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- DOCUMENTS (salary sheets, contracts, etc.)
-- ============================================
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  employee_id uuid references public.employees(id) on delete cascade not null,
  type text not null check (type in ('salary_sheet', 'employment_contract', 'annual_statement', 'other')),
  title text not null,
  period_month integer,
  period_year integer,
  status text not null default 'pending' check (status in ('pending', 'generating', 'ready', 'sent')),
  file_url text,
  generated_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "Users can view own documents"
  on public.documents for select
  using (
    employee_id in (
      select e.id from public.employees e
      join public.employers emp on e.employer_id = emp.id
      where emp.user_id = auth.uid()
    )
  );

create policy "Admins can manage all documents"
  on public.documents for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- SUBSCRIPTIONS (Stripe tracking)
-- ============================================
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  plan text not null check (plan in ('basic', 'comfort', 'premium')),
  status text not null default 'active' check (status in ('active', 'past_due', 'canceled', 'trialing')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (user_id = auth.uid());

create policy "Admins can manage all subscriptions"
  on public.subscriptions for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.employers
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.employees
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.subscriptions
  for each row execute function public.update_updated_at();

-- ============================================
-- CHECKLIST PROGRESS (tracks which steps user completed)
-- ============================================
create table public.checklist_progress (
  id uuid default uuid_generate_v4() primary key,
  employee_id uuid references public.employees(id) on delete cascade not null,
  step_key text not null,
  completed boolean not null default false,
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(employee_id, step_key)
);

alter table public.checklist_progress enable row level security;

create policy "Users can manage own checklist"
  on public.checklist_progress for all
  using (
    employee_id in (
      select e.id from public.employees e
      join public.employers emp on e.employer_id = emp.id
      where emp.user_id = auth.uid()
    )
  );

create policy "Admins can view all checklists"
  on public.checklist_progress for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create trigger set_updated_at before update on public.checklist_progress
  for each row execute function public.update_updated_at();

-- ============================================
-- VIEWS FOR ADMIN
-- ============================================
create or replace view public.admin_client_overview as
select
  p.id as user_id,
  p.email,
  p.full_name,
  p.onboarding_completed,
  p.created_at as registered_at,
  emp.first_name as employer_first_name,
  emp.last_name as employer_last_name,
  emp.address_canton,
  emp.phone,
  (select count(*) from public.employees e where e.employer_id = emp.id) as employee_count,
  (select count(*) from public.employees e where e.employer_id = emp.id and e.is_active) as active_employee_count,
  s.plan as subscription_plan,
  s.status as subscription_status
from public.profiles p
left join public.employers emp on emp.user_id = p.id
left join public.subscriptions s on s.user_id = p.id
where p.role = 'client';
