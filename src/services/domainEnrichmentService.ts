import { Lead } from '../types/Lead';
import { backendApiService } from './backendApiService';
import { scrapeCompanyData } from './webScrapingService';
import { enrichWithExternalApis } from './externalApiService';
import { searchWithSerpApi } from './serpApiService';

// OpenAI configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface DomainEnrichmentResult {
  success: boolean;
  leads: Lead[];
  error?: string;
  companyInfo?: {
    name: string;
    description: string;
    industry: string;
    size: string;
    location: string;
  };
  metadata?: {
    source: string;
    cached?: boolean;
    processingTime?: number;
    attempted_methods?: string[];
  };
}

export const enrichFromDomain = async (domain: string): Promise<DomainEnrichmentResult> => {
  // Clean and validate domain
  const cleanDomain = cleanDomainInput(domain);
  
  if (!cleanDomain) {
    return {
      success: false,
      leads: [],
      error: 'Invalid domain. Please enter a valid domain (e.g.: company.com)'
    };
  }

  console.log(`🔍 Starting enrichment for domain: ${cleanDomain}`);

  // First, try to use the backend if available
  try {
    const isBackendAvailable = await backendApiService.isBackendAvailable();
    
    if (isBackendAvailable) {
      console.log(`🔗 Backend available, using backend API for: ${cleanDomain}`);
      const backendResult = await backendApiService.enrichDomain(cleanDomain);
      
      if (backendResult.success && backendResult.leads.length > 0) {
        console.log(`✅ Backend enrichment successful for: ${cleanDomain}`);
        return {
          success: true,
          leads: backendResult.leads,
          companyInfo: backendResult.companyInfo,
          metadata: {
            source: `Backend (${backendResult.metadata?.source || 'mixed'})`,
            cached: backendResult.metadata?.cached,
            processingTime: backendResult.metadata?.processingTime
          }
        };
      } else {
        console.log(`⚠️ Backend enrichment failed, falling back to frontend: ${backendResult.error}`);
      }
    } else {
      console.log(`🔄 Backend not available, using frontend fallback for: ${cleanDomain}`);
    }
  } catch (error) {
    console.log(`⚠️ Backend error, using frontend fallback:`, error);
  }

  // Fallback to frontend implementation
  console.log(`🔄 Using frontend enrichment for: ${cleanDomain}`);

  try {
    // Debug: Log the API key status (without exposing the actual key)
    console.log('Frontend API Key status:', {
      exists: !!OPENAI_API_KEY,
      length: OPENAI_API_KEY?.length || 0,
      startsWithSk: OPENAI_API_KEY?.startsWith('sk-') || false,
      isDefault: OPENAI_API_KEY === 'sk-your-openai-api-key-here' || OPENAI_API_KEY === 'sk-your-openai-api-key-here-ok'
    });

    // Check if OpenAI API key is configured and valid
    if (!OPENAI_API_KEY || 
        OPENAI_API_KEY.trim() === '' ||
        OPENAI_API_KEY === 'sk-your-openai-api-key-here' || 
        OPENAI_API_KEY === 'sk-your-openai-api-key-here-ok' ||
        !OPENAI_API_KEY.startsWith('sk-')) {
      
      console.warn('OpenAI API key not properly configured. Trying alternative methods.');
      console.warn('To use the real OpenAI API:');
      console.warn('1. Configure VITE_OPENAI_API_KEY in the .env file');
      console.warn('2. Use a valid key that starts with "sk-"');
      console.warn('3. Get your key at: https://platform.openai.com/api-keys');
      console.warn('4. OR configure the backend with the API keys');
      
      // Try alternative methods without OpenAI
      return await tryAlternativeMethods(cleanDomain);
    }

    console.log(`✅ Using frontend OpenAI API to enrich domain: ${cleanDomain}`);
    
    // Call OpenAI API for domain enrichment
    const prompt = createDomainEnrichmentPrompt(cleanDomain);
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using more cost-effective model
        messages: [
          {
            role: 'system',
            content: `You are a researcher specialized in analyzing American companies. Your function is to analyze domains and extract ONLY real and verifiable information.

CRITICAL RULES:
- NEVER invent data, names, phones, emails or information
- ONLY use information that you can verify or that exists publicly
- If you cannot find real data, return empty lists
- Focus exclusively on companies in the United States
- Be extremely conservative - prefer returning empty rather than inventing

PROCESS:
1. Analyze the provided domain
2. Identify real information available about the company
3. Extract only verifiable data
4. If in doubt, do not include the data

Return only valid JSON without markdown formatting.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2, // Low temperature for factual responses
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Frontend OpenAI API error: ${response.status} - ${errorText}`);
      
      // If it's an authentication error, provide helpful message
      if (response.status === 401) {
        console.error('🔑 Authentication error: Check if your OpenAI key is correct');
        return await tryAlternativeMethods(cleanDomain);
      }
      
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    let result;
    try {
      let responseContent = data.choices[0].message.content;
      
      // Remove markdown code blocks if present
      if (responseContent.includes('```json')) {
        responseContent = responseContent.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      } else if (responseContent.includes('```')) {
        responseContent = responseContent.replace(/```\s*/g, '').replace(/```\s*$/g, '');
      }
      
      // Clean up any extra whitespace
      responseContent = responseContent.trim();
      
      result = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', data.choices[0].message.content);
      console.error('Parse error:', parseError);
      throw new Error('Invalid JSON response from OpenAI');
    }
    
    // Validate the response structure
    if (!result) {
      throw new Error('Empty response from OpenAI');
    }

    // Handle case where no real data was found
    if (!result.companyInfo && (!result.leads || result.leads.length === 0)) {
      console.log(`ℹ️ No real data found for domain: ${cleanDomain}`);
      return await tryAlternativeMethods(cleanDomain);
    }

    // Format the leads with proper structure
    const formattedLeads: Lead[] = (result.leads || []).map((lead: any, index: number) => ({
      id: `openai-lead-${index + 1}`,
      nome: lead.nome || lead.name || 'Unknown',
      empresa: result.companyInfo?.name || extractCompanyFromDomain(cleanDomain),
      titulo: lead.titulo || lead.title || 'Unknown',
      telefone: lead.telefone || lead.phone || '',
      email: lead.email || '',
      especialidade: lead.especialidade || lead.specialty || 'General',
      grau: lead.grau || lead.level || 'Associate',
      dataSource: 'openai' as const,
      enrichmentMethod: 'domain' as const,
      processedAt: new Date().toISOString()
    }));

    console.log(`✅ Frontend OpenAI found ${formattedLeads.length} leads for: ${cleanDomain}`);

    return {
      success: true,
      leads: formattedLeads,
      companyInfo: result.companyInfo || {
        name: extractCompanyFromDomain(cleanDomain),
        description: 'Company information analyzed by AI',
        industry: 'Unknown',
        size: 'Unknown',
        location: 'Unknown'
      },
      metadata: {
        source: 'Frontend OpenAI'
      }
    };

  } catch (error) {
    console.error(`❌ Frontend enrichment failed for ${cleanDomain}:`, error);
    return await tryAlternativeMethods(cleanDomain);
  }
};

// Try alternative methods when OpenAI is not available or fails
async function tryAlternativeMethods(domain: string): Promise<DomainEnrichmentResult> {
  console.log(`🔄 Trying alternative methods for: ${domain}`);
  
  // Try web scraping as fallback
  console.log(`🔄 Trying web scraping as fallback`);
  try {
    const scrapingResult = await scrapeCompanyData(domain);
    
    if (scrapingResult.success && scrapingResult.leads.length > 0) {
      console.log(`✅ Web scraping found ${scrapingResult.leads.length} leads for: ${domain}`);
      return {
        success: true,
        leads: scrapingResult.leads,
        companyInfo: scrapingResult.companyInfo || {
          name: extractCompanyFromDomain(domain),
          description: 'Information found via web scraping',
          industry: 'Unknown',
          size: 'Unknown',
          location: 'Unknown'
        },
        metadata: {
          source: 'Frontend Web Scraping'
        }
      };
    }
  } catch (scrapingError) {
    console.error('Web scraping failed:', scrapingError);
  }
  
  // Try external APIs as fallback
  console.log(`🔄 Trying external APIs as fallback`);
  try {
    const externalApiResult = await enrichWithExternalApis(domain);
    
    if (externalApiResult.success && externalApiResult.leads.length > 0) {
      console.log(`✅ External APIs (${externalApiResult.source}) found ${externalApiResult.leads.length} leads for: ${domain}`);
      return {
        success: true,
        leads: externalApiResult.leads,
        companyInfo: externalApiResult.companyInfo || {
          name: extractCompanyFromDomain(domain),
          description: `Information found via ${externalApiResult.source}`,
          industry: 'Unknown',
          size: 'Unknown',
          location: 'Unknown'
        },
        metadata: {
          source: `Frontend ${externalApiResult.source}`
        }
      };
    }
  } catch (externalError) {
    console.error('External APIs failed:', externalError);
  }
  
  // Try SerpAPI as ultimate fallback
  console.log(`🔄 Trying SerpAPI as ultimate fallback`);
  try {
    const serpApiResult = await searchWithSerpApi(domain);
    
    if (serpApiResult.success && serpApiResult.leads.length > 0) {
      console.log(`✅ SerpAPI found ${serpApiResult.leads.length} leads for: ${domain}`);
      return {
        success: true,
        leads: serpApiResult.leads,
        companyInfo: serpApiResult.companyInfo || {
          name: extractCompanyFromDomain(domain),
          description: 'Information found via Google search',
          industry: 'Unknown',
          size: 'Unknown',
          location: 'Unknown'
        },
        metadata: {
          source: 'Frontend SerpAPI'
        }
      };
    }
  } catch (serpError) {
    console.error('SerpAPI failed:', serpError);
  }
  
  // If all methods fail, return error - NO MOCK DATA
  console.log(`❌ All enrichment methods failed for: ${domain}`);
  return {
    success: false,
    leads: [],
    error: `Could not find data for domain ${domain}. All data sources returned empty results.`,
    metadata: {
      source: 'No data found',
      attempted_methods: ['openai', 'scraping', 'external_apis', 'serpapi']
    }
  };
}

// Helper function to clean domain input
function cleanDomainInput(domain: string): string {
  if (!domain) return '';
  
  // Remove protocol, www, and trailing slashes
  let cleaned = domain
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
    .trim();
  
  // Extract just the domain part if there's a path
  if (cleaned.includes('/')) {
    cleaned = cleaned.split('/')[0];
  }
  
  // Enhanced domain validation to support .com.br, .co.uk, etc.
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
  
  return domainRegex.test(cleaned) ? cleaned : '';
}

// Helper function to extract company name from domain
function extractCompanyFromDomain(domain: string): string {
  const parts = domain.split('.');
  if (parts.length > 0) {
    let companyName = parts[0];
    // Capitalize first letter
    companyName = companyName.charAt(0).toUpperCase() + companyName.slice(1);
    return companyName;
  }
  return domain;
}

// Create enrichment prompt for OpenAI
function createDomainEnrichmentPrompt(domain: string): string {
  return `
INSTRUCTION: Analyze the domain "${domain}" and provide REAL information about this company, if you have factual knowledge about it.

MANDATORY RULES:
1. ONLY provide information that you are CERTAIN is REAL and CURRENT
2. NEVER invent specific names of people, phones or emails
3. If you don't know specific contact information, return leads: []
4. Focus on known American companies
5. Use only your factual knowledge about public/known companies
6. If the company is not known, return basic information or empty

RESPONSE FORMAT (JSON only, no markdown):
{
  "companyInfo": {
    "name": "Official company name if known",
    "description": "Factual description of services/products", 
    "industry": "Company industry if known",
    "size": "Company size if known (Small/Medium/Large)",
    "location": "Main location if known"
  },
  "leads": [
    // ONLY if you know REAL information about public executives
    // Example: CEOs of known public companies
    {
      "nome": "REAL name of publicly known executive",
      "titulo": "REAL publicly known position", 
      "telefone": "", // Leave empty - don't invent
      "email": "", // Leave empty - don't invent
      "especialidade": "Specialty based on company industry",
      "grau": "Hierarchical level based on position"
    }
  ]
}

EXAMPLES OF KNOWN COMPANIES:
- microsoft.com: Microsoft Corporation, Satya Nadella (CEO)
- google.com: Google LLC, Sundar Pichai (CEO)
- apple.com: Apple Inc., Tim Cook (CEO)
- amazon.com: Amazon.com Inc., Andy Jassy (CEO)

IMPORTANT: If "${domain}" is not a publicly known company, return:
{
  "companyInfo": {
    "name": "Name based on domain",
    "description": null,
    "industry": null,
    "size": null,
    "location": null
  },
  "leads": []
}

Now analyze the domain "${domain}" and provide only REAL and verifiable information.
`;
} 