# Edojo Learning — Student Profile Form

A fully self-contained web app. No Claude API credits needed. Students fill out the profile test → report is auto-generated → you view everything in the admin dashboard.

---

## How it works

1. Student visits your site → fills the 30-question form
2. On submit → responses are saved to Supabase (free database)
3. The report is generated instantly using pure JavaScript logic (no AI API)
4. You visit `/admin` → enter your password → see all submissions with full reports

---

## Setup — takes about 15 minutes

### Step 1: Create a Supabase account (free)

1. Go to https://supabase.com and sign up (free)
2. Create a new project — call it "edojo-form"
3. Once created, go to **SQL Editor** and run this:

```sql
create table submissions (
  id uuid default gen_random_uuid() primary key,
  student_name text not null,
  class text,
  school text,
  city text,
  answers jsonb,
  report jsonb,
  submitted_at timestamptz default now()
);

-- Allow anonymous inserts (for form submissions)
alter table submissions enable row level security;

create policy "allow_insert" on submissions
  for insert with check (true);

create policy "allow_service_read" on submissions
  for select using (true);
```

4. Go to **Settings → API** and copy:
   - Project URL (looks like: https://xxxxx.supabase.co)
   - `anon` public key
   - `service_role` secret key

### Step 2: Deploy to Vercel (free)

1. Push this folder to a GitHub repo
2. Go to https://vercel.com → New Project → import your repo
3. Add these Environment Variables in Vercel:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key |
| `SUPABASE_SERVICE_KEY` | your service role key |
| `ADMIN_PASSWORD` | any password you want (e.g. edojo2024) |

4. Click **Deploy** — done!

### Step 3: Share

- **Student form:** `https://your-site.vercel.app/`
- **Admin dashboard:** `https://your-site.vercel.app/admin`

---

## Local development

```bash
npm install
cp .env.local.example .env.local
# Fill in your actual Supabase keys in .env.local
npm run dev
```

Then open http://localhost:3000

---

## What you get

**Student form (`/`):**
- Beautiful multi-step quiz
- Progress bar as they answer
- Intro screen with profile collection
- Thank you screen after submission

**Admin dashboard (`/admin`):**
- Password protected
- See all submissions with date/time
- Stats: total, this week, avg habit score
- Search by name/school/city
- Click any student → full report modal with:
  - Learning Style + description
  - Habit Index score + bar
  - Subject confidence map (colour coded)
  - Critical flags (red/amber cards)
  - Summary paragraph
  - Recommendation section

---

## No ongoing costs

- Vercel free tier: 100GB bandwidth/month
- Supabase free tier: 500MB database, unlimited rows for this use case
- No Claude API — report logic is pure JavaScript
