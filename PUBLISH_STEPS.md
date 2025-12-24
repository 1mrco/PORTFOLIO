# 🚀 Step-by-Step: Publish Your Portfolio

Follow these steps to publish your portfolio online!

## Step 1: Create GitHub Repository

1. **Go to GitHub.com** and sign in (or create an account)
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - **Repository name:** `portfolio` (or any name you like)
   - **Description:** "My portfolio website"
   - **Visibility:** Choose **Public** or **Private**
   - **DO NOT** check "Initialize with README" (we already have one)
4. Click **"Create repository"**

## Step 2: Connect and Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Replace YOUR_USERNAME with your GitHub username
# Replace REPO_NAME with your repository name

git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

**Or if you prefer SSH:**
```bash
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel (Free Hosting)

1. **Go to [vercel.com](https://vercel.com)**
2. Click **"Sign Up"** → Choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub
4. Click **"Add New Project"**
5. **Import your repository:**
   - Find your `portfolio` repository
   - Click **"Import"**
6. **Configure Project:**
   - **Framework Preset:** Leave as "Other" or "Node.js"
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build`
   - **Output Directory:** (leave empty)
   - **Install Command:** `npm install`
7. Click **"Deploy"**
8. **Wait 1-2 minutes** for deployment
9. **Your site is live!** 🎉

## Step 4: Set Up Environment Variables

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Environment Variables"**
3. Add these variables:

   **Name:** `EMAIL_USER`  
   **Value:** `talb.arkan2003@gmail.com`

   **Name:** `EMAIL_PASS`  
   **Value:** `your-gmail-app-password` (get from Gmail settings)

   **Name:** `PORT`  
   **Value:** `3000` (optional, Vercel sets this automatically)

4. Click **"Save"**
5. Go to **"Deployments"** tab
6. Click the **"..."** menu on the latest deployment
7. Click **"Redeploy"** to apply environment variables

## Step 5: Test Your Live Site

1. Visit your Vercel URL (e.g., `your-portfolio.vercel.app`)
2. Test:
   - ✅ All pages load
   - ✅ Contact form works
   - ✅ Games work
   - ✅ Projects display
   - ✅ Certificates display

## 🎯 Your Site is Now Live!

Your portfolio is now accessible at:
- **Vercel URL:** `your-portfolio.vercel.app`
- You can add a custom domain later if you want

## 📝 Future Updates

To update your site:

1. **Edit files locally** (e.g., `data/projects.json`)
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update projects"
   git push
   ```
3. **Vercel auto-deploys** your changes! (usually takes 1-2 minutes)

## 🔗 Quick Links

- **GitHub:** github.com/YOUR_USERNAME/portfolio
- **Vercel Dashboard:** vercel.com/dashboard
- **Live Site:** your-portfolio.vercel.app

## ❓ Need Help?

- Check Vercel deployment logs if something fails
- Verify environment variables are set correctly
- Make sure all files are committed and pushed to GitHub

