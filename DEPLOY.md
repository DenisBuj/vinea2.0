# Deploy Vinea 2.0 to Vercel

Three steps. Five minutes total.

## 1. Push to GitHub

Open Terminal on your Mac and paste this block:

```bash
cd ~/Documents/GitHub/vinea2.0

# Clean any leftover state (safe — these are gitignored / regenerable)
rm -rf .git node_modules .next .vercel

# Init repo + first commit
git init -b main
git config user.email "denbuj04@gmail.com"
git config user.name "Denis Bujorean"
git add .
git commit -m "Vinea 2.0 — initial commit"
```

Then create a new GitHub repo (private is fine):

**Option A — using GitHub CLI (easiest if you have `gh`):**
```bash
gh repo create vinea2.0 --private --source=. --remote=origin --push
```

**Option B — manual:**
1. Go to https://github.com/new
2. Name it `vinea2.0`, leave everything else default, hit **Create**
3. Copy the commands GitHub shows under "push an existing repository" — they'll look like:
```bash
git remote add origin https://github.com/<your-user>/vinea2.0.git
git push -u origin main
```

## 2. Import to Vercel

1. Go to https://vercel.com/new
2. Click **Import** next to your `vinea2.0` repo (you may need to grant Vercel access first)
3. On the configuration screen, expand **Environment Variables** and add these three:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bbelawsdhsjdayqsagih.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_iSlUg8d6T0v4CMfGu_if8g_0HFJM4Fr` |
| `ADMIN_PASSWORD` | `vinea-admin-2026` |

4. Hit **Deploy**. Vercel will build (~90 seconds) and give you a URL like `vinea2-xyz.vercel.app`.

## 3. Test the live site

- Storefront: visit the Vercel URL
- Admin: append `/admin` to the URL, password is `vinea-admin-2026`
- Place a test order on the storefront, refresh `/admin/orders` to see it land

## Optional: local preview before pushing

```bash
cd ~/Documents/GitHub/vinea2.0
npm install
npm run dev
# open http://localhost:3000
```

`.env.local` is already populated for local dev, so it just works.
