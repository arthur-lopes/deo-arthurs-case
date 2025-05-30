# ✅ Deployment Checklist - DEO Platform

Use this checklist to ensure a successful deployment to Render.com.

## 📋 Pre-Deployment Checklist

### 🔧 Repository Setup
- [ ] All code committed to GitHub
- [ ] `render.yaml` file present in root
- [ ] Environment files created (`env.production`)
- [ ] `.gitignore` properly configured
- [ ] `package.json` scripts updated for production
- [ ] README.md updated with deployment info

### 🔑 API Keys & Credentials
- [ ] OpenAI API Key obtained and tested
- [ ] SerpAPI Key (optional) obtained
- [ ] Hunter.io API Key (optional) obtained
- [ ] Apollo.io API Key (optional) obtained
- [ ] Clearbit API Key (optional) obtained
- [ ] All keys tested locally
- [ ] Keys have sufficient credits/quota

### 🏗️ Build Verification
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend starts without errors (`npm start`)
- [ ] All dependencies installed correctly
- [ ] No TypeScript errors
- [ ] No ESLint errors (critical)

## 🚀 Render.com Setup

### 1. Account & Repository
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] Repository access granted
- [ ] Billing method configured (if using paid features)

### 2. Service Creation
- [ ] Blueprint deployed from `render.yaml` OR
- [ ] Backend Web Service created manually
- [ ] Frontend Static Site created manually
- [ ] Services linked correctly

### 3. Environment Variables Configuration

#### Backend Service (`deo-backend`)
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `FRONTEND_URL=https://deo-frontend.onrender.com` (update after frontend deploy)
- [ ] `OPENAI_API_KEY` (your real key)
- [ ] `SERPAPI_KEY` (optional)
- [ ] `HUNTER_API_KEY` (optional)
- [ ] `APOLLO_API_KEY` (optional)
- [ ] `CLEARBIT_API_KEY` (optional)
- [ ] `RATE_LIMIT_WINDOW_MS=900000`
- [ ] `RATE_LIMIT_MAX_REQUESTS=100`

#### Frontend Service (`deo-frontend`)
- [ ] `VITE_BACKEND_URL=https://deo-backend.onrender.com` (update after backend deploy)
- [ ] `VITE_OPENAI_API_KEY` (optional, for frontend-only features)
- [ ] `VITE_SERPAPI_KEY` (optional)

### 4. Build Configuration
- [ ] Backend build command: `cd backend && npm install`
- [ ] Backend start command: `cd backend && npm start`
- [ ] Frontend build command: `npm install && npm run build`
- [ ] Frontend publish directory: `dist`

## 🔍 Deployment Verification

### 1. Build Process
- [ ] Backend build completed successfully
- [ ] Frontend build completed successfully
- [ ] No build errors in logs
- [ ] Services show "Live" status

### 2. Health Checks
- [ ] Backend health check: `https://deo-backend.onrender.com/api/health`
- [ ] Frontend loads: `https://deo-frontend.onrender.com`
- [ ] API docs accessible: `https://deo-backend.onrender.com/api/docs`
- [ ] All endpoints responding correctly

### 3. Functionality Testing
- [ ] Domain search working
- [ ] Email enrichment functional
- [ ] CSV upload and processing
- [ ] API calls between frontend/backend
- [ ] Error handling working
- [ ] Rate limiting functional

### 4. Performance Checks
- [ ] Frontend loads in < 3 seconds
- [ ] API responses in < 5 seconds
- [ ] Images and assets loading correctly
- [ ] No console errors
- [ ] Mobile responsiveness working

## 🛠️ Post-Deployment Configuration

### 1. URL Updates
- [ ] Update `FRONTEND_URL` in backend environment variables
- [ ] Update `VITE_BACKEND_URL` in frontend environment variables
- [ ] Test cross-service communication
- [ ] Verify CORS configuration

### 2. DNS & Domain (Optional)
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] DNS propagation complete
- [ ] Redirects working correctly

### 3. Monitoring Setup
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring set up
- [ ] Log monitoring configured

## 🐛 Troubleshooting Common Issues

### Build Failures
- [ ] Check Node.js version compatibility (18+)
- [ ] Verify all dependencies in package.json
- [ ] Check for TypeScript errors
- [ ] Verify build scripts

### Runtime Errors
- [ ] Check environment variables are set
- [ ] Verify API keys are correct
- [ ] Check CORS configuration
- [ ] Review service logs

### Performance Issues
- [ ] Check rate limiting configuration
- [ ] Verify caching setup
- [ ] Monitor memory usage
- [ ] Check for infinite loops

## 📊 Success Metrics

After deployment, verify these metrics:

### Technical
- [ ] Uptime > 99%
- [ ] Response time < 2s average
- [ ] Error rate < 1%
- [ ] Build time < 5 minutes

### Functional
- [ ] All API endpoints working
- [ ] Frontend fully functional
- [ ] Data processing accurate
- [ ] File uploads working

## 🔄 Ongoing Maintenance

### Weekly
- [ ] Check service health
- [ ] Review error logs
- [ ] Monitor API usage
- [ ] Check performance metrics

### Monthly
- [ ] Update dependencies
- [ ] Review API key usage
- [ ] Check billing/costs
- [ ] Performance optimization

## 📞 Emergency Contacts

- **Render Support**: [render.com/docs](https://render.com/docs)
- **OpenAI Status**: [status.openai.com](https://status.openai.com)
- **Repository Issues**: GitHub Issues tab

---

## ✅ Final Checklist

Before marking deployment as complete:

- [ ] All services running and healthy
- [ ] Full end-to-end testing completed
- [ ] Performance metrics within targets
- [ ] Documentation updated
- [ ] Team notified of new URLs
- [ ] Monitoring configured
- [ ] Backup/rollback plan ready

**Deployment Status**: ⏳ In Progress | ✅ Complete | ❌ Failed

**Deployed by**: _______________
**Date**: _______________
**Notes**: _______________ 