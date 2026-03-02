# Sandwip Blood Donor BD

A modern blood donor mobile app for connecting donors with patients in Sandwip.

## Features
- **Donor Registration:** Easy sign-up with photo upload.
- **Donor Search:** Filter by blood group and area.
- **Emergency Requests:** Post and view urgent blood needs.
- **Admin Panel:** Manage donors and requests.
- **Responsive Design:** Works perfectly on mobile and desktop.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Supabase (Database, Auth, Storage)
- **Icons:** Lucide React
- **Animations:** Framer Motion

## Setup Instructions

### 1. Supabase Setup
Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to create your database tables and storage bucket.

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Locally
```bash
npm run dev
```

## Deployment on Vercel

1. Push this code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and import the project.
3. In the "Environment Variables" section, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**.

## Connecting a Domain
1. In Vercel, go to **Settings** -> **Domains**.
2. Enter your domain (e.g., `sandwipblooddonor.com`).
3. Follow the DNS configuration instructions provided by Vercel.
