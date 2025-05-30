import { Lead } from '../types/Lead';

interface BackendResponse {
  success: boolean;
  companyInfo?: {
    name: string;
    description: string;
    industry: string;
    size: string;
    location: string;
  };
  leads: Lead[];
  metadata?: {
    domain: string;
    source: string;
    timestamp: string;
    processingTime: number;
    cached?: boolean;
  };
  error?: string;
}

class BackendApiService {
  private baseUrl: string;
  private isAvailable: boolean;

  constructor() {
    this.baseUrl = 'http://localhost:3001';
    this.isAvailable = false;
  }

  // Helper function for fetch with custom timeout
  private async fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 30000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async enrichDomain(domain: string): Promise<BackendResponse> {
    console.log(`🔗 Calling backend API for domain: ${domain}`);
    
    try {
      // Extended timeout for domain enrichment (130 seconds - margin over backend 120s)
      const response = await this.fetchWithTimeout(`${this.baseUrl}/api/enrichment/domain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain })
      }, 130000); // 130 seconds timeout

      // Parse response data regardless of status code
      const data = await response.json();

      // For enrichment endpoints, 404 is a valid response meaning "no data found"
      if (response.status === 404) {
        console.log(`ℹ️ Backend API - no data found for domain: ${domain}`, data);
        return {
          success: false,
          leads: [],
          error: data.error || 'No data found for this domain',
          metadata: data.metadata || {
            domain,
            timestamp: new Date().toISOString(),
            source: 'backend-404'
          }
        };
      }

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }

      console.log(`✅ Backend API response:`, {
        success: data.success,
        leadsCount: data.leads?.length || 0,
        source: data.metadata?.source,
        cached: data.metadata?.cached
      });

      return data;

    } catch (error) {
      console.error(`❌ Backend API failed for ${domain}:`, error);
      throw error;
    }
  }

  async enrichWithOpenAI(domain: string): Promise<BackendResponse> {
    console.log(`🤖 Calling backend OpenAI service for: ${domain}`);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/enrichment/openai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain })
      });

      const data = await response.json();

      if (response.status === 404) {
        console.log(`ℹ️ Backend OpenAI - no data found for domain: ${domain}`, data);
        return {
          success: false,
          leads: [],
          error: data.error || 'No data found via OpenAI',
          metadata: data.metadata || { domain, source: 'openai-404' }
        };
      }

      if (!response.ok) {
        throw new Error(`Backend OpenAI API error: ${response.status}`);
      }

      return data;

    } catch (error) {
      console.error(`❌ Backend OpenAI API failed for ${domain}:`, error);
      throw error;
    }
  }

  async enrichWithScraping(domain: string): Promise<BackendResponse> {
    console.log(`🕷️ Calling backend scraping service for: ${domain}`);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/enrichment/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain })
      });

      const data = await response.json();

      if (response.status === 404) {
        console.log(`ℹ️ Backend scraping - no data found for domain: ${domain}`, data);
        return {
          success: false,
          leads: [],
          error: data.error || 'No data found via web scraping',
          metadata: data.metadata || { domain, source: 'scraping-404' }
        };
      }

      if (!response.ok) {
        throw new Error(`Backend scraping API error: ${response.status}`);
      }

      return data;

    } catch (error) {
      console.error(`❌ Backend scraping API failed for ${domain}:`, error);
      throw error;
    }
  }

  async enrichWithSerpAPI(domain: string): Promise<BackendResponse> {
    console.log(`🔍 Calling backend SerpAPI service for: ${domain}`);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/enrichment/serpapi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain })
      });

      const data = await response.json();

      if (response.status === 404) {
        console.log(`ℹ️ Backend SerpAPI - no data found for domain: ${domain}`, data);
        return {
          success: false,
          leads: [],
          error: data.error || 'No data found via SerpAPI',
          metadata: data.metadata || { domain, source: 'serpapi-404' }
        };
      }

      if (!response.ok) {
        throw new Error(`Backend SerpAPI error: ${response.status}`);
      }

      return data;

    } catch (error) {
      console.error(`❌ Backend SerpAPI failed for ${domain}:`, error);
      throw error;
    }
  }

  async enrichWithExternalAPIs(domain: string): Promise<BackendResponse> {
    console.log(`🔌 Calling backend external APIs for: ${domain}`);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/enrichment/external`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain })
      });

      const data = await response.json();

      if (response.status === 404) {
        console.log(`ℹ️ Backend external APIs - no data found for domain: ${domain}`, data);
        return {
          success: false,
          leads: [],
          error: data.error || 'No data found via external APIs',
          metadata: data.metadata || { domain, source: 'external-404' }
        };
      }

      if (!response.ok) {
        throw new Error(`Backend external APIs error: ${response.status}`);
      }

      return data;

    } catch (error) {
      console.error(`❌ Backend external APIs failed for ${domain}:`, error);
      throw error;
    }
  }

  async getApiStatus(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/enrichment/status`);
      
      if (!response.ok) {
        throw new Error(`Status API error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Failed to get API status:', error);
      throw error;
    }
  }

  async getHealthCheck(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health/detailed`);
      
      if (!response.ok) {
        throw new Error(`Health check error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Health check failed:', error);
      throw error;
    }
  }

  async getCacheStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/cache/stats`);
      
      if (!response.ok) {
        throw new Error(`Cache stats error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Failed to get cache stats:', error);
      throw error;
    }
  }

  async clearCache(pattern?: string): Promise<any> {
    try {
      const url = pattern 
        ? `${this.baseUrl}/api/cache/clear?pattern=${encodeURIComponent(pattern)}`
        : `${this.baseUrl}/api/cache/clear`;
        
      const response = await fetch(url, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Clear cache error: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
      throw error;
    }
  }

  // Check if backend is available
  async isBackendAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        timeout: 5000
      } as any);
      
      return response.ok;
    } catch (error) {
      console.log('🔗 Backend not available, using frontend fallback');
      return false;
    }
  }

  getBackendUrl(): string {
    return this.baseUrl;
  }
}

export const backendApiService = new BackendApiService(); 