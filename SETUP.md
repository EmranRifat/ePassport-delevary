# 🚀 Complete Setup & Installation Guide

## Bangladesh Post Office - ePassport Web Portal

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Methods](#installation-methods)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)
7. [Deployment](#deployment)

---

## Prerequisites

### Required Software

| Software | Minimum Version | Download Link        |
| -------- | --------------- | -------------------- |
| Node.js  | 18.0.0          | https://nodejs.org/  |
| Yarn     | 1.22.0          | https://yarnpkg.com/ |
| Git      | 2.0.0           | https://git-scm.com/ |

### Check Your Installation

```bash
# Check Node.js version
node --version
# Should output: v18.x.x or higher

# Check Yarn version
yarn --version
# Should output: 1.22.x or higher

# Check Git version
git --version
# Should output: git version 2.x.x or higher
```

---

## Installation Methods

### Method 1: Automated Installation (Recommended)

#### Windows

```bash
# Run the installation script
install.bat
```

#### Linux/Mac

```bash
# Make the script executable
chmod +x install.sh

# Run the installation script
./install.sh
```

### Method 2: Manual Installation

#### Step 1: Navigate to Project Directory

```bash
cd nextjs-web
```

#### Step 2: Install Yarn (if not installed)

```bash
npm install -g yarn
```

#### Step 3: Install Dependencies

```bash
yarn install
```

#### Step 4: Setup Environment File

```bash
# Copy the example environment file
cp .env.example .env.local

# Or on Windows
copy .env.example .env.local
```

#### Step 5: Verify Installation

```bash
yarn type-check
```

---

## Configuration

### Environment Variables

Edit `nextjs-web/.env.local`:

```env
# Main API Base URL
NEXT_PUBLIC_API_BASE_URL=https://brta2.bpodms.gov.bd

# DMS API Base URL
NEXT_PUBLIC_DMS_API_BASE_URL=https://bpodms.ekdak.com
```

### API Endpoints Configuration

The following endpoints are configured in `src/utils/constants.ts`:

- **Login:** `/app/v1/login/`
- **DMS Login:** `/app_dommail_internal_api/public/ws/login`
- **Booking:** `/app_dommail_internal_api/public/ws/bookingreq`
- **License Data:** `/brta/api/bpo/license-delivery-info`

You can modify these in the constants file if needed.

### Tailwind CSS Theme

Customize colors in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#673AB7',  // Change this to your brand color
        // ... other shades
      },
    },
  },
}
```

---

## Running the Application

### Development Mode

```bash
cd nextjs-web
yarn dev
```

The application will be available at: **http://localhost:3000**

**Features in Development Mode:**

- ✅ Hot reload
- ✅ Detailed error messages
- ✅ Source maps
- ✅ Request/response logging

### Production Build

```bash
# Build the application
yarn build

# Start the production server
yarn start
```

### Using Different Port

```bash
# Run on port 3001
yarn dev -p 3001

# Or set in package.json
"scripts": {
  "dev": "next dev -p 3001"
}
```

---

## Testing

### Type Checking

```bash
cd nextjs-web
yarn type-check
```

### Linting

```bash
cd nextjs-web
yarn lint
```

### Manual Testing Checklist

#### 1. Authentication

- [ ] Navigate to http://localhost:3000
- [ ] Should redirect to /login
- [ ] Enter credentials and login
- [ ] Should redirect to /dashboard
- [ ] Check if token is stored in cookies
- [ ] Refresh page - should stay logged in
- [ ] Click logout - should redirect to /login

#### 2. Dashboard

- [ ] Verify statistics cards display
- [ ] Check quick action buttons work
- [ ] Verify user information displays correctly
- [ ] Test responsive design (resize browser)

#### 3. Booking Management

- [ ] Click "New Booking" button
- [ ] Enter tracking number
- [ ] Verify branch code and RMS code are pre-filled
- [ ] Submit form
- [ ] Check success/error message
- [ ] Verify form clears on success

#### 4. Delivery Management

- [ ] Navigate to Delivery page
- [ ] Test search by license number
- [ ] Test search by NID
- [ ] Test search by mobile number
- [ ] Verify results display correctly
- [ ] Test responsive layout

#### 5. Passport Status

- [ ] Navigate to Passport page
- [ ] Enter passport number
- [ ] Search for passport
- [ ] Verify details display
- [ ] Test error handling for invalid numbers

---

## Troubleshooting

### Common Issues

#### Issue 1: Port 3000 Already in Use

**Solution:**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Or use a different port
yarn dev -p 3001
```

#### Issue 2: Module Not Found Errors

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm yarn.lock
yarn install

# Windows
rmdir /s /q node_modules
del yarn.lock
yarn install
```

#### Issue 3: TypeScript Errors

**Solution:**

```bash
# Check for type errors
yarn type-check

# Clear Next.js cache
rm -rf .next
yarn dev
```

#### Issue 4: API Connection Issues

**Solution:**

1. Check `.env.local` file exists
2. Verify API URLs are correct
3. Check CORS settings on backend
4. Verify network connectivity
5. Check browser console for errors

#### Issue 5: Build Errors

**Solution:**

```bash
# Clear all caches
rm -rf .next
rm -rf node_modules
yarn install
yarn build
```

### Getting Help

1. **Check Documentation:**

   - README.md - Full documentation
   - QUICKSTART.md - Quick start guide
   - MIGRATION.md - Migration details
   - STRUCTURE.md - Project structure

2. **Check Logs:**

   - Browser console (F12)
   - Terminal output
   - Next.js error overlay

3. **Verify Setup:**
   ```bash
   node --version  # Check Node version
   yarn --version  # Check Yarn version
   yarn type-check # Check TypeScript
   yarn lint       # Check code quality
   ```

---

## Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Deploy:**

   ```bash
   cd nextjs-web
   vercel
   ```

3. **Set Environment Variables:**
   - Go to Vercel Dashboard
   - Navigate to Project Settings
   - Add environment variables:
     - `NEXT_PUBLIC_API_BASE_URL`
     - `NEXT_PUBLIC_DMS_API_BASE_URL`

### Option 2: Docker

1. **Create Dockerfile:**

   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package.json yarn.lock ./
   RUN yarn install --frozen-lockfile
   COPY . .
   RUN yarn build
   EXPOSE 3000
   CMD ["yarn", "start"]
   ```

2. **Build and Run:**
   ```bash
   docker build -t bpo-epassport-web .
   docker run -p 3000:3000 bpo-epassport-web
   ```

### Option 3: Traditional Server

1. **Build the Application:**

   ```bash
   cd nextjs-web
   yarn build
   ```

2. **Transfer Files:**

   - Copy entire `nextjs-web` folder to server
   - Or use git to clone on server

3. **Install Dependencies on Server:**

   ```bash
   yarn install --production
   ```

4. **Start with PM2:**
   ```bash
   npm install -g pm2
   pm2 start yarn --name "bpo-epassport" -- start
   pm2 save
   pm2 startup
   ```

### Option 4: Netlify

1. **Build Settings:**

   - Build command: `yarn build`
   - Publish directory: `.next`

2. **Environment Variables:**
   - Add in Netlify dashboard

---

## Performance Optimization

### Production Checklist

- [ ] Enable compression (gzip/brotli)
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Enable HTTP/2
- [ ] Optimize images
- [ ] Monitor with analytics
- [ ] Set up error tracking (Sentry)
- [ ] Configure rate limiting
- [ ] Enable security headers

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Security headers set
- [ ] Dependencies updated
- [ ] Secrets not in code
- [ ] Authentication timeout set

---

## Monitoring

### Recommended Tools

1. **Error Tracking:** Sentry
2. **Analytics:** Google Analytics, Plausible
3. **Performance:** Vercel Analytics, New Relic
4. **Uptime:** UptimeRobot, Pingdom
5. **Logs:** Papertrail, Loggly

---

## Backup & Maintenance

### Regular Tasks

**Weekly:**

- [ ] Check error logs
- [ ] Review analytics
- [ ] Test critical paths

**Monthly:**

- [ ] Update dependencies
- [ ] Review security alerts
- [ ] Backup database
- [ ] Check performance metrics

**Quarterly:**

- [ ] Full security audit
- [ ] Performance optimization
- [ ] User feedback review
- [ ] Feature planning

---

## Support Resources

- **Documentation:** Check README.md files
- **Issues:** Create GitHub issues
- **Email:** support@bangladeshpost.gov.bd (example)
- **Community:** Stack Overflow with `nextjs` tag

---

## Next Steps

1. ✅ Complete installation
2. ✅ Test all features
3. ⏳ Customize branding
4. ⏳ Add additional features
5. ⏳ Deploy to production
6. ⏳ Monitor and maintain

---

**Congratulations! Your Next.js application is ready to go! 🎉**

For more information, check the other documentation files:

- README.md - Complete documentation
- QUICKSTART.md - Quick start guide
- MIGRATION.md - Migration from Flutter
- STRUCTURE.md - Project structure overview
