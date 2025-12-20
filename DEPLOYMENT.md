# Deployment Guide for Finnish Learning App

## 🚀 Quick Deploy to Vercel

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**
   - Go to https://github.com/new
   - Repository name: `finnish-learning-app` (or your choice)
   - Make it **Public** or **Private**
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push to GitHub**
   ```bash
   git branch -M main
   git remote add origin https://github.com/farooqkadri/finnish-learning-app.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Sign Up" or "Log In"
   - Sign in with your GitHub account (recommended)

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Find your `finnish-learning-app` repository
   - Click "Import"

3. **Configure Project**

   **Project Settings:**
   - **Project Name**: finnish-learning-app (or your choice)
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `npx expo export -p web`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**

   In the "Environment Variables" section, add these one by one:

   **Firebase Variables:**
   *(Copy these values from your `.env` file)*
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY = your_firebase_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = your_firebase_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID = your_firebase_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = your_firebase_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID = your_firebase_app_id
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID = your_measurement_id
   ```

   **Groq API Key:**
   ```
   EXPO_PUBLIC_GROQ_API_KEY = your_groq_api_key_here
   ```

   *(Get your actual API key from your `.env` file)*

   For each variable:
   - Click "Add Another"
   - Enter the **Name** (e.g., `EXPO_PUBLIC_FIREBASE_API_KEY`)
   - Enter the **Value** (the actual credential)
   - Leave environment as "Production, Preview, and Development"
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - You'll get a URL like: `https://finnish-learning-app.vercel.app`

### Step 3: Update Firebase Settings

1. **Add Vercel Domain to Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Go to **Authentication** → **Settings** → **Authorized domains**
   - Click "Add domain"
   - Add your Vercel domain (e.g., `finnish-learning-app.vercel.app`)
   - Click "Add"

2. **Test Your Deployment**
   - Visit your Vercel URL
   - Try signing up/logging in
   - Test the AI chat
   - Verify all features work

## 🔄 Updating Your Deployment

After making changes to your code:

```bash
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically detect the push and redeploy your app!

## 🔧 Troubleshooting

### Build Fails

**Error: "Command failed: npx expo export -p web"**
- Check that all dependencies are in `package.json`
- Try running `npm install` locally first
- Check build logs in Vercel dashboard

**Error: "process.env.EXPO_PUBLIC_FIREBASE_API_KEY is undefined"**
- Make sure all environment variables are added in Vercel
- Check for typos in variable names
- Redeploy after adding variables

### Firebase Auth Not Working

**Error: "auth/unauthorized-domain"**
- Add your Vercel domain to Firebase Authorized domains
- Wait a few minutes for changes to propagate

### App Loads But Features Don't Work

**Check Browser Console:**
- Press F12 to open DevTools
- Look for errors in Console tab
- Common issues:
  - CORS errors → Check Firebase settings
  - API key errors → Verify environment variables

## 📱 Custom Domain (Optional)

1. **Buy a domain** (e.g., from Namecheap, GoDaddy)

2. **Add to Vercel:**
   - Go to your project in Vercel
   - Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

3. **Update Firebase:**
   - Add your custom domain to Firebase Authorized domains

## 🔒 Security Checklist

Before going live:

- [ ] All API keys are in environment variables
- [ ] `.env` file is in `.gitignore`
- [ ] Firebase security rules are applied
- [ ] Only your domain is authorized in Firebase
- [ ] No credentials are hardcoded in the code

## 📊 Monitoring

**Vercel Analytics:**
- Go to your project → Analytics
- View page views, visitors, and performance

**Firebase Console:**
- Monitor authentication
- Check Firestore usage
- View active users

## 💰 Cost Considerations

**Free Tier Limits:**

- **Vercel Free:**
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Serverless functions: 100 GB-hours

- **Firebase Spark (Free):**
  - 50K reads/day
  - 20K writes/day
  - 1 GB storage

- **Groq Free:**
  - Check their current limits at https://console.groq.com

**When to Upgrade:**
- If you exceed free tier limits
- Monitor usage in respective dashboards

## 🎉 You're Live!

Share your app:
- Tweet about it
- Post on LinkedIn
- Share with friends learning Finnish

Your app URL: `https://finnish-learning-app.vercel.app`

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
- Expo Docs: https://docs.expo.dev

---

Happy deploying! 🚀
