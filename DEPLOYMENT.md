# Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Prerequisites
- MongoDB Atlas account (for production database)
- Vercel account

### Steps:

1. **Create MongoDB Atlas Database**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/coursemaster`)

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Deploy
   vercel
   ```

3. **Set Environment Variables in Vercel**
   - Go to your project settings in Vercel Dashboard
   - Add these environment variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_secure_jwt_secret_key
     JWT_EXPIRE=30d
     NODE_ENV=production
     ADMIN_EMAIL=admin@coursemaster.com
     ADMIN_PASSWORD=Admin@123456
     ```

4. **Configure Frontend Environment**
   - In Vercel, add for frontend:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
     ```

---

## 🌐 Deploy to Netlify

### Steps:

1. **Deploy via GitHub**
   - Go to [Netlify](https://www.netlify.com/)
   - Click "New site from Git"
   - Connect your GitHub repository: `TanzimHossainSafin/task_`
   - Configure build settings:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `frontend/.next`

2. **Set Environment Variables**
   - In Netlify Dashboard → Site Settings → Environment Variables
   - Add the same variables as above

3. **Deploy Backend Separately**
   - Backend needs to be deployed to a service like:
     - Railway.app
     - Render.com
     - Heroku
   - Update `NEXT_PUBLIC_API_URL` to point to your backend URL

---

## 🎯 Quick Deploy (Easiest Method)

### Using Vercel GitHub Integration:

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import from GitHub: `TanzimHossainSafin/task_`
4. Vercel will auto-detect Next.js
5. Add environment variables
6. Click "Deploy"

**Note:** You'll still need MongoDB Atlas for the database. The free tier is sufficient for testing.

---

## 📝 Post-Deployment

After deployment:
1. Run the seeder to populate database:
   ```bash
   # SSH into your deployment or use the platform's console
   cd backend
   npm run seed
   ```

2. Test the application with default credentials:
   - Admin: admin@coursemaster.com / Admin@123456
   - Student: student@test.com / Student@123

---

## 🔧 Troubleshooting

- **Database Connection Issues**: Whitelist all IPs (0.0.0.0/0) in MongoDB Atlas Network Access
- **API Not Working**: Check environment variables are set correctly
- **Build Failures**: Ensure Node.js version is 18 or higher
