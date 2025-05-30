// Environment configuration
export const config = {
  // OpenAI Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'sk-your-openai-api-key-here',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    maxTokens: 2000,
    temperature: 0.3,
  },

  // Authentication
  auth: {
    adminUser: import.meta.env.VITE_ADMIN_USER || 'deo-case',
    adminPass: import.meta.env.VITE_ADMIN_PASS || 'admin123',
    jwtSecret: import.meta.env.VITE_JWT_SECRET || 'your-jwt-secret-key-here',
  },

  // Application Settings
  app: {
    nodeEnv: import.meta.env.NODE_ENV || 'development',
    appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  },

  // Rate Limiting
  rateLimit: {
    maxRequests: parseInt(import.meta.env.VITE_RATE_LIMIT_MAX_REQUESTS || '100'),
    windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW_MS || '900000'),
  },

  // File Upload Limits
  upload: {
    maxFileSizeMB: parseInt(import.meta.env.VITE_MAX_FILE_SIZE_MB || '5'),
    maxLeadsPerFile: parseInt(import.meta.env.VITE_MAX_LEADS_PER_FILE || '1000'),
  },

  // Domain Enrichment Settings
  domainEnrichment: {
    enabled: import.meta.env.VITE_DOMAIN_ENRICHMENT_ENABLED !== 'false',
    mockDataEnabled: import.meta.env.VITE_MOCK_DATA_ENABLED !== 'false',
  },

  // Features
  features: {
    openaiIntegration: import.meta.env.VITE_OPENAI_API_KEY && 
                      import.meta.env.VITE_OPENAI_API_KEY !== 'sk-your-openai-api-key-here',
    domainEnrichment: true,
    csvUpload: true,
    dataVisualization: true,
  }
};

export default config; 