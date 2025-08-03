# Stellarealize Deployment Guide 🚀

This guide covers deploying Stellarealize to various platforms with proper configuration for Stellar Network integration.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository access
- Environment variables configured
- Stellar Network API access (optional)

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the root directory:

```env
# Stellar Network Configuration
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_URL=https://soroban-testnet.stellar.org

# Bridge Configuration (Optional)
STELLAR_BRIDGE_CONTRACT_ID=your_bridge_contract_id

# Analytics Configuration (Optional)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# API Keys (Optional)
NEXT_PUBLIC_ONE_INCH_API_KEY=your_1inch_api_key
```

### Environment Variable Descriptions

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_STELLAR_NETWORK` | Stellar network to use | Yes | `testnet` |
| `NEXT_PUBLIC_HORIZON_URL` | Stellar Horizon API URL | Yes | Testnet URL |
| `NEXT_PUBLIC_SOROBAN_URL` | Soroban RPC URL | Yes | Testnet URL |
| `STELLAR_BRIDGE_CONTRACT_ID` | Bridge contract ID | No | - |
| `NEXT_PUBLIC_ANALYTICS_ID` | Analytics tracking ID | No | - |
| `NEXT_PUBLIC_ONE_INCH_API_KEY` | 1inch API key | No | - |

## 🚀 Deployment Options

### 1. Vercel Deployment (Recommended)

Vercel provides the best experience for Next.js applications with automatic deployments.

#### Setup Steps

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy to Vercel**
```bash
vercel
```

4. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add all environment variables from `.env.local`

5. **Deploy to Production**
```bash
vercel --prod
```

#### Vercel Configuration

Create a `vercel.json` file for custom configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

### 2. Docker Deployment

#### Dockerfile

Create a `Dockerfile` in the root directory:

```dockerfile
# Use the official Node.js runtime as the base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  stellarealize:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_STELLAR_NETWORK=testnet
      - NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
      - NEXT_PUBLIC_SOROBAN_URL=https://soroban-testnet.stellar.org
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

#### Build and Run

```bash
# Build the Docker image
docker build -t stellarealize .

# Run with Docker Compose
docker-compose up -d

# Or run directly with Docker
docker run -p 3000:3000 stellarealize
```

### 3. Manual Server Deployment

#### Prerequisites

- Ubuntu 20.04+ server
- Nginx installed
- PM2 for process management

#### Setup Steps

1. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install PM2**
```bash
npm install -g pm2
```

3. **Clone the repository**
```bash
git clone https://github.com/your-org/stellarealize.git
cd stellarealize
```

4. **Install dependencies**
```bash
npm install
```

5. **Build the application**
```bash
npm run build
```

6. **Start with PM2**
```bash
pm2 start npm --name "stellarealize" -- start
pm2 save
pm2 startup
```

#### Nginx Configuration

Create `/etc/nginx/sites-available/stellarealize`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/stellarealize /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. AWS Deployment

#### Using AWS Amplify

1. **Connect your repository to AWS Amplify**
2. **Configure build settings**:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### Using AWS ECS

1. **Create ECS cluster**
2. **Build and push Docker image to ECR**
3. **Create ECS service with the Docker image**
4. **Configure load balancer**

### 5. Google Cloud Platform

#### Using Cloud Run

1. **Build and push Docker image**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/stellarealize
```

2. **Deploy to Cloud Run**
```bash
gcloud run deploy stellarealize \
  --image gcr.io/PROJECT_ID/stellarealize \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🔒 Security Configuration

### HTTPS Setup

#### Let's Encrypt (Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### Manual SSL Certificate

1. **Generate SSL certificate**
2. **Update Nginx configuration**
3. **Redirect HTTP to HTTPS**

### Security Headers

Add security headers to your Next.js configuration:

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

## 📊 Monitoring and Analytics

### Health Check Endpoint

Create `pages/api/health.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  })
}
```

### Performance Monitoring

#### Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to your app:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

#### Custom Monitoring

Create monitoring endpoints for:
- Stellar Network connectivity
- API response times
- Error rates
- User activity

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
      env:
        NEXT_PUBLIC_STELLAR_NETWORK: ${{ secrets.STELLAR_NETWORK }}
        NEXT_PUBLIC_HORIZON_URL: ${{ secrets.HORIZON_URL }}
        NEXT_PUBLIC_SOROBAN_URL: ${{ secrets.SOROBAN_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
- Check Node.js version (requires 18+)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

#### Environment Variables
- Ensure all required variables are set
- Check variable names (case-sensitive)
- Verify network URLs are accessible

#### Stellar Network Issues
- Test network connectivity
- Verify Horizon API endpoints
- Check Soroban RPC availability

#### Performance Issues
- Enable Next.js optimizations
- Use CDN for static assets
- Implement caching strategies

### Debug Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Verify environment variables
npm run dev -- --debug

# Test Stellar connectivity
curl https://horizon-testnet.stellar.org/ledgers?limit=1

# Check application logs
pm2 logs stellarealize
```

## 📞 Support

For deployment issues:
- Check the [troubleshooting section](#-troubleshooting)
- Review [GitHub Issues](https://github.com/your-org/stellarealize/issues)
- Contact support: support@stellarealize.com

---

**Happy Deploying! 🚀**