# Supabase Setup Guide

Follow these steps to set up your backend for "Sandwip Blood Donor BD".

## 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and sign in.
2. Click "New Project".
3. Enter the project name: `Sandwip Blood Donor BD`.
4. Set a database password and choose a region close to your users (e.g., Singapore/Mumbai).
5. Click "Create new project".

## 2. Database Setup (SQL Editor)
Go to the **SQL Editor** in your Supabase dashboard and run the following SQL commands to create the tables.

```sql
-- Create Donors Table
create table public.donors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  blood_group text not null,
  phone text not null unique,
  area text not null,
  photo_url text,
  last_donation_date date,
  next_eligible_date date generated always as (last_donation_date + interval '90 days') stored,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Emergency Requests Table
create table public.emergency_requests (
  id uuid default gen_random_uuid() primary key,
  patient_name text not null,
  blood_group text not null,
  hospital text not null,
  contact_number text not null,
  required_date date not null,
  status text default 'pending' check (status in ('pending', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.donors enable row level security;
alter table public.emergency_requests enable row level security;

-- Create Policies (Allow public read, authenticated write/update)
-- Donors: Everyone can view, only authenticated users (admin) can delete/update, anyone can insert (registration)
create policy "Public can view donors" on public.donors for select using (true);
create policy "Anyone can register as donor" on public.donors for insert with check (true);
create policy "Admins can update donors" on public.donors for update using (auth.role() = 'authenticated');
create policy "Admins can delete donors" on public.donors for delete using (auth.role() = 'authenticated');

-- Emergency Requests: Everyone can view and insert, only admins can update status
create policy "Public can view requests" on public.emergency_requests for select using (true);
create policy "Anyone can create request" on public.emergency_requests for insert with check (true);
create policy "Admins can update requests" on public.emergency_requests for update using (auth.role() = 'authenticated');
```

## 3. Storage Setup (Fix for "row-level security policy" error)
Go to the **SQL Editor** and run these commands to set up the storage bucket and policies correctly.

```sql
-- 1. Create the storage bucket (if it doesn't exist)
insert into storage.buckets (id, name, public)
values ('donor-photos', 'donor-photos', true)
on conflict (id) do nothing;

-- 2. Allow ANYONE to upload photos (for registration)
create policy "Anyone can upload donor photos"
on storage.objects for insert
with check ( bucket_id = 'donor-photos' );

-- 3. Allow ANYONE to view photos
create policy "Anyone can view donor photos"
on storage.objects for select
using ( bucket_id = 'donor-photos' );
```

## 4. Environment Variables
1. Go to **Project Settings** -> **API**.
2. Copy the `Project URL` and `anon public` key.
3. Add them to your `.env` file (or Vercel environment variables).

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 5. Admin User
1. Go to **Authentication** -> **Users**.
2. Invite a user (your email) or create one manually. This user will be the admin.
