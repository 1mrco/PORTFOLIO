# GitHub Deployment & Update Guide

## 📤 How to Upload to GitHub

### Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Name it (e.g., `portfolio` or `my-portfolio`)
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 2: Connect Your Local Repository to GitHub

```bash
# Add GitHub as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Push Your Saved Version

```bash
# Push all commits and tags
git push -u origin main
git push origin v1.0-current
```

## ⚠️ Important: This is a Node.js App

**GitHub Pages won't work** because this is a **Node.js/Express server**, not a static website.

### Hosting Options:

1. **Vercel** (Recommended - Free & Easy)
   - Connect your GitHub repo
   - Auto-deploys on every push
   - Free for personal projects

2. **Render** (Free tier available)
   - Connect GitHub repo
   - Auto-deploys
   - Free tier with limitations

3. **Heroku** (Paid now, but reliable)
   - More complex setup
   - Requires credit card for free tier

4. **Railway** (Free tier available)
   - Easy deployment
   - Connect GitHub repo

## 📝 How to Add/Update Projects & Certificates

### Method 1: Edit JSON Files Locally (Recommended)

1. **Edit the JSON files:**
   - `data/projects.json` - Add/edit projects
   - `data/certificates.json` - Add/edit certificates

2. **Commit and push:**
   ```bash
   git add data/projects.json data/certificates.json
   git commit -m "Update projects and certificates"
   git push origin main
   ```

3. **Your hosting service will auto-deploy** (if using Vercel/Render)

### Method 2: Edit Directly on GitHub

1. Go to your GitHub repository
2. Navigate to `data/projects.json` or `data/certificates.json`
3. Click the pencil icon (✏️) to edit
4. Make your changes
5. Click "Commit changes"
6. Your hosting service will auto-deploy

### Method 3: Use GitHub Desktop (Easier for non-technical users)

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Clone your repository
3. Edit JSON files
4. Commit and push through the GUI

## 📋 Project Format

Edit `data/projects.json`:

```json
{
  "projects": [
    {
      "id": 1,
      "title": "My Project Name",
      "description": "Description of the project",
      "image": "/images/project.jpg",  // optional
      "link": "https://github.com/...",  // optional
      "technologies": ["JavaScript", "Node.js"]  // optional
    }
  ]
}
```

## 🏆 Certificate Format

Edit `data/certificates.json`:

```json
{
  "certificates": [
    {
      "id": 1,
      "title": "Certificate Name",
      "description": "Description",
      "issuer": "Issuing Organization",  // optional
      "date": "January 2024",  // optional
      "link": "https://credly.com/..."  // optional
    }
  ]
}
```

## 🔄 Update Process Summary

1. **Edit JSON files** (locally or on GitHub)
2. **Commit changes** (git commit)
3. **Push to GitHub** (git push)
4. **Auto-deploy** (hosting service updates your site)

## 🚀 Quick Deploy to Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Node.js
6. Click "Deploy"
7. **Done!** Your site is live

### Vercel Settings:
- **Framework Preset:** Other
- **Build Command:** `npm run build`
- **Output Directory:** (leave empty)
- **Install Command:** `npm install`

## 📁 What Gets Uploaded to GitHub

✅ **Uploaded:**
- All source code
- Configuration files
- Documentation

❌ **NOT Uploaded** (in .gitignore):
- `node_modules/` - Dependencies
- `.env` - Environment variables (email passwords)
- `data/` - Player scores and messages (sensitive data)

## 🔐 Important: Environment Variables

**Before deploying, set up environment variables on your hosting service:**

1. Go to your hosting dashboard (Vercel/Render/etc.)
2. Find "Environment Variables" or "Settings"
3. Add:
   - `EMAIL_USER=talb.arkan2003@gmail.com`
   - `EMAIL_PASS=your-app-password` (Gmail App Password)
   - `PORT=3000` (usually auto-set)

## 📝 After Deployment Checklist

- [ ] Set environment variables on hosting service
- [ ] Test contact form (email sending)
- [ ] Verify projects display correctly
- [ ] Verify certificates display correctly
- [ ] Test games page
- [ ] Check mobile responsiveness

## 🔗 Your Live Site

After deployment, you'll get a URL like:
- Vercel: `your-portfolio.vercel.app`
- Render: `your-portfolio.onrender.com`

You can also add a custom domain!

## 💡 Tips

1. **Always test locally first:** `npm run dev`
2. **Keep JSON files valid:** Use a JSON validator
3. **Backup before major changes:** Use git tags
4. **Update regularly:** Keep projects and certificates current

## 🆘 Need Help?

- Check hosting service documentation
- Verify environment variables are set
- Check server logs for errors
- Ensure JSON files are valid format

