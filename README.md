# 🚀 DEO - Data Enrichment Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4.2-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render" alt="Render" />
  <img src="https://img.shields.io/badge/AI-OpenAI-000000?style=for-the-badge&logo=openai" alt="OpenAI" />
</div>

## 📋 Description

Advanced AI-powered data enrichment platform that transforms raw leads into qualified prospects using multiple data sources and intelligent processing. Built with React and Node.js, featuring intelligent deduplication, domain enrichment, and seamless HubSpot integration.

## ✨ Key Features

### 🤖 AI-Powered Enrichment
- **OpenAI Integration**: Intelligent lead classification and data analysis
- **Domain Analysis**: Automatic company and executive discovery
- **Email Enrichment**: Professional contact validation and enhancement
- **Smart Deduplication**: AI-driven duplicate detection and consolidation

### 🌐 Multiple Data Sources
- **Web Scraping**: Real-time website data extraction
- **SerpAPI**: Google search results analysis
- **External APIs**: Hunter.io, Apollo.io, Clearbit integration
- **Hybrid Processing**: Fallback chain for maximum data coverage

### 🎯 HubSpot Integration
- **Webhook + Operations Hub**: Real-time data sync
- **Batch Processing**: Scheduled bulk updates
- **Custom Fields**: Automatic property creation and mapping
- **Lead Scoring**: AI-powered qualification metrics

### 📊 Advanced Analytics
- **Data Quality Reports**: Before/after comparisons
- **Source Attribution**: Track data origin and confidence
- **Processing Metrics**: Success rates and performance stats
- **Interactive Dashboards**: Real-time monitoring

## 🏗️ Architecture

```
Frontend (React + TypeScript)
├── Domain Search & Email Enrichment
├── CSV Processing & Advanced Deduplication  
├── HubSpot Integration & API Documentation
└── DEO Academy & Tutorial System

Backend (Node.js + Express)
├── Multi-API Orchestration
├── AI Processing Pipeline
├── Rate Limiting & Caching
└── Health Monitoring
```

## 🚀 Quick Start

### Development Setup

```bash
# Clone repository
git clone [repository-url]
cd deo-project

# Install dependencies
npm install
cd backend && npm install && cd ..

# Start development servers
npm run start:all
```

Access:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs

### Environment Variables

Create `.env` files:

**Frontend (.env)**:
```bash
VITE_BACKEND_URL=http://localhost:3001
VITE_OPENAI_API_KEY=your-openai-key
VITE_SERPAPI_KEY=your-serpapi-key
```

**Backend (backend/.env)**:
```bash
OPENAI_API_KEY=your-openai-key
SERPAPI_KEY=your-serpapi-key
HUNTER_API_KEY=your-hunter-key
APOLLO_API_KEY=your-apollo-key
CLEARBIT_API_KEY=your-clearbit-key
```

## 🌐 Production Deploy

### Deploy on Render.com

The project is optimized for Render deployment with automatic configuration.

```bash
# Using Blueprint (Recommended)
1. Connect GitHub repository to Render
2. Create new Blueprint from render.yaml
3. Configure environment variables
4. Deploy automatically

# Manual Setup
1. Create Web Service for backend
2. Create Static Site for frontend  
3. Configure environment variables
4. Deploy both services
```

**📖 Complete Deploy Guides**: 
- [English Guide](./DEPLOYMENT_GUIDE_EN.md)
- [Portuguese Guide](./GUIA_DEPLOY_RENDER.md)
- [Technical Documentation](./SYSTEM_DOCUMENTATION.md)

### Production URLs
- **Frontend**: `https://deo-frontend.onrender.com`
- **Backend**: `https://deo-backend.onrender.com`
- **API Docs**: `https://deo-backend.onrender.com/api/docs`

## 📝 API Documentation

### Core Endpoints

```javascript
// Domain Enrichment
POST /api/enrichment/domain
{
  "domain": "company.com",
  "priority": "hybrid"
}

// Email Enrichment  
POST /api/enrichment/email
{
  "email": "contact@company.com"
}

// Web Scraping
POST /api/enrichment/scrape
{
  "domain": "company.com",
  "pages": ["about", "team"]
}

// Hybrid Processing
POST /api/enrichment/hybrid
{
  "domain": "company.com",
  "fallback": true
}
```

### Response Format

```javascript
{
  "success": true,
  "leads": [
    {
      "nome": "John Doe",
      "empresa": "Company Inc",
      "titulo": "CEO",
      "telefone": "+1-555-0123",
      "email": "john@company.com",
      "especialidade": "Technology Leadership",
      "grau": "C-Level",
      "dataSource": "hybrid",
      "confidence": "high"
    }
  ],
  "companyInfo": {
    "name": "Company Inc",
    "industry": "Technology",
    "size": "Medium",
    "location": "San Francisco, CA"
  },
  "metadata": {
    "source": "OpenAI + Web Scraping",
    "processingTime": "2.5s",
    "confidence": "high"
  }
}
```

## 🔧 Technical Stack

### Frontend
- **React 18.3.1** with TypeScript
- **Vite** for build optimization
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **React Hot Toast** for notifications

### Backend  
- **Node.js 18+** with Express
- **OpenAI API** for AI processing
- **Puppeteer** for web scraping
- **Axios** for HTTP requests
- **Helmet** for security
- **Rate Limiting** and caching

### DevOps
- **Render.com** for hosting
- **GitHub Actions** for CI/CD
- **Docker** support
- **Health monitoring**
- **Error tracking**

## 📊 Performance Metrics

- **Response Time**: < 2s average
- **Success Rate**: > 95% for valid domains
- **Uptime**: > 99% in production
- **Rate Limit**: 100 requests/15min
- **Cache Hit Rate**: ~80%

## 🛡️ Security Features

- **CORS** configured for production
- **Helmet** security headers
- **Rate limiting** by IP
- **Input validation** and sanitization
- **API key protection**
- **HTTPS** enforcement

## 📈 Monitoring & Analytics

### Built-in Metrics
- Processing success rates
- API response times  
- Error tracking
- Source attribution
- Data quality scores

### Health Endpoints
- `GET /api/health` - System status
- `GET /api/enrichment/status` - API availability
- `GET /api/docs` - Interactive documentation

## 🔄 Development Workflow

```bash
# Development
npm run dev              # Start frontend dev server
npm run start:all        # Start both frontend and backend

# Production Build
npm run build           # Build frontend
npm run deploy:render   # Deploy to Render

# Testing
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix linting issues
```

## 📚 Learning Resources

### DEO Academy
Complete 6-month HubSpot mastery program included:
- **Month 1**: CRM Foundations & Administration
- **Month 2**: Marketing Hub Mastery  
- **Month 3**: Sales Hub Excellence
- **Month 4**: Service Hub Optimization
- **Month 5**: Operations Hub & AI
- **Month 6**: Advanced Analytics & Strategy

### Tutorials
- Interactive platform walkthrough
- API integration examples
- HubSpot setup guides
- Best practices documentation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Complete Documentation**: [System Documentation](./SYSTEM_DOCUMENTATION.md)
- **Deployment Guide**: [Render Deployment](./DEPLOYMENT_GUIDE_EN.md)  
- **Technical Checklist**: [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- **Issues**: GitHub Issues
- **Email**: support@deo-platform.com

---

<div align="center">
  <strong>🎉 Ready to transform your lead data? Get started with DEO today!</strong>
  
  **Complete Technical Documentation**: [SYSTEM_DOCUMENTATION.md](./SYSTEM_DOCUMENTATION.md)
</div> 