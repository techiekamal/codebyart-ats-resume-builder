# Deployment Guide

This guide covers deploying the CodeByArt ATS Resume Builder to popular hosting platforms.

## Platform Comparison

| Platform | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| **Vercel** | Zero-config, fastest builds, great DX | Limited free tier bandwidth | ⭐ **Best Choice** |
| **Netlify** | Easy setup, good free tier, form handling | Slightly slower builds | Great Alternative |

## Recommended: Vercel Deployment

Vercel is the recommended platform for this React + Vite application due to:
- Automatic framework detection
- Zero configuration needed
- Excellent performance with Edge Network
- Free SSL certificates
- Preview deployments for PRs

### Deploy to Vercel

#### Option 1: One-Click Deploy (Easiest)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click the button above
2. Import your GitHub repository
3. Vercel auto-detects Vite and configures everything
4. Click **Deploy**

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Deploy to production
vercel --prod
```

#### Option 3: GitHub Integration

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your repository
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**

### Vercel Configuration (Optional)

Create `vercel.json` in project root for custom settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## Alternative: Netlify Deployment

### Deploy to Netlify

#### Option 1: Netlify Drop (Quickest)

1. Run `npm run build` locally
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag and drop the `dist` folder
4. Done!

#### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the project
npm run build

# Deploy preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

#### Option 3: GitHub Integration

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**

### Netlify Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Environment Variables

Both platforms support environment variables through their dashboards.

### Setting Environment Variables

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add `GEMINI_API_KEY` (if using AI features)

**Netlify:**
1. Go to Site Settings → Environment Variables
2. Add `GEMINI_API_KEY` (if using AI features)

> **Note:** Current version uses mock data. Environment variables are optional.

---

## Post-Deployment Checklist

- [ ] Verify the site loads correctly
- [ ] Test resume editor functionality
- [ ] Test PDF export feature
- [ ] Check mobile responsiveness
- [ ] Verify ATS analysis displays
- [ ] Set up custom domain (optional)

---

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 on Page Refresh

Ensure you have the redirect/rewrite rules configured (see configuration sections above).

### Assets Not Loading

Check that `base` in `vite.config.ts` is set correctly:
- For root domain: `base: '/'`
- For subdirectory: `base: '/subdirectory/'`

---

## Performance Tips

1. **Enable Compression** - Both platforms auto-enable gzip/brotli
2. **Use Preview Deployments** - Test changes before production
3. **Monitor Analytics** - Both platforms offer free analytics

---

*Last updated: December 2024*
