# Vercel Deployment Setup Guide

## Environment Variables Configuration

To deploy this application on Vercel, you need to configure the following environment variables:

### Required Environment Variables

1. **MONGODB_URI** (Required)
   - Your MongoDB connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority`
   - Example: `mongodb+srv://necks:fdLaWizvRAmTYvdG@cluster0.ebmc6q3.mongodb.net/rehabilitation-centre-tracking?retryWrites=true&w=majority&appName=Cluster0`

2. **SMTP_HOST** (Optional - for email functionality)
   - Your SMTP server hostname
   - Example: `smtp.gmail.com`

3. **SMTP_PORT** (Optional - for email functionality)
   - Your SMTP server port
   - Example: `587`

4. **SMTP_USER** (Optional - for email functionality)
   - Your SMTP username/email
   - Example: `your-email@gmail.com`

5. **SMTP_PASSWORD** (Optional - for email functionality)
   - Your SMTP password or app password
   - For Gmail, use an App Password

6. **NEXT_PUBLIC_APP_URL** (Optional - for email links)
   - Your deployed application URL
   - Example: `https://your-app.vercel.app`

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each environment variable:
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**
5. Repeat for all required variables

## Important Notes

- **MONGODB_URI is critical** - Without it, the app cannot connect to the database and login will fail
- After adding environment variables, you need to **redeploy** your application for changes to take effect
- Environment variables are case-sensitive
- Never commit `.env.local` files to Git - they should be in `.gitignore`

## Troubleshooting Login Issues

If you're unable to login after deployment:

1. **Check Environment Variables**:
   - Verify `MONGODB_URI` is set in Vercel
   - Ensure the connection string is correct
   - Check that the database name matches: `rehabilitation-centre-tracking`

2. **Check MongoDB Network Access**:
   - Go to MongoDB Atlas → Network Access
   - Ensure `0.0.0.0/0` is allowed (or add Vercel's IP ranges)
   - Or add specific Vercel IP addresses

3. **Check Database Connection**:
   - Verify the database is accessible
   - Check if the user exists in the database
   - Verify password is correctly hashed

4. **Check Vercel Logs**:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment
   - Check the "Functions" tab for error logs
   - Look for MongoDB connection errors

5. **Redeploy After Changes**:
   - After adding environment variables, trigger a new deployment
   - Or go to Deployments → Click "..." → Redeploy

## Testing the Connection

You can test if the database connection works by:

1. Checking the Vercel function logs
2. Using the test connection script locally with the same MONGODB_URI
3. Verifying the user exists in MongoDB Atlas dashboard

## Default Super Admin Account

If you need to create a super admin account, run:
```bash
npm run create-super-admin
```

Or use the script with your production MONGODB_URI:
```bash
MONGODB_URI=your-production-uri npm run create-super-admin
```

