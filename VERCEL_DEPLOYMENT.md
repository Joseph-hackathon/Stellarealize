# Stellarealize Vercel Deployment Guide 🚀

This guide will help you deploy the Stellarealize project to Vercel successfully.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository access
- Vercel account (free tier available)

## 🚀 Quick Deployment Steps

### 1. Connect to Vercel

1. **Install Vercel CLI** (optional but recommended)
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Navigate to your project directory
cd /path/to/stellarealize

# Deploy to Vercel
vercel

# Follow the prompts:
# - Link to existing project or create new one
# - Set project name (e.g., "stellarealize")
# - Confirm deployment settings
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure project settings
5. Deploy

### 3. Configure Environment Variables

After deployment, configure these environment variables in your Vercel dashboard:

#### Required Variables:
```
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_URL=https://soroban-testnet.stellar.org
```

#### Optional Variables:
```
STELLAR_BRIDGE_CONTRACT_ID=your_bridge_contract_id
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_ONE_INCH_API_KEY=your_1inch_api_key
```

### 4. Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add each variable with the appropriate values
4. Select all environments (Production, Preview, Development)
5. Save changes

## 🔧 Configuration Details

### Vercel Configuration (`vercel.json`)
The project includes a pre-configured `vercel.json` with:
- Next.js framework detection
- Environment variables setup
- Security headers
- Redirects for better UX
- Node.js 18 runtime for API functions

### Next.js Configuration (`next.config.js`)
Optimized for Vercel deployment with:
- Environment variable handling
- Image optimization settings
- TypeScript and ESLint configuration
- Build optimizations

## 🌐 Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed

## 🔄 Automatic Deployments

Vercel will automatically deploy when you:
- Push to the main branch (Production)
- Create a pull request (Preview)
- Push to any other branch (Preview)

## 🐛 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version is 18+
   - Verify TypeScript compilation

2. **Environment Variables Not Working**
   - Ensure variables start with `NEXT_PUBLIC_` for client-side access
   - Check that variables are set for all environments
   - Redeploy after adding new variables

3. **API Routes Not Working**
   - Verify API routes are in `pages/api/` directory
   - Check function timeout settings in `vercel.json`

### Debug Commands:
```bash
# Check build locally
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📊 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Function Logs**: View API function execution logs
- **Build Logs**: Monitor deployment process

## 🔒 Security

The deployment includes security headers:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## 🚀 Production Deployment

1. Ensure all environment variables are set
2. Test the application thoroughly
3. Deploy to production:
```bash
vercel --prod
```

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally with `npm run build`
4. Contact Vercel support if needed

---

**Happy Deploying! 🎉**