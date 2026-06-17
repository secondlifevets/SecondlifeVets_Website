# Vets On Door

Pakistan's premium mobile veterinary service platform. This application allows pet owners to book home vet visits and provides a comprehensive admin dashboard for the veterinary team to manage appointments, clients, and scheduling.

## Features
- **Public Website**: Premium, mobile-optimised homepage, services, team info.
- **Booking Flow**: Multi-step booking process with real-time availability checking and automated WhatsApp routing.
- **Admin Dashboard**: Secure Supabase-authenticated dashboard.
- **Calendar & Scheduling**: View daily/monthly schedules and block out specific time slots (e.g., for holidays or breaks).
- **Client CRM**: Automatically grouped client database tracking total visits and patient histories.

## Tech Stack
- Next.js 14 (App Router)
- React & Tailwind CSS
- Supabase (PostgreSQL, Auth, SSR)
- Lucide React (Icons)
- Date-fns (Calendar logic)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Supabase Project URL and Anon Key.

3. **Supabase Database Setup**
   Go to your Supabase Project Dashboard -> SQL Editor -> New Query.
   Paste the contents of `supabase/schema.sql` and click **Run**. This will create all necessary tables, policies, and seed default services.

4. **Create Admin User**
   To log into the Admin panel:
   - Go to your Supabase Dashboard -> **Authentication** -> **Users**.
   - Click **Add user** -> **Create new user**.
   - Enter your email and a secure password.
   - You can now log into `/admin/login` using these credentials.

5. **Run Locally**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to view the public site, and `http://localhost:3000/admin` to view the admin panel.

## Operations Guide

### Blocking Time Slots
If you are taking a break or are on holiday, you can block time slots so clients cannot book them:
1. Go to **Admin Dashboard -> Calendar**.
2. Click **Block Time Slot** in the side panel.
3. Select the Date and Time you wish to block, and optionally provide a reason.
4. To unblock, go to **Admin Dashboard -> Settings** and remove the block from the "Blocked Time Slots" list.

## Deployment to Vercel

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. In the "Environment Variables" section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**.

### Pointing your Domain to Vercel
To use `vetsondoor.com`:
1. In your Vercel Project Dashboard, go to **Settings** -> **Domains**.
2. Add `vetsondoor.com` and `www.vetsondoor.com`.
3. Vercel will provide you with DNS records (typically an `A` record and a `CNAME` record).
4. Go to your domain registrar (e.g., GoDaddy, Namecheap) and add those exact DNS records to your domain's DNS settings.
5. Wait a few minutes (up to 24 hours) for the domain to verify and automatically issue an SSL certificate.
