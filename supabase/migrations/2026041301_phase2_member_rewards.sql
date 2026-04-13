-- Bedsecret Phase 2: member profile + referral + reward vouchers
-- Run this script in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.member_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  date_of_birth date,
  referral_code text not null unique,
  referred_by uuid references public.member_profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.member_profiles(id) on delete cascade,
  referred_member_id uuid not null unique references public.member_profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'purchased')),
  order_amount numeric(10,2),
  purchased_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reward_settings (
  id int primary key default 1,
  reward_per_successful_referral numeric(10,2) not null default 10,
  voucher_expiry_days int not null default 60,
  updated_at timestamptz not null default timezone('utc', now()),
  check (id = 1)
);

create table if not exists public.reward_vouchers (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.member_profiles(id) on delete cascade,
  code text not null unique,
  amount numeric(10,2) not null check (amount > 0),
  status text not null default 'issued' check (status in ('issued', 'redeemed', 'expired')),
  source text not null default 'referral',
  expires_at timestamptz not null,
  redeemed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.reward_settings (id, reward_per_successful_referral, voucher_expiry_days)
values (1, 10, 60)
on conflict (id) do nothing;

create index if not exists idx_member_profiles_referral_code
  on public.member_profiles (referral_code);

create index if not exists idx_referrals_referrer_status
  on public.referrals (referrer_id, status);

create index if not exists idx_reward_vouchers_member_created
  on public.reward_vouchers (member_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_member_profiles_updated_at on public.member_profiles;
create trigger trg_member_profiles_updated_at
before update on public.member_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_referrals_updated_at on public.referrals;
create trigger trg_referrals_updated_at
before update on public.referrals
for each row execute function public.set_updated_at();

drop trigger if exists trg_reward_settings_updated_at on public.reward_settings;
create trigger trg_reward_settings_updated_at
before update on public.reward_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_reward_vouchers_updated_at on public.reward_vouchers;
create trigger trg_reward_vouchers_updated_at
before update on public.reward_vouchers
for each row execute function public.set_updated_at();

create or replace function public.get_referrer_by_code(input_code text)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select id
  from public.member_profiles
  where referral_code = upper(trim(input_code))
  limit 1
$$;

grant execute on function public.get_referrer_by_code(text) to authenticated, anon;

alter table public.member_profiles enable row level security;
alter table public.referrals enable row level security;
alter table public.reward_settings enable row level security;
alter table public.reward_vouchers enable row level security;

drop policy if exists "member_profiles_select_own" on public.member_profiles;
create policy "member_profiles_select_own"
  on public.member_profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "member_profiles_insert_own" on public.member_profiles;
create policy "member_profiles_insert_own"
  on public.member_profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "member_profiles_update_own" on public.member_profiles;
create policy "member_profiles_update_own"
  on public.member_profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "referrals_select_for_owner" on public.referrals;
create policy "referrals_select_for_owner"
  on public.referrals
  for select
  to authenticated
  using (auth.uid() = referrer_id or auth.uid() = referred_member_id);

drop policy if exists "referrals_insert_for_referred_member" on public.referrals;
create policy "referrals_insert_for_referred_member"
  on public.referrals
  for insert
  to authenticated
  with check (auth.uid() = referred_member_id);

drop policy if exists "reward_settings_select_authenticated" on public.reward_settings;
create policy "reward_settings_select_authenticated"
  on public.reward_settings
  for select
  to authenticated
  using (true);

drop policy if exists "reward_vouchers_select_own" on public.reward_vouchers;
create policy "reward_vouchers_select_own"
  on public.reward_vouchers
  for select
  to authenticated
  using (auth.uid() = member_id);

drop policy if exists "reward_vouchers_insert_own" on public.reward_vouchers;
create policy "reward_vouchers_insert_own"
  on public.reward_vouchers
  for insert
  to authenticated
  with check (auth.uid() = member_id);
