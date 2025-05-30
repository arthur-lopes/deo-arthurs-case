import { Lead } from '../types/Lead';
import { backendApiService } from './backendApiService';

interface ExternalApiResult {
  success: boolean;
  companyInfo?: {
    name: string;
    description: string;
    industry: string;
    size: string;
    location: string;
  };
  leads: Lead[];
  error?: string;
  source: string;
}

// Configuration for external APIs (frontend fallback)
const API_CONFIGS = {
  hunter: {
    enabled: false, // Set to true when you have API key
    apiKey: import.meta.env.VITE_HUNTER_API_KEY,
    baseUrl: 'https://api.hunter.io/v2',
    name: 'Hunter.io',
    description: 'Email finder and company data',
    corsIssue: true // Blocked by CORS in frontend
  },
  apollo: {
    enabled: false, // Set to true when you have API key
    apiKey: import.meta.env.VITE_APOLLO_API_KEY,
    baseUrl: 'https://api.apollo.io/v1',
    name: 'Apollo.io',
    description: 'B2B contact database',
    corsIssue: true // Blocked by CORS in frontend
  },
  clearbit: {
    enabled: false, // Set to true when you have API key
    apiKey: import.meta.env.VITE_CLEARBIT_API_KEY,
    baseUrl: 'https://company.clearbit.com/v2',
    name: 'Clearbit',
    description: 'Company enrichment',
    corsIssue: true // Blocked by CORS in frontend
  },
  serpapi: {
    enabled: false, // Disabled due to CORS issues
    apiKey: import.meta.env.VITE_SERPAPI_KEY,
    baseUrl: 'https://serpapi.com/search',
    name: 'SerpAPI',
    description: 'Google Search API',
    corsIssue: true // Blocked by CORS in frontend
  },
  zoominfo: {
    enabled: false, // Set to true when you have API key
    apiKey: import.meta.env.VITE_ZOOMINFO_API_KEY,
    baseUrl: 'https://api.zoominfo.com/lookup',
    name: 'ZoomInfo',
    description: 'Premium B2B data',
    corsIssue: true // Blocked by CORS in frontend
  }
};

export const enrichWithExternalApis = async (domain: string): Promise<ExternalApiResult> => {
  console.log(`🔌 Starting external API enrichment for: ${domain}`);
  
  // First, try to use the backend if available
  try {
    const isBackendAvailable = await backendApiService.isBackendAvailable();
    
    if (isBackendAvailable) {
      console.log(`🔗 Using backend for external APIs`);
      const backendResult = await backendApiService.enrichWithExternalAPIs(domain);
      
      if (backendResult.success && backendResult.leads.length > 0) {
        console.log(`✅ Backend external APIs found ${backendResult.leads.length} leads`);
        return {
          success: true,
          companyInfo: backendResult.companyInfo,
          leads: backendResult.leads,
          source: `Backend (${backendResult.metadata?.source || 'external'})`
        };
      }
    }
  } catch (error) {
    console.log(`⚠️ Backend not available, using frontend fallback:`, error);
  }
  
  // Fallback to frontend implementation (limited due to CORS)
  console.log(`🔄 Using frontend fallback for external APIs`);
  
  // Log which APIs are configured
  const configuredApis = Object.entries(API_CONFIGS)
    .filter(([_, config]) => config.enabled && config.apiKey)
    .map(([key, config]) => config.name);
  
  if (configuredApis.length > 0) {
    console.log(`📋 Configured APIs: ${configuredApis.join(', ')}`);
  } else {
    console.log(`⚠️ No external APIs configured for frontend`);
  }
  
  // Log CORS limitations
  const corsBlockedApis = Object.entries(API_CONFIGS)
    .filter(([_, config]) => config.corsIssue)
    .map(([key, config]) => config.name);
  
  if (corsBlockedApis.length > 0) {
    console.log(`🚫 CORS blocked APIs (need backend): ${corsBlockedApis.join(', ')}`);
  }
  
  // Try Hunter.io first (email finder) - CORS blocked
  if (API_CONFIGS.hunter.enabled && API_CONFIGS.hunter.apiKey) {
    console.log(`⚠️ ${API_CONFIGS.hunter.name} not available in frontend due to CORS restrictions`);
    console.log(`💡 Use backend API for ${API_CONFIGS.hunter.name} integration`);
  }
  
  // Try Apollo.io (B2B database) - CORS blocked
  if (API_CONFIGS.apollo.enabled && API_CONFIGS.apollo.apiKey) {
    console.log(`⚠️ ${API_CONFIGS.apollo.name} not available in frontend due to CORS restrictions`);
    console.log(`💡 Use backend API for ${API_CONFIGS.apollo.name} integration`);
  }
  
  // Try Clearbit (company enrichment) - CORS blocked
  if (API_CONFIGS.clearbit.enabled && API_CONFIGS.clearbit.apiKey) {
    console.log(`⚠️ ${API_CONFIGS.clearbit.name} not available in frontend due to CORS restrictions`);
    console.log(`💡 Use backend API for ${API_CONFIGS.clearbit.name} integration`);
  }
  
  // Try ZoomInfo (premium B2B data) - CORS blocked
  if (API_CONFIGS.zoominfo.enabled && API_CONFIGS.zoominfo.apiKey) {
    console.log(`⚠️ ${API_CONFIGS.zoominfo.name} not available in frontend due to CORS restrictions`);
    console.log(`💡 Use backend API for ${API_CONFIGS.zoominfo.name} integration`);
  }
  
  return {
    success: false,
    leads: [],
    error: 'External APIs require backend due to CORS restrictions. Please use the backend API.',
    source: 'frontend-limited'
  };
};

// Get API configuration status for debugging
export const getApiStatus = () => {
  return Object.entries(API_CONFIGS).map(([key, config]) => ({
    name: config.name,
    enabled: config.enabled,
    configured: !!config.apiKey && config.apiKey !== `your_${key}_api_key_here`,
    description: config.description,
    corsIssue: config.corsIssue,
    recommendation: config.corsIssue ? 'Use backend API' : 'Can be used in frontend'
  }));
};

// Helper functions for data mapping
const inferSpecialty = (position: string): string => {
  const pos = position.toLowerCase();
  if (pos.includes('engineer') || pos.includes('developer') || pos.includes('tech')) {
    return 'Technology';
  }
  if (pos.includes('sales') || pos.includes('business development')) {
    return 'Sales';
  }
  if (pos.includes('marketing')) {
    return 'Marketing';
  }
  if (pos.includes('hr') || pos.includes('human resources')) {
    return 'Human Resources';
  }
  if (pos.includes('finance') || pos.includes('accounting')) {
    return 'Finance';
  }
  if (pos.includes('operations') || pos.includes('ops')) {
    return 'Operations';
  }
  return 'General';
};

const inferSeniority = (position: string): string => {
  const pos = position.toLowerCase();
  if (pos.includes('ceo') || pos.includes('president') || pos.includes('founder') || pos.includes('chief')) {
    return 'C-Level';
  }
  if (pos.includes('director') || pos.includes('vp') || pos.includes('vice president')) {
    return 'Director';
  }
  if (pos.includes('manager') || pos.includes('lead') || pos.includes('head')) {
    return 'Manager';
  }
  if (pos.includes('senior') || pos.includes('sr.')) {
    return 'Senior';
  }
  if (pos.includes('junior') || pos.includes('jr.') || pos.includes('intern')) {
    return 'Junior';
  }
  return 'Associate';
};

// Legacy functions kept for compatibility but with CORS warnings
const enrichWithHunter = async (domain: string): Promise<ExternalApiResult> => {
  console.log(`⚠️ Hunter.io API calls are blocked by CORS in frontend`);
  console.log(`💡 Please use the backend API endpoint: POST /api/enrichment/external`);
  
  return {
    success: false,
    leads: [],
    error: 'Hunter.io requires backend due to CORS restrictions',
    source: 'Hunter.io (CORS blocked)'
  };
};

const enrichWithApollo = async (domain: string): Promise<ExternalApiResult> => {
  console.log(`⚠️ Apollo.io API calls are blocked by CORS in frontend`);
  console.log(`💡 Please use the backend API endpoint: POST /api/enrichment/external`);
  
  return {
    success: false,
    leads: [],
    error: 'Apollo.io requires backend due to CORS restrictions',
    source: 'Apollo.io (CORS blocked)'
  };
};

const enrichWithClearbit = async (domain: string): Promise<ExternalApiResult> => {
  console.log(`⚠️ Clearbit API calls are blocked by CORS in frontend`);
  console.log(`💡 Please use the backend API endpoint: POST /api/enrichment/external`);
  
  return {
    success: false,
    leads: [],
    error: 'Clearbit requires backend due to CORS restrictions',
    source: 'Clearbit (CORS blocked)'
  };
};

const enrichWithZoomInfo = async (domain: string): Promise<ExternalApiResult> => {
  console.log(`⚠️ ZoomInfo API calls are blocked by CORS in frontend`);
  console.log(`💡 Please use the backend API endpoint: POST /api/enrichment/external`);
  
  return {
    success: false,
    leads: [],
    error: 'ZoomInfo requires backend due to CORS restrictions',
    source: 'ZoomInfo (CORS blocked)'
  };
};

// Export backend service for direct access
export { backendApiService }; 