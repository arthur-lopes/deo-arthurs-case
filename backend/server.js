const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const enrichmentRoutes = require('./routes/enrichment');
const healthRoutes = require('./routes/health');
const openaiRoutes = require('./routes/openai');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { setupCache } = require('./middleware/cache');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL?.split(',') || ['https://your-frontend-domain.com']
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// General middleware
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Setup cache
setupCache(app);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/enrichment', enrichmentRoutes);
app.use('/api/openai', openaiRoutes);

// Health check fallback for Render compatibility
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'DEO Data Enrichment API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      enrichment: '/api/enrichment',
      docs: '/api/docs'
    },
    timestamp: new Date().toISOString()
  });
});

// API documentation
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'DEO Data Enrichment API Documentation',
    version: '1.0.0',
    endpoints: {
      'GET /api/health': 'Health check and system status',
      'POST /api/enrichment/domain': 'Enrich data for a domain',
      'POST /api/enrichment/scrape': 'Web scraping with OpenAI analysis',
      'POST /api/enrichment/serpapi': 'Google search via SerpAPI',
      'POST /api/enrichment/external': 'External APIs (Hunter, Apollo, Clearbit)',
      'GET /api/enrichment/status': 'API configuration status'
    },
    examples: {
      domain_enrichment: {
        url: 'POST /api/enrichment/domain',
        body: { domain: 'example.com' },
        response: { success: true, leads: [], companyInfo: {} }
      }
    }
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Global error handlers to prevent server crashes
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error.message);
  console.error('Stack:', error.stack);
  // Don't exit on uncaught exceptions - log and continue
  console.error('⚠️ Server continuing despite uncaught exception...');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  // Don't exit on unhandled rejections - log and continue
  console.error('⚠️ Server continuing despite unhandled rejection...');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DEO Backend API running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Log API configurations
  const apis = {
    OpenAI: !!process.env.OPENAI_API_KEY,
    SerpAPI: !!process.env.SERPAPI_KEY,
    Hunter: !!process.env.HUNTER_API_KEY,
    Apollo: !!process.env.APOLLO_API_KEY,
    Clearbit: !!process.env.CLEARBIT_API_KEY
  };
  
  console.log('🔑 API Keys configured:', apis);
});

module.exports = app; 