# Stellarealize Deployment Guide

This guide will help you deploy Stellarealize to Vercel and set up your live DeFi platform.

## 🚀 Quick Deployment

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/stellarealize)

### Option 2: Manual Deployment

1. **Fork or Clone the Repository**
```bash
git clone https://github.com/your-username/stellarealize.git
cd stellarealize
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set Up Environment Variables**
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

4. **Test Locally**
```bash
npm run dev
```

5. **Deploy to Vercel**
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_ONE_INCH_API_KEY` | 1inch API key for swap functionality | `your_1inch_api_key` |
| `STELLAR_NETWORK` | Stellar network to use | `TESTNET` or `MAINNET` |
| `STELLAR_RPC_URL` | Stellar Horizon RPC endpoint | `https://horizon-testnet.stellar.org` |
| `SOROBAN_RPC_URL` | Soroban RPC endpoint | `https://soroban-testnet.stellar.org` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Your app's URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Stellarealize` |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Google Analytics ID | - |
| `NEXT_PUBLIC_MIXPANEL_TOKEN` | Mixpanel analytics token | - |

## 🔑 Getting API Keys

### 1inch API Key

1. Visit [1inch Developer Portal](https://portal.1inch.dev/)
2. Sign up for an account
3. Create a new API key
4. Copy the key to your environment variables

### Stellar Network Setup

For **Testnet** (recommended for development):
- Network: `TESTNET`
- Horizon URL: `https://horizon-testnet.stellar.org`
- Soroban URL: `https://soroban-testnet.stellar.org`

For **Mainnet** (production):
- Network: `MAINNET`
- Horizon URL: `https://horizon.stellar.org`
- Soroban URL: `https://soroban-rpc.mainnet.stellar.gateway.fm`

## 🌐 Vercel Configuration

The project includes a `vercel.json` file with optimal settings:

```json
{
  "framework": "nextjs",
  "regions": ["iad1", "sfo1"],
  "env": {
    "STELLAR_NETWORK": "TESTNET"
  }
}
```

### Custom Domain Setup

1. **Add Domain in Vercel Dashboard**
   - Go to your project settings
   - Navigate to "Domains"
   - Add your custom domain

2. **Configure DNS**
   - Add a CNAME record pointing to `cname.vercel-dns.com`
   - Or add A records pointing to Vercel's IP addresses

3. **SSL Certificate**
   - Vercel automatically provides SSL certificates
   - Wait for DNS propagation (can take up to 48 hours)

## 📊 Performance Optimization

### Build Optimization

The project is configured for optimal performance:

- **Static Generation**: Pre-rendered pages for faster loading
- **Image Optimization**: Automatic image optimization by Next.js
- **Bundle Analysis**: Use `npm run analyze` to analyze bundle size
- **Tree Shaking**: Unused code is automatically removed

### Database and Caching

For production deployment, consider:

- **Redis**: For caching API responses
- **Database**: PostgreSQL for storing user data and analytics
- **CDN**: Vercel Edge Network for global content delivery

## 🔒 Security Considerations

### Environment Variables

- **Never commit** `.env.local` or `.env.production`
- Use Vercel's environment variable management
- Set different keys for development and production

### API Security

- **Rate Limiting**: Implement rate limiting for API endpoints
- **CORS**: Configure proper CORS headers
- **Authentication**: Implement user authentication for sensitive operations

### Smart Contract Security

- **Audit**: Have smart contracts professionally audited
- **Testnet First**: Always test on testnet before mainnet
- **Gradual Rollout**: Start with limited functionality

## 📈 Monitoring and Analytics

### Application Monitoring

Set up monitoring for:

- **Error Tracking**: Sentry or similar service
- **Performance**: Web vitals and loading times
- **Uptime**: Monitor application availability
- **API Usage**: Track 1inch API usage and limits

### Business Analytics

Track important metrics:

- **TVL (Total Value Locked)**
- **Trading Volume**
- **User Growth**
- **Transaction Success Rate**

## 🚨 Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check Node.js version (18+ required)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variable Issues**
   - Ensure all required variables are set
   - Check variable names for typos
   - Verify API keys are valid

3. **API Integration Problems**
   - Check 1inch API rate limits
   - Verify Stellar network connectivity
   - Test API keys in development first

### Debug Mode

Enable debug logging:

```bash
DEBUG=true npm run dev
```

## 🔄 Continuous Deployment

### GitHub Integration

1. **Connect Repository**
   - Link your GitHub repository to Vercel
   - Enable automatic deployments

2. **Branch Protection**
   - Set up branch protection rules
   - Require PR reviews for main branch

3. **Preview Deployments**
   - Every PR gets a preview deployment
   - Test changes before merging

### Deployment Pipeline

Recommended workflow:

1. **Development**: Deploy to preview environment
2. **Staging**: Deploy to staging environment for testing
3. **Production**: Deploy to production after approval

## 📞 Support

If you encounter issues during deployment:

1. **Check Documentation**: Review this guide and README
2. **GitHub Issues**: Create an issue in the repository
3. **Discord**: Join our Discord community
4. **Email**: Contact support@stellarealize.com

## 🎯 Post-Deployment Checklist

After successful deployment:

- [ ] Test all major functionality
- [ ] Verify API integrations work
- [ ] Check responsive design on mobile
- [ ] Test cross-chain swaps
- [ ] Monitor error rates
- [ ] Set up analytics
- [ ] Configure monitoring alerts
- [ ] Update documentation
- [ ] Announce to community

---

**🌟 Congratulations! Your Stellarealize platform is now live!**

Remember to:
- Monitor performance and errors
- Keep dependencies updated
- Regularly backup data
- Stay updated with Stellar and 1inch API changes