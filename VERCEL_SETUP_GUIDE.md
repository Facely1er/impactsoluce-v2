# 🚀 Vercel Setup Guide for ImpactSoluce

Complete step-by-step guide to deploy ImpactSoluce to Vercel.

## Prerequisites

- Node.js 18+ installed
- npm or pnpm installed
- Vercel account ([sign up](https://vercel.com/signup))
- Git repository (optional, but recommended)

## Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

Verify installation:
```powershell
vercel --version
```

## Step 2: Login to Vercel

```powershell
vercel login
```

This will open your browser to authenticate. Follow the prompts.

## Step 3: Initialize Vercel Project

Run the setup script:
```powershell
.\setup-vercel-project.ps1
```

Or manually:
```powershell
vercel link
```

**When prompted:**
- **Link to existing project?** → Choose "Create new project" (or link if you already have one)
- **Project name:** `impact-soluce-platform` (or your choice)
- **Directory:** `.` (current directory)
- **Override settings?** → No (we'll use vercel.json)

## Step 4: Configure Environment Variables

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `impact-soluce-platform` project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
| `VITE_APP_NAME` | `ImpactSoluce™ by ERMITS` (optional) | Production, Preview, Development |
| `VITE_APP_URL` | Your production URL (optional) | Production |
| `VITE_ENABLE_DEMO_MODE` | `true` or `false` (optional) | Production, Preview, Development |
| `VITE_ENABLE_ANALYTICS` | `true` or `false` (optional) | Production, Preview, Development |

### Option B: Via Vercel CLI

```powershell
# Set environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# For preview and development environments too
vercel env add VITE_SUPABASE_URL preview
vercel env add VITE_SUPABASE_ANON_KEY preview

vercel env add VITE_SUPABASE_URL development
vercel env add VITE_SUPABASE_ANON_KEY development
```

When prompted, enter your actual Supabase credentials.

## Step 5: Deploy to Vercel

### First Deployment

```powershell
.\deploy-vercel.ps1
```

Or manually:
```powershell
vercel --prod
```

Or using npm script:
```powershell
npm run deploy
```

### Future Deployments

After the first deployment, you can:
- Push to your Git repository (if connected) for automatic deployments
- Run `vercel --prod` manually
- Use the Vercel dashboard to trigger deployments
- Run `npm run deploy`

## Step 6: Configure Custom Domain

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `impact-soluce-platform` project
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter your domain (e.g., `www.impactsoluce.com`)
6. Follow DNS configuration instructions:

### DNS Configuration

Add the following DNS records to your domain provider:

**Option 1: CNAME (Recommended)**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Option 2: A Record**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Also add for root domain:**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

7. Wait for DNS propagation (can take up to 48 hours, usually much faster)
8. Vercel will automatically provision SSL certificates

## Step 7: Verify Deployment

1. Check deployment status in Vercel dashboard
2. Visit your deployment URL (e.g., `impact-soluce-platform.vercel.app`)
3. Test the application:
   - Homepage loads correctly
   - Assessment workflow functions
   - Reports generation works
   - Supabase integration (if configured)

## Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Ensure all environment variables are set in Vercel dashboard
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

**Error: Build command fails**
- Verify `package.json` has correct build script
- Check Node.js version (should be 18+)
- Ensure TypeScript compilation passes: `npm run type-check`

### Deployment Issues

**Error: Project not found**
- Run `vercel link` again to link the project
- Check you're in the correct directory

**Error: Domain not resolving**
- Wait for DNS propagation (up to 48 hours)
- Verify DNS records are correct
- Check domain status in Vercel dashboard

### Environment Variables Not Working

- Ensure variables are prefixed with `VITE_` for Vite projects
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

## Next Steps After Deployment

1. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor build times
   - Review error logs

2. **Set Up CI/CD**
   - Connect Git repository for automatic deployments
   - Configure branch deployments
   - Set up preview deployments for PRs

3. **Optimize**
   - Enable Vercel Edge Functions if needed
   - Configure caching strategies
   - Optimize images and assets

4. **Supabase Integration**
   - Ensure database migrations are applied
   - Verify RLS policies are configured
   - Test authentication flows

## Quick Reference

```powershell
# Login
vercel login

# Link project
vercel link

# Deploy
vercel --prod
# or
npm run deploy

# View deployments
vercel ls

# View logs
vercel logs

# Remove project
vercel remove
```

## Security Features

The `vercel.json` configuration includes:
- ✅ Security headers (X-Frame-Options, CSP, HSTS, etc.)
- ✅ Content Security Policy with Supabase domains
- ✅ Cache control for optimal performance
- ✅ SPA routing support

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Discord](https://vercel.com/discord)
- [Vercel Support](https://vercel.com/support)

---

**Status:** Ready for deployment ✅

