# 🚀 Deployment Guide — Silicon Nexus Portfolio

Follow these steps to deploy your portfolio with **GitHub**, **Vercel**, and **Supabase**.

## 1. GitHub (Version Control)
1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on [GitHub](https://github.com/new).
3. Connect and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git branch -M main
   git push -u origin main
   ```

## 2. Supabase (Database)
1. Create a new project at [Supabase](https://supabase.com).
2. Go to **SQL Editor** -> **New Query**.
3. Copy-paste the content of `db/schema.sql` and run it. this creates the tables and security policies.
4. Go to **Project Settings** -> **API**.
5. Copy the **Project URL** and **service_role key** (KEEP SECRET!).

## 3. Vercel (Hosting & Serverless)
1. Go to [Vercel](https://vercel.com) -> **Add New** -> **Project**.
2. Import your GitHub repository.
3. In **Environment Variables**, add:
   - `SUPABASE_URL`: (from step 2.5)
   - `SUPABASE_SERVICE_KEY`: (from step 2.5)
   - `EMAIL_USER`: `karthickeaswar43815@gmail.com`
   - `EMAIL_PASS`: (your Gmail App Password)
   - `ADMIN_SECRET`: (a strong random password you create)
4. Click **Deploy**.

## 4. Final Check
- Visit your Vercel URL.
- Test the contact form.
- Check Supabase `contacts` table to see the data!
